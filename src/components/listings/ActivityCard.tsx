'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Activity } from '@/types';
import { MapPin, Star, Clock, Euro, MessageCircle } from 'lucide-react';

export function ActivityCard({ activity }: { activity: Activity }) {
  const locale = useLocale();
  const t = useTranslations('activities');
  const tCat = useTranslations('activityCategories');

  const name = activity.name[locale] || activity.name.en;

  return (
    <Link href={`/activities/${activity.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-0.5">
        <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
          {activity.image_url ? (
            <Image
              src={activity.image_url}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <span className="text-orange-300 text-5xl font-bold">*</span>
            </div>
          )}
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {tCat(activity.category)}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-gray-900">{activity.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{activity.location_name}</span>
          </div>

          <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Euro className="w-3.5 h-3.5" />
              <span>{activity.price_range === 'Free' ? t('free') : activity.price_range}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{activity.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{activity.reviews_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
