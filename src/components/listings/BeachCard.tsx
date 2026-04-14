'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Beach } from '@/types';
import { MapPin, Star, MessageCircle } from 'lucide-react';
import { CrowdBadge } from './CrowdIndicator';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

export function BeachCard({ beach }: { beach: Beach }) {
  const locale = useLocale();
  const t = useTranslations('beaches');
  const tFeatures = useTranslations('beachFeatures');

  const name = beach.name[locale] || beach.name.en;
  const topFeatures = beach.features.slice(0, 3);

  return (
    <Link href={`/beaches/${beach.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
          {beach.image_url ? (
            <Image
              src={beach.image_url}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center">
              <span className="text-blue-400 text-4xl">~</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <FavoriteButton itemType="beach" itemSlug={beach.slug} size="sm" />
          </div>
          {/* Rating badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-gray-900">{beach.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{beach.location_name}</span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {topFeatures.map((feature) => (
              <span
                key={feature}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
              >
                {tFeatures(feature)}
              </span>
            ))}
            {beach.features.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{beach.features.length - 3}
              </span>
            )}
          </div>

          {/* Crowd + Reviews */}
          <div className="flex items-center justify-between mt-3">
            <CrowdBadge beachSlug={beach.slug} />
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{beach.reviews_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
