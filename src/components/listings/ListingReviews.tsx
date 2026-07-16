'use client';

import { useLocale } from 'next-intl';
import { ListingReview } from '@/types';
import { Star, User } from 'lucide-react';

// Localised strings — el/en fully, other locales fall back to en (same
// convention as ReviewForm, which this section always renders next to).
type Dict = Record<string, string>;
const pick = (d: Dict, l: string) => d[l] || d.en;
const T = {
  heading: { el: 'Κριτικές επισκεπτών', en: 'Guest reviews' },
  reviews: { el: 'κριτικές', en: 'reviews' },
} satisfies Record<string, Dict>;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export function ListingReviews({ reviews, rating, count }: { reviews: ListingReview[]; rating: number; count: number }) {
  const locale = useLocale();
  if (reviews.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{pick(T.heading, locale)}</h2>

      {/* Summary */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <span className="text-2xl font-bold text-gray-900">{rating.toFixed(1)}</span>
        </div>
        <span className="text-gray-500">({count} {pick(T.reviews, locale)})</span>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium text-gray-900">{review.author_name}</span>
              </div>
              <StarRating rating={review.rating} />
            </div>
            {(review.comment[locale] || review.comment.el || review.comment.en) && (
              <p className="text-gray-600 text-sm">
                {review.comment[locale] || review.comment.el || review.comment.en}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.created_at).toLocaleDateString(locale)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
