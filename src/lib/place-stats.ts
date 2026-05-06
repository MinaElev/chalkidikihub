import type { createApiClient } from './api-helpers';

type Supabase = ReturnType<typeof createApiClient>;

export type PriceStats = {
  village: { avg: number; min: number; max: number; count: number } | null;
  overall: { avg: number; count: number } | null;
};

export type CuisineBucket = { key: string; count: number; pct: number };
export type CuisineStats = {
  total: number;
  greekCount: number;
  internationalCount: number;
  greekPct: number;
  buckets: CuisineBucket[];
};

// Cuisines we treat as "Greek/traditional" for the local-vs-international ratio.
// Everything else falls into "international". Match is case-insensitive substring.
const GREEK_CUISINES = ['greek', 'ελληνικ', 'traditional', 'παραδοσιακ', 'taverna', 'ταβέρν', 'seafood', 'ψαρ', 'mezed', 'μεζέδ'];

function isGreekCuisine(c: string): boolean {
  const v = c.toLowerCase();
  return GREEK_CUISINES.some(k => v.includes(k));
}

export async function getVillagePriceStats(
  supabase: Supabase,
  locationNames: string | string[],
): Promise<PriceStats> {
  // Accept multiple localised names (el/en/slug) — the DB's location_name
  // can be in any of them. Build a comma-separated `or()` filter.
  const names = (Array.isArray(locationNames) ? locationNames : [locationNames])
    .filter((n) => n && n.trim().length > 1);
  const orFilter = names.map((n) => `location_name.ilike.%${n}%`).join(',');

  const villageQ = orFilter
    ? supabase.from('listings').select('price_per_night').eq('status', 'published').or(orFilter)
    : Promise.resolve({ data: [] as Array<{ price_per_night: number | string | null }> });

  const overallQ = supabase
    .from('listings')
    .select('price_per_night')
    .eq('status', 'published');

  const [villageRes, overallRes] = await Promise.all([villageQ, overallQ]);

  const calc = (rows: Array<{ price_per_night: number | string | null }> | null) => {
    if (!rows || rows.length === 0) return null;
    const prices = rows.map(r => Number(r.price_per_night)).filter(p => p > 0 && Number.isFinite(p));
    if (prices.length === 0) return null;
    const sum = prices.reduce((a, b) => a + b, 0);
    return {
      avg: Math.round(sum / prices.length),
      min: Math.min(...prices),
      max: Math.max(...prices),
      count: prices.length,
    };
  };

  const village = calc(villageRes.data || []);
  const overallFull = calc(overallRes.data || []);
  return {
    village,
    overall: overallFull ? { avg: overallFull.avg, count: overallFull.count } : null,
  };
}

export async function getVillageCuisineStats(
  supabase: Supabase,
  locationNames: string | string[],
  area: string,
): Promise<CuisineStats> {
  const names = (Array.isArray(locationNames) ? locationNames : [locationNames])
    .filter((n) => n && n.trim().length > 1);
  const orFilter = names.map((n) => `location_name.ilike.%${n}%`).join(',');

  // Try village-specific match first, fall back to area when the village
  // alone doesn't have enough restaurants for a meaningful breakdown.
  const villageQ = orFilter
    ? await supabase.from('restaurants').select('cuisine').or(orFilter)
    : { data: [] as Array<{ cuisine: string[] | null }> };

  let rows = villageQ.data || [];
  if (rows.length < 5) {
    const areaQ = await supabase
      .from('restaurants')
      .select('cuisine')
      .eq('area', area);
    rows = areaQ.data || rows;
  }

  let greekCount = 0;
  let internationalCount = 0;
  const tagCounts = new Map<string, number>();

  for (const r of rows) {
    const cuisines = Array.isArray(r.cuisine) ? r.cuisine : [];
    const isGreek = cuisines.some((c: string) => typeof c === 'string' && isGreekCuisine(c));
    if (isGreek) greekCount++;
    else if (cuisines.length > 0) internationalCount++;
    for (const c of cuisines) {
      if (typeof c === 'string' && c.trim()) {
        tagCounts.set(c.toLowerCase(), (tagCounts.get(c.toLowerCase()) || 0) + 1);
      }
    }
  }

  const total = greekCount + internationalCount;
  const buckets: CuisineBucket[] = Array.from(tagCounts.entries())
    .map(([key, count]) => ({ key, count, pct: total > 0 ? Math.round((count / Math.max(rows.length, 1)) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total,
    greekCount,
    internationalCount,
    greekPct: total > 0 ? Math.round((greekCount / total) * 100) : 0,
    buckets,
  };
}
