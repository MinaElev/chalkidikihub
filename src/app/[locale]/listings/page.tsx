'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect } from 'react';
import { seedListings } from '@/lib/seed-data';
import { ListingCard } from '@/components/listings/ListingCard';
import { SearchFilters } from '@/components/listings/SearchFilters';
import { SearchFilters as SearchFiltersType, Listing } from '@/types';

export default function ListingsPage() {
  const t = useTranslations('listings');
  const tCommon = useTranslations('common');
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [dbListings, setDbListings] = useState<Listing[]>([]);

  // Fetch real listings from Supabase
  useEffect(() => {
    fetch('/api/listings')
      .then((r) => r.json())
      .then((data: Listing[]) => {
        if (Array.isArray(data)) setDbListings(data);
      })
      .catch(() => {});
  }, []);

  // Only DB listings - no seed data
  const allListings = dbListings;

  const filteredListings = useMemo(() => {
    let result = [...allListings];

    if (filters.area) {
      result = result.filter((l) => l.area === filters.area);
    }
    if (filters.minPrice) {
      result = result.filter((l) => l.price_per_night >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter((l) => l.price_per_night <= filters.maxPrice!);
    }
    if (filters.guests) {
      result = result.filter((l) => l.guests_max >= filters.guests!);
    }
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter((l) =>
        filters.amenities!.every((a) => l.amenities.includes(a))
      );
    }

    switch (filters.sort) {
      case 'price_low':
        result.sort((a, b) => a.price_per_night - b.price_per_night);
        break;
      case 'price_high':
        result.sort((a, b) => b.price_per_night - a.price_per_night);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [filters, allListings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-gray-600">{t('subtitle')}</p>
      </div>

      <SearchFilters filters={filters} onFiltersChange={setFilters} />

      {filteredListings.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-500">{tCommon('noResults')}</p>
        </div>
      )}
    </div>
  );
}
