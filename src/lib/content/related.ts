import 'server-only';
import type { Locale } from '@/i18n/config';
import { getArticles } from '@/lib/db/content';
import { localize } from '@/lib/i18n/localize';
import { articleIndex } from '@/lib/seo/indexability';

/** Guide links for "see also": only published guides indexed in this locale, deduplicated. */
export async function relatedArticles(slugs: readonly string[], locale: Locale) {
  if (!slugs.length) return [];
  const [articles, index] = await Promise.all([getArticles(), articleIndex()]);
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const out: Array<{ href: string; label: string }> = [];
  for (const slug of [...new Set(slugs)]) {
    const a = bySlug.get(slug);
    if (!a || !(index[slug] ?? []).includes(locale)) continue;
    const title = localize(a as unknown as Record<string, unknown>, 'title', locale);
    if (title.native && title.text) out.push({ href: `/blog/${slug}`, label: title.text });
  }
  return out;
}
