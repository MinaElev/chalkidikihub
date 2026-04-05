import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { AREAS } from '@/lib/constants';
import { AreaListings } from '@/components/listings/AreaListings';
import { AreaBeaches, AreaRestaurants, AreaActivities, AreaChargers } from '@/components/listings/AreaContent';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AreaHero } from '@/components/layout/AreaHero';

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

  return <AreaDetail locale={locale} area={area} areaSlug={slug as Area} />;
}

function AreaDetail({
  locale,
  area,
  areaSlug,
}: {
  locale: string;
  area: (typeof AREAS)[number];
  areaSlug: Area;
}) {
  const tNav = useTranslations('nav');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: tNav('areas'), href: '/areas' }, { label: area.name[locale] || area.name.el }]} />

      {/* Area Hero - fetches live from DB */}
      <AreaHero slug={areaSlug} />

      {/* Listings - fetches from DB */}
      <AreaListings area={areaSlug} />

      {/* Beaches - fetches from DB */}
      <AreaBeaches area={areaSlug} />

      {/* Activities - fetches from DB */}
      <AreaActivities area={areaSlug} />

      {/* Restaurants - fetches from DB */}
      <AreaRestaurants area={areaSlug} />

      {/* EV Chargers - fetches from DB */}
      <AreaChargers area={areaSlug} />
    </div>
  );
}
