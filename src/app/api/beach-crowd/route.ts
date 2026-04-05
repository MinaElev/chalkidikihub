import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather-api';
import { estimateCrowd } from '@/lib/crowd-estimation';
import { createApiClient } from '@/lib/api-helpers';
import { Beach } from '@/types';

async function getBeachesFromDB(): Promise<Beach[]> {
  const supabase = createApiClient();
  const { data } = await supabase.from('beaches').select('*');
  if (!data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: { el: row.name_el || '', en: row.name_en || '', de: '', bg: '', ru: '', ro: '' },
    description: { el: row.description_el || '', en: row.description_en || '', de: '', bg: '', ru: '', ro: '' },
    area: row.area,
    location_name: row.location_name || '',
    latitude: row.latitude || 0,
    longitude: row.longitude || 0,
    image_url: row.image_url || '',
    features: row.features || [],
    rating: Number(row.rating) || 0,
    reviews_count: row.reviews_count || 0,
    reviews: [],
    nearby_listing_ids: [],
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const beachId = searchParams.get('id');

  const beaches = await getBeachesFromDB();

  if (!beachId) {
    const results = await Promise.all(
      beaches.map(async (beach) => {
        const weather = await getWeather(beach.latitude, beach.longitude);
        const crowd = estimateCrowd(beach, weather);
        return { beach_id: beach.id, slug: beach.slug, crowd, weather };
      })
    );

    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
    });
  }

  const beach = beaches.find((b) => b.id === beachId || b.slug === beachId);
  if (!beach) {
    return NextResponse.json({ error: 'Beach not found' }, { status: 404 });
  }

  const weather = await getWeather(beach.latitude, beach.longitude);
  const crowd = estimateCrowd(beach, weather);

  return NextResponse.json({ beach_id: beach.id, slug: beach.slug, crowd, weather }, {
    headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
  });
}
