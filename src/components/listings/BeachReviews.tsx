'use client';

import { useLocale, useTranslations } from 'next-intl';
import { BeachReview } from '@/types';
import { Star, User } from 'lucide-react';

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

export function BeachReviews({ reviews, rating, count }: { reviews: BeachReview[]; rating: number; count: number }) {
  const locale = useLocale();
  const t = useTranslations('beaches');

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <span className="text-2xl font-bold text-gray-900">{rating.toFixed(1)}</span>
        </div>
        <span className="text-gray-500">({count} {t('reviews')})</span>
      </div>

      {/* Reviews list */}
      {reviews.length > 0 ? (
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
              <p className="text-gray-600 text-sm">
                {review.comment[locale] || review.comment.en}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.created_at).toLocaleDateString(locale)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{t('noReviews')}</p>
      )}
    </div>
  );
}
