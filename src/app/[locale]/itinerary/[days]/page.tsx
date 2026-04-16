import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { getItinerary, ITINERARIES } from './itinerary-data';
import { notFound } from 'next/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; days: string }> };

export function generateStaticParams() {
  return ITINERARIES.map(i => ({ days: i.slug }));
}

export default async function ItineraryPage({ params }: Props) {
  const { locale, days } = await params;
  setRequestLocale(locale);

  const guide = getItinerary(days);
  if (!guide) notFound();

  const title = guide.title[locale] || guide.title.en;
  const content = guide.content[locale] || guide.content.en;
  const description = guide.description[locale] || guide.description.en;

  const homeLabel: Record<string, string> = {
    el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna',
  };
  const itineraryLabel: Record<string, string> = {
    el: 'Προγράμματα', en: 'Itineraries', de: 'Reiserouten', bg: 'Маршрути', ru: 'Маршруты', ro: 'Itinerarii', sr: 'Itinereri',
  };
  const moreLabel: Record<string, string> = {
    el: 'Άλλα προγράμματα', en: 'Other Itineraries', de: 'Weitere Reiserouten', bg: 'Други маршрути', ru: 'Другие маршруты', ro: 'Alte itinerarii', sr: 'Drugi itinereri',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{homeLabel[locale] || homeLabel.en}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-600">{itineraryLabel[locale] || itineraryLabel.en}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h1>

      <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:my-3 prose-table:border-collapse prose-td:border prose-td:px-3 prose-td:py-2 prose-th:border prose-th:px-3 prose-th:py-2 prose-th:bg-gray-50"
        dangerouslySetInnerHTML={{ __html: content }} />

      {/* Other itineraries */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{moreLabel[locale] || moreLabel.en}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ITINERARIES.filter(i => i.slug !== days).map(i => (
            <Link key={i.slug} href={`/itinerary/${i.slug}`}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <span className="text-sm font-medium text-gray-800">{i.title[locale] || i.title.en}</span>
            </Link>
          ))}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        author: { '@type': 'Organization', name: 'ChalkidikiHub' },
        publisher: { '@type': 'Organization', name: 'ChalkidikiHub' },
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: homeLabel[locale] || homeLabel.en, item: `${SITE_URL}/${locale}` },
          { '@type': 'ListItem', position: 2, name: itineraryLabel[locale] || itineraryLabel.en },
          { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}/${locale}/itinerary/${days}` },
        ],
      })}} />
    </div>
  );
}
