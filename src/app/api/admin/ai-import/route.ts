import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function getOpenAIKey(): Promise<string> {
  const supabase = getAdminClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
  return data?.value || process.env.OPENAI_API_KEY || '';
}

async function callOpenAI(prompt: string, maxTokens: number = 16000): Promise<string> {
  const apiKey = await getOpenAIKey();
  if (!apiKey) throw new Error('OpenAI API key not configured');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });
  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(request: NextRequest) {
  try {
    const { type, area, count } = await request.json();

    if (type === 'beaches') {
      // Fetch existing slugs to avoid duplicates
      const supabaseCheck = getAdminClient();
      const { data: existingBeaches } = await supabaseCheck.from('beaches').select('slug, name_el');
      const existingNames = (existingBeaches || []).map(b => b.name_el).filter(Boolean);
      const existingList = existingNames.length > 0
        ? `\n\nALREADY IN DATABASE (DO NOT include these beaches, find DIFFERENT ones instead):\n${existingNames.join(', ')}`
        : '';

      const prompt = `You are an expert on Halkidiki, Greece beaches. Generate EXACTLY ${count || 10} REAL beaches in the ${area || 'all'} area of Halkidiki.${existingList}

For each beach, provide accurate, real data in this EXACT JSON format (array of objects):
[
  {
    "slug": "beach-name-area",
    "name_el": "Greek name",
    "name_en": "English name",
    "name_de": "German name",
    "name_bg": "Bulgarian name",
    "name_ru": "Russian name",
    "name_ro": "Romanian name",
    "description_el": "Detailed Greek description (150-250 words). Include what makes this beach special, type of sand/pebbles, water quality, nearby amenities, best time to visit.",
    "description_en": "Detailed English description (150-250 words)",
    "description_de": "Detailed German description (150-250 words)",
    "description_bg": "Detailed Bulgarian description (150-250 words)",
    "description_ru": "Detailed Russian description (150-250 words)",
    "description_ro": "Detailed Romanian description (150-250 words)",
    "area": "${area || 'kassandra'}",
    "location_name": "Village/area name, Halkidiki",
    "latitude": 40.xxxx,
    "longitude": 23.xxxx,
    "features": ["sandy", "organized", "beachBar", "parking"],
    "rating": 4.5,
    "meta_title_el": "SEO title in Greek (max 60 chars)",
    "meta_title_en": "SEO title in English (max 60 chars)",
    "meta_description_el": "SEO description Greek (max 155 chars)",
    "meta_description_en": "SEO description English (max 155 chars)",
    "image_alt": "Descriptive alt text for image"
  }
]

IMPORTANT:
- Use ONLY real, existing beaches in Halkidiki ${area ? `(${area} peninsula)` : ''}
- GPS coordinates must be ACCURATE (not made up)
- Features must be from: sandy, pebble, organized, free, parking, beachBar, shallowWater, waterSports, accessible
- Area must be one of: kassandra, sithonia, athos, mainland
- Rating between 3.5 and 5.0 (realistic)
- Descriptions should be unique, engaging, SEO-friendly
- Return ONLY valid JSON array, no explanation`;

      const result = await callOpenAI(prompt, 16000);
      const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const beaches = JSON.parse(cleaned);

      if (!Array.isArray(beaches)) throw new Error('AI did not return array');

      // Insert into DB
      const supabase = getAdminClient();
      let inserted = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const beach of beaches) {
        // Check duplicate slug
        const { data: existing } = await supabase.from('beaches').select('id').eq('slug', beach.slug).single();
        if (existing) { skipped++; continue; }

        const { error } = await supabase.from('beaches').insert({
          slug: beach.slug,
          name_el: beach.name_el, name_en: beach.name_en,
          name_de: beach.name_de || '', name_bg: beach.name_bg || '',
          name_ru: beach.name_ru || '', name_ro: beach.name_ro || '',
          description_el: beach.description_el, description_en: beach.description_en,
          description_de: beach.description_de || '', description_bg: beach.description_bg || '',
          description_ru: beach.description_ru || '', description_ro: beach.description_ro || '',
          area: beach.area,
          location_name: beach.location_name,
          latitude: beach.latitude, longitude: beach.longitude,
          features: beach.features || [],
          rating: beach.rating || 4.0,
          reviews_count: 0,
          meta_title_el: beach.meta_title_el || '', meta_title_en: beach.meta_title_en || '',
          meta_description_el: beach.meta_description_el || '', meta_description_en: beach.meta_description_en || '',
          image_alt: beach.image_alt || '',
        });

        if (error) {
          errors.push(`${beach.slug}: ${error.message}`);
        } else {
          inserted++;
        }
      }

      // Log
      await supabase.from('activity_logs').insert({
        type: 'admin_action', severity: 'info',
        message: `AI Import: ${inserted} beaches added, ${skipped} skipped`,
        details: { type, area, count, inserted, skipped, errors: errors.slice(0, 5) },
      });

      return NextResponse.json({ inserted, skipped, total: beaches.length, errors });
    }

    if (type === 'restaurants') {
      const supabaseCheck = getAdminClient();
      const { data: existingR } = await supabaseCheck.from('restaurants').select('name_el');
      const existingRNames = (existingR || []).map(r => r.name_el).filter(Boolean);
      const excludeR = existingRNames.length > 0
        ? `\n\nALREADY IN DATABASE (DO NOT include these, find DIFFERENT ones):\n${existingRNames.join(', ')}`
        : '';

      const prompt = `You are an expert on Halkidiki, Greece food & drink scene. Generate EXACTLY ${count || 10} REAL restaurants, bars, beach bars, cafés in the ${area || 'all'} area of Halkidiki.${excludeR}

For each place, provide accurate, real data in this EXACT JSON format (array of objects):
[
  {
    "slug": "place-name-area",
    "name_el": "Greek name",
    "name_en": "English name",
    "name_de": "German name",
    "name_bg": "Bulgarian name",
    "name_ru": "Russian name",
    "name_ro": "Romanian name",
    "description_el": "Detailed Greek description (100-200 words). Include cuisine style, atmosphere, signature dishes, view, prices.",
    "description_en": "Detailed English description (100-200 words)",
    "description_de": "Detailed German description (100-200 words)",
    "description_bg": "Detailed Bulgarian description (100-200 words)",
    "description_ru": "Detailed Russian description (100-200 words)",
    "description_ro": "Detailed Romanian description (100-200 words)",
    "area": "${area || 'kassandra'}",
    "location_name": "Village, Halkidiki",
    "latitude": 40.xxxx,
    "longitude": 23.xxxx,
    "cuisine": ["traditional"],
    "price_level": "moderate",
    "phone": "+30 2374x xxxxx",
    "hours": "12:00-00:00",
    "has_sea_view": true,
    "has_live_music": false,
    "accepts_reservations": true,
    "tags": ["seafood", "romantic", "family"],
    "rating": 4.3,
    "meta_title_el": "SEO title Greek (max 60 chars)",
    "meta_title_en": "SEO title English (max 60 chars)",
    "meta_description_el": "SEO desc Greek (max 155 chars)",
    "meta_description_en": "SEO desc English (max 155 chars)",
    "image_alt": "Descriptive alt text"
  }
]

IMPORTANT:
- Use ONLY real, existing places in Halkidiki ${area ? `(${area})` : ''}
- Mix types: traditional tavernas, seafood restaurants, beach bars, cocktail bars, cafés, brunch spots, bakeries
- GPS coordinates must be ACCURATE
- cuisine must be from: seafood, traditional, grill, mediterranean, pizza, cafe, fineDining, streetFood, beachBar, bar, cocktailBar, brunch, cafeBar, bakery
- price_level: budget, moderate, upscale, fineDining
- Rating between 3.5 and 5.0
- Phone numbers should be realistic Greek format (+30 2374x or +30 6xxx)
- Return ONLY valid JSON array`;

      const result = await callOpenAI(prompt, 16000);
      const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const restaurants = JSON.parse(cleaned);

      if (!Array.isArray(restaurants)) throw new Error('AI did not return array');

      const supabase = getAdminClient();
      let inserted = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const r of restaurants) {
        const { data: existing } = await supabase.from('restaurants').select('id').eq('slug', r.slug).single();
        if (existing) { skipped++; continue; }

        const { error } = await supabase.from('restaurants').insert({
          slug: r.slug,
          name_el: r.name_el, name_en: r.name_en,
          name_de: r.name_de || '', name_bg: r.name_bg || '',
          name_ru: r.name_ru || '', name_ro: r.name_ro || '',
          description_el: r.description_el, description_en: r.description_en,
          description_de: r.description_de || '', description_bg: r.description_bg || '',
          description_ru: r.description_ru || '', description_ro: r.description_ro || '',
          area: r.area,
          location_name: r.location_name,
          latitude: r.latitude, longitude: r.longitude,
          cuisine: r.cuisine || ['traditional'],
          price_level: r.price_level || 'moderate',
          phone: r.phone || '',
          hours: r.hours || '',
          has_sea_view: r.has_sea_view || false,
          has_live_music: r.has_live_music || false,
          accepts_reservations: r.accepts_reservations || false,
          tags: r.tags || [],
          rating: r.rating || 4.0,
          reviews_count: 0,
          meta_title_el: r.meta_title_el || '', meta_title_en: r.meta_title_en || '',
          meta_description_el: r.meta_description_el || '', meta_description_en: r.meta_description_en || '',
          image_alt: r.image_alt || '',
        });

        if (error) {
          errors.push(`${r.slug}: ${error.message}`);
        } else {
          inserted++;
        }
      }

      await supabase.from('activity_logs').insert({
        type: 'admin_action', severity: 'info',
        message: `AI Import: ${inserted} restaurants added, ${skipped} skipped`,
        details: { type, area, count, inserted, skipped, errors: errors.slice(0, 5) },
      });

      return NextResponse.json({ inserted, skipped, total: restaurants.length, errors });
    }

    if (type === 'activities') {
      const supabaseCheck = getAdminClient();
      const { data: existingA } = await supabaseCheck.from('activities').select('name_el');
      const existingANames = (existingA || []).map(a => a.name_el).filter(Boolean);
      const excludeA = existingANames.length > 0
        ? `\n\nALREADY IN DATABASE (DO NOT include these, find DIFFERENT ones):\n${existingANames.join(', ')}`
        : '';

      const prompt = `You are an expert on Halkidiki, Greece tourism activities. Generate EXACTLY ${count || 10} REAL activities and attractions in the ${area || 'all'} area of Halkidiki.${excludeA}

For each activity, provide accurate, real data in this EXACT JSON format (array of objects):
[
  {
    "slug": "activity-name-area",
    "name_el": "Greek name",
    "name_en": "English name",
    "name_de": "German name",
    "name_bg": "Bulgarian name",
    "name_ru": "Russian name",
    "name_ro": "Romanian name",
    "description_el": "Detailed Greek description (150-250 words). Include what visitors do, difficulty, best time, what to bring.",
    "description_en": "Detailed English description (150-250 words)",
    "description_de": "Detailed German description (150-250 words)",
    "description_bg": "Detailed Bulgarian description (150-250 words)",
    "description_ru": "Detailed Russian description (150-250 words)",
    "description_ro": "Detailed Romanian description (150-250 words)",
    "area": "${area || 'kassandra'}",
    "location_name": "Village/area, Halkidiki",
    "latitude": 40.xxxx,
    "longitude": 23.xxxx,
    "category": "nature",
    "price_range": "Free",
    "duration": "2-3 hours",
    "tags": ["hiking", "family", "nature"],
    "rating": 4.5,
    "meta_title_el": "SEO title Greek (max 60 chars)",
    "meta_title_en": "SEO title English (max 60 chars)",
    "meta_description_el": "SEO desc Greek (max 155 chars)",
    "meta_description_en": "SEO desc English (max 155 chars)",
    "image_alt": "Descriptive alt text"
  }
]

IMPORTANT:
- Use ONLY real, existing activities/attractions in Halkidiki ${area ? `(${area})` : ''}
- Mix types: historical sites, nature trails, water sports, boat trips, wellness, family activities, religious sites
- GPS coordinates must be ACCURATE
- category must be from: historical, nature, waterSports, boatTrips, wellness, family, nightlife, religious
- price_range examples: "Free", "10-20€", "From 30€/person", "50-80€"
- duration examples: "1 hour", "2-3 hours", "Half day", "Full day"
- Rating between 3.5 and 5.0
- Return ONLY valid JSON array`;

      const result = await callOpenAI(prompt, 16000);
      const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const activities = JSON.parse(cleaned);

      if (!Array.isArray(activities)) throw new Error('AI did not return array');

      const supabase = getAdminClient();
      let inserted = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const a of activities) {
        const { data: existing } = await supabase.from('activities').select('id').eq('slug', a.slug).single();
        if (existing) { skipped++; continue; }

        const { error } = await supabase.from('activities').insert({
          slug: a.slug,
          name_el: a.name_el, name_en: a.name_en,
          name_de: a.name_de || '', name_bg: a.name_bg || '',
          name_ru: a.name_ru || '', name_ro: a.name_ro || '',
          description_el: a.description_el, description_en: a.description_en,
          description_de: a.description_de || '', description_bg: a.description_bg || '',
          description_ru: a.description_ru || '', description_ro: a.description_ro || '',
          area: a.area,
          location_name: a.location_name,
          latitude: a.latitude, longitude: a.longitude,
          category: a.category || 'nature',
          price_range: a.price_range || '',
          duration: a.duration || '',
          tags: a.tags || [],
          rating: a.rating || 4.0,
          reviews_count: 0,
          meta_title_el: a.meta_title_el || '', meta_title_en: a.meta_title_en || '',
          meta_description_el: a.meta_description_el || '', meta_description_en: a.meta_description_en || '',
          image_alt: a.image_alt || '',
        });

        if (error) {
          errors.push(`${a.slug}: ${error.message}`);
        } else {
          inserted++;
        }
      }

      await supabase.from('activity_logs').insert({
        type: 'admin_action', severity: 'info',
        message: `AI Import: ${inserted} activities added, ${skipped} skipped`,
        details: { type, area, count, inserted, skipped, errors: errors.slice(0, 5) },
      });

      return NextResponse.json({ inserted, skipped, total: activities.length, errors });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
