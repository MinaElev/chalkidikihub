'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Sale } from '@/types';
import { MapPin, BedDouble, Maximize, Euro } from 'lucide-react';

const TYPE_LABELS: Record<string, Record<string, string>> = {
  house: { el: 'Κατοικία', en: 'House' },
  apartment: { el: 'Διαμέρισμα', en: 'Apartment' },
  land: { el: 'Γη', en: 'Land' },
  commercial: { el: 'Επαγγελματικό', en: 'Commercial' },
  other: { el: 'Λοιπά', en: 'Other' },
};

const TYPE_COLORS: Record<string, string> = {
  house: 'bg-emerald-600', apartment: 'bg-blue-600', land: 'bg-amber-600',
  commercial: 'bg-purple-600', other: 'bg-gray-600',
};

export function SaleCard({ sale }: { sale: Sale }) {
  const locale = useLocale();
  const title = sale.title[locale] || sale.title.en || sale.title.el;
  const coverImage = sale.images?.find(i => i.is_cover)?.image_url || sale.images?.[0]?.image_url;

  const typeLabel = TYPE_LABELS[sale.property_type]?.[locale] || TYPE_LABELS[sale.property_type]?.el || sale.property_type;

  return (
    <Link href={`/sales/${sale.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-0.5">
        <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
          {coverImage ? (
            <img src={coverImage} alt={title} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
              <span className="text-teal-300 text-5xl">🏠</span>
            </div>
          )}
          <div className={`absolute top-3 left-3 ${TYPE_COLORS[sale.property_type] || 'bg-gray-600'} text-white px-3 py-1 rounded-full text-xs font-medium`}>
            {typeLabel}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-gray-900">€{sale.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{sale.location_name}</span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            {sale.size_sqm > 0 && (
              <div className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5" />
                <span>{sale.size_sqm} τ.μ.</span>
              </div>
            )}
            {sale.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                <span>{sale.bedrooms} υπν.</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Euro className="w-3.5 h-3.5" />
              <span>{sale.size_sqm > 0 ? `${Math.round(sale.price / sale.size_sqm)}€/τ.μ.` : `${sale.price.toLocaleString()}€`}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
