import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { transformRestaurant, transformBeach, transformActivity, transformListing } from '@/lib/data';

const LISTING_SELECT_FIELDS = `
  id, slug, owner_id,
  title_el, title_en, title_de, title_bg, title_ru, title_ro,
  description_el, description_en, description_de, description_bg, description_ru, description_ro,
  area, location_name, latitude, longitude,
  price_per_night, currency, guests_max, bedrooms, bathrooms,
  amenities, status, contact_phone, contact_email, booking_url, airbnb_url, website_url, created_at, updated_at,
  listing_images (id, image_url, sort_order, is_cover)
`;

async function fetchBeaches(supabase: ReturnType<typeof createApiClient>, area: string, limit: number) {
  const { data } = await supabase
    .from('beaches')
    .select('*, beach_reviews(*)')
    .eq('area', area)
    .order('rating', { ascending: false })
    .limit(limit);
  return (data || []).map(transformBeach);
}

async function fetchRestaurants(supabase: ReturnType<typeof createApiClient>, area: string, limit: number) {
  const { data } = await supabase
    .from('restaurants')
    .select('*, restaurant_reviews(*)')
    .eq('area', area)
    .order('rating', { ascending: false })
    .limit(limit);
  return (data || []).map(transformRestaurant);
}

async function fetchActivities(supabase: ReturnType<typeof createApiClient>, area: string, limit: number) {
  const { data } = await supabase
    .from('activities')
    .select('*, activity_reviews(*)')
    .eq('area', area)
    .order('rating', { ascending: false })
    .limit(limit);
  return (data || []).map(transformActivity);
}

async function fetchListings(supabase: ReturnType<typeof createApiClient>, area: string, limit: number) {
  const { data } = await supabase
    .from('listings')
    .select(LISTING_SELECT_FIELDS)
    .eq('status', 'published')
    .eq('area', area)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data || []).map((row) => transformListing(row as Record<string, unknown>));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const area = searchParams.get('area');

  if (!type || !area) {
    return NextResponse.json({ error: 'Missing required params: type, area' }, { status: 400 });
  }

  const supabase = createApiClient();

  // Build parallel queries based on the detail page type
  const queries: Record<string, Promise<unknown[]>> = {};

  if (type === 'beach') {
    queries.beaches = fetchBeaches(supabase, area, 6);
    queries.restaurants = fetchRestaurants(supabase, area, 4);
    queries.listings = fetchListings(supabase, area, 4);
  } else if (type === 'restaurant') {
    queries.restaurants = fetchRestaurants(supabase, area, 6);
    queries.beaches = fetchBeaches(supabase, area, 4);
    queries.listings = fetchListings(supabase, area, 4);
  } else if (type === 'activity') {
    queries.activities = fetchActivities(supabase, area, 6);
    queries.beaches = fetchBeaches(supabase, area, 4);
  } else {
    return NextResponse.json({ error: 'Invalid type. Must be beach, restaurant, or activity' }, { status: 400 });
  }

  // Execute all queries in parallel
  const keys = Object.keys(queries);
  const results = await Promise.all(Object.values(queries));

  const response: Record<string, unknown[]> = {};
  keys.forEach((key, i) => {
    response[key] = results[i];
  });

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
