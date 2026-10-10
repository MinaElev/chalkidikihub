import type { Locale } from '@/i18n/config';
import restaurants1 from './restaurants-1.json';
import activities1 from './activities-1.json';
import villages1 from './villages-1.json';
import beaches1 from './beaches-1.json';
import monasteries1 from './monasteries-1.json';
import events1 from './events-1.json';
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
  // Stored highlights were generic ("Impressive architecture") or wrong ("Relics of Saint Dionysius").
  monasteries: Object.fromEntries(
    Object.entries(monasteryHighlights).map(([slug, h]) => [slug, Object.fromEntries(Object.entries(h).map(([l, v]) => [`highlights_${l}`, v]))]),
  ),
};

export function withRowFix<T extends Record<string, unknown>>(table: string, row: T): T {
  const fix = ROW_FIXES[table]?.[String(row.slug)];
  return fix ? { ...row, ...fix } : row;
}

/** Returns the row with rewritten description_* fields (and row fixes), if any exist. */
export function withRewrite<T extends Record<string, unknown>>(table: string, row: T, field = 'description'): T {
  row = withRowFix(table, row);
  const rw = REWRITES[table]?.[String(row.slug)];
  if (!rw) return row;
  const patch = Object.fromEntries(Object.entries(rw).filter(([, v]) => v).map(([l, v]) => [`${field}_${l}`, v]));
  return { ...row, ...patch };
}
