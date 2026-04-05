import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { createApiClient } from '@/lib/api-helpers';
import { AREAS } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

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
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}`])),
      },
    });
  }

  // Static pages
  const staticPages = ['listings', 'areas', 'beaches', 'restaurants', 'activities', 'ev-chargers', 'blog', 'map', 'contact', 'for-owners', 'terms', 'privacy'];
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Listings from DB
  const { data: listings } = await supabase.from('listings').select('slug, updated_at').eq('status', 'published');
  if (listings) {
    for (const item of listings) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/listings/${item.slug}`,
          lastModified: new Date(item.updated_at),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/listings/${item.slug}`])) },
        });
      }
    }
  }

  // Areas
  for (const area of AREAS) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/areas/${area.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/areas/${area.slug}`])) },
      });
    }
  }

  // Beaches from DB
  const { data: beaches } = await supabase.from('beaches').select('slug');
  if (beaches) {
    for (const item of beaches) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/beaches/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/beaches/${item.slug}`])) },
        });
      }
    }
  }

  // Restaurants from DB
  const { data: restaurants } = await supabase.from('restaurants').select('slug');
  if (restaurants) {
    for (const item of restaurants) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/restaurants/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/restaurants/${item.slug}`])) },
        });
      }
    }
  }

  // Activities from DB
  const { data: activities } = await supabase.from('activities').select('slug');
  if (activities) {
    for (const item of activities) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/activities/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/activities/${item.slug}`])) },
        });
      }
    }
  }

  // Blog from DB
  const { data: articles } = await supabase.from('blog_articles').select('slug, published_at');
  if (articles) {
    for (const item of articles) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${item.slug}`,
          lastModified: new Date(item.published_at),
          changeFrequency: 'monthly',
          priority: 0.8,
          alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/blog/${item.slug}`])) },
        });
      }
    }
  }

  return entries;
}
