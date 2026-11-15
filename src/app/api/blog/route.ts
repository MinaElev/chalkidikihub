// Guard: public read-only content.
import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { transformArticle, ARTICLE_CARD_FIELDS } from '@/lib/data';
import { cachedGet } from '@/lib/api-cache';

async function getHandler(request: NextRequest) {
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
  // ?fields=card → skip the multi-locale content_* bodies at the DB level;
  // list consumers (blog index, sidebars, related widgets) render cards only.
  const columns = searchParams.get('fields') === 'card' ? ARTICLE_CARD_FIELDS : '*';
  let query = supabase.from('blog_articles').select(columns).order('published_at', { ascending: false });
  if (category) query = query.eq('category', category);
  if (limit) query = query.limit(Number(limit));
  const { data } = await query;

  return NextResponse.json((data || []).map((r) => transformArticle(r as unknown as Record<string, unknown>)), {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}

// Cached in-process (no CDN in front of the self-hosted server); see lib/api-cache.ts.
export const GET = cachedGet(getHandler, 300);
