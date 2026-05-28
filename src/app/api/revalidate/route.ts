import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];

const TYPE_PATHS: Record<string, string> = {
  beaches: 'beaches',
  restaurants: 'restaurants',
  activities: 'activities',
  blog: 'blog',
  listings: 'listings',
  sales: 'sales',
  villages: 'places',
  areas: 'areas',
  host: 'host',
};

/**
 * On-demand revalidation endpoint.
 * POST /api/revalidate { type: 'beaches', slug?: 'sani' }
 * Revalidates collection page + detail page (if slug provided) across all locales.
 */
export async function POST(request: NextRequest) {
  try {
    const { type, slug } = await request.json();
    const basePath = TYPE_PATHS[type];

    if (!basePath) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Revalidate collection page across all locales
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}/${basePath}`);
    }

    // Revalidate detail page if slug provided
    if (slug) {
      for (const locale of LOCALES) {
        revalidatePath(`/${locale}/${basePath}/${slug}`);
      }
    }

    // Also revalidate homepage (has featured items)
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}`);
    }

    // Clear the unstable_cache layer for *BySlug data fetchers in src/lib/data.ts.
    // The tag names match what those functions are registered with.
    const TAG_MAP: Record<string, string> = {
      beaches: 'beaches',
      restaurants: 'restaurants',
      activities: 'activities',
      blog: 'blog',
      listings: 'listings',
      villages: 'villages',
    };
    if (TAG_MAP[type]) {
      // Next 16: revalidateTag requires a cache profile as 2nd arg.
      // 'default' matches the standard cacheLife profile and clears the
      // cached entries with the same lifecycle they were stored under.
      revalidateTag(TAG_MAP[type], 'default');
    }

    return NextResponse.json({
      revalidated: true,
      type,
      slug: slug || null,
      paths: slug
        ? [`/${basePath}`, `/${basePath}/${slug}`, '/']
        : [`/${basePath}`, '/'],
      tag: TAG_MAP[type] || null,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
