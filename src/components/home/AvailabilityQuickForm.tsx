'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Check, ChevronDown, MapPin, Minus, Plus, Send, Users } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { DateRangePicker } from '@/components/forms/DateRangePicker';

/**
 * The first step of the availability request, on the home page: area, dates
 * and adults. Nothing is sent from here. The answers are saved as the request
 * form's own draft (same localStorage key and field names, which that form
 * restores on load) and the visitor continues on /availability-request, where
 * the contact details, validation and anti-spam checks live.
 *
 * Needs the `availabilityRequest` messages (wrap in <ClientIntl>): the dates
 * use the request form's own linked calendar, so check-out can never be on or
 * before check-in.
 */
const DRAFT_KEY = 'chub_availability_request_v1';

export type QuickFormLabels = {
  /** The title in two parts; the second is highlighted. */
  titleA: string;
  titleB: string;
  lead: string;
  area: string; anyArea: string; checkIn: string; checkOut: string; adults: string; submit: string; note: string;
};

/** Area picker: a button and a list we style ourselves (a native <select> opens the browser's own grey menu). */
function AreaSelect({ value, onChange, options, label, anyLabel }: {
  value: string;
  onChange: (v: string) => void;
  options: Record<string, string>;
  label: string;
  anyLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const items: [string, string][] = [['', anyLabel], ...Object.entries(options)];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const choose = (v: string) => { onChange(v); setOpen(false); };
  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { setOpen(true); setActive(Math.max(0, items.findIndex(([k]) => k === value))); return; }
      setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length);
    } else if ((e.key === 'Enter' || e.key === ' ') && open) {
      e.preventDefault();
      choose(items[active][0]);
    }
  }

  return (
    <div ref={root} className="relative" onKeyDown={onKey}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => { setOpen((o) => !o); setActive(Math.max(0, items.findIndex(([k]) => k === value))); }}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2.5 text-left transition ${open ? 'border-sea-500 ring-4 ring-sea-500/10' : 'border-gray-200 hover:bg-gray-50'}`}
      >
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><MapPin className="size-3.5" aria-hidden /> {label}</span>
          <span className="block truncate text-[15px] font-semibold text-gray-900">{value ? options[value] : anyLabel}</span>
        </span>
        <ChevronDown className={`size-5 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && (
        <ul role="listbox" aria-label={label} className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl">
          {items.map(([k, v], i) => (
            <li key={k || 'any'} role="option" aria-selected={k === value}>
              <button
                type="button"
                onClick={() => choose(k)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  i === active ? 'bg-sea-50 text-sea-800' : 'text-gray-800'
                } ${k === value ? 'font-semibold' : ''}`}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className={`size-4 ${k === value ? 'text-sea-600' : 'text-slate-400'}`} aria-hidden /> {v}
                </span>
                {k === value && <Check className="size-4 text-sea-600" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AvailabilityQuickForm({ areas, labels, image }: {
  areas: Record<string, string>;
  labels: QuickFormLabels;
  /** A real photo for the right-hand side (desktop only). */
  image?: string | null;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('availabilityRequest');
  const [area, setArea] = useState('');
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [adults, setAdults] = useState(2);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...saved, ...(area ? { area } : {}), check_in: dates.checkIn, check_out: dates.checkOut, adults }));
    } catch {
      // Storage blocked: the visitor simply fills the dates in on the next page.
    }
    router.push(area ? `/availability-request?area=${area}` : '/availability-request');
  }

  const step = 'flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-100 disabled:opacity-30';

  return (
    <section aria-labelledby="quick-request" className="relative isolate z-20 bg-sky-50">
      {/* Photo on the right, fading into the light background so the text stays readable. */}
      {image && (
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] overflow-hidden md:block" aria-hidden>
          <Image src={image} alt="" fill sizes="58vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-sky-50/70 to-transparent" />
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h2 id="quick-request" className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {labels.titleA} <span className="text-sea-600">{labels.titleB}</span>
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">{labels.lead}</p>
        </div>

        <form onSubmit={submit} className="mt-4 rounded-2xl bg-white p-4 shadow-lg shadow-sea-900/10">
          <div className="grid gap-3 lg:grid-cols-[1.1fr_1.7fr_0.8fr_auto] lg:items-start">
            <AreaSelect value={area} onChange={setArea} options={areas} label={labels.area} anyLabel={labels.anyArea} />

            {/* One calendar for both dates: first tap is check-in, second is check-out, earlier days can't be the check-out. */}
            <DateRangePicker
              checkIn={dates.checkIn}
              checkOut={dates.checkOut}
              onChange={setDates}
              locale={locale}
              floating
              labels={{
                checkIn: labels.checkIn, checkOut: labels.checkOut, addDate: t('addDate'),
                pickCheckIn: t('pickCheckIn'), pickCheckOut: t('pickCheckOut'),
                clear: t('clearDates'), done: t('done'), prev: t('prevMonth'), next: t('nextMonth'),
                nights: (count) => t('nights', { count }),
              }}
            />

            <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
              <span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><Users className="size-3.5" aria-hidden /> {labels.adults}</span>
                <span className="block text-[15px] font-semibold tabular-nums text-gray-900" aria-live="polite">{adults}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <button type="button" onClick={() => setAdults((n) => Math.max(1, n - 1))} disabled={adults <= 1} aria-label={t('fewer')} className={step}><Minus className="size-4" aria-hidden /></button>
                <button type="button" onClick={() => setAdults((n) => Math.min(20, n + 1))} disabled={adults >= 20} aria-label={t('more')} className={step}><Plus className="size-4" aria-hidden /></button>
              </span>
            </div>

            <button type="submit" className="inline-flex h-[3.625rem] items-center justify-center gap-2 rounded-xl bg-sea-600 px-6 text-sm font-bold text-white shadow-lg shadow-sea-600/30 transition-colors hover:bg-sea-700">
              <Send className="size-4" aria-hidden /> {labels.submit} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
          <p className="mt-2.5 text-xs text-slate-500">{labels.note}</p>
        </form>
      </div>
    </section>
  );
}
