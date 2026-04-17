import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

// Haversine distance in km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MAX_PER_TYPE = 8;   // how many results of each kind
const MAX_RADIUS_KM = 30; // anything farther is filtered

export interface NearbyEntity {
  id: string;
  type: 'beach' | 'restaurant' | 'activity' | 'village';
  slug: string;
  name: Record<string, string>;
  distance_km: number;
  latitude: number;
  longitude: number;
  image_url?: string;
}

/**
 * GET /api/nearby?listing_id=<uuid>
 * OR  /api/nearby?lat=...&lng=...
 *
 * Returns nearest beaches, restaurants, activities and villages.
 * Applies owner overrides from listing_nearby_overrides when listing_id is
 * provided (hidden items excluded; custom notes merged in; sort_order
 * respected).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get('listing_id');
  let lat = Number(searchParams.get('lat'));
  let lng = Number(searchParams.get('lng'));

  const supabase = createApiClient();

  // Resolve lat/lng from listing_id if needed
  if (listingId && (isNaN(lat) || isNaN(lng))) {
    const { data } = await supabase
      .from('listings')
      .select('latitude, longitude')
      .eq('id', listingId)
      .single();
    if (data) {
      lat = data.latitude as number;
      lng = data.longitude as number;
    }
  }

  if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
    return NextResponse.json({ error: 'valid lat/lng required' }, { status: 400 });
  }

  // Fetch candidate rows from each table. Supabase doesn't have a native
  // nearest-neighbour query without PostGIS, so we pull a bounded set
  // (within a lat/lng box that comfortably contains 30km) and compute
  // Haversine in JS.
  //
  // 30km ≈ 0.27° of latitude and ≈ 0.36° of longitude at Halkidiki's lat.
  const dLat = 0.3;
  const dLng = 0.4;
  const latMin = lat - dLat, latMax = lat + dLat;
  const lngMin = lng - dLng, lngMax = lng + dLng;

  const imgField = 'image_url';
  const baseSelect = `id, slug, latitude, longitude, ${imgField}, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr`;

  async function fetchNear(table: string, type: NearbyEntity['type']) {
    const { data } = await supabase
      .from(table)
      .select(baseSelect)
      .gte('latitude', latMin).lte('latitude', latMax)
      .gte('longitude', lngMin).lte('longitude', lngMax)
      .limit(200);
    if (!data) return [] as NearbyEntity[];
    return data
      .map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = row as any;
        const d = haversineKm(lat, lng, r.latitude, r.longitude);
        return {
          id: r.id as string,
          type,
          slug: r.slug as string,
          name: toLocaleMap(r, 'name'),
          distance_km: Math.round(d * 10) / 10,
          latitude: r.latitude as number,
          longitude: r.longitude as number,
          image_url: (r.image_url as string) || undefined,
        } as NearbyEntity;
      })
      .filter((e) => e.distance_km <= MAX_RADIUS_KM)
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, MAX_PER_TYPE);
  }

  // restaurants/activities don't all have name_sr, but toLocaleMap falls
  // back gracefully.
  const [beaches, restaurants, activities, villages] = await Promise.all([
    fetchNear('beaches', 'beach'),
    fetchNear('restaurants', 'restaurant'),
    fetchNear('activities', 'activity'),
    fetchNear('villages', 'village'),
  ]);

  // Apply owner overrides when we have a listing id
  let overrides: Record<string, { hidden: boolean; sort: number; note: Record<string, string> }> = {};
  if (listingId) {
    const { data } = await supabase
      .from('listing_nearby_overrides')
      .select('*')
      .eq('listing_id', listingId);
    overrides = Object.fromEntries(
      (data || []).map((o) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = o as any;
        return [
          `${r.entity_type}:${r.entity_id}`,
          {
            hidden: !!r.is_hidden,
            sort: r.sort_order ?? 0,
            note: toLocaleMap(r, 'note'),
          },
        ];
      }),
    );
  }

  const applyOverrides = (list: NearbyEntity[]) =>
    list
      .map((e) => {
        const key = `${e.type}:${e.id}`;
        const o = overrides[key];
        return o
          ? { ...e, _hidden: o.hidden, _sort: o.sort, _note: o.note }
          : { ...e, _hidden: false, _sort: 0, _note: undefined };
      })
      .filter((e) => !e._hidden)
      .sort((a, b) => (b._sort - a._sort) || (a.distance_km - b.distance_km));

  return NextResponse.json(
    {
      beaches: applyOverrides(beaches),
      restaurants: applyOverrides(restaurants),
      activities: applyOverrides(activities),
      villages: applyOverrides(villages),
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    },
  );
}
