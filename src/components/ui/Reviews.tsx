import { Star } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { formatDate } from '@/lib/content/format';
import type { ReviewRow } from '@/lib/content/reviews';

/** Genuine visitor reviews only — callers pass the output of genuineReviews(). */
export function Reviews({
  locale, title, empty, reviews, rating,
}: {
  locale: Locale;
  title: string;
  empty: string;
  reviews: ReviewRow[];
  rating: { rating: number | null; count: number };
}) {
  return (
    <section aria-labelledby="reviews" className="mt-14">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 id="reviews" className="font-display text-2xl font-semibold text-slate-900">
          {title}
        </h2>
        {rating.rating != null && (
          <p className="inline-flex items-center gap-1 text-lg font-semibold text-slate-800">
            <Star className="size-5 fill-amber-400 text-amber-400" aria-hidden />
            {rating.rating.toFixed(1)}
            <span className="text-sm font-normal text-slate-500">({rating.count})</span>
          </p>
        )}
      </div>
      {reviews.length === 0 ? (
        <p className="mt-4 text-slate-600">{empty}</p>
      ) : (
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {reviews.slice(0, 8).map((r, i) => (
            <li key={r.id ?? i} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-900">{r.author_name || '—'}</p>
                <p className="flex" aria-label={`${r.rating}/5`}>
                  {Array.from({ length: 5 }, (_, k) => (
                    <Star key={k} className={`size-4 ${k < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} aria-hidden />
                  ))}
                </p>
              </div>
              {r.comment_el && <p className="mt-2 text-slate-700">{r.comment_el}</p>}
              <p className="mt-3 text-xs text-slate-500">{formatDate(r.created_at, locale)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
