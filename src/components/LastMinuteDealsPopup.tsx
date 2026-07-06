'use client';

/**
 * Last-Minute Deals popup (homepage)
 * -----------------------------------------------------------------------
 * A client island: reads active, non-expired deals *directly* from Supabase
 * (anon key + RLS public-read policy on last_minute_deals) — no Next.js /
 * Vercel request is involved, so the static ISR homepage stays free to serve.
 *
 * Shown a few seconds after load, bottom-right (desktop) / bottom sheet
 * (mobile). Dismissal is remembered in localStorage for 24h.
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Zap, X, ChevronRight, MapPin, CalendarDays } from 'lucide-react';

const DISMISS_KEY = 'lmd_popup_dismissed_until';
const SHOW_DELAY_MS = 3500;
const DISMISS_HOURS = 24;

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

export function LastMinuteDealsPopup() {
  const locale = useLocale();
  const el = locale === 'el';

  const [deals, setDeals] = useState<Deal[]>([]);
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // Respect a recent dismissal — skip the query entirely.
    try {
      const until = localStorage.getItem(DISMISS_KEY);
      if (until && Date.now() < Number(until)) return;
    } catch { /* localStorage unavailable — carry on */ }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('last_minute_deals')
        .select('id, start_date, end_date, note, listings!inner(slug, title_el, title_en, area, status, listing_images(image_url, is_cover, sort_order))')
        .eq('status', 'active')
        .eq('listings.status', 'published')
        .gte('end_date', todayStr())
        .order('start_date', { ascending: true })
        .limit(12);

      if (cancelled || error || !data) return;

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

      if (mapped.length === 0) return;
      setDeals(mapped);
      timer = setTimeout(() => { if (!cancelled) setVisible(true); }, SHOW_DELAY_MS);
    })();

    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [el]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_HOURS * 3_600_000));
    } catch { /* ignore */ }
  }

  if (!visible || deals.length === 0) return null;

  const deal = deals[idx];
  const areaLabel = AREA_LABELS[deal.area]?.[el ? 'el' : 'en'] || deal.area;

  function fmtRange(s: string, e: string): string {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const locStr = el ? 'el-GR' : 'en-GB';
    const sd = new Date(s + 'T00:00:00').toLocaleDateString(locStr, opts);
    const ed = new Date(e + 'T00:00:00').toLocaleDateString(locStr, opts);
    return s === e ? sd : `${sd} – ${ed}`;
  }

  return (
    <div
      className="fixed z-[60] animate-[lmd-in_0.35s_ease-out]"
      style={{ right: 16, bottom: 16, left: 'auto', width: 'min(360px, calc(100vw - 32px))' }}
    >
      <style>{`@keyframes lmd-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header ribbon */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-white">
          <Zap className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wide">
            {el ? 'Τελευταία στιγμή' : 'Last minute'}
          </span>
          <button
            onClick={dismiss}
            className="ml-auto -mr-1 rounded-full p-1 hover:bg-white/20"
            aria-label={el ? 'Κλείσιμο' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Link href={`/listings/${deal.slug}`} onClick={dismiss} className="block group">
          {deal.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={deal.image}
              alt={deal.title}
              loading="lazy"
              className="h-36 w-full object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700">
              {deal.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />{areaLabel}
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <CalendarDays className="w-3.5 h-3.5" />{fmtRange(deal.start_date, deal.end_date)}
              </span>
            </div>
            {deal.note && <p className="mt-2 text-xs text-slate-600 line-clamp-2">{deal.note}</p>}
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:gap-2 transition-all">
              {el ? 'Δες διαθεσιμότητα' : 'View availability'}
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Pager when multiple deals */}
        {deals.length > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
            <span className="text-[11px] text-slate-400 tabular-nums">
              {idx + 1} / {deals.length}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setIdx(i => (i - 1 + deals.length) % deals.length)}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                {el ? 'Προηγ.' : 'Prev'}
              </button>
              <button
                onClick={() => setIdx(i => (i + 1) % deals.length)}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {el ? 'Επόμ.' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {/* See-all link — surfaces the dedicated page so no opening is lost */}
        {deals.length > 1 && (
          <Link
            href="/last-minute"
            onClick={dismiss}
            className="flex items-center justify-center gap-1 border-t border-slate-100 px-4 py-2.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
          >
            {el ? `Δες όλες τις διαθεσιμότητες (${deals.length})` : `See all availability (${deals.length})`}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
