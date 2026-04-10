import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

interface BrokenLink {
  source: string; // e.g. "blog: Οι καλύτερες παραλίες"
  sourceType: string; // "blog", "beach", "restaurant", "activity", "village"
  sourceSlug: string;
  link: string; // the broken URL
  status: number | 'not_found'; // HTTP status or 'not_found'
}

// Extract internal links from HTML content
function extractLinks(html: string): string[] {
  const links: string[] = [];
  const regex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    // Only internal links
    if (href.startsWith('/') || href.includes('chalkidikihub.gr')) {
      links.push(href.replace('https://chalkidikihub.gr', '').replace('http://chalkidikihub.gr', ''));
    }
  }
  return [...new Set(links)];
}

// Extract slug references from text (e.g. auto-linked content mentions)
function extractSlugRefs(text: string, existingSlugs: Set<string>): string[] {
  // Not needed for now — we focus on href links
  return [];
}

export async function GET(request: Request) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const supabase = createAdminClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

    // 1. Collect all valid slugs from DB
    const [beaches, restaurants, activities, blogs, villages, listings, sales] = await Promise.all([
      supabase.from('beaches').select('slug'),
      supabase.from('restaurants').select('slug'),
      supabase.from('activities').select('slug'),
      supabase.from('blog_articles').select('slug'),
      supabase.from('villages').select('slug'),
      supabase.from('listings').select('slug'),
      supabase.from('sales').select('slug'),
    ]);

    const validPaths = new Set<string>();
    // Static pages
    ['/el', '/en', '/de', '/bg', '/ru', '/ro', '/',
     '/beaches', '/restaurants', '/activities', '/blog', '/listings', '/sales',
     '/areas', '/areas/kassandra', '/areas/sithonia', '/areas/athos', '/areas/mainland',
     '/mount-athos', '/for-owners', '/contact', '/terms', '/privacy', '/ev-chargers',
     '/auth/login', '/auth/register', '/dashboard', '/map', '/changelog',
    ].forEach(p => validPaths.add(p));

    // Dynamic pages from DB
    (beaches.data || []).forEach((r: { slug: string }) => validPaths.add(`/beaches/${r.slug}`));
    (restaurants.data || []).forEach((r: { slug: string }) => validPaths.add(`/restaurants/${r.slug}`));
    (activities.data || []).forEach((r: { slug: string }) => validPaths.add(`/activities/${r.slug}`));
    (blogs.data || []).forEach((r: { slug: string }) => validPaths.add(`/blog/${r.slug}`));
    (villages.data || []).forEach((r: { slug: string }) => validPaths.add(`/places/${r.slug}`));
    (listings.data || []).forEach((r: { slug: string }) => validPaths.add(`/listings/${r.slug}`));
    (sales.data || []).forEach((r: { slug: string }) => validPaths.add(`/sales/${r.slug}`));

    // 2. Scan all content for links
    const brokenLinks: BrokenLink[] = [];

    // Scan blog articles
    const { data: blogArticles } = await supabase.from('blog_articles')
      .select('slug, title_el, content_el, content_en');
    if (blogArticles) {
      for (const article of blogArticles) {
        const content = (article.content_el || '') + (article.content_en || '');
        const links = extractLinks(content);
        for (const link of links) {
          // Strip locale prefix for matching
          const cleanLink = link.replace(/^\/(el|en|de|bg|ru|ro)/, '');
          if (cleanLink && !validPaths.has(cleanLink) && !cleanLink.startsWith('#') && !cleanLink.startsWith('/api')) {
            brokenLinks.push({
              source: `Blog: ${article.title_el || article.slug}`,
              sourceType: 'blog',
              sourceSlug: article.slug,
              link,
              status: 'not_found',
            });
          }
        }
      }
    }

    // Scan beach descriptions
    const { data: beachData } = await supabase.from('beaches').select('slug, name_el, description_el, description_en');
    if (beachData) {
      for (const item of beachData) {
        const content = (item.description_el || '') + (item.description_en || '');
        const links = extractLinks(content);
        for (const link of links) {
          const cleanLink = link.replace(/^\/(el|en|de|bg|ru|ro)/, '');
          if (cleanLink && !validPaths.has(cleanLink) && !cleanLink.startsWith('#')) {
            brokenLinks.push({
              source: `Beach: ${item.name_el || item.slug}`,
              sourceType: 'beach', sourceSlug: item.slug, link, status: 'not_found',
            });
          }
        }
      }
    }

    // Scan restaurant descriptions
    const { data: restData } = await supabase.from('restaurants').select('slug, name_el, description_el, description_en');
    if (restData) {
      for (const item of restData) {
        const content = (item.description_el || '') + (item.description_en || '');
        const links = extractLinks(content);
        for (const link of links) {
          const cleanLink = link.replace(/^\/(el|en|de|bg|ru|ro)/, '');
          if (cleanLink && !validPaths.has(cleanLink) && !cleanLink.startsWith('#')) {
            brokenLinks.push({
              source: `Restaurant: ${item.name_el || item.slug}`,
              sourceType: 'restaurant', sourceSlug: item.slug, link, status: 'not_found',
            });
          }
        }
      }
    }

    // Scan activity descriptions
    const { data: actData } = await supabase.from('activities').select('slug, name_el, description_el, description_en');
    if (actData) {
      for (const item of actData) {
        const content = (item.description_el || '') + (item.description_en || '');
        const links = extractLinks(content);
        for (const link of links) {
          const cleanLink = link.replace(/^\/(el|en|de|bg|ru|ro)/, '');
          if (cleanLink && !validPaths.has(cleanLink) && !cleanLink.startsWith('#')) {
            brokenLinks.push({
              source: `Activity: ${item.name_el || item.slug}`,
              sourceType: 'activity', sourceSlug: item.slug, link, status: 'not_found',
            });
          }
        }
      }
    }

    // Scan village descriptions
    const { data: villageData } = await supabase.from('villages').select('slug, name_el, description_el, description_en');
    if (villageData) {
      for (const item of villageData) {
        const content = (item.description_el || '') + (item.description_en || '');
        const links = extractLinks(content);
        for (const link of links) {
          const cleanLink = link.replace(/^\/(el|en|de|bg|ru|ro)/, '');
          if (cleanLink && !validPaths.has(cleanLink) && !cleanLink.startsWith('#')) {
            brokenLinks.push({
              source: `Village: ${item.name_el || item.slug}`,
              sourceType: 'village', sourceSlug: item.slug, link, status: 'not_found',
            });
          }
        }
      }
    }

    return NextResponse.json({
      totalScanned: (blogArticles?.length || 0) + (beachData?.length || 0) + (restData?.length || 0) + (actData?.length || 0) + (villageData?.length || 0),
      validPaths: validPaths.size,
      brokenLinks,
      brokenCount: brokenLinks.length,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
