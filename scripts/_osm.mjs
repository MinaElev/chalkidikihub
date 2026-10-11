import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
for (const line of fs.readFileSync('C:/Users/mnc/ReWrite/.env.local', 'utf8').split('\n')) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim()); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data } = await db.from('villages').select('slug,name_el,latitude,longitude');
const km = (a, b, c, d) => { const R = 6371, r = Math.PI / 180; const x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
const out = [];
for (const v of data) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=gr&viewbox=22.8,40.7,24.5,39.9&bounded=1&q=${encodeURIComponent(v.name_el)}`;
  const res = await (await fetch(url, { headers: { 'User-Agent': 'chalkidikihub-datacheck' } })).json();
  const places = res.filter((r) => ['village', 'town', 'hamlet', 'suburb', 'locality', 'neighbourhood', 'isolated_dwelling', 'city'].includes(r.type) || r.class === 'place');
  const best = places.map((p) => ({ ...p, d: km(v.latitude, v.longitude, +p.lat, +p.lon) })).sort((a, b) => a.d - b.d)[0];
  out.push({ slug: v.slug, name: v.name_el, db: [v.latitude, v.longitude], osm: best ? [+best.lat, +best.lon] : null, km: best ? +best.d.toFixed(1) : null, n: places.length, osmName: best?.display_name?.split(',').slice(0, 2).join(',') });
  await new Promise((r) => setTimeout(r, 1100));
}
fs.writeFileSync('C:/Users/mnc/AppData/Local/Temp/claude/C--Users-mnc-ReWrite/bd40446e-4eab-4f40-bed9-996bf7f93d11/scratchpad/osm.json', JSON.stringify(out, null, 1));
for (const o of out.filter((o) => o.km === null || o.km > 1.5).sort((a, b) => (b.km ?? 99) - (a.km ?? 99))) console.log(o.slug, o.name, o.km, 'db', o.db.join(','), 'osm', o.osm?.join(','), o.osmName, 'cands', o.n);
