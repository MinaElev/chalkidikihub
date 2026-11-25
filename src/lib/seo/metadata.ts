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
  /**
   * Extra sentences of real facts, appended to the description in order while
   * they fit (see extendDescription). Bing flags descriptions under ~120
   * characters; a template sentence alone is often 85–110.
   */
  extra?: readonly DescExtra[];
};

/** One extra sentence, or alternatives (the first one that still fits is used). */
export type DescExtra = string | readonly string[] | null | undefined | false;

const TITLE_MAX = 60;
/** Longest meta description before it is clipped (Google shows ~155–160 characters). */
export const DESC_MAX = 158;

/**
 * Appends whole sentences to a description while it stays within `max`, so
 * nothing is ever cut mid-sentence. An array entry is a list of alternatives,
 * longest first: the first one that fits is used.
 */
export function extendDescription(base: string, extras: readonly DescExtra[] = [], max = DESC_MAX): string {
  let out = base.replace(/\s+/g, ' ').trim();
  for (const extra of extras) {
    if (!extra) continue;
    const options = typeof extra === 'string' ? [extra] : extra;
    for (const raw of options) {
      const sentence = raw.replace(/\s+/g, ' ').trim();
      if (!sentence) continue;
      const joined = out ? `${/[.!?…]$/.test(out) ? out : `${out}.`} ${sentence}` : sentence;
      if (joined.length <= max) {
        out = joined;
        break;
      }
    }
  }
  return out;
}

function clip(text: string, max: number) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20))}…`;
}

/**
 * Shortens a too-long description without cutting a sentence in half when it
 * can: the last whole sentence that fits, if it keeps at least `min`
 * characters; otherwise the plain clip with an ellipsis.
 */
export function fitDescription(text: string, max = DESC_MAX, min = 100): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const head = t.slice(0, max + 1);
  let end = -1;
  for (const m of head.matchAll(/[.!?…](?=\s|$)/g)) if (m.index! < max) end = m.index!;
  if (end + 1 >= min) return t.slice(0, end + 1);
  return clip(t, max);
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
  const description = fitDescription(extendDescription(fitDescription(seo.description), seo.extra));
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
