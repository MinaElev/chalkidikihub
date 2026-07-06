// Fix beaches misclassified as 'athos' that actually belong to 'sithonia'.
// The southern tip of Sithonia (Kalamitsi, Sarti, Sykia, Toroni, Platania)
// extends east past lon 23.92, which my initial import rule lumped into Athos.
//
// Real geography:
// - Sithonia peninsula goes south to ~lat 39.92, with east coast at ~lon 24.0
// - Athos peninsula is east of the Singitic Gulf, base at lon ~23.93 BUT
//   only above lat ~40.15 (Ouranoupoli area). Below that it's open sea or Sithonia.
//
// Usage: node scripts/fix-beach-areas.js [--commit]

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const p = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}
loadEnv();
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

// Conservative classifier: only reassign clear errors. Specifically, the
// southern Sithonia tip (Sarti, Sykia, Kalamitsi, Neos Marmaras, Porto Koufo,
// Toroni-east) was wrongly imported as 'athos'. Athos peninsula proper begins
// at lon ≥ 24.0 OR (lon ≥ 23.85 AND lat ≥ 40.32 — Ouranoupoli/Tripiti area).
// Anything else currently tagged 'athos' that falls outside those bounds is
// actually Sithonia.
function correctArea(lat, lon, currentArea) {
  // Only consider re-classifying beaches currently marked 'athos'
  if (currentArea !== 'athos') return currentArea;

  // Strong Athos: clearly east of Singitic Gulf
  if (lon >= 24.0) return 'athos';
  // Ouranoupoli/Tripiti/Ammouliani strip: lon 23.85–24.0 at the isthmus or above
  if (lon >= 23.85 && lat >= 40.30) return 'athos';

  // Otherwise this 'athos' beach is actually southern Sithonia
  return 'sithonia';
}

const AREA_LABEL_EL = {
  kassandra: 'Κασσάνδρα', sithonia: 'Σιθωνία', athos: 'Άθως', mainland: 'Χαλκιδική',
};

(async () => {
  const r = await fetch(`${URL}/rest/v1/beaches?select=id,slug,name_el,area,latitude,longitude,location_name`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const all = await r.json();

  const changes = [];
  for (const b of all) {
    if (!b.latitude || !b.longitude) continue;
    const correct = correctArea(b.latitude, b.longitude, b.area);
    if (correct !== b.area) {
      // Also fix the human location_name suffix if it referenced the old area
      let newLoc = b.location_name || '';
      const oldLabel = AREA_LABEL_EL[b.area];
      const newLabel = AREA_LABEL_EL[correct];
      if (oldLabel && newLoc.includes(oldLabel)) {
        newLoc = newLoc.replace(oldLabel, newLabel);
      }
      changes.push({ ...b, newArea: correct, newLoc });
    }
  }

  console.log(`Beaches to reassign: ${changes.length} / ${all.length}`);
  console.log('\n--- Changes ---');
  for (const c of changes) {
    console.log(`  ${c.slug.padEnd(40)} ${c.area} → ${c.newArea}  (${c.latitude.toFixed(3)},${c.longitude.toFixed(3)})  "${c.name_el}"`);
  }

  if (DRY) { console.log('\nDRY RUN — pass --commit to write.'); return; }

  let ok = 0, fail = 0;
  for (const c of changes) {
    const upd = await fetch(`${URL}/rest/v1/beaches?id=eq.${c.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: KEY, Authorization: `Bearer ${KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ area: c.newArea, location_name: c.newLoc }),
    });
    if (upd.ok) ok++;
    else { fail++; console.error(`  ${c.slug}: ${upd.status}`); }
  }
  console.log(`\nDone. ${ok} fixed, ${fail} failed.`);
})();
