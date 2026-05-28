import { NextRequest, NextResponse } from 'next/server';
import { getListingBySlug, getListingsFiltered } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const listing = await getListingBySlug(slug);
    if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(listing, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const area = searchParams.get('area');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : null;

  const listings = await getListingsFiltered(area, limit);
  return NextResponse.json(listings, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
