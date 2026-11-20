'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DayState = 'past' | 'free' | 'busy' | 'outOnly' | 'inOnly';

/**
 * Changeover days, split diagonally: green #d1fae5 (emerald-100) for the free
 * half, grey #e2e8f0 (slate-200) for the booked half. One shade stronger than
 * the full cells so the split reads at a glance. AvailabilityCalendar's legend
 * repeats these two gradients.
 */
const HALF = {
  outOnly: 'linear-gradient(135deg, #d1fae5 50%, #e2e8f0 50%)', // morning free (leave), night booked
  inOnly: 'linear-gradient(135deg, #e2e8f0 50%, #d1fae5 50%)', // morning booked, night free (arrive)
} as const;

const CELL: Record<DayState, string> = {
  past: 'text-slate-300',
  free: 'bg-emerald-50 font-medium text-emerald-800',
  busy: 'bg-slate-100 text-slate-400 line-through',
  outOnly: 'font-medium text-slate-700',
  inOnly: 'font-medium text-emerald-800',
};

/**
 * The month grids of AvailabilityCalendar, browsable: two months side by side
 * (one on phones) with arrows through every month the server sent (a year).
 * Busy days arrive as ISO dates; everything else is computed here.
 */
export function AvailabilityMonths({
  busy, today, firstMonth, monthCount, lang, labels,
}: {
  busy: string[];
  /** YYYY-MM-DD in Greek time, so past days are greyed consistently with the server. */
  today: string;
  /** YYYY-MM of the first month. */
  firstMonth: string;
  monthCount: number;
  lang: string;
  labels: { prev: string; next: string; checkoutOnly: string; checkinOnly: string };
}) {
  const [offset, setOffset] = useState(0);
  const busySet = useMemo(() => new Set(busy), [busy]);
  const [y0, m0] = firstMonth.split('-').map(Number);
  const weekdays = useMemo(() => {
    const f = new Intl.DateTimeFormat(lang, { weekday: 'narrow' });
    return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2024, 0, 1 + i))));
  }, [lang]);
  const monthFmt = useMemo(() => new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric', timeZone: 'UTC' }), [lang]);

  const month = (i: number) => {
    const first = new Date(Date.UTC(y0, m0 - 1 + i, 1));
    const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    const lead = (first.getUTCDay() + 6) % 7; // Monday first
    const cells = [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, d) => {
        const iso = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), d + 1)).toISOString().slice(0, 10);
        const prev = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), d)).toISOString().slice(0, 10);
        // A date is the NIGHT that starts on it. Arriving needs that night free;
        // leaving that morning needs the night before free. So a booking's first
        // day is still open for check-out, and the day a booking ends for check-in.
        const nightBusy = busySet.has(iso);
        const prevBusy = busySet.has(prev);
        const state: DayState =
          iso < today ? 'past' : !nightBusy && !prevBusy ? 'free' : nightBusy && prevBusy ? 'busy' : nightBusy ? 'outOnly' : 'inOnly';
        return { day: d + 1, state };
      }),
    ];
    return { label: monthFmt.format(first), cells };
  };

  // Two visible at a time (one on phones); the arrows move one month, up to the
  // last month, so phones can reach it too.
  const last = monthCount - 1;
  const shown = [offset, offset + 1].filter((i) => i < monthCount);
  const arrow = 'flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-30';

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2">
        <button type="button" className={arrow} onClick={() => setOffset((o) => Math.max(0, o - 1))} disabled={offset === 0} aria-label={labels.prev}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" className={arrow} onClick={() => setOffset((o) => Math.min(last, o + 1))} disabled={offset >= last} aria-label={labels.next}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2" aria-live="polite">
        {shown.map((i, n) => {
          const m = month(i);
          return (
            <div key={i} className={`rounded-2xl border border-slate-200 bg-white p-4 ${n === 1 ? 'hidden sm:block' : ''}`}>
              <p className="mb-3 text-center text-sm font-semibold capitalize text-slate-800">{m.label}</p>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {weekdays.map((w, k) => <span key={k} className="pb-1 font-medium text-slate-400">{w}</span>)}
                {m.cells.map((c, k) =>
                  c ? (
                    <span
                      key={k}
                      title={c.state === 'outOnly' ? labels.checkoutOnly : c.state === 'inOnly' ? labels.checkinOnly : undefined}
                      style={HALF[c.state as keyof typeof HALF] ? { backgroundImage: HALF[c.state as keyof typeof HALF] } : undefined}
                      className={`rounded-md py-1.5 ${CELL[c.state]}`}
                    >
                      {c.day}
                    </span>
                  ) : <span key={k} />,
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
