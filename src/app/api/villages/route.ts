// Guard: public read-only content.
import { NextRequest, NextResponse } from 'next/server';
import { getVillageBySlug, getVillagesList } from '@/lib/data';
import { cachedGet } from '@/lib/api-cache';

async function getHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const area = searchParams.get('area');

  if (slug) {
    const village = await getVillageBySlug(slug);
    if (!village) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(village, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const villages = await getVillagesList(area);
  return NextResponse.json(villages, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}

// Cached in-process (no CDN in front of the self-hosted server); see lib/api-cache.ts.
export const GET = cachedGet(getHandler, 300);
