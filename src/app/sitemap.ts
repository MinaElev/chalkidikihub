import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { createApiClient } from '@/lib/api-helpers';
import { AREAS } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// Revalidate sitemap every hour (ISR)
export const revalidate = 3600;

function alt(path: string) {
  return {
    languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${path}`])),
  };
}

function forLocales(
  path: string,
  opts: { freq: MetadataRoute.Sitemap[0]['changeFrequency']; priority: number; modified?: Date },
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}${path}`,
    lastModified: opts.modified || new Date(),
    changeFrequency: opts.freq,
    priority: opts.priority,
    alternates: alt(path),
  }));
}

// ---------- Sitemap Index ----------
// IDs: 0=core, 1=beaches, 2=restaurants, 3=listings, 4=activities, 5=blog, 6=sales, 7=villages, 8=mount-athos, 9=ghost-pages

export async function generateSitemaps() {
  return [
    { id: 0 },  // core & static pages
    { id: 1 },  // beaches
    { id: 2 },  // restaurants
    { id: 3 },  // listings
    { id: 4 },  // activities
    { id: 5 },  // blog
    { id: 6 },  // sales
    { id: 7 },  // villages / places
    { id: 8 },  // mount athos
    { id: 9 },  // ghost pages (guides, best, features, types)
  ];
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const supabase = createApiClient();

  switch (id) {
    // ==================== 0: Core & Static ====================
    case 0: {
      const entries: MetadataRoute.Sitemap = [];

      // Homepage
      entries.push(...forLocales('', { freq: 'daily', priority: 1 }));

      // Static pages
      const staticPages = [
        { path: '/listings', priority: 0.9, freq: 'daily' as const },
        { path: '/beaches', priority: 0.9, freq: 'daily' as const },
        { path: '/restaurants', priority: 0.9, freq: 'daily' as const },
        { path: '/activities', priority: 0.8, freq: 'weekly' as const },
        { path: '/ev-chargers', priority: 0.7, freq: 'weekly' as const },
        { path: '/blog', priority: 0.8, freq: 'daily' as const },
        { path: '/sales', priority: 0.9, freq: 'daily' as const },
        { path: '/areas', priority: 0.8, freq: 'weekly' as const },
        { path: '/map', priority: 0.6, freq: 'weekly' as const },
        { path: '/contact', priority: 0.5, freq: 'monthly' as const },
        { path: '/for-owners', priority: 0.7, freq: 'monthly' as const },
        { path: '/terms', priority: 0.3, freq: 'yearly' as const },
        { path: '/privacy', priority: 0.3, freq: 'yearly' as const },
      ];
      for (const page of staticPages) {
        entries.push(...forLocales(page.path, { freq: page.freq, priority: page.priority }));
      }

      // Areas
      for (const area of AREAS) {
        entries.push(...forLocales(`/areas/${area.slug}`, { freq: 'weekly', priority: 0.8 }));
      }

      return entries;
    }

    // ==================== 1: Beaches ====================
    case 1: {
      const entries: MetadataRoute.Sitemap = [];
      const { data: beaches } = await supabase.from('beaches').select('slug, updated_at');
      if (beaches) {
        for (const item of beaches) {
          entries.push(...forLocales(`/beaches/${item.slug}`, {
            freq: 'weekly',
            priority: 0.7,
            modified: item.updated_at ? new Date(item.updated_at) : undefined,
          }));
        }
      }
      // Beaches by area
      for (const area of ['kassandra', 'sithonia', 'athos', 'mainland']) {
        entries.push(...forLocales(`/beaches/area/${area}`, { freq: 'weekly', priority: 0.7 }));
      }
      return entries;
    }

    // ==================== 2: Restaurants ====================
    case 2: {
      const entries: MetadataRoute.Sitemap = [];
      const { data: restaurants } = await supabase.from('restaurants').select('slug, updated_at');
      if (restaurants) {
        for (const item of restaurants) {
          entries.push(...forLocales(`/restaurants/${item.slug}`, {
            freq: 'monthly',
            priority: 0.7,
            modified: item.updated_at ? new Date(item.updated_at) : undefined,
          }));
        }
      }
      // Business types
      const { data: businessTypes } = await supabase.from('business_types').select('slug');
      if (businessTypes) {
        for (const bt of businessTypes) {
          entries.push(...forLocales(`/restaurants/category/${bt.slug}`, { freq: 'weekly', priority: 0.7 }));
        }
      }
      // Restaurants by area
      for (const area of ['kassandra', 'sithonia', 'athos', 'mainland']) {
        entries.push(...forLocales(`/restaurants/area/${area}`, { freq: 'weekly', priority: 0.7 }));
      }
      return entries;
    }

    // ==================== 3: Listings ====================
    case 3: {
      const entries: MetadataRoute.Sitemap = [];
      const { data: listings } = await supabase.from('listings').select('slug, updated_at').eq('status', 'published');
      if (listings) {
        for (const item of listings) {
          entries.push(...forLocales(`/listings/${item.slug}`, {
            freq: 'weekly',
            priority: 0.8,
            modified: new Date(item.updated_at),
          }));
        }
      }
      return entries;
    }

    // ==================== 4: Activities ====================
    case 4: {
      const entries: MetadataRoute.Sitemap = [];
      const { data: activities } = await supabase.from('activities').select('slug, updated_at');
      if (activities) {
        for (const item of activities) {
          entries.push(...forLocales(`/activities/${item.slug}`, {
            freq: 'monthly',
            priority: 0.7,
            modified: item.updated_at ? new Date(item.updated_at) : undefined,
          }));
        }
      }
      // Activities by category
      for (const cat of ['historical', 'nature', 'waterSports', 'boatTrips', 'wellness', 'family', 'nightlife', 'religious']) {
        entries.push(...forLocales(`/activities/category/${cat}`, { freq: 'weekly', priority: 0.7 }));
      }
      // Activities by area
      for (const area of ['kassandra', 'sithonia', 'athos', 'mainland']) {
        entries.push(...forLocales(`/activities/area/${area}`, { freq: 'weekly', priority: 0.7 }));
      }
      return entries;
    }

    // ==================== 5: Blog ====================
    case 5: {
      const entries: MetadataRoute.Sitemap = [];
      const { data: articles } = await supabase.from('blog_articles').select('slug, published_at, updated_at');
      if (articles) {
        for (const item of articles) {
          entries.push(...forLocales(`/blog/${item.slug}`, {
            freq: 'monthly',
            priority: 0.8,
            modified: new Date(item.updated_at || item.published_at),
          }));
        }
      }
      // Blog by category
      for (const cat of ['guides', 'beaches', 'food', 'activities', 'tips', 'culture']) {
        entries.push(...forLocales(`/blog/category/${cat}`, { freq: 'weekly', priority: 0.7 }));
      }
      return entries;
    }

    // ==================== 6: Sales ====================
    case 6: {
      const entries: MetadataRoute.Sitemap = [];
      const { data: sales } = await supabase.from('sales').select('slug, updated_at').eq('status', 'published');
      if (sales) {
        for (const item of sales) {
          entries.push(...forLocales(`/sales/${item.slug}`, {
            freq: 'weekly',
            priority: 0.8,
            modified: item.updated_at ? new Date(item.updated_at) : undefined,
          }));
        }
      }
      // Sales by type
      for (const pt of ['house', 'apartment', 'land', 'commercial', 'other']) {
        entries.push(...forLocales(`/sales/category/${pt}`, { freq: 'weekly', priority: 0.7 }));
      }
      // Sales by area
      for (const area of ['kassandra', 'sithonia', 'athos', 'mainland']) {
        entries.push(...forLocales(`/sales/area/${area}`, { freq: 'weekly', priority: 0.7 }));
      }
      return entries;
    }

    // ==================== 7: Villages / Places ====================
    case 7: {
      const entries: MetadataRoute.Sitemap = [];
      const { data: villages } = await supabase.from('villages').select('slug');
      if (villages) {
        const contentTypes = ['', '/beaches', '/restaurants', '/activities'];
        for (const v of villages) {
          for (const ct of contentTypes) {
            entries.push(...forLocales(`/places/${v.slug}${ct}`, {
              freq: 'weekly',
              priority: ct === '' ? 0.8 : 0.7,
            }));
          }
        }
      }
      return entries;
    }

    // ==================== 8: Mount Athos ====================
    case 8: {
      const entries: MetadataRoute.Sitemap = [];
      const mainPages = ['', '/monasteries', '/how-to-visit', '/getting-there', '/accommodation', '/daily-life', '/hiking', '/history'];
      for (const page of mainPages) {
        entries.push(...forLocales(`/mount-athos${page}`, { freq: 'monthly', priority: 0.8 }));
      }
      // Individual monasteries
      const monasterySlugs = [
        'megisti-lavra', 'vatopedi', 'iviron', 'chilandariou', 'dionysiou', 'koutloumousiou',
        'pantokratoros', 'xeropotamou', 'zografou', 'dochiariou', 'karakalou', 'philotheou',
        'simonos-petras', 'agiou-pavlou', 'stavronikita', 'xenofontos', 'gregoriou',
        'esphigmenou', 'agiou-panteleimonos', 'konstamonitou',
      ];
      for (const slug of monasterySlugs) {
        entries.push(...forLocales(`/mount-athos/monasteries/${slug}`, { freq: 'monthly', priority: 0.8 }));
      }
      return entries;
    }

    // ==================== 9: Ghost Pages ====================
    case 9: {
      const entries: MetadataRoute.Sitemap = [];

      // Beach features
      for (const feat of ['sandy', 'pebble', 'organized', 'free', 'shallowWater', 'waterSports', 'accessible', 'beachBar', 'sunbeds', 'lifeguard', 'nudist', 'parking']) {
        entries.push(...forLocales(`/beaches/feature/${feat}`, { freq: 'weekly', priority: 0.7 }));
      }
      // Seasonal guides
      for (const g of ['summer', 'easter', 'honeymoon', 'families', 'budget', 'winter', 'nightlife']) {
        entries.push(...forLocales(`/guide/${g}`, { freq: 'monthly', priority: 0.8 }));
      }
      // Listing types
      for (const t of ['with-pool', 'sea-view', 'pet-friendly', 'family', 'budget', 'luxury']) {
        entries.push(...forLocales(`/listings/type/${t}`, { freq: 'weekly', priority: 0.7 }));
      }
      // Best of guides
      for (const g of ['beaches-kassandra', 'beaches-sithonia', 'family-beaches', 'quiet-beaches', 'seafood-restaurants', 'beach-bars', 'romantic-restaurants', 'hiking-trails', 'historical-sites', 'water-sports', 'restaurants-kassandra', 'restaurants-sithonia']) {
        entries.push(...forLocales(`/best/${g}`, { freq: 'weekly', priority: 0.8 }));
      }

      return entries;
    }

    default:
      return [];
  }
}
