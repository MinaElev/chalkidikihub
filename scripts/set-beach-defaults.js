// Fallback: set sensible defaults on beaches still missing rating/features
// so the crowd estimator works (popularity > 0).
//
// Usage: node scripts/set-beach-defaults.js [--commit]

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

(async () => {
  const r = await fetch(`${URL}/rest/v1/beaches?select=id,slug,features,rating`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const all = await r.json();
  const targets = all.filter(b =>
    (!b.features || b.features.length === 0) || (!b.rating || b.rating === 0)
  );
  console.log(`Beaches needing defaults: ${targets.length}`);

  for (const b of targets.slice(0, 10)) {
    console.log(`  ${b.slug.padEnd(45)} features=${JSON.stringify(b.features||[])} rating=${b.rating||0}`);
  }
  if (targets.length > 10) console.log(`  … and ${targets.length - 10} more`);

  if (DRY) { console.log('\nDRY RUN — pass --commit to write.'); return; }

  let ok = 0;
  for (const b of targets) {
    const patch = {};
    if (!b.features || b.features.length === 0) patch.features = ['free'];
    if (!b.rating || b.rating === 0) patch.rating = 3.5;
    const resp = await fetch(`${URL}/rest/v1/beaches?id=eq.${b.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: KEY, Authorization: `Bearer ${KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(patch),
    });
    if (resp.ok) ok++;
  }
  console.log(`\nUpdated ${ok}/${targets.length}.`);
})();
