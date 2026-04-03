'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Activity } from '@/types';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MapPin, Star, Clock, Euro } from 'lucide-react';
import { DetailSkeleton } from '@/components/ui/Skeleton';

export function DynamicActivityDetail({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations('activities');
  const tCat = useTranslations('activityCategories');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/activities?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { if (data && data.id) setActivity(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <DetailSkeleton />;
  if (!activity) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-lg text-gray-500">Not found</p><Link href="/activities" className="mt-4 inline-flex text-primary-600 hover:underline">{t('title')}</Link></div>;

  const name = activity.name[locale] || activity.name.en;
  const description = activity.description[locale] || activity.description.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/activities" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"><ArrowLeft className="w-4 h-4" />{t('title')}</Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div><span className="inline-flex px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-3">{tCat(activity.category)}</span>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600"><MapPin className="w-4 h-4" /><span>{activity.location_name}</span></div></div>
          {activity.image_url && <div className="aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden"><img src={activity.image_url} alt={name} className="w-full h-full object-cover" /></div>}
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
        </div>
        <div className="lg:col-span-1"><div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /><span className="text-xl font-bold">{activity.rating.toFixed(1)}</span></div>
          <div className="flex items-center gap-3"><Euro className="w-5 h-5 text-amber-600" /><div><div className="text-sm text-gray-500">{t('priceRange')}</div><div className="font-semibold">{activity.price_range === 'Free' ? t('free') : activity.price_range}</div></div></div>
          <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-blue-600" /><div><div className="text-sm text-gray-500">{t('duration')}</div><div className="font-semibold">{activity.duration}</div></div></div>
        </div></div>
      </div>
    </div>
  );
}
