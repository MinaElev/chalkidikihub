import type { Metadata } from 'next';
import { createApiClient, toLocaleMap } from './api-helpers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
const DEFAULT_LOCALE = 'el';

/** Build locale-prefixed URL: default locale has no prefix (as-needed) */
export function localeUrl(locale: string, path: string = '') {
  return locale === DEFAULT_LOCALE
    ? `${SITE_URL}${path ? `/${path}` : ''}`
    : `${SITE_URL}/${locale}${path ? `/${path}` : ''}`;
}

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
      canonical: localeUrl(locale, path),
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, path)])),
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

    // Use select('*') to avoid issues with missing columns across different tables
    // (e.g. listings uses title_*, beaches uses name_*, some tables may lack meta_* columns)
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return getDefaultMeta(fallbackTitle, fallbackDescription, locale, pathSegment, slug);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = data as any;

    // Determine which field holds the display name (title for listings/sales/blog, name for others)
    const titleField = (table === 'blog_articles' || table === 'listings' || table === 'sales') ? 'title' : 'name';

    const title = row[`meta_title_${locale}`] || row.meta_title_el || row.meta_title_en
      || row[`${titleField}_${locale}`] || row[`${titleField}_el`] || row[`${titleField}_en`] || fallbackTitle;
    const description = row[`meta_description_${locale}`] || row.meta_description_el || row.meta_description_en
      || row[`description_${locale}`] || row.description_el || row.description_en || fallbackDescription;
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
        canonical: localeUrl(locale, `${pathSegment}/${slug}`),
        languages: Object.fromEntries(
          LOCALES.map(l => [l, localeUrl(l, `${pathSegment}/${slug}`)])
        ),
      },
    };
  } catch {
    return getDefaultMeta(fallbackTitle, fallbackDescription, locale, pathSegment, slug);
  }
}

function getDefaultMeta(title: string, description: string, locale: string, pathSegment?: string, slug?: string): Metadata {
  const image = ogImageUrl(title);
  const path = pathSegment && slug ? `${pathSegment}/${slug}` : pathSegment || '';
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
    ...(path ? {
      alternates: {
        canonical: localeUrl(locale, path),
        languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, path)])),
      },
    } : {}),
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
    url: localeUrl(locale, `listings/${listing.slug}`),
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
    url: localeUrl(locale, `restaurants/${restaurant.slug}`),
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
    // Note: aggregateRating omitted — Google doesn't support review snippets for Beach type
    url: localeUrl(locale, `beaches/${beach.slug}`),
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
    url: localeUrl(locale, `blog/${article.slug}`),
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
    url: localeUrl(locale, `activities/${activity.slug}`),
  };
}
