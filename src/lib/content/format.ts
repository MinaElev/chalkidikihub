import { htmlLang, type Locale } from '@/i18n/config';

const UNITS: Record<Locale, { km: string; m: string }> = {
  el: { km: 'χλμ.', m: 'μ.' },
  en: { km: 'km', m: 'm' },
  de: { km: 'km', m: 'm' },
  ro: { km: 'km', m: 'm' },
  bg: { km: 'км', m: 'м' },
  sr: { km: 'km', m: 'm' },
  ru: { km: 'км', m: 'м' },
};

/** "600 m" under 1 km, "3,2 km" under 10 km, "14 km" beyond — with the locale's decimal mark. */
export function formatDistance(km: number, locale: Locale): string {
  const u = UNITS[locale];
  if (km < 1) return `${Math.max(50, Math.round(km * 20) * 50)} ${u.m}`;
  const n = new Intl.NumberFormat(htmlLang[locale], { maximumFractionDigits: km < 10 ? 1 : 0 }).format(km);
  return `${n} ${u.km}`;
}

/** "Α, Β και Γ" / "A, B and C" / "А, Б и В". */
export function formatList(items: string[], locale: Locale): string {
  return new Intl.ListFormat(htmlLang[locale], { style: 'long', type: 'conjunction' }).format(items);
}

export function formatDate(iso: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(htmlLang[locale], { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso),
  );
}

export function formatPrice(amount: number, locale: Locale, currency = 'EUR'): string {
  return new Intl.NumberFormat(htmlLang[locale], { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export const capitalize = (s: string) => (s ? s[0].toLocaleUpperCase() + s.slice(1) : s);
