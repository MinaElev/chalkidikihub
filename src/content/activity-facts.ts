/**
 * Opening hours and admission from the official operators, read 2026-11-23
 * (pages saved in audit/sources/sites). These replace the database's
 * price text, which was unsourced and wrong (e.g. Olynthos "€4-8", official
 * €10/€5). Re-check each spring: the Ministry revises prices.
 *
 * - hh.gr = Hellenic Heritage, the Ministry of Culture / ΟΔΑΠ platform.
 * - nea-propontida.gr = Municipality of Nea Propontida.
 */
export type Season = {
  /** Months, 1–12, inclusive (a range may wrap the year, e.g. 11–3). */
  from: number;
  to: number;
  open: string;
  close: string;
  /** Closed weekday, 0 = Sunday … 6 = Saturday. */
  closed?: number;
  /** Open Monday–Friday only. */
  weekdays?: boolean;
};

export type OfficialFacts = {
  source: string;
  sourceName: string;
  /** Euro; null = free admission. */
  price: { full: number; reduced: number } | null;
  hours: Season[];
};

export const ACTIVITY_FACTS: Record<string, OfficialFacts> = {
  'ancient-olynthos': {
    source: 'https://www.hh.gr/en/destinations/olynthus/',
    sourceName: 'Hellenic Heritage (ΟΔΑΠ)',
    price: { full: 10, reduced: 5 },
    hours: [{ from: 1, to: 12, open: '08:30', close: '15:30', closed: 2 }],
  },
  'petralona-cave': {
    source: 'https://www.hh.gr/destinations/petralona-cave-and-museum/',
    sourceName: 'Hellenic Heritage (ΟΔΑΠ)',
    price: { full: 10, reduced: 5 },
    hours: [
      { from: 4, to: 8, open: '08:00', close: '20:00' },
      { from: 11, to: 3, open: '08:30', close: '15:30', closed: 2 },
    ],
  },
  'fisheries-museum': {
    source: 'https://www.nea-propontida.gr/directory/fisheries-museum/',
    sourceName: 'Δήμος Νέας Προποντίδας',
    price: null,
    hours: [{ from: 1, to: 12, open: '08:00', close: '16:00', weekdays: true }],
  },
};

const cap = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1);

/** "April–August: daily 08:00–20:00 · …" in the page's language, month and day names from Intl. */
export function formatSeasons(hours: Season[], locale: string, t: (key: string, values: Record<string, string>) => string): string {
  const month = (m: number) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2026, m - 1, 15));
  // 1 November 2026 is a Sunday, so 1 + d falls on weekday d.
  const weekday = (d: number) => new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(2026, 10, 1 + d));
  return hours
    .map((s) => {
      const time = `${s.open}–${s.close}`;
      const when = s.weekdays
        ? t('hoursWeekdays', { time })
        : s.closed !== undefined
          ? t('hoursClosedOn', { time, day: weekday(s.closed) })
          : t('hoursDaily', { time });
      return s.from === 1 && s.to === 12 ? cap(when) : `${cap(month(s.from))}–${month(s.to)}: ${when}`;
    })
    .join(' · ');
}
