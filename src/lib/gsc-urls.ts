// Enumerate the site's URL universe for GSC URL Inspection seeding.
//
// We inspect what we actually advertise: the canonical <loc> of every entry in
// our own sitemap.xml (one per public locale — the Next sitemap emits a
// separate entry per locale, so all 7 locales are covered). Hreflang
// <xhtml:link> hrefs are deliberately NOT collected: they duplicate the <loc>
// set across entries and would only inflate the inspection queue.
//
// The inspect route unions this with pages GSC already knows from Search
// Analytics (gsc_pages_28d) to also catch orphan/legacy URLs not in the map.

const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

/** Fetch our own sitemap.xml and return the canonical <loc> URLs. */
export async function enumerateSitemapUrls(): Promise<string[]> {
  const base = SITE();
  const res = await fetch(`${base}/sitemap.xml`, {
    headers: { 'User-Agent': 'ChalkidikiHub-GSC-Seed/1.0' },
    // Always read the freshest sitemap when seeding.
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`sitemap_fetch_failed ${res.status}`);
  }
  const xml = await res.text();

  // Match only <loc> values that live directly under a <url> entry. The regex
  // is intentionally simple — the Next sitemap is machine-generated and stable.
  const locs = xml.match(/<loc>\s*([^<\s]+)\s*<\/loc>/gi) || [];
  const urls = locs
    .map((m) => m.replace(/<\/?loc>/gi, '').trim())
    .filter((u) => u.startsWith('http'));

  // De-dupe (feed.xml / llms.txt can repeat) and drop non-page assets we can't
  // meaningfully "index-inspect" (feeds, llms.txt, raw markdown).
  const skip = /\/(feed\.xml|llms\.txt)$/i;
  return Array.from(new Set(urls)).filter((u) => !skip.test(u));
}
