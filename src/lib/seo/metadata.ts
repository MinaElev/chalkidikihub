import type { Metadata } from 'next';
import { locales, ogLocale, type Locale } from '@/i18n/config';
import { DEFAULT_OG_IMAGE, hreflangMap, localeUrl, SITE_NAME } from './site';
import { indexableIn } from './quality';

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
/** Longest meta description before it is clipped (Google shows ~155–160 characters). */
export const DESC_MAX = 158;

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
const BRAND_SUFFIX = new RegExp(`(\\s*[|–—-]\\s*${SITE_NAME})+\\s*$`, 'i');

export function buildMetadata(seo: PageSeo): Metadata {
  // Pages that already earn clicks stay indexed even below the gate.
  const indexable = indexableIn(seo.path, seo.indexableLocales ?? locales);
  const isIndexable = indexable.includes(seo.locale);
  const canonical = localeUrl(seo.locale, seo.path);
  // Hand-written titles in the database sometimes end with the brand already
  // ("… Guide | ChalkidikiHub"); strip it so it is never shown twice.
  const base = seo.absoluteTitle ? seo.title : seo.title.replace(BRAND_SUFFIX, '').trim();
  const skipBrand = seo.absoluteTitle || base.length + SITE_NAME.length + 3 > TITLE_MAX;
  const title = clip(skipBrand ? base : `${base} | ${SITE_NAME}`, TITLE_MAX + 10);
  const description = clip(seo.description, DESC_MAX);
  const images = [{ url: seo.image || DEFAULT_OG_IMAGE, alt: seo.imageAlt || seo.title }];

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
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}

/** Private surfaces (dashboard, auth, admin, tokenised links). */
export const privateMetadata: Metadata = { robots: { index: false, follow: false } };
