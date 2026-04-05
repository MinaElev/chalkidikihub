'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Listing } from '@/types';
import { ListingCard } from './ListingCard';

export function NearbyListings({ listingIds }: { listingIds: string[] }) {
  const t = useTranslations('beaches');
  const [nearby, setNearby] = useState<Listing[]>([]);

  useEffect(() => {
    if (listingIds.length === 0) return;
    fetch('/api/listings')
      .then((r) => r.json())
      .then((data: Listing[]) => {
        if (Array.isArray(data)) {
          setNearby(data.filter((l) => listingIds.includes(l.id)));
        }
      })
      .catch(() => {});
  }, [listingIds]);

  if (nearby.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('nearbyListings')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nearby.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
