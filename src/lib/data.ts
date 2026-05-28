/**
 * Server-side data fetching functions.
 * Used by page.tsx (ISR) and API routes to share transform logic.
 *
 * CACHING NOTE
 * ------------
 * The hot `*BySlug` functions are wrapped with `unstable_cache` so even
 * `force-dynamic` pages (which we currently can't escape because of a Next 16
 * Turbopack SSG bug) skip the Supabase round-trip on subsequent requests.
 *
 * - Cache TTL: 2 hours (matches what the ISR pilot would have done).
 * - Invalidation: the existing /api/revalidate route now calls
 *   `revalidateTag(type)` so an owner edit clears the relevant cached
 *   entries across all slugs of that content type in one shot.
 * - Cost: the function body still runs on every request, but the work is
 *   ~5ms (return cached JSON) instead of ~500-1500ms (Supabase round-trip
 *   + cold connection pool). Massive Fast Origin Transfer + DB read savings.
 */
import { unstable_cache } from 'next/cache';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';
import type { Area, Beach, Restaurant, Activity, BlogArticle, Listing, Sale, AreaInfo } from '@/types';

// Cache TTL for *BySlug detail fetchers. Set to 10 hours because:
// - Prices on listings are indicative (real price negotiated owner↔guest),
//   so "stale price" — usually the biggest staleness concern — doesn't apply.
// - Owner-driven edits (description, photos) trigger /api/revalidate which
//   calls revalidateTag(), so user-visible content changes propagate instantly
//   regardless of TTL.
// - Residual staleness (new reviews, related content shifts) is cosmetic.
// - 10h = ~2.4 cache regenerations/day per slug, vs ~12 at 2h. Big drop in
//   Supabase reads and function compute time for slugs with steady traffic.
const DETAIL_TTL = 36000; // 10 hours

// ─── Areas ─────────────────────────────────────────────────
export async function getAreas(): Promise<AreaInfo[]> {
  const supabase = createApiClient();
  const { data } = await supabase.from('areas').select('*').order('sort_order', { ascending: true });
  if (!data) return [];
  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    slug: row.slug as Area,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    image_url: (row.image_url as string) || '',
    latitude: row.latitude as number,
    longitude: row.longitude as number,
    listings_count: 0,
  }));
}

// ─── Beaches ────────────────────────────────────────────────
export function transformBeach(row: Record<string, unknown>) {
  const reviews = (row.beach_reviews as Array<Record<string, unknown>> || []).map((r) => ({
    id: r.id, beach_id: r.beach_id, author_name: r.author_name, rating: r.rating,
    comment: { el: r.comment_el || '', en: r.comment_en || '', de: '', bg: '', ru: '', ro: '' },
    created_at: r.created_at,
  }));
  return {
    id: row.id, slug: row.slug,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    image_url: row.image_url || '',
    features: row.features || [],
    rating: Number(row.rating), reviews_count: row.reviews_count || reviews.length,
    reviews, nearby_listing_ids: [],
  };
}

export async function getBeaches(): Promise<Beach[]> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('beaches').select('*, beach_reviews(*)')
    .order('rating', { ascending: false });
  return (data || []).map(transformBeach) as unknown as Beach[];
}

// Throws on transient errors (timeout, connection drop) so unstable_cache
// does NOT cache the failure — previously a single timeout could poison the
// cache with `null` for 10 hours and effectively hide the entire beach
// catalogue from Google. Genuine "row not found" still returns null and is
// safely cached because the slug genuinely doesn't exist.
export const getBeachBySlug = unstable_cache(
  async (slug: string): Promise<Beach | null> => {
    const supabase = createApiClient();
    const { data, error } = await supabase
      .from('beaches').select('*, beach_reviews(*)')
      .eq('slug', slug).maybeSingle();
    if (error) throw new Error(`getBeachBySlug supabase error for ${slug}: ${error.message}`);
    if (!data) return null;
    return transformBeach(data) as unknown as Beach;
  },
  ['beach-by-slug'],
  { revalidate: DETAIL_TTL, tags: ['beaches'] },
);

// Filtered beach list (area + feature + limit) — wraps the supabase call that
// /api/beaches and several pages run. Hot path: per-area queries hit tens of
// thousands of times. unstable_cache key includes args automatically.
export const getBeachesFiltered = unstable_cache(
  async (area: string | null, feature: string | null, limit: number | null): Promise<Beach[]> => {
    const supabase = createApiClient();
    let query = supabase
      .from('beaches').select('*, beach_reviews(*)')
      .order('rating', { ascending: false });
    if (area) query = query.eq('area', area);
    if (feature) query = query.contains('features', [feature]);
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data || []).map(transformBeach) as unknown as Beach[];
  },
  ['beaches-filtered'],
  { revalidate: DETAIL_TTL, tags: ['beaches'] },
);

// ─── Restaurants ────────────────────────────────────────────
export function transformRestaurant(row: Record<string, unknown>) {
  const reviews = (row.restaurant_reviews as Array<Record<string, unknown>> || []).map((r) => ({
    id: r.id, restaurant_id: r.restaurant_id, author_name: r.author_name, rating: r.rating,
    comment: { el: r.comment_el || '', en: r.comment_en || '', de: '', bg: '', ru: '', ro: '' },
    created_at: r.created_at,
  }));
  return {
    id: row.id, slug: row.slug,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    image_url: row.image_url || '',
    cuisine: row.cuisine || [], price_level: row.price_level,
    rating: Number(row.rating), reviews_count: row.reviews_count || reviews.length,
    reviews, phone: row.phone || '', hours: row.hours || '',
    has_sea_view: row.has_sea_view, has_live_music: row.has_live_music,
    accepts_reservations: row.accepts_reservations,
    tags: row.tags || [], nearby_listing_ids: [], nearby_beach_ids: [],
  };
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('restaurants').select('*, restaurant_reviews(*)')
    .order('rating', { ascending: false });
  return (data || []).map(transformRestaurant) as unknown as Restaurant[];
}

export const getRestaurantBySlug = unstable_cache(
  async (slug: string): Promise<Restaurant | null> => {
    const supabase = createApiClient();
    const { data, error } = await supabase
      .from('restaurants').select('*, restaurant_reviews(*)')
      .eq('slug', slug).maybeSingle();
    if (error) throw new Error(`getRestaurantBySlug supabase error for ${slug}: ${error.message}`);
    if (!data) return null;
    return transformRestaurant(data) as unknown as Restaurant;
  },
  ['restaurant-by-slug'],
  { revalidate: DETAIL_TTL, tags: ['restaurants'] },
);

export const getRestaurantsFiltered = unstable_cache(
  async (area: string | null, limit: number | null): Promise<Restaurant[]> => {
    const supabase = createApiClient();
    let query = supabase
      .from('restaurants').select('*, restaurant_reviews(*)')
      .order('rating', { ascending: false });
    if (area) query = query.eq('area', area);
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data || []).map(transformRestaurant) as unknown as Restaurant[];
  },
  ['restaurants-filtered'],
  { revalidate: DETAIL_TTL, tags: ['restaurants'] },
);

// ─── Activities ─────────────────────────────────────────────
export function transformActivity(row: Record<string, unknown>) {
  const reviews = (row.activity_reviews as Array<Record<string, unknown>> || []).map((r) => ({
    id: r.id, activity_id: r.activity_id, author_name: r.author_name, rating: r.rating,
    comment: { el: r.comment_el || '', en: r.comment_en || '', de: '', bg: '', ru: '', ro: '' },
    created_at: r.created_at,
  }));
  return {
    id: row.id, slug: row.slug,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    image_url: row.image_url || '',
    category: row.category, price_range: row.price_range || '',
    duration: row.duration || '',
    rating: Number(row.rating), reviews_count: row.reviews_count || reviews.length,
    reviews, tags: row.tags || [],
    nearby_listing_ids: [], nearby_beach_ids: [],
  };
}

export async function getActivities(): Promise<Activity[]> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('activities').select('*, activity_reviews(*)')
    .order('rating', { ascending: false });
  return (data || []).map(transformActivity) as unknown as Activity[];
}

export const getActivityBySlug = unstable_cache(
  async (slug: string): Promise<Activity | null> => {
    const supabase = createApiClient();
    const { data, error } = await supabase
      .from('activities').select('*, activity_reviews(*)')
      .eq('slug', slug).maybeSingle();
    if (error) throw new Error(`getActivityBySlug supabase error for ${slug}: ${error.message}`);
    if (!data) return null;
    return transformActivity(data) as unknown as Activity;
  },
  ['activity-by-slug'],
  { revalidate: DETAIL_TTL, tags: ['activities'] },
);

export const getActivitiesFiltered = unstable_cache(
  async (area: string | null, limit: number | null): Promise<Activity[]> => {
    const supabase = createApiClient();
    let query = supabase
      .from('activities').select('*, activity_reviews(*)')
      .order('rating', { ascending: false });
    if (area) query = query.eq('area', area);
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data || []).map(transformActivity) as unknown as Activity[];
  },
  ['activities-filtered'],
  { revalidate: DETAIL_TTL, tags: ['activities'] },
);

// ─── Blog ───────────────────────────────────────────────────
export function transformArticle(row: Record<string, unknown>) {
  return {
    id: row.id, slug: row.slug,
    title: toLocaleMap(row, 'title'),
    excerpt: toLocaleMap(row, 'excerpt'),
    content: toLocaleMap(row, 'content'),
    category: row.category, image_url: row.image_url || '',
    author: row.author || 'Halkidiki Hub',
    read_time_min: row.read_time_min || 5,
    tags: row.tags || [],
    related_area_slugs: row.related_area_slugs || [],
    related_beach_slugs: row.related_beach_slugs || [],
    related_listing_slugs: row.related_listing_slugs || [],
    related_article_slugs: row.related_article_slugs || [],
    published_at: row.published_at,
  };
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('blog_articles').select('*')
    .order('published_at', { ascending: false });
  return (data || []).map(transformArticle) as unknown as BlogArticle[];
}

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<BlogArticle | null> => {
    const supabase = createApiClient();
    const { data, error } = await supabase
      .from('blog_articles').select('*')
      .eq('slug', slug).maybeSingle();
    if (error) throw new Error(`getArticleBySlug supabase error for ${slug}: ${error.message}`);
    if (!data) return null;
    return transformArticle(data) as unknown as BlogArticle;
  },
  ['article-by-slug'],
  { revalidate: DETAIL_TTL, tags: ['blog'] },
);

// ─── Listings ───────────────────────────────────────────────
// Use '*' so this query survives future schema changes. transformListing
// only reads the fields it knows about, so extra columns are harmless
// and missing optional columns (on older DB snapshots) don't crash.
const LISTING_FIELDS = `*, listing_images(*)`;

export function transformListing(row: Record<string, unknown>) {
  return {
    id: row.id, slug: row.slug, owner_id: row.owner_id,
    title: {
      el: row.title_el || '', en: row.title_en || '', de: row.title_de || '',
      bg: row.title_bg || '', ru: row.title_ru || '', ro: row.title_ro || '',
    },
    description: {
      el: row.description_el || '', en: row.description_en || '', de: row.description_de || '',
      bg: row.description_bg || '', ru: row.description_ru || '', ro: row.description_ro || '',
    },
    tagline: {
      el: row.tagline_el || '', en: row.tagline_en || '', de: row.tagline_de || '',
      bg: row.tagline_bg || '', ru: row.tagline_ru || '', ro: row.tagline_ro || '', sr: row.tagline_sr || '',
    },
    owner_story: {
      el: row.owner_story_el || '', en: row.owner_story_en || '', de: row.owner_story_de || '',
      bg: row.owner_story_bg || '', ru: row.owner_story_ru || '', ro: row.owner_story_ro || '', sr: row.owner_story_sr || '',
    },
    // House rules (flat)
    check_in_time: row.check_in_time || null,
    check_out_time: row.check_out_time || null,
    rule_smoking: row.rule_smoking || null,
    rule_pets: row.rule_pets || null,
    rule_parties: row.rule_parties || null,
    rule_kids: row.rule_kids || null,
    quiet_hours_from: row.quiet_hours_from || null,
    quiet_hours_to: row.quiet_hours_to || null,
    house_rules_extra: {
      el: row.house_rules_extra_el || '', en: row.house_rules_extra_en || '', de: row.house_rules_extra_de || '',
      bg: row.house_rules_extra_bg || '', ru: row.house_rules_extra_ru || '', ro: row.house_rules_extra_ro || '', sr: row.house_rules_extra_sr || '',
    },
    // Closed flag
    is_closed: Boolean(row.is_closed),
    reopening_date: row.reopening_date || null,
    closed_reason: {
      el: row.closed_reason_el || '', en: row.closed_reason_en || '', de: row.closed_reason_de || '',
      bg: row.closed_reason_bg || '', ru: row.closed_reason_ru || '', ro: row.closed_reason_ro || '', sr: row.closed_reason_sr || '',
    },
    // Practical info
    how_to_reach: {
      el: row.how_to_reach_el || '', en: row.how_to_reach_en || '', de: row.how_to_reach_de || '',
      bg: row.how_to_reach_bg || '', ru: row.how_to_reach_ru || '', ro: row.how_to_reach_ro || '', sr: row.how_to_reach_sr || '',
    },
    wifi_info: {
      el: row.wifi_info_el || '', en: row.wifi_info_en || '', de: row.wifi_info_de || '',
      bg: row.wifi_info_bg || '', ru: row.wifi_info_ru || '', ro: row.wifi_info_ro || '', sr: row.wifi_info_sr || '',
    },
    parking_info: {
      el: row.parking_info_el || '', en: row.parking_info_en || '', de: row.parking_info_de || '',
      bg: row.parking_info_bg || '', ru: row.parking_info_ru || '', ro: row.parking_info_ro || '', sr: row.parking_info_sr || '',
    },
    check_in_info: {
      el: row.check_in_info_el || '', en: row.check_in_info_en || '', de: row.check_in_info_de || '',
      bg: row.check_in_info_bg || '', ru: row.check_in_info_ru || '', ro: row.check_in_info_ro || '', sr: row.check_in_info_sr || '',
    },
    area: row.area, location_name: row.location_name,
    latitude: row.latitude || 0, longitude: row.longitude || 0,
    price_per_night: Number(row.price_per_night),
    currency: row.currency || 'EUR',
    guests_max: row.guests_max, bedrooms: row.bedrooms, bathrooms: row.bathrooms,
    amenities: row.amenities || [], status: row.status,
    contact_phone: row.contact_phone || null, contact_email: row.contact_email || null,
    booking_url: row.booking_url || null, airbnb_url: row.airbnb_url || null,
    website_url: row.website_url || null,
    images: (row.listing_images as Array<Record<string, unknown>> || []).map((img) => ({
      id: img.id, listing_id: row.id, image_url: img.image_url,
      sort_order: img.sort_order, is_cover: img.is_cover,
    })),
    created_at: row.created_at, updated_at: row.updated_at,
  };
}

/**
 * Slug prefixes pinned to the top of every listings query, in order.
 * Edit this list (or wire it to a DB setting later) to change the pin.
 */
export const PINNED_LISTING_SLUG_PREFIXES = ['amira-house'] as const;

export function pinFeaturedListings<T extends { slug?: string | null }>(items: T[]): T[] {
  if (!items.length) return items;
  const pinned: T[] = [];
  const rest: T[] = [];
  for (const item of items) {
    const slug = (item.slug || '').toLowerCase();
    if (PINNED_LISTING_SLUG_PREFIXES.some((p) => slug.startsWith(p))) {
      pinned.push(item);
    } else {
      rest.push(item);
    }
  }
  return [...pinned, ...rest];
}

export async function getListings(): Promise<Listing[]> {
  const supabase = createApiClient();
  const { data, error } = await supabase
    .from('listings').select(LISTING_FIELDS)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[getListings] Supabase error:', error);
    return [];
  }
  const listings = (data || []).map((row) => transformListing(row as Record<string, unknown>)) as unknown as Listing[];
  return pinFeaturedListings(listings);
}

export const getListingBySlug = unstable_cache(
  async (slug: string): Promise<Listing | null> => {
    const supabase = createApiClient();
    const { data, error } = await supabase
      .from('listings').select(LISTING_FIELDS)
      .eq('status', 'published').eq('slug', slug).maybeSingle();
    if (error) throw new Error(`getListingBySlug supabase error for ${slug}: ${error.message}`);
    if (!data) return null;
    return transformListing(data as Record<string, unknown>) as unknown as Listing;
  },
  ['listing-by-slug'],
  { revalidate: DETAIL_TTL, tags: ['listings'] },
);

// Filtered published-listings list, with optional area + limit. Wraps the
// /api/listings query that was getting 17k+ calls in the supabase stats.
export const getListingsFiltered = unstable_cache(
  async (area: string | null, limit: number | null): Promise<Listing[]> => {
    const supabase = createApiClient();
    let query = supabase
      .from('listings').select(LISTING_FIELDS)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (area) query = query.eq('area', area);
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error || !data) return [];
    const listings = (data || []).map((row) => transformListing(row as Record<string, unknown>)) as unknown as Listing[];
    return pinFeaturedListings(listings);
  },
  ['listings-filtered'],
  { revalidate: DETAIL_TTL, tags: ['listings'] },
);

// ─── Hosts (public owner pages) ─────────────────────────────
// A host page exists for an owner who: (a) has set public_page_enabled=true,
// (b) has a public_slug, and (c) has ≥2 published listings.
export type Host = {
  id: string;
  slug: string;
  display_name: string;
  avatar_url: string;
  email: string;
  phone: string;
  social_facebook: string;
  social_instagram: string;
  social_website: string;
  bio: Record<string, string>;
  member_since: string;
  listings: Listing[];
};

const HOST_FIELDS = `
  id, public_slug, public_page_enabled, public_display_name, full_name,
  public_avatar_url, avatar_url, public_email, public_phone,
  social_facebook, social_instagram, social_website,
  bio_el, bio_en, bio_de, bio_bg, bio_ru, bio_ro, bio_sr,
  created_at
`;

function transformHost(row: Record<string, unknown>, listings: Listing[]): Host {
  return {
    id: row.id as string,
    slug: row.public_slug as string,
    display_name: (row.public_display_name as string) || (row.full_name as string) || 'Host',
    avatar_url: (row.public_avatar_url as string) || (row.avatar_url as string) || '',
    email: (row.public_email as string) || '',
    phone: (row.public_phone as string) || '',
    social_facebook: (row.social_facebook as string) || '',
    social_instagram: (row.social_instagram as string) || '',
    social_website: (row.social_website as string) || '',
    bio: {
      el: (row.bio_el as string) || '', en: (row.bio_en as string) || '',
      de: (row.bio_de as string) || '', bg: (row.bio_bg as string) || '',
      ru: (row.bio_ru as string) || '', ro: (row.bio_ro as string) || '',
      sr: (row.bio_sr as string) || '',
    },
    member_since: row.created_at as string,
    listings,
  };
}

export async function getHostBySlug(slug: string): Promise<Host | null> {
  const supabase = createApiClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(HOST_FIELDS)
    .eq('public_slug', slug)
    .eq('public_page_enabled', true)
    .single();
  if (error || !profile) return null;

  // Fetch their published listings
  const { data: listingRows } = await supabase
    .from('listings')
    .select(LISTING_FIELDS)
    .eq('owner_id', (profile as Record<string, unknown>).id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const listings = (listingRows || []).map((r) =>
    transformListing(r as Record<string, unknown>)
  ) as unknown as Listing[];

  // Gate: ≥2 published listings
  if (listings.length < 2) return null;

  return transformHost(profile as Record<string, unknown>, listings);
}

export async function getPublicHosts(): Promise<{ slug: string; updated_at?: string }[]> {
  const supabase = createApiClient();
  // Profiles flagged public AND with a slug
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, public_slug, updated_at')
    .eq('public_page_enabled', true)
    .not('public_slug', 'is', null);
  if (!profiles?.length) return [];

  // Count listings per owner_id, keep only owners with ≥2 published
  const ids = profiles.map((p: Record<string, unknown>) => p.id);
  const { data: listings } = await supabase
    .from('listings')
    .select('owner_id')
    .in('owner_id', ids)
    .eq('status', 'published');
  const counts = new Map<string, number>();
  for (const l of listings || []) {
    const k = (l as Record<string, unknown>).owner_id as string;
    counts.set(k, (counts.get(k) || 0) + 1);
  }

  return profiles
    .filter((p: Record<string, unknown>) => (counts.get(p.id as string) || 0) >= 2)
    .map((p: Record<string, unknown>) => ({
      slug: p.public_slug as string,
      updated_at: p.updated_at as string | undefined,
    }));
}

// ─── Sales ──────────────────────────────────────────────────
export function transformSale(row: Record<string, unknown>) {
  const images = (row.sale_images as Array<Record<string, unknown>> || []).map(i => ({
    id: i.id, sale_id: i.sale_id, image_url: i.image_url, sort_order: i.sort_order, is_cover: i.is_cover,
  }));
  return {
    id: row.id, slug: row.slug, owner_id: row.owner_id,
    property_type: row.property_type,
    title: toLocaleMap(row, 'title'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    price: row.price, currency: row.currency || 'EUR',
    size_sqm: row.size_sqm, bedrooms: row.bedrooms, bathrooms: row.bathrooms,
    floor: row.floor, year_built: row.year_built, energy_class: row.energy_class,
    features: row.features || [],
    status: row.status, images,
    contact_phone: row.contact_phone || '', contact_email: row.contact_email || '',
    created_at: row.created_at, updated_at: row.updated_at,
  };
}

export async function getSaleBySlug(slug: string): Promise<Sale | null> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('sales').select('*, sale_images(*)')
    .eq('slug', slug).single();
  if (!data) return null;
  return transformSale(data) as unknown as Sale;
}

export async function getSales(): Promise<Sale[]> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('sales').select('*, sale_images(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return (data || []).map(transformSale) as unknown as Sale[];
}

// ─── Villages ───────────────────────────────────────────────
// The village-by-slug supabase call was the most-frequent read in Query
// Performance (~68k calls combined). Wrap to cut to a handful per day.

export type VillageRow = {
  id: string;
  slug: string;
  area: string;
  name: Record<string, string>;
  description: Record<string, string>;
  meta_title: Record<string, string>;
  meta_description: Record<string, string>;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  image_alt: string;
  population: number | null;
};

function transformVillage(row: Record<string, unknown>): VillageRow {
  return {
    id: row.id as string,
    slug: row.slug as string,
    area: row.area as string,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    meta_title: toLocaleMap(row, 'meta_title'),
    meta_description: toLocaleMap(row, 'meta_description'),
    latitude: (row.latitude as number) || null,
    longitude: (row.longitude as number) || null,
    image_url: (row.image_url as string) || '',
    image_alt: (row.image_alt as string) || '',
    population: (row.population as number) || null,
  };
}

export const getVillageBySlug = unstable_cache(
  async (slug: string): Promise<VillageRow | null> => {
    const supabase = createApiClient();
    const { data, error } = await supabase
      .from('villages').select('*').eq('slug', slug).maybeSingle();
    if (error) throw new Error(`getVillageBySlug supabase error for ${slug}: ${error.message}`);
    if (!data) return null;
    return transformVillage(data as Record<string, unknown>);
  },
  ['village-by-slug'],
  { revalidate: DETAIL_TTL, tags: ['villages'] },
);

export const getVillagesList = unstable_cache(
  async (area: string | null): Promise<Omit<VillageRow, 'meta_title' | 'meta_description'>[]> => {
    const supabase = createApiClient();
    let query = supabase.from('villages').select('*').order('sort_order', { ascending: true });
    if (area) query = query.eq('area', area);
    const { data } = await query.limit(100);
    if (!data) return [];
    return data.map((row: Record<string, unknown>) => {
      const v = transformVillage(row);
      // List view doesn't need meta_title/meta_description
      const { meta_title: _mt, meta_description: _md, ...rest } = v;
      void _mt; void _md;
      return rest;
    });
  },
  ['villages-list'],
  { revalidate: DETAIL_TTL, tags: ['villages'] },
);
