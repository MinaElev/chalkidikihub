import 'server-only';
import { locales, type Locale } from '@/i18n/config';
import {
  AREA_SLUGS, getActivities, getArticles, getBeaches, getEvents, getListings, getRestaurants, getVillages,
} from '@/lib/db/content';
import { nearest, type LatLng } from '@/lib/geo';
import { publicDb } from '@/lib/supabase/clients';
import { bestGuides, costs, fromCities, guides, indexableLocales as editorialLocales, itineraries } from '@/lib/editorial';
import { KEPT_FEATURES, KEPT_RESTAURANT_CATEGORIES } from './redirects';
import { hostLocales, indexableIn, nearbyListPasses } from './quality';
import { SITE_URL } from './site';
import { activityIndex, articleIndex, beachIndex, eventIndex, listingIndex, restaurantIndex, villageIndex } from './indexability';
import { MONASTERIES } from '@/content/editorial/monasteries';
import { bestIndexable, loadBest } from '@/lib/content/best';
import { AUTHOR_LIST } from '@/content/authors';

/**
 * Every URL the site wants indexed, with the locales it is indexable in.
 * The sitemap is generated from this; detail pages read the same
 * indexability maps (lib/seo/indexability.ts) in generateMetadata, so a URL
 * is never in the sitemap while carrying noindex.
 */

/** `images`: the page's own photo, listed in the sitemap so Google Images finds it (image sitemap extension). */
export type Entry = { path: string; locales: Locale[]; lastModified?: string; priority: number; images?: string[] };

const ALL = [...locales];
/** The page's passing locales, filtered by the site-wide rules (proven URLs, proven-only locales). */
const withProven = (path: string, ls: readonly Locale[]) => indexableIn(path, ls);

export async function inventory(): Promise<Entry[]> {
  const entries: Entry[] = [];
  const hub = (path: string, priority = 0.8) => entries.push({ path, locales: withProven(path, ALL), priority });

  ['/', '/beaches', '/places', '/listings', '/restaurants', '/activities', '/blog', '/events', '/areas', '/guide', '/from', '/mount-athos', '/mount-athos/monasteries', '/faq', '/ev-chargers']
    .forEach((p) => hub(p, p === '/' ? 1 : 0.8));
  ['/mount-athos/how-to-visit', '/mount-athos/getting-there', '/mount-athos/accommodation', '/mount-athos/daily-life', '/mount-athos/hiking', '/mount-athos/history']
    .forEach((p) => hub(p, 0.6));
  ['/about', '/for-owners', '/editorial-policy'].forEach((p) => hub(p, 0.4));
  // Written in Greek and English only (layout sets the same locales).
  entries.push({ path: '/for-owners/services', locales: withProven('/for-owners/services', ['el', 'en']), priority: 0.4 });
  // The map is mostly a client widget: indexed only in the locales app/[locale]/map/layout.tsx names, plus proven ones.
  entries.push({ path: '/map', locales: withProven('/map', ['el', 'en']), priority: 0.5 });
  AREA_SLUGS.forEach((a) => hub(`/areas/${a}`, 0.8));
  KEPT_FEATURES.forEach((f) => hub(`/beaches/feature/${f}`, 0.6));
  AREA_SLUGS.forEach((a) => hub(`/beaches/area/${a}`, 0.7));
  KEPT_RESTAURANT_CATEGORIES.forEach((c) => hub(`/restaurants/category/${c}`, 0.6));
  AUTHOR_LIST.forEach((a) => hub(`/authors/${a.username}`, 0.3));
  MONASTERIES.forEach((m) => hub(`/mount-athos/monasteries/${m.slug}`, 0.5));

  const [beaches, restaurants, activities, villages, listings, articles, events, idx] = await Promise.all([
    getBeaches(), getRestaurants(), getActivities(), getVillages(), getListings(), getArticles(), getEvents(),
    Promise.all([beachIndex(), restaurantIndex(), activityIndex(), articleIndex(), eventIndex(), villageIndex(), listingIndex()]),
  ]);
  const [bI, rI, aI, artI, eI, vI, lI] = idx;

  const photo = (r: { image_url?: string | null; cover_url?: string | null }) => {
    const u = r.cover_url ?? r.image_url;
    return u ? [u.startsWith('/') ? `${SITE_URL}${u}` : u] : undefined;
  };
  const detail = (base: string, rows: Array<{ slug: string; updated_at?: string; image_url?: string | null; cover_url?: string | null }>, map: Record<string, Locale[]>, priority: number) => {
    for (const r of rows) {
      const path = `${base}/${r.slug}`;
      entries.push({ path, locales: withProven(path, map[r.slug] ?? []), lastModified: r.updated_at, priority, images: photo(r) });
    }
  };
  detail('/beaches', beaches, bI, 0.7);
  detail('/restaurants', restaurants, rI, 0.6);
  detail('/activities', activities, aI, 0.6);
  detail('/blog', articles, artI, 0.7);
  detail('/events', events as unknown as Array<{ slug: string; updated_at?: string }>, eI, 0.5);
  detail('/listings', listings.filter((l) => !l.is_closed), lI, 0.7);

  for (const v of villages) {
    if (v.slug === 'pyrgadikia-mainland') continue;
    detail('/places', [v], vI, 0.8);
    // Same rule the page applies in its metadata (features/village/nearby.tsx).
    const lists: Record<'beaches' | 'restaurants' | 'activities', LatLng[]> = { beaches, restaurants, activities };
    for (const kind of ['beaches', 'restaurants', 'activities'] as const) {
      const passes = nearbyListPasses(kind, nearest(v, lists[kind], 99, 25).map((n) => n.km));
      const path = `/places/${v.slug}/${kind}`;
      entries.push({ path, locales: withProven(path, passes ? ALL : []), priority: kind === 'beaches' ? 0.8 : 0.6 });
    }
  }

  const families = [
    ['/guide', guides(), true],
    ['/costs', costs(), false],
    ['/from', fromCities(), false],
    ['/itinerary', itineraries(), false],
  ] as const;
  for (const [base, list, overrides] of families) {
    for (const doc of list) {
      const path = `${base}/${doc.slug}`;
      entries.push({ path, locales: withProven(path, await editorialLocales(doc, overrides)), priority: 0.6 });
    }
  }
  for (const g of bestGuides()) {
    const path = `/best/${g.slug}`;
    const best = await loadBest(g.slug);
    entries.push({ path, locales: withProven(path, bestIndexable(g.slug, best?.items.length ?? 0)), priority: 0.6 });
  }

  // Owners' public pages: only hosts with at least two published listings (as in v3).
  const { data: hosts } = await publicDb()
    .from('profiles')
    .select('id, public_slug, updated_at, bio_el, bio_en, bio_de, bio_ro, bio_bg, bio_sr, bio_ru')
    .eq('public_page_enabled', true)
    .not('public_slug', 'is', null);
  for (const h of hosts ?? []) {
    if (listings.filter((l) => l.owner_id === h.id).length >= 2) {
      const bio = Object.fromEntries(ALL.map((l) => [l, (h as Record<string, unknown>)[`bio_${l}`] as string | null]));
      const path = `/host/${h.public_slug}`;
      entries.push({ path, locales: withProven(path, hostLocales(bio)), lastModified: h.updated_at ?? undefined, priority: 0.5 });
    }
  }

  return entries.filter((e) => e.locales.length > 0);
}
