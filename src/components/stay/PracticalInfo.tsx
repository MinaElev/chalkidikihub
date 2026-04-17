'use client';

import { useLocale } from 'next-intl';
import { Wifi, ParkingCircle, Navigation, KeyRound, Info } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: any;
}

const HEADING: Record<string, string> = {
  el: 'Χρήσιμες πληροφορίες', en: 'Practical information', de: 'Praktische Informationen',
  bg: 'Полезна информация', ru: 'Полезная информация', ro: 'Informații utile',
  sr: 'Korisne informacije',
};

const LABELS: Record<string, Record<string, string>> = {
  how: { el: 'Πώς θα φτάσετε', en: 'How to get there', de: 'Anreise', bg: 'Как да стигнете', ru: 'Как добраться', ro: 'Cum ajungeți', sr: 'Kako doći' },
  checkIn: { el: 'Οδηγίες check-in', en: 'Check-in instructions', de: 'Check-in-Anweisungen', bg: 'Инструкции за настаняване', ru: 'Инструкции по заезду', ro: 'Instrucțiuni check-in', sr: 'Uputstva za prijavu' },
  wifi: { el: 'Wi-Fi', en: 'Wi-Fi', de: 'WLAN', bg: 'Wi-Fi', ru: 'Wi-Fi', ro: 'Wi-Fi', sr: 'Wi-Fi' },
  parking: { el: 'Στάθμευση', en: 'Parking', de: 'Parken', bg: 'Паркиране', ru: 'Парковка', ro: 'Parcare', sr: 'Parking' },
};

function tr(obj: Record<string, string> | undefined, locale: string) {
  if (!obj) return '';
  return obj[locale] || obj.el || obj.en || '';
}

export function PracticalInfo({ listing }: Props) {
  const locale = useLocale();

  const howToReach = tr(listing.how_to_reach as Record<string, string> | undefined, locale);
  const checkInInfo = tr(listing.check_in_info as Record<string, string> | undefined, locale);
  const wifi = tr(listing.wifi_info as Record<string, string> | undefined, locale);
  const parking = tr(listing.parking_info as Record<string, string> | undefined, locale);

  const blocks: { icon: React.ElementType; label: string; value: string }[] = [];
  if (howToReach) blocks.push({ icon: Navigation, label: LABELS.how[locale] || LABELS.how.en, value: howToReach });
  if (checkInInfo) blocks.push({ icon: KeyRound, label: LABELS.checkIn[locale] || LABELS.checkIn.en, value: checkInInfo });
  if (wifi) blocks.push({ icon: Wifi, label: LABELS.wifi[locale] || LABELS.wifi.en, value: wifi });
  if (parking) blocks.push({ icon: ParkingCircle, label: LABELS.parking[locale] || LABELS.parking.en, value: parking });

  if (blocks.length === 0) return null;

  return (
    <section className="mt-2">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700">
          <Info className="w-5 h-5" />
        </span>
        {HEADING[locale] || HEADING.en}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {blocks.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="w-4 h-4" />
                </span>
                <h3 className="font-semibold text-gray-900 text-sm">{b.label}</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{b.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
