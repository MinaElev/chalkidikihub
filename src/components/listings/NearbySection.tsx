'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Waves, UtensilsCrossed, MountainSnow, MapPin, ChevronRight } from 'lucide-react';

interface NearbyEntity {
  id: string;
  type: 'beach' | 'restaurant' | 'activity' | 'village';
  slug: string;
  name: Record<string, string>;
  distance_km: number;
  image_url?: string;
  _note?: Record<string, string>;
}

interface NearbyResponse {
  beaches: NearbyEntity[];
  restaurants: NearbyEntity[];
  activities: NearbyEntity[];
  villages: NearbyEntity[];
}

const HEADING: Record<string, string> = {
  el: 'Τι υπάρχει γύρω', en: 'What\'s nearby', de: 'In der Nähe', bg: 'Какво има наблизо',
  ru: 'Что рядом', ro: 'Ce este în apropiere', sr: 'Šta je u blizini',
};
const SUBTITLE: Record<string, string> = {
  el: 'Οι πιο κοντινές τοποθεσίες — δείτε τι μπορείτε να κάνετε γύρω από το κατάλυμα',
  en: 'The nearest places — see what you can do around the property',
  de: 'Die nächsten Orte — entdecken Sie, was Sie in der Umgebung unternehmen können',
  bg: 'Най-близките места — вижте какво може да правите около имота',
  ru: 'Ближайшие места — посмотрите, чем можно заняться рядом',
  ro: 'Cele mai apropiate locuri — vezi ce poți face în jurul proprietății',
  sr: 'Najbliža mesta — pogledajte šta možete raditi u okolini',
};
const BEACHES: Record<string, string> = { el: 'Παραλίες', en: 'Beaches', de: 'Strände', bg: 'Плажове', ru: 'Пляжи', ro: 'Plaje', sr: 'Plaže' };
const RESTAURANTS: Record<string, string> = { el: 'Εστιατόρια', en: 'Restaurants', de: 'Restaurants', bg: 'Ресторанти', ru: 'Рестораны', ro: 'Restaurante', sr: 'Restorani' };
const ACTIVITIES: Record<string, string> = { el: 'Δραστηριότητες', en: 'Activities', de: 'Aktivitäten', bg: 'Дейности', ru: 'Развлечения', ro: 'Activități', sr: 'Aktivnosti' };
const VILLAGES: Record<string, string> = { el: 'Χωριά', en: 'Villages', de: 'Dörfer', bg: 'Села', ru: 'Деревни', ro: 'Sate', sr: 'Sela' };

export function NearbySection({ listingId }: { listingId: string }) {
  const locale = useLocale();
  const [data, setData] = useState<NearbyResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/nearby?listing_id=${listingId}`)
      .then((r) => r.json())
      .then((d) => { if (d && !d.error) setData(d); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [listingId]);

  if (!loaded) return null;
  if (!data) return null;

  const groups: { key: keyof NearbyResponse; label: string; icon: React.ElementType; linkBase: string; color: string }[] = [
    { key: 'beaches',     label: BEACHES[locale] || BEACHES.en,     icon: Waves,            linkBase: '/beaches',     color: 'text-sky-600 bg-sky-50' },
    { key: 'restaurants', label: RESTAURANTS[locale] || RESTAURANTS.en, icon: UtensilsCrossed, linkBase: '/restaurants', color: 'text-orange-600 bg-orange-50' },
    { key: 'activities',  label: ACTIVITIES[locale] || ACTIVITIES.en, icon: MountainSnow,    linkBase: '/activities',  color: 'text-emerald-600 bg-emerald-50' },
    { key: 'villages',    label: VILLAGES[locale] || VILLAGES.en,    icon: MapPin,           linkBase: '/places',      color: 'text-violet-600 bg-violet-50' },
  ];

  // Only show groups that have items
  const visibleGroups = groups.filter(g => (data[g.key] || []).length > 0);
  if (visibleGroups.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
        {HEADING[locale] || HEADING.en}
      </h2>
      <p className="text-sm text-gray-600 mb-5">{SUBTITLE[locale] || SUBTITLE.en}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleGroups.map(({ key, label, icon: Icon, linkBase, color }) => (
          <div key={key} className="bg-white border border-gray-200 rounded-2xl p-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${color}`}>
                <Icon className="w-4 h-4" />
              </span>
              {label}
            </h3>
            <ul className="divide-y divide-gray-100">
              {data[key].slice(0, 5).map((e) => {
                const name = e.name[locale] || e.name.el || e.name.en;
                const note = e._note?.[locale] || e._note?.en || '';
                return (
                  <li key={e.id}>
                    <Link
                      href={`${linkBase}/${e.slug}`}
                      className="flex items-center justify-between gap-3 py-2.5 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700 truncate">
                          {name}
                        </div>
                        {note && (
                          <div className="text-xs text-gray-500 mt-0.5 italic">{note}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-500 tabular-nums">
                          {e.distance_km < 1
                            ? `${Math.round(e.distance_km * 1000)} m`
                            : `${e.distance_km.toFixed(1)} km`}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
