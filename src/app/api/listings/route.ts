import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { transformListing } from '@/lib/data';

const SELECT_FIELDS = `
  id, slug, owner_id,
  title_el, title_en, title_de, title_bg, title_ru, title_ro,
  description_el, description_en, description_de, description_bg, description_ru, description_ro,
  tagline_el, tagline_en, tagline_de, tagline_bg, tagline_ru, tagline_ro, tagline_sr,
  owner_story_el, owner_story_en, owner_story_de, owner_story_bg, owner_story_ru, owner_story_ro, owner_story_sr,
  check_in_time, check_out_time, rule_smoking, rule_pets, rule_parties, rule_kids,
  quiet_hours_from, quiet_hours_to,
  house_rules_extra_el, house_rules_extra_en, house_rules_extra_de, house_rules_extra_bg, house_rules_extra_ru, house_rules_extra_ro, house_rules_extra_sr,
  how_to_reach_el, how_to_reach_en, how_to_reach_de, how_to_reach_bg, how_to_reach_ru, how_to_reach_ro, how_to_reach_sr,
  wifi_info_el, wifi_info_en, wifi_info_de, wifi_info_bg, wifi_info_ru, wifi_info_ro, wifi_info_sr,
  parking_info_el, parking_info_en, parking_info_de, parking_info_bg, parking_info_ru, parking_info_ro, parking_info_sr,
  check_in_info_el, check_in_info_en, check_in_info_de, check_in_info_bg, check_in_info_ru, check_in_info_ro, check_in_info_sr,
  area, location_name, latitude, longitude,
  price_per_night, currency, guests_max, bedrooms, bathrooms,
  amenities, status, contact_phone, contact_email, booking_url, airbnb_url, website_url, show_calendar, created_at, updated_at,
  listing_images (id, image_url, sort_order, is_cover, caption_el, caption_en, caption_de, caption_bg, caption_ru, caption_ro, caption_sr)
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
