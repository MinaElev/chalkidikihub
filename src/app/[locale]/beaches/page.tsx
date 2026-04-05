'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useLiveData } from '@/lib/use-live-data';
import { Beach } from '@/types';
import { BeachCard } from '@/components/listings/BeachCard';
import { BeachFilters as BeachFiltersType, Area, BeachFeature } from '@/types';
import { AREA_SLUGS, ALL_BEACH_FEATURES } from '@/lib/constants';
import { SlidersHorizontal, X } from 'lucide-react';

export default function BeachesPage() {
  const t = useTranslations('beaches');
  const tCommon = useTranslations('common');
  const tAreas = useTranslations('areas');
  const tFeatures = useTranslations('beachFeatures');
  const [filters, setFilters] = useState<BeachFiltersType>({});
  const [showFeatures, setShowFeatures] = useState(false);
  const { data: beaches } = useLiveData<Beach>('/api/beaches', []);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'),
    sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'),
    mainland: tAreas('mainlandHalkidiki.name'),
  };

  const filteredBeaches = useMemo(() => {
    let result = [...beaches];

    if (filters.area) {
      result = result.filter((b) => b.area === filters.area);
    }
    if (filters.features && filters.features.length > 0) {
      result = result.filter((b) =>
        filters.features!.every((f) => b.features.includes(f))
      );
    }

    switch (filters.sort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.en.localeCompare(b.name.en));
        break;
      case 'reviews':
        result.sort((a, b) => b.reviews_count - a.reviews_count);
        break;
      default:
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [filters, beaches]);

  const hasActiveFilters = filters.area || (filters.features && filters.features.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={filters.area || ''}
            onChange={(e) => setFilters({ ...filters, area: e.target.value as Area || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{t('filters.allAreas')}</option>
            {AREA_SLUGS.map((area) => (
              <option key={area} value={area}>{areaLabels[area]}</option>
            ))}
          </select>

          <select
            value={filters.sort || 'rating'}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as BeachFiltersType['sort'] })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="rating">{t('filters.sortRating')}</option>
            <option value="name">{t('filters.sortName')}</option>
            <option value="reviews">{t('filters.sortReviews')}</option>
          </select>

          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
              showFeatures ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('filters.allFeatures')}</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={() => setFilters({})}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              {t('filters.clearFilters')}
            </button>
          )}
        </div>

        {showFeatures && (
          <div className="flex flex-wrap gap-2">
            {ALL_BEACH_FEATURES.map((feature) => {
              const isActive = filters.features?.includes(feature);
              return (
                <button
                  key={feature}
                  onClick={() => {
                    const current = filters.features || [];
                    const next = isActive
                      ? current.filter((f: BeachFeature) => f !== feature)
                      : [...current, feature];
                    setFilters({ ...filters, features: next.length > 0 ? next : undefined });
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tFeatures(feature)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results */}
      {filteredBeaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeaches.map((beach) => (
            <BeachCard key={beach.id} beach={beach} />
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
