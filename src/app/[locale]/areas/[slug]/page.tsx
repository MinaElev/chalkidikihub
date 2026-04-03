import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { AREAS } from '@/lib/constants';
import { seedBeaches } from '@/lib/seed-beaches';
import { seedChargers } from '@/lib/seed-chargers';
import { seedActivities } from '@/lib/seed-activities';
import { seedRestaurants } from '@/lib/seed-restaurants';
import { AreaListings } from '@/components/listings/AreaListings';
import { BeachCard } from '@/components/listings/BeachCard';
import { ChargerCard } from '@/components/listings/ChargerCard';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { AreaHero } from '@/components/layout/AreaHero';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Area } from '@/types';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

export default async function AreaDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const area = AREAS.find((a) => a.slug === slug);
  if (!area) notFound();

  const areaBeaches = seedBeaches.filter((b) => b.area === (slug as Area));
  const areaChargers = seedChargers.filter((c) => c.area === (slug as Area));
  const areaActivities = seedActivities.filter((a) => a.area === (slug as Area));
  const areaRestaurants = seedRestaurants.filter((r) => r.area === (slug as Area));

  return <AreaDetail locale={locale} area={area} areaSlug={slug as Area} beaches={areaBeaches} chargers={areaChargers} activities={areaActivities} restaurants={areaRestaurants} />;
}

function AreaDetail({
  locale,
  area,
  areaSlug,
  beaches,
  chargers,
  activities,
  restaurants,
}: {
  locale: string;
  area: (typeof AREAS)[number];
  areaSlug: Area;
  beaches: typeof seedBeaches;
  chargers: typeof seedChargers;
  activities: typeof seedActivities;
  restaurants: typeof seedRestaurants;
}) {
  const t = useTranslations('areas');
  const tBeaches = useTranslations('beaches');
  const tChargers = useTranslations('evChargers');
  const tActivities = useTranslations('activities');
  const tRestaurants = useTranslations('restaurants');
  const tCommon = useTranslations('common');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/areas"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('title')}
      </Link>

      {/* Area Hero - fetches live from DB */}
      <AreaHero slug={areaSlug} />

      {/* Listings - fetches both seed + DB data */}
      <AreaListings area={areaSlug} />

      {/* Beaches section */}
      {beaches.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{tBeaches('title')}</h2>
            <Link
              href="/beaches"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {tBeaches('viewAll')} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beaches.map((beach) => (
              <BeachCard key={beach.id} beach={beach} />
            ))}
          </div>
        </div>
      )}

      {/* Activities section */}
      {activities.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{tActivities('title')}</h2>
            <Link
              href="/activities"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {tActivities('viewAll')} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}

      {/* Restaurants section */}
      {restaurants.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{tRestaurants('title')}</h2>
            <Link href="/restaurants" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              {tRestaurants('viewAll')} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}

      {/* EV Chargers section */}
      {chargers.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{tChargers('title')}</h2>
            <Link
              href="/ev-chargers"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {tChargers('viewAll')} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chargers.map((charger) => (
              <ChargerCard key={charger.id} charger={charger} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
