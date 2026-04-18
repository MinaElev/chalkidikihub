'use client';

import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { getFaqPage, FAQ_PAGES } from './faq-data';

export const dynamic = 'force-dynamic';

function FaqAccordionItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div
            className="px-5 pb-4 pt-0 text-gray-700 leading-relaxed prose prose-sm max-w-none prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      </div>
    </div>
  );
}

export default function FaqDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const slug = params?.slug as string;
  const faqPage = getFaqPage(slug);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqPage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">FAQ not found</h1>
      </div>
    );
  }

  const title = faqPage.title[locale] || faqPage.title.en;
  const homeLabel = locale === 'el' ? 'Αρχική' : locale === 'de' ? 'Startseite' : locale === 'bg' ? 'Начало' : locale === 'ru' ? 'Главная' : locale === 'ro' ? 'Acasa' : locale === 'sr' ? 'Pocetna' : 'Home';
  const faqLabel = locale === 'el' ? 'Συχνές Ερωτήσεις' : locale === 'de' ? 'FAQ' : locale === 'bg' ? 'Въпроси' : locale === 'ru' ? 'Вопросы' : locale === 'ro' ? 'Intrebari' : locale === 'sr' ? 'Pitanja' : 'FAQ';
  const relatedLabel = locale === 'el' ? 'Άλλες Κατηγορίες FAQ' : locale === 'de' ? 'Andere FAQ-Kategorien' : locale === 'bg' ? 'Други FAQ категории' : locale === 'ru' ? 'Другие категории FAQ' : locale === 'ro' ? 'Alte categorii FAQ' : locale === 'sr' ? 'Druge FAQ kategorije' : 'Other FAQ Categories';

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqPage.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question[locale] || faq.question.en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[locale] || faq.answer.en,
      },
    })),
  };

  const SITE_URL = 'https://chalkidikihub.gr';
  const DEFAULT_LOCALE = 'el';
  const localePrefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabel, item: `${SITE_URL}${localePrefix || '/'}` },
      { '@type': 'ListItem', position: 2, name: faqLabel, item: `${SITE_URL}${localePrefix}/faq` },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{homeLabel}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/faq" className="hover:text-gray-700">{faqLabel}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500 mb-8">
        {faqPage.faqs.length} {locale === 'el' ? 'ερωτήσεις' : locale === 'de' ? 'Fragen' : locale === 'bg' ? 'въпроса' : locale === 'ru' ? 'вопросов' : locale === 'ro' ? 'intrebari' : locale === 'sr' ? 'pitanja' : 'questions'}
      </p>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {faqPage.faqs.map((faq, index) => (
          <FaqAccordionItem
            key={index}
            question={faq.question[locale] || faq.question.en}
            answer={faq.answer[locale] || faq.answer.en}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* Related FAQ pages */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{relatedLabel}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FAQ_PAGES.filter(f => f.slug !== slug).map(f => (
            <Link
              key={f.slug}
              href={`/faq/${f.slug}`}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-800">
                {f.title[locale] || f.title.en}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
