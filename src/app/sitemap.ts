import type { MetadataRoute } from 'next';
import { inventory } from '@/lib/seo/inventory';
import { hreflangMap, localeUrl } from '@/lib/seo/site';

// Regenerated hourly at most; content saves also revalidate it.
export const revalidate = 3600;

/**
 * One <url> per (page × indexable locale), each carrying the page's full
 * hreflang cluster. Only quality-gated URLs appear (lib/seo/inventory.ts),
 * so the sitemap is the honest list of pages we stand behind — v3 listed
 * 6,597 URLs, 44% of which Google never showed once.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await inventory();
  return entries.flatMap((e) =>
    e.locales.map((locale) => ({
      url: localeUrl(locale, e.path),
      lastModified: e.lastModified ? new Date(e.lastModified) : undefined,
      priority: e.priority,
      alternates: e.locales.length > 1 ? { languages: hreflangMap(e.path, e.locales) } : undefined,
      images: e.images,
    })),
  );
}
