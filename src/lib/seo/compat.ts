import { localeUrl as url, DEFAULT_OG_IMAGE } from './site';
import { SITE_NAME } from './site';
import type { Locale } from '@/i18n/config';

/**
 * v3 helper signatures, kept for the hand-written Mount Athos pages that
 * were ported verbatim. New code uses lib/seo/metadata.ts.
 */
export function localeUrl(locale: string, path = ''): string {
  return url(locale as Locale, path ? `/${path.replace(/^\//, '')}` : '/');
}

export function finalizeTitle(raw: string): string {
  const base = (raw || '').replace(/\s+/g, ' ').trim();
  const withBrand = `${base} | ${SITE_NAME}`;
  if (withBrand.length <= 60) return withBrand;
  if (base.length <= 60) return base;
  const cut = base.slice(0, 59);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export const SOCIAL_LINKS: string[] = [
  process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/groups/1738995400608595',
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/chalkidikihub/',
].filter(Boolean) as string[];

/** v3 dynamic OG images are replaced by the page's own photo or the site default. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- v3 call sites pass (title, type)
export const ogImageUrl = (..._args: unknown[]) => DEFAULT_OG_IMAGE;

import { buildMetadata } from './metadata';
export function collectionMeta(opts: { titles: Record<string, string>; descriptions: Record<string, string>; path: string; locale: string; ogType?: string; mdSection?: string; indexableLocales?: readonly Locale[] }) {
  const locale = opts.locale as Locale;
  return buildMetadata({
    locale,
    path: `/${opts.path.replace(/^\//, '')}`,
    title: opts.titles[locale] || opts.titles.en,
    description: opts.descriptions[locale] || opts.descriptions.en,
    indexableLocales: opts.indexableLocales,
  });
}
