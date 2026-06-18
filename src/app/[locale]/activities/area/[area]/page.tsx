import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ChevronRight, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { createApiClient } from '@/lib/api-helpers';
import { transformActivity } from '@/lib/data';
import { AREAS, AREA_SLUGS } from '@/lib/constants';
import { localeUrl } from '@/lib/seo';
import { FaqSection } from '@/components/ui/FaqSection';
import type { FaqItem } from '@/lib/faq-generators';
import { ENRICHMENTS } from './enrichments';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only

type Props = { params: Promise<{ locale: string; area: string }> };

export function generateStaticParams() {
  return AREA_SLUGS.map((area) => ({ area }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, area } = await params;
  const areaInfo = AREAS.find((a) => a.slug === area);
  if (!areaInfo) return { title: 'Not Found' };

  const areaName = areaInfo.name[locale] || areaInfo.name.en || area;
  const title = locale === 'el' ? `Δραστηριότητες στην ${areaName} | Χαλκιδική 2026` : `Things to Do in ${areaName} | Halkidiki 2026`;
  const desc = locale === 'el'
    ? `Οι κορυφαίες δραστηριότητες και αξιοθέατα στην ${areaName} Χαλκιδικής. Boat trips, water sports, ιστορικά μνημεία και πολλά άλλα.`
    : `Top activities and attractions in ${areaName}, Halkidiki. Boat trips, water sports, historical sites and more.`;

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub' },
    twitter: { card: 'summary_large_image', title, description: desc },
    alternates: {
      canonical: localeUrl(locale, `activities/area/${area}`),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, `activities/area/${area}`)])),
        'x-default': localeUrl('el', `activities/area/${area}`),
      },
    },
  };
}

export default async function ActivitiesByAreaPage({ params }: Props) {
  const { locale, area } = await params;
  setRequestLocale(locale);

  const areaInfo = AREAS.find((a) => a.slug === area);
  if (!areaInfo) notFound();

  const areaName = areaInfo.name[locale] || areaInfo.name.en || area;

  const supabase = createApiClient();
  const { data } = await supabase
    .from('activities')
    .select('*, activity_reviews(*)')
    .eq('area', area)
    .order('rating', { ascending: false })
    .limit(40);
  const items = (data || []).map((r) => transformActivity(r as Record<string, unknown>) as Record<string, unknown>);

  const enrichment = ENRICHMENTS[area];
  const introHtml = enrichment?.intro?.[locale] || enrichment?.intro?.en;
  const seasonalHtml = enrichment?.seasonal?.[locale] || enrichment?.seasonal?.en;
  const tipsHtml = enrichment?.tips?.[locale] || enrichment?.tips?.en;
  const customFaqs: FaqItem[] = enrichment?.faqs
    ? enrichment.faqs.map((f) => ({
        question: f.q[locale] || f.q.en || '',
        answer: f.a[locale] || f.a.en || '',
      }))
    : [];

  const tHome = locale === 'el' ? 'Αρχική' : 'Home';
  const tAll = locale === 'el' ? 'Δραστηριότητες' : 'Activities';
  const tResults = locale === 'el' ? 'δραστηριότητες' : 'activities';
  const tHeading = locale === 'el' ? `Δραστηριότητες στην ${areaName}` : `Things to Do in ${areaName}`;
  const tNoResults = locale === 'el' ? 'Δεν βρέθηκαν δραστηριότητες' : 'No activities found';
  const tExplore = locale === 'el' ? 'Εξερεύνησε άλλες περιοχές' : 'Explore other areas';

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: tHeading,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 10).map((item, i) => {
      const name = item.name as Record<string, string> | undefined;
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Thing', name: name?.[locale] || name?.el || name?.en || '' },
      };
    }),
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tHome, item: localeUrl(locale, '') },
      { '@type': 'ListItem', position: 2, name: tAll, item: localeUrl(locale, 'activities') },
      { '@type': 'ListItem', position: 3, name: areaName, item: localeUrl(locale, `activities/area/${area}`) },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{tHome}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/activities" className="hover:text-gray-700">{tAll}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{areaName}</span>
      </nav>

      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="w-6 h-6 text-yellow-300" />
          <span className="text-sm font-medium text-white/80 uppercase tracking-wider">{tAll}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{tHeading}</h1>
        <p className="text-white/60 text-sm mt-3">{items.length} {tResults}</p>
      </div>

      {introHtml && (
        <div
          className="prose prose-gray max-w-none mb-8 text-gray-700 leading-relaxed [&_a]:text-primary-700 [&_a]:underline [&_a:hover]:text-primary-800 [&_strong]:text-gray-900"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any) => <ActivityCard key={item.id} activity={item} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">{tNoResults}</div>
      )}

      {seasonalHtml && (
        <div
          className="prose prose-gray max-w-none mt-10 p-5 bg-amber-50/60 border border-amber-200 rounded-xl text-gray-800 leading-relaxed [&_a]:text-amber-900 [&_a]:underline [&_a:hover]:text-amber-700 [&_strong]:text-gray-900 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-amber-900 [&_h2]:mt-0 [&_h2]:mb-2"
          dangerouslySetInnerHTML={{ __html: seasonalHtml }}
        />
      )}

      {tipsHtml && (
        <div
          className="prose prose-gray max-w-none mt-6 p-5 bg-sky-50/60 border border-sky-200 rounded-xl text-gray-800 leading-relaxed [&_a]:text-sky-900 [&_a]:underline [&_a:hover]:text-sky-700 [&_strong]:text-gray-900 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-sky-900 [&_h2]:mt-0 [&_h2]:mb-3 [&_ul]:my-2 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:my-1"
          dangerouslySetInnerHTML={{ __html: tipsHtml }}
        />
      )}

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{tExplore}</h2>
        <div className="flex flex-wrap gap-2">
          {AREAS.filter((a) => a.slug !== area).map((a) => (
            <Link
              key={a.slug}
              href={`/activities/area/${a.slug}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              {a.name[locale] || a.name.en}
            </Link>
          ))}
        </div>
      </div>

      {customFaqs.length > 0 && <FaqSection faqs={customFaqs} />}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
    </div>
  );
}
