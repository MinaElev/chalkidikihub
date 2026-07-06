// Delete clearly off-topic and duplicate blog articles.
const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

const TO_DELETE = [
  { slug: 'tiki-Floating', reason: 'Advertorial for specific bar in Vourvourou' },
  { slug: 'drastiriotita-boat-trips-islands', reason: 'Duplicate of boat-trips-complete-guide' },
  { slug: 'geystikes-peripeteies-stin-atho-o-gastronomikos-odigos-uh2nw7', reason: 'Spam slug + AI thin content' },
  { slug: 'anakalyptontas-ti-sykia-enas-krymmenos-thisayros-sti-chalkidiki-t7i8kg', reason: 'Spam slug + duplicate of sykia-chalkidiki' },
];

(async () => {
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);
  for (const { slug, reason } of TO_DELETE) {
    console.log(`- ${slug} (${reason})`);
    if (DRY) { console.log('  [DRY] would DELETE'); continue; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?slug=eq.${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'return=representation' },
    });
    const rows = await res.json();
    console.log(`  ${res.ok && rows.length > 0 ? 'OK deleted' : 'not found'}`);
  }
})();
