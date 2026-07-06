// Push monastery description rewrites to Supabase monasteries table.
const fs = require('fs');
const path = require('path');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

(async () => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'beach-rewrites', 'monasteries.json'), 'utf8'));
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'} | ${Object.keys(data).length} monasteries`);
  let ok = 0;
  for (const [slug, payload] of Object.entries(data)) {
    const words = (payload.description_el || '').split(/\s+/).filter(Boolean).length;
    if (DRY) { console.log(`  ${slug}: ${words}w [DRY]`); continue; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/monasteries?slug=eq.${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(payload),
    });
    if (res.ok) { ok++; console.log(`  ${slug}: OK (${words}w)`); }
    else console.error(`  ${slug}: ERROR ${res.status}`);
  }
  if (!DRY) console.log(`\nDone: ${ok}/${Object.keys(data).length} updated`);
})();
