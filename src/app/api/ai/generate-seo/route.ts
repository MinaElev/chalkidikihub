import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

export const maxDuration = 60;

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'openai_api_key')
      .single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

/**
 * POST /api/ai/generate-seo
 *
 * Body:
 *   {
 *     title: "Villa Maria",             // required (display name)
 *     tagline?: "...",                   // optional
 *     description?: "...",               // optional
 *     location?: "Nea Fokea, Kassandra", // optional
 *     category?: "villa"                 // optional
 *   }
 *
 * Returns:
 *   {
 *     meta_title_el: "...", meta_title_en: "...", meta_title_de: "...",
 *     meta_title_bg: "...", meta_title_ru: "...", meta_title_ro: "...", meta_title_sr: "...",
 *     meta_description_el: "...", ... (×7)
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    const { title, tagline, description, location, category } = (await request.json()) as {
      title?: string; tagline?: string; description?: string; location?: string; category?: string;
    };

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const apiKey = await getOpenAIKey();
    if (!apiKey) return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });

    const prompt = `You are a senior SEO specialist for a Halkidiki tourism site.
Create optimised meta_title and meta_description in ALL 7 languages: el (Greek), en (English), de (German), bg (Bulgarian), ru (Russian), ro (Romanian), sr (Serbian Latin).

Rules:
- meta_title: 55-60 characters, include the property name + the strongest selling point + a location hint when natural.
- meta_description: 140-160 characters, benefits-driven, 1-2 sentences, natural language (NOT keyword-stuffed), call-to-discovery tone (e.g. "Discover…", "Book your stay…").
- Do NOT repeat the property name three times.
- Never translate proper nouns (Halkidiki, Kassandra, Sithonia, place names).
- Return ONLY valid JSON. No markdown, no commentary.

Response shape (exactly this):
{
  "meta_title_el": "…", "meta_title_en": "…", "meta_title_de": "…",
  "meta_title_bg": "…", "meta_title_ru": "…", "meta_title_ro": "…", "meta_title_sr": "…",
  "meta_description_el": "…", "meta_description_en": "…", "meta_description_de": "…",
  "meta_description_bg": "…", "meta_description_ru": "…", "meta_description_ro": "…", "meta_description_sr": "…"
}

Input:
- Property name: "${title}"
- Tagline: "${tagline || ''}"
- Description: "${(description || '').slice(0, 400)}"
- Location: "${location || 'Halkidiki'}"
- Category: "${category || 'accommodation'}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `OpenAI ${response.status}: ${errText.slice(0, 200)}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: 'Empty response' }, { status: 502 });

    return NextResponse.json(JSON.parse(content));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
