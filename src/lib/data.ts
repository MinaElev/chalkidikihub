/**
 * Server-side data fetching functions.
 * Used by page.tsx (ISR) and API routes to share transform logic.
 */
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';
import type { Beach, Restaurant, Activity, BlogArticle, Listing, Sale } from '@/types';

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

// ─── Listings ───────────────────────────────────────────────
const LISTING_FIELDS = `
  id, slug, owner_id,
  title_el, title_en, title_de, title_bg, title_ru, title_ro,
  description_el, description_en, description_de, description_bg, description_ru, description_ro,
  area, location_name, latitude, longitude,
  price_per_night, currency, guests_max, bedrooms, bathrooms,
  amenities, status, contact_phone, contact_email, booking_url, airbnb_url, website_url, created_at, updated_at,
  listing_images (id, image_url, sort_order, is_cover)
`;

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

export async function getListings(): Promise<Listing[]> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('listings').select(LISTING_FIELDS)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return (data || []).map((row) => transformListing(row as Record<string, unknown>)) as unknown as Listing[];
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

export async function getSales(): Promise<Sale[]> {
  const supabase = createApiClient();
  const { data } = await supabase
    .from('sales').select('*, sale_images(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return (data || []).map(transformSale) as unknown as Sale[];
}
