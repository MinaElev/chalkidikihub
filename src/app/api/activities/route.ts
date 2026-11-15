// Guard: public read-only content.
import { NextRequest, NextResponse } from 'next/server';
import { getActivityBySlug, getActivitiesFiltered, toActivityCard } from '@/lib/data';
import { cachedGet } from '@/lib/api-cache';

async function getHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const activity = await getActivityBySlug(slug);
    if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(activity, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const area = searchParams.get('area');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : null;

  let activities = await getActivitiesFiltered(area, limit);
  // ?fields=card → card-grid consumers skip descriptions/review bodies.
  if (searchParams.get('fields') === 'card') activities = activities.map(toActivityCard);
  return NextResponse.json(activities, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}

// Cached in-process (no CDN in front of the self-hosted server); see lib/api-cache.ts.
export const GET = cachedGet(getHandler, 300);
