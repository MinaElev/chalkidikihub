import { getBlogArticleCards } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  // RSS only uses title/excerpt/image — the card fetch skips article bodies.
  const articles = await getBlogArticleCards();

  const items = articles
    .slice(0, 50) // Latest 50 articles
    .map((article) => {
      const title = article.title?.en || article.title?.el || '';
      const description = article.excerpt?.en || article.excerpt?.el || '';
      const link = `${SITE_URL}/en/blog/${article.slug}`;
      const pubDate = article.published_at
        ? new Date(article.published_at as string).toUTCString()
        : new Date().toUTCString();
      const imageUrl = article.image_url
        ? `<enclosure url="${escapeXml(article.image_url as string)}" type="image/webp" />`
        : '';

      return `    <item>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml((article.category as string) || 'guides')}</category>
      ${imageUrl}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Chalkidiki Hub Blog</title>
    <description>Travel guides, beach reviews, restaurant tips and activities in Halkidiki, Greece</description>
    <link>${SITE_URL}/en/blog</link>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/icons/icon-512.png</url>
      <title>Chalkidiki Hub</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
