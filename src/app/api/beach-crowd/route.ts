// Guard: public read-only estimate.
import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather-api';
import { estimateCrowd } from '@/lib/crowd-estimation';
import { createApiClient } from '@/lib/api-helpers';
import { Beach } from '@/types';
import { dbSlug } from '@/content/rewrites/slug-renames';
import { cachedGet } from '@/lib/api-cache';

const COLUMNS = 'id, slug, area, latitude, longitude, features, rating, reviews_count';

function toBeach(row: Record<string, unknown>): Beach {
  return {
    id: row.id, slug: row.slug, area: row.area,
    name: { el: '', en: '', de: '', bg: '', ru: '', ro: '' },
    description: { el: '', en: '', de: '', bg: '', ru: '', ro: '' },
    location_name: '', latitude: Number(row.latitude) || 0, longitude: Number(row.longitude) || 0, image_url: '',
    features: (row.features as string[]) || [], rating: Number(row.rating) || 0, reviews_count: Number(row.reviews_count) || 0,
    reviews: [], nearby_listing_ids: [],
  } as unknown as Beach;
}

/**
 * Crowd estimate (+ current weather) for one beach (?id=slug or uuid), or for
 * all of them. Only the columns the estimate uses are read: v3 loaded every
 * beach with all seven languages of text on each call.
 */
async function getHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const beachId = searchParams.get('id');
  const lang = searchParams.get('lang') || 'en';
  const supabase = createApiClient();
  const headers = { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' };

  if (!beachId) {
    const { data } = await supabase.from('beaches').select(COLUMNS);
    const results = await Promise.all(
      (data ?? []).map(async (row) => {
        const beach = toBeach(row);
        const weather = await getWeather(beach.latitude, beach.longitude, lang);
        return { beach_id: beach.id, slug: beach.slug, crowd: estimateCrowd(beach, weather), weather };
      }),
    );
    return NextResponse.json(results, { headers });
  }

  const isUuid = /^[0-9a-f-]{36}$/i.test(beachId);
  const { data: row } = await supabase.from('beaches').select(COLUMNS).eq(isUuid ? 'id' : 'slug', isUuid ? beachId : dbSlug('beaches', beachId)).maybeSingle();
  if (!row) return NextResponse.json({ error: 'Beach not found' }, { status: 404 });
  const beach = toBeach(row);
  const weather = await getWeather(beach.latitude, beach.longitude, lang);
  return NextResponse.json({ beach_id: beach.id, slug: beach.slug, crowd: estimateCrowd(beach, weather), weather }, { headers });
}

// Cached in-process (no CDN in front of the self-hosted server); see lib/api-cache.ts.
export const GET = cachedGet(getHandler, 600);
