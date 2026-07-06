// Translate enhanced restaurant descriptions to all 6 non-Greek locales.
// Usage:
//   node scripts/translate-restaurants.js --commit
//   node scripts/translate-restaurants.js --commit --locale en

const fs = require('fs');
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DRY = !process.argv.includes('--commit');
const LOCALE_FILTER = (() => { const i = process.argv.indexOf('--locale'); return i >= 0 ? process.argv[i + 1] : null; })();

const LANG_NAMES = { en: 'English', de: 'German', bg: 'Bulgarian (Cyrillic)', ru: 'Russian (Cyrillic)', ro: 'Romanian', sr: 'Serbian (Latin script)' };

async function translate(text, targetLang) {
  const prompt = `Translate the following Greek restaurant/cafe/bar description from Halkidiki to ${targetLang}.

RULES:
- Preserve Markdown headings (## ) and bold (**text**) EXACTLY
- Preserve place names (Halkidiki, Kassandra, Sithonia, village names)
- Keep prices in euros (€), distances in km, numbers unchanged
- Natural, native-sounding ${targetLang} — not literal

TEXT:
${text}

Return only the translated text, nothing else.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 1500 }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  return (await res.json()).choices[0].message.content.trim();
}

(async () => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?select=slug,description_el&order=slug`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const restaurants = (await r.json()).filter(r => r.description_el && r.description_el.length > 100);
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'} | ${restaurants.length} restaurants`);

  const locales = LOCALE_FILTER ? [LOCALE_FILTER] : Object.keys(LANG_NAMES);
  for (const locale of locales) {
    console.log(`\n=== ${locale.toUpperCase()} (${LANG_NAMES[locale]}) ===`);
    for (const rest of restaurants) {
      try {
        const t = await translate(rest.description_el, LANG_NAMES[locale]);
        if (DRY) { console.log(`  ${rest.slug}: [DRY] ${t.length}c`); continue; }
        const up = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?slug=eq.${encodeURIComponent(rest.slug)}`, {
          method: 'PATCH',
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ [`description_${locale}`]: t, updated_at: new Date().toISOString() }),
        });
        console.log(`  ${rest.slug}: ${up.ok ? 'OK (' + t.length + 'c)' : 'FAIL ' + up.status}`);
      } catch (e) { console.error(`  ${rest.slug}: ERROR ${e.message}`); }
    }
  }
  console.log('\nDone!');
})();
