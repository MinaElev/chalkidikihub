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
  const altText = `${name}, ${beach.location_name}${topFeatures.length ? ` — ${topFeatures.map(f => tFeatures(f)).join(', ')}` : ''}`;

  return (
    <Link href={`/beaches/${beach.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-900/5 card-premium">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
          {beach.image_url ? (
            <Image
              src={beach.image_url}
              alt={altText}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={60}
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-gray-900">{beach.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{beach.location_name}</span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {topFeatures.map((feature) => (
              <span
                key={feature}
                className="px-2.5 py-0.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium"
              >
                {tFeatures(feature)}
              </span>
            ))}
            {beach.features.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-lg text-xs">
                +{beach.features.length - 3}
              </span>
            )}
          </div>

          {/* Crowd + Reviews */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <CrowdBadge beachSlug={beach.slug} />
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{beach.reviews_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
