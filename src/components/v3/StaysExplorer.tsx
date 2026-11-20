'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPin, SlidersHorizontal, X } from 'lucide-react';
import { Card, type CardProps } from '@/components/ui/Card';

export type StayArea = 'kassandra' | 'sithonia' | 'athos' | 'mainland';

export type StayItem = {
  slug: string;
  card: CardProps;
  area: StayArea;
  price: number | null;
  amenities: string[];
  updated: string;
  /** Calendar synced from Airbnb / Booking.com (same rule as the card badge). */
  live: boolean;
};

type Sort = 'recommended' | 'price_low' | 'price_high';
const AREAS: StayArea[] = ['kassandra', 'sithonia', 'athos', 'mainland'];
const isArea = (v: string | null): v is StayArea => AREAS.includes(v as StayArea);
/** One-tap filters: the amenities that most often decide a booking and that enough stays have. */
const QUICK = ['pool', 'seaView', 'petsAllowed'] as const;

export type ExplorerLabels = {
  area: string;
  allAreas: string;
  allTypes: string;
  liveOnly: string;
  more: string;
  clear: string;
  sortBy: string;
  sortRecommended: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  amenities: string;
  allStays: string;
  /** Section title per area, e.g. "Stays in Sithonia". */
  inArea: Record<StayArea, string>;
  from: string;
  perNight: string;
  noResults: string;
};

/**
 * The /listings page body: area buttons, one-tap amenities, then the stays in
 * full width. The area lives in the address so a search can be shared. No dates: only a few
 * stays have a synced calendar, so a date filter would hide most of them.
 */
export function StaysExplorer({
  items, areaNames, amenityNames, locale, labels,
}: {
  items: StayItem[];
  areaNames: Record<StayArea, string>;
  amenityNames: Record<string, string>;
  locale: string;
  labels: ExplorerLabels;
}) {
  const [area, setArea] = useState<StayArea | null>(null);
  const [quick, setQuick] = useState<string[]>([]);
  const [liveOnly, setLiveOnly] = useState(false);
  const [more, setMore] = useState(false);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [wanted, setWanted] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('recommended');
  // The fade-in plays only after the visitor changes something, never on first paint (it would delay the first photo).
  const [touched, setTouched] = useState(false);

  // Read the address after mount (never during render) so the static HTML is the same for everyone.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = q.get('area');
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isArea(a)) setArea(a);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [items]);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const set = (k: string, v: string | null) => (v ? q.set(k, v) : q.delete(k));
    set('area', area);
    const qs = q.toString();
    window.history.replaceState(window.history.state, '', window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);
  }, [area]);

  const euro = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const results = useMemo(() => {
    const list = items.filter((i) =>
      (!area || i.area === area) &&
      (!liveOnly || i.live) &&
      quick.every((a) => i.amenities.includes(a)) &&
      wanted.every((a) => i.amenities.includes(a)) &&
      (!minPrice || (i.price ?? 0) >= minPrice) &&
      (!maxPrice || (i.price != null && i.price <= maxPrice)));
    if (sort === 'price_low') return [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === 'price_high') return [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return list; // the server's order: Premium first, then the most recently updated
  }, [items, area, liveOnly, quick, wanted, minPrice, maxPrice, sort]);

  const filtered = Boolean(liveOnly || quick.length || wanted.length || minPrice || maxPrice);
  const anyLive = items.some((i) => i.live);
  const title = area ? labels.inArea[area] : labels.allStays;
  // Lowest price in what is shown; no stay counts anywhere (some areas have only a few stays so far).
  const lowest = Math.min(...results.map((i) => i.price ?? Infinity));
  const presentAmenities = Object.entries(amenityNames).filter(([k]) => !QUICK.includes(k as (typeof QUICK)[number]));

  const pickArea = (a: StayArea | null) => { setTouched(true); setArea(a); };
  const clear = () => {
    setArea(null); setQuick([]); setLiveOnly(false); setWanted([]); setMinPrice(undefined); setMaxPrice(undefined); setSort('recommended');
  };
  const chip = (on: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${on ? 'bg-sea-600 text-white shadow-sm' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-sea-300'}`;
  const field = 'h-11 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 outline-none focus:border-sea-500 focus:bg-white focus:ring-4 focus:ring-sea-500/10';

  // With nothing narrowed down, the stays are grouped by area under real headings (they read well and rank well).
  const grouped = !area && !filtered && sort === 'recommended';

  return (
    <div>
      {/* Area buttons */}
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700"><MapPin className="size-4 text-sea-600" aria-hidden />{labels.area}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => pickArea(null)} aria-pressed={!area} className={chip(!area)}>{labels.allAreas}</button>
          {AREAS.map((a) => (
            <button key={a} type="button" onClick={() => pickArea(area === a ? null : a)} aria-pressed={area === a} className={chip(area === a)}>{areaNames[a]}</button>
          ))}
        </div>
      </div>

      {/* One-tap filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setQuick([])} aria-pressed={!quick.length} className={chip(!quick.length)}>{labels.allTypes}</button>
        {QUICK.filter((k) => amenityNames[k]).map((k) => {
          const on = quick.includes(k);
          return (
            <button key={k} type="button" aria-pressed={on} onClick={() => setQuick((q) => (on ? q.filter((x) => x !== k) : [...q, k]))} className={chip(on)}>
              {amenityNames[k]}
            </button>
          );
        })}
        {anyLive && (
          <button type="button" onClick={() => setLiveOnly((v) => !v)} aria-pressed={liveOnly} className={chip(liveOnly)}>
            <span className={`size-2 rounded-full ${liveOnly ? 'bg-white' : 'bg-emerald-500'}`} aria-hidden />
            {labels.liveOnly}
          </button>
        )}
        <button type="button" onClick={() => setMore((o) => !o)} aria-expanded={more} className={chip(more)}>
          <SlidersHorizontal className="size-4" aria-hidden /> {labels.more}
        </button>
        {(area || filtered || sort !== 'recommended') && (
          <button type="button" onClick={clear} className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-gray-900">
            <X className="size-4" aria-hidden /> {labels.clear}
          </button>
        )}
      </div>

      {more && (
        <div className="mt-3 grid gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-900">{labels.priceRange}</p>
            <div className="flex items-center gap-2">
              <input type="number" inputMode="numeric" min={0} placeholder={labels.minPrice} aria-label={labels.minPrice} value={minPrice ?? ''} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)} className={field} />
              <span className="text-slate-500">–</span>
              <input type="number" inputMode="numeric" min={0} placeholder={labels.maxPrice} aria-label={labels.maxPrice} value={maxPrice ?? ''} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)} className={field} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-900">{labels.amenities}</p>
            <div className="flex flex-wrap gap-2">
              {presentAmenities.map(([k, v]) => {
                const on = wanted.includes(k);
                return <button key={k} type="button" aria-pressed={on} onClick={() => setWanted((w) => (on ? w.filter((x) => x !== k) : [...w, k]))} className={chip(on)}>{v}</button>;
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <section aria-live="polite" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-gray-900 sm:text-3xl">{title}</h2>
              {Number.isFinite(lowest) && <p className="mt-1 text-sm text-slate-600">{labels.from} {euro(lowest)} {labels.perNight}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="sr-only sm:not-sr-only">{labels.sortBy}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900">
                <option value="recommended">{labels.sortRecommended}</option>
                <option value="price_low">{labels.sortPriceLow}</option>
                <option value="price_high">{labels.sortPriceHigh}</option>
              </select>
            </label>
          </div>

          {/* Re-keyed on every pick so the new stays fade in instead of jumping. */}
          <div key={area ?? 'all'} className={touched ? 'stays-in' : undefined}>
          {results.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-6 text-slate-600">{labels.noResults}</p>
          ) : grouped ? (
            AREAS.map((a) => {
              const list = results.filter((i) => i.area === a);
              if (!list.length) return null;
              return (
                <section key={a} id={a} className="mb-10 scroll-mt-24">
                  <h3 className="mb-4 font-display text-xl font-bold text-gray-900">{labels.inArea[a]}</h3>
                  <Cards list={list} />
                </section>
              );
            })
          ) : (
            <Cards list={results} />
          )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Cards({ list }: { list: StayItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((i) => (
        <div key={i.slug} className="flex">
          <div className="flex w-full flex-col [&>article]:flex-1">
            <Card {...i.card} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          </div>
        </div>
      ))}
    </div>
  );
}
