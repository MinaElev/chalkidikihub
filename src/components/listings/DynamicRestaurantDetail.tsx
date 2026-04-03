'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Restaurant } from '@/types';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MapPin, Star, Clock, Phone, Loader2 } from 'lucide-react';

export function DynamicRestaurantDetail({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations('restaurants');
  const tCuisine = useTranslations('cuisineTypes');
  const tPrice = useTranslations('priceLevels');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/restaurants?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { if (data && data.id) setRestaurant(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-[40vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  if (!restaurant) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-lg text-gray-500">Not found</p><Link href="/restaurants" className="mt-4 inline-flex text-primary-600 hover:underline">{t('title')}</Link></div>;

  const name = restaurant.name[locale] || restaurant.name.en;
  const description = restaurant.description[locale] || restaurant.description.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/restaurants" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"><ArrowLeft className="w-4 h-4" />{t('title')}</Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div><h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600"><MapPin className="w-4 h-4" /><span>{restaurant.location_name}</span></div></div>
          <div className="flex flex-wrap gap-2">{restaurant.cuisine.map((c) => <span key={c} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">{tCuisine(c)}</span>)}</div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
        </div>
        <div className="lg:col-span-1"><div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /><span className="text-xl font-bold">{restaurant.rating.toFixed(1)}</span></div>
          <div><div className="text-sm text-gray-500">{t('priceLevel')}</div><div className="font-semibold">{tPrice(restaurant.price_level)}</div></div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><span className="text-sm">{restaurant.hours}</span></div>
          {restaurant.phone && <a href={`tel:${restaurant.phone}`} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl"><Phone className="w-4 h-4" />{t('callNow')}</a>}
        </div></div>
      </div>
    </div>
  );
}
