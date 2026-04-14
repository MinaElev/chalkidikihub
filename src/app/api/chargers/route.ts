import { NextRequest, NextResponse } from 'next/server';
import { getChargers } from '@/lib/get-chargers';
import { Area } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area') as Area | null;
  const slug = searchParams.get('slug');

  const chargers = await getChargers(area || undefined);

  if (slug) {
    const charger = chargers.find((c) => c.slug === slug);
    if (!charger) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(charger, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  }

  return NextResponse.json(chargers, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
