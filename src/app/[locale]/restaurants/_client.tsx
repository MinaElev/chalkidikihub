'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';
import { useLiveData } from '@/lib/use-live-data';
import { Restaurant } from '@/types';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { RestaurantFilters, PriceLevel, Area } from '@/types';
import { AREA_SLUGS, ALL_PRICE_LEVELS } from '@/lib/constants';
import { X, Eye } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function RestaurantsPageClient({ initialData = [] }: { initialData?: Restaurant[] }) {
  const t = useTranslations('restaurants');
  const tPrice = useTranslations('priceLevels');
  const tAreas = useTranslations('areas');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [cuisineTypes, setCuisineTypes] = useState<Array<{slug: string; [key: string]: string}>>([]);

  useEffect(() => {
    fetch('/api/business-types').then(r => r.json()).then(d => { if (Array.isArray(d)) setCuisineTypes(d); }).catch(() => {});
  }, []);
  const { data: restaurants } = useLiveData<Restaurant>('/api/restaurants?fields=card', initialData);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  const filtered = useMemo(() => {
    let result = [...restaurants];
    if (filters.area) result = result.filter((r) => r.area === filters.area);
    if (filters.cuisine) result = result.filter((r) => r.cuisine.includes(filters.cuisine!));
    if (filters.priceLevel) result = result.filter((r) => r.price_level === filters.priceLevel);
    if (filters.seaView) result = result.filter((r) => r.has_sea_view);
    switch (filters.sort) {
      case 'name': result.sort((a, b) => a.name.en.localeCompare(b.name.en)); break;
      case 'reviews': result.sort((a, b) => b.reviews_count - a.reviews_count); break;
      case 'price': result.sort((a, b) => ALL_PRICE_LEVELS.indexOf(a.price_level) - ALL_PRICE_LEVELS.indexOf(b.price_level)); break;
      default: result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [filters, restaurants]);

  const hasActive = filters.area || filters.cuisine || filters.priceLevel || filters.seaView;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: t('title') }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Cuisine pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilters({ ...filters, cuisine: undefined })}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !filters.cuisine ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('filters.allCuisines')}
        </button>
        {cuisineTypes.map((c) => (
          <button
            key={c.slug}
            onClick={() => setFilters({ ...filters, cuisine: c.slug as RestaurantFilters['cuisine'] })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.cuisine === c.slug ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c[`name_${locale}`] || c.name_el || c.slug}
          </button>
        ))}
      </div>

      {/* Category page links for SEO */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cuisineTypes.map((c) => (
          <Link key={c.slug} href={`/restaurants/category/${c.slug}`}
            className="text-xs text-gray-400 hover:text-primary-600 hover:underline">
            {c[`name_${locale}`] || c.name_el || c.slug}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-8">
        <select value={filters.area || ''} onChange={(e) => setFilters({ ...filters, area: e.target.value as Area || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="">{t('filters.allAreas')}</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
        </select>
        <select value={filters.priceLevel || ''} onChange={(e) => setFilters({ ...filters, priceLevel: e.target.value as PriceLevel || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="">{t('filters.allPrices')}</option>
          {ALL_PRICE_LEVELS.map((p) => <option key={p} value={p}>{tPrice(p)}</option>)}
        </select>
        <select value={filters.sort || 'rating'} onChange={(e) => setFilters({ ...filters, sort: e.target.value as RestaurantFilters['sort'] })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="rating">{t('filters.sortRating')}</option>
          <option value="name">{t('filters.sortName')}</option>
          <option value="reviews">{t('filters.sortReviews')}</option>
          <option value="price">{t('filters.sortPrice')}</option>
        </select>
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
          <input type="checkbox" checked={filters.seaView || false}
            onChange={(e) => setFilters({ ...filters, seaView: e.target.checked || undefined })}
            className="rounded text-blue-600 focus:ring-blue-500" />
          <Eye className="w-4 h-4 text-blue-500" />{t('filters.seaViewOnly')}
        </label>
        {hasActive && (
          <button onClick={() => setFilters({})} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
            <X className="w-4 h-4" />{t('filters.clearFilters')}
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (<RestaurantCard key={r.id} restaurant={r} />))}
        </div>
      ) : (
        <div className="mt-16 text-center"><p className="text-lg text-gray-500">{tCommon('noResults')}</p></div>
      )}
    </div>
  );
}
