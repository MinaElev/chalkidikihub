import { parseSitemapId } from '@/lib/seo/sitemap-groups';
import { sitemapXml, xmlResponse } from '@/lib/seo/sitemap-xml';

// Public read-only sitemap file, e.g. /sitemaps/de-places-lists.xml: no guard
// needed. Rendered on first request, then cached for an hour.
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const parsed = file.endsWith('.xml') ? parseSitemapId(file.slice(0, -4)) : null;
  const xml = parsed ? await sitemapXml(parsed.locale, parsed.group) : null;
  return xml ? xmlResponse(xml) : new Response('Not found', { status: 404 });
}
