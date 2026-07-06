// Strip raw coordinates ("40.1906, 23.7990") from beach descriptions in all
// languages. The AI sometimes pasted them in. Also collapses double spaces.
//
// Usage: node scripts/clean-beach-descriptions.js [--commit]

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

const LOCS = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];

// Match sentence fragments containing coordinate pairs (4-5 dp). Trims the
// surrounding context that introduces them ("the coordinates 40.1, 23.8 will…")
const COORD_PATTERNS = [
  // Greek lead-in: "Οι συντεταγμένες ... 40.x, 23.x ..."
  /(?:[Οο]ι\s+συντεταγμένες|[ΣΣ]υντεταγμένες)[^.!?]*?\d{2}\.\d{3,5}\s*,\s*\d{2}\.\d{3,5}[^.!?]*[.!?]\s*/gi,
  // English: "the coordinates ... 40.x, 23.x ..."
  /(?:the\s+coordinates|coordinates)[^.!?]*?\d{2}\.\d{3,5}\s*,\s*\d{2}\.\d{3,5}[^.!?]*[.!?]\s*/gi,
  // German
  /(?:[Dd]ie\s+Koordinaten|Koordinaten)[^.!?]*?\d{2}\.\d{3,5}\s*,\s*\d{2}\.\d{3,5}[^.!?]*[.!?]\s*/g,
  // Bulgarian / Russian (cyrillic)
  /(?:[Кк]оординат[аи]?)[^.!?]*?\d{2}\.\d{3,5}\s*,\s*\d{2}\.\d{3,5}[^.!?]*[.!?]\s*/g,
  // Romanian
  /(?:[Cc]oordonatele|[Cc]oordonate)[^.!?]*?\d{2}\.\d{3,5}\s*,\s*\d{2}\.\d{3,5}[^.!?]*[.!?]\s*/g,
  // Serbian Latin / Croatian
  /(?:[Nn]jene\s+koordinate|[Kk]oordinate)[^.!?]*?\d{2}\.\d{3,5}\s*,\s*\d{2}\.\d{3,5}[^.!?]*[.!?]\s*/g,
  // Last-resort: any bare "40.1234, 23.5678" pair with no lead-in
  /\b\d{2}\.\d{3,5}\s*,\s*\d{2}\.\d{3,5}\b/g,
  // Sentences that survive coord removal but reference them ("the coordinates will guide you")
  /[^.!?]*(?:συντεταγμένες|coordinates|Koordinaten|координат[аи]?|coordonatel?e?|koordinate)[^.!?]*[.!?]\s*/gi,
  // GPS-only references that lost their numbers
  /[^.!?]*\bGPS[^.!?]*[.!?]\s*/g,
];

function cleanText(s) {
  if (!s) return s;
  let out = s;
  for (const re of COORD_PATTERNS) out = out.replace(re, '');
  out = out.replace(/[ \t]{2,}/g, ' ').replace(/\s+([.,;!?])/g, '$1').trim();
  return out;
}

(async () => {
  const r = await fetch(
    `${URL}/rest/v1/beaches?select=id,slug,${LOCS.map(l => `description_${l}`).join(',')}`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
  );
  const all = await r.json();
  console.log(`Beaches: ${all.length}`);

  const changes = [];
  for (const b of all) {
    const patch = {};
    for (const loc of LOCS) {
      const before = b[`description_${loc}`] || '';
      const after = cleanText(before);
      if (after !== before) patch[`description_${loc}`] = after;
    }
    if (Object.keys(patch).length) changes.push({ id: b.id, slug: b.slug, patch });
  }

  console.log(`Beaches with coord text to clean: ${changes.length}`);

  // Show 3 diffs as preview
  for (const c of changes.slice(0, 3)) {
    console.log(`\n  ${c.slug}:`);
    for (const [k, v] of Object.entries(c.patch)) {
      console.log(`    ${k}: …${v.slice(-100)}`);
    }
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
      body: JSON.stringify(c.patch),
    });
    if (upd.ok) ok++; else { fail++; console.error(`  ${c.slug}: ${upd.status}`); }
  }
  console.log(`\nDone. ${ok} cleaned, ${fail} failed.`);
})();
