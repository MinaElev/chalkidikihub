export const locales = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'el';

// Locales the site actively promotes to users + search engines.
// The other (`hidden`) locales remain routable so existing inbound links and
// translated content keep working, but they are excluded from sitemap, hreflang,
// language switcher UI, and emit a noindex robots tag — keeping crawl budget
// focused on the languages we can stand behind quality-wise. Expand this list
// once a hidden language has gone through human review.
export const publicLocales: readonly Locale[] = ['el', 'en', 'de'];
export const hiddenLocales: readonly Locale[] = locales.filter(
  (l) => !publicLocales.includes(l),
);

export const isPublicLocale = (locale: string): locale is Locale =>
  (publicLocales as readonly string[]).includes(locale);

export const localeNames: Record<Locale, string> = {
  el: 'Ελληνικά',
  en: 'English',
  de: 'Deutsch',
  bg: 'Български',
  ru: 'Русский',
  ro: 'Română',
  sr: 'Srpski',
};

export const localeFlags: Record<Locale, string> = {
  el: '🇬🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  bg: '🇧🇬',
  ru: '🇷🇺',
  ro: '🇷🇴',
  sr: '🇷🇸',
};
