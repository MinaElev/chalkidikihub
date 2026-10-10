/**
 * Shared helpers for the /events section.
 *
 * Halkidiki festivals are overwhelmingly ANNUAL and recur in the same window
 * every year, so `events` rows carry an evergreen month window
 * (season_start_month / season_end_month) that is always true, plus OPTIONAL
 * exact dates for the current edition.
 *
 * Display rule (single source of truth, used by both the index and the detail
 * page): show exact dates only while they are still meaningful — i.e. the
 * edition has not finished yet. Once it has, fall back to the evergreen window
 * so a page never advertises a date that has already passed.
 */

export type EventRow = {
  slug: string;
  area: string;
  location_name?: string | null;
  venue?: string | null;
  category: string;
  is_free?: boolean | null;
  official_url?: string | null;
  season_start_month?: number | null;
  season_end_month?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  [key: string]: unknown;
};

export const EVENT_CATEGORIES = ['music', 'cultural', 'religious', 'food', 'arts', 'sports'] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  music: { el: 'Μουσική', en: 'Music', de: 'Musik', bg: 'Музика', ru: 'Музыка', ro: 'Muzică', sr: 'Muzika' },
  cultural: { el: 'Πολιτισμός', en: 'Culture', de: 'Kultur', bg: 'Култура', ru: 'Культура', ro: 'Cultură', sr: 'Kultura' },
  religious: { el: 'Θρησκευτικά', en: 'Religious', de: 'Religiös', bg: 'Религиозни', ru: 'Религиозные', ro: 'Religioase', sr: 'Verski' },
  food: { el: 'Γαστρονομία', en: 'Food & Wine', de: 'Kulinarik', bg: 'Кулинарни', ru: 'Гастрономия', ro: 'Gastronomie', sr: 'Gastronomija' },
  arts: { el: 'Τέχνες', en: 'Arts', de: 'Kunst', bg: 'Изкуства', ru: 'Искусство', ro: 'Arte', sr: 'Umetnost' },
  sports: { el: 'Αθλητικά', en: 'Sports', de: 'Sport', bg: 'Спорт', ru: 'Спорт', ro: 'Sport', sr: 'Sport' },
};

/** Nominative month names — used when a month stands alone ("Αύγουστος"). */
const MONTHS: Record<string, string[]> = {
  el: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  bg: ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'],
  ru: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  ro: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
  sr: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
};

export function monthName(month: number, locale: string): string {
  const table = MONTHS[locale] || MONTHS.en;
  return table[Math.min(Math.max(month, 1), 12) - 1];
}

const EVERY_YEAR: Record<string, string> = {
  el: 'κάθε χρόνο', en: 'every year', de: 'jedes Jahr', bg: 'всяка година',
  ru: 'каждый год', ro: 'în fiecare an', sr: 'svake godine',
};

/**
 * Evergreen recurrence label, e.g. "κάθε χρόνο, Ιούνιος – Σεπτέμβριος".
 * Returns '' when the row has no season window.
 */
export function formatSeason(
  startMonth: number | null | undefined,
  endMonth: number | null | undefined,
  locale: string,
): string {
  if (!startMonth) return '';
  const every = EVERY_YEAR[locale] || EVERY_YEAR.en;
  if (!endMonth || endMonth === startMonth) {
    return `${every}, ${monthName(startMonth, locale)}`;
  }
  return `${every}, ${monthName(startMonth, locale)} – ${monthName(endMonth, locale)}`;
}

/** Exact dates, e.g. "12–14 Ιουλίου 2026" → localised via Intl. */
export function formatExactDates(
  startDate: string,
  endDate: string | null | undefined,
  locale: string,
): string {
  const fmt = new Intl.DateTimeFormat(locale === 'el' ? 'el-GR' : locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const start = new Date(startDate);
  if (!endDate || endDate === startDate) return fmt.format(start);
  return `${fmt.format(start)} – ${fmt.format(new Date(endDate))}`;
}

/**
 * True when the row has exact dates for an edition that has not finished yet.
 * Past editions deliberately fall back to the evergreen window rather than
 * showing a stale date.
 */
export function hasCurrentDates(e: Pick<EventRow, 'start_date' | 'end_date'>, now = new Date()): boolean {
  if (!e.start_date) return false;
  const finish = new Date(e.end_date || e.start_date);
  // Compare on date granularity: an event running today is still "current".
  finish.setHours(23, 59, 59, 999);
  return finish.getTime() >= now.getTime();
}

/** The single line a card/detail page should show for "when". */
export function whenLabel(e: EventRow, locale: string): string {
  if (hasCurrentDates(e)) return formatExactDates(e.start_date as string, e.end_date, locale);
  return formatSeason(e.season_start_month, e.season_end_month, locale);
}

/**
 * Sort so the section reads like a calendar: things happening now or soon
 * first, then the rest of the year in month order.
 */
export function sortByCalendar(events: EventRow[], now = new Date()): EventRow[] {
  const currentMonth = now.getMonth() + 1;
  const distance = (e: EventRow) => {
    const start = e.season_start_month || 13;
    const end = e.season_end_month || start;
    // In season right now → highest priority.
    if (start <= currentMonth && currentMonth <= end) return -1;
    const diff = start - currentMonth;
    return diff >= 0 ? diff : diff + 12; // wrap around the year
  };
  return [...events].sort((a, b) => distance(a) - distance(b));
}
