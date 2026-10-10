export const locales = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'el';

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** BCP-47 tags for <html lang>, hreflang and Intl formatting. */
export const htmlLang: Record<Locale, string> = {
  el: 'el',
  en: 'en',
  de: 'de',
  ro: 'ro',
  bg: 'bg',
  sr: 'sr-Latn',
  ru: 'ru',
};

export const ogLocale: Record<Locale, string> = {
  el: 'el_GR',
  en: 'en_GB',
  de: 'de_DE',
  ro: 'ro_RO',
  bg: 'bg_BG',
  sr: 'sr_RS',
  ru: 'ru_RU',
};

export const localeNames: Record<Locale, string> = {
  el: 'Ελληνικά',
  en: 'English',
  de: 'Deutsch',
  ro: 'Română',
  bg: 'Български',
  sr: 'Srpski',
  ru: 'Русский',
};

/**
 * Order in which a missing translation is looked for. A page whose main text
 * only resolves through a fallback is NOT indexed in that locale (see
 * lib/seo/quality.ts) — showing English under /de/ is a usability fallback,
 * never something we advertise to search engines.
 */
export const fallbackChain: Record<Locale, readonly Locale[]> = {
  el: ['el', 'en'],
  en: ['en', 'el'],
  de: ['de', 'en', 'el'],
  ro: ['ro', 'en', 'el'],
  bg: ['bg', 'en', 'el'],
  sr: ['sr', 'en', 'el'],
  ru: ['ru', 'en', 'el'],
};
