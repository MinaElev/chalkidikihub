import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');
  const slug = searchParams.get('slug');

  if (slug) {
    const { data } = await supabase.from('restaurants').select('*, restaurant_reviews(*)').eq('slug', slug).single();
    if (!data) return NextResponse.json(null);
    return NextResponse.json(transformRestaurant(data), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const limit = searchParams.get('limit');
  let query = supabase.from('restaurants').select('*, restaurant_reviews(*)').order('rating', { ascending: false });
  if (area) query = query.eq('area', area);
  if (limit) query = query.limit(Number(limit));
  const { data } = await query;

  return NextResponse.json((data || []).map(transformRestaurant), {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}

function transformRestaurant(row: Record<string, unknown>) {
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
