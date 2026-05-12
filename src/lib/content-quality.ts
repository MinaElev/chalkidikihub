// Shared content-quality helper used by /guide/[slug], /places/[slug], and
// sitemap.ts to keep "thin" pages out of the Google index.
//
// The threshold is the same the /admin/seo-health audit script flags as
// "thin" so the on-page robots tag, the sitemap, and the audit dashboard
// all agree on what counts as low-quality.

const THIN_WORD_THRESHOLD = 150;

/** Strip HTML, decode common entities, collapse whitespace, count words. */
export function visibleWordCount(html: string | null | undefined): number {
  if (!html) return 0;
  const stripped = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!stripped) return 0;
  return stripped.split(/\s+/).length;
}

export function isThinContent(html: string | null | undefined): boolean {
  return visibleWordCount(html) < THIN_WORD_THRESHOLD;
}

export { THIN_WORD_THRESHOLD };
