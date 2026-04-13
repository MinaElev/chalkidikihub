import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  const supabase = createApiClient();

  if (slug) {
    const { data } = await supabase.from('monasteries').select('*').eq('slug', slug).single();
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const monastery = {
      id: data.id, slug: data.slug, rank: data.rank, founded: data.founded, nation: data.nation,
      name: toLocaleMap(data, 'name'),
      description: toLocaleMap(data, 'description'),
      highlights: toLocaleMap(data, 'highlights'),
      meta_title: toLocaleMap(data, 'meta_title'),
      meta_description: toLocaleMap(data, 'meta_description'),
      latitude: data.latitude, longitude: data.longitude,
      image_url: data.image_url || '', image_alt: data.image_alt || '',
    };
    return NextResponse.json(monastery, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const { data } = await supabase.from('monasteries').select('*').order('rank');
  if (!data) return NextResponse.json([]);

  const monasteries = data.map((row) => ({
    id: row.id, slug: row.slug, rank: row.rank, founded: row.founded, nation: row.nation,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    highlights: toLocaleMap(row, 'highlights'),
    latitude: row.latitude, longitude: row.longitude,
    image_url: row.image_url || '',
  }));

  return NextResponse.json(monasteries, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
