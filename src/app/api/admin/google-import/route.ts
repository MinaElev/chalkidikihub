import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

export const maxDuration = 60;

async function getGoogleKey(): Promise<string> {
  const supabase = createAdminClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'google_places_api_key').single();
  return data?.value || process.env.GOOGLE_PLACES_API_KEY || '';
}

// Search nearby places
export async function GET(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

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
      photo_refs: (p.photos || []).slice(0, 5).map((ph: any) => ph.photo_reference),
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
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const apiKey = await getGoogleKey();
    if (!apiKey) return NextResponse.json({ error: 'Google API key not configured' }, { status: 500 });

    const { place_id, area_override, photo_index, generate_description, import_to } = await request.json();
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

    // Download photo — use selected index or first
    let imageUrl = '';
    const photoRef = place.photos?.[photo_index || 0]?.photo_reference;
    if (photoRef) {
      try {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=${apiKey}`;
        const photoRes = await fetch(photoUrl);
        if (photoRes.ok) {
          const photoBlob = await photoRes.blob();
          const supabase = createAdminClient();
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
    const supabase = createAdminClient();
    const targetTable = import_to === 'activities' ? 'activities' : 'restaurants';
    const { data: existing } = await supabase.from(targetTable).select('id').eq('slug', slug).single();
    if (existing) {
      return NextResponse.json({ error: 'Already exists', slug }, { status: 409 });
    }

    // Determine activity category from Google types
    const categoryMap: Record<string, string> = {
      museum: 'historical', church: 'religious', park: 'nature',
      spa: 'wellness', amusement_park: 'family', tourist_attraction: 'nature',
      night_club: 'nightlife',
    };
    const activityCategory = googleTypes.find((t: string) => categoryMap[t]) ? categoryMap[googleTypes.find((t: string) => categoryMap[t])!] : 'nature';

    // Insert into DB
    let insertErr;
    if (import_to === 'activities') {
      const { error } = await supabase.from('activities').insert({
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
        category: activityCategory,
        price_range: '',
        duration: '',
        rating: place.rating || 0,
        reviews_count: place.user_ratings_total || 0,
        tags: [],
      });
      insertErr = error;
    } else {
      const { error } = await supabase.from('restaurants').insert({
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
      insertErr = error;
    }

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

    // AI description generation
    if (generate_description) {
      try {
        const openaiKey = await (async () => {
          const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
          return data?.value || '';
        })();
        if (openaiKey) {
          const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: import_to === 'activities'
                ? `Γράψε μια ελκυστική περιγραφή στα Ελληνικά (100-150 λέξεις) για το αξιοθέατο/δραστηριότητα "${place.name}" στη ${place.vicinity || 'Χαλκιδική'}. Κατηγορία: ${activityCategory}. Rating: ${place.rating || 'N/A'}. Περίγραψε τι μπορεί να δει/κάνει ο επισκέπτης, ιστορία, ατμόσφαιρα. Μην βάλεις τίτλο.`
                : `Γράψε μια ελκυστική περιγραφή στα Ελληνικά (100-150 λέξεις) για το "${place.name}" στη ${place.vicinity || 'Χαλκιδική'}. Τύπος: ${cuisine}. Rating: ${place.rating || 'N/A'}. Η περιγραφή πρέπει να είναι ελκυστική για τουρίστες, να αναφέρει τον τύπο κουζίνας/ποτών, την τοποθεσία και την ατμόσφαιρα. Μην βάλεις τίτλο.`
              }],
              max_tokens: 500,
              temperature: 0.7,
            }),
          });
          if (aiRes.ok) {
            const aiData = await aiRes.json();
            const descEl = aiData.choices?.[0]?.message?.content?.trim() || '';
            if (descEl) {
              await supabase.from(targetTable).update({ description_el: descEl }).eq('slug', slug);
            }
          }
        }
      } catch {}
    }

    // Log
    await supabase.from('activity_logs').insert({
      type: 'admin_action', severity: 'info',
      message: `Google Import: ${place.name}`,
      details: { place_id, slug, area, rating: place.rating, imageUrl: !!imageUrl, aiDesc: !!generate_description },
    });

    return NextResponse.json({ success: true, slug, name: place.name, imageUrl: !!imageUrl });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
