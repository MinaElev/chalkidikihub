'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { FaqItem } from '@/lib/faq-generators';

interface FaqSectionProps {
  faqs: FaqItem[];
  title?: string;
}

const sectionTitles: Record<string, string> = {
  el: 'Συχνές Ερωτήσεις',
  en: 'Frequently Asked Questions',
  de: 'Häufig gestellte Fragen',
  bg: 'Често задавани въпроси',
  ru: 'Часто задаваемые вопросы',
  ro: 'Întrebări frecvente',
  sr: 'Često postavljana pitanja',
};

export function FaqSection({ faqs, title }: FaqSectionProps) {
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  const heading = title || sectionTitles[locale] || sectionTitles.en;

  // FAQPage JSON-LD schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mt-10 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{heading}</h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === idx}
              >
                <span className="font-medium text-gray-900 text-sm pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
