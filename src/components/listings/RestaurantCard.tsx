'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Restaurant } from '@/types';
import { MapPin, Star, Euro, Eye, Music, Phone } from 'lucide-react';

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const locale = useLocale();
  const t = useTranslations('restaurants');
  const tCuisine = useTranslations('cuisineTypes');
  const tPrice = useTranslations('priceLevels');

  const name = restaurant.name[locale] || restaurant.name.en;

  return (
    <Link href={`/restaurants/${restaurant.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-0.5">
        <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
          {restaurant.image_url ? (
            <img
              src={restaurant.image_url}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-200 flex items-center justify-center">
              <span className="text-orange-300 text-5xl">🍽</span>
            </div>
          )}
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {tCuisine(restaurant.cuisine[0])}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-gray-900">{restaurant.rating.toFixed(1)}</span>
          </div>
          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {restaurant.has_sea_view && (
              <div className="bg-blue-500/90 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                <Eye className="w-3 h-3" />{t('seaView')}
              </div>
            )}
            {restaurant.has_live_music && (
              <div className="bg-purple-500/90 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                <Music className="w-3 h-3" />{t('liveMusic')}
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{restaurant.location_name}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-1.5">
              {restaurant.cuisine.slice(0, 2).map((c) => (
                <span key={c} className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                  {tCuisine(c)}
                </span>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {tPrice(restaurant.price_level)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
