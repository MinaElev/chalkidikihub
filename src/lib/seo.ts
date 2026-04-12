import type { Metadata } from 'next';
import { createApiClient, toLocaleMap } from './api-helpers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

/** Build OG image URL for the /api/og route */
export function ogImageUrl(title: string, type?: string, subtitle?: string): string {
  const params = new URLSearchParams({ title });
  if (type) params.set('type', type);
  if (subtitle) params.set('subtitle', subtitle);
  return `${SITE_URL}/api/og?${params.toString()}`;
}

/** Generate metadata for a collection page with OG image */
export function collectionMeta(opts: {
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  path: string;
  locale: string;
  ogType?: string;
}): Metadata {
  const { titles, descriptions, path, locale, ogType } = opts;
  const title = titles[locale] || titles.en;
  const desc = descriptions[locale] || descriptions.en;
  const image = ogImageUrl(title, ogType);
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      locale,
      siteName: 'Chalkidiki Hub',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [image],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/${path}`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/${path}`])),
    },
  };
}

// Fetch SEO meta from DB for a specific record
// Map DB table names to URL path segments
const tableToPath: Record<string, string> = {
  listings: 'listings',
  beaches: 'beaches',
  restaurants: 'restaurants',
  activities: 'activities',
  blog_articles: 'blog',
  sales: 'sales',
};

export async function getContentMeta(
  table: string,
  slug: string,
  locale: string,
  fallbackTitle: string,
  fallbackDescription: string,
): Promise<Metadata> {
  const pathSegment = tableToPath[table] || table;
  try {
    const supabase = createApiClient();
    const titleField = table === 'blog_articles' ? 'title' : 'name';

    const { data } = await supabase
      .from(table)
      .select(`
        ${titleField}_${locale}, ${titleField}_el, ${titleField}_en,
        meta_title_${locale}, meta_title_el, meta_title_en,
        meta_description_${locale}, meta_description_el, meta_description_en,
        image_url, image_alt
      `)
      .eq('slug', slug)
      .single();

    if (!data) return getDefaultMeta(fallbackTitle, fallbackDescription, locale);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = data as any;
    const title = row[`meta_title_${locale}`] || row.meta_title_el || row.meta_title_en || row[`${titleField}_${locale}`] || row[`${titleField}_el`] || fallbackTitle;
    const description = row[`meta_description_${locale}`] || row.meta_description_el || row.meta_description_en || fallbackDescription;
    const imageAlt = row.image_alt || title;

    // Map path segments to OG image types
    const segmentToOgType: Record<string, string> = {
      listings: 'listing',
      beaches: 'beach',
      restaurants: 'restaurant',
      activities: 'activity',
      blog: 'blog',
      sales: 'sales',
    };

    const image = row.image_url || ogImageUrl(title, segmentToOgType[pathSegment] || pathSegment);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        locale,
        siteName: 'Chalkidiki Hub',
        images: [{ url: image, alt: imageAlt, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `${SITE_URL}/${locale}/${pathSegment}/${slug}`,
        languages: Object.fromEntries(
          ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'].map(l => [l, `${SITE_URL}/${l}/${pathSegment}/${slug}`])
        ),
      },
    };
  } catch {
    return getDefaultMeta(fallbackTitle, fallbackDescription, locale);
  }
}

function getDefaultMeta(title: string, description: string, locale: string): Metadata {
  const image = ogImageUrl(title);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      siteName: 'Chalkidiki Hub',
      images: [{ url: image, alt: title, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// JSON-LD generators
export function generateLodgingLD(listing: Record<string, unknown>, locale: string) {
  const title = (listing.title as Record<string, string>)?.[locale] || (listing.title as Record<string, string>)?.el || '';
  const description = (listing.description as Record<string, string>)?.[locale] || (listing.description as Record<string, string>)?.el || '';
  const images = (listing.images as Array<{ image_url: string }>) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: title,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.location_name || '',
      addressRegion: 'Halkidiki',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: listing.latitude,
      longitude: listing.longitude,
    },
    priceRange: `from €${listing.price_per_night}`,
    ...(images.length > 0 ? { image: images[0].image_url } : {}),
    url: `${SITE_URL}/${locale}/listings/${listing.slug}`,
    numberOfRooms: listing.bedrooms,
  };
}

export function generateRestaurantLD(restaurant: Record<string, unknown>, locale: string) {
  const name = (restaurant.name as Record<string, string>)?.[locale] || (restaurant.name as Record<string, string>)?.el || '';
  const description = (restaurant.description as Record<string, string>)?.[locale] || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: restaurant.location_name || '',
      addressRegion: 'Halkidiki',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    },
    telephone: restaurant.phone || '',
    openingHours: restaurant.hours || '',
    priceRange: restaurant.price_level === 'budget' ? '€' : restaurant.price_level === 'moderate' ? '€€' : restaurant.price_level === 'upscale' ? '€€€' : '€€€€',
    servesCuisine: (restaurant.cuisine as string[])?.join(', ') || '',
    ...(restaurant.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: restaurant.rating, bestRating: 5, ratingCount: restaurant.reviews_count || 1 } } : {}),
    url: `${SITE_URL}/${locale}/restaurants/${restaurant.slug}`,
  };
}

export function generateBeachLD(beach: Record<string, unknown>, locale: string) {
  const name = (beach.name as Record<string, string>)?.[locale] || (beach.name as Record<string, string>)?.el || '';
  const description = (beach.description as Record<string, string>)?.[locale] || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Beach',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: beach.location_name || '',
      addressRegion: 'Halkidiki',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: beach.latitude,
      longitude: beach.longitude,
    },
    ...(beach.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: beach.rating, bestRating: 5, ratingCount: beach.reviews_count || 1 } } : {}),
    url: `${SITE_URL}/${locale}/beaches/${beach.slug}`,
  };
}

export function generateArticleLD(article: Record<string, unknown>, locale: string) {
  const title = (article.title as Record<string, string>)?.[locale] || (article.title as Record<string, string>)?.el || '';
  const description = (article.excerpt as Record<string, string>)?.[locale] || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Person', name: article.author || 'Chalkidiki Hub' },
    publisher: { '@type': 'Organization', name: 'Chalkidiki Hub' },
    datePublished: article.published_at,
    ...(article.image_url ? { image: article.image_url } : {}),
    url: `${SITE_URL}/${locale}/blog/${article.slug}`,
  };
}

export function generateActivityLD(activity: Record<string, unknown>, locale: string) {
  const name = (activity.name as Record<string, string>)?.[locale] || (activity.name as Record<string, string>)?.el || '';
  const description = (activity.description as Record<string, string>)?.[locale] || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: activity.location_name || '',
      addressRegion: 'Halkidiki',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: activity.latitude,
      longitude: activity.longitude,
    },
    url: `${SITE_URL}/${locale}/activities/${activity.slug}`,
  };
}
