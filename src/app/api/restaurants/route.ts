import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantBySlug, getRestaurantsFiltered, toRestaurantCard } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const restaurant = await getRestaurantBySlug(slug);
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(restaurant, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const area = searchParams.get('area');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : null;

  let restaurants = await getRestaurantsFiltered(area, limit);
  // ?fields=card → card-grid consumers skip descriptions/review bodies.
  if (searchParams.get('fields') === 'card') restaurants = restaurants.map(toRestaurantCard);
  return NextResponse.json(restaurants, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
