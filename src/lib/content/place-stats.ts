/**
 * v3's village "data insights": accommodation prices against the Halkidiki
 * average, and the local vs international mix of places to eat. Computed
 * from the rows the village page already has, so no extra database queries.
 */
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

// Cuisine tags counted as Greek / traditional (case-insensitive substring), as in v3.
const GREEK_CUISINES = ['greek', 'ελληνικ', 'traditional', 'παραδοσιακ', 'taverna', 'ταβέρν', 'seafood', 'ψαρ', 'mezed', 'μεζέδ'];
const isGreek = (c: string) => GREEK_CUISINES.some((k) => c.toLowerCase().includes(k));

function summarise(prices: number[]) {
  const ok = prices.filter((p) => p > 0 && Number.isFinite(p));
  if (!ok.length) return null;
  return { avg: Math.round(ok.reduce((a, b) => a + b, 0) / ok.length), min: Math.min(...ok), max: Math.max(...ok), count: ok.length };
}

export function priceStats(village: Array<{ price_per_night: unknown }>, all: Array<{ price_per_night: unknown }>): PriceStats {
  const v = summarise(village.map((l) => Number(l.price_per_night)));
  const o = summarise(all.map((l) => Number(l.price_per_night)));
  return { village: v, overall: o ? { avg: o.avg, count: o.count } : null };
}

/** Restaurants of the village; falls back to the whole peninsula below five, as v3 did. */
export function cuisineStats(village: Array<{ cuisine?: unknown }>, area: Array<{ cuisine?: unknown }>): CuisineStats {
  const rows = village.length >= 5 ? village : area;
  let greekCount = 0;
  let internationalCount = 0;
  const tags = new Map<string, number>();
  for (const r of rows) {
    const cuisines = (Array.isArray(r.cuisine) ? r.cuisine : []).filter((c): c is string => typeof c === 'string' && Boolean(c.trim()));
    if (cuisines.some(isGreek)) greekCount++;
    else if (cuisines.length) internationalCount++;
    for (const c of cuisines) tags.set(c.toLowerCase(), (tags.get(c.toLowerCase()) ?? 0) + 1);
  }
  const total = greekCount + internationalCount;
  return {
    total,
    greekCount,
    internationalCount,
    greekPct: total ? Math.round((greekCount / total) * 100) : 0,
    buckets: [...tags.entries()]
      .map(([key, count]) => ({ key, count, pct: total ? Math.round((count / Math.max(rows.length, 1)) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
}
