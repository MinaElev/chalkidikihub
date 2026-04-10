export const locales = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr', 'sr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'el';

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
