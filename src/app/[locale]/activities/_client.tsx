'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useLiveData } from '@/lib/use-live-data';
import { Activity } from '@/types';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { ActivityFilters, ActivityCategory, Area } from '@/types';
import { AREA_SLUGS, ALL_ACTIVITY_CATEGORIES } from '@/lib/constants';
import { X } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ActivitiesPageClient({ initialData = [] }: { initialData?: Activity[] }) {
  const t = useTranslations('activities');
  const tCat = useTranslations('activityCategories');
  const tAreas = useTranslations('areas');
  const tCommon = useTranslations('common');
  const [filters, setFilters] = useState<ActivityFilters>({});
  const { data: activities } = useLiveData<Activity>('/api/activities', initialData);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  const filtered = useMemo(() => {
    let result = [...activities];
    if (filters.area) result = result.filter((a) => a.area === filters.area);
    if (filters.category) result = result.filter((a) => a.category === filters.category);
    switch (filters.sort) {
      case 'name': result.sort((a, b) => a.name.en.localeCompare(b.name.en)); break;
      case 'reviews': result.sort((a, b) => b.reviews_count - a.reviews_count); break;
      default: result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [filters, activities]);

  const hasActive = filters.area || filters.category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: t('title') }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilters({ ...filters, category: undefined })}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !filters.category ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('filters.allCategories')}
        </button>
        {ALL_ACTIVITY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters({ ...filters, category: cat })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.category === cat ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tCat(cat)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-8">
        <select
          value={filters.area || ''}
          onChange={(e) => setFilters({ ...filters, area: e.target.value as Area || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.allAreas')}</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
        </select>

        <select
          value={filters.sort || 'rating'}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value as ActivityFilters['sort'] })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="rating">{t('filters.sortRating')}</option>
          <option value="name">{t('filters.sortName')}</option>
          <option value="reviews">{t('filters.sortReviews')}</option>
        </select>

        {hasActive && (
          <button onClick={() => setFilters({})} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
            <X className="w-4 h-4" />{t('filters.clearFilters')}
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
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
