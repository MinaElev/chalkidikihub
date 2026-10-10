import { Beach, BeachFeature } from '@/types';
import { WeatherData } from './weather-api';

export type CrowdLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface CrowdEstimation {
  level: CrowdLevel;
  percentage: number; // 0-100
  bestTimeToday: string;
  peakHours: string;
}

// Popularity score 1-10 based on rating and reviews
function getPopularity(beach: Beach): number {
  const ratingScore = beach.rating * 1.5; // 0-7.5
  const reviewScore = Math.min(beach.reviews_count / 2, 2.5); // 0-2.5
  return Math.min(ratingScore + reviewScore, 10);
}

// Month factor: how crowded is this month typically
function getMonthFactor(month: number): number {
  const factors: Record<number, number> = {
    1: 0.05, 2: 0.05, 3: 0.1, 4: 0.2, 5: 0.4,
    6: 0.65, 7: 0.9, 8: 1.0, 9: 0.6,
    10: 0.25, 11: 0.1, 12: 0.05,
  };
  return factors[month] || 0.1;
}

// Day factor: weekend vs weekday
function getDayFactor(dayOfWeek: number): number {
  // 0=Sun, 6=Sat
  if (dayOfWeek === 0 || dayOfWeek === 6) return 1.4;
  if (dayOfWeek === 5) return 1.2; // Friday
  return 1.0;
}

// Hour factor: time of day
function getHourFactor(hour: number): number {
  if (hour < 7 || hour > 20) return 0.05;
  if (hour < 9) return 0.2;
  if (hour < 10) return 0.4;
  if (hour < 12) return 0.8;
  if (hour < 14) return 1.0; // Peak
  if (hour < 16) return 0.9;
  if (hour < 18) return 0.7;
  if (hour < 19) return 0.5;
  return 0.2;
}

// Beach features factor
function getFeatureFactor(features: BeachFeature[]): number {
  let factor = 1.0;
  if (features.includes('organized')) factor *= 1.2;
  if (features.includes('free')) factor *= 0.8;
  if (features.includes('beachBar')) factor *= 1.15;
  if (features.includes('parking')) factor *= 1.1;
  if (features.includes('shallowWater')) factor *= 1.1; // families
  if (features.includes('nudist')) factor *= 0.5;
  return factor;
}

// Weather factor
function getWeatherFactor(weather: WeatherData | null): number {
  if (!weather) return 0.7; // Unknown - assume moderate
  if (weather.is_rainy) return 0.1;
  if (weather.temp < 20) return 0.3;
  if (weather.temp > 38) return 0.6; // Too hot
  if (weather.wind_speed > 30) return 0.3; // Windy
  if (weather.is_sunny && weather.temp >= 25 && weather.temp <= 35) return 1.0;
  if (weather.is_sunny) return 0.8;
  return 0.5; // Cloudy
}

export function estimateCrowd(
  beach: Beach,
  weather: WeatherData | null,
  now?: Date,
): CrowdEstimation {
  const date = now || new Date();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();
  const hour = date.getHours();

  const popularity = getPopularity(beach) / 10; // 0-1
  const monthF = getMonthFactor(month);
  const dayF = getDayFactor(dayOfWeek);
  const hourF = getHourFactor(hour);
  const featureF = getFeatureFactor(beach.features);
  const weatherF = getWeatherFactor(weather);

  // Combined score 0-1
  const rawScore = popularity * monthF * dayF * hourF * featureF * weatherF;
  const percentage = Math.min(Math.round(rawScore * 100), 100);

  let level: CrowdLevel;
  if (percentage < 25) level = 'low';
  else if (percentage < 50) level = 'moderate';
  else if (percentage < 75) level = 'high';
  else level = 'very_high';

  // Best time suggestion
  let bestTimeToday: string;
  if (month >= 6 && month <= 9) {
    bestTimeToday = hour < 10 ? '07:00 - 10:00' : '17:00 - 19:30';
  } else {
    bestTimeToday = '10:00 - 16:00';
  }

  const peakHours = month >= 6 && month <= 9 ? '11:00 - 15:00' : '12:00 - 14:00';

  return { level, percentage, bestTimeToday, peakHours };
}
