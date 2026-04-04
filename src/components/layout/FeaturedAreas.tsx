'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AREAS } from '@/lib/constants';
import { AreaInfo } from '@/types';

export function FeaturedAreas() {
  const locale = useLocale();
  const t = useTranslations('areas');
  const [areas, setAreas] = useState<AreaInfo[]>(AREAS);

  useEffect(() => {
    fetch('/api/areas')
      .then((r) => r.json())
      .then((data: AreaInfo[]) => {
        if (Array.isArray(data) && data.length > 0) setAreas(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('title')}</h2>
          <p className="mt-3 text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              {area.image_url ? (
                <img src={area.image_url} alt={area.name[locale] || area.name.el || ''} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 group-hover:scale-105 transition-transform duration-300" />
              )}
              <div className="absolute inset-0 bg-primary-900/30" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white">{area.name[locale] || area.name.el}</h3>
                <p className="mt-1 text-sm text-gray-200 line-clamp-2">{area.description[locale] || area.description.el}</p>
                <span className="mt-3 inline-flex text-sm font-medium text-primary-300 group-hover:text-primary-200 transition-colors">
                  {t('viewListings')} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
