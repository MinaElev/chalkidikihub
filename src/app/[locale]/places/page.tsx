import { setRequestLocale } from 'next-intl/server';
import { publicLocales } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { MapPin, Users, ChevronRight, Home } from 'lucide-react';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';
import { AREAS } from '@/lib/constants';
import { localeUrl, generateBreadcrumbLD } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = publicLocales;

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ area?: string }>;
};

// ───────────────────────────────────────────────────────────────────────
// i18n
// ───────────────────────────────────────────────────────────────────────
const T: Record<string, Record<string, string>> = {
  title: {
    el: 'Χωριά & Οικισμοί στη Χαλκιδική',
    en: 'Villages & Settlements in Halkidiki',
    de: 'Dörfer & Siedlungen in Chalkidiki',
    bg: 'Села и селища в Халкидики',
    ru: 'Деревни и поселения Халкидики',
    ro: 'Sate și așezări în Halkidiki',
    sr: 'Sela i naselja u Halkidikiju',
  },
  subtitle: {
    el: 'Εξερεύνησε όλα τα χωριά και τις τοποθεσίες της Χαλκιδικής',
    en: 'Explore every village and destination in Halkidiki',
    de: 'Entdecke jedes Dorf und Reiseziel in Chalkidiki',
    bg: 'Открийте всяко село и дестинация в Халкидики',
    ru: 'Откройте для себя все деревни Халкидики',
    ro: 'Explorează fiecare sat și destinație din Halkidiki',
    sr: 'Istražite svako selo i destinaciju u Halkidikiju',
  },
  breadcrumbHome: {
    el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало',
    ru: 'Главная', ro: 'Acasă', sr: 'Početna',
  },
  breadcrumbPlaces: {
    el: 'Χωριά', en: 'Places', de: 'Orte', bg: 'Места',
    ru: 'Места', ro: 'Locuri', sr: 'Mesta',
  },
  allAreas: {
    el: 'Όλες οι περιοχές', en: 'All areas', de: 'Alle Gebiete',
    bg: 'Всички региони', ru: 'Все регионы', ro: 'Toate zonele', sr: 'Sve oblasti',
  },
  countLabel: {
    el: 'χωριά', en: 'villages', de: 'Dörfer', bg: 'села',
    ru: 'деревень', ro: 'sate', sr: 'sela',
  },
  exploreMore: {
    el: 'Εξερεύνησε', en: 'Explore', de: 'Entdecken',
    bg: 'Разгледайте', ru: 'Исследовать', ro: 'Explorează', sr: 'Istraži',
  },
};

const tr = (key: string, locale: string) => T[key]?.[locale] || T[key]?.en || key;

// ───────────────────────────────────────────────────────────────────────
// Metadata
// ───────────────────────────────────────────────────────────────────────
const META_DESCRIPTIONS: Record<string, string> = {
  el: 'Όλα τα χωριά της Χαλκιδικής — Κασσάνδρα, Σιθωνία και Άθως. Παραλίες, εστιατόρια, δραστηριότητες και καταλύματα ανά χωριό.',
  en: 'Every village in Halkidiki — Kassandra, Sithonia and Athos peninsulas. Beaches, restaurants, activities and stays for each destination.',
  de: 'Alle Dörfer in Chalkidiki — Halbinseln Kassandra, Sithonia und Athos. Strände, Restaurants, Aktivitäten und Unterkünfte pro Ortschaft.',
  bg: 'Всички села в Халкидики — полуостровите Касандра, Ситония и Атон. Плажове, ресторанти, дейности и настаняване във всяко село.',
  ru: 'Все деревни Халкидики — полуострова Кассандра, Ситония и Афон. Пляжи, рестораны, активности и жильё в каждой деревне.',
  ro: 'Toate satele din Halkidiki — peninsulele Kassandra, Sithonia și Athos. Plaje, restaurante, activități și cazări pentru fiecare destinație.',
  sr: 'Sva sela Halkidikija — poluostrva Kasandra, Sitonija i Atos. Plaže, restorani, aktivnosti i smeštaj za svako odredište.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // Root [locale]/layout.tsx template appends " | Chalkidiki Hub" — avoid double branding.
  const title = tr('title', locale);
  const description = META_DESCRIPTIONS[locale] || META_DESCRIPTIONS.en;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale },
    alternates: {
      canonical: localeUrl(locale, 'places'),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, 'places')])),
        'x-default': localeUrl('el', 'places'),
      },
    },
  };
}

// ───────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────
export default async function PlacesIndexPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { area: areaFilter } = await searchParams;
  setRequestLocale(locale);

  // Fetch all villages (or filtered)
  const supabase = createApiClient();
  let q = supabase.from('villages').select('*').order('sort_order', { ascending: true });
  if (areaFilter) q = q.eq('area', areaFilter);
  const { data } = await q.limit(500);

  const villages = (data || []).map((row) => ({
    slug: row.slug,
    area: row.area as string,
    name: toLocaleMap(row, 'name'),
    population: row.population as number,
    image_url: (row.image_url as string) || '',
  }));

  // Group by area
  const byArea: Record<string, typeof villages> = {};
  villages.forEach((v) => {
    if (!byArea[v.area]) byArea[v.area] = [];
    byArea[v.area].push(v);
  });

  // Order: kassandra, sithonia, athos, mainland
  const orderedAreas = areaFilter
    ? [areaFilter]
    : AREAS.map(a => a.slug).filter(s => byArea[s]?.length);

  const total = villages.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary-600 inline-flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          {tr('breadcrumbHome', locale)}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800 font-medium">{tr('breadcrumbPlaces', locale)}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {tr('title', locale)}
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          {tr('subtitle', locale)} · <span className="font-semibold text-gray-900">{total} {tr('countLabel', locale)}</span>
        </p>
      </header>

      {/* Area filter chips */}
      <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-gray-200">
        <Link
          href="/places"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !areaFilter
              ? 'bg-primary-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'
          }`}
        >
          {tr('allAreas', locale)}
        </Link>
        {AREAS.map((area) => {
          const count = villages.filter(v => v.area === area.slug).length || byArea[area.slug]?.length || 0;
          // If a filter is active, counts for other areas are 0 (we didn't fetch them).
          // Show them anyway as selectable.
          const label = area.name[locale] || area.name.en;
          const active = areaFilter === area.slug;
          return (
            <Link
              key={area.slug}
              href={`/places?area=${area.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'
              }`}
            >
              {label}
              {!areaFilter && count > 0 && (
                <span className={`ml-1.5 text-xs ${active ? 'text-white/80' : 'text-gray-400'}`}>
                  ({count})
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Villages grouped by area */}
      {orderedAreas.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          {locale === 'el' ? 'Δεν βρέθηκαν χωριά.' : 'No villages found.'}
        </p>
      )}

      {orderedAreas.map((areaSlug) => {
        const areaInfo = AREAS.find(a => a.slug === areaSlug);
        const items = byArea[areaSlug] || [];
        if (!items.length) return null;
        const areaName = areaInfo?.name[locale] || areaInfo?.name.en || areaSlug;

        return (
          <section key={areaSlug} className="mb-10">
            {!areaFilter && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-700">
                    <MapPin className="w-4 h-4" />
                  </span>
                  {areaName}
                  <span className="text-xs font-medium text-gray-400 ml-1">({items.length})</span>
                </h2>
                <Link
                  href={`/areas/${areaSlug}`}
                  className="text-sm text-primary-600 hover:underline font-medium inline-flex items-center gap-1"
                >
                  {tr('exploreMore', locale)} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {items.map((v) => {
                const name = v.name[locale] || v.name.el || v.name.en;
                return (
                  <Link
                    key={v.slug}
                    href={`/places/${v.slug}`}
                    className="group flex items-center gap-2.5 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-primary-100 text-gray-400 group-hover:text-primary-600 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-primary-800 truncate">
                        {name}
                      </div>
                      {v.population > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <Users className="w-3 h-3" />
                          {v.population.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Breadcrumb JSON-LD */}
      <JsonLd data={generateBreadcrumbLD([
        { name: tr('breadcrumbHome', locale), url: localeUrl(locale, '') },
        { name: tr('breadcrumbPlaces', locale), url: localeUrl(locale, 'places') },
      ]) as unknown as Record<string, unknown>} />

      {/* ItemList JSON-LD — helps Google show this as a rich list result */}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: tr('title', locale),
        description: tr('subtitle', locale),
        numberOfItems: total,
        itemListElement: villages.map((v, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: v.name[locale] || v.name.el || v.name.en,
          url: localeUrl(locale, `places/${v.slug}`),
        })),
      }} />
    </div>
  );
}
