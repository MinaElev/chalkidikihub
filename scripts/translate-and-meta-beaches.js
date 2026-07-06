// Translate description_el + generate meta_title/meta_description for all locales.
// 1 OpenAI call per beach returning JSON with 6 languages × 3 fields.
//
// Usage:
//   node scripts/translate-and-meta-beaches.js              # dry-run 2 samples
//   node scripts/translate-and-meta-beaches.js --commit     # all eligible beaches
//   node scripts/translate-and-meta-beaches.js --commit --limit 10
//
// Cost: ~$0.005 per beach with gpt-4o-mini. 140 beaches ≈ $0.70.

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
const OAI = process.env.OPENAI_API_KEY;
const DRY = !process.argv.includes('--commit');
const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : (DRY ? 2 : Infinity);
})();

const TARGET_LOCALES = ['en', 'de', 'bg', 'ru', 'ro', 'sr'];

const AREA_LABEL = {
  kassandra: { en: 'Kassandra', de: 'Kassandra', bg: 'Касандра', ru: 'Кассандра', ro: 'Kassandra', sr: 'Kasandra' },
  sithonia: { en: 'Sithonia', de: 'Sithonia', bg: 'Ситония', ru: 'Ситония', ro: 'Sithonia', sr: 'Sitonija' },
  athos: { en: 'Athos', de: 'Athos', bg: 'Атон', ru: 'Афон', ro: 'Athos', sr: 'Atos' },
  mainland: { en: 'Halkidiki mainland', de: 'Chalkidiki Festland', bg: 'Халкидики', ru: 'Халкидики', ro: 'Halkidiki', sr: 'Halkidiki' },
};

function buildPrompt(beach) {
  return `You are a professional travel content translator. For the Greek beach description below, produce translations into 6 languages PLUS short SEO meta fields in all 7 languages (Greek + 6 translations).

Beach name (Greek): ${beach.name_el}
Area: ${AREA_LABEL[beach.area]?.en || 'Halkidiki'}
Greek description:
"""
${beach.description_el}
"""

Return ONLY valid JSON, no markdown fences, with this exact shape:
{
  "description": { "en": "...", "de": "...", "bg": "...", "ru": "...", "ro": "...", "sr": "..." },
  "meta_title": { "el": "...", "en": "...", "de": "...", "bg": "...", "ru": "...", "ro": "...", "sr": "..." },
  "meta_description": { "el": "...", "en": "...", "de": "...", "bg": "...", "ru": "...", "ro": "...", "sr": "..." }
}

Rules:
- description.*: faithful translation of the Greek text. Keep the same factual claims, keep the same length (±15%). Natural native phrasing, no stiff machine translation.
- meta_title.*: 50–60 characters. Format: "{Beach Name} | {Area}, Halkidiki" in each language's natural phrasing. No clickbait.
- meta_description.*: 140–155 characters. ONE sentence summarising the beach (location + character). No "Discover", no "Welcome to", no exclamation marks. Concrete, factual.
- All output strings must be in the target language script (Cyrillic for bg/ru/sr, Latin for en/de/ro). NEVER mix scripts within one string.
- For "sr" use Latin script (Serbian Latin), not Cyrillic.
`;
}

async function callOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OAI}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

(async () => {
  // Eligible: has description_el, but missing description_en OR meta fields
  const r = await fetch(
    `${URL}/rest/v1/beaches?select=id,slug,name_el,area,description_el,description_en,meta_title_el&description_el=not.is.null&description_el=not.eq.&order=slug.asc`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
  );
  const all = await r.json();
  const eligible = all.filter(b =>
    !b.description_en || !b.description_en.trim() ||
    !b.meta_title_el || !b.meta_title_el.trim()
  );
  const beaches = eligible.slice(0, LIMIT);
  console.log(`Eligible: ${eligible.length}. Processing: ${beaches.length}.`);

  let done = 0, failed = 0;
  for (let i = 0; i < beaches.length; i++) {
    const b = beaches[i];
    try {
      const out = await callOpenAI(buildPrompt(b));

      const patch = {};
      for (const loc of TARGET_LOCALES) {
        if (out.description?.[loc]) patch[`description_${loc}`] = out.description[loc];
      }
      for (const loc of ['el', ...TARGET_LOCALES]) {
        if (out.meta_title?.[loc]) patch[`meta_title_${loc}`] = out.meta_title[loc];
        if (out.meta_description?.[loc]) patch[`meta_description_${loc}`] = out.meta_description[loc];
      }

      if (i < 2 || DRY) {
        console.log(`\n--- ${b.slug} ---`);
        console.log(`meta_title_el: ${patch.meta_title_el}`);
        console.log(`meta_title_en: ${patch.meta_title_en}`);
        console.log(`meta_description_en: ${patch.meta_description_en}`);
        console.log(`description_en (first 120ch): ${(patch.description_en || '').slice(0, 120)}…`);
      }

      if (!DRY) {
        const upd = await fetch(`${URL}/rest/v1/beaches?id=eq.${b.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: KEY, Authorization: `Bearer ${KEY}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(patch),
        });
        if (!upd.ok) {
          console.error(`  ${b.slug}: PATCH ${upd.status} ${(await upd.text()).slice(0,100)}`);
          failed++; continue;
        }
        if ((i + 1) % 10 === 0) console.log(`  …${i + 1}/${beaches.length}`);
      }
      done++;
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`  ${b.slug}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${done} processed, ${failed} failed. ${DRY ? '(dry run)' : ''}`);
})();
