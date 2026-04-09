'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useMemo } from 'react';
import { useLiveData } from '@/lib/use-live-data';
import { Sale, SaleFilters, PropertyType, Area } from '@/types';
import { SaleCard } from '@/components/sales/SaleCard';
import { AREA_SLUGS } from '@/lib/constants';
import { X } from 'lucide-react';

const PROPERTY_TYPES: PropertyType[] = ['house', 'apartment', 'land', 'commercial', 'other'];

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: 'Κατοικία',
  apartment: 'Διαμέρισμα',
  land: 'Γη',
  commercial: 'Επαγγελματικό',
  other: 'Λοιπά',
};

export default function SalesPage() {
  const tAreas = useTranslations('areas');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [filters, setFilters] = useState<SaleFilters>({});

  const { data: sales } = useLiveData<Sale>('/api/sales', []);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  const filtered = useMemo(() => {
    let result = [...sales];
    if (filters.property_type) result = result.filter((s) => s.property_type === filters.property_type);
    if (filters.area) result = result.filter((s) => s.area === filters.area);
    if (filters.minPrice) result = result.filter((s) => s.price >= filters.minPrice!);
    if (filters.maxPrice) result = result.filter((s) => s.price <= filters.maxPrice!);
    if (filters.minSize) result = result.filter((s) => s.size_sqm >= filters.minSize!);
    if (filters.bedrooms) result = result.filter((s) => s.bedrooms >= filters.bedrooms!);
    switch (filters.sort) {
      case 'price_low': result.sort((a, b) => a.price - b.price); break;
      case 'price_high': result.sort((a, b) => b.price - a.price); break;
      case 'size': result.sort((a, b) => b.size_sqm - a.size_sqm); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [filters, sales]);

  const hasActive = filters.area || filters.property_type || filters.minPrice || filters.maxPrice || filters.minSize || filters.bedrooms;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Πωλήσεις Ακινήτων</h1>
        <p className="mt-1 text-gray-600">Ακίνητα προς πώληση στη Χαλκιδική</p>
      </div>

      {/* Property type pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilters({ ...filters, property_type: undefined })}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !filters.property_type ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Όλα
        </button>
        {PROPERTY_TYPES.map((pt) => (
          <button
            key={pt}
            onClick={() => setFilters({ ...filters, property_type: pt })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.property_type === pt ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {PROPERTY_TYPE_LABELS[pt]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-8">
        <select value={filters.area || ''} onChange={(e) => setFilters({ ...filters, area: e.target.value as Area || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="">Όλες οι περιοχές</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
        </select>
        <select value={filters.minPrice || ''} onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="">Τιμή από</option>
          <option value="30000">30.000€</option>
          <option value="50000">50.000€</option>
          <option value="100000">100.000€</option>
          <option value="200000">200.000€</option>
          <option value="500000">500.000€</option>
        </select>
        <select value={filters.maxPrice || ''} onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="">Τιμή έως</option>
          <option value="50000">50.000€</option>
          <option value="100000">100.000€</option>
          <option value="200000">200.000€</option>
          <option value="500000">500.000€</option>
          <option value="1000000">1.000.000€</option>
        </select>
        <select value={filters.minSize || ''} onChange={(e) => setFilters({ ...filters, minSize: Number(e.target.value) || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="">Εμβαδόν από</option>
          <option value="30">30 τ.μ.</option>
          <option value="50">50 τ.μ.</option>
          <option value="80">80 τ.μ.</option>
          <option value="120">120 τ.μ.</option>
          <option value="200">200 τ.μ.</option>
        </select>
        <select value={filters.bedrooms || ''} onChange={(e) => setFilters({ ...filters, bedrooms: Number(e.target.value) || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="">Υπνοδωμάτια</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
        <select value={filters.sort || 'newest'} onChange={(e) => setFilters({ ...filters, sort: e.target.value as SaleFilters['sort'] })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
          <option value="newest">Νεότερα</option>
          <option value="price_low">Τιμή (χαμηλή)</option>
          <option value="price_high">Τιμή (υψηλή)</option>
          <option value="size">Μέγεθος</option>
        </select>
        {hasActive && (
          <button onClick={() => setFilters({})} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
            <X className="w-4 h-4" />Καθαρισμός
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sale) => (<SaleCard key={sale.id} sale={sale} />))}
        </div>
      ) : (
        <div className="mt-16 text-center"><p className="text-lg text-gray-500">{tCommon('noResults')}</p></div>
      )}
    </div>
  );
}
