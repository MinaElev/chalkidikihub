'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import {
  Phone, ShieldAlert, Flame, HeartPulse, Pill, Hospital, Car, User,
  LifeBuoy, AlertTriangle,
} from 'lucide-react';

interface EmergencyRow {
  id: string;
  sort_order: number;
  icon_key: string;
  phone: string;
  [key: string]: unknown;
}

const HEADING: Record<string, string> = {
  el: 'Τηλέφωνα έκτακτης ανάγκης',
  en: 'Emergency contacts',
  de: 'Notrufnummern',
  bg: 'Телефони за спешни случаи',
  ru: 'Экстренные контакты',
  ro: 'Contacte de urgență',
  sr: 'Kontakti za hitne slučajeve',
};

const SUBTITLE: Record<string, string> = {
  el: 'Κρατήστε αυτούς τους αριθμούς εύκολα προσβάσιμους κατά τη διαμονή σας',
  en: 'Keep these numbers handy during your stay',
  de: 'Halten Sie diese Nummern während Ihres Aufenthalts griffbereit',
  bg: 'Дръжте тези номера под ръка по време на престоя си',
  ru: 'Держите эти номера под рукой во время пребывания',
  ro: 'Țineți aceste numere la îndemână pe durata șederii',
  sr: 'Držite ove brojeve pri ruci tokom boravka',
};

const LOCAL_LABEL: Record<string, string> = {
  el: 'Τοπικά τηλέφωνα',
  en: 'Local contacts',
  de: 'Lokale Kontakte',
  bg: 'Местни контакти',
  ru: 'Местные контакты',
  ro: 'Contacte locale',
  sr: 'Lokalni kontakti',
};

// Baseline Greek / EU emergency numbers shown on every listing
const BASELINE_LABEL: Record<string, string> = {
  el: 'Βασικά τηλέφωνα Ελλάδας',
  en: 'Greek / EU emergency',
  de: 'Notruf (Griechenland / EU)',
  bg: 'Спешни номера (Гърция / ЕС)',
  ru: 'Экстренные (Греция / ЕС)',
  ro: 'Urgență (Grecia / UE)',
  sr: 'Hitni brojevi (Grčka / EU)',
};

interface DefaultContact {
  icon_key: string;
  phone: string;
  label: Record<string, string>;
}

const DEFAULTS: DefaultContact[] = [
  {
    icon_key: 'sos', phone: '112',
    label: {
      el: 'Ευρωπαϊκός αριθμός έκτακτης ανάγκης',
      en: 'European emergency number',
      de: 'Europäische Notrufnummer',
      bg: 'Европейски спешен номер',
      ru: 'Европейский номер экстренной помощи',
      ro: 'Număr european de urgență',
      sr: 'Evropski broj za hitne slučajeve',
    },
  },
  {
    icon_key: 'police', phone: '100',
    label: {
      el: 'Αστυνομία', en: 'Police', de: 'Polizei', bg: 'Полиция',
      ru: 'Полиция', ro: 'Poliția', sr: 'Policija',
    },
  },
  {
    icon_key: 'ambulance', phone: '166',
    label: {
      el: 'Ασθενοφόρο (ΕΚΑΒ)', en: 'Ambulance', de: 'Rettungsdienst',
      bg: 'Линейка', ru: 'Скорая помощь', ro: 'Ambulanță', sr: 'Hitna pomoć',
    },
  },
  {
    icon_key: 'fire', phone: '199',
    label: {
      el: 'Πυροσβεστική', en: 'Fire brigade', de: 'Feuerwehr',
      bg: 'Пожарна', ru: 'Пожарная охрана', ro: 'Pompieri', sr: 'Vatrogasci',
    },
  },
  {
    icon_key: 'coast_guard', phone: '108',
    label: {
      el: 'Λιμενικό Σώμα', en: 'Coast Guard', de: 'Küstenwache',
      bg: 'Брегова охрана', ru: 'Береговая охрана', ro: 'Paza de coastă', sr: 'Obalska straža',
    },
  },
  {
    icon_key: 'medical', phone: '10135',
    label: {
      el: 'Κέντρο Δηλητηριάσεων', en: 'Poison Control',
      de: 'Giftnotzentrale', bg: 'Център по отравяния',
      ru: 'Токсикологическая помощь', ro: 'Centru antiotrăvuri',
      sr: 'Centar za trovanja',
    },
  },
];

function iconFor(key: string) {
  switch (key) {
    case 'police':      return ShieldAlert;
    case 'fire':        return Flame;
    case 'ambulance':   return HeartPulse;
    case 'medical':
    case 'hospital':    return Hospital;
    case 'pharmacy':    return Pill;
    case 'coast_guard': return LifeBuoy;
    case 'taxi':        return Car;
    case 'host':        return User;
    case 'sos':
    default:            return AlertTriangle;
  }
}

export function EmergencyContacts({ listingId }: { listingId: string }) {
  const locale = useLocale();
  const [localContacts, setLocalContacts] = useState<EmergencyRow[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('listing_emergency_contacts')
        .select('*')
        .eq('listing_id', listingId)
        .order('sort_order', { ascending: true });
      if (data) setLocalContacts(data as EmergencyRow[]);
    })();
  }, [listingId]);

  return (
    <section className="mt-2">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 text-red-600">
          <AlertTriangle className="w-5 h-5" />
        </span>
        {HEADING[locale] || HEADING.en}
      </h2>
      <p className="text-sm text-gray-600 mb-5">{SUBTITLE[locale] || SUBTITLE.en}</p>

      {/* Baseline (always shown) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          {BASELINE_LABEL[locale] || BASELINE_LABEL.en}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEFAULTS.map((d) => {
            const Icon = iconFor(d.icon_key);
            const label = d.label[locale] || d.label.en;
            return (
              <a
                key={d.phone + d.icon_key}
                href={`tel:${d.phone}`}
                className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 text-red-600 group-hover:bg-red-100 group-hover:border-red-300">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{label}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    <span className="tabular-nums font-mono">{d.phone}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Local contacts (owner-added) */}
      {localContacts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            {LOCAL_LABEL[locale] || LOCAL_LABEL.en}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {localContacts.map((c) => {
              const Icon = iconFor(c.icon_key);
              const label = (c[`label_${locale}`] as string) || (c.label_el as string) || (c.label_en as string) || c.phone;
              const note = (c[`notes_${locale}`] as string) || '';
              return (
                <a
                  key={c.id}
                  href={`tel:${c.phone}`}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-primary-50 border border-transparent hover:border-primary-200 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 text-primary-600 group-hover:bg-primary-100 group-hover:border-primary-300">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{label}</div>
                    {note && <div className="text-[11px] text-gray-500 truncate">{note}</div>}
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span className="tabular-nums font-mono">{c.phone}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
