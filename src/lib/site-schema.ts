import { SOCIAL_LINKS } from './seo';
import { publicLocales } from '@/i18n/config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
// WebSite.inLanguage advertises supported languages to crawlers — only the
// public locales are listed so we don't promote translations we've hidden.
const LOCALES = publicLocales;
const DEFAULT_LOCALE = 'el';

/**
 * Site-wide Organization + WebSite JSON-LD, rendered once per page in
 * the locale layout. Other schemas (Article, Beach, etc.) can cross-
 * reference `#organization` / `#website` via @id so Google and LLM
 * crawlers merge the whole graph into one entity.
 */
export function generateSiteGraph(locale: string) {
  const searchBase = locale === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}/${locale}`;

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Chalkidiki Hub',
    alternateName: 'ChalkidikiHub',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/icons/icon-512.png`,
      contentUrl: `${SITE_URL}/icons/icon-512.png`,
      width: 512,
      height: 512,
      caption: 'Chalkidiki Hub',
    },
    image: { '@id': `${SITE_URL}/#logo` },
    description:
      'Multilingual travel guide to Halkidiki, Greece — beaches, restaurants, villages, accommodation, activities, and Mount Athos.',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Halkidiki',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Halkidiki',
        addressCountry: 'GR',
      },
    },
    ...(SOCIAL_LINKS.length > 0 ? { sameAs: SOCIAL_LINKS } : {}),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Chalkidiki Hub',
    description: 'Travel guide to Halkidiki, Greece',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: [...LOCALES],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchBase}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  };
}
