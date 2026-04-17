import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

export const maxDuration = 60;

const TARGET_LANGUAGES = {
  en: 'English',
  de: 'German',
  bg: 'Bulgarian',
  ru: 'Russian',
  ro: 'Romanian',
  sr: 'Serbian (Latin script)',
};

type Fields = Record<string, string>;

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

/**
 * POST /api/ai/translate-fields
 *
 * Body:
 *   {
 *     sourceLocale: "el",
 *     fields: { tagline: "Βίλα με πισίνα…", owner_story: "Είμαι ο Γιώργος…" }
 *   }
 *
 * Returns:
 *   {
 *     tagline:      { en: "…", de: "…", bg: "…", ru: "…", ro: "…", sr: "…" },
 *     owner_story:  { en: "…", de: "…", bg: "…", ru: "…", ro: "…", sr: "…" }
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    const { sourceLocale = 'el', fields } = (await request.json()) as {
      sourceLocale?: string;
      fields?: Fields;
    };

    if (!fields || typeof fields !== 'object' || !Object.keys(fields).length) {
      return NextResponse.json({ error: 'fields (object of text values) is required' }, { status: 400 });
    }

    const apiKey = await getOpenAIKey();
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const sourceLangName = sourceLocale === 'el' ? 'Greek' : sourceLocale === 'en' ? 'English' : sourceLocale;

    const targetList = Object.entries(TARGET_LANGUAGES)
      .filter(([code]) => code !== sourceLocale)
      .map(([code, name]) => `"${code}" (${name})`)
      .join(', ');

    const prompt = `You are a professional tourism-industry translator.
Translate the following fields from ${sourceLangName} to each of these target languages: ${targetList}.

Rules:
- Preserve the meaning and tone, not the literal word count.
- Keep proper nouns (place names) and numbers unchanged.
- If the source is empty or whitespace, return an empty string for every language.
- Return ONLY valid JSON, no markdown, no commentary.

Response shape:
{
  "<field_name>": { "<lang_code>": "<translation>", ... },
  ...
}

Input fields (source language: ${sourceLocale}):
${JSON.stringify(fields, null, 2)}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.3,
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

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
