import type { Metadata } from 'next';
import { locales, ogLocale, type Locale } from '@/i18n/config';
import { hreflangMap, localeUrl, SITE_NAME } from './site';

export type PageSeo = {
  locale: Locale;
  /** Unprefixed path, e.g. "/beaches/kavourotripes". */
  path: string;
  title: string;
  description: string;
  image?: string | null;
  imageAlt?: string;
  /** Locales in which this exact page passes the quality gate. */
  indexableLocales?: readonly Locale[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  /** Title already contains the brand — don't append " | ChalkidikiHub". */
  absoluteTitle?: boolean;
};

const TITLE_MAX = 60;
const DESC_MAX = 158;

function clip(text: string, max: number) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20))}…`;
}

/**
 * Single source of truth for <head>. Canonical is always self-referential;
 * hreflang lists only locales where the page is indexable, so Google never
 * gets pointed at a fallback translation; a non-indexable page gets
 * `noindex, follow` so it still passes link equity.
 */
export function buildMetadata(seo: PageSeo): Metadata {
  const indexable = seo.indexableLocales ?? locales;
  const isIndexable = indexable.includes(seo.locale);
  const canonical = localeUrl(seo.locale, seo.path);
  const withBrand = seo.absoluteTitle || seo.title.length + SITE_NAME.length + 3 > TITLE_MAX;
  const title = clip(withBrand ? seo.title : `${seo.title} | ${SITE_NAME}`, TITLE_MAX + 10);
  const description = clip(seo.description, DESC_MAX);
  const images = seo.image ? [{ url: seo.image, alt: seo.imageAlt || seo.title }] : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: isIndexable ? hreflangMap(seo.path, indexable) : undefined,
    },
    robots: isIndexable
      ? { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
      : { index: false, follow: true },
    openGraph: {
      type: seo.type ?? 'website',
      siteName: SITE_NAME,
      locale: ogLocale[seo.locale],
      url: canonical,
      title,
      description,
      images,
      ...(seo.type === 'article'
        ? { publishedTime: seo.publishedTime, modifiedTime: seo.modifiedTime }
        : {}),
    },
    twitter: { card: images ? 'summary_large_image' : 'summary', title, description, images: images?.map((i) => i.url) },
  };
}

/** Private surfaces (dashboard, auth, admin, tokenised links). */
export const privateMetadata: Metadata = { robots: { index: false, follow: false } };
