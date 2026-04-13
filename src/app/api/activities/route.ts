import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');
  const slug = searchParams.get('slug');

  if (slug) {
    const { data } = await supabase.from('activities').select('*, activity_reviews(*)').eq('slug', slug).single();
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(transformActivity(data), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const limit = searchParams.get('limit');
  let query = supabase.from('activities').select('*, activity_reviews(*)').order('rating', { ascending: false });
  if (area) query = query.eq('area', area);
  if (limit) query = query.limit(Number(limit));
  const { data } = await query;

  return NextResponse.json((data || []).map(transformActivity), {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}

function transformActivity(row: Record<string, unknown>) {
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
