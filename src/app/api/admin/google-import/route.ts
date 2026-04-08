import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function getGoogleKey(): Promise<string> {
  const supabase = getAdminClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'google_places_api_key').single();
  return data?.value || process.env.GOOGLE_PLACES_API_KEY || '';
}

// Search nearby places
export async function GET(request: NextRequest) {
  try {
    const apiKey = await getGoogleKey();
    if (!apiKey) return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '40.15';
    const lng = searchParams.get('lng') || '23.6';
    const type = searchParams.get('type') || 'restaurant';
    const radius = searchParams.get('radius') || '10000';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json({ error: `Google API: ${data.status} - ${data.error_message || ''}` }, { status: 500 });
    }

    const places = (data.results || []).map((p: any) => ({
      place_id: p.place_id,
      name: p.name,
      latitude: p.geometry?.location?.lat,
      longitude: p.geometry?.location?.lng,
      address: p.vicinity || '',
      rating: p.rating || 0,
      reviews_count: p.user_ratings_total || 0,
      types: p.types || [],
      photo_ref: p.photos?.[0]?.photo_reference || null,
      open_now: p.opening_hours?.open_now,
      price_level: p.price_level,
    }));

    return NextResponse.json(places);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// Import a specific place
export async function POST(request: NextRequest) {
  try {
    const apiKey = await getGoogleKey();
    if (!apiKey) return NextResponse.json({ error: 'Google API key not configured' }, { status: 500 });

    const { place_id, area_override } = await request.json();
    if (!place_id) return NextResponse.json({ error: 'Missing place_id' }, { status: 400 });

    // Get place details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_phone_number,opening_hours,geometry,rating,user_ratings_total,types,website,photos,vicinity,address_components&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    if (detailsData.status !== 'OK') {
      return NextResponse.json({ error: `Details error: ${detailsData.status}` }, { status: 500 });
    }

    const place = detailsData.result;
    const lat = place.geometry?.location?.lat;
    const lng = place.geometry?.location?.lng;

    // Determine area — use override if provided, otherwise auto-detect from GPS
    let area = area_override || 'mainland';
    if (!area_override) {
      if (lat < 40.05 && lng < 23.65) area = 'kassandra';
      else if (lat < 40.05 && lng >= 23.65) area = 'sithonia';
      else if (lat >= 40.05 && lat < 40.25 && lng >= 23.65 && lng < 23.9) area = 'sithonia';
      else if (lng > 23.85) area = 'athos';
      else if (lat < 40.15 && lng < 23.65) area = 'kassandra';
    }

    // Determine cuisine type from Google types
    const googleTypes = place.types || [];
    let cuisine = 'traditional';
    if (googleTypes.includes('bar')) cuisine = 'bar';
    else if (googleTypes.includes('cafe')) cuisine = 'cafe';
    else if (googleTypes.includes('bakery')) cuisine = 'bakery';
    else if (googleTypes.includes('night_club')) cuisine = 'cocktailBar';

    // Price level mapping
    const priceLevels = ['budget', 'budget', 'moderate', 'upscale', 'fineDining'];
    const priceLevel = priceLevels[place.price_level || 1] || 'moderate';

    // Generate slug
    const slug = place.name.toLowerCase()
      .replace(/[^a-zα-ωά-ώ0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

    // Download photo if available
    let imageUrl = '';
    const photoRef = place.photos?.[0]?.photo_reference;
    if (photoRef) {
      try {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=${apiKey}`;
        const photoRes = await fetch(photoUrl);
        if (photoRes.ok) {
          const photoBlob = await photoRes.blob();
          const supabase = getAdminClient();
          const path = `restaurants/${slug}-${Date.now()}.jpg`;
          const { error: upErr } = await supabase.storage.from('content-images').upload(path, photoBlob, { contentType: 'image/jpeg', upsert: true });
          if (!upErr) {
            const { data: { publicUrl } } = supabase.storage.from('content-images').getPublicUrl(path);
            imageUrl = publicUrl;
          }
        }
      } catch {}
    }

    // Format opening hours
    const hours = place.opening_hours?.weekday_text?.join(', ')?.slice(0, 100) || '';

    // Check duplicate
    const supabase = getAdminClient();
    const { data: existing } = await supabase.from('restaurants').select('id').eq('slug', slug).single();
    if (existing) {
      return NextResponse.json({ error: 'Already exists', slug }, { status: 409 });
    }

    // Insert into DB
    const { error: insertErr } = await supabase.from('restaurants').insert({
      slug,
      name_el: place.name,
      name_en: place.name,
      description_el: '',
      description_en: '',
      area,
      location_name: place.vicinity || '',
      latitude: lat,
      longitude: lng,
      image_url: imageUrl,
      cuisine: [cuisine],
      price_level: priceLevel,
      rating: place.rating || 0,
      reviews_count: place.user_ratings_total || 0,
      phone: place.formatted_phone_number || '',
      hours,
      has_sea_view: false,
      has_live_music: false,
      accepts_reservations: false,
      tags: [],
    });

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

    // Log
    await supabase.from('activity_logs').insert({
      type: 'admin_action', severity: 'info',
      message: `Google Import: ${place.name}`,
      details: { place_id, slug, area, rating: place.rating, imageUrl: !!imageUrl },
    });

    return NextResponse.json({ success: true, slug, name: place.name, imageUrl: !!imageUrl });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
