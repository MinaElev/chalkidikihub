const OWM_API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY || '';
const OWM_BASE = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  wind_speed: number;
  humidity: number;
  is_sunny: boolean;
  is_rainy: boolean;
}

export async function getWeather(lat: number, lng: number): Promise<WeatherData | null> {
  if (!OWM_API_KEY) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `${OWM_BASE}?lat=${lat}&lon=${lng}&appid=${OWM_API_KEY}&units=metric&lang=en`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    const weatherId = data.weather?.[0]?.id || 800;
    const isSunny = weatherId >= 800 && weatherId <= 802;
    const isRainy = weatherId >= 200 && weatherId < 700;

    return {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      description: data.weather?.[0]?.description || '',
      icon: data.weather?.[0]?.icon || '01d',
      wind_speed: Math.round(data.wind?.speed || 0),
      humidity: data.main?.humidity || 0,
      is_sunny: isSunny,
      is_rainy: isRainy,
    };
  } catch {
    return null;
  }
}
