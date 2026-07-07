'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Listing, Area } from '@/types';
import { ListingCard } from './ListingCard';
import { Link } from '@/i18n/navigation';

export function AreaListings({ area }: { area: Area }) {
  const tListings = useTranslations('listings');
  const tCommon = useTranslations('common');
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetch(`/api/listings?area=${area}&limit=9&fields=card`)
      .then((r) => r.json())
      .then((data: Listing[]) => {
        if (Array.isArray(data)) setListings(data);
      })
      .catch(() => {});
  }, [area]);

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500">{tCommon('noResults')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{tListings('title')}</h2>
        <Link href="/listings" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          {tCommon('viewAll')} &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
