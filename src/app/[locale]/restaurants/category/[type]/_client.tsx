'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Restaurant } from '@/types';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Loader2, ArrowLeft } from 'lucide-react';

interface BusinessType {
  slug: string;
  [key: string]: string;
}

export default function RestaurantTypePage() {
  const { type } = useParams<{ type: string }>();
  const locale = useLocale();
  const tNav = useTranslations('nav');
  const tRestaurants = useTranslations('restaurants');
  const tCommon = useTranslations('common');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [typesRes, restRes] = await Promise.all([
        fetch('/api/business-types').then(r => r.json()).catch(() => []),
        fetch('/api/restaurants?fields=card').then(r => r.json()).catch(() => []),
      ]);
      const bt = (typesRes as BusinessType[]).find(t => t.slug === type);
      if (bt) setBusinessType(bt);
      if (Array.isArray(restRes)) {
        setRestaurants(restRes.filter((r: Restaurant) => r.cuisine?.includes(type)));
      }
      setLoading(false);
    }
    load();
  }, [type]);

  const typeName = businessType
    ? businessType[`name_${locale}`] || businessType.name_el || type
    : type;

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: tNav('restaurants'), href: '/restaurants' },
        { label: typeName },
      ]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{typeName}</h1>
        <p className="mt-1 text-gray-600">
          {restaurants.length} {typeName.toLowerCase()} {locale === 'el' ? 'στη Χαλκιδική' : 'in Halkidiki'}
        </p>
      </div>

      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">{tCommon('noResults')}</p>
          <Link href="/restaurants" className="mt-4 inline-flex text-primary-600 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> {tRestaurants('title')}
          </Link>
        </div>
      )}
    </div>
  );
}
