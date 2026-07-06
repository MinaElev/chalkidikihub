// Delete duplicate and fake/non-real beach entries.
const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

const TO_DELETE = [
  // Fake/Google Places imports
  { slug: 'blue-dream-kassandra', reason: 'Not a real beach name (Google Places artifact)' },
  { slug: 'small-beach-kassandra', reason: 'Generic non-name from Google Places import' },
  { slug: 'white-sand-kassandra', reason: 'Generic descriptive non-name from Google Places' },

  // Duplicates of canonical beaches
  { slug: 'kalithea-beach-kassandra', reason: 'Duplicate of kallithea-kassandra (alt spelling)' },
  { slug: 'sani-beach-kassandra', reason: 'Duplicate of sani-kassandra' },
  { slug: 'posidi-kassandra', reason: 'Duplicate of possidi-kassandra (alt spelling)' },
  { slug: 'possidi-beach-kassandra', reason: 'Duplicate of possidi-kassandra' },

  // Duplicate nudist beach entries (keep katergopetra and mykoniatika as named, delete generics)
  { slug: 'nudist-beach-kassandra', reason: 'Generic nudist entry, no specific location' },
  { slug: 'nudist-beach-kassandra-2', reason: 'Generic duplicate' },
  { slug: 'nudist-beach-kassandra-3', reason: 'Generic duplicate' },
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
