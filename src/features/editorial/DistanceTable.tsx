import { Car } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getVillages } from '@/lib/db/content';
import { displayName } from '@/lib/content/nearby';
import { distanceKm, hasCoords } from '@/lib/geo';

/*
 * v3's distance table for the /from/{city} pages, rebuilt. v3 multiplied the
 * straight line from the city by 1.4, which put Athens 300 km closer than the
 * road (the motorway goes round by Lamia and Larissa). Now every row starts
 * from the drive to Nea Moudania that the page text itself states, and only
 * the last, short leg inside Halkidiki is estimated. Calibrated on the
 * airport distances in /from/thessaloniki (Kallithea 77 km, Nikiti 88 km,
 * Ouranoupoli 120 km, Sarti 130 km).
 */

/** Road km and minutes to Nea Moudania, as in each page's own text (Thessaloniki: from the airport). */
const TO_NEA_MOUDANIA: Record<string, { km: number; min: number }> = {
  sofia: { km: 360, min: 285 },
  bucharest: { km: 715, min: 600 },
  belgrade: { km: 690, min: 480 },
  thessaloniki: { km: 45, min: 35 },
  istanbul: { km: 610, min: 480 },
  skopje: { km: 290, min: 240 },
  athens: { km: 560, min: 360 },
  plovdiv: { km: 490, min: 360 },
  pristina: { km: 385, min: 300 },
  sarajevo: { km: 880, min: 720 },
  tirana: { km: 450, min: 420 },
};

const GATEWAY = 'nea-moudania';
const VILLAGES = ['nea-moudania', 'kallithea', 'hanioti', 'pefkohori', 'afytos', 'nikiti', 'neos-marmaras', 'vourvourou', 'toroni', 'sarti', 'ouranoupoli'];
/** Halkidiki's roads wind: road km ≈ 1.35 × straight line, at about 54 km/h. */
const ROAD_FACTOR = 1.35;
const LOCAL_KMH = 54;

const T: Record<Locale, { title: string; airport: string; village: string; km: string; time: string; note: string; h: string; m: string }> = {
  el: { title: 'Αποστάσεις μέχρι τα χωριά της Χαλκιδικής', airport: 'Από το αεροδρόμιο της Θεσσαλονίκης', village: 'Χωριό', km: 'Απόσταση', time: 'Οδήγηση', note: 'Κατά προσέγγιση, χωρίς στάσεις και αναμονή στα σύνορα: η διαδρομή μέχρι τη Νέα Μουδανιά όπως παραπάνω, συν την εκτίμηση από εκεί μέχρι το χωριό.', h: 'ώρ.', m: 'λεπ.' },
  en: { title: 'Distances to Halkidiki villages', airport: 'From Thessaloniki airport', village: 'Village', km: 'Distance', time: 'Drive', note: 'Approximate, without stops or border waits: the drive to Nea Moudania as above, plus an estimate from there to the village.', h: 'h', m: 'min' },
  de: { title: 'Entfernungen zu den Orten in Chalkidiki', airport: 'Ab Flughafen Thessaloniki', village: 'Ort', km: 'Entfernung', time: 'Fahrzeit', note: 'Ungefähr, ohne Pausen und Wartezeit an der Grenze: die Fahrt bis Nea Moudania wie oben, plus eine Schätzung von dort bis zum Ort.', h: 'Std.', m: 'Min.' },
  ro: { title: 'Distanțe până la satele din Halkidiki', airport: 'De la aeroportul din Salonic', village: 'Sat', km: 'Distanță', time: 'Cu mașina', note: 'Aproximativ, fără opriri și fără așteptare la graniță: drumul până la Nea Moudania ca mai sus, plus o estimare de acolo până la sat.', h: 'h', m: 'min' },
  bg: { title: 'Разстояния до селата в Халкидики', airport: 'От летище Солун', village: 'Село', km: 'Разстояние', time: 'С кола', note: 'Приблизително, без почивки и чакане на границата: пътят до Неа Муданя, както е описан по-горе, плюс оценка оттам до селото.', h: 'ч', m: 'мин' },
  sr: { title: 'Udaljenosti do sela na Halkidikiju', airport: 'Od aerodroma u Solunu', village: 'Selo', km: 'Udaljenost', time: 'Vožnja', note: 'Okvirno, bez pauza i čekanja na granici: put do Nea Mudanije kao gore, plus procena odatle do sela.', h: 'h', m: 'min' },
  ru: { title: 'Расстояния до деревень Халкидики', airport: 'От аэропорта Салоников', village: 'Деревня', km: 'Расстояние', time: 'На машине', note: 'Приблизительно, без остановок и ожидания на границе: дорога до Неа-Мудании, как описано выше, плюс оценка оттуда до деревни.', h: 'ч', m: 'мин' },
};

/** Sentence for the page's meta description (long, then short), only where the table is shown. */
const META: Record<Locale, readonly [string, string]> = {
  el: ['Με πίνακα αποστάσεων μέχρι τα χωριά της Χαλκιδικής.', 'Με πίνακα αποστάσεων.'],
  en: ['With a table of distances to Halkidiki villages.', 'Plus a distance table.'],
  de: ['Mit Entfernungstabelle zu den Orten in Chalkidiki.', 'Mit Entfernungstabelle.'],
  ro: ['Cu tabel de distanțe până la satele din Halkidiki.', 'Cu tabel de distanțe.'],
  bg: ['С таблица на разстоянията до селата в Халкидики.', 'С таблица на разстоянията.'],
  sr: ['Uz tabelu udaljenosti do sela na Halkidikiju.', 'Uz tabelu udaljenosti.'],
  ru: ['С таблицей расстояний до деревень Халкидики.', 'С таблицей расстояний.'],
};

export function distanceMetaExtra(city: string, locale: Locale): readonly string[] | null {
  return TO_NEA_MOUDANIA[city] ? META[locale] : null;
}

const round = (n: number, step: number) => Math.round(n / step) * step;

export async function DistanceTable({ city, locale }: { city: string; locale: Locale }) {
  const base = TO_NEA_MOUDANIA[city];
  if (!base) return null;
  const villages = (await getVillages()).filter((v) => VILLAGES.includes(v.slug) && hasCoords(v));
  const gateway = villages.find((v) => v.slug === GATEWAY);
  if (!gateway || villages.length < 3) return null;
  const t = T[locale];
  const rows = villages
    .map((v) => {
      const local = distanceKm(gateway, v) * ROAD_FACTOR;
      return {
        slug: v.slug,
        name: displayName(v, locale, 'village'),
        km: round(base.km + local, 5),
        min: round(base.min + (local / LOCAL_KMH) * 60, 15),
      };
    })
    .sort((a, b) => a.km - b.km);
  const time = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h ? `${h} ${t.h}${m ? ` ${m} ${t.m}` : ''}` : `${m} ${t.m}`;
  };

  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
        <Car className="size-6 text-sea-600" aria-hidden />
        {t.title}
      </h2>
      {city === 'thessaloniki' && <p className="mt-1 text-sm text-slate-600">{t.airport}</p>}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-sand-50">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left font-semibold text-gray-700">{t.village}</th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">{t.km}</th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold text-gray-700">{t.time}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-gray-100">
                <td className="px-4 py-2">
                  <Link href={`/places/${r.slug}`} className="font-medium text-sea-700 hover:underline">{r.name}</Link>
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-gray-700">~{r.km} km</td>
                <td className="px-4 py-2 text-right tabular-nums text-gray-600">~{time(r.min)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-500">{t.note}</p>
    </section>
  );
}
