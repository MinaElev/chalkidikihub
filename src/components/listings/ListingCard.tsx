'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Listing } from '@/types';
import { MapPin, Users, BedDouble, Bath } from 'lucide-react';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const locale = useLocale();
  const t = useTranslations('common');

  const title = listing.title[locale] || listing.title.en;
  const coverImage = listing.images.find((img) => img.is_cover);

  return (
    <Link href={`/listings/${listing.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-900/5 card-premium">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage.image_url}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="text-primary-400 text-4xl font-bold">H</span>
            </div>
          )}
          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-sm font-bold text-gray-900">
              {t('from')} &euro;{listing.price_per_night}<span className="font-normal text-gray-500">{t('perNight')}</span>
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <FavoriteButton itemType="listing" itemSlug={listing.slug} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{listing.location_name}</span>
          </div>

          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{listing.guests_max}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4" />
              <span>{listing.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{listing.bathrooms}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
