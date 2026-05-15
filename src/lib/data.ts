/**
 * Server-side data fetching functions.
 * Used by page.tsx (ISR) and API routes to share transform logic.
 */
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';
import type { Area, Beach, Restaurant, Activity, BlogArticle, Listing, Sale, AreaInfo } from '@/types';

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

export async function getBeachBySlug(slug: string): Promise<Beach | null> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('beaches').select('*, beach_reviews(*)')
    .eq('slug', slug).single();
  if (!data) return null;
  return transformBeach(data) as unknown as Beach;
}

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

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('restaurants').select('*, restaurant_reviews(*)')
    .eq('slug', slug).single();
  if (!data) return null;
  return transformRestaurant(data) as unknown as Restaurant;
}

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

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('activities').select('*, activity_reviews(*)')
    .eq('slug', slug).single();
  if (!data) return null;
  return transformActivity(data) as unknown as Activity;
}

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

export async function getArticleBySlug(slug: string): Promise<BlogArticle | null> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('blog_articles').select('*')
    .eq('slug', slug).single();
  if (!data) return null;
  return transformArticle(data) as unknown as BlogArticle;
}

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

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = createApiClient();
  const { data, error } = await supabase
    .from('listings').select(LISTING_FIELDS)
    .eq('status', 'published').eq('slug', slug).single();
  if (error) {
    console.error('[getListingBySlug] Supabase error for', slug, ':', error.message);
    return null;
  }
  if (!data) return null;
  return transformListing(data as Record<string, unknown>) as unknown as Listing;
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
