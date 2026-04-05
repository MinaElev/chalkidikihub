import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { createApiClient } from '@/lib/api-helpers';
import { AREAS } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// Force dynamic rendering (not prerendered at build time)
export const dynamic = 'force-dynamic';
// Revalidate sitemap every hour
export const revalidate = 3600;

function altLanguages(path: string) {
  return {
    languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${path}`])),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const supabase = createApiClient();

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: altLanguages(''),
    });
  }

  // Static pages
  const staticPages = [
    { path: 'listings', priority: 0.9, freq: 'daily' as const },
    { path: 'beaches', priority: 0.9, freq: 'daily' as const },
    { path: 'restaurants', priority: 0.9, freq: 'daily' as const },
    { path: 'activities', priority: 0.8, freq: 'weekly' as const },
    { path: 'ev-chargers', priority: 0.7, freq: 'weekly' as const },
    { path: 'blog', priority: 0.8, freq: 'daily' as const },
    { path: 'areas', priority: 0.8, freq: 'weekly' as const },
    { path: 'map', priority: 0.6, freq: 'weekly' as const },
    { path: 'contact', priority: 0.5, freq: 'monthly' as const },
    { path: 'for-owners', priority: 0.7, freq: 'monthly' as const },
    { path: 'terms', priority: 0.3, freq: 'yearly' as const },
    { path: 'privacy', priority: 0.3, freq: 'yearly' as const },
  ];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.freq,
        priority: page.priority,
        alternates: altLanguages(`/${page.path}`),
      });
    }
  }

  // Areas (from constants)
  for (const area of AREAS) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/areas/${area.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: altLanguages(`/areas/${area.slug}`),
      });
    }
  }

  // Listings from DB
  const { data: listings } = await supabase
    .from('listings')
    .select('slug, updated_at')
    .eq('status', 'published');
  if (listings) {
    for (const item of listings) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/listings/${item.slug}`,
          lastModified: new Date(item.updated_at),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: altLanguages(`/listings/${item.slug}`),
        });
      }
    }
  }

  // Beaches from DB
  const { data: beaches } = await supabase
    .from('beaches')
    .select('slug, updated_at');
  if (beaches) {
    for (const item of beaches) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/beaches/${item.slug}`,
          lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: altLanguages(`/beaches/${item.slug}`),
        });
      }
    }
  }

  // Restaurants from DB
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('slug, updated_at');
  if (restaurants) {
    for (const item of restaurants) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/restaurants/${item.slug}`,
          lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: altLanguages(`/restaurants/${item.slug}`),
        });
      }
    }
  }

  // Activities from DB
  const { data: activities } = await supabase
    .from('activities')
    .select('slug, updated_at');
  if (activities) {
    for (const item of activities) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/activities/${item.slug}`,
          lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: altLanguages(`/activities/${item.slug}`),
        });
      }
    }
  }

  // Blog from DB
  const { data: articles } = await supabase
    .from('blog_articles')
    .select('slug, published_at, updated_at');
  if (articles) {
    for (const item of articles) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${item.slug}`,
          lastModified: new Date(item.updated_at || item.published_at),
          changeFrequency: 'monthly',
          priority: 0.8,
          alternates: altLanguages(`/blog/${item.slug}`),
        });
      }
    }
  }

  return entries;
}
