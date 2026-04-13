import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function transform(row: Record<string, unknown>) {
  return {
    id: row.id,
    slug: row.slug,
    owner_id: row.owner_id,
    title: {
      el: row.title_el || '', en: row.title_en || '', de: row.title_de || '',
      bg: row.title_bg || '', ru: row.title_ru || '', ro: row.title_ro || '',
    },
    description: {
      el: row.description_el || '', en: row.description_en || '', de: row.description_de || '',
      bg: row.description_bg || '', ru: row.description_ru || '', ro: row.description_ro || '',
    },
    area: row.area,
    location_name: row.location_name,
    latitude: row.latitude || 0,
    longitude: row.longitude || 0,
    price_per_night: Number(row.price_per_night),
    currency: row.currency || 'EUR',
    guests_max: row.guests_max,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    amenities: row.amenities || [],
    status: row.status,
    contact_phone: row.contact_phone || null,
    contact_email: row.contact_email || null,
    booking_url: row.booking_url || null,
    airbnb_url: row.airbnb_url || null,
    website_url: row.website_url || null,
    images: (row.listing_images as Array<Record<string, unknown>> || []).map((img) => ({
      id: img.id,
      listing_id: row.id,
      image_url: img.image_url,
      sort_order: img.sort_order,
      is_cover: img.is_cover,
    })),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

const SELECT_FIELDS = `
  id, slug, owner_id,
  title_el, title_en, title_de, title_bg, title_ru, title_ro,
  description_el, description_en, description_de, description_bg, description_ru, description_ro,
  area, location_name, latitude, longitude,
  price_per_night, currency, guests_max, bedrooms, bathrooms,
  amenities, status, contact_phone, contact_email, booking_url, airbnb_url, website_url, created_at, updated_at,
  listing_images (id, image_url, sort_order, is_cover)
`;

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseKey);
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
    return NextResponse.json(transform(data as Record<string, unknown>), {
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

  const listings = (data || []).map((row) => transform(row as Record<string, unknown>));

  return NextResponse.json(listings, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
