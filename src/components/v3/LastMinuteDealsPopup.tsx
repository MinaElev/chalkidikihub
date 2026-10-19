'use client';

/**
 * Last-Minute Deals popup (homepage)
 * -----------------------------------------------------------------------
 * A client island fed by /api/last-minute/deals (CDN-cached), so the homepage
 * stays static and visitors don't download the Supabase client for it.
 *
 * Shown a few seconds after load, bottom-right (desktop) / bottom sheet
 * (mobile). Dismissal is remembered in localStorage for 24h.
 */

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Zap, X, ChevronRight, MapPin, CalendarDays } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { AREA_NAMES } from '@/lib/content/place-names';

const T: Record<string, { ribbon: string; close: string; view: string; prev: string; next: string; all: string }> = {
  el: { ribbon: 'Τελευταία στιγμή', close: 'Κλείσιμο', view: 'Δες διαθεσιμότητα', prev: 'Προηγ.', next: 'Επόμ.', all: 'Δες όλες τις διαθεσιμότητες' },
  en: { ribbon: 'Last minute', close: 'Close', view: 'View availability', prev: 'Prev', next: 'Next', all: 'See all availability' },
  de: { ribbon: 'Last Minute', close: 'Schließen', view: 'Verfügbarkeit ansehen', prev: 'Zurück', next: 'Weiter', all: 'Alle Angebote ansehen' },
  ro: { ribbon: 'Last minute', close: 'Închide', view: 'Vezi disponibilitatea', prev: 'Înapoi', next: 'Înainte', all: 'Vezi toate ofertele' },
  bg: { ribbon: 'В последния момент', close: 'Затвори', view: 'Виж наличността', prev: 'Назад', next: 'Напред', all: 'Виж всички оферти' },
  sr: { ribbon: 'Last minute', close: 'Zatvori', view: 'Pogledaj dostupnost', prev: 'Nazad', next: 'Dalje', all: 'Pogledaj sve ponude' },
  ru: { ribbon: 'Горящие предложения', close: 'Закрыть', view: 'Смотреть даты', prev: 'Назад', next: 'Далее', all: 'Все предложения' },
};

const DISMISS_KEY = 'lmd_popup_dismissed_until';
const SHOW_DELAY_MS = 3500;
const DISMISS_HOURS = 24;
// On a phone the card is ~400px tall and anchored to the bottom, which lands it
// straight on top of the hero's search box — the homepage's primary action. So
// on narrow screens it waits until the visitor has scrolled past the hero.
const MOBILE_BREAKPOINT = 768;
const SCROLL_BEFORE_SHOW = 500;

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

export function LastMinuteDealsPopup() {
  const locale = useLocale() as Locale;
  const t = T[locale] ?? T.en;

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
    let cleanupScroll: (() => void) | undefined;
    (async () => {
      const res = await fetch(`/api/last-minute/deals?locale=${locale}`).catch(() => null);
      const mapped: Deal[] = res && res.ok ? await res.json() : [];
      if (cancelled) return;
      if (mapped.length === 0) return;
      setDeals(mapped);

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (!isMobile) {
        timer = setTimeout(() => { if (!cancelled) setVisible(true); }, SHOW_DELAY_MS);
        return;
      }
      const onScroll = () => {
        if (cancelled || window.scrollY < SCROLL_BEFORE_SHOW) return;
        setVisible(true);
        window.removeEventListener('scroll', onScroll);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      cleanupScroll = () => window.removeEventListener('scroll', onScroll);
    })();

    return () => { cancelled = true; if (timer) clearTimeout(timer); cleanupScroll?.(); };
  }, [locale]);

  // Claim the bottom-right corner while open so the availability button steps
  // aside (see globals.css), and release it on dismiss.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.setAttribute('data-deal-open', '');
    else root.removeAttribute('data-deal-open');
    return () => root.removeAttribute('data-deal-open');
  }, [visible]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_HOURS * 3_600_000));
    } catch { /* ignore */ }
  }

  if (!visible || deals.length === 0) return null;

  const deal = deals[idx];
  const areaLabel = AREA_NAMES[deal.area as keyof typeof AREA_NAMES]?.[locale] ?? deal.area;

  function fmtRange(s: string, e: string): string {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const locStr = locale;
    const sd = new Date(s + 'T00:00:00').toLocaleDateString(locStr, opts);
    const ed = new Date(e + 'T00:00:00').toLocaleDateString(locStr, opts);
    return s === e ? sd : `${sd} – ${ed}`;
  }

  return (
    <div
      className="lmd-popup fixed z-[60] animate-[lmd-in_0.35s_ease-out]"
      style={{ right: 16, bottom: 16, left: 'auto', width: 'min(360px, calc(100vw - 32px))' }}
    >
      <style>{`@keyframes lmd-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header ribbon */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-white">
          <Zap className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wide">
            {t.ribbon}
          </span>
          <button
            onClick={dismiss}
            className="ml-auto -mr-1 rounded-full p-1 hover:bg-white/20"
            aria-label={t.close}
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
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 group-hover:gap-2 transition-all">
              {t.view}
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Pager when multiple deals */}
        {deals.length > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
            <span className="text-[11px] text-slate-500 tabular-nums">
              {idx + 1} / {deals.length}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setIdx(i => (i - 1 + deals.length) % deals.length)}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                {t.prev}
              </button>
              <button
                onClick={() => setIdx(i => (i + 1) % deals.length)}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {t.next}
              </button>
            </div>
          </div>
        )}

        {/* See-all link — surfaces the dedicated page so no opening is lost */}
        {deals.length > 1 && (
          <Link
            href="/last-minute"
            onClick={dismiss}
            className="flex items-center justify-center gap-1 border-t border-slate-100 px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            {t.all} ({deals.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
