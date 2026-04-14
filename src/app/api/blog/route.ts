import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { transformArticle } from '@/lib/data';

export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');

  if (slug) {
    const { data } = await supabase.from('blog_articles').select('*').eq('slug', slug).single();
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(transformArticle(data), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  const limit = searchParams.get('limit');
  let query = supabase.from('blog_articles').select('*').order('published_at', { ascending: false });
  if (category) query = query.eq('category', category);
  if (limit) query = query.limit(Number(limit));
  const { data } = await query;

  return NextResponse.json((data || []).map(transformArticle), {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
