import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { createApiClient } from '@/lib/api-helpers';
import { AREAS } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// Revalidate sitemap every hour (ISR)
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
    { path: 'sales', priority: 0.9, freq: 'daily' as const },
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

  // Business types (restaurant category pages)
  const { data: businessTypes } = await supabase
    .from('business_types')
    .select('slug');
  if (businessTypes) {
    for (const bt of businessTypes) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/restaurants/category/${bt.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: altLanguages(`/restaurants/category/${bt.slug}`),
        });
      }
    }
  }

  // SEO ghost pages — area-based and category-based
  const areaSlugs = ['kassandra', 'sithonia', 'athos', 'mainland'];
  const activityCategories = ['historical', 'nature', 'waterSports', 'boatTrips', 'wellness', 'family', 'nightlife', 'religious'];
  const blogCategories = ['guides', 'beaches', 'food', 'activities', 'tips', 'culture'];

  // Beaches by area
  for (const area of areaSlugs) {
    for (const locale of locales) {
      entries.push({ url: `${baseUrl}/${locale}/beaches/area/${area}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7, alternates: altLanguages(`/beaches/area/${area}`) });
    }
  }
  // Beaches by feature
  const beachFeatures = ['sandy', 'pebble', 'organized', 'free', 'shallowWater', 'waterSports', 'accessible', 'beachBar', 'sunbeds', 'lifeguard', 'nudist', 'parking'];
  for (const feat of beachFeatures) {
    for (const locale of locales) {
      entries.push({ url: `${baseUrl}/${locale}/beaches/feature/${feat}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7, alternates: altLanguages(`/beaches/feature/${feat}`) });
    }
  }
  // Restaurants by area
  for (const area of areaSlugs) {
    for (const locale of locales) {
      entries.push({ url: `${baseUrl}/${locale}/restaurants/area/${area}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7, alternates: altLanguages(`/restaurants/area/${area}`) });
    }
  }
  // Activities by category
  for (const cat of activityCategories) {
    for (const locale of locales) {
      entries.push({ url: `${baseUrl}/${locale}/activities/category/${cat}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7, alternates: altLanguages(`/activities/category/${cat}`) });
    }
  }
  // Activities by area
  for (const area of areaSlugs) {
    for (const locale of locales) {
      entries.push({ url: `${baseUrl}/${locale}/activities/area/${area}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7, alternates: altLanguages(`/activities/area/${area}`) });
    }
  }
  // Blog by category
  for (const cat of blogCategories) {
    for (const locale of locales) {
      entries.push({ url: `${baseUrl}/${locale}/blog/category/${cat}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7, alternates: altLanguages(`/blog/category/${cat}`) });
    }
  }

  // Sales from DB
  const { data: sales } = await supabase
    .from('sales')
    .select('slug, updated_at')
    .eq('status', 'published');
  if (sales) {
    for (const item of sales) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/sales/${item.slug}`,
          lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: altLanguages(`/sales/${item.slug}`),
        });
      }
    }
  }

  // Sales ghost pages
  const propertyTypes = ['house', 'apartment', 'land', 'commercial', 'other'];
  for (const pt of propertyTypes) {
    for (const locale of locales) {
      entries.push({ url: `${baseUrl}/${locale}/sales/category/${pt}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7, alternates: altLanguages(`/sales/category/${pt}`) });
    }
  }
  for (const area of areaSlugs) {
    for (const locale of locales) {
      entries.push({ url: `${baseUrl}/${locale}/sales/area/${area}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7, alternates: altLanguages(`/sales/area/${area}`) });
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

  // Villages / Places from DB
  const { data: villages } = await supabase.from('villages').select('slug');
  if (villages) {
    const villageContentTypes = ['', '/beaches', '/restaurants', '/activities'];
    for (const v of villages) {
      for (const ct of villageContentTypes) {
        for (const locale of locales) {
          entries.push({
            url: `${baseUrl}/${locale}/places/${v.slug}${ct}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: ct === '' ? 0.8 : 0.7,
            alternates: altLanguages(`/places/${v.slug}${ct}`),
          });
        }
      }
    }
  }

  // Mount Athos guide pages
  const mountAthosPages = ['', '/monasteries', '/how-to-visit', '/getting-there', '/accommodation', '/daily-life', '/hiking', '/history'];
  // Individual monastery pages
  const monasterySlugs = ['megisti-lavra', 'vatopedi', 'iviron', 'chilandariou', 'dionysiou', 'koutloumousiou', 'pantokratoros', 'xeropotamou', 'zografou', 'dochiariou', 'karakalou', 'philotheou', 'simonos-petras', 'agiou-pavlou', 'stavronikita', 'xenofontos', 'gregoriou', 'esphigmenou', 'agiou-panteleimonos', 'konstamonitou'];
  for (const slug of monasterySlugs) {
    mountAthosPages.push(`/monasteries/${slug}`);
  }
  for (const page of mountAthosPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/mount-athos${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: altLanguages(`/mount-athos${page}`),
      });
    }
  }

  return entries;
}
