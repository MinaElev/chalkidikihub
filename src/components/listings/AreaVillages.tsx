'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MapPin, ChevronRight, Users } from 'lucide-react';

interface Village {
  slug: string;
  name: Record<string, string>;
  population: number;
}

const HEADING_TXT: Record<string, string> = {
  el: 'Χωριά & Οικισμοί',
  en: 'Villages & Settlements',
  de: 'Dörfer & Siedlungen',
  bg: 'Села и селища',
  ru: 'Деревни и поселения',
  ro: 'Sate și așezări',
  sr: 'Sela i naselja',
};

const VIEW_ALL_TXT: Record<string, string> = {
  el: 'Δες όλα τα χωριά',
  en: 'View all villages',
  de: 'Alle Dörfer ansehen',
  bg: 'Вижте всички села',
  ru: 'Смотреть все деревни',
  ro: 'Vezi toate satele',
  sr: 'Pogledajte sva sela',
};

export function AreaVillages({ area }: { area: string }) {
  const locale = useLocale();
  const [villages, setVillages] = useState<Village[]>([]);

  useEffect(() => {
    fetch(`/api/villages?area=${area}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setVillages(data); })
      .catch(() => {});
  }, [area]);

  if (villages.length === 0) return null;

  const heading = HEADING_TXT[locale] || HEADING_TXT.en;
  const viewAll = VIEW_ALL_TXT[locale] || VIEW_ALL_TXT.en;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-700">
            <MapPin className="w-4 h-4" />
          </span>
          {heading}
          <span className="text-xs font-medium text-gray-400 ml-1">({villages.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {villages.map((v) => {
          const name = v.name[locale] || v.name.el || v.name.en;
          return (
            <Link
              key={v.slug}
              href={`/places/${v.slug}`}
              className="group flex items-center gap-2.5 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-primary-100 text-gray-400 group-hover:text-primary-600 transition-colors">
                <MapPin className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 group-hover:text-primary-800 truncate">
                  {name}
                </div>
                {v.population > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                    <Users className="w-3 h-3" />
                    {v.population.toLocaleString()}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href={`/places?area=${area}`}
        className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
      >
        {viewAll} <ChevronRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
