import { Car } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { estimateRoadKm, estimateDriveTime, formatDriveTime } from '@/lib/driving-distances';

type Locale = 'el' | 'en' | 'de' | 'bg' | 'ru' | 'ro' | 'sr';

const T: Record<Locale, {
  title: (city: string) => string;
  subtitle: string;
  destination: string;
  km: string;
  time: string;
  disclaimer: string;
}> = {
  el: {
    title: (c) => `Αποστάσεις από ${c} σε χωριά της Χαλκιδικής`,
    subtitle: 'Εκτιμήσεις οδικής απόστασης και χρόνου οδήγησης. Πατήστε σε χωριό για περισσότερα.',
    destination: 'Προορισμός',
    km: 'Απόσταση',
    time: 'Χρόνος',
    disclaimer: 'Εκτιμήσεις βάσει συντεταγμένων + μέσης ταχύτητας. Ο πραγματικός χρόνος εξαρτάται από κίνηση, σύνορα και διαδρομή.',
  },
  en: {
    title: (c) => `Distances from ${c} to Halkidiki villages`,
    subtitle: 'Approximate road distances and drive times. Tap a village for more.',
    destination: 'Destination',
    km: 'Distance',
    time: 'Time',
    disclaimer: 'Estimates based on great-circle distance × road factor and average speed. Actual time depends on traffic, border crossings and chosen route.',
  },
  de: {
    title: (c) => `Entfernungen von ${c} zu Dörfern in Chalkidiki`,
    subtitle: 'Ungefähre Strecken und Fahrzeiten. Tippen Sie auf ein Dorf für mehr.',
    destination: 'Ziel',
    km: 'Entfernung',
    time: 'Fahrzeit',
    disclaimer: 'Schätzungen basierend auf Luftlinie × Straßenfaktor und Durchschnittsgeschwindigkeit. Tatsächliche Zeit variiert je nach Verkehr, Grenze und Route.',
  },
  bg: {
    title: (c) => `Разстояния от ${c} до селата в Халкидики`,
    subtitle: 'Приблизителни разстояния и време за пътуване. Натиснете село за повече.',
    destination: 'Дестинация',
    km: 'Разстояние',
    time: 'Време',
    disclaimer: 'Приблизителни стойности въз основа на координати и средна скорост. Реалното време зависи от трафика, границата и маршрута.',
  },
  ru: {
    title: (c) => `Расстояния из ${c} до деревень Халкидики`,
    subtitle: 'Приблизительные расстояния и время в пути. Нажмите на деревню для подробностей.',
    destination: 'Назначение',
    km: 'Расстояние',
    time: 'Время',
    disclaimer: 'Оценки по координатам и средней скорости. Фактическое время зависит от трафика, границы и маршрута.',
  },
  ro: {
    title: (c) => `Distanțe de la ${c} la satele din Halkidiki`,
    subtitle: 'Distanțe și timpi aproximativi. Apăsați un sat pentru detalii.',
    destination: 'Destinație',
    km: 'Distanță',
    time: 'Timp',
    disclaimer: 'Estimări pe baza coordonatelor și a vitezei medii. Timpul real depinde de trafic, vamă și rută.',
  },
  sr: {
    title: (c) => `Удаљености од ${c} до села Халкидикија`,
    subtitle: 'Оквирне удаљености и времена путовања. Кликните на село за више.',
    destination: 'Дестинација',
    km: 'Удаљеност',
    time: 'Време',
    disclaimer: 'Процене засноване на координатама и просечној брзини. Стварно време зависи од саобраћаја, граничних прелаза и руте.',
  },
};

export function DistanceTable({
  cityName,
  cityCoords,
  villages,
  locale,
}: {
  cityName: string;
  cityCoords: { lat: number; lon: number };
  villages: Array<{ slug: string; name: string; lat: number; lon: number }>;
  locale: string;
}) {
  if (villages.length === 0) return null;

  const t = T[(locale as Locale)] || T.en;

  const rows = villages
    .map((v) => {
      const km = estimateRoadKm(cityCoords.lat, cityCoords.lon, v.lat, v.lon);
      return { ...v, km, time: estimateDriveTime(km) };
    })
    .sort((a, b) => a.km - b.km);

  return (
    <section className="my-10 not-prose">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Car className="w-6 h-6 text-primary-600" />
        {t.title(cityName)}
      </h2>
      <p className="text-sm text-gray-600 mb-4">{t.subtitle}</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-gray-700">{t.destination}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">{t.km}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-gray-700">{t.time}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-gray-100 hover:bg-gray-50/60">
                <td className="px-4 py-2">
                  <Link href={`/places/${r.slug}`} className="text-primary-700 hover:underline font-medium">
                    {r.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-gray-700">{r.km} km</td>
                <td className="px-4 py-2 text-right tabular-nums text-gray-500">
                  {formatDriveTime(r.time, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">{t.disclaimer}</p>
    </section>
  );
}
