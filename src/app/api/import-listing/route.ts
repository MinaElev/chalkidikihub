import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

export const maxDuration = 60;

// Amenities we support — AI maps to these
const VALID_AMENITIES = [
  'wifi', 'parking', 'airConditioning', 'pool', 'kitchen', 'tv',
  'washingMachine', 'balcony', 'seaView', 'garden', 'bbq', 'petsAllowed',
];

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = await getOpenAIKey();
  if (!apiKey) throw new Error('OpenAI API key not configured');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error: ${response.status} - ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL is Airbnb or Booking
    const isAirbnb = url.includes('airbnb.com') || url.includes('airbnb.gr');
    const isBooking = url.includes('booking.com');

    if (!isAirbnb && !isBooking) {
      return NextResponse.json({ error: 'Only Airbnb and Booking.com URLs are supported' }, { status: 400 });
    }

    // Fetch the page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,el;q=0.8',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.status}` }, { status: 400 });
    }

    const html = await response.text();

    // Extract useful portions to reduce tokens:
    const metaTags = html.match(/<meta[^>]*>/gi)?.join('\n') || '';
    const jsonLd = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)?.join('\n') || '';
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';

    // Get body text content (strip HTML tags, compress whitespace)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
    const bodyText = bodyMatch
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 15000);

    const platform = isAirbnb ? 'Airbnb' : 'Booking.com';

    const prompt = `Extract property listing data from this ${platform} page. Return ONLY valid JSON.

PAGE TITLE: ${titleTag}

META TAGS:
${metaTags.slice(0, 3000)}

JSON-LD DATA:
${jsonLd.slice(0, 5000)}

PAGE TEXT:
${bodyText}

Extract and return this JSON structure:
{
  "title": "Property title/name in original language",
  "title_en": "Property title in English (translate if needed)",
  "description": "Full property description (original language, max 500 chars)",
  "description_en": "Description in English (translate if needed, max 500 chars)",
  "price_per_night": number or null (in EUR),
  "guests_max": number or null,
  "bedrooms": number or null,
  "bathrooms": number or null,
  "amenities": [array of matching amenities from: ${VALID_AMENITIES.join(', ')}],
  "location_name": "Specific location/village name (e.g. Hanioti, Pefkochori)",
  "area": "kassandra" or "sithonia" or "athos" or "mainland" or null (based on Halkidiki geography),
  "latitude": number or null,
  "longitude": number or null,
  "images": [array of image URLs found, max 10],
  "contact_phone": "phone if found" or null,
  "rating": number or null (0-5 scale),
  "reviews_count": number or null
}

IMPORTANT:
- For amenities, ONLY use values from the provided list. Map things like "Wi-Fi"→"wifi", "Air conditioning"→"airConditioning", "Swimming pool"→"pool", "Free parking"→"parking", "Kitchen/Kitchenette"→"kitchen", "Washing machine"→"washingMachine", "Balcony/Terrace"→"balcony", "Sea view/Ocean view"→"seaView", "Garden"→"garden", "BBQ/Barbecue"→"bbq", "Pet friendly/Pets allowed"→"petsAllowed", "TV/Television"→"tv"
- For area: Kassandra villages include Hanioti, Pefkochori, Kallithea, Sani, Afytos, Polychrono, Kriopigi, Fourka, etc. Sithonia villages include Nikiti, Vourvourou, Sarti, Neos Marmaras, Porto Koufo, Toroni, etc. Set null if not in Halkidiki or unsure.
- For images, extract actual property photo URLs (not icons/logos). Prefer high-res versions.
- Return ONLY the JSON object, no markdown, no explanation.`;

    const content = await callOpenAI(prompt);

    // Parse JSON — handle possible markdown wrapping
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: content }, { status: 500 });
    }

    // Validate and sanitize amenities
    if (parsed.amenities && Array.isArray(parsed.amenities)) {
      parsed.amenities = parsed.amenities.filter((a: string) => VALID_AMENITIES.includes(a));
    }

    // Add source URL
    parsed.source_url = url;
    parsed.source_platform = platform;

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Import listing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 },
    );
  }
}
