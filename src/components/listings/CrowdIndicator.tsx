'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CrowdLevel, CrowdEstimation } from '@/lib/crowd-estimation';
import { WeatherData } from '@/lib/weather-api';
import { Users, Clock, Sun, CloudRain, Cloud, Wind, Thermometer } from 'lucide-react';

const crowdConfig: Record<CrowdLevel, { color: string; bg: string; dot: string }> = {
  low: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
  moderate: { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  high: { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  very_high: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
};

interface BeachCrowdData {
  crowd: CrowdEstimation;
  weather: WeatherData | null;
}

export function CrowdIndicator({ beachSlug, compact = false }: { beachSlug: string; compact?: boolean }) {
  const t = useTranslations('crowd');
  const [data, setData] = useState<BeachCrowdData | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/beach-crowd?id=${beachSlug}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => { if (d.crowd) setData(d); })
      .catch(() => {});
    return () => controller.abort();
  }, [beachSlug]);

  if (!data) {
    // Fallback: show estimation without weather
    return null;
  }

  const { crowd, weather } = data;
  const config = crowdConfig[crowd.level];

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.bg} ${config.color}`}>
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        {t(crowd.level)}
        {weather && <span className="text-gray-500">| {weather.temp}°C</span>}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${config.bg}`}>
      {/* Crowd level */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${config.dot} animate-pulse`} />
          <span className={`font-semibold ${config.color}`}>{t(crowd.level)}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{crowd.percentage}%</span>
        </div>
      </div>

      {/* Crowd bar */}
      <div className="w-full h-2 bg-white rounded-full mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.dot}`}
          style={{ width: `${crowd.percentage}%` }}
        />
      </div>

      {/* Time suggestions */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-green-600" />
          <div>
            <div className="text-xs text-gray-500">{t('bestTime')}</div>
            <div className="font-medium text-gray-700">{crowd.bestTimeToday}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-red-500" />
          <div>
            <div className="text-xs text-gray-500">{t('peakHours')}</div>
            <div className="font-medium text-gray-700">{crowd.peakHours}</div>
          </div>
        </div>
      </div>

      {/* Weather */}
      {weather && (
        <>
          <hr className="my-3 border-white/50" />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {weather.is_sunny ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : weather.is_rainy ? (
                <CloudRain className="w-5 h-5 text-blue-500" />
              ) : (
                <Cloud className="w-5 h-5 text-gray-400" />
              )}
              <span className="capitalize text-gray-700">{weather.description}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" />
                <span className="font-medium">{weather.temp}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                <span>{weather.wind_speed} km/h</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Mini version for beach cards
export function CrowdBadge({ beachSlug }: { beachSlug: string }) {
  return <CrowdIndicator beachSlug={beachSlug} compact />;
}
