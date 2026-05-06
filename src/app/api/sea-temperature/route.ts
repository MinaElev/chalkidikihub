import { NextRequest, NextResponse } from 'next/server';

// Open-Meteo Marine — free, no API key, generous rate limits. Cached at the
// edge for 1h so 60+ beaches × 7 locales don't hammer the upstream API.
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lon = req.nextUrl.searchParams.get('lon');
  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 });
  }

  const url =
    `https://marine-api.open-meteo.com/v1/marine` +
    `?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}` +
    `&current=sea_surface_temperature&hourly=sea_surface_temperature` +
    `&forecast_days=7&timezone=auto`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return NextResponse.json({ error: 'upstream' }, { status: 502 });
    const data = await res.json();
    return NextResponse.json(
      {
        current: data.current,
        hourly: data.hourly,
      },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
  }
}
