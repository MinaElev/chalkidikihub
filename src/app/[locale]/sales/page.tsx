'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useLiveData } from '@/lib/use-live-data';
import { Sale, SaleFilters, PropertyType, Area } from '@/types';
import { SaleCard } from '@/components/sales/SaleCard';
import { AREA_SLUGS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { Search, X, MapPin, Building, ChevronLeft, ChevronRight, Home, Landmark, TreePine, Briefcase } from 'lucide-react';

const PROPERTY_TYPES: { value: PropertyType; icon: typeof Home }[] = [
  { value: 'house', icon: Home },
  { value: 'apartment', icon: Building },
  { value: 'land', icon: TreePine },
  { value: 'commercial', icon: Briefcase },
  { value: 'other', icon: Landmark },
];

export default function SalesPage() {
  const t = useTranslations('sales');
  const tProp = useTranslations('propertyTypes');
  const tAreas = useTranslations('areas');
  const [filters, setFilters] = useState<SaleFilters>({});
  const { data: sales } = useLiveData<Sale>('/api/sales', []);
  const [showAll, setShowAll] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  const filtered = useMemo(() => {
    let result = [...sales];
    if (filters.property_type) result = result.filter(s => s.property_type === filters.property_type);
    if (filters.area) result = result.filter(s => s.area === filters.area);
    if (filters.minPrice) result = result.filter(s => s.price >= filters.minPrice!);
    if (filters.maxPrice) result = result.filter(s => s.price <= filters.maxPrice!);
    if (filters.minSize) result = result.filter(s => s.size_sqm >= filters.minSize!);
    if (filters.bedrooms) result = result.filter(s => s.bedrooms >= filters.bedrooms!);
    switch (filters.sort) {
      case 'price_low': result.sort((a, b) => a.price - b.price); break;
      case 'price_high': result.sort((a, b) => b.price - a.price); break;
      case 'size': result.sort((a, b) => b.size_sqm - a.size_sqm); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [sales, filters]);

  const featured = sales.slice(0, 8);
  const displaySales = showAll ? filtered : filtered.slice(0, 12);

  function scrollCarousel(dir: number) {
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {t('heroTitle')}
            <br />
            <span className="text-emerald-300">{t('heroHighlight')}</span>
          </h1>
          <p className="mt-4 text-lg text-emerald-100 max-w-2xl">
            {t('heroSubtitle')}
          </p>

          {/* Property type cards */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
            {PROPERTY_TYPES.map(pt => {
              const count = sales.filter(s => s.property_type === pt.value).length;
              const Icon = pt.icon;
              return (
                <button key={pt.value}
                  onClick={() => { setFilters({ ...filters, property_type: filters.property_type === pt.value ? undefined : pt.value }); setShowAll(true); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    filters.property_type === pt.value
                      ? 'bg-white text-emerald-900'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}>
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{tProp(pt.value)}</p>
                    <p className="text-xs opacity-70">{count} {t('properties')}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Carousel */}
      {featured.length > 0 && !showAll && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('latestProperties')}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => scrollCarousel(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scrollCarousel(1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div ref={carouselRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {featured.map(sale => (
                <div key={sale.id} className="flex-shrink-0 w-72 snap-start">
                  <SaleCard sale={sale} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters + Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select value={filters.area || ''} onChange={(e) => setFilters({ ...filters, area: e.target.value as Area || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
            <option value="">{t('filters.allAreas')}</option>
            {AREA_SLUGS.map(a => <option key={a} value={a}>{areaLabels[a]}</option>)}
          </select>

          <select value={filters.sort || 'newest'} onChange={(e) => setFilters({ ...filters, sort: e.target.value as SaleFilters['sort'] })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
            <option value="newest">{t('filters.sortNewest')}</option>
            <option value="price_low">{t('filters.sortPriceLow')}</option>
            <option value="price_high">{t('filters.sortPriceHigh')}</option>
            <option value="size">{t('filters.sortSize')}</option>
          </select>

          <select value={filters.bedrooms || ''} onChange={(e) => setFilters({ ...filters, bedrooms: Number(e.target.value) || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
            <option value="">{t('bedrooms')}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>

          {(filters.property_type || filters.area || filters.bedrooms) && (
            <button onClick={() => { setFilters({}); setShowAll(false); }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              <X className="w-4 h-4" /> Clear
            </button>
          )}

          <span className="text-sm text-gray-500 ml-auto">{filtered.length} {t('properties')}</span>
        </div>

        {/* Results */}
        {displaySales.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displaySales.map(sale => <SaleCard key={sale.id} sale={sale} />)}
            </div>
            {!showAll && filtered.length > 12 && (
              <div className="text-center mt-8">
                <button onClick={() => setShowAll(true)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors">
                  {`${t('viewAll')} (${filtered.length})`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-500">{t('noProperties')}</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-12 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold">{t('sellCTA')}</h2>
          <p className="mt-2 text-emerald-100">{t('sellCTADesc')}</p>
          <Link href="/dashboard/sales/new"
            className="inline-flex mt-6 px-8 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors">
            {t('listProperty')}
          </Link>
        </div>
      </section>
    </div>
  );
}
