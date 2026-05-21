import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

export const maxDuration = 60;

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

export async function POST(request: NextRequest) {
  const apiKey = await getOpenAIKey();
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  const { prompt, folder } = await request.json();

  try {
    // Generate image with DALL-E 3
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Professional tourism photography of ${prompt}. Halkidiki, Greece. Beautiful Mediterranean scenery, vibrant colors, high quality, photorealistic, travel magazine style. No text or watermarks.`,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`DALL-E error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    // Download image and upload to Supabase Storage
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const supabase = createApiClient();
    const filePath = `${folder}/ai-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('content-images')
      .upload(filePath, imageBuffer, { cacheControl: '31536000', contentType: 'image/png', upsert: true });

    if (uploadError) {
      // Return the temporary DALL-E URL as fallback
      return NextResponse.json({ url: imageUrl, stored: false });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('content-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl, stored: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
