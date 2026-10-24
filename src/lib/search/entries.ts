import 'server-only';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getActivities, getArticles, getBeaches, getListings, getRestaurants, getVillages } from '@/lib/db/content';
import { allLocales, pick } from '@/lib/i18n/localize';
import { displayName } from '@/lib/content/nearby';
import { AREA_NAMES, PLACE_NAMES } from '@/lib/content/place-names';
import { norm } from './normalize';

export type SearchKind = 'area' | 'village' | 'beach' | 'listing' | 'restaurant' | 'activity' | 'article';

/** One searchable page. `keys` are normalised names in every language; `boost` ranks places above businesses. */
export type SearchEntry = { kind: SearchKind; href: string; title: string; sub: string; image: string | null; keys: string[]; boost: number };

/** Everything the site search can find, for one locale. Shared by /search and the as-you-type suggestions. */
export async function searchEntries(locale: Locale): Promise<SearchEntry[]> {
  const [beaches, villages, restaurants, activities, listings, articles] = await Promise.all([
    getBeaches(), getVillages(), getRestaurants(), getActivities(), getListings(), getArticles(),
  ]);
  const area = (a: string | null | undefined) => (a && a in AREA_NAMES ? AREA_NAMES[a as keyof typeof AREA_NAMES][locale] : '');
  const keys = (names: Array<string | null | undefined>) => [...new Set(names.filter((n): n is string => Boolean(n)).map(norm).filter(Boolean))];
  const out: SearchEntry[] = [];

  for (const a of AREA_SLUGS) {
    out.push({ kind: 'area', href: `/areas/${a}`, title: AREA_NAMES[a][locale], sub: '', image: null, keys: keys(Object.values(AREA_NAMES[a])), boost: 1.5 });
  }
  for (const v of villages) {
    if (v.slug === 'pyrgadikia-mainland') continue;
    const names = PLACE_NAMES[v.slug] ? Object.values(PLACE_NAMES[v.slug]) : Object.values(allLocales(v, 'name'));
    out.push({ kind: 'village', href: `/places/${v.slug}`, title: displayName(v, locale, 'village'), sub: area(v.area), image: v.image_url, keys: keys(names), boost: 1 });
  }
  for (const b of beaches) out.push({ kind: 'beach', href: `/beaches/${b.slug}`, title: displayName(b, locale, 'beach'), sub: area(b.area), image: b.image_url, keys: keys(Object.values(allLocales(b, 'name'))), boost: 0.6 });
  for (const l of listings) out.push({ kind: 'listing', href: `/listings/${l.slug}`, title: displayName(l, locale, 'listing'), sub: area(l.area), image: l.cover_url, keys: keys([...Object.values(allLocales(l, 'title')), l.location_name]), boost: 0.3 });
  for (const r of restaurants) out.push({ kind: 'restaurant', href: `/restaurants/${r.slug}`, title: displayName(r, locale, 'restaurant'), sub: area(r.area), image: r.image_url, keys: keys([...Object.values(allLocales(r, 'name')), r.slug.replace(/-/g, ' ')]), boost: 0.2 });
  for (const a of activities) out.push({ kind: 'activity', href: `/activities/${a.slug}`, title: displayName(a, locale, 'activity'), sub: area(a.area), image: a.image_url, keys: keys(Object.values(allLocales(a, 'name'))), boost: 0.2 });
  for (const a of articles) out.push({ kind: 'article', href: `/blog/${a.slug}`, title: pick(a, 'title', locale), sub: '', image: a.image_url, keys: keys([pick(a, 'title', locale)]), boost: -0.5 });
  return out;
}
