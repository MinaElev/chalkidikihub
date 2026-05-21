'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AreaInfo } from '@/types';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function AreasPageClient({ initialAreas }: { initialAreas: AreaInfo[] }) {
  const locale = useLocale();
  const t = useTranslations('areas');
  const areas = initialAreas;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: t('title') }]} />
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-3 text-lg text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {areas.map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-gray-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              {area.image_url ? (
                <Image
                  src={area.image_url}
                  alt={area.name[locale] || area.name.el || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 group-hover:scale-105 transition-transform duration-300" />
              )}
              <div className="absolute inset-0 bg-primary-900/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h2 className="text-2xl font-bold text-white">{area.name[locale] || area.name.el}</h2>
                <p className="mt-2 text-sm text-gray-200 line-clamp-2">
                  {area.description[locale] || area.description.el}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-sm font-medium text-primary-300 group-hover:text-primary-200 transition-colors">
                    {t('viewListings')} &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
