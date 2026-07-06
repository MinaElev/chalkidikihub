// Enrich beaches with OSM tag data: surface, sunbeds, access, nudist, etc.
// Re-queries Overpass for natural=beach in Chalkidiki with full tags, matches
// each OSM element to the closest DB beach by lat/lng, maps tags → features[],
// and updates Supabase.
//
// Usage:
//   node scripts/enrich-beaches-osm-tags.js                 # dry-run preview
//   node scripts/enrich-beaches-osm-tags.js --commit        # write to DB
//   node scripts/enrich-beaches-osm-tags.js --only-empty    # only beaches with features=[]

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = !process.argv.includes('--commit');
const ONLY_EMPTY = process.argv.includes('--only-empty');

const BBOX = [39.85, 23.05, 40.55, 24.45];
const OVERPASS_QUERY = `
[out:json][timeout:90];
(
  node["natural"="beach"](${BBOX.join(',')});
  way["natural"="beach"](${BBOX.join(',')});
  relation["natural"="beach"](${BBOX.join(',')});
);
out center tags;
`;

async function fetchOverpass() {
  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'User-Agent': 'ChalkidikiHub-Importer/1.0 (chalkidikihub.gr)',
        },
        body: 'data=' + encodeURIComponent(OVERPASS_QUERY),
      });
      if (!res.ok) { console.warn(`  ${url} -> ${res.status}`); continue; }
      return await res.json();
    } catch (e) { console.warn(`  ${url} -> ${e.message}`); }
  }
  throw new Error('Overpass failed');
}

// Map OSM tags to our BeachFeature[]
function osmToFeatures(tags) {
  const f = new Set();
  const surface = (tags.surface || tags['beach:type'] || '').toLowerCase();
  if (/sand/.test(surface)) f.add('sandy');
  if (/pebble|gravel|stone/.test(surface)) f.add('pebble');

  // Sunbeds / organized
  if (tags.sunbeds === 'yes' || tags['beach:sunbeds'] === 'yes') f.add('sunbeds');
  if (tags['beach_resort'] === 'yes' || tags.leisure === 'beach_resort' ||
      tags.amenity === 'beach_resort' || tags.sunbeds === 'yes') {
    f.add('organized');
  }

  // Access (free vs ticketed)
  const access = (tags.access || tags.fee || '').toLowerCase();
  if (access === 'yes' || access === 'public') f.add('free');
  if (tags.fee === 'no') f.add('free');

  // Parking nearby (only if explicitly tagged on the beach node)
  if (tags.parking === 'yes' || tags['parking:nearby'] === 'yes') f.add('parking');

  // Naturism
  if (tags.naturism === 'yes' || tags.nudism === 'yes') f.add('nudist');

  // Bar / amenity hints
  if (tags.bar === 'yes') f.add('beachBar');

  // Wheelchair access
  if (tags.wheelchair === 'yes' || tags.wheelchair === 'designated') f.add('accessible');

  // Lifeguard
  if (tags.lifeguard === 'yes' || tags.emergency === 'lifeguard_tower') f.add('lifeguard');

  return [...f];
}

// Detect nudist beaches from the name when OSM tag is missing
function inferFromName(name, features) {
  const f = new Set(features);
  if (/γυμνιστ|nudist|naturist/i.test(name)) f.add('nudist');
  return [...f];
}

function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

(async () => {
  console.log('Fetching OSM data…');
  const data = await fetchOverpass();
  const osmBeaches = data.elements
    .map(el => ({ lat: el.lat ?? el.center?.lat, lon: el.lon ?? el.center?.lon, tags: el.tags || {} }))
    .filter(b => b.lat && b.lon);
  console.log(`OSM beaches: ${osmBeaches.length}`);

  console.log('Fetching DB beaches…');
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/beaches?select=id,slug,name_el,area,latitude,longitude,features,rating`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  let beaches = await res.json();
  if (ONLY_EMPTY) {
    beaches = beaches.filter(b => !b.features || b.features.length === 0);
  }
  console.log(`DB beaches to process: ${beaches.length}`);

  let enriched = 0, noMatch = 0, noNewTags = 0;
  const updates = [];

  for (const b of beaches) {
    // Find OSM beach within 200m
    let best = null, bestDist = Infinity;
    for (const o of osmBeaches) {
      const d = haversineM(b.latitude, b.longitude, o.lat, o.lon);
      if (d < bestDist) { bestDist = d; best = o; }
    }

    if (!best || bestDist > 200) { noMatch++; continue; }

    let newFeatures = osmToFeatures(best.tags);
    newFeatures = inferFromName(b.name_el, newFeatures);

    // Merge with existing features (don't drop manually-set ones)
    const merged = [...new Set([...(b.features || []), ...newFeatures])];
    const added = merged.filter(f => !(b.features || []).includes(f));

    if (added.length === 0) { noNewTags++; continue; }

    // Also assign default rating if 0 (so crowd estimator works)
    const patch = { features: merged };
    if (!b.rating || b.rating === 0) patch.rating = 3.8;

    updates.push({ id: b.id, slug: b.slug, name: b.name_el, added, total: merged, patch });
    enriched++;
  }

  console.log(`\nMatched & enriched: ${enriched}`);
  console.log(`No OSM match within 200m: ${noMatch}`);
  console.log(`No new tags to add: ${noNewTags}`);

  console.log('\n--- Sample (first 15) ---');
  for (const u of updates.slice(0, 15)) {
    console.log(`  ${u.slug.padEnd(40)} +[${u.added.join(',')}]  =>  [${u.total.join(',')}]`);
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN — pass --commit to write.');
    return;
  }

  console.log('\nWriting updates…');
  let ok = 0, fail = 0;
  for (const u of updates) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/beaches?id=eq.${u.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(u.patch),
    });
    if (r.ok) ok++;
    else { fail++; console.error(`  ${u.slug}: ${r.status} ${(await r.text()).slice(0,100)}`); }
  }
  console.log(`\nDone. ${ok} updated, ${fail} failed.`);
})();
