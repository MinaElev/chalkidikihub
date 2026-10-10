import { getArticles } from '@/lib/db/content';
import { pick } from '@/lib/i18n/localize';
import { plainText } from '@/lib/content/render';
import { localeUrl, SITE_URL } from '@/lib/seo/site';

// Public read-only feed: no guard needed (no data beyond published articles).
export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET() {
  const articles = (await getArticles()).slice(0, 40);
  const items = articles
    .map((a) => {
      const url = localeUrl('el', `/blog/${a.slug}`);
      return `<item><title>${esc(pick(a, 'title', 'el'))}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(a.published_at).toUTCString()}</pubDate><description>${esc(plainText(pick(a, 'excerpt', 'el'), 300))}</description></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>ChalkidikiHub</title><link>${SITE_URL}</link><description>Οδηγοί για τη Χαλκιδική</description><language>el</language><atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600' } });
}
