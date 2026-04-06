import type { Metadata } from 'next';
import { createApiClient, toLocaleMap } from './api-helpers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// Fetch SEO meta from DB for a specific record
// Map DB table names to URL path segments
const tableToPath: Record<string, string> = {
  listings: 'listings',
  beaches: 'beaches',
  restaurants: 'restaurants',
  activities: 'activities',
  blog_articles: 'blog',
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
    const image = row.image_url || '';
    const imageAlt = row.image_alt || title;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        locale,
        siteName: 'Chalkidiki Hub',
        ...(image ? { images: [{ url: image, alt: imageAlt, width: 1200, height: 630 }] } : {}),
      },
      twitter: {
        card: image ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
      alternates: {
        canonical: `${SITE_URL}/${locale}/${pathSegment}/${slug}`,
        languages: {
          el: `${SITE_URL}/el/${pathSegment}/${slug}`,
          en: `${SITE_URL}/en/${pathSegment}/${slug}`,
          de: `${SITE_URL}/de/${pathSegment}/${slug}`,
          bg: `${SITE_URL}/bg/${pathSegment}/${slug}`,
          ru: `${SITE_URL}/ru/${pathSegment}/${slug}`,
          ro: `${SITE_URL}/ro/${pathSegment}/${slug}`,
        },
      },
    };
  } catch {
    return getDefaultMeta(fallbackTitle, fallbackDescription, locale);
  }
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/icons/icon-512.png`;

function getDefaultMeta(title: string, description: string, locale: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      siteName: 'Chalkidiki Hub',
      images: [{ url: DEFAULT_OG_IMAGE, alt: 'Chalkidiki Hub', width: 512, height: 512 }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
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
