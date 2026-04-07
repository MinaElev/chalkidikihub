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

async function callOpenAI(prompt: string, maxTokens: number = 8000): Promise<string> {
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
      const prompt = `You are an expert on Halkidiki, Greece beaches. Generate EXACTLY ${count || 10} REAL beaches in the ${area || 'all'} area of Halkidiki.

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

      const result = await callOpenAI(prompt, 10000);
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

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
