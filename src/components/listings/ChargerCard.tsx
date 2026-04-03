'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { EvCharger } from '@/types';
import { MapPin, Star, Zap, Clock, Gift } from 'lucide-react';

export function ChargerCard({ charger }: { charger: EvCharger }) {
  const locale = useLocale();
  const t = useTranslations('evChargers');
  const tConn = useTranslations('connectorTypes');

  const name = charger.name[locale] || charger.name.en;
  const maxPower = Math.max(...charger.connectors.map((c) => c.power_kw));
  const connectorLabels = [...new Set(charger.connectors.map((c) => c.type))];

  return (
    <Link href={`/ev-chargers/${charger.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
          {charger.image_url ? (
            <img
              src={charger.image_url}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
              <Zap className="w-12 h-12 text-green-400" />
            </div>
          )}
          {/* Rating */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-gray-900">{charger.rating.toFixed(1)}</span>
          </div>
          {/* Free badge */}
          {charger.free_charging && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
              <Gift className="w-3 h-3" />
              {t('freeCharging')}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{charger.location_name}</span>
          </div>

          {/* Info row */}
          <div className="flex items-center gap-3 mt-3 text-sm">
            <div className="flex items-center gap-1 text-green-700 font-medium">
              <Zap className="w-4 h-4" />
              <span>{maxPower} kW</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{charger.hours === '24/7' ? t('open24h') : charger.hours}</span>
            </div>
            <span className="text-gray-500">{charger.total_spots} {t('spots')}</span>
          </div>

          {/* Connectors */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {connectorLabels.map((type) => (
              <span
                key={type}
                className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium"
              >
                {tConn(type)}
              </span>
            ))}
            {!charger.free_charging && charger.cost_per_kwh && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                €{charger.cost_per_kwh}/kWh
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
