'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MapPin, ChevronRight } from 'lucide-react';

interface Village {
  slug: string;
  name: Record<string, string>;
  population: number;
}

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

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary-600" />
        {locale === 'el' ? 'Χωριά & Οικισμοί' : locale === 'de' ? 'Dörfer & Siedlungen' : locale === 'bg' ? 'Села и селища' : locale === 'ru' ? 'Деревни и поселения' : locale === 'ro' ? 'Sate și așezări' : 'Villages & Settlements'}
      </h2>
      <div className="flex flex-wrap gap-2">
        {villages.map((v) => {
          const name = v.name[locale] || v.name.el || v.name.en;
          return (
            <Link key={v.slug} href={`/places/${v.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors">
              <MapPin className="w-3 h-3 text-gray-400" />
              {name}
              {v.population > 0 && <span className="text-[10px] text-gray-400">({v.population.toLocaleString()})</span>}
            </Link>
          );
        })}
      </div>
      <Link href={`/places?area=${area}`} className="inline-flex items-center gap-1 mt-3 text-xs text-primary-600 hover:underline">
        {locale === 'el' ? 'Δες όλα τα χωριά' : 'View all villages'} <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
