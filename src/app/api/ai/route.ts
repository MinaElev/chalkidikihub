import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

async function callOpenAI(prompt: string, maxTokens: number = 6000): Promise<string> {
  const apiKey = await getOpenAIKey();
  if (!apiKey) throw new Error('OpenAI API key not configured. Set it in Admin → Settings.');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, title, description, category, location } = body;

  try {
    if (action === 'full_auto') {
      // ONE CLICK = translate ALL content + generate SEO in ALL 6 languages
      const prompt = `You are an expert translator and SEO specialist for a tourism website about Halkidiki, Greece.

Given the following Greek content, do TWO things:

1. TRANSLATE the title and description to: English (en), German (de), Bulgarian (bg), Russian (ru), Romanian (ro)
2. GENERATE SEO-optimized meta titles and meta descriptions in ALL 6 languages (including Greek)

Content:
- Title (Greek): "${title}"
- Description (Greek): "${description}"
- Category: ${category || 'tourism'}
- Location: ${location || 'Halkidiki, Greece'}

Return ONLY a JSON object with this EXACT structure:
{
  "translations": {
    "title_en": "English title",
    "title_de": "German title",
    "title_bg": "Bulgarian title",
    "title_ru": "Russian title",
    "title_ro": "Romanian title",
    "description_en": "English description (keep same length as Greek)",
    "description_de": "German description",
    "description_bg": "Bulgarian description",
    "description_ru": "Russian description",
    "description_ro": "Romanian description"
  },
  "seo": {
    "meta_title_el": "SEO τίτλος ελληνικά (max 60 chars, include Χαλκιδική)",
    "meta_title_en": "SEO title English (max 60 chars, include Halkidiki)",
    "meta_title_de": "SEO Titel Deutsch (max 60 chars, include Chalkidiki)",
    "meta_title_bg": "SEO заглавие български (max 60 chars, include Халкидики)",
    "meta_title_ru": "SEO заголовок русский (max 60 chars, include Халкидики)",
    "meta_title_ro": "Titlu SEO română (max 60 chars, include Halkidiki)",
    "meta_description_el": "SEO περιγραφή ελληνικά (max 155 chars, compelling, call to action)",
    "meta_description_en": "SEO description English (max 155 chars, compelling)",
    "meta_description_de": "SEO Beschreibung Deutsch (max 155 chars)",
    "meta_description_bg": "SEO описание български (max 155 chars)",
    "meta_description_ru": "SEO описание русский (max 155 chars)",
    "meta_description_ro": "Descriere SEO română (max 155 chars)",
    "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
    "image_alt": "Descriptive alt text in English for the main image"
  }
}

IMPORTANT:
- Translate the COMPLETE description - do NOT shorten or summarize, translate EVERY sentence
- Translations must be natural, not literal
- Meta titles MUST include the location (Halkidiki/Chalkidiki/Халкидики)
- Tags must be tourism-relevant SEO keywords in English
- Keep descriptions the EXACT same length as the Greek original - translate ALL content
- No markdown, no explanation, ONLY the JSON object`;

      const result = await callOpenAI(prompt, 6000);
      const parsed = JSON.parse(result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
      return NextResponse.json(parsed);
    }

    if (action === 'village_generate') {
      const villageName = body.village_name || '';
      const area = body.area || '';
      if (!villageName) return NextResponse.json({ error: 'Village name required' }, { status: 400 });

      const prompt = `You are an expert on Halkidiki, Greece tourism. Generate content for the village/town "${villageName}" in the ${area} area of Halkidiki.

Write a rich, informative description in Greek (200-300 words) about this village. Include:
- What the village is known for (beaches, history, nightlife, nature, etc.)
- What visitors can do there
- Character/atmosphere of the village
- Best time to visit
- Any notable landmarks or features

Also provide the approximate population of this village.

Return ONLY a JSON object:
{
  "description_el": "Ελληνική περιγραφή 200-300 λέξεις...",
  "population": 1234
}

IMPORTANT: Write natural, engaging Greek text. The description should make someone want to visit. If you don't know the exact population, give your best estimate. No markdown, ONLY JSON.`;

      const result = await callOpenAI(prompt, 2000);
      const parsed = JSON.parse(result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
      return NextResponse.json(parsed);
    }

    if (action === 'translate_content') {
      // Translate long-form content (blog articles) to 5 languages
      const rawContent = (body.content as string || '').trim();
      if (!rawContent) return NextResponse.json({ error: 'No content provided' }, { status: 400 });

      // Sanitize content - remove problematic characters
      const content = rawContent.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

      const prompt = 'You are a professional translator. Translate the following Greek text to English, German, Bulgarian, Russian, and Romanian.\n\nIMPORTANT: Translate the ENTIRE text completely. Do NOT summarize or shorten. Every paragraph, every sentence must be translated.\nKeep the same formatting (## headings, bullet points, line breaks).\n\nReturn ONLY a JSON object:\n{\n  "en": "full English translation...",\n  "de": "full German translation...",\n  "bg": "full Bulgarian translation...",\n  "ru": "full Russian translation...",\n  "ro": "full Romanian translation..."\n}\n\nNo markdown wrapping, no explanation.\n\nGreek text to translate:\n' + rawContent;

      const result = await callOpenAI(prompt, 10000);
      const translations = JSON.parse(result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
      return NextResponse.json(translations);
    }

    // Legacy actions for backwards compatibility
    if (action === 'translate_all') {
      const prompt = `Translate the following Greek texts to English, German, Bulgarian, Russian, and Romanian.
Return ONLY a JSON object: { "title": { "en": "...", "de": "...", "bg": "...", "ru": "...", "ro": "..." }, "description": { "en": "...", "de": "...", "bg": "...", "ru": "...", "ro": "..." } }
No markdown.
Title: "${title}"
Description: "${description}"`;
      const result = await callOpenAI(prompt, 1500);
      return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()));
    }

    if (action === 'seo') {
      const prompt = `SEO expert for Halkidiki tourism. Generate meta titles/descriptions in 6 languages (el,en,de,bg,ru,ro) + tags + image_alt.
Title: "${title}" Description: "${description}" Category: ${category} Location: ${location}
Return JSON only: { meta_title_el, meta_title_en, meta_title_de, meta_title_bg, meta_title_ru, meta_title_ro, meta_description_el, meta_description_en, meta_description_de, meta_description_bg, meta_description_ru, meta_description_ro, tags: [...], image_alt }`;
      const result = await callOpenAI(prompt, 1000);
      return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()));
    }

    if (action === 'format_content') {
      const { content, lang } = body;
      if (!content) return NextResponse.json({ error: 'No content provided' }, { status: 400 });

      const langMap: Record<string, string> = { el: 'Greek', en: 'English', de: 'German', bg: 'Bulgarian', ru: 'Russian', ro: 'Romanian' };
      const langName = langMap[lang || 'el'] || 'Greek';

      const prompt = `You are an expert content editor for a tourism blog about Halkidiki, Greece.

Take the following raw ${langName} text and format it into a well-structured, engaging blog article. DO NOT change the meaning or add new information. Only restructure and format.

Rules:
- Add clear section headings using "## " prefix (2-3 headings)
- Break long text into short, readable paragraphs (3-4 sentences each)
- Add bullet points where listing items (use "- " prefix)
- Add numbered lists where steps/rankings (use "1. " prefix)
- Bold important phrases using **bold** syntax
- Keep the same language (${langName}) - do not translate
- Keep the same facts and information - do not invent anything
- Make it engaging and easy to scan
- If text is already well-formatted, improve it slightly
- Return ONLY the formatted text, no explanations or wrapping

Raw text:
${content}`;

      const formatted = await callOpenAI(prompt, 4000);
      return NextResponse.json({ formatted: formatted.trim() });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    const logClient = createApiClient();
    await logClient.from('activity_logs').insert({ type: 'error', severity: 'error', message: 'AI API error', details: { action, error: (error as Error).message } });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
