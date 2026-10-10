import type { Locale } from '@/i18n/config';
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
  /** Count of real items a list/hub page shows (0 for detail pages). */
  itemCount?: number;
};

export type QualityVerdict = { indexable: boolean; reasons: string[] };

export const MIN_WORDS = {
  detail: 120,
  hub: 80,
  article: 400,
} as const;

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
  if (words < MIN_WORDS[kind]) reasons.push(`thin:${words}<${MIN_WORDS[kind]}`);
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
    { body: body.text, nativeBody: body.native, hasImage: Boolean(row.image_url) },
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

