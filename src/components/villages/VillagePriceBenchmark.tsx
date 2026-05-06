import { Wallet, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { PriceStats } from '@/lib/place-stats';

type Locale = 'el' | 'en' | 'de' | 'bg' | 'ru' | 'ro' | 'sr';

const T: Record<Locale, {
  title: (v: string) => string;
  avg: string;
  min: string;
  max: string;
  perNight: string;
  cheaper: (pct: number, halkidiki: number, count: number) => string;
  pricier: (pct: number, halkidiki: number, count: number) => string;
  similar: (halkidiki: number, count: number) => string;
}> = {
  el: {
    title: (v) => `Τιμές καταλυμάτων στ${v.endsWith('ς') ? 'ον' : 'η'} ${v}`,
    avg: 'Μέση τιμή',
    min: 'Από',
    max: 'Έως',
    perNight: '/βραδιά',
    cheaper: (pct, h, c) => `Κατά μέσο όρο ${pct}% πιο φθηνά από τη Χαλκιδική συνολικά (€${h}/βραδιά). Δείγμα: ${c} καταλύματα.`,
    pricier: (pct, h, c) => `Κατά μέσο όρο ${pct}% πιο ακριβά από τη Χαλκιδική συνολικά (€${h}/βραδιά). Δείγμα: ${c} καταλύματα.`,
    similar: (h, c) => `Στο μέσο όρο της Χαλκιδικής (€${h}/βραδιά). Δείγμα: ${c} καταλύματα.`,
  },
  en: {
    title: (v) => `Accommodation prices in ${v}`,
    avg: 'Average',
    min: 'From',
    max: 'Up to',
    perNight: '/night',
    cheaper: (pct, h, c) => `On average ${pct}% cheaper than Halkidiki overall (€${h}/night). Sample: ${c} properties.`,
    pricier: (pct, h, c) => `On average ${pct}% more expensive than Halkidiki overall (€${h}/night). Sample: ${c} properties.`,
    similar: (h, c) => `In line with the Halkidiki average (€${h}/night). Sample: ${c} properties.`,
  },
  de: {
    title: (v) => `Unterkunftspreise in ${v}`,
    avg: 'Durchschnitt',
    min: 'Ab',
    max: 'Bis zu',
    perNight: '/Nacht',
    cheaper: (pct, h, c) => `Durchschnittlich ${pct}% günstiger als Chalkidiki insgesamt (€${h}/Nacht). Stichprobe: ${c} Unterkünfte.`,
    pricier: (pct, h, c) => `Durchschnittlich ${pct}% teurer als Chalkidiki insgesamt (€${h}/Nacht). Stichprobe: ${c} Unterkünfte.`,
    similar: (h, c) => `Auf dem Niveau des Chalkidiki-Durchschnitts (€${h}/Nacht). Stichprobe: ${c} Unterkünfte.`,
  },
  bg: {
    title: (v) => `Цени на настаняване в ${v}`,
    avg: 'Средно',
    min: 'От',
    max: 'До',
    perNight: '/нощувка',
    cheaper: (pct, h, c) => `Средно ${pct}% по-евтино от Халкидики като цяло (€${h}/нощувка). Извадка: ${c} имота.`,
    pricier: (pct, h, c) => `Средно ${pct}% по-скъпо от Халкидики като цяло (€${h}/нощувка). Извадка: ${c} имота.`,
    similar: (h, c) => `На нивото на средното за Халкидики (€${h}/нощувка). Извадка: ${c} имота.`,
  },
  ru: {
    title: (v) => `Цены на проживание в ${v}`,
    avg: 'В среднем',
    min: 'От',
    max: 'До',
    perNight: '/ночь',
    cheaper: (pct, h, c) => `В среднем на ${pct}% дешевле, чем по Халкидики в целом (€${h}/ночь). Выборка: ${c} объектов.`,
    pricier: (pct, h, c) => `В среднем на ${pct}% дороже, чем по Халкидики в целом (€${h}/ночь). Выборка: ${c} объектов.`,
    similar: (h, c) => `На уровне среднего по Халкидики (€${h}/ночь). Выборка: ${c} объектов.`,
  },
  ro: {
    title: (v) => `Prețuri de cazare în ${v}`,
    avg: 'Medie',
    min: 'De la',
    max: 'Până la',
    perNight: '/noapte',
    cheaper: (pct, h, c) => `În medie cu ${pct}% mai ieftin decât Halkidiki în general (€${h}/noapte). Eșantion: ${c} proprietăți.`,
    pricier: (pct, h, c) => `În medie cu ${pct}% mai scump decât Halkidiki în general (€${h}/noapte). Eșantion: ${c} proprietăți.`,
    similar: (h, c) => `La nivelul mediei din Halkidiki (€${h}/noapte). Eșantion: ${c} proprietăți.`,
  },
  sr: {
    title: (v) => `Cene smeštaja u ${v}`,
    avg: 'Prosek',
    min: 'Od',
    max: 'Do',
    perNight: '/noć',
    cheaper: (pct, h, c) => `U proseku ${pct}% jeftinije od Halkidikija u celini (€${h}/noć). Uzorak: ${c} smeštaja.`,
    pricier: (pct, h, c) => `U proseku ${pct}% skuplje od Halkidikija u celini (€${h}/noć). Uzorak: ${c} smeštaja.`,
    similar: (h, c) => `Na nivou proseka Halkidikija (€${h}/noć). Uzorak: ${c} smeštaja.`,
  },
};

export function VillagePriceBenchmark({
  stats,
  villageName,
  locale,
}: {
  stats: PriceStats;
  villageName: string;
  locale: string;
}) {
  // Need at least 3 listings in the village for a meaningful benchmark.
  if (!stats.village || stats.village.count < 3 || !stats.overall) return null;

  const t = T[(locale as Locale)] || T.en;
  const villageAvg = stats.village.avg;
  const overallAvg = stats.overall.avg;
  const diff = villageAvg - overallAvg;
  const pct = overallAvg > 0 ? Math.round((Math.abs(diff) / overallAvg) * 100) : 0;
  const Trend = pct < 5 ? Minus : diff < 0 ? TrendingDown : TrendingUp;
  const trendColor = pct < 5 ? 'text-gray-500' : diff < 0 ? 'text-emerald-600' : 'text-rose-600';
  const verdict =
    pct < 5
      ? t.similar(overallAvg, stats.village.count)
      : diff < 0
        ? t.cheaper(pct, overallAvg, stats.village.count)
        : t.pricier(pct, overallAvg, stats.village.count);

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-gray-900">{t.title(villageName)}</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">{t.avg}</div>
          <div className="text-2xl font-bold text-emerald-700 tabular-nums">€{villageAvg}</div>
          <div className="text-[10px] text-gray-400">{t.perNight}</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">{t.min}</div>
          <div className="text-xl font-bold text-gray-700 tabular-nums">€{stats.village.min}</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">{t.max}</div>
          <div className="text-xl font-bold text-gray-700 tabular-nums">€{stats.village.max}</div>
        </div>
      </div>

      <div className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
        <Trend className={`w-4 h-4 mt-0.5 shrink-0 ${trendColor}`} />
        <p>{verdict}</p>
      </div>
    </div>
  );
}
