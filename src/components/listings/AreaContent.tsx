'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Beach, Restaurant, Activity, EvCharger } from '@/types';
import { BeachCard } from './BeachCard';
import { RestaurantCard } from './RestaurantCard';
import { ActivityCard } from './ActivityCard';
import { ChargerCard } from './ChargerCard';
import { Link } from '@/i18n/navigation';

export function AreaBeaches({ area }: { area: string }) {
  const t = useTranslations('beaches');
  const [beaches, setBeaches] = useState<Beach[]>([]);

  useEffect(() => {
    fetch(`/api/beaches?area=${area}&limit=6`)
      .then(r => r.json())
      .then((data: Beach[]) => setBeaches(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [area]);

  if (beaches.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
        <Link href="/beaches" className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('viewAll')} &rarr;</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beaches.map(beach => <BeachCard key={beach.id} beach={beach} />)}
      </div>
    </div>
  );
}

export function AreaRestaurants({ area }: { area: string }) {
  const t = useTranslations('restaurants');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    fetch(`/api/restaurants?area=${area}&limit=6`)
      .then(r => r.json())
      .then((data: Restaurant[]) => setRestaurants(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [area]);

  if (restaurants.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
        <Link href="/restaurants" className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('viewAll')} &rarr;</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.slice(0, 6).map(r => <RestaurantCard key={r.id} restaurant={r} />)}
      </div>
    </div>
  );
}

export function AreaActivities({ area }: { area: string }) {
  const t = useTranslations('activities');
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch(`/api/activities?area=${area}&limit=6`)
      .then(r => r.json())
      .then((data: Activity[]) => setActivities(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [area]);

  if (activities.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
        <Link href="/activities" className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('viewAll')} &rarr;</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
      </div>
    </div>
  );
}

export function AreaChargers({ area }: { area: string }) {
  const t = useTranslations('evChargers');
  const [chargers, setChargers] = useState<EvCharger[]>([]);

  useEffect(() => {
    fetch(`/api/chargers?area=${area}&limit=6`)
      .then(r => r.json())
      .then((data: EvCharger[]) => setChargers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [area]);

  if (chargers.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
        <Link href="/ev-chargers" className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('viewAll')} &rarr;</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chargers.map(c => <ChargerCard key={c.id} charger={c} />)}
      </div>
    </div>
  );
}
