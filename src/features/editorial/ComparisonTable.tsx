import type { Locale } from '@/i18n/config';
import { COMPARISONS, IN_SHORT } from '@/content/editorial/comparisons';

/**
 * v3's comparison table for the "X vs Y" guides: a real HTML <table> plus a
 * one-line verdict, placed above the body so it is the first answer on the
 * page. Renders nothing for guides without comparison data.
 */
export function ComparisonTable({ slug, locale }: { slug: string; locale: Locale }) {
  const c = COMPARISONS[slug];
  if (!c) return null;
  return (
    <section className="mb-10">
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-sm">
          <caption className="sr-only">{c.title[locale]}</caption>
          <thead>
            <tr className="bg-sand-50 text-left">
              <td className="px-4 py-3" />
              <th scope="col" className="px-4 py-3 font-bold text-sea-700">{c.colA[locale]}</th>
              <th scope="col" className="px-4 py-3 font-bold text-sea-700">{c.colB[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.label.en} className="border-t border-gray-100 align-top">
                <th scope="row" className="px-4 py-3 text-left font-semibold text-gray-700 sm:whitespace-nowrap">{r.label[locale]}</th>
                <td className="px-4 py-3 text-gray-700">{r.a[locale]}</td>
                <td className="px-4 py-3 text-gray-700">{r.b[locale]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 rounded-xl border border-sea-100 bg-sea-50 px-4 py-3 text-sm text-gray-700">
        <strong className="text-sea-800">{IN_SHORT[locale]}</strong> {c.verdict[locale]}
      </p>
    </section>
  );
}
