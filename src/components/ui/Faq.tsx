import { ChevronDown } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqLd, type Faq as FaqItem } from '@/lib/seo/jsonld';

/** Native <details> accordion + FAQPage schema. Answers are plain text. */
export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq" className="mt-14">
      <h2 id="faq" className="font-display text-2xl font-semibold text-slate-900">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="mt-0.5 size-5 shrink-0 text-slate-400 transition group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqLd(items)} />
    </section>
  );
}
