'use client';

import { useLocale, useTranslations } from 'next-intl';
import { BeachCard } from '@/components/listings/BeachCard';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { ListingCard } from '@/components/listings/ListingCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Beach, Restaurant, Activity, Listing } from '@/types';
import type { Category } from './location-data';

interface LocationResultsProps {
  category: Category;
  locationName: Record<string, string>;
  beaches: Beach[];
  restaurants: Restaurant[];
  activities: Activity[];
  listings: Listing[];
}

const CATEGORY_LABELS: Record<Category, Record<string, string>> = {
  beaches: { el: 'Παραλίες', en: 'Beaches', de: 'Strande', bg: 'Плажове', ru: 'Пляжи', ro: 'Plaje', sr: 'Plaze' },
  restaurants: { el: 'Εστιατόρια', en: 'Restaurants', de: 'Restaurants', bg: 'Ресторанти', ru: 'Рестораны', ro: 'Restaurante', sr: 'Restorani' },
  activities: { el: 'Δραστηριότητες', en: 'Activities', de: 'Aktivitaten', bg: 'Дейности', ru: 'Развлечения', ro: 'Activitati', sr: 'Aktivnosti' },
  listings: { el: 'Καταλύματα', en: 'Accommodations', de: 'Unterkunfte', bg: 'Настаняване', ru: 'Жильё', ro: 'Cazare', sr: 'Smestaj' },
};

const CATEGORY_PATHS: Record<Category, string> = {
  beaches: '/beaches',
  restaurants: '/restaurants',
  activities: '/activities',
  listings: '/listings',
};

const IN_LABEL: Record<string, string> = {
  el: 'στο',
  en: 'in',
  de: 'in',
  bg: 'в',
  ru: 'в',
  ro: 'in',
  sr: 'u',
};

export function LocationResults({ category, locationName, beaches, restaurants, activities, listings }: LocationResultsProps) {
  const locale = useLocale();
  const t = useTranslations('common');

  const locName = locationName[locale] || locationName.en;
  const catLabel = CATEGORY_LABELS[category]?.[locale] || CATEGORY_LABELS[category]?.en || category;
  const inLabel = IN_LABEL[locale] || 'in';

  const totalCount = category === 'beaches' ? beaches.length
    : category === 'restaurants' ? restaurants.length
    : category === 'activities' ? activities.length
    : listings.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: catLabel, href: CATEGORY_PATHS[category] },
          { label: locName },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {catLabel} {inLabel} {locName}
      </h1>
      <p className="text-gray-600 mb-8">
        {totalCount} {t('results')}
      </p>

      {category === 'beaches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beaches.map((beach) => (
            <BeachCard key={beach.id} beach={beach} />
          ))}
        </div>
      )}

      {category === 'restaurants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}

      {category === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {category === 'listings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {totalCount === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {locale === 'el'
              ? `Δεν βρέθηκαν ${catLabel.toLowerCase()} ${inLabel} ${locName}.`
              : `No ${catLabel.toLowerCase()} found ${inLabel} ${locName}.`}
          </p>
        </div>
      )}
    </div>
  );
}
