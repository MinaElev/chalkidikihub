import { defaultLocale, locales, type Locale } from '@/i18n/config';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr').replace(/\/$/, '');
export const SITE_NAME = 'ChalkidikiHub';
export const DEFAULT_OG_IMAGE = '/images/hero/halkidiki-hero.webp';

/** Absolute URL for a locale + unprefixed path ("/beaches/x"). Greek is unprefixed. */
export function localeUrl(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path;
  return locale === defaultLocale ? `${SITE_URL}${clean || '/'}` : `${SITE_URL}/${locale}${clean}`;
}

/** Same as localeUrl but relative, for <Link>-free contexts like sitemaps of paths. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path;
  return locale === defaultLocale ? clean || '/' : `/${locale}${clean}`;
}

export function hreflangMap(path: string, indexable: readonly Locale[] = locales) {
  const languages: Record<string, string> = {};
  for (const l of indexable) languages[l === 'sr' ? 'sr-Latn' : l] = localeUrl(l, path);
  // x-default points at Greek when Greek is part of the cluster, else English.
  const xDefault = indexable.includes(defaultLocale) ? defaultLocale : indexable.includes('en') ? 'en' : indexable[0];
  if (xDefault) languages['x-default'] = localeUrl(xDefault, path);
  return languages;
}
