import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather-api';
import { estimateCrowd } from '@/lib/crowd-estimation';
import { seedBeaches } from '@/lib/seed-beaches';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const beachId = searchParams.get('id');

  if (!beachId) {
    // Return crowd for all beaches
    const results = await Promise.all(
      seedBeaches.map(async (beach) => {
        const weather = await getWeather(beach.latitude, beach.longitude);
        const crowd = estimateCrowd(beach, weather);
        return {
          beach_id: beach.id,
          slug: beach.slug,
          crowd,
          weather,
        };
      })
    );

    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
    });
  }

  const beach = seedBeaches.find((b) => b.id === beachId || b.slug === beachId);
  if (!beach) {
    return NextResponse.json({ error: 'Beach not found' }, { status: 404 });
  }

  const weather = await getWeather(beach.latitude, beach.longitude);
  const crowd = estimateCrowd(beach, weather);

  return NextResponse.json({ beach_id: beach.id, slug: beach.slug, crowd, weather }, {
    headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
  });
}
