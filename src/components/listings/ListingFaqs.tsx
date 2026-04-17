'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqRow {
  id: string;
  sort_order: number;
  [key: string]: unknown;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
}

const HEADING: Record<string, string> = {
  el: 'Συχνές ερωτήσεις', en: 'Frequently asked questions', de: 'Häufige Fragen',
  bg: 'Често задавани въпроси', ru: 'Часто задаваемые вопросы',
  ro: 'Întrebări frecvente', sr: 'Često postavljana pitanja',
};

export function ListingFaqs({ listingId }: { listingId: string }) {
  const locale = useLocale();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('listing_faqs')
        .select('*')
        .eq('listing_id', listingId)
        .order('sort_order', { ascending: true });
      if (data) {
        const mapped: Faq[] = (data as FaqRow[])
          .map((row) => ({
            id: row.id,
            question: (row[`question_${locale}`] as string) || (row.question_el as string) || (row.question_en as string) || '',
            answer: (row[`answer_${locale}`] as string) || (row.answer_el as string) || (row.answer_en as string) || '',
          }))
          .filter(f => f.question && f.answer);
        setFaqs(mapped);
      }
    })();
  }, [listingId, locale]);

  if (faqs.length === 0) return null;

  const heading = HEADING[locale] || HEADING.en;

  return (
    <section className="mt-8" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700">
          <HelpCircle className="w-4 h-4" />
        </span>
        {heading}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span itemProp="name" className="font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className="px-4 pb-4 text-sm text-gray-700 leading-relaxed"
                >
                  <div itemProp="text" className="whitespace-pre-line">{faq.answer}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
