import type { Metadata } from 'next';
import { createApiClient, toLocaleMap } from './api-helpers';
import { publicLocales } from '@/i18n/config';
import { isThinContent } from './content-quality';
import { getAuthor, authorUrl } from './authors';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
// hreflang alternates ship only the public locales — hidden locales still
// resolve at the route level but we don't advertise them to search engines.
const LOCALES = publicLocales;
const DEFAULT_LOCALE = 'el';

/**
 * Social profile URLs for the Organization schema's `sameAs` property.
 * Google uses these to merge the Knowledge Graph entity with social handles.
 *
 * Each entry prefers an env override (so a network can be swapped without a
 * deploy) and falls back to the known public profile, so the `sameAs` block
 * always renders in production even before env vars are configured on Vercel.
 * Set the matching env var to a single space to suppress a default.
 */
export const SOCIAL_LINKS: string[] = [
  process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/groups/1738995400608595',
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/chalkidikihub/',
  process.env.NEXT_PUBLIC_TWITTER_URL,
  process.env.NEXT_PUBLIC_YOUTUBE_URL,
  process.env.NEXT_PUBLIC_TIKTOK_URL,
  process.env.NEXT_PUBLIC_LINKEDIN_URL,
].filter((url): url is string => Boolean(url && url.trim()));

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
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, path)])),
        'x-default': localeUrl(DEFAULT_LOCALE, path),
      },
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

// Tables that have a /api/md/<type>/<slug> markdown alternative. Used to
// emit <link rel="alternate" type="text/markdown"> on detail pages, so AI
// agents (Perplexity, Claude tool-use, Bing Copilot) discover the clean
// machine-readable variant directly from the HTML page.
const mdSupportedTables = new Set(['listings', 'beaches', 'restaurants', 'activities', 'sales', 'villages']);

function mdTypeFor(table: string): string {
  // Villages live at /places/<slug> on the site, and /api/md/places/<slug>
  // in the markdown surface — keep the public route convention.
  if (table === 'villages') return 'places';
  return table;
}

/**
 * Builds a richer Article JSON-LD payload for the templated content pages
 * (/itinerary, /from, /costs, /guide). Beyond the minimal headline/dates/
 * author block, we add mainEntityOfPage, image, articleSection, inLanguage,
 * and a wordCount estimate — properties Google uses for Discover/Top
 * Stories eligibility and that AI assistants quote when summarising.
 */
export function generateTemplatedArticleLD(opts: {
  url: string;
  headline: string;
  description: string;
  locale: string;
  section: string; // "Itinerary" | "Travel guide" | "Cost guide" | "Halkidiki guide"
  htmlContent?: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const wordCount = opts.htmlContent
    ? opts.htmlContent
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean).length
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    headline: opts.headline,
    description: opts.description,
    articleSection: opts.section,
    inLanguage: opts.locale,
    // Speakable — the headline + intro paragraph a voice/AI assistant reads aloud.
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.prose p'] },
    ...(wordCount ? { wordCount } : {}),
    ...(opts.imageUrl ? { image: [opts.imageUrl] } : {}),
    datePublished: opts.datePublished || '2025-06-01',
    dateModified: opts.dateModified || '2026-05-29',
    author: { '@type': 'Organization', name: 'ChalkidikiHub', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'ChalkidikiHub',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png` },
    },
  };
}

export async function getContentMeta(
  table: string,
  slug: string,
  locale: string,
  fallbackTitle: string,
  fallbackDescription: string,
  opts?: { thinThreshold?: number; thinField?: string },
): Promise<Metadata> {
  const pathSegment = tableToPath[table] || table;
  try {
    const supabase = createApiClient();

    // Use select('*') to avoid issues with missing columns across different tables
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('slug', slug)
      .single();

    // Row not found (or transient error). Mark the response noindex so Google
    // doesn't catalogue these soft-404 pages with generic placeholder content
    // — important since Next 16 + force-dynamic currently returns 200 even
    // when the page calls notFound(). Without this, every deprecated/typo'd
    // slug becomes an indexable duplicate against real pages.
    if (error || !data) {
      return {
        ...getDefaultMeta(fallbackTitle, fallbackDescription, locale, pathSegment, slug),
        robots: { index: false, follow: false },
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = data as any;

    // Determine which field holds the display name (title for listings/sales/blog, name for others)
    const titleField = (table === 'blog_articles' || table === 'listings' || table === 'sales') ? 'title' : 'name';

    // 1. Use explicit meta_title if set in DB
    const explicitTitle = row[`meta_title_${locale}`] || row.meta_title_el || row.meta_title_en;
    const explicitDesc = row[`meta_description_${locale}`] || row.meta_description_el || row.meta_description_en;

    // 2. Smart fallback: build rich title from content fields
    const displayName = row[`${titleField}_${locale}`] || row[`${titleField}_el`] || row[`${titleField}_en`] || '';
    const title = explicitTitle || buildSmartTitle(table, displayName, row, locale) || fallbackTitle;
    const description = explicitDesc || buildSmartDescription(table, displayName, row, locale) || row[`description_${locale}`] || row.description_el || row.description_en || fallbackDescription;
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

    // Auto-noindex pages whose primary user-facing description is too thin
    // for AdSense/Google quality bars. Falls back to the source description
    // (not meta_description) so listings with rich meta but empty body
    // still get filtered.
    //
    // Two measurement modes: char-length against `description_<locale>`
    // (thinThreshold — the original mechanism, still used by listings/sales/
    // restaurants/activities/beaches), or word-count against a different
    // field (thinField — for tables like blog_articles where the real body
    // lives in `content_<locale>` and `description_<locale>` doesn't exist).
    // Same isThinContent() helper /guide and /places already use.
    let isThin = false;
    if (opts?.thinField) {
      const field = opts.thinField;
      const body = row[`${field}_${locale}`] || row[`${field}_el`] || row[`${field}_en`] || '';
      isThin = isThinContent(body);
    } else if (opts?.thinThreshold != null) {
      const sourceDesc =
        row[`description_${locale}`] || row.description_el || row.description_en || '';
      isThin = sourceDesc.trim().length < opts.thinThreshold;
    }

    return {
      title,
      description,
      ...(isThin ? { robots: { index: false, follow: true } } : {}),
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
        languages: {
          ...Object.fromEntries(
            LOCALES.map(l => [l, localeUrl(l, `${pathSegment}/${slug}`)])
          ),
          'x-default': localeUrl(DEFAULT_LOCALE, `${pathSegment}/${slug}`),
        },
        // Markdown alternate for entity types that expose /api/md/<type>/<slug>.
        // Lets Perplexity / Claude tool-use / Bing Copilot etc. discover the
        // clean markdown surface from the HTML page itself, without us having
        // to negotiate via Accept: text/markdown.
        ...(mdSupportedTables.has(table)
          ? {
              types: {
                'text/markdown': `${SITE_URL}/api/md/${mdTypeFor(table)}/${slug}?locale=${locale}`,
              },
            }
          : {}),
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
        languages: {
          ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, path)])),
          'x-default': localeUrl(DEFAULT_LOCALE, path),
        },
      },
    } : {}),
  };
}

// ── Smart Meta Builders ──────────────────────────────────────────────
// Generate rich titles & descriptions from content fields when meta_title is not explicitly set.
// This dramatically improves CTR in Google search results.

const AREA_NAMES: Record<string, Record<string, string>> = {
  kassandra: { el: 'Κασσάνδρα', en: 'Kassandra', de: 'Kassandra', bg: 'Касандра', ru: 'Кассандра', ro: 'Kassandra', sr: 'Kasandra' },
  sithonia: { el: 'Σιθωνία', en: 'Sithonia', de: 'Sithonia', bg: 'Ситония', ru: 'Ситония', ro: 'Sithonia', sr: 'Sitonija' },
  athos: { el: 'Άθως', en: 'Athos', de: 'Athos', bg: 'Атон', ru: 'Афон', ro: 'Athos', sr: 'Atos' },
  mainland: { el: 'Ηπειρωτική Χαλκιδική', en: 'Mainland Halkidiki', de: 'Festland Chalkidiki', bg: 'Халкидики', ru: 'Халкидики', ro: 'Halkidiki', sr: 'Halkidiki' },
};

const SMART_TITLE_SUFFIX: Record<string, Record<string, string>> = {
  beaches: {
    el: 'Φωτογραφίες, Χάρτης & Κριτικές',
    en: 'Photos, Map & Reviews',
    de: 'Fotos, Karte & Bewertungen',
    bg: 'Снимки, Карта & Отзиви',
    ru: 'Фото, Карта & Отзывы',
    ro: 'Fotografii, Hartă & Recenzii',
    sr: 'Fotografije, Mapa & Recenzije',
  },
  restaurants: {
    el: 'Μενού, Τιμές & Κριτικές',
    en: 'Menu, Prices & Reviews',
    de: 'Menü, Preise & Bewertungen',
    bg: 'Меню, Цени & Отзиви',
    ru: 'Меню, Цены & Отзывы',
    ro: 'Meniu, Prețuri & Recenzii',
    sr: 'Meni, Cene & Recenzije',
  },
  activities: {
    el: 'Πληροφορίες, Τιμές & Κριτικές',
    en: 'Info, Prices & Reviews',
    de: 'Info, Preise & Bewertungen',
    bg: 'Информация, Цени & Отзиви',
    ru: 'Информация, Цены & Отзывы',
    ro: 'Info, Prețuri & Recenzii',
    sr: 'Info, Cene & Recenzije',
  },
  listings: {
    el: 'Τιμές, Παροχές & Κράτηση',
    en: 'Prices, Amenities & Booking',
    de: 'Preise, Ausstattung & Buchung',
    bg: 'Цени, Удобства & Резервация',
    ru: 'Цены, Удобства & Бронирование',
    ro: 'Prețuri, Facilități & Rezervare',
    sr: 'Cene, Pogodnosti & Rezervacija',
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSmartTitle(table: string, name: string, row: any, locale: string): string {
  if (!name) return '';
  const pathSegment = tableToPath[table] || table;
  const area = row.area as string;
  const areaName = area ? (AREA_NAMES[area]?.[locale] || AREA_NAMES[area]?.en || '') : '';
  const location = row.location_name as string || '';
  const suffix = SMART_TITLE_SUFFIX[pathSegment]?.[locale] || SMART_TITLE_SUFFIX[pathSegment]?.en || '';

  // Use short location (village name) or area name
  const loc = location ? location.split(',')[0].trim() : areaName;

  switch (pathSegment) {
    case 'beaches': {
      // "Παραλία Καρύδι, Σιθωνία — Φωτογραφίες, Χάρτης & Κριτικές"
      const prefix = locale === 'el' ? 'Παραλία' : locale === 'de' ? 'Strand' : locale === 'ru' ? 'Пляж' : locale === 'bg' ? 'Плаж' : 'Beach';
      const fullName = name.includes(prefix) ? name : `${prefix} ${name}`;
      return loc ? `${fullName}, ${loc} — ${suffix}` : `${fullName} — ${suffix}`;
    }
    case 'restaurants': {
      // "Mr Coffee (Café) στον Πολύγυρο — Μενού, Τιμές 2026"
      const cuisine = (row.cuisine as string[]) || [];
      const cuisineStr = cuisine.length > 0 ? String(cuisine[0]) : '';
      const base = cuisineStr ? `${name} (${cuisineStr})` : name;
      const inLoc = locale === 'el' ? `στη ${loc}`
        : locale === 'de' ? `in ${loc}`
        : locale === 'bg' ? `в ${loc}`
        : locale === 'ru' ? `в ${loc}`
        : locale === 'ro' ? `în ${loc}`
        : locale === 'sr' ? `у ${loc}`
        : `in ${loc}`;
      return loc ? `${base} ${inLoc} — ${suffix} 2026` : `${base} — ${suffix} 2026`;
    }
    case 'activities': {
      return loc ? `${name}, ${loc} — ${suffix}` : `${name} — ${suffix}`;
    }
    case 'listings': {
      // "Villa Sunrise, Κασσάνδρα — Τιμές, Παροχές & Κράτηση"
      return loc ? `${name}, ${loc} — ${suffix}` : `${name} — ${suffix}`;
    }
    case 'blog': {
      return name; // Blog titles are usually already good
    }
    case 'sales': {
      return loc ? `${name}, ${loc}` : name;
    }
    default:
      return name;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSmartDescription(table: string, name: string, row: any, locale: string): string {
  if (!name) return '';
  const pathSegment = tableToPath[table] || table;
  const area = row.area as string;
  const areaName = area ? (AREA_NAMES[area]?.[locale] || AREA_NAMES[area]?.en || '') : '';
  const location = row.location_name as string || '';
  const rating = row.rating as number;
  const reviewsCount = row.reviews_count as number;
  const halkidiki = locale === 'el' ? 'Χαλκιδική' : 'Halkidiki';

  const ratingStr = rating ? (locale === 'el' ? `⭐ ${rating}/5` : `⭐ ${rating}/5`) : '';
  const reviewStr = reviewsCount ? (locale === 'el' ? `(${reviewsCount} κριτικές)` : `(${reviewsCount} reviews)`) : '';

  switch (pathSegment) {
    case 'beaches': {
      const features = (row.features as string[]) || [];
      const featureWords: string[] = [];
      if (locale === 'el') {
        if (features.includes('sandy')) featureWords.push('Αμμώδης');
        if (features.includes('pebble')) featureWords.push('Βοτσαλωτή');
        if (features.includes('organized')) featureWords.push('Οργανωμένη');
        if (features.includes('free')) featureWords.push('Ελεύθερη');
        if (features.includes('shallowWater')) featureWords.push('Ρηχά νερά');
        if (features.includes('waterSports')) featureWords.push('Water sports');
        return `Ανακαλύψτε την παραλία ${name}${location ? ` στη ${location}` : ''}, ${halkidiki}. ${featureWords.join(', ')}. ${ratingStr} ${reviewStr} Φωτογραφίες, χάρτης, οδηγίες.`.trim();
      }
      if (features.includes('sandy')) featureWords.push('Sandy');
      if (features.includes('organized')) featureWords.push('Organized');
      if (features.includes('free')) featureWords.push('Free');
      if (features.includes('shallowWater')) featureWords.push('Shallow water');
      return `Discover ${name} beach${location ? ` in ${location}` : ''}, ${halkidiki}. ${featureWords.join(', ')}. ${ratingStr} ${reviewStr} Photos, map, directions.`.trim();
    }
    case 'restaurants': {
      const cuisine = (row.cuisine as string[]) || [];
      const cuisineStr = cuisine.length > 0 ? cuisine.slice(0, 3).join(', ') : '';
      const priceLevel = row.price_level as string;
      const priceStr = priceLevel === 'budget' ? '€' : priceLevel === 'moderate' ? '€€' : priceLevel === 'upscale' ? '€€€' : priceLevel === 'fineDining' ? '€€€€' : '';
      if (locale === 'el') {
        return `${name}${location ? ` στη ${location}` : ''}, ${halkidiki}. ${cuisineStr ? `${cuisineStr}.` : ''} ${priceStr ? `Τιμές: ${priceStr}.` : ''} ${ratingStr} ${reviewStr} Δείτε μενού, ώρες λειτουργίας & τηλέφωνο.`.trim();
      }
      return `${name}${location ? ` in ${location}` : ''}, ${halkidiki}. ${cuisineStr ? `${cuisineStr}.` : ''} ${priceStr ? `Prices: ${priceStr}.` : ''} ${ratingStr} ${reviewStr} See menu, hours & contact.`.trim();
    }
    case 'activities': {
      const priceRange = row.price_range as string || '';
      const duration = row.duration as string || '';
      if (locale === 'el') {
        return `${name}${location ? ` στη ${location}` : ''}, ${halkidiki}. ${priceRange ? `Τιμή: ${priceRange}.` : ''} ${duration ? `Διάρκεια: ${duration}.` : ''} ${ratingStr} ${reviewStr} Πληροφορίες & κράτηση.`.trim();
      }
      return `${name}${location ? ` in ${location}` : ''}, ${halkidiki}. ${priceRange ? `Price: ${priceRange}.` : ''} ${duration ? `Duration: ${duration}.` : ''} ${ratingStr} ${reviewStr} Info & booking.`.trim();
    }
    case 'listings': {
      const price = row.price_per_night as number;
      const bedrooms = row.bedrooms as number;
      const guests = row.guests_max as number;
      const amenities = (row.amenities as string[]) || [];
      const hasPool = amenities.includes('pool');
      const hasSeaView = amenities.includes('seaView');
      if (locale === 'el') {
        const parts = [`${name}${location ? ` στη ${location}` : ''}, ${halkidiki}.`];
        if (price) parts.push(`Από €${price}/βράδυ.`);
        if (bedrooms) parts.push(`${bedrooms} υπνοδωμάτια${guests ? `, έως ${guests} άτομα` : ''}.`);
        if (hasPool) parts.push('Πισίνα.');
        if (hasSeaView) parts.push('Θέα θάλασσα.');
        parts.push('Φωτογραφίες & κράτηση.');
        return parts.join(' ').trim();
      }
      const parts = [`${name}${location ? ` in ${location}` : ''}, ${halkidiki}.`];
      if (price) parts.push(`From €${price}/night.`);
      if (bedrooms) parts.push(`${bedrooms} bedrooms${guests ? `, up to ${guests} guests` : ''}.`);
      if (hasPool) parts.push('Pool.');
      if (hasSeaView) parts.push('Sea view.');
      parts.push('Photos & booking.');
      return parts.join(' ').trim();
    }
    default:
      return '';
  }
}

// JSON-LD generators

/**
 * Map stored reviews to Schema.org Review nodes for an entity's `review` array.
 * Enables review rich snippets (Restaurant/Activity) and gives LLM crawlers
 * quotable UGC. Handles both the transformed `comment` locale-map and the raw
 * `comment_el` column. Capped at 5 to keep the payload lean.
 */
function mapReviewsLD(reviews: unknown, locale: string): object[] {
  if (!Array.isArray(reviews)) return [];
  return reviews.slice(0, 5).map((raw) => {
    const r = raw as Record<string, unknown>;
    const commentMap = r.comment as Record<string, string> | undefined;
    const body = commentMap?.[locale] || commentMap?.el || commentMap?.en || (r.comment_el as string) || '';
    return {
      '@type': 'Review',
      author: { '@type': 'Person', name: (r.author_name as string) || 'Guest' },
      reviewRating: { '@type': 'Rating', ratingValue: Number(r.rating) || 0, bestRating: 5, worstRating: 1 },
      ...(body ? { reviewBody: body } : {}),
      ...(r.created_at ? { datePublished: String(r.created_at).slice(0, 10) } : {}),
    };
  });
}

/** Generate a BreadcrumbList JSON-LD schema for detail pages */
export function generateBreadcrumbLD(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': item.name,
      'item': item.url,
    })),
  };
}

/** Generate an ItemList JSON-LD schema for collection/listing pages */
export function generateItemListLD(
  name: string,
  items: { name: string; url: string }[],
): object {
  const capped = items.slice(0, 20);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: capped.length,
    itemListElement: capped.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: item.url,
      name: item.name,
    })),
  };
}

export function generateLodgingLD(listing: Record<string, unknown>, locale: string) {
  const title = (listing.title as Record<string, string>)?.[locale] || (listing.title as Record<string, string>)?.el || '';
  const description = (listing.description as Record<string, string>)?.[locale] || (listing.description as Record<string, string>)?.el || '';
  const images = (listing.images as Array<{ image_url: string }>) || [];
  const pricePerNight = listing.price_per_night ? Number(listing.price_per_night) : null;
  const currency = (listing.currency as string) || 'EUR';
  // Owner may override; otherwise sensible defaults for Greece (legally 14:00/12:00, in practice 16:00/11:00).
  const checkin = (listing.checkin_time as string) || '16:00';
  const checkout = (listing.checkout_time as string) || '11:00';
  const guestsMax = listing.guests_max ? Number(listing.guests_max) : null;

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
    priceRange: pricePerNight ? `€${pricePerNight} - €${Math.round(pricePerNight * 3)}` : '€€',
    ...(pricePerNight
      ? {
          // Richer offer block for AI agents / Google so they can quote concrete numbers.
          makesOffer: {
            '@type': 'Offer',
            priceCurrency: currency,
            price: pricePerNight,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: pricePerNight,
              priceCurrency: currency,
              unitText: 'NIGHT',
            },
            url: localeUrl(locale, `listings/${listing.slug}`),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    ...(images.length > 0 ? { image: images.map(i => i.image_url) } : {}),
    url: localeUrl(locale, `listings/${listing.slug}`),
    numberOfRooms: listing.bedrooms,
    ...(guestsMax ? { occupancy: { '@type': 'QuantitativeValue', maxValue: guestsMax } } : {}),
    checkinTime: checkin,
    checkoutTime: checkout,
    amenityFeature: (listing.amenities as string[])?.map(a => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })),
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
    servesCuisine: (restaurant.cuisine as string[]) || [],
    // Only emit aggregateRating when there are REAL reviews. Fabricating a
    // ratingCount of 1 for unrated places is spammy structured data and risks
    // a Google manual action — gate on reviews_count > 0 (same rule as activities).
    ...(restaurant.rating && Number(restaurant.reviews_count) > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: restaurant.rating,
            bestRating: 5,
            worstRating: 1,
            ratingCount: restaurant.reviews_count,
            reviewCount: restaurant.reviews_count,
          },
        }
      : {}),
    ...(() => { const rv = mapReviewsLD(restaurant.reviews, locale); return rv.length ? { review: rv } : {}; })(),
    url: localeUrl(locale, `restaurants/${restaurant.slug}`),
  };
}

// Beach feature flag → human-readable amenity name for the schema's
// amenityFeature. Lets AI crawlers extract structured attributes (sandy,
// organized, parking…) without parsing prose.
const BEACH_AMENITY_NAMES: Record<string, string> = {
  sandy: 'Sandy beach',
  pebble: 'Pebble beach',
  organized: 'Organized (sunbeds & umbrellas)',
  free: 'Free / unorganized access',
  sunbeds: 'Sunbeds & umbrellas',
  beachBar: 'Beach bar',
  waterSports: 'Water sports',
  shallowWater: 'Shallow water',
  parking: 'Parking',
  lifeguard: 'Lifeguard',
  accessible: 'Wheelchair accessible',
  nudist: 'Naturist area',
};

export function generateBeachLD(beach: Record<string, unknown>, locale: string) {
  const name = (beach.name as Record<string, string>)?.[locale] || (beach.name as Record<string, string>)?.el || '';
  const description = (beach.description as Record<string, string>)?.[locale] || '';
  const features = (beach.features as string[]) || [];
  const amenityFeature = features
    .filter((f) => BEACH_AMENITY_NAMES[f])
    .map((f) => ({ '@type': 'LocationFeatureSpecification', name: BEACH_AMENITY_NAMES[f], value: true }));

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
    ...(amenityFeature.length > 0 ? { amenityFeature } : {}),
    ...(beach.image_url ? { image: beach.image_url } : {}),
    // aggregateRating omitted — Google doesn't support review snippets for Beach
    // type — but individual Review nodes still give LLM crawlers quotable UGC.
    ...(() => { const rv = mapReviewsLD(beach.reviews, locale); return rv.length ? { review: rv } : {}; })(),
    url: localeUrl(locale, `beaches/${beach.slug}`),
  };
}

export function generateArticleLD(article: Record<string, unknown>, locale: string) {
  const title = (article.title as Record<string, string>)?.[locale] || (article.title as Record<string, string>)?.el || '';
  const description = (article.excerpt as Record<string, string>)?.[locale] || '';
  const content = (article.content as Record<string, string>)?.[locale] || '';
  // Word count from the body — Google uses this for "article depth" signals
  // and it's a strong E-E-A-T quality indicator vs thin auto-generated stubs.
  const wordCount = content ? content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : undefined;
  const tags = (article.tags as string[]) || [];
  const author = getAuthor(article.author as string | undefined);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: locale,
    // Speakable — headline + article body intro for voice/AI read-aloud.
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.prose p'] },
    // Named Person author with a resolvable profile URL + jobTitle + knowsAbout
    // — the concrete E-E-A-T authorship signal Google looks for on YMYL-adjacent
    // travel content.
    author: {
      '@type': 'Person',
      name: author.name,
      url: localeUrl(locale, authorUrl(author.username).replace(/^\//, '')),
      jobTitle: author.role[locale] || author.role.en,
      knowsAbout: author.knowsAbout,
      worksFor: { '@id': `${SITE_URL}/#organization` },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Chalkidiki Hub',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 },
    },
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    ...(article.image_url ? { image: { '@type': 'ImageObject', url: article.image_url, width: 1200, height: 630 } } : {}),
    ...(article.category ? { articleSection: article.category as string } : {}),
    ...(tags.length > 0 ? { keywords: tags.join(', ') } : {}),
    ...(wordCount && wordCount > 50 ? { wordCount } : {}),
    url: localeUrl(locale, `blog/${article.slug}`),
    mainEntityOfPage: { '@type': 'WebPage', '@id': localeUrl(locale, `blog/${article.slug}`) },
  };
}

/** ISO date ~1 year ahead of the listing's last update (min: ~1y from now). */
function saleOfferValidUntil(updatedAt?: string): string {
  const base = updatedAt ? new Date(updatedAt) : new Date();
  const candidate = new Date(base);
  candidate.setFullYear(candidate.getFullYear() + 1);
  const floor = new Date();
  floor.setFullYear(floor.getFullYear() + 1);
  const chosen = candidate > floor ? candidate : floor;
  return chosen.toISOString().slice(0, 10);
}

export function generateSaleLD(sale: Record<string, unknown>, locale: string) {
  const title = (sale.title as Record<string, string>)?.[locale] || (sale.title as Record<string, string>)?.el || '';
  const description = (sale.description as Record<string, string>)?.[locale] || (sale.description as Record<string, string>)?.el || '';
  const images = (sale.images as Array<{ image_url: string; is_cover?: boolean }>) || [];
  const features = (sale.features as string[]) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    image: images.length > 0 ? images.map(i => i.image_url) : undefined,
    url: localeUrl(locale, `sales/${sale.slug}`),
    brand: {
      '@type': 'Organization',
      name: 'Chalkidiki Hub',
    },
    offers: {
      '@type': 'Offer',
      price: sale.price,
      priceCurrency: (sale.currency as string) || 'EUR',
      // Google requires priceValidUntil for Product/Offer rich results;
      // omitting it triggers a Search Console "missing field" warning and
      // suppresses the snippet. Real estate prices are stable, so roll it
      // ~1 year out from the last edit (or now, whichever is later).
      priceValidUntil: saleOfferValidUntil(sale.updated_at as string | undefined),
      availability: sale.status === 'published'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: localeUrl(locale, `sales/${sale.slug}`),
    },
    additionalProperty: [
      ...(sale.property_type ? [{ '@type': 'PropertyValue', name: 'propertyType', value: sale.property_type }] : []),
      ...(sale.size_sqm ? [{ '@type': 'PropertyValue', name: 'floorSize', value: `${sale.size_sqm} sqm`, unitCode: 'MTK' }] : []),
      ...(sale.bedrooms ? [{ '@type': 'PropertyValue', name: 'numberOfBedrooms', value: sale.bedrooms }] : []),
      ...(sale.bathrooms ? [{ '@type': 'PropertyValue', name: 'numberOfBathrooms', value: sale.bathrooms }] : []),
      ...(sale.year_built ? [{ '@type': 'PropertyValue', name: 'yearBuilt', value: sale.year_built }] : []),
      ...(sale.energy_class ? [{ '@type': 'PropertyValue', name: 'energyClass', value: sale.energy_class }] : []),
      ...features.map(f => ({ '@type': 'PropertyValue', name: f, value: true })),
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: sale.location_name || '',
      addressRegion: 'Halkidiki',
      addressCountry: 'GR',
    },
    ...(sale.latitude && sale.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: sale.latitude,
        longitude: sale.longitude,
      },
    } : {}),
  };
}

// Map our internal activity categories to Schema.org TouristAttraction subtypes
// where a sensible mapping exists. Falls back to plain TouristAttraction.
const ACTIVITY_CATEGORY_TO_SCHEMA: Record<string, string> = {
  historical: 'TouristAttraction',
  nature: 'TouristAttraction',
  waterSports: 'SportsActivityLocation',
  boatTrips: 'TouristAttraction',
  wellness: 'HealthAndBeautyBusiness',
  family: 'TouristAttraction',
  nightlife: 'NightClub',
  religious: 'PlaceOfWorship',
};

// Map our category keys to touristType labels Google understands.
const ACTIVITY_CATEGORY_TOURIST_TYPE: Record<string, string> = {
  historical: 'History enthusiast',
  nature: 'Nature lover',
  waterSports: 'Water sports enthusiast',
  boatTrips: 'Sightseeing tourist',
  wellness: 'Wellness traveler',
  family: 'Family',
  nightlife: 'Nightlife seeker',
  religious: 'Religious pilgrim',
};

export function generateActivityLD(activity: Record<string, unknown>, locale: string) {
  const name = (activity.name as Record<string, string>)?.[locale] || (activity.name as Record<string, string>)?.el || '';
  const description = (activity.description as Record<string, string>)?.[locale] || '';
  const category = (activity.category as string) || '';
  const rating = typeof activity.rating === 'number' ? activity.rating : Number(activity.rating) || 0;
  const reviewsCount = typeof activity.reviews_count === 'number' ? activity.reviews_count : Number(activity.reviews_count) || 0;
  const schemaType = ACTIVITY_CATEGORY_TO_SCHEMA[category] || 'TouristAttraction';
  const touristType = ACTIVITY_CATEGORY_TOURIST_TYPE[category];

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name,
    description,
    ...(activity.image_url ? { image: activity.image_url as string } : {}),
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
    // Rich signals — only emit when we have real data, so Google doesn't flag empties.
    ...(touristType ? { touristType } : {}),
    ...(activity.price_range ? { priceRange: activity.price_range as string } : {}),
    ...(activity.duration ? { duration: activity.duration as string } : {}),
    ...(rating > 0 && reviewsCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating,
            reviewCount: reviewsCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(() => { const rv = mapReviewsLD(activity.reviews, locale); return rv.length ? { review: rv } : {}; })(),
    url: localeUrl(locale, `activities/${activity.slug}`),
  };
}
