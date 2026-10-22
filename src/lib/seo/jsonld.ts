import type { Locale } from '@/i18n/config';
import { htmlLang } from '@/i18n/config';
import { localeUrl, SITE_NAME, SITE_URL } from './site';

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const SAME_AS = [process.env.NEXT_PUBLIC_INSTAGRAM_URL, process.env.NEXT_PUBLIC_FACEBOOK_URL].filter((u): u is string => Boolean(u?.startsWith('https://')));

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: 'Independent travel guide to Halkidiki (Chalkidiki), Greece, in seven languages.',
    areaServed: { '@type': 'AdministrativeArea', name: 'Chalkidiki, Greece' },
    // Official social profiles (set in the environment); they let search engines and assistants tie the brand together.
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

export function websiteLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: localeUrl(locale, '/'),
    name: SITE_NAME,
    inLanguage: htmlLang[locale],
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${localeUrl(locale, '/search')}?q={query}`,
      'query-input': 'required name=query',
    },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(locale: Locale, crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: localeUrl(locale, c.path),
    })),
  };
}

export type Faq = { q: string; a: string };

export function faqLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function itemListLd(locale: Locale, items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: localeUrl(locale, it.path),
    })),
  };
}

type Geo = { latitude?: number | null; longitude?: number | null };

export function geoLd({ latitude, longitude }: Geo) {
  if (latitude == null || longitude == null || (latitude === 0 && longitude === 0)) return undefined;
  return { '@type': 'GeoCoordinates', latitude, longitude };
}

/**
 * aggregateRating only when there are real, first-party reviews. Google
 * treats self-assigned ratings without visible reviews as spam.
 */
export function ratingLd(rating?: number | null, count?: number | null) {
  if (!rating || !count || count < 1) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: Math.round(rating * 10) / 10,
    reviewCount: count,
    bestRating: 5,
    worstRating: 1,
  };
}

export const addressLd = (locality?: string | null) => ({
  '@type': 'PostalAddress',
  addressLocality: locality || undefined,
  addressRegion: 'Chalkidiki',
  addressCountry: 'GR',
});
