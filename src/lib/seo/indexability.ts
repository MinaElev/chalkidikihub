import 'server-only';
import { locales, type Locale } from '@/i18n/config';
import { publicDb } from '@/lib/supabase/clients';
import { cached, TAGS, type Tag } from '@/lib/db/cache';
import { localize, localizedColumns } from '@/lib/i18n/localize';
import { assessQuality, minWordsFor, wordCount, type MIN_WORDS } from './quality';
import { withRewrite } from '@/content/rewrites';

/**
 * Per-table "which locales is each row indexable in", computed in one query
 * and cached as a small slug → locales map (the raw text is never cached —
 * blog bodies in 7 languages exceed the data-cache entry limit).
 *
 * Both the sitemap and each page's metadata read these maps, so they can
 * never disagree.
 */

type Spec = {
  table: string;
  field: string;
  kind: keyof typeof MIN_WORDS;
  tag: Tag;
  extra?: string;
  minWords?: number;
  image?: (row: Record<string, unknown>) => boolean;
};

/**
 * Long text in 7 languages is heavy (blog bodies run to megabytes), so rows
 * are read in pages: one huge statement hit Supabase's statement timeout when
 * several build workers ran it at once.
 */
const PAGE = 20;

async function fetchAll(spec: Spec) {
  const rows: Array<Record<string, unknown> & { slug: string }> = [];
  for (let from = 0; ; from += PAGE) {
    let query = publicDb()
      .from(spec.table)
      .select(`slug, image_url, ${localizedColumns(spec.field)}${spec.extra ? `, ${spec.extra}` : ''}`)
      .order('slug')
      .range(from, from + PAGE - 1);
    if (spec.table === 'listings') query = query.eq('status', 'published');
    if (spec.table === 'blog_articles') query = query.not('published_at', 'is', null);
    const { data, error } = await query;
    if (error) throw new Error(`indexability ${spec.table}: ${error.message}`);
    rows.push(...((data ?? []) as unknown as typeof rows));
    if (!data || data.length < PAGE) return rows;
  }
}

async function compute(spec: Spec): Promise<Record<string, Locale[]>> {
  const out: Record<string, Locale[]> = {};
  for (const raw of await fetchAll(spec)) {
    const row = withRewrite(spec.table, raw, spec.field);
    const hasImage = spec.image ? spec.image(row) : Boolean(row.image_url);
    out[row.slug] = locales.filter((l) => {
      const b = localize(row, spec.field, l);
      if (spec.minWords !== undefined) return b.native && hasImage && wordCount(b.text) >= minWordsFor(spec.minWords, l);
      return assessQuality({ body: b.text, nativeBody: b.native, hasImage, locale: l }, spec.kind).indexable;
    });
  }
  return out;
}

const make = (spec: Spec) => cached(`indexability:${spec.table}`, [spec.tag], () => compute(spec));

export const beachIndex = make({ table: 'beaches', field: 'description', kind: 'detail', tag: TAGS.beaches });
export const restaurantIndex = make({ table: 'restaurants', field: 'description', kind: 'venue', tag: TAGS.restaurants });
export const activityIndex = make({ table: 'activities', field: 'description', kind: 'detail', tag: TAGS.activities });
export const articleIndex = make({ table: 'blog_articles', field: 'content', kind: 'article', tag: TAGS.blog });
export const eventIndex = make({ table: 'events', field: 'description', kind: 'hub', tag: TAGS.events, image: () => true });
/** Villages without a photo borrow the nearest beach's, so the image check is relaxed here. */
export const villageIndex = make({ table: 'villages', field: 'description', kind: 'detail', tag: TAGS.villages, image: () => true });
/** Owners write shorter texts; listing pages also carry facts, rules and a map. */
export const listingIndex = make({
  table: 'listings', field: 'description', kind: 'detail', tag: TAGS.listings, minWords: 60,
  extra: 'is_closed, listing_images(image_url)',
  image: (r) => Boolean(r.image_url) || ((r.listing_images as unknown[]) ?? []).length > 0,
});
