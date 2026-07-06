// Auto-generate image alt texts for beaches and listings.
// Template-based, multi-locale, uses existing structured data.
//
// Usage:
//   node scripts/generate-alt-texts.js              # dry run
//   node scripts/generate-alt-texts.js --commit
//   node scripts/generate-alt-texts.js --commit --table beaches
//   node scripts/generate-alt-texts.js --commit --table listings

const fs = require('fs');

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = !process.argv.includes('--commit');
const TABLE_FILTER = (() => {
  const i = process.argv.indexOf('--table');
  return i >= 0 ? process.argv[i + 1] : null;
})();

// Area name translations
const AREA_NAMES = {
  kassandra: { el: 'Κασσάνδρα', en: 'Kassandra', de: 'Kassandra', bg: 'Касандра', ru: 'Кассандра', ro: 'Kassandra', sr: 'Kasandra' },
  sithonia: { el: 'Σιθωνία', en: 'Sithonia', de: 'Sithonia', bg: 'Ситония', ru: 'Ситония', ro: 'Sithonia', sr: 'Sitonija' },
  athos: { el: 'Άθω', en: 'Athos', de: 'Athos', bg: 'Атон', ru: 'Афон', ro: 'Athos', sr: 'Atos' },
  mainland: { el: 'Χαλκιδική', en: 'Halkidiki', de: 'Chalkidiki', bg: 'Халкидики', ru: 'Халкидики', ro: 'Halkidiki', sr: 'Halkidiki' },
};

// Beach feature translations (just a few key ones for variety)
const FEATURE_LABELS = {
  sandy: { el: 'αμμώδης', en: 'sandy', de: 'sandig', bg: 'пясъчен', ru: 'песчаный', ro: 'nisipos', sr: 'peščani' },
  pebble: { el: 'βότσαλο', en: 'pebble', de: 'Kies', bg: 'каменист', ru: 'галечный', ro: 'pietriș', sr: 'šljunkoviti' },
  organized: { el: 'οργανωμένη', en: 'organized', de: 'organisiert', bg: 'организиран', ru: 'оборудованный', ro: 'organizat', sr: 'organizovana' },
  free: { el: 'ελεύθερη πρόσβαση', en: 'free access', de: 'freier Zugang', bg: 'свободен достъп', ru: 'свободный доступ', ro: 'acces liber', sr: 'slobodan pristup' },
  shallowWater: { el: 'ρηχά νερά', en: 'shallow waters', de: 'flaches Wasser', bg: 'плитки води', ru: 'мелководье', ro: 'ape puțin adânci', sr: 'plitka voda' },
  beachBar: { el: 'beach bar', en: 'beach bar', de: 'Beach Bar', bg: 'бийч бар', ru: 'пляжный бар', ro: 'beach bar', sr: 'beach bar' },
};

// Greek article matched to area: Άθω is masculine ("στον"), the rest feminine ("στην")
const GREEK_ARTICLE = { kassandra: 'στην', sithonia: 'στη', athos: 'στον', mainland: 'στη' };

function genBeachAlt(beach, locale) {
  const area = AREA_NAMES[beach.area]?.[locale] || beach.area;
  const features = (beach.features || []).slice(0, 2).map(f => FEATURE_LABELS[f]?.[locale]).filter(Boolean);
  const featuresStr = features.length > 0 ? ` (${features.join(', ')})` : '';
  // Strip leading "Παραλία" / "παραλία" / "Παραλίας" / English "Beach" suffix to avoid duplication.
  // beach.name_el sometimes already includes the word (Google Places import artifact).
  let name = (beach.name_el || beach.slug).trim();
  name = name.replace(/^παραλία\s+/i, '').replace(/\s+beach$/i, '').trim();
  const greekArticle = GREEK_ARTICLE[beach.area] || 'στη';

  const templates = {
    el: `Παραλία ${name} ${greekArticle} ${area}${featuresStr} - ChalkidikiHub`,
    en: `${name} Beach in ${area}${featuresStr} - ChalkidikiHub`,
    de: `Strand ${name} in ${area}${featuresStr} - ChalkidikiHub`,
    bg: `Плаж ${name} в ${area}${featuresStr} - ChalkidikiHub`,
    ru: `Пляж ${name} в ${area}${featuresStr} - ChalkidikiHub`,
    ro: `Plaja ${name} în ${area}${featuresStr} - ChalkidikiHub`,
    sr: `Plaža ${name} u ${area}${featuresStr} - ChalkidikiHub`,
  };
  return templates[locale] || templates.el;
}

function genListingAlt(listing, locale) {
  const area = AREA_NAMES[listing.area]?.[locale] || listing.area;
  const title = (listing[`title_${locale}`]) || listing.title_el || listing.slug;
  const guests = listing.guests_max ? ` (${listing.guests_max} ${locale === 'el' ? 'άτομα' : locale === 'en' ? 'guests' : locale === 'de' ? 'Gäste' : locale === 'bg' ? 'гости' : locale === 'ru' ? 'гостей' : locale === 'ro' ? 'oaspeți' : 'gostiju'})` : '';

  const templates = {
    el: `${title} - Κατάλυμα στη ${area}${guests} - ChalkidikiHub`,
    en: `${title} - Accommodation in ${area}${guests} - ChalkidikiHub`,
    de: `${title} - Unterkunft in ${area}${guests} - ChalkidikiHub`,
    bg: `${title} - Настаняване в ${area}${guests} - ChalkidikiHub`,
    ru: `${title} - Жильё в ${area}${guests} - ChalkidikiHub`,
    ro: `${title} - Cazare în ${area}${guests} - ChalkidikiHub`,
    sr: `${title} - Smeštaj u ${area}${guests} - ChalkidikiHub`,
  };
  return templates[locale] || templates.el;
}

async function fetchAll(table, fields) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${fields.join(',')}&limit=10000`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  return r.json();
}

async function patch(table, slug, payload) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(payload),
  });
  return r.ok;
}

async function processBeaches() {
  console.log('\n=== BEACHES ===');
  const rows = await fetchAll('beaches', ['slug', 'name_el', 'area', 'image_url', 'image_alt', 'features']);
  const todo = rows.filter(r => r.image_url && !(r.image_alt && r.image_alt.length > 5));
  console.log(`${todo.length} beaches need alt text (of ${rows.length} total)`);

  for (const beach of todo) {
    const alt_el = genBeachAlt(beach, 'el');
    if (DRY) {
      console.log(`  [DRY] ${beach.slug}: ${alt_el}`);
      continue;
    }
    const ok = await patch('beaches', beach.slug, { image_alt: alt_el, updated_at: new Date().toISOString() });
    if (!ok) console.error(`  FAIL ${beach.slug}`);
  }
  console.log(`  ${DRY ? 'Would update' : 'Updated'} ${todo.length} beaches`);
}

async function processListings() {
  console.log('\n=== LISTINGS ===');
  const rows = await fetchAll('listings', ['slug', 'title_el', 'title_en', 'title_de', 'title_bg', 'title_ru', 'title_ro', 'title_sr', 'area', 'image_url', 'image_alt', 'image_alt_el', 'image_alt_en', 'image_alt_de', 'image_alt_bg', 'image_alt_ru', 'image_alt_ro', 'image_alt_sr', 'guests_max']);
  const todo = rows.filter(r => r.image_url && !(r.image_alt_el && r.image_alt_el.length > 5));
  console.log(`${todo.length} listings need alt text (of ${rows.length} total)`);

  for (const listing of todo) {
    const payload = { updated_at: new Date().toISOString() };
    for (const locale of ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr']) {
      payload[`image_alt_${locale}`] = genListingAlt(listing, locale);
    }
    if (DRY) {
      console.log(`  [DRY] ${listing.slug}: ${payload.image_alt_el}`);
      continue;
    }
    const ok = await patch('listings', listing.slug, payload);
    if (!ok) console.error(`  FAIL ${listing.slug}`);
  }
  console.log(`  ${DRY ? 'Would update' : 'Updated'} ${todo.length} listings`);
}

(async () => {
  console.log(`Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);
  if (!TABLE_FILTER || TABLE_FILTER === 'beaches') await processBeaches();
  if (!TABLE_FILTER || TABLE_FILTER === 'listings') await processListings();
})();
