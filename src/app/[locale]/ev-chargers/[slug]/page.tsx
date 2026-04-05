'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MapPin, Star, Zap, Clock, Gift, Building, Loader2 } from 'lucide-react';
import { ConnectorBadge } from '@/components/listings/ConnectorBadge';
import { BeachCard } from '@/components/listings/BeachCard';
import { EvCharger, Beach } from '@/types';
import { useParams } from 'next/navigation';

export default function ChargerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();
  const t = useTranslations('evChargers');
  const tBeaches = useTranslations('beaches');

  const [charger, setCharger] = useState<EvCharger | null>(null);
  const [nearbyBeaches, setNearbyBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chargers')
      .then((r) => r.json())
      .then((data: EvCharger[]) => {
        if (Array.isArray(data)) {
          const found = data.find((c) => c.slug === slug);
          if (found) {
            setCharger(found);
            // Fetch nearby beaches
            if (found.nearby_beach_ids?.length > 0) {
              fetch('/api/beaches')
                .then((r) => r.json())
                .then((beaches: Beach[]) => {
                  if (Array.isArray(beaches)) {
                    setNearbyBeaches(beaches.filter((b) => found.nearby_beach_ids.includes(b.id)));
                  }
                })
                .catch(() => {});
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!charger) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-500">Charger not found</p>
        <Link href="/ev-chargers" className="mt-4 inline-flex text-primary-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('title')}
        </Link>
      </div>
    );
  }

  const area = AREAS.find((a) => a.slug === charger.area);
  const name = charger.name[locale] || charger.name.en;
  const description = charger.description[locale] || charger.description.en;
  const maxPower = Math.max(...charger.connectors.map((c) => c.power_kw));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/ev-chargers"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('title')}
      </Link>

      {/* Hero */}
      <div className="relative aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mb-8">
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
          <Zap className="w-24 h-24 text-green-300" />
        </div>
        {charger.free_charging && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
            <Gift className="w-5 h-5" />
            {t('freeCharging')}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-lg font-bold">{charger.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{charger.location_name}</span>
              <span className="text-gray-300">|</span>
              <Link href={`/areas/${charger.area}`} className="text-primary-600 hover:underline">
                {area?.name[locale] || ''}
              </Link>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{description}</p>

          {/* Connectors */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('connectors')}</h2>
            <div className="space-y-3">
              {charger.connectors.map((connector, idx) => (
                <ConnectorBadge key={idx} connector={connector} />
              ))}
            </div>
          </div>

          {/* Nearby beaches */}
          {nearbyBeaches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('nearbyBeaches')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyBeaches.map((beach) => (
                  <BeachCard key={beach.id} beach={beach} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('power')}</div>
                <div className="font-semibold text-gray-900">{maxPower} kW max</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('spots')}</div>
                <div className="font-semibold text-gray-900">{charger.total_spots}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('hours')}</div>
                <div className="font-semibold text-gray-900">
                  {charger.hours === '24/7' ? t('open24h') : charger.hours}
                </div>
              </div>
            </div>
            <hr />
            <div>
              <div className="text-sm text-gray-500">{t('provider')}</div>
              <div className="font-semibold text-gray-900">{charger.provider}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">{t('costPerKwh')}</div>
              <div className="font-semibold text-gray-900">
                {charger.free_charging ? (
                  <span className="text-green-600">{t('freeCharging')}</span>
                ) : (
                  `€${charger.cost_per_kwh}/kWh`
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
