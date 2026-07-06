// Push rewritten beach descriptions to Supabase beaches table.
//
// Reads scripts/beach-rewrites/<area>.json with format:
// {
//   "slug-1": { "description_el": "...", "meta_title_el": "...", "meta_description_el": "..." },
//   ...
// }
//
// Usage:
//   node scripts/push-beach-rewrites.js                # dry run
//   node scripts/push-beach-rewrites.js --commit       # apply
//   node scripts/push-beach-rewrites.js --commit --area kassandra  # single area

const fs = require('fs');
const path = require('path');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const { revalidate } = require('./lib/revalidate');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');
const AREA_FILTER = (() => {
  const i = process.argv.indexOf('--area');
  return i >= 0 ? process.argv[i + 1] : null;
})();

async function updateBeach(slug, payload) {
  const words = (payload.description_el || '').split(/\s+/).filter(Boolean).length;
  console.log(`  ${slug}: ${words} words`);
  if (DRY) { console.log('    [DRY] would PATCH'); return false; }
  const body = { ...payload, updated_at: new Date().toISOString() };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/beaches?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) { console.error(`    ERROR ${res.status}: ${await res.text()}`); return false; }
  const rows = await res.json();
  console.log(`    OK (${rows.length} row)`);
  return true;
}

(async () => {
  const dir = path.join(__dirname, 'beach-rewrites');
  if (!fs.existsSync(dir)) {
    console.error('No scripts/beach-rewrites/ directory');
    process.exit(1);
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);

  const changed = [];
  for (const file of files) {
    const area = file.replace(/\.json$/, '');
    if (AREA_FILTER && area !== AREA_FILTER) continue;
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    console.log(`\n=== ${area} (${Object.keys(data).length} beaches) ===`);
    for (const [slug, payload] of Object.entries(data)) {
      if (await updateBeach(slug, payload)) changed.push(slug);
    }
  }

  if (!DRY && changed.length) {
    console.log(`\nRevalidating ${changed.length} beach(es) on the live site...`);
    // These rewrites only touch the Greek (_el) columns, so skip regenerating
    // the other 6 language variants.
    await revalidate('beaches', changed, ['el']);
  }
})();
