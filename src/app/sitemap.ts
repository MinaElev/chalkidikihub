import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { seedListings } from '@/lib/seed-data';
import { seedBeaches } from '@/lib/seed-beaches';
import { seedChargers } from '@/lib/seed-chargers';
import { seedArticles } from '@/lib/seed-blog';
import { seedActivities } from '@/lib/seed-activities';
import { seedRestaurants } from '@/lib/seed-restaurants';
import { AREAS } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://halkidikihub.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    });
  }

  // Listings page
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/listings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Individual listings
  for (const listing of seedListings) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/listings/${listing.slug}`,
        lastModified: new Date(listing.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/listings/${listing.slug}`])
          ),
        },
      });
    }
  }

  // Areas
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/areas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const area of AREAS) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/areas/${area.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/areas/${area.slug}`])
          ),
        },
      });
    }
  }

  // Beaches page
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/beaches`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Individual beaches
  for (const beach of seedBeaches) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/beaches/${beach.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/beaches/${beach.slug}`])
          ),
        },
      });
    }
  }

  // EV Chargers page
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/ev-chargers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Individual chargers
  for (const charger of seedChargers) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/ev-chargers/${charger.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/ev-chargers/${charger.slug}`])
          ),
        },
      });
    }
  }

  // Blog page
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Individual articles
  for (const article of seedArticles) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${article.slug}`,
        lastModified: new Date(article.published_at),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/blog/${article.slug}`])
          ),
        },
      });
    }
  }

  // Activities page
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/activities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Individual activities
  for (const activity of seedActivities) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/activities/${activity.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/activities/${activity.slug}`])
          ),
        },
      });
    }
  }

  // Restaurants page
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/restaurants`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Individual restaurants
  for (const restaurant of seedRestaurants) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/restaurants/${restaurant.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/restaurants/${restaurant.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
