'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

/** YYYY-MM-DD in the visitor's own time zone (toISOString would give UTC: "yesterday" after midnight in Greece). */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return isoDate(d);
};
export const nightsBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86_400_000);

export type DateRangeLabels = {
  checkIn: string;
  checkOut: string;
  addDate: string;
  pickCheckIn: string;
  pickCheckOut: string;
  clear: string;
  done: string;
  prev: string;
  next: string;
  nights: (n: number) => string;
};

/**
 * One calendar for both dates: the first tap sets check-in, the second sets
 * check-out, and days before check-in can't be picked as check-out. Two months
 * side by side on wider screens, one on phones. Opens inline (no popover), so
 * it never runs off a phone screen.
 */
export function DateRangePicker({
  checkIn, checkOut, onChange, locale, labels, maxDays = 365, invalid,
}: {
  checkIn: string;
  checkOut: string;
  onChange: (v: { checkIn: string; checkOut: string }) => void;
  locale: string;
  labels: DateRangeLabels;
  /** How far ahead check-in may be (the server allows a year). */
  maxDays?: number;
  invalid?: boolean;
}) {
  const today = useMemo(() => isoDate(new Date()), []);
  const lastCheckIn = useMemo(() => addDays(today, maxDays), [today, maxDays]);
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState<'in' | 'out'>('in');
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState(() => {
    const d = checkIn ? parse(checkIn) : new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }), [locale]);
  const monthFmt = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }), [locale]);
  const longFmt = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), [locale]);
  // Monday-first weekday initials in the page's language.
  const weekdays = useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
    return Array.from({ length: 7 }, (_, i) => f.format(new Date(2024, 0, 1 + i)));
  }, [locale]);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const rangeEnd = checkOut || (picking === 'out' && hover && checkIn && hover > checkIn ? hover : '');

  function openAt(which: 'in' | 'out') {
    setPicking(which === 'out' && checkIn ? 'out' : 'in');
    const anchor = which === 'out' && checkOut ? checkOut : checkIn;
    if (anchor) {
      const d = parse(anchor);
      setView({ y: d.getFullYear(), m: d.getMonth() });
    }
    setOpen(true);
  }

  function pick(day: string) {
    if (picking === 'in' || !checkIn || day <= checkIn) {
      onChange({ checkIn: day, checkOut: '' });
      setPicking('out');
      return;
    }
    onChange({ checkIn, checkOut: day });
    setPicking('in');
    setHover(null);
    setOpen(false);
  }

  const shift = (n: number) => setView(({ y, m }) => {
    const d = new Date(y, m + n, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const atStart = view.y === parse(today).getFullYear() && view.m === parse(today).getMonth();
  const atEnd = isoDate(new Date(view.y, view.m + 1, 1)) > lastCheckIn;

  // A render function, not a component: a component defined in here would
  // remount on every hover and drop keyboard focus.
  function month(offset: number, className = '') {
    const first = new Date(view.y, view.m + offset, 1);
    const lead = (first.getDay() + 6) % 7; // Monday = 0
    const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, i) => isoDate(new Date(first.getFullYear(), first.getMonth(), i + 1))),
    ];
    return (
      <div className={className}>
        <p className="mb-2 text-center text-sm font-semibold capitalize text-gray-900">{monthFmt.format(first)}</p>
        <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500">
          {weekdays.map((w, i) => <span key={i} className="py-1">{w}</span>)}
        </div>
        <div className="grid grid-cols-7" onMouseLeave={() => setHover(null)}>
          {cells.map((day, i) => {
            if (!day) return <span key={i} />;
            const disabled = day < today || (picking === 'in' || !checkIn ? day > lastCheckIn : false);
            const isStart = day === checkIn;
            const isEnd = day === rangeEnd;
            const inRange = Boolean(checkIn && rangeEnd && day > checkIn && day < rangeEnd);
            const before = picking === 'out' && checkIn && day <= checkIn && !isStart;
            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                onClick={() => pick(day)}
                onMouseEnter={() => setHover(day)}
                aria-label={longFmt.format(parse(day))}
                aria-pressed={isStart || isEnd}
                className={[
                  'relative h-10 text-sm tabular-nums transition',
                  inRange ? 'bg-sea-50 text-sea-900' : '',
                  isStart && rangeEnd ? 'rounded-l-full bg-sea-50' : '',
                  isEnd ? 'rounded-r-full bg-sea-50' : '',
                  disabled ? 'cursor-not-allowed text-gray-300 line-through decoration-gray-200' : before ? 'text-gray-400 hover:text-gray-700' : 'text-gray-800',
                ].join(' ')}
              >
                <span
                  className={[
                    'mx-auto flex size-10 items-center justify-center rounded-full',
                    isStart || isEnd ? 'bg-sea-600 font-semibold text-white' : '',
                    !disabled && !isStart && !isEnd ? 'hover:ring-2 hover:ring-sea-300' : '',
                    day === today && !isStart && !isEnd ? 'font-bold underline underline-offset-4' : '',
                  ].join(' ')}
                >
                  {Number(day.slice(8))}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const half = (which: 'in' | 'out') => {
    const value = which === 'in' ? checkIn : checkOut;
    const active = open && picking === which;
    return (
      <button
        type="button"
        onClick={() => (active ? setOpen(false) : openAt(which))}
        aria-expanded={open}
        className={`flex min-w-0 flex-1 flex-col items-start px-4 py-2.5 text-left transition ${active ? 'bg-sea-50' : 'hover:bg-gray-50'}`}
      >
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <CalendarDays className="size-3.5" aria-hidden />
          {which === 'in' ? labels.checkIn : labels.checkOut}
        </span>
        <span className={`truncate text-[15px] ${value ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
          {value ? fmt.format(parse(value)) : labels.addDate}
        </span>
      </button>
    );
  };

  return (
    <div>
      <div className={`flex overflow-hidden rounded-xl border bg-white ${invalid ? 'border-red-300' : open ? 'border-sea-500 ring-4 ring-sea-500/10' : 'border-gray-200'}`}>
        {half('in')}
        <span className="my-2 w-px bg-gray-200" aria-hidden />
        {half('out')}
      </div>

      {open && (
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <button type="button" onClick={() => shift(-1)} disabled={atStart} aria-label={labels.prev} className="flex size-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-30">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <p className="text-sm font-medium text-sea-700" aria-live="polite">
              {picking === 'in' ? labels.pickCheckIn : labels.pickCheckOut}
            </p>
            <button type="button" onClick={() => shift(1)} disabled={atEnd} aria-label={labels.next} className="flex size-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-30">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {month(0)}
            {month(1, 'hidden sm:block')}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => { onChange({ checkIn: '', checkOut: '' }); setPicking('in'); }}
              className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline disabled:opacity-40"
              disabled={!checkIn}
            >
              {labels.clear}
            </button>
            {nights > 0 && <span className="text-sm font-semibold text-gray-900">{labels.nights(nights)}</span>}
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-sea-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sea-700">
              {labels.done}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
