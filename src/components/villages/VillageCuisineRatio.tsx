import { UtensilsCrossed } from 'lucide-react';
import type { CuisineStats } from '@/lib/place-stats';

type Locale = 'el' | 'en' | 'de' | 'bg' | 'ru' | 'ro' | 'sr';

const T: Record<Locale, {
  title: string;
  greek: string;
  international: string;
  caption: (greek: number, intl: number, total: number) => string;
}> = {
  el: {
    title: 'Κουζίνα στην περιοχή',
    greek: 'Παραδοσιακή / ελληνική',
    international: 'Διεθνής',
    caption: (g, i, t) => `${g} παραδοσιακά εστιατόρια & ταβέρνες, ${i} διεθνή. Σύνολο ${t} καταγεγραμμένα.`,
  },
  en: {
    title: 'Local cuisine mix',
    greek: 'Greek / traditional',
    international: 'International',
    caption: (g, i, t) => `${g} traditional restaurants & tavernas, ${i} international. ${t} total listed.`,
  },
  de: {
    title: 'Küche in der Region',
    greek: 'Griechisch / traditionell',
    international: 'International',
    caption: (g, i, t) => `${g} traditionelle Restaurants & Tavernen, ${i} international. ${t} gelistet.`,
  },
  bg: {
    title: 'Кухня в района',
    greek: 'Гръцка / традиционна',
    international: 'Международна',
    caption: (g, i, t) => `${g} традиционни ресторанта и таверни, ${i} международни. Общо ${t} обявени.`,
  },
  ru: {
    title: 'Кухня в районе',
    greek: 'Греческая / традиционная',
    international: 'Международная',
    caption: (g, i, t) => `${g} традиционных ресторанов и таверн, ${i} международных. Всего ${t}.`,
  },
  ro: {
    title: 'Bucătărie în zonă',
    greek: 'Grecească / tradițională',
    international: 'Internațională',
    caption: (g, i, t) => `${g} restaurante tradiționale & taverne, ${i} internaționale. Total ${t} listate.`,
  },
  sr: {
    title: 'Kuhinja u oblasti',
    greek: 'Grčka / tradicionalna',
    international: 'Internacionalna',
    caption: (g, i, t) => `${g} tradicionalnih restorana i taverni, ${i} internacionalnih. Ukupno ${t}.`,
  },
};

export function VillageCuisineRatio({ stats, locale }: { stats: CuisineStats; locale: string }) {
  // Need at least 5 categorised restaurants to render a meaningful breakdown.
  if (stats.total < 5) return null;

  const t = T[(locale as Locale)] || T.en;
  const greekPct = stats.greekPct;
  const intlPct = 100 - greekPct;

  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
      <div className="flex items-center gap-2 mb-4">
        <UtensilsCrossed className="w-5 h-5 text-rose-600" />
        <h3 className="font-bold text-gray-900">{t.title}</h3>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden mb-3 bg-white">
        <div
          className="bg-rose-500 transition-all"
          style={{ width: `${greekPct}%` }}
          aria-label={`${t.greek}: ${greekPct}%`}
        />
        <div
          className="bg-amber-400 transition-all"
          style={{ width: `${intlPct}%` }}
          aria-label={`${t.international}: ${intlPct}%`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-xl p-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="text-xs text-gray-500">{t.greek}</div>
          </div>
          <div className="text-xl font-bold text-rose-700 tabular-nums mt-1">{greekPct}%</div>
        </div>
        <div className="bg-white rounded-xl p-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="text-xs text-gray-500">{t.international}</div>
          </div>
          <div className="text-xl font-bold text-amber-700 tabular-nums mt-1">{intlPct}%</div>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">
        {t.caption(stats.greekCount, stats.internationalCount, stats.total)}
      </p>
    </div>
  );
}
