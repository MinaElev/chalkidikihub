import { NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

// Lightweight endpoint: returns ONLY slugs + names for auto-linking
// Much smaller than fetching full records from 5 separate APIs
export async function GET() {
  const supabase = createApiClient();

  const [beaches, restaurants, activities, blogs, areas] = await Promise.all([
    supabase.from('beaches').select('slug, name_el, name_en'),
    supabase.from('restaurants').select('slug, name_el, name_en'),
    supabase.from('activities').select('slug, name_el, name_en'),
    supabase.from('blog_articles').select('slug, title_el, title_en'),
    supabase.from('areas').select('slug, name_el, name_en'),
  ]);

  const items: Array<{ type: string; slug: string; name_el: string; name_en: string }> = [];

  (beaches.data || []).forEach(b => items.push({ type: 'beach', slug: b.slug, name_el: b.name_el || '', name_en: b.name_en || '' }));
  (restaurants.data || []).forEach(r => items.push({ type: 'restaurant', slug: r.slug, name_el: r.name_el || '', name_en: r.name_en || '' }));
  (activities.data || []).forEach(a => items.push({ type: 'activity', slug: a.slug, name_el: a.name_el || '', name_en: a.name_en || '' }));
  (blogs.data || []).forEach(b => items.push({ type: 'blog', slug: b.slug, name_el: b.title_el || '', name_en: b.title_en || '' }));
  (areas.data || []).forEach(a => items.push({ type: 'area', slug: a.slug, name_el: a.name_el || '', name_en: a.name_en || '' }));

  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
  });
}
