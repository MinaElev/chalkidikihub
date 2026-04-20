import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { getCostGuide, COST_GUIDES } from './costs-data';
import { notFound } from 'next/navigation';
import { localeUrl } from '@/lib/seo';

export const revalidate = 604800; // 1 week — static cost guides

type Props = { params: Promise<{ locale: string; topic: string }> };

export function generateStaticParams() {
  return COST_GUIDES.map(c => ({ topic: c.slug }));
}

export default async function CostGuidePage({ params }: Props) {
  const { locale, topic } = await params;
  setRequestLocale(locale);

  const guide = getCostGuide(topic);
  if (!guide) notFound();

  const title = guide.title[locale] || guide.title.en;
  const content = guide.content[locale] || guide.content.en;
  const description = guide.description[locale] || guide.description.en;

  const homeLabel: Record<string, string> = {
    el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna',
  };
  const costsLabel: Record<string, string> = {
    el: 'Κόστος & Τιμές', en: 'Costs & Prices', de: 'Kosten & Preise', bg: 'Разходи и цени', ru: 'Расходы и цены', ro: 'Costuri și prețuri', sr: 'Troškovi i cene',
  };
  const moreLabel: Record<string, string> = {
    el: 'Άλλοι οδηγοί τιμών', en: 'Other Price Guides', de: 'Weitere Preisführer', bg: 'Други ценови справочници', ru: 'Другие ценовые справочники', ro: 'Alte ghiduri de prețuri', sr: 'Drugi vodiči cena',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{homeLabel[locale] || homeLabel.en}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-600">{costsLabel[locale] || costsLabel.en}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h1>

      <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:my-3 prose-table:border-collapse prose-td:border prose-td:px-3 prose-td:py-2 prose-th:border prose-th:px-3 prose-th:py-2 prose-th:bg-gray-50"
        dangerouslySetInnerHTML={{ __html: content }} />

      {/* Other cost guides */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{moreLabel[locale] || moreLabel.en}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COST_GUIDES.filter(c => c.slug !== topic).map(c => (
            <Link key={c.slug} href={`/costs/${c.slug}`}
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
          { '@type': 'ListItem', position: 1, name: homeLabel[locale] || homeLabel.en, item: localeUrl(locale) },
          { '@type': 'ListItem', position: 2, name: costsLabel[locale] || costsLabel.en },
          { '@type': 'ListItem', position: 3, name: title, item: localeUrl(locale, `costs/${topic}`) },
        ],
      })}} />
    </div>
  );
}
