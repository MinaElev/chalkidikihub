'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Card, CardGrid, type CardProps } from '@/components/ui/Card';

export type FilterItem = {
  card: CardProps;
  area: string;
  price: number | null;
  guests: number;
  amenities: string[];
  updated: string;
};

type Labels = {
  area: string;
  allAreas: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  guestsMin: string;
  amenities: string;
  sortBy: string;
  sortNewest: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  clearFilters: string;
  open: string;
  results: string;
};

type Sort = 'newest' | 'price_low' | 'price_high';

/**
 * v3's stay filters (area, sort, price, guests, amenities). The page itself
 * stays server-rendered by area for search engines; this filters those same
 * stays in the browser and swaps the area sections for the results while any
 * filter is set.
 */
export function ListingFilters({
  items, labels, areas, amenities, children,
}: {
  items: FilterItem[];
  labels: Labels;
  areas: Record<string, string>;
  amenities: Record<string, string>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('newest');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [guests, setGuests] = useState<number | undefined>();
  const [wanted, setWanted] = useState<string[]>([]);

  const active = Boolean(area || minPrice || maxPrice || guests || wanted.length || sort !== 'newest');
  const results = useMemo(() => {
    const list = items.filter((i) =>
      (!area || i.area === area) &&
      (!minPrice || (i.price ?? 0) >= minPrice) &&
      (!maxPrice || (i.price != null && i.price <= maxPrice)) &&
      (!guests || i.guests >= guests) &&
      wanted.every((a) => i.amenities.includes(a)));
    if (sort === 'price_low') return [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === 'price_high') return [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return [...list].sort((a, b) => b.updated.localeCompare(a.updated));
  }, [items, area, minPrice, maxPrice, guests, wanted, sort]);

  const clear = () => { setArea(null); setSort('newest'); setMinPrice(undefined); setMaxPrice(undefined); setGuests(undefined); setWanted([]); };
  const chip = (on: boolean) => `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${on ? 'bg-sea-600 text-white shadow' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-sea-300'}`;
  const num = (placeholder: string, value: number | undefined, set: (n: number | undefined) => void) => (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      placeholder={placeholder}
      aria-label={placeholder}
      value={value ?? ''}
      onChange={(e) => set(e.target.value ? Number(e.target.value) : undefined)}
      className="h-11 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 outline-none focus:border-sea-500 focus:bg-white focus:ring-4 focus:ring-sea-500/10"
    />
  );

  return (
    <>
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-2 rounded-xl bg-sea-50 px-4 py-2 text-sm font-semibold text-sea-700 hover:bg-sea-100">
            <SlidersHorizontal className="size-4" aria-hidden /> {labels.open}
          </button>
          <button type="button" onClick={() => setArea(null)} className={chip(!area)}>{labels.allAreas}</button>
          {Object.entries(areas).map(([k, v]) => (
            <button key={k} type="button" onClick={() => setArea(area === k ? null : k)} aria-pressed={area === k} className={chip(area === k)}>{v}</button>
          ))}
          {active && (
            <button type="button" onClick={clear} className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-gray-900">
              <X className="size-4" aria-hidden /> {labels.clearFilters}
            </button>
          )}
        </div>

        {open && (
          <div className="mt-4 grid gap-5 border-t border-gray-100 pt-4 md:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-900">{labels.sortBy}</p>
              <div className="flex flex-wrap gap-2">
                {([['newest', labels.sortNewest], ['price_low', labels.sortPriceLow], ['price_high', labels.sortPriceHigh]] as const).map(([k, v]) => (
                  <button key={k} type="button" onClick={() => setSort(k)} aria-pressed={sort === k} className={chip(sort === k)}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-900">{labels.priceRange}</p>
              <div className="flex items-center gap-2">
                {num(labels.minPrice, minPrice, setMinPrice)}
                <span className="text-slate-500">–</span>
                {num(labels.maxPrice, maxPrice, setMaxPrice)}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-900">{labels.guestsMin}</p>
              <div className="max-w-[10rem]">{num(labels.guestsMin, guests, setGuests)}</div>
            </div>
            <div className="md:col-span-3">
              <p className="mb-2 text-sm font-semibold text-gray-900">{labels.amenities}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(amenities).map(([k, v]) => {
                  const on = wanted.includes(k);
                  return (
                    <button key={k} type="button" aria-pressed={on} onClick={() => setWanted((w) => (on ? w.filter((x) => x !== k) : [...w, k]))} className={chip(on)}>{v}</button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {active ? (
        <section aria-live="polite">
          <p className="mb-4 text-sm font-semibold text-slate-600">{labels.results.replace('{count}', String(results.length))}</p>
          <CardGrid>
            {results.map((i) => <Card key={i.card.href} {...i.card} />)}
          </CardGrid>
        </section>
      ) : (
        children
      )}
    </>
  );
}
