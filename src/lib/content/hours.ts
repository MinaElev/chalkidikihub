import { htmlLang, type Locale } from '@/i18n/config';

/**
 * Opening hours were imported from Google in English ("Monday: 5:30 AM –
 * 3:00 PM, Tuesday: …") or typed as "10:00-22:00". This turns either form
 * into localized rows with 24-hour times, merging consecutive equal days.
 */

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function to24(t: string): string {
  const m = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(t.trim());
  if (!m) return t.trim();
  let h = Number(m[1]);
  const min = m[2] ?? '00';
  const ap = m[3]?.toUpperCase();
  if (ap === 'PM' && h < 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}

function dayName(index: number, locale: Locale, style: 'long' | 'short' = 'short') {
  // 2024-01-01 was a Monday.
  return new Intl.DateTimeFormat(htmlLang[locale], { weekday: style }).format(new Date(Date.UTC(2024, 0, 1 + index, 12)));
}

export type HoursRow = { days: string; time: string };

const CLOSED: Record<Locale, string> = {
  el: 'Κλειστά', en: 'Closed', de: 'Geschlossen', ro: 'Închis', bg: 'Затворено', sr: 'Zatvoreno', ru: 'Закрыто',
};
const ALL_DAY: Record<Locale, string> = {
  el: 'Όλο το 24ωρο', en: 'Open 24 hours', de: '24 Stunden geöffnet', ro: 'Deschis non-stop', bg: 'Денонощно', sr: 'Otvoreno 24 sata', ru: 'Круглосуточно',
};
const DAILY: Record<Locale, string> = {
  el: 'Καθημερινά', en: 'Daily', de: 'Täglich', ro: 'Zilnic', bg: 'Всеки ден', sr: 'Svakog dana', ru: 'Ежедневно',
};

function normaliseRange(raw: string, locale: Locale): string {
  const v = raw.trim();
  if (/^closed$/i.test(v)) return CLOSED[locale];
  if (/open 24 hours/i.test(v)) return ALL_DAY[locale];
  return v
    .split(/\s*,\s*/)
    .map((part) => part.split(/\s*[–—-]\s*/).map(to24).join('–'))
    .join(', ');
}

export function parseHours(hours: string | null | undefined, locale: Locale): HoursRow[] {
  const text = (hours ?? '').trim();
  if (!text) return [];
  const perDay = new Map<number, string>();
  for (const chunk of text.split(/(?=\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*:)/i)) {
    const m = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*:\s*(.*?)[\s,]*$/i.exec(chunk.trim());
    // v3's import truncated this column at ~100 chars, so the last day is
    // often cut mid-time ("Thursday: 5:30 "). Only complete values survive.
    if (m && /[–—-]|closed|24 hours/i.test(m[2])) perDay.set(DAYS.indexOf(m[1].toLowerCase()), normaliseRange(m[2], locale));
  }

  if (!perDay.size) return [{ days: DAILY[locale], time: normaliseRange(text, locale) }];

  const rows: HoursRow[] = [];
  let start = 0;
  for (let i = 1; i <= 7; i++) {
    if (i === 7 || perDay.get(i) !== perDay.get(start)) {
      const time = perDay.get(start);
      if (time) {
        const days =
          start === 0 && i === 7 ? DAILY[locale]
          : i - 1 === start ? dayName(start, locale)
          : `${dayName(start, locale)}–${dayName(i - 1, locale)}`;
        rows.push({ days, time });
      }
      start = i;
    }
  }
  return rows;
}

export const hoursSummary = (hours: string | null | undefined, locale: Locale) =>
  parseHours(hours, locale).map((r) => `${r.days} ${r.time}`).join('; ');

// ── Activity duration / price tokens (stored in English) ──────────────────
const TOKENS: Record<Locale, Array<[RegExp, string]>> = {
  el: [[/\bFree\b/i, 'Δωρεάν'], [/\bFull day\b/i, 'Ολοήμερη'], [/\bHalf day\b/i, 'Μισή μέρα'], [/\bFrom\b/i, 'Από'], [/\/person\b/i, '/άτομο'], [/(\d)\s*min\b/g, '$1 λεπτά'], [/(\d)\s*h\b/g, '$1 ώρες']],
  en: [[/(\d)\s*min\b/g, '$1 min'], [/(\d)\s*h\b/g, '$1 h']],
  de: [[/\bFree\b/i, 'Kostenlos'], [/\bFull day\b/i, 'Ganztägig'], [/\bHalf day\b/i, 'Halber Tag'], [/\bFrom\b/i, 'Ab'], [/\/person\b/i, '/Person'], [/(\d)\s*min\b/g, '$1 Min.'], [/(\d)\s*h\b/g, '$1 Std.']],
  ro: [[/\bFree\b/i, 'Gratuit'], [/\bFull day\b/i, 'O zi întreagă'], [/\bHalf day\b/i, 'Jumătate de zi'], [/\bFrom\b/i, 'De la'], [/\/person\b/i, '/persoană'], [/(\d)\s*min\b/g, '$1 min'], [/(\d)\s*h\b/g, '$1 ore']],
  bg: [[/\bFree\b/i, 'Безплатно'], [/\bFull day\b/i, 'Цял ден'], [/\bHalf day\b/i, 'Половин ден'], [/\bFrom\b/i, 'От'], [/\/person\b/i, '/човек'], [/(\d)\s*min\b/g, '$1 мин'], [/(\d)\s*h\b/g, '$1 ч']],
  sr: [[/\bFree\b/i, 'Besplatno'], [/\bFull day\b/i, 'Ceo dan'], [/\bHalf day\b/i, 'Pola dana'], [/\bFrom\b/i, 'Od'], [/\/person\b/i, '/osobi'], [/(\d)\s*min\b/g, '$1 min'], [/(\d)\s*h\b/g, '$1 h']],
  ru: [[/\bFree\b/i, 'Бесплатно'], [/\bFull day\b/i, 'Целый день'], [/\bHalf day\b/i, 'Полдня'], [/\bFrom\b/i, 'От'], [/\/person\b/i, '/чел.'], [/(\d)\s*min\b/g, '$1 мин'], [/(\d)\s*h\b/g, '$1 ч']],
};

export function localizeToken(value: string | null | undefined, locale: Locale): string {
  let v = (value ?? '').trim();
  if (!v) return '';
  for (const [re, to] of TOKENS[locale]) v = v.replace(re, to);
  return v.replace(/(\d+)\s*-\s*(\d+)/g, '$1–$2');
}
