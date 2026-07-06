// Translate listings (description, meta_title, meta_description) to all 6 non-Greek locales.
// Only translates listings that were recently rewritten (those that need fresh translations).
//
// Usage:
//   node scripts/translate-listings.js --commit
//   node scripts/translate-listings.js --commit --locale en  # single locale

const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DRY = !process.argv.includes('--commit');
const LOCALE_FILTER = (() => {
  const i = process.argv.indexOf('--locale');
  return i >= 0 ? process.argv[i + 1] : null;
})();

const LANG_NAMES = {
  en: 'English',
  de: 'German (Deutsch)',
  bg: 'Bulgarian (Български)',
  ru: 'Russian (Русский)',
  ro: 'Romanian (Română)',
  sr: 'Serbian (Srpski, Latin script)',
};

// Slugs we just rewrote — only translate these
const REWRITTEN_SLUGS = [
  'amira-house-sithonia-sykia-chalkidikis',
  'xenodocheio-3-asteron-stin-chanipsoti-chalkifkis-hanioti',
  'kalyves-seafront-apartment-kalyves-polygyrou',
  'isla-de-roca-valti-sykia-chalkidiki',
  'arroyo-suites-kalamitsi-sithonia-kalamitsi',
  'la-casa-di-parga-sikia',
  'thespis-villa-3-sykia',
  'granny-stratia-tristinika-beach',
  'maras-marinas-home-nikiti-chalkidiki',
  'studio-suite-nea-plagia-nea-plagia-chalkidikis',
  'spiti-me-a-avli-kalikratia-nea-kalikrateia-chalkidikis',
  'barba-stergios-tristinika',
  'hotel-paraktio-nea-kallikrateia',
  'thespis-villa-1-sykia',
  'enoikiazomena-domatia-stin-toroni-toroni',
  'spiti-konta-sti-thalassa-nea-triglia',
  'spiti-by-tre-beacj-nea-triglia-halkidiki',
  'salvatore-sykia-xalkidiki',
  'stoyntio-konta-sti-thalassa-sti-vourvouroy-vourvouroy-sithonia',
  'konmar-lofts-sykia',
  'apartment-neos-marmaras',
  'mikro-diamerisma-konta-stin-thalassa-vourvouroy-sithonia',
  'nea-potidaia-sale-nea-potidaia-chalkidikis',
  'diamerisma-pefkohori-peykochori-chalkidikis',
  'spiti-me-thea-thalassa-nea-triglia',
  'studios-galini-porto-koufo',
  'angie-s-house-sykia-sykia',
  'villa-doxa-sarti',
];

async function translate(listing, targetLang) {
  const prompt = `Translate the following Greek accommodation listing fields to ${targetLang}.

IMPORTANT RULES:
- Preserve Markdown headings (## ## ##) and bullets (- -) EXACTLY
- Preserve bold markdown (**text**) for emphasis
- Preserve proper nouns of places (Halkidiki, Sithonia, Kassandra, beach names) — use standard transliteration if needed
- Maintain factual accuracy — distances, prices, guest counts are precise data
- Natural, native-sounding ${targetLang} — not literal translation

INPUT (Greek):
description: ${JSON.stringify(listing.description_el)}
meta_title: ${JSON.stringify(listing.meta_title_el || '')}
meta_description: ${JSON.stringify(listing.meta_description_el || '')}

OUTPUT: Return ONLY a JSON object with keys: description, meta_title, meta_description.`;

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

  // Fetch the rewritten listings
  const slugFilter = REWRITTEN_SLUGS.map(s => `"${s}"`).join(',');
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/listings?select=slug,description_el,meta_title_el,meta_description_el&slug=in.(${slugFilter})`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const listings = await res.json();
  console.log(`Found ${listings.length} listings to translate`);

  const locales = LOCALE_FILTER ? [LOCALE_FILTER] : Object.keys(LANG_NAMES);

  for (const locale of locales) {
    console.log(`\n=== ${locale.toUpperCase()} (${LANG_NAMES[locale]}) ===`);
    for (const listing of listings) {
      try {
        const t = await translate(listing, LANG_NAMES[locale]);
        const payload = {
          [`description_${locale}`]: t.description || '',
          [`meta_title_${locale}`]: t.meta_title || '',
          [`meta_description_${locale}`]: t.meta_description || '',
          updated_at: new Date().toISOString(),
        };
        if (DRY) {
          console.log(`  ${listing.slug}: [DRY] ${t.description?.length} chars`);
          continue;
        }
        const up = await fetch(`${SUPABASE_URL}/rest/v1/listings?slug=eq.${encodeURIComponent(listing.slug)}`, {
          method: 'PATCH',
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify(payload),
        });
        console.log(`  ${listing.slug}: ${up.ok ? 'OK (' + t.description?.length + ' chars)' : 'ERROR ' + up.status}`);
      } catch (e) {
        console.error(`  ${listing.slug}: ERROR ${e.message}`);
      }
    }
  }
})();
