import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { getGuide, GUIDES } from './guide-data';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }));
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getGuide(slug);
  if (!guide) notFound();

  const title = guide.title[locale] || guide.title.en;
  const content = guide.content[locale] || guide.content.el;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{locale === 'el' ? 'Αρχική' : 'Home'}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h1>

      <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:my-3 prose-blockquote:border-primary-500 prose-blockquote:text-gray-600"
        dangerouslySetInnerHTML={{ __html: content }} />

      {/* More guides */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{locale === 'el' ? 'Περισσότεροι Οδηγοί' : 'More Guides'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GUIDES.filter(g => g.slug !== slug).map(g => (
            <Link key={g.slug} href={`/guide/${g.slug}`}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <span className="text-sm font-medium text-gray-800">{g.title[locale] || g.title.en}</span>
            </Link>
          ))}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: guide.description[locale] || guide.description.en,
        author: { '@type': 'Organization', name: 'ChalkidikiHub' },
        publisher: { '@type': 'Organization', name: 'ChalkidikiHub' },
      })}} />
    </div>
  );
}
