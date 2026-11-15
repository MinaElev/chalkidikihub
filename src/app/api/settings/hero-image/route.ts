// Guard: public read-only setting.
import { NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { cachedGet } from '@/lib/api-cache';

async function getHandler() {
  const supabase = createApiClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_image_url').single();
  return NextResponse.json(
    { url: data?.value || '' },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  );
}

// Cached in-process (no CDN in front of the self-hosted server); see lib/api-cache.ts.
export const GET = cachedGet(getHandler, 300);
