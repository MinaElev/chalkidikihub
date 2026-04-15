'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useLiveData } from '@/lib/use-live-data';
import { ListingCard } from '@/components/listings/ListingCard';
import { Listing } from '@/types';
import { Home, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';

export function HomeFeaturedListings() {
  const t = useTranslations('common');
  const tListings = useTranslations('listings');
  const locale = useLocale();
  const { data: listings } = useLiveData<Listing>('/api/listings?limit=6', []);
  const featured = listings.slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-badge bg-primary-50 text-primary-700 mb-3">
              <Home className="w-3.5 h-3.5" />
              {locale === 'el' ? 'Επιλεγμένα' : 'Featured'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{tListings('title')}</h2>
            <p className="mt-2 text-gray-500">{tListings('subtitle')}</p>
          </div>
          <Link
            href="/listings"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
          >
            {t('viewAll')} <ArrowRight className="w-4 h-4" />
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
