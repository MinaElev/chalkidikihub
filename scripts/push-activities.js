// Push activity rewrites to Supabase activities table.
const fs = require('fs'), path = require('path');
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}
const { revalidate } = require('./lib/revalidate');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

(async () => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'beach-rewrites', 'activities.json'), 'utf8'));
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);
  const changed = [];
  for (const [slug, payload] of Object.entries(data)) {
    const words = (payload.description_el || '').split(/\s+/).filter(Boolean).length;
    console.log(`  ${slug}: ${words} words`);
    if (DRY) { console.log('  [DRY] would PATCH'); continue; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/activities?slug=eq.${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ ...payload, updated_at: new Date().toISOString() }),
    });
    console.log(`    ${res.ok ? 'OK' : 'ERROR ' + res.status}`);
    if (res.ok) changed.push(slug);
  }

  if (!DRY && changed.length) {
    console.log(`\nRevalidating ${changed.length} activity(ies) on the live site...`);
    await revalidate('activities', changed);
  }
})();
