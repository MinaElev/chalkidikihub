'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import {
  Sparkle, Coffee, Car, Droplets, Bike, Ship, Utensils, Flower2, ShowerHead,
} from 'lucide-react';

interface ExtraRow {
  id: string;
  sort_order: number;
  icon_key: string;
  price: number | null;
  currency: string;
  price_unit: string | null;
  included: boolean;
  [key: string]: unknown;
}

const HEADING: Record<string, string> = {
  el: 'Πρόσθετες υπηρεσίες', en: 'Extras & services', de: 'Zusätzliche Leistungen',
  bg: 'Допълнителни услуги', ru: 'Дополнительные услуги', ro: 'Servicii suplimentare',
  sr: 'Dodatne usluge',
};
const SUBTITLE: Record<string, string> = {
  el: 'Έξτρα που μπορείτε να προσθέσετε στη διαμονή σας', en: 'Extras you can add to your stay',
  de: 'Extras, die Sie zu Ihrem Aufenthalt hinzufügen können',
  bg: 'Допълнения, които можете да добавите', ru: 'Что можно добавить к проживанию',
  ro: 'Extra pe care le puteți adăuga', sr: 'Dodaci uz boravak',
};
const INCLUDED: Record<string, string> = {
  el: 'Δωρεάν / περιλαμβάνεται', en: 'Included / free', de: 'Inklusive / kostenlos',
  bg: 'Включено / безплатно', ru: 'Включено / бесплатно',
  ro: 'Inclus / gratuit', sr: 'Uključeno / besplatno',
};
const UNITS: Record<string, Record<string, string>> = {
  per_stay: { el: 'ανά διαμονή', en: 'per stay', de: 'pro Aufenthalt', bg: 'за престой', ru: 'за проживание', ro: 'pe sejur', sr: 'po boravku' },
  per_night: { el: 'ανά βράδυ', en: 'per night', de: 'pro Nacht', bg: 'на нощ', ru: 'за ночь', ro: 'pe noapte', sr: 'po noći' },
  per_day: { el: 'ανά ημέρα', en: 'per day', de: 'pro Tag', bg: 'на ден', ru: 'за день', ro: 'pe zi', sr: 'po danu' },
  per_person: { el: 'ανά άτομο', en: 'per person', de: 'pro Person', bg: 'на човек', ru: 'за человека', ro: 'de persoană', sr: 'po osobi' },
  per_use: { el: 'ανά χρήση', en: 'per use', de: 'pro Nutzung', bg: 'за ползване', ru: 'за использование', ro: 'pe utilizare', sr: 'po korišćenju' },
};

function iconFor(key: string) {
  switch (key) {
    case 'breakfast': return Coffee;
    case 'transfer':  return Car;
    case 'cleaning':  return Droplets;
    case 'bike':      return Bike;
    case 'boat':      return Ship;
    case 'food':      return Utensils;
    case 'spa':       return Flower2;
    case 'towels':    return ShowerHead;
    default:          return Sparkle;
  }
}

export function ExtrasSection({ listingId }: { listingId: string }) {
  const locale = useLocale();
  const [rows, setRows] = useState<ExtraRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('listing_extras')
        .select('*')
        .eq('listing_id', listingId)
        .order('sort_order', { ascending: true });
      if (data) setRows(data as ExtraRow[]);
      setLoaded(true);
    })();
  }, [listingId]);

  if (!loaded || rows.length === 0) return null;

  return (
    <section className="mt-2">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-teal-100 text-teal-700">
          <Sparkle className="w-5 h-5" />
        </span>
        {HEADING[locale] || HEADING.en}
      </h2>
      <p className="text-sm text-gray-600 mb-5">{SUBTITLE[locale] || SUBTITLE.en}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.map((r) => {
          const Icon = iconFor(r.icon_key);
          const label = (r[`label_${locale}`] as string) || (r.label_el as string) || (r.label_en as string) || '—';
          const description = (r[`description_${locale}`] as string) || (r.description_el as string) || (r.description_en as string) || '';
          const unitLabel = r.price_unit ? (UNITS[r.price_unit]?.[locale] || UNITS[r.price_unit]?.en || r.price_unit) : '';

          return (
            <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
                  <div className="shrink-0 text-right">
                    {r.included ? (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                        {INCLUDED[locale] || INCLUDED.en}
                      </span>
                    ) : r.price != null ? (
                      <span className="text-sm font-semibold text-gray-900">
                        {r.currency === 'EUR' ? '€' : r.currency}{r.price}
                        {unitLabel && <span className="text-[11px] font-normal text-gray-500"> / {unitLabel}</span>}
                      </span>
                    ) : null}
                  </div>
                </div>
                {description && (
                  <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
