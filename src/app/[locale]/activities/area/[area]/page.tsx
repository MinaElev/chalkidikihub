'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Activity } from '@/types';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AREAS } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

export default function ActivitiesByAreaPage() {
  const { area } = useParams<{ area: string }>();
  const locale = useLocale();
  const t = useTranslations('activities');
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const areaInfo = AREAS.find(a => a.slug === area);
  const areaName = areaInfo?.name[locale] || areaInfo?.name.en || area;

  useEffect(() => {
    fetch(`/api/activities?area=${area}&limit=20`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [area]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: t('title'), href: '/activities' }, { label: areaName }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')} {areaName}</h1>
      <p className="text-gray-600 mb-8">{loading ? '' : `${items.length} ${t('results')}`}</p>
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(activity => <ActivityCard key={activity.id} activity={activity} />)}
        </div>
      )}
    </div>
  );
}
