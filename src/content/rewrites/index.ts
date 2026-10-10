import type { Locale } from '@/i18n/config';
import restaurants1 from './restaurants-1.json';

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
};

/**
 * Stored names that are plainly wrong (a scraped category title instead of the
 * business name). Applied everywhere a row is read, cards included.
 */
export const NAME_FIXES: Record<string, Record<string, Record<string, string>>> = {
  restaurants: {
    'cafe-kleio': { name_en: 'Cafe Kleio' },
    'macaw-tropical-bar': { name_en: 'Macaw Tropical Bar' },
  },
};

export function withNameFix<T extends Record<string, unknown>>(table: string, row: T): T {
  const fix = NAME_FIXES[table]?.[String(row.slug)];
  return fix ? { ...row, ...fix } : row;
}

/** Returns the row with rewritten description_* fields (and name fixes), if any exist. */
export function withRewrite<T extends Record<string, unknown>>(table: string, row: T, field = 'description'): T {
  row = withNameFix(table, row);
  const rw = REWRITES[table]?.[String(row.slug)];
  if (!rw) return row;
  const patch = Object.fromEntries(Object.entries(rw).filter(([, v]) => v).map(([l, v]) => [`${field}_${l}`, v]));
  return { ...row, ...patch };
}
