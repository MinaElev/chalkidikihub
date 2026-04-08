'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useLiveData } from '@/lib/use-live-data';
import { ListingCard } from '@/components/listings/ListingCard';
import { Listing } from '@/types';

export function HomeFeaturedListings() {
  const t = useTranslations('common');
  const tListings = useTranslations('listings');
  const { data: listings } = useLiveData<Listing>('/api/listings?limit=6', []);
  const featured = listings.slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{tListings('title')}</h2>
            <p className="mt-1 text-gray-600">{tListings('subtitle')}</p>
          </div>
          <Link
            href="/listings"
            className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            {t('viewAll')} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
