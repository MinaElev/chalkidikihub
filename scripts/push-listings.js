// Push listing description rewrites to Supabase listings table.
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
const FILE_FILTER = (() => {
  const i = process.argv.indexOf('--file');
  return i >= 0 ? process.argv[i + 1] : null;
})();

(async () => {
  const dir = path.join(__dirname, 'beach-rewrites');
  const files = fs.readdirSync(dir).filter(f => f.startsWith('listings-') && f.endsWith('.json'));
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);

  const changed = [];
  for (const file of files) {
    if (FILE_FILTER && !file.includes(FILE_FILTER)) continue;
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    console.log(`\n=== ${file} (${Object.keys(data).length} listings) ===`);
    for (const [slug, payload] of Object.entries(data)) {
      const words = (payload.description_el || '').split(/\s+/).filter(Boolean).length;
      console.log(`  ${slug}: ${words} words`);
      if (DRY) { console.log('    [DRY] would PATCH'); continue; }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/listings?slug=eq.${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ ...payload, updated_at: new Date().toISOString() }),
      });
      console.log(`    ${res.ok ? 'OK' : 'ERROR ' + res.status + ': ' + await res.text()}`);
      if (res.ok) changed.push(slug);
    }
  }

  if (!DRY && changed.length) {
    console.log(`\nRevalidating ${changed.length} listing(s) on the live site...`);
    await revalidate('listings', changed);
  }
})();
