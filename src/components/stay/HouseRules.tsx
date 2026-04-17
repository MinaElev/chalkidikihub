'use client';

import { useLocale } from 'next-intl';
import {
  Clock, Cigarette, Dog, Music, Baby, Moon, ShieldCheck, Info,
} from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: any;
}

const HEADING: Record<string, string> = {
  el: 'Κανόνες του καταλύματος', en: 'House rules', de: 'Hausordnung',
  bg: 'Правила на имота', ru: 'Правила проживания', ro: 'Reguli ale locuinței',
  sr: 'Kućni red',
};

const LABELS: Record<string, Record<string, string>> = {
  checkIn: { el: 'Check-in', en: 'Check-in', de: 'Check-in', bg: 'Настаняване', ru: 'Заезд', ro: 'Check-in', sr: 'Prijava' },
  checkOut: { el: 'Check-out', en: 'Check-out', de: 'Check-out', bg: 'Напускане', ru: 'Выезд', ro: 'Check-out', sr: 'Odjava' },
  smoking: { el: 'Κάπνισμα', en: 'Smoking', de: 'Rauchen', bg: 'Пушене', ru: 'Курение', ro: 'Fumat', sr: 'Pušenje' },
  pets: { el: 'Κατοικίδια', en: 'Pets', de: 'Haustiere', bg: 'Домашни любимци', ru: 'Питомцы', ro: 'Animale', sr: 'Kućni ljubimci' },
  parties: { el: 'Πάρτι / Εκδηλώσεις', en: 'Parties / Events', de: 'Partys / Events', bg: 'Партита', ru: 'Вечеринки', ro: 'Petreceri', sr: 'Zabave' },
  kids: { el: 'Παιδιά', en: 'Children', de: 'Kinder', bg: 'Деца', ru: 'Дети', ro: 'Copii', sr: 'Deca' },
  quietHours: { el: 'Ώρες κοινής ησυχίας', en: 'Quiet hours', de: 'Ruhezeiten', bg: 'Време за тишина', ru: 'Тихие часы', ro: 'Ore liniștite', sr: 'Sati mira' },
  extra: { el: 'Επιπλέον σημειώσεις', en: 'Additional notes', de: 'Weitere Hinweise', bg: 'Допълнителни бележки', ru: 'Дополнительно', ro: 'Note suplimentare', sr: 'Dodatne napomene' },
};

const VALUES: Record<string, Record<string, Record<string, string>>> = {
  smoking: {
    allowed: { el: 'Επιτρέπεται', en: 'Allowed', de: 'Erlaubt', bg: 'Разрешено', ru: 'Разрешено', ro: 'Permis', sr: 'Dozvoljeno' },
    outside: { el: 'Μόνο σε εξωτερικό χώρο', en: 'Outside only', de: 'Nur im Freien', bg: 'Само навън', ru: 'Только на улице', ro: 'Doar afară', sr: 'Samo napolju' },
    not_allowed: { el: 'Δεν επιτρέπεται', en: 'Not allowed', de: 'Nicht erlaubt', bg: 'Не се разрешава', ru: 'Запрещено', ro: 'Nu se permite', sr: 'Nije dozvoljeno' },
  },
  pets: {
    allowed: { el: 'Επιτρέπονται', en: 'Allowed', de: 'Erlaubt', bg: 'Разрешени', ru: 'Разрешены', ro: 'Permise', sr: 'Dozvoljeni' },
    on_request: { el: 'Κατόπιν συνεννόησης', en: 'On request', de: 'Auf Anfrage', bg: 'При запитване', ru: 'По запросу', ro: 'La cerere', sr: 'Na zahtev' },
    not_allowed: { el: 'Δεν επιτρέπονται', en: 'Not allowed', de: 'Nicht erlaubt', bg: 'Не се разрешават', ru: 'Запрещены', ro: 'Nu se permit', sr: 'Nisu dozvoljeni' },
  },
  parties: {
    allowed: { el: 'Επιτρέπονται', en: 'Allowed', de: 'Erlaubt', bg: 'Разрешени', ru: 'Разрешены', ro: 'Permise', sr: 'Dozvoljene' },
    not_allowed: { el: 'Δεν επιτρέπονται', en: 'Not allowed', de: 'Nicht erlaubt', bg: 'Не се разрешават', ru: 'Запрещены', ro: 'Nu se permit', sr: 'Nisu dozvoljene' },
  },
  kids: {
    welcome: { el: 'Καλωσορίζονται', en: 'Welcome', de: 'Willkommen', bg: 'Добре дошли', ru: 'Приветствуются', ro: 'Bineveniți', sr: 'Dobrodošli' },
    on_request: { el: 'Κατόπιν συνεννόησης', en: 'On request', de: 'Auf Anfrage', bg: 'При запитване', ru: 'По запросу', ro: 'La cerere', sr: 'Na zahtev' },
    not_suitable: { el: 'Μη κατάλληλο', en: 'Not suitable', de: 'Nicht geeignet', bg: 'Неподходящо', ru: 'Не подходит', ro: 'Nepotrivit', sr: 'Nije pogodno' },
  },
};

function lbl(key: string, locale: string) {
  return LABELS[key]?.[locale] || LABELS[key]?.en || key;
}

export function HouseRules({ listing }: Props) {
  const locale = useLocale();

  const checkIn = listing.check_in_time as string | null;
  const checkOut = listing.check_out_time as string | null;
  const smoking = listing.rule_smoking as string | null;
  const pets = listing.rule_pets as string | null;
  const parties = listing.rule_parties as string | null;
  const kids = listing.rule_kids as string | null;
  const quietFrom = listing.quiet_hours_from as string | null;
  const quietTo = listing.quiet_hours_to as string | null;
  const extra = (listing.house_rules_extra?.[locale]
    || listing.house_rules_extra?.el
    || listing.house_rules_extra?.en
    || '') as string;

  const hasAny =
    checkIn || checkOut || smoking || pets || parties || kids ||
    quietFrom || quietTo || extra;

  if (!hasAny) return null;

  const rows: { icon: React.ElementType; label: string; value: string }[] = [];

  if (checkIn || checkOut) {
    rows.push({
      icon: Clock,
      label: `${lbl('checkIn', locale)} · ${lbl('checkOut', locale)}`,
      value: `${checkIn || '—'} · ${checkOut || '—'}`,
    });
  }
  if (smoking) {
    rows.push({ icon: Cigarette, label: lbl('smoking', locale), value: VALUES.smoking[smoking]?.[locale] || VALUES.smoking[smoking]?.en || smoking });
  }
  if (pets) {
    rows.push({ icon: Dog, label: lbl('pets', locale), value: VALUES.pets[pets]?.[locale] || VALUES.pets[pets]?.en || pets });
  }
  if (parties) {
    rows.push({ icon: Music, label: lbl('parties', locale), value: VALUES.parties[parties]?.[locale] || VALUES.parties[parties]?.en || parties });
  }
  if (kids) {
    rows.push({ icon: Baby, label: lbl('kids', locale), value: VALUES.kids[kids]?.[locale] || VALUES.kids[kids]?.en || kids });
  }
  if (quietFrom || quietTo) {
    rows.push({
      icon: Moon,
      label: lbl('quietHours', locale),
      value: `${quietFrom || '—'} — ${quietTo || '—'}`,
    });
  }

  return (
    <section className="mt-2">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-700">
          <ShieldCheck className="w-5 h-5" />
        </span>
        {HEADING[locale] || HEADING.en}
      </h2>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {rows.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-4">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-gray-600 shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-gray-800 flex-1 min-w-0">{r.label}</span>
                <span className="text-sm text-gray-700 tabular-nums">{r.value}</span>
              </div>
            );
          })}
          {extra && (
            <div className="flex items-start gap-3 p-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-gray-600 shrink-0">
                <Info className="w-4 h-4" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 mb-1">{lbl('extra', locale)}</div>
                <div className="text-sm text-gray-700 whitespace-pre-line">{extra}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
