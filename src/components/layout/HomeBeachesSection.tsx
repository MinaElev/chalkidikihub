'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useLiveData } from '@/lib/use-live-data';
import { BeachCard } from '@/components/listings/BeachCard';
import { Beach } from '@/types';

export function HomeBeachesSection() {
  const tBeaches = useTranslations('beaches');
  const tCommon = useTranslations('common');
  const { data: beaches } = useLiveData<Beach>('/api/beaches?limit=6', []);
  const featured = beaches.slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{tBeaches('title')}</h2>
            <p className="mt-1 text-gray-600">{tBeaches('subtitle')}</p>
          </div>
          <Link
            href="/beaches"
            className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            {tCommon('viewAll')} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((beach) => (
            <BeachCard key={beach.id} beach={beach} />
          ))}
        </div>
      </div>
    </section>
  );
}
