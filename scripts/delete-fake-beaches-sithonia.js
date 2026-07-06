// Delete duplicate and fake/non-real Sithonia beach entries.
const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');

const TO_DELETE = [
  // Generic "Παραλία" entries without specific name
  { slug: 'paralia-sithonia', reason: 'Generic "Παραλία" — no specific location' },
  { slug: 'beach-sithonia', reason: 'Generic "Παραλία"' },
  { slug: 'beach-sithonia-2', reason: 'Generic "Παραλία" duplicate' },
  { slug: 'beach-sithonia-3', reason: 'Generic + duplicate with par-azapiko-sithonia' },
  { slug: 'beach-sithonia-4', reason: 'Generic "Παραλία"' },
  { slug: 'beach-sithonia-5', reason: 'Generic "Παραλία"' },

  // Generic nudist entries
  { slug: 'nudist-beach-sithonia', reason: 'Generic nudist entry, no specific location' },
  { slug: 'nudist-beach-sithonia-2', reason: 'Generic nudist duplicate' },

  // Wrong area assignments (should be sithonia, listed as athos) + duplicates
  { slug: 'vourvourou-athos', reason: 'Wrong area (Vourvourou is in Sithonia) + duplicate of vourvourou-sithonia' },
  { slug: 'kavourotripes-athos', reason: 'Wrong area (Kavourotripes is in Sithonia) + duplicate of portokali-sithonia' },
  { slug: 'sarti-athos', reason: 'Wrong area (Sarti is in Sithonia) + duplicate of sarti-sithonia' },
  { slug: 'neos-marmaras-athos', reason: 'Not a beach (town name), wrong area' },
  { slug: 'nikiti-athos', reason: 'Wrong area (Nikiti is in Sithonia) - duplicate with nikiti-beach-sithonia-2 area' },

  // Clear duplicates
  { slug: 'vourvourou-beach-sithonia', reason: 'Duplicate of vourvourou-sithonia' },
  { slug: 'schinia-beach-sithonia-2', reason: 'Duplicate of schinia-beach-sithonia' },
  { slug: 'fteroti-beach-sithonia-2', reason: 'Duplicate (only one Fteroti entry remains)' },
  { slug: 'sarti-beach-sithonia', reason: 'Duplicate of sarti-sithonia' },
  { slug: 'sikia-beach-sithonia', reason: 'Duplicate (use linaraki-beach-sithonia for Sykia beach)' },
  { slug: 'par-azapiko-sithonia', reason: 'Duplicate, use main azapiko entry' },
  { slug: 'par-avlaki-sithonia', reason: 'Likely duplicate of armenistis area beach' },
  { slug: 'par-lagomadra-sithonia', reason: 'Duplicate of lagomandra-beach-sithonia' },
  { slug: 'par-ambelos-sithonia', reason: 'Duplicate (no specific named other Ambelos)' },
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
