import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');

  if (slug) {
    const { data } = await supabase.from('blog_articles').select('*').eq('slug', slug).single();
    if (!data) return NextResponse.json(null);
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

function transformArticle(row: Record<string, unknown>) {
  return {
    id: row.id, slug: row.slug,
    title: toLocaleMap(row, 'title'),
    excerpt: toLocaleMap(row, 'excerpt'),
    content: toLocaleMap(row, 'content'),
    category: row.category, image_url: row.image_url || '',
    author: row.author || 'Halkidiki Hub',
    read_time_min: row.read_time_min || 5,
    tags: row.tags || [],
    related_area_slugs: row.related_area_slugs || [],
    related_beach_slugs: row.related_beach_slugs || [],
    related_listing_slugs: row.related_listing_slugs || [],
    related_article_slugs: row.related_article_slugs || [],
    published_at: row.published_at,
  };
}
