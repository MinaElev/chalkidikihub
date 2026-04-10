import { NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

export async function GET() {
  const supabase = createApiClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_image_url').single();
  return NextResponse.json(
    { url: data?.value || '' },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  );
}
