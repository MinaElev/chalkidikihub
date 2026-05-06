'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Thermometer } from 'lucide-react';
import { HALKIDIKI_MONTHLY_AVG_C, type SeaTempResponse } from '@/lib/sea-temperature';

type Locale = 'el' | 'en' | 'de' | 'bg' | 'ru' | 'ro' | 'sr';

const T: Record<Locale, {
  title: string;
  current: string;
  forecast: string;
  monthly: string;
  loading: string;
  source: string;
  months: string[];
  weekdays: (date: Date) => string;
}> = {
  el: {
    title: 'Θερμοκρασία θάλασσας',
    current: 'Τώρα',
    forecast: 'Πρόβλεψη 7 ημερών',
    monthly: 'Μέσος όρος ανά μήνα',
    loading: 'Φόρτωση…',
    source: 'Πηγή: Open-Meteo Marine',
    months: ['Ιαν','Φεβ','Μαρ','Απρ','Μάι','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ'],
    weekdays: (d) => ['Κυρ','Δευ','Τρι','Τετ','Πεμ','Παρ','Σαβ'][d.getDay()],
  },
  en: {
    title: 'Sea temperature',
    current: 'Now',
    forecast: '7-day forecast',
    monthly: 'Monthly average',
    loading: 'Loading…',
    source: 'Source: Open-Meteo Marine',
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    weekdays: (d) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],
  },
  de: {
    title: 'Meerestemperatur',
    current: 'Jetzt',
    forecast: '7-Tage-Vorhersage',
    monthly: 'Monatlicher Durchschnitt',
    loading: 'Lädt…',
    source: 'Quelle: Open-Meteo Marine',
    months: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
    weekdays: (d) => ['So','Mo','Di','Mi','Do','Fr','Sa'][d.getDay()],
  },
  bg: {
    title: 'Температура на морето',
    current: 'Сега',
    forecast: '7-дневна прогноза',
    monthly: 'Средно за месеца',
    loading: 'Зареждане…',
    source: 'Източник: Open-Meteo Marine',
    months: ['Ян','Фев','Мар','Апр','Май','Юни','Юли','Авг','Сеп','Окт','Ное','Дек'],
    weekdays: (d) => ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()],
  },
  ru: {
    title: 'Температура моря',
    current: 'Сейчас',
    forecast: 'Прогноз на 7 дней',
    monthly: 'Среднее за месяц',
    loading: 'Загрузка…',
    source: 'Источник: Open-Meteo Marine',
    months: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    weekdays: (d) => ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()],
  },
  ro: {
    title: 'Temperatura mării',
    current: 'Acum',
    forecast: 'Prognoză 7 zile',
    monthly: 'Media lunară',
    loading: 'Se încarcă…',
    source: 'Sursă: Open-Meteo Marine',
    months: ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Noi','Dec'],
    weekdays: (d) => ['Du','Lu','Ma','Mi','Jo','Vi','Sâ'][d.getDay()],
  },
  sr: {
    title: 'Temperatura mora',
    current: 'Sada',
    forecast: 'Prognoza za 7 dana',
    monthly: 'Mesečni prosek',
    loading: 'Učitavanje…',
    source: 'Izvor: Open-Meteo Marine',
    months: ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Avg','Sep','Okt','Nov','Dec'],
    weekdays: (d) => ['Ne','Po','Ut','Sr','Če','Pe','Su'][d.getDay()],
  },
};

export function SeaTemperatureCard({ lat, lon }: { lat: number; lon: number }) {
  const locale = useLocale() as Locale;
  const t = T[locale] || T.en;

  const [current, setCurrent] = useState<number | null>(null);
  const [forecast, setForecast] = useState<{ date: string; temp: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!lat || !lon) { setLoading(false); setError(true); return; }
    let cancelled = false;
    fetch(`/api/sea-temperature?lat=${lat}&lon=${lon}`)
      .then((r) => r.json() as Promise<SeaTempResponse & { error?: string }>)
      .then((data) => {
        if (cancelled) return;
        if (data.error) { setError(true); return; }
        if (data.current?.sea_surface_temperature != null) {
          setCurrent(data.current.sea_surface_temperature);
        }
        if (data.hourly?.time && data.hourly?.sea_surface_temperature) {
          const byDay = new Map<string, number[]>();
          for (let i = 0; i < data.hourly.time.length; i++) {
            const day = data.hourly.time[i].slice(0, 10);
            const arr = byDay.get(day) || [];
            arr.push(data.hourly.sea_surface_temperature[i]);
            byDay.set(day, arr);
          }
          const days = Array.from(byDay.entries())
            .slice(0, 7)
            .map(([date, temps]) => ({ date, temp: temps.reduce((a, b) => a + b, 0) / temps.length }));
          setForecast(days);
        }
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [lat, lon]);

  if (error || (!loading && current == null && forecast.length === 0)) return null;

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-5 my-6">
      <div className="flex items-center gap-2 mb-3">
        <Thermometer className="w-5 h-5 text-cyan-600" />
        <h3 className="font-bold text-gray-900">{t.title}</h3>
      </div>

      <div className="flex items-baseline gap-3 mb-5">
        <div className="text-5xl font-bold text-cyan-700 tabular-nums">
          {loading ? '–' : current != null ? `${current.toFixed(1)}°` : '–'}
        </div>
        <div className="text-sm text-gray-500">{t.current}</div>
      </div>

      {forecast.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-semibold text-gray-700 mb-2">{t.forecast}</div>
          <div className="grid grid-cols-7 gap-1">
            {forecast.map((f) => {
              const d = new Date(f.date);
              return (
                <div key={f.date} className="text-center rounded-lg bg-white/70 py-1.5">
                  <div className="text-sm font-semibold text-cyan-700 tabular-nums">{f.temp.toFixed(0)}°</div>
                  <div className="text-[10px] text-gray-500 uppercase">{t.weekdays(d)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-semibold text-gray-700 mb-2">{t.monthly}</div>
        <div className="grid grid-cols-12 gap-0.5 text-center">
          {Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const temp = HALKIDIKI_MONTHLY_AVG_C[month];
            const intensity = Math.min(1, Math.max(0, (temp - 13) / 13));
            const isCurrent = month === currentMonth;
            return (
              <div
                key={month}
                className={`rounded p-1 ${isCurrent ? 'ring-2 ring-cyan-500' : ''}`}
                style={{ background: `rgba(8, 145, 178, ${0.1 + intensity * 0.35})` }}
              >
                <div className="text-[11px] font-bold text-cyan-900 tabular-nums">{temp.toFixed(0)}°</div>
                <div className="text-[9px] text-cyan-800/70">{t.months[i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mt-3 text-right">{t.source}</p>
    </div>
  );
}
