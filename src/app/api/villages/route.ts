import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const area = searchParams.get('area');

  const supabase = createApiClient();

  // Single village by slug
  if (slug) {
    const { data } = await supabase.from('villages').select('*').eq('slug', slug).single();
    if (!data) return NextResponse.json(null, { status: 404 });

    const village = {
      id: data.id,
      slug: data.slug,
      area: data.area,
      name: toLocaleMap(data, 'name'),
      description: toLocaleMap(data, 'description'),
      meta_title: toLocaleMap(data, 'meta_title'),
      meta_description: toLocaleMap(data, 'meta_description'),
      latitude: data.latitude,
      longitude: data.longitude,
      image_url: data.image_url || '',
      image_alt: data.image_alt || '',
      population: data.population,
    };
    return NextResponse.json(village, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  // List all (optionally filtered by area)
  let query = supabase.from('villages').select('*').order('sort_order', { ascending: true });
  if (area) query = query.eq('area', area);

  const { data } = await query.limit(100);
  if (!data) return NextResponse.json([]);

  const villages = data.map((row) => ({
    id: row.id,
    slug: row.slug,
    area: row.area,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    latitude: row.latitude,
    longitude: row.longitude,
    image_url: row.image_url || '',
    population: row.population,
  }));

  return NextResponse.json(villages, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
