/*
 * Builds src/content/chalkidiki-map.ts, the outline behind the /listings map,
 * from OpenStreetMap data (© OpenStreetMap contributors, ODbL).
 *
 * 1. Download the inputs into a folder (not committed, ~3 MB):
 *    coast.json      Overpass: [out:json];way["natural"="coastline"](39.85,22.75,40.75,24.45);out geom;
 *    chalkidiki.json Nominatim search "Chalkidiki Regional Unit", format=geojson, polygon_geojson=1, polygon_threshold=0.0015
 *    athos.json      Nominatim search "Αυτόνομη Μοναστική Πολιτεία Αγίου Όρους", same options
 * 2. node scripts/map/build-chalkidiki-map.mjs <that folder>
 *
 * The coastline gives the shape; the two admin borders (which run out to sea)
 * only cut the land off at Chalkidiki's inland border with Thessaloniki.
 */
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const coast = JSON.parse(fs.readFileSync(path.join(dir, 'coast.json'), 'utf8')).elements;
const chalk = JSON.parse(fs.readFileSync(path.join(dir, 'chalkidiki.json'), 'utf8')).features[0].geometry.coordinates;
const athos = JSON.parse(fs.readFileSync(path.join(dir, 'athos.json'), 'utf8')).features[0].geometry.coordinates;

const B = { w: 22.75, e: 24.45, s: 39.85, n: 40.75 };
const key = (p) => p[0].toFixed(7) + ',' + p[1].toFixed(7);

// 1. Join coastline ways end-to-start into chains.
let ways = coast.filter((w) => w.geometry).map((w) => w.geometry.map((g) => [g.lon, g.lat]));
const byStart = new Map(ways.map((w, i) => [key(w[0]), i]));
const used = new Set();
const chains = [];
for (let i = 0; i < ways.length; i++) {
  if (used.has(i)) continue;
  // walk back to the chain's first way
  let first = i;
  const seen = new Set([i]);
  for (;;) {
    const prev = ways.findIndex((w, j) => !used.has(j) && !seen.has(j) && key(w[w.length - 1]) === key(ways[first][0]));
    if (prev < 0) break;
    seen.add(prev);
    first = prev;
  }
  let chain = [];
  let cur = first;
  while (cur !== undefined && !used.has(cur)) {
    used.add(cur);
    chain = chain.length ? chain.concat(ways[cur].slice(1)) : ways[cur].slice();
    cur = byStart.get(key(ways[cur][ways[cur].length - 1]));
  }
  chains.push(chain);
}
const closed = chains.filter((c) => key(c[0]) === key(c[c.length - 1]));
const open = chains.filter((c) => key(c[0]) !== key(c[c.length - 1])).sort((a, b) => b.length - a.length);
console.error('chains', chains.length, 'closed', closed.length, 'open', open.length, 'longest open', open[0]?.length);

// 2. Mainland: longest open chain, closed through the bbox's northern corners (land lies north).
const main = open[0];
const s0 = main[0], s1 = main[main.length - 1];
console.error('mainland ends', s0, s1);
const ring = [...main];
// Coastline has land on the LEFT. Walk the bbox counter-clockwise from the end back to the start.
const corners = [[B.e, B.s], [B.e, B.n], [B.w, B.n], [B.w, B.s]];
const side = (p) => (Math.abs(p[0] - B.e) < 0.02 ? 0 : Math.abs(p[1] - B.n) < 0.02 ? 1 : Math.abs(p[0] - B.w) < 0.02 ? 2 : 3);
let sEnd = side(s1);
const sStart = side(s0);
for (let k = 0; k < 4 && sEnd !== sStart; k++) {
  ring.push(corners[(sEnd + 1) % 4]);
  sEnd = (sEnd + 1) % 4;
}
ring.push(s0);

// 3. Douglas–Peucker in projected space.
const k = Math.cos(40.3 * Math.PI / 180);
const S = 1000;
const P = ([x, y]) => [(x - B.w) * k * S, (B.n - y) * S];
function dp(pts, eps) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let idx = 0, max = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const d = Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / (Math.hypot(b[0] - a[0], b[1] - a[1]) || 1);
    if (d > max) { max = d; idx = i; }
  }
  return max > eps ? [...dp(pts.slice(0, idx + 1), eps).slice(0, -1), ...dp(pts.slice(idx), eps)] : [a, b];
}
const toPath = (pts, eps = 0.9) => {
  // Closed rings start and end on the same point, where DP's baseline has no length: simplify two halves.
  const pp = pts.map(P);
  const mid = Math.floor(pp.length / 2);
  const q = [...dp(pp.slice(0, mid + 1), eps).slice(0, -1), ...dp(pp.slice(mid), eps)];
  return 'M' + q.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
};
const area = (r) => { let s = 0; for (let i = 0; i < r.length - 1; i++) s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; return Math.abs(s / 2); };

// Kassandra is a closed ring too (the Potidea canal makes it an island in OSM), so land = mainland + every sizeable ring.
const islands = closed.filter((c) => area(c) > 0.00015).map((c) => toPath(c, 0.6));
const land = toPath(ring) + islands.join('');
const clip = [...chalk, ...athos].map((r) => toPath(r, 0.4)).join('');
// Region cut polygons (lon/lat), placed at the isthmuses.
const poly = (pts) => 'M' + pts.map(P).map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
const regions = {
  kassandra: poly([[22.9, 40.205], [23.6, 40.205], [23.6, 40.12], [23.75, 40.05], [23.75, 39.8], [22.9, 39.8]]),
  sithonia: poly([[23.6, 40.236], [23.8, 40.256], [24.1, 40.256], [24.1, 39.8], [23.75, 39.8], [23.75, 40.05], [23.6, 40.12]]),
  // Athos: north-east of a line along its south-west coast, so Sithonia's east coast (Sarti, ~24.0E) stays out.
  athos: poly([[23.935, 40.42], [24.6, 40.42], [24.6, 39.9], [24.2, 39.9], [24.06, 40.28], [23.935, 40.33]]),
};
const [vx1, vy1] = P([22.84, 40.63]);
const [vx2, vy2] = P([24.42, 39.89]);
const vb = { viewBox: `${vx1.toFixed(0)} ${vy1.toFixed(0)} ${(vx2 - vx1).toFixed(0)} ${(vy2 - vy1).toFixed(0)}`, land, clip, regions, proj: { w: B.w, n: B.n, k: +k.toFixed(6), S } };
const ts = `// Generated by scripts/map/build-chalkidiki-map.mjs from OpenStreetMap data
// (© OpenStreetMap contributors, ODbL). Do not edit by hand: re-run the script.

/** Equirectangular projection used by every path below: x = (lon - west) * cos(40.3°) * scale, y = (north - lat) * scale. */
export const MAP_PROJ = ${JSON.stringify(vb.proj)} as const;
export const MAP_VIEWBOX = ${JSON.stringify(vb.viewBox)};
/** Mainland coastline plus Kassandra (an island in OSM because of the Potidea canal), Ammouliani and the larger islets. */
export const MAP_LAND = ${JSON.stringify(vb.land)};
/** Chalkidiki + Mount Athos administrative borders: cuts the land at the inland border. */
export const MAP_CLIP = ${JSON.stringify(vb.clip)};
/** Cut polygons at the isthmuses (Potidea, Nikiti, Xerxes canal); the mainland is what is left. */
export const MAP_REGIONS = ${JSON.stringify(vb.regions)} as const;
`;
fs.writeFileSync(path.resolve('src/content/chalkidiki-map.ts'), ts);
console.error('land chars', land.length, 'islands', islands.length, 'clip chars', clip.length);
