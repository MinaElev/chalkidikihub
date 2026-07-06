// Import beaches from OpenStreetMap (Overpass API) into Supabase.
//
// Usage:
//   node scripts/import-beaches-osm.js           # dry-run, prints what would be inserted
//   node scripts/import-beaches-osm.js --commit  # actually insert into Supabase
//
// Free, no API key needed. Pulls every node/way/relation tagged natural=beach
// within the Chalkidiki bounding box, dedupes against existing slugs, and
// inserts new beaches with name (el/en), coords, area, location_name.

const fs = require('fs');
const path = require('path');

const DRY_RUN = !process.argv.includes('--commit');

// Load env from .env.local
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
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Chalkidiki bounding box (south, west, north, east)
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

// Transliterate Greek -> Latin for slug
const GR_MAP = {
  'α':'a','β':'v','γ':'g','δ':'d','ε':'e','ζ':'z','η':'i','θ':'th','ι':'i','κ':'k',
  'λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t',
  'υ':'y','φ':'f','χ':'ch','ψ':'ps','ω':'o','ά':'a','έ':'e','ή':'i','ί':'i','ό':'o',
  'ύ':'y','ώ':'o','ϊ':'i','ϋ':'y','ΐ':'i','ΰ':'y',
};
function slugify(s) {
  return s.toLowerCase().split('').map(c => GR_MAP[c] ?? c).join('')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Determine peninsula by lat/lng.
// - Mainland: north coast (lat ≥ 40.32) AND not on Athos isthmus (which extends north)
// - Kassandra: west leg, lon < 23.55
// - Sithonia: middle leg, lon 23.55–24.00 (extends east at southern tip into Sykia/Kalamitsi)
// - Athos: eastern leg, lon ≥ 24.0 OR (lon ≥ 23.92 AND lat ≥ 40.20 — Athos isthmus running north)
function areaFor(lat, lon) {
  if (lon >= 24.0) return 'athos';
  if (lon >= 23.92 && lat >= 40.20) return 'athos'; // Athos isthmus / Ouranoupoli area
  if (lat >= 40.32) return 'mainland';
  if (lon < 23.55) return 'kassandra';
  return 'sithonia';
}

// OSM has noisy data — exclude obvious non-beach POIs that happen to carry the tag
const NON_BEACH_RE = /\b(bar|restaurant|hotel|resort|camping|cafe|club|taverna|ταβέρν|μπαρ|εστιατ|ξενοδ|κάμπινγκ)\b/i;

const AREA_LABEL_EL = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Χαλκιδική',
};

async function fetchOverpass() {
  console.log('Fetching from Overpass…');
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
          'Accept': 'application/json',
          'User-Agent': 'ChalkidikiHub-Importer/1.0 (chalkidikihub.gr)',
        },
        body: 'data=' + encodeURIComponent(OVERPASS_QUERY),
      });
      if (!res.ok) {
        console.warn(`  ${url} -> ${res.status}`);
        continue;
      }
      return await res.json();
    } catch (e) {
      console.warn(`  ${url} -> ${e.message}`);
    }
  }
  throw new Error('All Overpass endpoints failed');
}

async function fetchExistingSlugs() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/beaches?select=slug,name_el,latitude,longitude`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

function normName(s) {
  return (s || '').toLowerCase().replace(/[^a-zα-ωά-ώ]/gi, '');
}

function isDuplicate(beach, existing) {
  if (existing.some(e => e.slug === beach.slug)) return 'slug';
  const bn = normName(beach.name_el);
  for (const e of existing) {
    if (!e.latitude || !e.longitude) continue;
    const dLat = (e.latitude - beach.latitude) * 111000;
    const dLon = (e.longitude - beach.longitude) * 111000 * Math.cos(beach.latitude * Math.PI / 180);
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    // 250m always, OR 800m if names match (catches OSM multi-point duplicates of same beach)
    if (dist < 250) return `near ${e.slug} (${Math.round(dist)}m)`;
    if (dist < 800 && bn && normName(e.name_el) === bn) {
      return `same name as ${e.slug} (${Math.round(dist)}m)`;
    }
  }
  return null;
}

(async () => {
  const data = await fetchOverpass();
  console.log(`Overpass returned ${data.elements.length} elements`);

  const candidates = [];
  const seenSlugs = new Set();
  for (const el of data.elements) {
    const tags = el.tags || {};
    const nameEl = tags['name:el'] || (/[Ͱ-Ͽ]/.test(tags.name || '') ? tags.name : null);
    const nameEn = tags['name:en'] || tags['int_name'] || (!/[Ͱ-Ͽ]/.test(tags.name || '') ? tags.name : null);
    const name = nameEl || nameEn || tags.name;
    if (!name) continue; // skip unnamed beaches
    if (NON_BEACH_RE.test(name)) continue; // skip bars/restaurants mistagged as beach

    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) continue;

    const area = areaFor(lat, lon);
    const baseSlug = slugify((nameEn || name) + '-' + area);
    let slug = baseSlug;
    let i = 2;
    while (seenSlugs.has(slug)) slug = `${baseSlug}-${i++}`;
    seenSlugs.add(slug);

    candidates.push({
      slug,
      name_el: nameEl || name,
      name_en: nameEn || name,
      name_de: nameEn || name,
      name_bg: nameEl || name,
      name_ru: nameEl || name,
      name_ro: nameEn || name,
      name_sr: nameEn || name,
      description_el: '',
      description_en: '',
      area,
      location_name: `${nameEl || name}, ${AREA_LABEL_EL[area]}`,
      latitude: lat,
      longitude: lon,
      image_url: '',
      features: [],
      rating: 0,
      reviews_count: 0,
    });
  }

  console.log(`Named beaches with coords: ${candidates.length}`);

  const existing = await fetchExistingSlugs();
  console.log(`Existing in DB: ${existing.length}`);

  const toInsert = [];
  const skipped = [];
  for (const b of candidates) {
    const dup = isDuplicate(b, existing) || isDuplicate(b, toInsert);
    if (dup) skipped.push({ slug: b.slug, name: b.name_el, reason: dup });
    else toInsert.push(b);
  }

  console.log(`\nWill insert: ${toInsert.length}`);
  console.log(`Skipped (dupes): ${skipped.length}`);
  const showAll = process.argv.includes('--all');
  const list = showAll ? toInsert : toInsert.slice(0, 10);
  console.log(`\n--- ${showAll ? 'All' : 'Sample (first 10)'} to insert ---`);
  for (const b of list) {
    console.log(`  + ${b.slug.padEnd(45)} ${b.name_el.padEnd(35)} (${b.area.padEnd(9)}) ${b.latitude.toFixed(4)},${b.longitude.toFixed(4)}`);
  }
  if (skipped.length && !showAll) {
    console.log('\n--- Skipped (first 10) ---');
    for (const s of skipped.slice(0, 10)) {
      console.log(`  - ${s.slug} :: ${s.reason}`);
    }
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN — pass --commit to insert.');
    return;
  }

  if (!toInsert.length) {
    console.log('\nNothing new to insert.');
    return;
  }

  console.log('\nInserting…');
  // batch in chunks of 50
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += 50) {
    const chunk = toInsert.slice(i, i + 50);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/beaches?on_conflict=slug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: 'resolution=ignore-duplicates,return=minimal',
      },
      body: JSON.stringify(chunk),
    });
    if (!res.ok) {
      console.error(`  Chunk ${i / 50}: ${res.status} ${await res.text()}`);
      continue;
    }
    inserted += chunk.length;
    console.log(`  Inserted chunk ${i / 50 + 1} (+${chunk.length})`);
  }
  console.log(`\nDone. Inserted ~${inserted} beaches.`);
})();
