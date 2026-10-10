import { getTranslations } from 'next-intl/server';
import { Waves } from 'lucide-react';
import { htmlLang, type Locale } from '@/i18n/config';

type Marine = {
  current?: { sea_surface_temperature?: number };
  daily?: { time?: string[]; sea_surface_temperature_max?: number[] };
};

async function fetchMarine(lat: number, lng: number): Promise<Marine | null> {
  const url =
    `https://marine-api.open-meteo.com/v1/marine?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}` +
    '&current=sea_surface_temperature&daily=sea_surface_temperature_max&timezone=Europe%2FAthens&forecast_days=6';
  try {
    // Shared data cache: one upstream call per spot every 3 hours.
    const res = await fetch(url, { next: { revalidate: 10800 }, signal: AbortSignal.timeout(4000) });
    return res.ok ? ((await res.json()) as Marine) : null;
  } catch {
    return null;
  }
}

/** Live water temperature, rendered on the server — no client JavaScript. */
export async function SeaTemperature({ locale, lat, lng }: { locale: Locale; lat: number; lng: number }) {
  const data = await fetchMarine(lat, lng);
  const now = data?.current?.sea_surface_temperature;
  if (now == null) return null;
  const t = await getTranslations({ locale, namespace: 'beach' });
  const days = (data?.daily?.time ?? []).slice(1, 6).map((d, i) => ({
    day: new Intl.DateTimeFormat(htmlLang[locale], { weekday: 'short' }).format(new Date(`${d}T12:00:00`)),
    temp: data?.daily?.sea_surface_temperature_max?.[i + 1],
  }));

  return (
    <section aria-label={t('seaTemp')} className="rounded-2xl border border-sea-100 bg-sea-50 p-5">
      <div className="flex items-center gap-3">
        <Waves className="size-6 text-sea-600" aria-hidden />
        <p className="text-sm font-medium text-sea-900">{t('seaTemp')}</p>
      </div>
      <p className="mt-2 text-4xl font-semibold text-sea-900">
        {Math.round(now)}°C <span className="text-sm font-normal text-sea-700">{t('seaNow')}</span>
      </p>
      {days.length > 0 && (
        <>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-sea-700">{t('seaNext')}</p>
          <ol className="mt-2 grid grid-cols-5 gap-1 text-center text-sm">
            {days.map((d) => (
              <li key={d.day} className="rounded-lg bg-white/70 py-1.5">
                <span className="block text-xs text-slate-500">{d.day}</span>
                <span className="font-semibold text-slate-800">{d.temp != null ? `${Math.round(d.temp)}°` : '–'}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      <p className="mt-3 text-xs text-sea-700/80">{t('seaSource')}</p>
    </section>
  );
}
