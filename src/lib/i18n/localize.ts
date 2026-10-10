import { fallbackChain, locales, type Locale } from '@/i18n/config';

export type LocalizedText = {
  text: string;
  /** Locale the text actually came from. */
  from: Locale | null;
  /** True when the text is genuinely in the requested locale. */
  native: boolean;
};

type Row = Record<string, unknown>;

const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * Reads `${field}_${locale}` with the locale's fallback chain and reports
 * whether the result is native. Callers that only need the string use
 * `pick()`; SEO code uses the `native` flag to decide indexability.
 */
export function localize(row: Row | null | undefined, field: string, locale: Locale): LocalizedText {
  if (!row) return { text: '', from: null, native: false };
  // Junk URLs (e.g. /apple-touch-icon.png) reach [locale] pages before the
  // layout 404s them; never crash on an unknown locale.
  for (const candidate of fallbackChain[locale] ?? fallbackChain.en) {
    const value = clean(row[`${field}_${candidate}`]);
    if (value) return { text: value, from: candidate, native: candidate === locale };
  }
  return { text: '', from: null, native: false };
}

export const pick = (row: Row | null | undefined, field: string, locale: Locale) =>
  localize(row, field, locale).text;

/** All seven values of a localized column, for hreflang-aware components. */
export function allLocales(row: Row, field: string): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, clean(row[`${field}_${l}`])])) as Record<Locale, string>;
}

/** Column list for a Supabase select: `name_el, name_en, …`. */
export const localizedColumns = (...fields: string[]) =>
  fields.flatMap((f) => locales.map((l) => `${f}_${l}`)).join(', ');
