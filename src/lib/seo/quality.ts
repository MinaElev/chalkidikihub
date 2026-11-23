import { locales, type Locale } from '@/i18n/config';
import { localize } from '@/lib/i18n/localize';
import proven from '@/content/proven-urls.json';
import { localePath } from './site';

/**
 * The quality gate. A page is advertised to search engines (index + sitemap +
 * hreflang) only when it passes; otherwise it still renders for visitors but
 * carries `noindex, follow` and stays out of the sitemap.
 *
 * This is what keeps the site at "only unique, quality pages" without anyone
 * having to remember to noindex things: the 2026-10 audit found 44% of 7,064
 * URLs had zero impressions in 90 days, almost all of them pages that would
 * have failed these checks.
 */

export type QualityInput = {
  /** Main body text in the page locale (HTML or plain). */
  body: string;
  /** Whether the body is a genuine translation, not a fallback. */
  nativeBody: boolean;
  hasImage: boolean;
  /** Page locale; scales the word minimum (see WORD_FACTOR). */
  locale?: Locale;
  /** Count of real items a list/hub page shows (0 for detail pages). */
  itemCount?: number;
};

export type QualityVerdict = { indexable: boolean; reasons: string[] };

export const MIN_WORDS = {
  detail: 120,
  /** Restaurants/cafés: short factual copy (a café needs no 120-word essay); the page also carries hours, map, contacts and nearby beaches. Scaled per locale like every minimum (WORD_FACTOR). */
  venue: 55,
  hub: 80,
  article: 400,
} as const;

/**
 * Translations need more than the Greek original to earn a place in the index.
 * A Greek venue page answers local searches with 55 words; the same page in
 * German competes with every foreign-language guide to the area, and GSC
 * (2026-11) left most of the 55–79-word translations "crawled, not indexed".
 */
export const TRANSLATED_MIN_WORDS = { venue: 80 } as const;

/**
 * The same text takes fewer words in some languages (no articles, richer
 * inflection). Measured on our parallel 7-locale rewrites: ru runs ~20% and
 * sr ~15% shorter than en. The gate measures content, not tokens, so the word
 * minimum is scaled per locale. scripts/content-audit.mjs uses the same table.
 */
export const WORD_FACTOR: Record<Locale, number> = { el: 1, en: 1, de: 0.95, ro: 1, bg: 0.9, sr: 0.85, ru: 0.8 };

export const minWordsFor = (min: number, locale?: Locale) => Math.round(min * (locale ? WORD_FACTOR[locale] : 1));

export function wordCount(text: string): number {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function assessQuality(
  input: QualityInput,
  kind: keyof typeof MIN_WORDS,
  opts: { minItems?: number } = {},
): QualityVerdict {
  const reasons: string[] = [];
  if (!input.nativeBody) reasons.push('not-translated');
  const words = wordCount(input.body);
  const translated = input.locale !== undefined && input.locale !== 'el';
  const min = minWordsFor(translated && kind === 'venue' ? TRANSLATED_MIN_WORDS.venue : MIN_WORDS[kind], input.locale);
  if (words < min) reasons.push(`thin:${words}<${min}`);
  if (!input.hasImage) reasons.push('no-image');
  if (opts.minItems !== undefined && (input.itemCount ?? 0) < opts.minItems) {
    reasons.push(`few-items:${input.itemCount ?? 0}<${opts.minItems}`);
  }
  return { indexable: reasons.length === 0, reasons };
}

/** Convenience for the common "row with description_* + image_url" case. */
export function assessEntity(
  row: Record<string, unknown>,
  locale: Locale,
  field = 'description',
  kind: keyof typeof MIN_WORDS = 'detail',
): QualityVerdict {
  const body = localize(row, field, locale);
  return assessQuality(
    { body: body.text, nativeBody: body.native, hasImage: Boolean(row.image_url), locale },
    kind,
  );
}


const PROVEN = new Set(proven as string[]);

/**
 * URLs that earned clicks in the 90 days before the rewrite (GSC export in
 * audit/gsc-coverage-2026-09.csv). They stay indexable even if their text is
 * below the gate, so the rewrite never drops a page that already works —
 * improving them is the content team's job, de-indexing them is not.
 */
export function isProven(locale: Locale, path: string): boolean {
  return PROVEN.has(localePath(locale, path));
}

/**
 * Locales indexed only where they already earn clicks (plus the main hubs).
 * Russian: Google sends next to no Russian-language traffic to Halkidiki
 * (GSC 2026-11: Russia absent from the top countries) and had the lowest
 * index rate of all locales. The pages stay up for visitors, noindex.
 */
export const PROVEN_ONLY_LOCALES: readonly Locale[] = ['ru'];
const MAIN_HUBS = new Set(['/', '/beaches', '/places', '/listings', '/restaurants', '/activities', '/blog', '/areas', '/mount-athos']);

/**
 * Final say on where a page is indexable: the locales its own gate passed,
 * minus the proven-only locales, plus wherever it already earns clicks.
 * buildMetadata (robots/hreflang) and the sitemap both call this, so a URL is
 * never in the sitemap while its page says noindex, or the other way round.
 */
export function indexableIn(path: string, passing: readonly Locale[]): Locale[] {
  return locales.filter((l) =>
    isProven(l, path) || (passing.includes(l) && (!PROVEN_ONLY_LOCALES.includes(l) || MAIN_HUBS.has(path))),
  );
}

/**
 * "Beaches / restaurants / things to do near {village}" lists carry no text of
 * their own, so they are indexed only where the village really has several of
 * them close by. With a 25 km radius nearly every village passed, and the
 * activity lists showed the same handful of places (21 in total) under 64
 * village names in 7 languages — most of it "crawled, not indexed".
 */
export const NEARBY_GATE = {
  beaches: { radiusKm: 10, min: 5 },
  restaurants: { radiusKm: 10, min: 5 },
  activities: { radiusKm: 15, min: 5 },
} as const;

export function nearbyListPasses(kind: keyof typeof NEARBY_GATE, distancesKm: readonly number[]): boolean {
  const { radiusKm, min } = NEARBY_GATE[kind];
  return distancesKm.filter((km) => km <= radiusKm).length >= min;
}


/** Locales where a host (owner) page has its own text: the owner's bio in that language. */
export function hostLocales(bio: Partial<Record<Locale, string | null>>): Locale[] {
  return locales.filter((l) => Boolean(bio[l]?.trim()));
}
