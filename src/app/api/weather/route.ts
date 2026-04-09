import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');

  if (!lat || !lng) {
    return NextResponse.json(null, { status: 400 });
  }

  const weather = await getWeather(lat, lng);
  return NextResponse.json(weather, {
    headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' },
  });
}
