import { locales, type Locale } from '@/i18n/config';

/**
 * The sitemap is split into one file per (locale × page family), listed in a
 * sitemap index at /sitemap.xml. Search Console reports indexing per submitted
 * sitemap, so this turns "3,454 crawled, not indexed" into a rate per family
 * and language ("de-places-lists: 31% indexed") that can be acted on.
 */
export const SITEMAP_GROUPS = [
  'hubs', 'places', 'places-lists', 'beaches', 'restaurants', 'activities',
  'listings', 'blog', 'guides', 'athos', 'other',
] as const;
export type SitemapGroup = (typeof SITEMAP_GROUPS)[number];

/** Family of an unprefixed path, e.g. "/places/afytos/beaches" → "places-lists". */
export function sitemapGroup(path: string): SitemapGroup {
  const [first, second, third] = path.split('/').filter(Boolean);
  if (!first || !second) return 'hubs';
  if (first === 'places') return third ? 'places-lists' : 'places';
  if (first === 'beaches' || first === 'restaurants' || first === 'activities' || first === 'listings' || first === 'blog') return first;
  if (['guide', 'best', 'costs', 'from', 'itinerary', 'areas'].includes(first)) return 'guides';
  if (first === 'mount-athos') return 'athos';
  return 'other';
}

export const sitemapId = (locale: Locale, group: SitemapGroup) => `${locale}-${group}`;

export function parseSitemapId(id: string): { locale: Locale; group: SitemapGroup } | null {
  const i = id.indexOf('-');
  const locale = id.slice(0, i) as Locale;
  const group = id.slice(i + 1) as SitemapGroup;
  return locales.includes(locale) && SITEMAP_GROUPS.includes(group) ? { locale, group } : null;
}
