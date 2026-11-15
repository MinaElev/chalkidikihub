// Guard: public read-only content.
import { NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';
import { cachedGet } from '@/lib/api-cache';

async function getHandler() {
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

// Cached in-process (no CDN in front of the self-hosted server); see lib/api-cache.ts.
export const GET = cachedGet(getHandler, 300);
