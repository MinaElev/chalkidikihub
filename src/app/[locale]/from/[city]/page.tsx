import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { getFromCity, FROM_CITIES } from './from-data';
import { notFound } from 'next/navigation';
import { localeUrl } from '@/lib/seo';
import { createApiClient } from '@/lib/api-helpers';
import { FROM_CITY_COORDS, FROM_CITY_NAMES } from '@/lib/driving-distances';
import { DistanceTable } from '@/components/from/DistanceTable';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = { params: Promise<{ locale: string; city: string }> };

export function generateStaticParams() {
  return FROM_CITIES.map(c => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city } = await params;
  const guide = getFromCity(city);
  if (!guide) return { title: 'Not Found' };

  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const desc = guide.metaDesc[locale] || guide.metaDesc.en;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub', images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=guide`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=guide`] },
    alternates: {
      canonical: localeUrl(locale, `from/${city}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `from/${city}`)])),
        'x-default': localeUrl('el', `from/${city}`),
      },
    },
  };
}

export default async function FromCityPage({ params }: Props) {
  const { locale, city } = await params;
  setRequestLocale(locale);

  const guide = getFromCity(city);
  if (!guide) notFound();

  const title = guide.title[locale] || guide.title.en;
  const content = guide.content[locale] || guide.content.el;
  const description = guide.description[locale] || guide.description.en;

  // Driving-distance table data — fetch popular Halkidiki villages with
  // coordinates so we can compute approximate distance/time from this city.
  const cityCoords = FROM_CITY_COORDS[city];
  const popularSlugs = ['ouranoupoli', 'nea-moudania', 'kallithea', 'hanioti', 'pefkohori', 'sarti', 'nikiti', 'neos-marmaras', 'vourvourou', 'toroni', 'afytos'];
  const supabase = createApiClient();
  const { data: villageRows } = await supabase
    .from('villages')
    .select('slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr, latitude, longitude')
    .in('slug', popularSlugs);
  const distanceVillages = (villageRows || [])
    .filter((v) => v.latitude != null && v.longitude != null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((v: any) => ({
      slug: v.slug,
      name: v[`name_${locale}`] || v.name_el || v.name_en || v.slug,
      lat: Number(v.latitude),
      lon: Number(v.longitude),
    }));

  const breadcrumbLabel: Record<string, string> = {
    el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Почетна',
  };
  const travelLabel: Record<string, string> = {
    el: 'Πώς να φτάσετε', en: 'Getting Here', de: 'Anreise', bg: 'Как да стигнете', ru: 'Как добраться', ro: 'Cum ajungi', sr: 'Како стићи',
  };
  const moreCitiesLabel: Record<string, string> = {
    el: 'Από άλλες πόλεις', en: 'From Other Cities', de: 'Von anderen Städten', bg: 'От други градове', ru: 'Из других городов', ro: 'Din alte orașe', sr: 'Из других градова',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{breadcrumbLabel[locale] || breadcrumbLabel.en}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-600">{travelLabel[locale] || travelLabel.en}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h1>

      <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:my-3 prose-blockquote:border-primary-500 prose-blockquote:text-gray-600"
        dangerouslySetInnerHTML={{ __html: content }} />

      {cityCoords && distanceVillages.length > 0 && (
        <DistanceTable
          cityName={FROM_CITY_NAMES[city]?.[locale] || FROM_CITY_NAMES[city]?.en || city}
          cityCoords={cityCoords}
          villages={distanceVillages}
          locale={locale}
        />
      )}

      {/* More cities */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{moreCitiesLabel[locale] || moreCitiesLabel.en}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FROM_CITIES.filter(c => c.slug !== city).map(c => (
            <Link key={c.slug} href={`/from/${c.slug}`}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <span className="text-sm font-medium text-gray-800">{c.title[locale] || c.title.en}</span>
            </Link>
          ))}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        datePublished: '2025-06-01',
        dateModified: '2026-04-20',
        author: { '@type': 'Organization', name: 'ChalkidikiHub' },
        publisher: { '@type': 'Organization', name: 'ChalkidikiHub' },
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: breadcrumbLabel[locale] || breadcrumbLabel.en, item: localeUrl(locale) },
          { '@type': 'ListItem', position: 2, name: title, item: localeUrl(locale, `from/${city}`) },
        ],
      })}} />
    </div>
  );
}
