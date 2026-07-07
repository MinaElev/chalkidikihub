import { NextRequest, NextResponse } from 'next/server';
import { getBeachBySlug, getBeachesFiltered, toBeachCard } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const beach = await getBeachBySlug(slug);
    if (!beach) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(beach, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const area = searchParams.get('area');
  const feature = searchParams.get('feature');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : null;

  let beaches = await getBeachesFiltered(area, feature, limit);
  // ?fields=card → strip descriptions/review bodies for card-grid consumers
  // (index page, area pages). Search & map keep the full payload.
  if (searchParams.get('fields') === 'card') beaches = beaches.map(toBeachCard);
  return NextResponse.json(beaches, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
