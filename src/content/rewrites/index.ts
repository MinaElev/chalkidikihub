import type { Locale } from '@/i18n/config';
import { publicSlug } from './slug-renames';
import restaurants1 from './restaurants-1.json';
import activities1 from './activities-1.json';
import villages1 from './villages-1.json';
import beaches1 from './beaches-1.json';
import monasteries1 from './monasteries-1.json';
import events1 from './events-1.json';
import blogArticles1 from './blog_articles-1.json';
import listings1 from './listings-1.json';
import monasteryHighlights from './monasteries-highlights.json';

/**
 * Editorial rewrites that replace the stored description_* text.
 *
 * v3's texts were AI-generated with factual errors (places 25–60 km away
 * presented as nearby, invented prices, stock phrases — see
 * audit/content-audit.md). Rewrites live here, in the repo, so they can be
 * reviewed and so v4 uses them immediately without touching the database the
 * live v3 site still reads. `scripts/apply-rewrites.mjs` copies them into the
 * database once approved.
 */
export type Rewrite = Partial<Record<Locale, string>>;

const merge = (...parts: Array<Record<string, Rewrite>>) => Object.assign({}, ...parts) as Record<string, Rewrite>;

export const REWRITES: Record<string, Record<string, Rewrite>> = {
  restaurants: merge(restaurants1),
  activities: merge(activities1),
  villages: merge(villages1),
  beaches: merge(beaches1),
  monasteries: merge(monasteries1),
  events: merge(events1),
  blog_articles: merge(blogArticles1),
  // Owner texts: only the AI-added nearby/distance lines were corrected (OSRM road distances).
  listings: merge(listings1),
};

/**
 * Stored fields that are plainly wrong — a scraped category title instead of
 * the business name, an English name in the Greek column, coordinates on the
 * wrong peninsula. Applied everywhere a row is read, cards included.
 */
export const ROW_FIXES: Record<string, Record<string, Record<string, string | number>>> = {
  restaurants: {
    'cafe-kleio': { name_en: 'Cafe Kleio' },
    'macaw-tropical-bar': { name_en: 'Macaw Tropical Bar' },
    'avra-restaurant': { name_en: 'Avra Restaurant' },
    'nami-brunch-house': { name_en: 'NAMI the brunch house' },
    'white-season-beach-bar-nea-skioni': { name_en: 'White Season Beach Bar', name_el: 'White Season Beach Bar' },
    // Machine-translated brand names: keep the Greek name, transliterated.
    'tzitzikas-porto-koufo': { name_en: 'Tzitzikas' },
    'to-ellinikon-hanioti': { name_en: 'To Ellinikon' },
    'pente-vimata-stin-ammo': { name_el: '5 Βήματα στην Άμμο' },
  },
  activities: {
    'church-of-agios-antonios': { name_el: 'Εκκλησία του Αγίου Αντωνίου', name_en: 'Church of Agios Antonios', name_de: 'Kirche Agios Antonios' },
    'viewpoint-of-mount-athos': {
      name_el: 'Θέα προς το Άγιο Όρος',
      name_en: 'Mount Athos viewpoint',
      name_de: 'Aussichtspunkt mit Blick auf den Athos',
      name_ro: 'Punct de belvedere spre Muntele Athos',
      name_bg: 'Площадка с изглед към Света гора',
      name_sr: 'Vidikovac sa pogledom na Svetu Goru',
      name_ru: 'Смотровая площадка с видом на Афон',
    },
    // Stored point was on Kassandra; the trips leave from Neos Marmaras harbour.
    'neos-marmaras-sailing-sithonia': { latitude: 40.0931, longitude: 23.7703 },
  },
  beaches: {
    // Ammouliani beaches: area athos, like the island.
    'tsaska-mainland': { area: 'athos' },
    'limanaki-athos': { area: 'athos' },
    'mousiou-athos': { area: 'athos' },
    'saint-george-athos': { area: 'athos' },
    'kalopigado-mainland': { area: 'athos' },
    'limani-athos': { area: 'athos' },
    'porto-agio-athos': { area: 'athos' },
    'karagatsia-mainland': { area: 'athos' },
    'faka-mainland': { area: 'athos' },
    'alikes-beach-sithonia': { area: 'athos' },
    // Coordinates checked against OpenStreetMap (2026-10): Karidi sat 1.8 km off, Komitsa on Ierissos town.
    'karidi-sithonia': { latitude: 40.19349, longitude: 23.80774 },
    'komitsa-athos': { latitude: 40.37758, longitude: 23.96471 },
    // Greek column held Latin script, stray translations ("(Orange)") or misspellings.
    'achlada-beach-sithonia': { name_el: 'Παραλία Αχλάδα', name_bg: 'Плаж Ахлада' },
    'linaraki-beach-sithonia': { name_el: 'Παραλία Λιναράκι' },
    'akti-linaraki-beach-sithonia': { name_el: 'Ακτή Λιναράκι', name_ru: 'Пляж Акти Линараки' },
    'platania-beach-sithonia': { name_el: 'Παραλία Πλατάνια', name_ru: 'Пляж Платания' },
    'diaporti-beach-sithonia': { name_el: 'Παραλία Διαπόρτι' },
    'mikri-elia-beach-sithonia': { name_el: 'Παραλία Μικρή Ελιά', name_bg: 'Плаж Микри Елия' },
    'marathias-beach-sithonia': { name_el: 'Παραλία Μαραθιάς', name_bg: 'Плаж Маратиас' },
    'valti-beach-sithonia': { name_el: 'Παραλία Βαλτί', name_bg: 'Плаж Валти' },
    'tourkolimnionas-beach-sithonia': { name_el: 'Παραλία Τουρκολίμνιωνας' },
    'lemos-beach-sithonia': { name_bg: 'Плаж Лемос', name_ru: 'Пляж Лемос' },
    'brounou-beach-sithonia': { name_bg: 'Плаж Бруну', name_ru: 'Пляж Бруну' },
    'white-beach-sithonia': { name_el: 'White Beach', name_de: 'White Beach', name_ro: 'White Beach', name_bg: 'White Beach', name_sr: 'White Beach', name_ru: 'White Beach' },
    'portokali-sithonia': { name_el: 'Πορτοκάλι', name_en: 'Portokali', name_de: 'Portokali', name_ro: 'Portokali', name_bg: 'Портокали', name_sr: 'Portokali', name_ru: 'Портокали' },
    'prassou-beach-athos': { name_bg: 'Плаж Прасу (Робинзон)', name_sr: 'Plaža Prasu (Robinzon)', name_ru: 'Пляж Прасу (Робинзон)' },
    'paralia-chanoti-grecotel-sithonia': {
      name_el: 'Παραλία Χανιώτη (Grecotel)', name_en: 'Hanioti Beach (Grecotel)', name_de: 'Strand von Hanioti (Grecotel)', name_ro: 'Plaja Hanioti (Grecotel)',
      name_bg: 'Плаж Ханиоти (Grecotel)', name_sr: 'Plaža Hanioti (Grecotel)', name_ru: 'Пляж Ханиоти (Grecotel)',
    },
    'agjio-mama-kassandra': {
      name_el: 'Παραλία Αγίου Μάμαντος', name_en: 'Agios Mamas Beach', name_de: 'Strand Agios Mamas', name_ro: 'Plaja Agios Mamas',
      name_bg: 'Плаж Агиос Мамас', name_sr: 'Plaža Agios Mamas', name_ru: 'Пляж Агиос Мамас',
    },
  },
  // Area field: these places are on the mainland (nearest villages, OSM-checked), not Kassandra/Sithonia.
  listings: {
    'spiti-by-tre-beacj-nea-triglia-halkidiki': { area: 'mainland' },
    'elasa-seaside-apartment-near-sea-nea-kallikratia-nea-kallikratia': { area: 'mainland' },
    'spiti-konta-sti-thalassa-nea-triglia': { area: 'mainland' },
    'halikidiki-family-house-to-enjoy-by-the-beach-akti-mikiverna': { area: 'mainland' },
    'hotel-paraktio-nea-kallikrateia': { area: 'mainland' },
    'akti-liakada-hotel-gerakini': { area: 'mainland' },
    'sea-star-lux-trikorfo-apartments-sitonia-trikorfo-beach-sithonia': { area: 'mainland' },
    'monokatoikia-stin-paralia-40-2667222-23-184278nea-plagia-chalkidikis': { area: 'mainland' },
    'paratheristiki-katoikia-konta-stin-thalassa-galini-kallikrateias': { area: 'mainland' },
    'terra-bianca-pool-villa-gerakini': { area: 'mainland' },
    'xenodocheio-gerakini': { area: 'mainland' },
    'spiti-me-thea-thalassa-nea-triglia': { area: 'mainland' },
    'michael-apartment-kallikrateia': { area: 'mainland' },
    'psakoudia-stay-psakoudia': { area: 'mainland' },
    'spiti-me-a-avli-kalikratia-nea-kalikrateia-chalkidikis': { area: 'mainland' },
  },
  villages: {
    // Ammouliani sits off the Athos peninsula, grouped with it everywhere else on the site.
    ammouliani: { area: 'athos' },
    // Stored as "Σανός/Sanos": the village is Stanos (Δ.Ε. Αρναίας); coordinates were right.
    sanos: { name_el: 'Στανός', name_en: 'Stanos', name_de: 'Stanos', name_ro: 'Stanos', name_bg: 'Станос', name_sr: 'Stanos', name_ru: 'Станос' },
    // Stored as "Βραστά" with coordinates at Nea Vrasna (Thessaloniki); the village is Vrastama, Polygyros.
    vrasta: {
      name_el: 'Βράσταμα', name_en: 'Vrastama', name_de: 'Vrastama', name_ro: 'Vrastama', name_bg: 'Врастама', name_sr: 'Vrastama', name_ru: 'Врастама',
      latitude: 40.37143, longitude: 23.53533,
    },
    // Coordinates 1.5–17 km off; corrected to the OpenStreetMap village node (2026-10).
    'nea-gonia': { latitude: 40.36263, longitude: 23.09452 },
    palaiokastro: { latitude: 40.44122, longitude: 23.43474 },
    'agios-prodromos': { latitude: 40.46594, longitude: 23.37946 },
    neohori: { latitude: 40.50808, longitude: 23.67905 },
    lakkoma: { latitude: 40.39089, longitude: 23.05643 },
    'nea-iraklia': { latitude: 40.34621, longitude: 23.01517 },
    'nea-plagia': { latitude: 40.26475, longitude: 23.20205 },
    palaiohori: { latitude: 40.49257, longitude: 23.64965 },
    sozopoli: { latitude: 40.27842, longitude: 23.14727 },
    doumbia: { latitude: 40.51261, longitude: 23.35098 },
    siviri: { latitude: 40.03653, longitude: 23.36145 },
    vavdos: { latitude: 40.42634, longitude: 23.32423 },
    xiropotamo: { latitude: 40.36398, longitude: 23.88595 },
    'agios-pavlos': { latitude: 40.34121, longitude: 23.06178 },
    sarti: { latitude: 40.09505, longitude: 23.97836 },
    metagitsi: { latitude: 40.32426, longitude: 23.65563 },
    varvara: { latitude: 40.56873, longitude: 23.65834 },
  },
  // Stored highlights were generic ("Impressive architecture") or wrong ("Relics of Saint Dionysius").
  monasteries: Object.fromEntries(
    Object.entries(monasteryHighlights).map(([slug, h]) => [slug, Object.fromEntries(Object.entries(h).map(([l, v]) => [`highlights_${l}`, v]))]),
  ),
};

export function withRowFix<T extends Record<string, unknown>>(table: string, row: T): T {
  const slug = String(row.slug);
  const fix = ROW_FIXES[table]?.[slug];
  const renamed = publicSlug(table, slug);
  if (!fix && renamed === slug) return row;
  return { ...row, ...fix, slug: renamed };
}

/** Returns the row with rewritten description_* fields (and row fixes), if any exist. */
export function withRewrite<T extends Record<string, unknown>>(table: string, row: T, field = 'description'): T {
  const original = String(row.slug);
  row = withRowFix(table, row);
  const rw = REWRITES[table]?.[original];
  if (!rw) return row;
  const patch = Object.fromEntries(Object.entries(rw).filter(([, v]) => v).map(([l, v]) => [`${field}_${l}`, v]));
  return { ...row, ...patch };
}
