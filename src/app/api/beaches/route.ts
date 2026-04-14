import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { transformBeach } from '@/lib/data';

export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');
  const slug = searchParams.get('slug');

  if (slug) {
    const { data } = await supabase.from('beaches').select('*, beach_reviews(*)').eq('slug', slug).single();
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(transformBeach(data), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const limit = searchParams.get('limit');
  const feature = searchParams.get('feature');
  let query = supabase.from('beaches').select('*, beach_reviews(*)').order('rating', { ascending: false });
  if (area) query = query.eq('area', area);
  if (feature) query = query.contains('features', [feature]);
  if (limit) query = query.limit(Number(limit));
  const { data } = await query;

  return NextResponse.json((data || []).map(transformBeach), {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
