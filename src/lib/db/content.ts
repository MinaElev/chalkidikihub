import 'server-only';
import { BLOG_MERGES, BLOG_TO_PLACE } from '@/lib/seo/redirects';
import { publicDb } from '@/lib/supabase/clients';
import { localizedColumns } from '@/lib/i18n/localize';
import { cached, TAGS } from './cache';
import { genuineReviews, ratingOf, type ReviewRow } from '@/lib/content/reviews';
import { withRewrite, withRowFix } from '@/content/rewrites';
import { dbSlug } from '@/content/rewrites/slug-renames';

/*
 * Public content loaders. Tables are small (≤ ~150 rows), so "card" lists are
 * loaded whole and filtered in memory; long text is loaded per item. Every
 * loader is cached under its table tag.
 */

type Row = Record<string, unknown> & { id: string; slug: string };

export type Area = 'kassandra' | 'sithonia' | 'athos' | 'mainland';
export const AREA_SLUGS: Area[] = ['kassandra', 'sithonia', 'athos', 'mainland'];

export type BeachCard = Row & {
  area: Area;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  image_alt: string | null;
  features: string[];
  rating: number | null;
  reviews_count: number | null;
  updated_at: string;
};

export type RestaurantCard = Row & {
  area: Area;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  image_alt: string | null;
  cuisine: string[];
  price_level: string | null;
  rating: number | null;
  reviews_count: number | null;
  /** Used by /best/romantic-restaurants. */
  has_sea_view: boolean | null;
  updated_at: string;
};

export type ActivityCard = Row & {
  area: Area;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  image_alt: string | null;
  category: string | null;
  price_range: string | null;
  duration: string | null;
  rating: number | null;
  reviews_count: number | null;
  updated_at: string;
};

export type VillageCard = Row & {
  area: Area;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  image_alt: string | null;
  population: number | null;
  sort_order: number | null;
};

export type ListingCard = Row & {
  owner_id: string;
  area: Area;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  price_per_night: number | null;
  guests_max: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rating: number | null;
  reviews_count: number | null;
  is_closed: boolean | null;
  updated_at: string;
  cover_url: string | null;
  /** Premium plan active: ranked first and badged (the 149€ tier promises both). */
  featured: boolean;
};

const NAME = localizedColumns('name');
const NAME_META = localizedColumns('name', 'meta_title', 'meta_description');

async function all<T>(table: string, columns: string, order = 'slug'): Promise<T[]> {
  const { data, error } = await publicDb().from(table).select(columns).order(order).limit(2000);
  if (error) throw new Error(`${table}: ${error.message}`);
  // Card selections carry no description: only the row fixes (names, coordinates) apply.
  const patch = columns.includes('*') ? withRewrite : withRowFix;
  return ((data ?? []) as unknown as Array<Record<string, unknown>>).map((r) => patch(table, r)) as T[];
}

/** Replaces stored rating/reviews_count with figures from genuine reviews only. */
function withGenuineRating<T extends Record<string, unknown>>(rows: T[], relation: string): T[] {
  return rows.map((r) => {
    const { rating, count } = ratingOf(genuineReviews(r[relation] as ReviewRow[]));
    const { [relation]: _drop, ...rest } = r;
    void _drop;
    return { ...rest, rating, reviews_count: count } as unknown as T;
  });
}

async function one<T>(table: string, slug: string, columns = '*'): Promise<T | null> {
  const { data, error } = await publicDb().from(table).select(columns).eq('slug', dbSlug(table, slug)).maybeSingle();
  if (error) throw new Error(`${table}/${slug}: ${error.message}`);
  return data ? (withRewrite(table, data as unknown as Record<string, unknown>) as T) : null;
}

// ── Beaches ────────────────────────────────────────────────────────────────
export const getBeaches = cached('beaches:cards', [TAGS.beaches, TAGS.reviews], async () =>
  withGenuineRating(
    await all<BeachCard>(
      'beaches',
      `id, slug, area, latitude, longitude, image_url, image_alt, features, updated_at, ${NAME}, beach_reviews(rating, created_at, status)`,
    ),
    'beach_reviews',
  ),
);
export const getBeach = cached('beaches:one', [TAGS.beaches, TAGS.reviews], async (slug: string) =>
  one<BeachCard & Record<string, unknown>>('beaches', slug, '*, beach_reviews(id, author_name, rating, comment_el, created_at, status)'),
);

// ── Restaurants ────────────────────────────────────────────────────────────
export const getRestaurants = cached('restaurants:cards', [TAGS.restaurants], async () =>
  all<RestaurantCard>(
    'restaurants',
    `id, slug, area, latitude, longitude, image_url, image_alt, cuisine, price_level, rating, reviews_count, has_sea_view, updated_at, ${NAME}`,
  ),
);
export const getRestaurant = cached('restaurants:one', [TAGS.restaurants, TAGS.reviews], (slug: string) =>
  one<RestaurantCard & Record<string, unknown>>('restaurants', slug, '*, restaurant_reviews(id, author_name, rating, comment_el, created_at, status)'),
);

// ── Activities ─────────────────────────────────────────────────────────────
/** Rows folded into another page by a 301 (see seo/redirects.ts). */
const MERGED_ACTIVITIES = new Set(['toroni-beach-sithonia']);
export const getActivities = cached('activities:cards', [TAGS.activities, TAGS.reviews], async () =>
  withGenuineRating(
    await all<ActivityCard>(
      'activities',
      `id, slug, area, latitude, longitude, image_url, image_alt, category, price_range, duration, updated_at, ${NAME}, activity_reviews(rating, created_at, status)`,
    ),
    'activity_reviews',
  ).filter((a) => !MERGED_ACTIVITIES.has(a.slug)),
);
export const getActivity = cached('activities:one', [TAGS.activities, TAGS.reviews], async (slug: string) =>
  one<ActivityCard & Record<string, unknown>>('activities', slug, '*, activity_reviews(id, author_name, rating, comment_el, created_at, status)'),
);

// ── Villages ───────────────────────────────────────────────────────────────
export const getVillages = cached('villages:cards', [TAGS.villages], () =>
  all<VillageCard>(
    'villages',
    `id, slug, area, latitude, longitude, image_url, image_alt, population, sort_order, ${NAME}`,
  ),
);
export const getVillage = cached('villages:one', [TAGS.villages], (slug: string) =>
  one<VillageCard & Record<string, unknown>>('villages', slug),
);

// ── Listings ───────────────────────────────────────────────────────────────
export const getListings = cached('listings:cards', [TAGS.listings, TAGS.reviews], async () => {
  const rows = await publicDb()
    .from('listings')
    .select(
      `id, slug, owner_id, area, location_name, latitude, longitude, image_url, price_per_night, guests_max,
       bedrooms, bathrooms, amenities, rating, reviews_count, is_closed, updated_at, plan, plan_status, plan_expires_at, ${localizedColumns('title', 'tagline')},
       listing_images(image_url, is_cover, sort_order)`,
    )
    .eq('status', 'published')
    .order('updated_at', { ascending: false });
  if (rows.error) throw new Error(`listings: ${rows.error.message}`);
  return ((rows.data ?? []) as unknown as Array<Record<string, unknown>>).map((r) => {
    const images = (r.listing_images ?? []) as Array<{
      image_url: string;
      is_cover: boolean;
      sort_order: number;
    }>;
    const cover =
      images.find((i) => i.is_cover)?.image_url ??
      [...images].sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url ??
      r.image_url;
    const { listing_images: _omit, ...rest } = r;
    void _omit;
    const featured =
      r.plan === 'premium' && r.plan_status === 'active' && (!r.plan_expires_at || Date.parse(String(r.plan_expires_at)) > Date.now());
    return { ...rest, cover_url: (cover as string) || null, featured } as unknown as ListingCard;
  }).sort((a, b) => Number(b.featured) - Number(a.featured));
});

export const getListing = cached('listings:one', [TAGS.listings, TAGS.reviews], async (slug: string) => {
  const { data, error } = await publicDb()
    .from('listings')
    .select(
      `*, listing_images(id, image_url, is_cover, sort_order, ${localizedColumns('caption')}),
       listing_reviews(id, author_name, rating, comment_el, created_at, status),
       listing_faqs(id, sort_order, ${localizedColumns('question', 'answer')}),
       listing_extras(id, sort_order, icon_key, price, currency, price_unit, included, ${localizedColumns('label', 'description')})`,
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw new Error(`listing/${slug}: ${error.message}`);
  return data ? (withRewrite('listings', data as unknown as Record<string, unknown>) as unknown as ListingCard & Record<string, unknown>) : null;
});

// ── Blog ───────────────────────────────────────────────────────────────────
export type ArticleCard = Row & {
  category: string;
  image_url: string | null;
  image_alt: string | null;
  author: string | null;
  read_time_min: number | null;
  published_at: string;
  updated_at: string;
};

export const getArticles = cached('blog:cards', [TAGS.blog], async () => {
  const { data, error } = await publicDb()
    .from('blog_articles')
    .select(
      `id, slug, category, image_url, image_alt, author, read_time_min, published_at, updated_at, ${localizedColumns('title', 'excerpt')}`,
    )
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  if (error) throw new Error(`blog: ${error.message}`);
  return ((data ?? []) as unknown as ArticleCard[]).filter((a) => !(a.slug in BLOG_TO_PLACE) && !(a.slug in BLOG_MERGES));
});

export const getArticle = cached('blog:one', [TAGS.blog], async (slug: string) => {
  const { data, error } = await publicDb()
    .from('blog_articles')
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .maybeSingle();
  if (error) throw new Error(`blog/${slug}: ${error.message}`);
  return data ? (withRewrite('blog_articles', data as Record<string, unknown>, 'content') as ArticleCard & Record<string, unknown>) : null;
});

// ── Monasteries, events, areas, sales ─────────────────────────────────────
export const getMonasteries = cached('monasteries:all', [TAGS.monasteries], () =>
  all<Row & Record<string, unknown>>('monasteries', '*', 'rank'),
);

export const getEvents = cached('events:all', [TAGS.events], () =>
  all<Row & Record<string, unknown>>('events', '*', 'sort_order'),
);

export const getAreas = cached('areas:all', [TAGS.areas], () =>
  all<Row & Record<string, unknown>>('areas', '*', 'sort_order'),
);

export const getSales = cached('sales:cards', [TAGS.sales], async () => {
  const { data, error } = await publicDb()
    .from('sales')
    .select(`*, sale_images(image_url, is_cover, sort_order)`)
    .eq('status', 'published')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(`sales: ${error.message}`);
  return (data ?? []) as Array<Row & Record<string, unknown>>;
});

export { NAME, NAME_META };
