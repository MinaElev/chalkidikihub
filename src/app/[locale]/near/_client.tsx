'use client';

import { useEffect, useState, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { Waves, UtensilsCrossed, Compass, MapPin, Loader2, Navigation, Building2, ExternalLink, AlertCircle, Wind, Droplets } from 'lucide-react';

interface NearbyEntity {
  id: string;
  type: 'beach' | 'restaurant' | 'activity' | 'village' | 'listing';
  slug: string;
  name: Record<string, string>;
  distance_km: number;
  latitude: number;
  longitude: number;
  image_url?: string;
}

interface NearbyResponse {
  beaches: NearbyEntity[];
  restaurants: NearbyEntity[];
  activities: NearbyEntity[];
  villages: NearbyEntity[];
  listings: NearbyEntity[];
}

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  wind_speed: number;
  humidity: number;
}

type Status = 'idle' | 'requesting' | 'loading' | 'ready' | 'denied' | 'error';

type Strings = {
  title: string; subtitle: string; cta: string; requesting: string; loading: string;
  denied: string; deniedRetry: string; error: string; beaches: string; restaurants: string;
  activities: string; listings: string; km: string; openMaps: string; moreDetails: string;
  noResults: string; locationFound: string; refresh: string;
  weatherNow: string; feelsLike: string; wind: string; humidity: string;
};

const STRINGS: Record<'el' | 'en', Strings> = {
  el: {
    title: 'Κοντά σου τώρα',
    subtitle: 'Πάτα το κουμπί παρακάτω για να σου δείξουμε ό,τι βρίσκεται κοντά στην τοποθεσία σου',
    cta: 'Βρες τα πιο κοντινά',
    requesting: 'Παρακαλώ επίτρεψε την πρόσβαση στην τοποθεσία στο popup του browser…',
    loading: 'Φορτώνω αποτελέσματα…',
    denied: 'Δεν έδωσες άδεια για την τοποθεσία. Χωρίς αυτή δεν μπορούμε να εμφανίσουμε κοντινά αποτελέσματα.',
    deniedRetry: 'Δοκίμασε ξανά',
    error: 'Κάτι πήγε στραβά. Δοκίμασε ξανά σε λίγο.',
    beaches: 'Παραλίες',
    restaurants: 'Εστιατόρια',
    activities: 'Δραστηριότητες',
    listings: 'Καταλύματα',
    km: 'χλμ',
    openMaps: 'Άνοιξε στον χάρτη',
    moreDetails: 'Δες περισσότερα',
    noResults: 'Δεν βρέθηκαν αποτελέσματα σε ακτίνα 30km. Δοκίμασε να μετακινηθείς πιο κοντά στη Χαλκιδική.',
    locationFound: 'Η τοποθεσία σου εντοπίστηκε',
    refresh: 'Ανανέωση',
    weatherNow: 'Καιρός τώρα',
    feelsLike: 'Αίσθηση',
    wind: 'Άνεμος',
    humidity: 'Υγρασία',
  },
  en: {
    title: 'Near you now',
    subtitle: 'Tap the button below and we’ll show you everything close to your current location',
    cta: 'Find what’s nearest',
    requesting: 'Please allow location access in the browser popup…',
    loading: 'Loading results…',
    denied: 'Location access was denied. Without it we can’t show nearby results.',
    deniedRetry: 'Try again',
    error: 'Something went wrong. Try again in a moment.',
    beaches: 'Beaches',
    restaurants: 'Restaurants',
    activities: 'Activities',
    listings: 'Stays',
    km: 'km',
    openMaps: 'Open in Maps',
    moreDetails: 'View details',
    noResults: 'No results within 30 km. Try moving closer to Halkidiki.',
    locationFound: 'Location found',
    refresh: 'Refresh',
    weatherNow: 'Weather now',
    feelsLike: 'Feels like',
    wind: 'Wind',
    humidity: 'Humidity',
  },
};

function pickName(map: Record<string, string>, locale: string): string {
  return map[locale] || map.en || map.el || Object.values(map)[0] || '';
}

function mapsHref(lat: number, lng: number, label: string): string {
  // Google Maps URL works on iOS/Android/desktop.
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`;
}

function detailHref(e: NearbyEntity): string {
  const route = e.type === 'beach' ? 'beaches'
    : e.type === 'restaurant' ? 'restaurants'
    : e.type === 'activity' ? 'activities'
    : e.type === 'listing' ? 'listings'
    : 'places';
  return `/${route}/${e.slug}`;
}

export function NearClient({ locale }: { locale: string }) {
  const t = STRINGS[locale as 'el' | 'en'] || STRINGS.en;
  const [status, setStatus] = useState<Status>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [data, setData] = useState<NearbyResponse | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setErrorMsg(t.error);
      return;
    }
    setStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setStatus('loading');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setStatus('denied');
        else { setStatus('error'); setErrorMsg(err.message); }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }, [t.error]);

  useEffect(() => {
    if (!coords) return;
    let active = true;
    // Parallel fire-and-forget: weather is cosmetic, nearby is the page's job.
    // We don't gate readiness on weather so a slow OWM call never blocks the
    // main content.
    fetch(`/api/nearby?lat=${coords.lat}&lng=${coords.lng}`)
      .then((r) => r.json())
      .then((d: NearbyResponse) => {
        if (!active) return;
        setData(d);
        setStatus('ready');
      })
      .catch(() => { if (active) { setStatus('error'); setErrorMsg(t.error); } });
    fetch(`/api/weather?lat=${coords.lat}&lng=${coords.lng}`)
      .then((r) => r.ok ? r.json() : null)
      .then((w: WeatherData | null) => { if (active && w) setWeather(w); })
      .catch(() => {});
    return () => { active = false; };
  }, [coords, t.error]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Navigation className="w-6 h-6 text-primary-600" />
        {t.title}
      </h1>

      {status === 'idle' && (
        <div className="mt-6 p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-100">
          <p className="text-gray-700 mb-4">{t.subtitle}</p>
          <button
            onClick={requestLocation}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm transition-colors"
          >
            <MapPin className="w-5 h-5" />
            {t.cta}
          </button>
        </div>
      )}

      {(status === 'requesting' || status === 'loading') && (
        <div className="mt-6 p-6 bg-white border border-gray-200 rounded-2xl flex items-center gap-3 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
          <span>{status === 'requesting' ? t.requesting : t.loading}</span>
        </div>
      )}

      {status === 'denied' && (
        <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-gray-800">{t.denied}</p>
              <button onClick={requestLocation} className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium">
                <MapPin className="w-4 h-4" />
                {t.deniedRetry}
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-gray-800">{errorMsg || t.error}</p>
          </div>
        </div>
      )}

      {status === 'ready' && data && coords && (
        <>
          <div className="mt-4 mb-6 flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              {t.locationFound}: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </div>
            <button onClick={requestLocation} className="text-sm text-primary-600 hover:underline">{t.refresh}</button>
          </div>

          {weather && (
            <div className="mb-6 p-4 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 rounded-2xl">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} className="w-16 h-16 -my-2" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-sky-700 uppercase tracking-wider">{t.weatherNow}</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-gray-900">{weather.temp}°C</span>
                    <span className="text-sm text-gray-600 capitalize">{weather.description}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                    <span>{t.feelsLike} {weather.feels_like}°C</span>
                    <span className="inline-flex items-center gap-1"><Wind className="w-3 h-3" /> {weather.wind_speed} m/s</span>
                    <span className="inline-flex items-center gap-1"><Droplets className="w-3 h-3" /> {weather.humidity}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Section title={t.beaches} icon={<Waves className="w-5 h-5 text-cyan-600" />} items={data.beaches} locale={locale} t={t} />
          <Section title={t.restaurants} icon={<UtensilsCrossed className="w-5 h-5 text-orange-600" />} items={data.restaurants} locale={locale} t={t} />
          <Section title={t.activities} icon={<Compass className="w-5 h-5 text-emerald-600" />} items={data.activities} locale={locale} t={t} />
          <Section title={t.listings} icon={<Building2 className="w-5 h-5 text-violet-600" />} items={data.listings} locale={locale} t={t} />

          {data.beaches.length + data.restaurants.length + data.activities.length + data.listings.length === 0 && (
            <div className="text-center py-12 text-gray-500">{t.noResults}</div>
          )}
        </>
      )}
    </div>
  );
}

function Section({
  title, icon, items, locale, t,
}: {
  title: string;
  icon: React.ReactNode;
  items: NearbyEntity[];
  locale: string;
  t: Strings;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        {icon}
        {title}
        <span className="text-sm font-normal text-gray-400">({items.length})</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const name = pickName(item.name, locale);
          return (
            <div key={`${item.type}-${item.id}`} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={name} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">—</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={detailHref(item)} className="block">
                  <div className="font-medium text-gray-900 truncate text-sm">{name}</div>
                </Link>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.distance_km} {t.km}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Link href={detailHref(item)} className="text-primary-700 hover:underline font-medium">
                    {t.moreDetails}
                  </Link>
                  <a
                    href={mapsHref(item.latitude, item.longitude, name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                    {t.openMaps} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
