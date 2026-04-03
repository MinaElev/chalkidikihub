'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { AREAS } from '@/lib/constants';
import { AreaInfo } from '@/types';

export function AreaHero({ slug }: { slug: string }) {
  const locale = useLocale();
  const fallback = AREAS.find((a) => a.slug === slug);
  const [area, setArea] = useState<AreaInfo | null>(fallback || null);

  useEffect(() => {
    fetch('/api/areas')
      .then((r) => r.json())
      .then((data: AreaInfo[]) => {
        const found = data.find((a) => a.slug === slug);
        if (found) setArea(found);
      })
      .catch(() => {});
  }, [slug]);

  if (!area) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl aspect-[21/9] bg-gray-300 mb-8">
      {area.image_url && (
        <img src={area.image_url} alt={area.name[locale] || area.name.el || ''} loading="eager"
          className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-primary-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <h1 className="text-4xl font-bold text-white">{area.name[locale] || area.name.el}</h1>
        <p className="mt-2 text-lg text-gray-200 max-w-2xl">{area.description[locale] || area.description.el}</p>
      </div>
    </div>
  );
}
