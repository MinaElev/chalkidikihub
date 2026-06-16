import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Waves, UtensilsCrossed, Landmark, Sparkles, ChevronRight } from 'lucide-react';
import { BEST_GUIDES } from './[slug]/best-data';
import { localeUrl } from '@/lib/seo';

const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only - hidden locales remain routable but unindexed

const INDEX_TITLE: Record<string, string> = {
  el: 'Best of Χαλκιδική — Ταξιδιωτικοί Οδηγοί',
  en: 'Best of Halkidiki — Travel Guides',
  de: 'Best of Chalkidiki — Reiseführer',
  bg: 'Най-доброто от Халкидики — Пътеводители',
  ru: 'Лучшее в Халкидики — Путеводители',
  ro: 'Best of Halkidiki — Ghiduri',
  sr: 'Najbolje od Halkidikija — Vodiči',
};
const INDEX_INTRO: Record<string, string> = {
  el: 'Συγκεντρωμένοι οδηγοί για να βρεις γρήγορα τι ψάχνεις — τις καλύτερες παραλίες ανά περιοχή, ρομαντικά εστιατόρια, μονοπάτια, ιστορικά αξιοθέατα.',
  en: 'Curated guides so you can find what you need fast — top beaches by peninsula, romantic restaurants, hiking trails, historical sites.',
  de: 'Kuratierte Reiseführer — Top-Strände pro Halbinsel, romantische Restaurants, Wanderwege, historische Stätten.',
  bg: 'Кратки пътеводители — топ плажове, ресторанти, маршрути, исторически места.',
  ru: 'Подборки — лучшие пляжи, рестораны, маршруты, исторические места.',
  ro: 'Ghiduri — cele mai bune plaje, restaurante, trasee, situri istorice.',
  sr: 'Vodiči — najbolje plaže, restorani, staze, istorijska mesta.',
};

const ICON_MAP = { Waves, UtensilsCrossed, Landmark } as const;

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  cyan:  { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200' },
  red:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200' },
  amber: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = INDEX_TITLE[locale] || INDEX_TITLE.en;
  const description = INDEX_INTRO[locale] || INDEX_INTRO.en;
  return {
    // Root [locale]/layout.tsx template appends " | Chalkidiki Hub" — avoid double branding.
    title,
    description,
    alternates: {
      canonical: localeUrl(locale, 'best'),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, 'best')])),
        'x-default': localeUrl('el', 'best'),
      },
    },
    openGraph: { title, description, type: 'website', locale, siteName: 'Chalkidiki Hub' },
  };
}

export default async function BestIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const title = INDEX_TITLE[locale] || INDEX_TITLE.en;
  const intro = INDEX_INTRO[locale] || INDEX_INTRO.en;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-600 mb-2">
        <Sparkles className="inline w-3 h-3 mr-1" /> Best of Halkidiki
      </p>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-gray-600 max-w-3xl leading-relaxed mb-10">{intro}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BEST_GUIDES.map(guide => {
          const Icon = ICON_MAP[guide.icon as keyof typeof ICON_MAP] || Sparkles;
          const c = COLOR_MAP[guide.color] || COLOR_MAP.cyan;
          const gTitle = guide.title[locale] || guide.title.en;
          const gDesc = guide.description[locale] || guide.description.en;
          return (
            <Link
              key={guide.slug}
              href={`/${locale === 'el' ? '' : locale + '/'}best/${guide.slug}`}
              className={`group flex flex-col p-5 rounded-2xl border-2 ${c.border} ${c.bg} hover:shadow-lg hover:-translate-y-0.5 transition-all`}
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/80 ${c.text} mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1.5 leading-tight">{gTitle}</h2>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{gDesc}</p>
              <div className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${c.text} group-hover:gap-2 transition-all`}>
                {locale === 'el' ? 'Δες τον οδηγό' : 'View guide'}
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
