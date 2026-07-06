// Translate areas table (4 rows) to all non-Greek locales.
// Usage: node scripts/translate-areas.js --commit

const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DRY = !process.argv.includes('--commit');

const LANG_NAMES = {
  en: 'English',
  de: 'German (Deutsch)',
  bg: 'Bulgarian (Български)',
  ru: 'Russian (Русский)',
  ro: 'Romanian (Română)',
  sr: 'Serbian (Srpski, Latin script)',
};

async function translate(area, targetLang) {
  const prompt = `Translate the following Greek "area" (region) description fields to ${targetLang}.

IMPORTANT RULES:
- Preserve HTML tags (<strong>) and Markdown headings (##) EXACTLY
- Preserve proper nouns of places (Halkidiki, Kassandra, Sithonia, Athos, etc.)
- Maintain factual accuracy — numbers, distances, dates are precise data
- Natural, native-sounding ${targetLang}

INPUT (Greek):
name: ${JSON.stringify(area.name_el)}
description: ${JSON.stringify(area.description_el)}
meta_title: ${JSON.stringify(area.meta_title_el || '')}
meta_description: ${JSON.stringify(area.meta_description_el || '')}

OUTPUT: Return ONLY a JSON object with keys: name, description, meta_title, meta_description.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

(async () => {
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/areas?select=*`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const areas = await res.json();

  for (const locale of Object.keys(LANG_NAMES)) {
    console.log(`\n=== ${locale.toUpperCase()} (${LANG_NAMES[locale]}) ===`);
    for (const area of areas) {
      console.log(`  ${area.slug}`);
      try {
        const t = await translate(area, LANG_NAMES[locale]);
        const payload = {
          [`name_${locale}`]: t.name || '',
          [`description_${locale}`]: t.description || '',
          [`meta_title_${locale}`]: t.meta_title || '',
          [`meta_description_${locale}`]: t.meta_description || '',
          updated_at: new Date().toISOString(),
        };
        if (DRY) { console.log(`    [DRY] desc ${t.description?.length} chars`); continue; }
        const up = await fetch(`${SUPABASE_URL}/rest/v1/areas?slug=eq.${encodeURIComponent(area.slug)}`, {
          method: 'PATCH',
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify(payload),
        });
        console.log(`    ${up.ok ? 'OK (' + t.description?.length + ' chars)' : 'ERROR ' + up.status}`);
      } catch (e) {
        console.error(`    ERROR: ${e.message}`);
      }
    }
  }
})();
