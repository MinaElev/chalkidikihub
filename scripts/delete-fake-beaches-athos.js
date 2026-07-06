const fs = require('fs');
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

const TO_DELETE = [
  { slug: 'komitsa-athos-2', reason: 'Duplicate of komitsa-athos' },
  { slug: 'paralia-ouranoupoli-athos', reason: 'Duplicate of ouranoupoli-athos' },
  { slug: 'oyranoypoli-3-aristoteles-athos', reason: 'Duplicate referring to Aristoteles resort' },
];

(async () => {
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);
  for (const { slug, reason } of TO_DELETE) {
    console.log(`- ${slug} (${reason})`);
    if (DRY) { console.log('  [DRY] would DELETE'); continue; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/beaches?slug=eq.${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'return=representation' },
    });
    const rows = await res.json();
    console.log(`  ${res.ok && rows.length > 0 ? 'OK deleted' : 'not found'}`);
  }
})();
