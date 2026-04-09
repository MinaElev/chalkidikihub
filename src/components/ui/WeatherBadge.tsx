'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  wind_speed: number;
  humidity: number;
}

interface WeatherBadgeProps {
  latitude: number;
  longitude: number;
  variant?: 'hero' | 'compact' | 'card';
}

export function WeatherBadge({ latitude, longitude, variant = 'compact' }: WeatherBadgeProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;
    fetch(`/api/weather?lat=${latitude}&lng=${longitude}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setWeather(data); })
      .catch(() => {});
  }, [latitude, longitude]);

  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`;

  if (variant === 'hero') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm">
        <img src={iconUrl} alt={weather.description} className="w-7 h-7 -my-1" />
        <span className="font-semibold">{weather.temp}°C</span>
        <span className="text-white/70 text-xs hidden sm:inline capitalize">{weather.description}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <img src={iconUrl} alt={weather.description} className="w-10 h-10" />
        <div>
          <div className="text-xl font-bold text-gray-900">{weather.temp}°C</div>
          <div className="text-xs text-gray-500 capitalize">{weather.description}</div>
        </div>
        <div className="ml-auto text-right text-xs text-gray-400">
          <div>Αίσθ. {weather.feels_like}°C</div>
          <div>Άνεμος {weather.wind_speed} m/s</div>
          <div>Υγρ. {weather.humidity}%</div>
        </div>
      </div>
    );
  }

  // compact (default)
  return (
    <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
      <img src={iconUrl} alt={weather.description} className="w-5 h-5" />
      <span className="font-medium text-gray-700">{weather.temp}°C</span>
    </span>
  );
}
