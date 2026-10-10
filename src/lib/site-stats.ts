/**
 * Live site figures used wherever the product quotes numbers at visitors —
 * the auth pages' brand panel and the homepage hero.
 *
 * These are marketing claims, so they must never drift from reality: the hero
 * used to advertise a hardcoded "500+ properties" while the database held 134.
 * Cached for 24h and tagged `listings`, so /api/revalidate's existing
 * revalidateTag('listings') refreshes them the moment a listing is published.
 */
import { unstable_cache } from 'next/cache';
import { createApiClient } from '@/lib/api-helpers';
import { locales as publicLocales } from '@/i18n/config';

export type SiteStats = {
  listings: number;
  villages: number;
  languages: number;
  /** Mean of every approved review on the site, 1 decimal. '' when there are none. */
  rating: string;
};

// Fallbacks are the counts at the time of writing (2026-09-11). They only
// surface if Supabase is unreachable — a panel with a plausible number beats
// one reading "0 properties".
const FALLBACK: SiteStats = { listings: 134, villages: 81, languages: publicLocales.length, rating: '' };

// Reviews live in one table per content type — the site-wide average is the
// mean across all of them, weighted by how many reviews each actually has.
const REVIEW_TABLES = ['listing_reviews', 'beach_reviews', 'restaurant_reviews', 'activity_reviews'] as const;

export const getSiteStats = unstable_cache(
  async (): Promise<SiteStats> => {
    try {
      const supabase = createApiClient();
      const [listings, villages, ...reviewSets] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('villages').select('*', { count: 'exact', head: true }),
        ...REVIEW_TABLES.map((t) => supabase.from(t).select('rating').eq('status', 'approved')),
      ]);

      const ratings = reviewSets
        .flatMap((r) => (r.data as { rating: number }[] | null) || [])
        .map((r) => r.rating)
        .filter((n) => typeof n === 'number' && n > 0);
      const rating = ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : FALLBACK.rating;

      return {
        listings: listings.count || FALLBACK.listings,
        villages: villages.count || FALLBACK.villages,
        languages: publicLocales.length,
        rating,
      };
    } catch {
      return FALLBACK;
    }
  },
  ['site-stats'],
  { revalidate: 86400, tags: ['listings'] },
);
