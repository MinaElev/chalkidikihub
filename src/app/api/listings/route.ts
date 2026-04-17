import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { transformListing } from '@/lib/data';

const SELECT_FIELDS = `
  id, slug, owner_id,
  title_el, title_en, title_de, title_bg, title_ru, title_ro,
  description_el, description_en, description_de, description_bg, description_ru, description_ro,
  tagline_el, tagline_en, tagline_de, tagline_bg, tagline_ru, tagline_ro, tagline_sr,
  owner_story_el, owner_story_en, owner_story_de, owner_story_bg, owner_story_ru, owner_story_ro, owner_story_sr,
  area, location_name, latitude, longitude,
  price_per_night, currency, guests_max, bedrooms, bathrooms,
  amenities, status, contact_phone, contact_email, booking_url, airbnb_url, website_url, show_calendar, created_at, updated_at,
  listing_images (id, image_url, sort_order, is_cover)
`;

export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');
  const slug = searchParams.get('slug');

  // Single listing by slug
  if (slug) {
    const { data, error } = await supabase
      .from('listings')
      .select(SELECT_FIELDS)
      .eq('status', 'published')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(transformListing(data as Record<string, unknown>), {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  }

  const limit = searchParams.get('limit');

  // All published listings
  let query = supabase
    .from('listings')
    .select(SELECT_FIELDS)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (area) {
    query = query.eq('area', area);
  }
  if (limit) {
    query = query.limit(Number(limit));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json([], { status: 500 });
  }

  const listings = (data || []).map((row) => transformListing(row as Record<string, unknown>));

  return NextResponse.json(listings, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
