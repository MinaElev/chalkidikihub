// Enumerate the site's URL universe for GSC URL Inspection seeding.
//
// We inspect what we actually advertise: the canonical <loc> of every entry in
// our own sitemaps (/sitemap.xml is an index of one file per locale × page
// family, so all 7 locales are covered). Hreflang
// <xhtml:link> hrefs are deliberately NOT collected: they duplicate the <loc>
// set across entries and would only inflate the inspection queue.
//
// The inspect route unions this with pages GSC already knows from Search
// Analytics (gsc_pages_28d) to also catch orphan/legacy URLs not in the map.

const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ChalkidikiHub-GSC-Seed/1.0' },
    // Always read the freshest sitemap when seeding.
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`sitemap_fetch_failed ${res.status} ${url}`);
  }
  return res.text();
}

// The regex is intentionally simple — our sitemaps are machine-generated and stable.
const locsOf = (xml: string) =>
  (xml.match(/<loc>\s*([^<\s]+)\s*<\/loc>/gi) || [])
    .map((m) => m.replace(/<\/?loc>/gi, '').trim())
    .filter((u) => u.startsWith('http'));

/** Fetch our own sitemap.xml (a sitemap index) and return every page's canonical <loc> URL. */
export async function enumerateSitemapUrls(): Promise<string[]> {
  const root = await fetchXml(`${SITE()}/sitemap.xml`);
  // /sitemap.xml lists one file per (locale × page family); read each of them.
  const files = root.includes('<sitemapindex') ? locsOf(root) : [];
  const urls = files.length ? (await Promise.all(files.map(fetchXml))).flatMap(locsOf) : locsOf(root);

  // De-dupe (feed.xml / llms.txt can repeat) and drop non-page assets we can't
  // meaningfully "index-inspect" (feeds, llms.txt, raw markdown).
  const skip = /\/(feed\.xml|llms\.txt)$/i;
  return Array.from(new Set(urls)).filter((u) => !skip.test(u));
}
