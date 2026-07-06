'use client';

/**
 * Last-Minute Availability — public listing page
 * -----------------------------------------------------------------------
 * Shows *every* active, non-expired opening the owners have published, in a
 * card grid with an optional area filter. Data is read *directly* from
 * Supabase (anon key + the same public-read RLS policy the homepage popup
 * uses) — no Next.js/Vercel request, so this route stays static and never
 * burns ISR write units. Deals are ephemeral, so client-side rendering is
 * the right trade-off here.
 */

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Zap, MapPin, CalendarDays, ChevronRight, Loader2, CalendarX } from 'lucide-react';

interface RawDeal {
  id: string;
  start_date: string;
  end_date: string;
  note: string | null;
  listings: {
    slug: string;
    title_el: string;
    title_en: string;
    area: string;
    status: string;
    listing_images: { image_url: string; is_cover: boolean; sort_order: number }[] | null;
  } | null;
}

interface Deal {
  id: string;
  slug: string;
  title: string;
  area: string;
  note: string | null;
  start_date: string;
  end_date: string;
  image: string | null;
}

const AREA_LABELS: Record<string, Record<string, string>> = {
  kassandra: { el: 'Κασσάνδρα', en: 'Kassandra' },
  sithonia: { el: 'Σιθωνία', en: 'Sithonia' },
  athos: { el: 'Άθως', en: 'Athos' },
  mainland: { el: 'Ενδοχώρα', en: 'Mainland' },
};

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function LastMinuteClient() {
  const locale = useLocale();
  const el = locale === 'el';

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('last_minute_deals')
        .select('id, start_date, end_date, note, listings!inner(slug, title_el, title_en, area, status, listing_images(image_url, is_cover, sort_order))')
        .eq('status', 'active')
        .eq('listings.status', 'published')
        .gte('end_date', todayStr())
        .order('start_date', { ascending: true })
        .limit(100);

      if (cancelled || error || !data) { if (!cancelled) setLoading(false); return; }

      const mapped: Deal[] = (data as unknown as RawDeal[])
        .filter(d => d.listings)
        .map(d => {
          const imgs = d.listings!.listing_images || [];
          const cover = imgs.find(i => i.is_cover) || [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0];
          return {
            id: d.id,
            slug: d.listings!.slug,
            title: (el ? d.listings!.title_el : d.listings!.title_en) || d.listings!.title_en || d.listings!.title_el,
            area: d.listings!.area,
            note: d.note,
            start_date: d.start_date,
            end_date: d.end_date,
            image: cover?.image_url || null,
          };
        });

      setDeals(mapped);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [el]);

  // Area chips — only for areas that actually have openings right now.
  const areas = useMemo(() => {
    const counts = new Map<string, number>();
    deals.forEach(d => counts.set(d.area, (counts.get(d.area) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [deals]);

  const visible = useMemo(
    () => (area === 'all' ? deals : deals.filter(d => d.area === area)),
    [deals, area],
  );

  function fmtRange(s: string, e: string): string {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const locStr = el ? 'el-GR' : 'en-GB';
    const sd = new Date(s + 'T00:00:00').toLocaleDateString(locStr, opts);
    const ed = new Date(e + 'T00:00:00').toLocaleDateString(locStr, opts);
    return s === e ? sd : `${sd} – ${ed}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
          <Zap className="h-3.5 w-3.5" />
          {el ? 'Τελευταία στιγμή' : 'Last minute'}
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          {el ? 'Διαθεσιμότητες τελευταίας στιγμής' : 'Last-minute availability'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          {el
            ? 'Κενά δωμάτια που άνοιξαν από ακυρώσεις — δημοσιευμένα απευθείας από τους ιδιοκτήτες. Κλείσε πριν προλάβει κάποιος άλλος.'
            : 'Rooms that opened up from cancellations — published straight by the owners. Book before someone else does.'}
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <CalendarX className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">
            {el ? 'Καμία διαθεσιμότητα τελευταίας στιγμής αυτή τη στιγμή.' : 'No last-minute availability right now.'}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {el ? 'Έλεγξε ξανά σύντομα — ενημερώνεται συνεχώς.' : 'Check back soon — it updates constantly.'}
          </p>
          <Link
            href="/stay"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:gap-2"
          >
            {el ? 'Δες όλα τα καταλύματα' : 'Browse all stays'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Area filter */}
          {areas.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setArea('all')}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  area === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {el ? 'Όλες' : 'All'} <span className="tabular-nums opacity-70">({deals.length})</span>
              </button>
              {areas.map(([a, count]) => (
                <button
                  key={a}
                  onClick={() => setArea(a)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    area === a
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {AREA_LABELS[a]?.[el ? 'el' : 'en'] || a}{' '}
                  <span className="tabular-nums opacity-70">({count})</span>
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map(deal => {
              const areaLabel = AREA_LABELS[deal.area]?.[el ? 'el' : 'en'] || deal.area;
              return (
                <li key={deal.id}>
                  <Link
                    href={`/listings/${deal.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/10 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      {deal.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={deal.image}
                          alt={deal.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Zap className="h-8 w-8" />
                        </div>
                      )}
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
                        <CalendarDays className="h-3 w-3" />
                        {fmtRange(deal.start_date, deal.end_date)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-1 inline-flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {areaLabel}
                      </div>
                      <h2 className="text-base font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-emerald-700">
                        {deal.title}
                      </h2>
                      {deal.note && (
                        <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{deal.note}</p>
                      )}
                      <span className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2">
                        {el ? 'Δες διαθεσιμότητα & κράτηση' : 'View availability & book'}
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
