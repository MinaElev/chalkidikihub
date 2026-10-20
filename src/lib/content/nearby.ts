import 'server-only';
import { listingTitle } from './listing-title';
import type { Locale } from '@/i18n/config';
import { nearest, type LatLng } from '@/lib/geo';
import { pick } from '@/lib/i18n/localize';
import {
  getActivities, getBeaches, getListings, getRestaurants, getVillages,
  type ActivityCard, type BeachCard, type ListingCard, type RestaurantCard, type VillageCard,
} from '@/lib/db/content';
import { placeName } from './place-names';
import { brandName } from './translit';

/** How many items a "near X" page lists, and the radius its counts refer to. */
export const NEAR_LIMIT = 12;
export const NEAR_RADIUS_KM = 15;

export type Near<T> = { item: T; km: number };

export async function nearBeaches(origin: LatLng, limit = NEAR_LIMIT): Promise<Near<BeachCard>[]> {
  return nearest(origin, await getBeaches(), limit, 60);
}
export async function nearRestaurants(origin: LatLng, limit = NEAR_LIMIT): Promise<Near<RestaurantCard>[]> {
  return nearest(origin, await getRestaurants(), limit, 40);
}
export async function nearActivities(origin: LatLng, limit = NEAR_LIMIT): Promise<Near<ActivityCard>[]> {
  return nearest(origin, await getActivities(), limit, 60);
}
export async function nearListings(origin: LatLng, limit = 8, maxKm = 6): Promise<Near<ListingCard>[]> {
  return nearest(origin, (await getListings()).filter((l) => !l.is_closed), limit, maxKm);
}

/** Nearest other villages on the same peninsula. */
export async function nearVillages(village: VillageCard, limit = 6): Promise<Near<VillageCard>[]> {
  const all = (await getVillages()).filter(
    (v) => v.slug !== village.slug && v.area === village.area && v.slug !== 'pyrgadikia-mainland',
  );
  return nearest(village, all, limit);
}

/** The village an entity sits in or next to — used to name a beach's locality in every language. */
export async function closestVillage(point: LatLng, maxKm = 8): Promise<Near<VillageCard> | null> {
  const all = (await getVillages()).filter((v) => v.slug !== 'pyrgadikia-mainland');
  return nearest(point, all, 1, maxKm)[0] ?? null;
}

/** slug → localized name of the village each item sits next to (for card eyebrows). */
export async function closestVillagesFor(items: Array<LatLng & { slug: string }>, locale: Locale, maxKm = 8) {
  const villages = (await getVillages()).filter((v) => v.slug !== 'pyrgadikia-mainland');
  const map = new Map<string, string>();
  for (const it of items) {
    const v = nearest(it, villages, 1, maxKm)[0];
    if (v) map.set(it.slug, placeName(v.item.slug, locale, v.item));
  }
  return map;
}

export type EntityKind = 'beach' | 'restaurant' | 'activity' | 'listing' | 'village';

/**
 * Display name for any entity. Restaurants are businesses: their name is
 * never translated (v3 turned "Τζίτζικας" into "The Cricket"), only
 * transliterated from Greek for non-Greek readers.
 */
export function displayName(row: Record<string, unknown>, locale: Locale, kind?: EntityKind): string {
  if (kind === 'restaurant') return brandName(row.name_el as string, locale, (row.name_en as string) || String(row.slug));
  if (kind === 'village') return placeName(String(row.slug), locale, row);
  if (kind === 'listing') return listingTitle(row, locale);
  return pick(row, 'name', locale) || pick(row, 'title', locale) || String(row.slug);
}

/**
 * Ratings shown on cards. Beaches/activities/stays: only our own approved
 * reviews count. Restaurants: the stored figure is Google's, so it is shown
 * labelled as such and never emitted as schema.org aggregateRating
 * (third-party review snippets violate Google's structured-data policy).
 */
export function shownRating(row: Record<string, unknown>, kind: EntityKind) {
  const rating = Number(row.rating) || 0;
  const count = Number(row.reviews_count) || 0;
  if (!rating || !count) return { rating: null, reviews: null, source: null as null | 'google' | 'own' };
  return { rating, reviews: count, source: kind === 'restaurant' ? ('google' as const) : ('own' as const) };
}

/** Card props for a rating, with the "Google" label when it isn't ours. */
export function ratingProps(row: Record<string, unknown>, kind: EntityKind) {
  const r = shownRating(row, kind);
  return { rating: r.rating, reviews: r.reviews, ratingSource: r.source === 'google' ? 'Google' : null };
}

export function villageDisplayName(v: VillageCard, locale: Locale) {
  return placeName(v.slug, locale, v);
}


export { listingTitle };
