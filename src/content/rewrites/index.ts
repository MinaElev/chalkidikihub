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

/** Returns the row with rewritten description_* fields, if a rewrite exists. */
export function withRewrite<T extends Record<string, unknown>>(table: string, row: T, field = 'description'): T {
  const rw = REWRITES[table]?.[String(row.slug)];
  if (!rw) return row;
  const patch = Object.fromEntries(Object.entries(rw).filter(([, v]) => v).map(([l, v]) => [`${field}_${l}`, v]));
  return { ...row, ...patch };
}
