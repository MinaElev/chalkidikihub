import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

interface SearchItem {
  slug: string;
  name: Record<string, string>;
  location_name?: string;
  category?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const limit = Math.min(Number(searchParams.get('limit')) || 5, 20);

  if (!q || q.length < 2) {
    return NextResponse.json(
      { beaches: [], restaurants: [], activities: [], listings: [], blog: [] },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const supabase = createApiClient();
  const pattern = `%${q}%`;

  // Run all five searches in parallel
  const [beachesRes, restaurantsRes, activitiesRes, listingsRes, blogRes] =
    await Promise.all([
      // Beaches — search name columns and location_name
      supabase
        .from('beaches')
        .select('slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr, location_name')
        .or(
          `name_el.ilike.${pattern},name_en.ilike.${pattern},location_name.ilike.${pattern}`,
        )
        .limit(limit),

      // Restaurants
      supabase
        .from('restaurants')
        .select('slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr, location_name')
        .or(
          `name_el.ilike.${pattern},name_en.ilike.${pattern},location_name.ilike.${pattern}`,
        )
        .limit(limit),

      // Activities
      supabase
        .from('activities')
        .select('slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr, location_name')
        .or(
          `name_el.ilike.${pattern},name_en.ilike.${pattern},location_name.ilike.${pattern}`,
        )
        .limit(limit),

      // Listings — title columns instead of name
      supabase
        .from('listings')
        .select('slug, title_el, title_en, title_de, title_bg, title_ru, title_ro, location_name')
        .eq('status', 'published')
        .or(
          `title_el.ilike.${pattern},title_en.ilike.${pattern},location_name.ilike.${pattern}`,
        )
        .limit(limit),

      // Blog articles — title columns + category
      supabase
        .from('blog_articles')
        .select('slug, title_el, title_en, title_de, title_bg, title_ru, title_ro, title_sr, category')
        .or(
          `title_el.ilike.${pattern},title_en.ilike.${pattern}`,
        )
        .limit(limit),
    ]);

  // Transform helper for name-based tables (beaches, restaurants, activities)
  function transformNameRows(rows: Record<string, unknown>[]): SearchItem[] {
    return rows.map((row) => ({
      slug: row.slug as string,
      name: toLocaleMap(row, 'name'),
      location_name: (row.location_name as string) || '',
    }));
  }

  // Transform listings (title-based)
  function transformListingRows(rows: Record<string, unknown>[]): SearchItem[] {
    return rows.map((row) => ({
      slug: row.slug as string,
      name: {
        el: (row.title_el as string) || '',
        en: (row.title_en as string) || '',
        de: (row.title_de as string) || '',
        bg: (row.title_bg as string) || '',
        ru: (row.title_ru as string) || '',
        ro: (row.title_ro as string) || '',
        sr: '',
      },
      location_name: (row.location_name as string) || '',
    }));
  }

  // Transform blog articles (title-based + category)
  function transformBlogRows(rows: Record<string, unknown>[]): SearchItem[] {
    return rows.map((row) => ({
      slug: row.slug as string,
      name: toLocaleMap(row, 'title'),
      category: (row.category as string) || '',
    }));
  }

  return NextResponse.json(
    {
      beaches: transformNameRows((beachesRes.data || []) as Record<string, unknown>[]),
      restaurants: transformNameRows((restaurantsRes.data || []) as Record<string, unknown>[]),
      activities: transformNameRows((activitiesRes.data || []) as Record<string, unknown>[]),
      listings: transformListingRows((listingsRes.data || []) as Record<string, unknown>[]),
      blog: transformBlogRows((blogRes.data || []) as Record<string, unknown>[]),
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    },
  );
}
