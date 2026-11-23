import 'server-only';
import { locales, type Locale } from '@/i18n/config';
import { inventory, type Entry } from './inventory';
import { hreflangMap, localeUrl, SITE_URL } from './site';
import { parseSitemapId, SITEMAP_GROUPS, sitemapGroup, sitemapId, type SitemapGroup } from './sitemap-groups';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const HEADERS = { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' };

export const xmlResponse = (body: string) => new Response(body, { headers: HEADERS });

/** Every (locale, family) that has at least one URL, with its newest lastmod. */
export async function sitemapFiles(): Promise<Array<{ id: string; lastModified?: string }>> {
  const files = new Map<string, string | undefined>();
  for (const e of await inventory()) {
    const group = sitemapGroup(e.path);
    for (const l of e.locales) {
      const id = sitemapId(l, group);
      const prev = files.get(id);
      files.set(id, !prev || (e.lastModified && e.lastModified > prev) ? (e.lastModified ?? prev) : prev);
    }
  }
  const order = (id: string) => {
    const p = parseSitemapId(id)!;
    return locales.indexOf(p.locale) * 100 + SITEMAP_GROUPS.indexOf(p.group);
  };
  return [...files].map(([id, lastModified]) => ({ id, lastModified })).sort((a, b) => order(a.id) - order(b.id));
}

export async function sitemapIndexXml(): Promise<string> {
  const rows = (await sitemapFiles()).map(({ id, lastModified }) =>
    `<sitemap><loc>${SITE_URL}/sitemaps/${id}.xml</loc>${lastModified ? `<lastmod>${new Date(lastModified).toISOString()}</lastmod>` : ''}</sitemap>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</sitemapindex>\n`;
}

function urlXml(e: Entry, locale: Locale): string {
  const parts = [`<loc>${esc(localeUrl(locale, e.path))}</loc>`];
  if (e.lastModified) parts.push(`<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>`);
  if (e.locales.length > 1) {
    for (const [lang, href] of Object.entries(hreflangMap(e.path, e.locales))) {
      parts.push(`<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(href)}" />`);
    }
  }
  for (const img of e.images ?? []) parts.push(`<image:image><image:loc>${esc(img)}</image:loc></image:image>`);
  parts.push(`<priority>${e.priority}</priority>`);
  return `<url>\n${parts.join('\n')}\n</url>`;
}

/** One family in one locale; null if there is no such file. */
export async function sitemapXml(locale: Locale, group: SitemapGroup): Promise<string | null> {
  const entries = (await inventory()).filter((e) => e.locales.includes(locale) && sitemapGroup(e.path) === group);
  if (!entries.length) return null;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.map((e) => urlXml(e, locale)).join('\n')}\n</urlset>\n`;
}
