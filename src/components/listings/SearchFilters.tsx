'use client';

import { useTranslations } from 'next-intl';
import { SearchFilters as SearchFiltersType, Area, Amenity } from '@/types';
import { AREA_SLUGS, ALL_AMENITIES } from '@/lib/constants';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const t = useTranslations('listings.filters');
  const tAreas = useTranslations('areas');
  const tAmenities = useTranslations('amenities');
  const [showFilters, setShowFilters] = useState(false);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'),
    sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'),
    mainland: tAreas('mainlandHalkidiki.name'),
  };

  function updateFilter<K extends keyof SearchFiltersType>(key: K, value: SearchFiltersType[K]) {
    onFiltersChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    onFiltersChange({});
  }

  const hasActiveFilters = filters.area || filters.minPrice || filters.maxPrice || filters.guests || (filters.amenities && filters.amenities.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Area select */}
        <select
          value={filters.area || ''}
          onChange={(e) => updateFilter('area', e.target.value as Area || undefined)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">{t('allAreas')}</option>
          {AREA_SLUGS.map((area) => (
            <option key={area} value={area}>
              {areaLabels[area]}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => updateFilter('sort', e.target.value as SearchFiltersType['sort'])}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="newest">{t('sortNewest')}</option>
          <option value="price_low">{t('sortPriceLow')}</option>
          <option value="price_high">{t('sortPriceHigh')}</option>
        </select>

        {/* Toggle more filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
            showFilters ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t('amenities')}</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            {t('clearFilters')}
          </button>
        )}
      </div>

      {/* Price & Guests row */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="number"
          placeholder={t('minPrice')}
          value={filters.minPrice || ''}
          onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          placeholder={t('maxPrice')}
          value={filters.maxPrice || ''}
          onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <input
          type="number"
          placeholder={t('guestsMin')}
          value={filters.guests || ''}
          onChange={(e) => updateFilter('guests', e.target.value ? Number(e.target.value) : undefined)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          min={1}
        />
      </div>

      {/* Amenities checkboxes */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {ALL_AMENITIES.map((amenity) => {
            const isActive = filters.amenities?.includes(amenity);
            return (
              <button
                key={amenity}
                onClick={() => {
                  const current = filters.amenities || [];
                  const next = isActive
                    ? current.filter((a: Amenity) => a !== amenity)
                    : [...current, amenity];
                  updateFilter('amenities', next.length > 0 ? next : undefined);
                }}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  isActive
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tAmenities(amenity)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
