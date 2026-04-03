import { NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

export async function GET() {
  const supabase = createApiClient();
  const { data } = await supabase.from('areas').select('*').order('sort_order', { ascending: true });

  if (!data || data.length === 0) {
    return NextResponse.json([]);
  }

  const areas = data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    image_url: row.image_url || '',
    latitude: row.latitude,
    longitude: row.longitude,
    sort_order: row.sort_order,
    listings_count: 0,
  }));

  return NextResponse.json(areas, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
