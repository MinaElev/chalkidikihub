import { sitemapIndexXml, xmlResponse } from '@/lib/seo/sitemap-xml';

// Public read-only sitemap index: no guard needed. One child file per
// (locale × page family) — see lib/seo/sitemap-groups.ts.
export const revalidate = 3600;

export async function GET() {
  return xmlResponse(await sitemapIndexXml());
}
