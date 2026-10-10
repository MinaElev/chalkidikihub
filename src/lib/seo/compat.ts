import { localeUrl as url } from './site';
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
