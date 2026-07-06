import { getComparison } from '@/lib/comparisons';

/**
 * Clean, scannable comparison table for the "X vs Y" guide pages. Server
 * component (no interactivity) — renders a real HTML <table> that Google can
 * lift into a featured snippet and LLM crawlers quote directly, plus a one-line
 * verdict as the quotable "answer". Returns null when the slug has no data.
 */
export function ComparisonTable({ slug, locale }: { slug: string; locale: string }) {
  const c = getComparison(slug);
  if (!c) return null;
  const pick = (d: Record<string, string>) => d[locale] || d.en;

  return (
    <section className="my-6 not-prose">
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-sm">
          <caption className="sr-only">{pick(c.title)}</caption>
          <thead>
            <tr className="bg-gray-50 text-left">
              <th scope="col" className="px-4 py-3 font-semibold text-gray-500"></th>
              <th scope="col" className="px-4 py-3 font-bold text-primary-700">{pick(c.colA)}</th>
              <th scope="col" className="px-4 py-3 font-bold text-primary-700">{pick(c.colB)}</th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={pick(r.label)} className="border-t border-gray-100 align-top">
                <th scope="row" className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">{pick(r.label)}</th>
                <td className="px-4 py-3 text-gray-700">{pick(r.a)}</td>
                <td className="px-4 py-3 text-gray-700">{pick(r.b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-gray-600 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
        <strong className="text-primary-800">{locale === 'el' ? 'Με λίγα λόγια: ' : 'In short: '}</strong>
        {pick(c.verdict)}
      </p>
    </section>
  );
}
