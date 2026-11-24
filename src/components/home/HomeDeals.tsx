'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CalendarDays, MapPin, Zap } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Home page row of last-minute openings. Read straight from Supabase in the
 * browser, like /last-minute and the home popup: deals change by the hour, so
 * they must not be frozen into the cached page. Renders nothing while loading
 * and when there are no active deals, so the page never shows an empty band.
 */
type Deal = { id: string; slug: string; title: string; area: string; note: string | null; start: string; end: string; image: string | null };

type RawDeal = {
  id: string;
  start_date: string;
  end_date: string;
  note: string | null;
  listings: {
    slug: string; title_el: string; title_en: string; area: string;
    listing_images: { image_url: string; is_cover: boolean; sort_order: number }[] | null;
  } | null;
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function HomeDeals({ locale, areas, labels }: {
  locale: string;
  areas: Record<string, string>;
  labels: { badge: string; title: string; lead: string; all: string };
}) {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await createClient()
        .from('last_minute_deals')
        .select('id, start_date, end_date, note, listings!inner(slug, title_el, title_en, area, status, listing_images(image_url, is_cover, sort_order))')
        .eq('status', 'active')
        .eq('listings.status', 'published')
        .gte('end_date', today())
        .order('start_date', { ascending: true })
        .limit(3);
      if (cancelled || error || !data) return;
      setDeals((data as unknown as RawDeal[]).filter((d) => d.listings).map((d) => {
        const l = d.listings!;
        const imgs = l.listing_images || [];
        const cover = imgs.find((i) => i.is_cover) || [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0];
        return {
          id: d.id, slug: l.slug, area: l.area, note: d.note, start: d.start_date, end: d.end_date,
          title: (locale === 'el' ? l.title_el : l.title_en) || l.title_en || l.title_el,
          image: cover?.image_url || null,
        };
      }));
    })();
    return () => { cancelled = true; };
  }, [locale]);

  if (deals.length === 0) return null;

  const fmt = (s: string, e: string) => {
    const f = (v: string) => new Date(`${v}T00:00:00`).toLocaleDateString(locale === 'el' ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'short' });
    return s === e ? f(s) : `${f(s)} – ${f(e)}`;
  };

  return (
    <section aria-labelledby="deals" className="bg-amber-50 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
              <Zap className="size-3.5" aria-hidden /> {labels.badge}
            </p>
            <h2 id="deals" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{labels.title}</h2>
            <p className="mt-2 text-slate-600">{labels.lead}</p>
          </div>
          <Link href="/last-minute" className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm transition-colors hover:bg-amber-100">
            {labels.all} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => (
            <li key={d.id}>
              <Link href={`/listings/${d.slug}`} className="group flex h-full overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative w-32 shrink-0 bg-sand-100 sm:w-36">
                  {d.image && <Image src={d.image} alt="" fill sizes="9rem" className="object-cover" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-4">
                  <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                    <CalendarDays className="size-3.5" aria-hidden /> {fmt(d.start, d.end)}
                  </p>
                  <p className="mt-2 line-clamp-2 font-bold leading-snug text-gray-900 group-hover:text-sea-700">{d.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="size-3.5 shrink-0" aria-hidden /> {areas[d.area] ?? d.area}
                  </p>
                  {d.note && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{d.note}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
