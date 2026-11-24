import 'server-only';
import { cached, TAGS } from '@/lib/db/cache';
import { publicDb } from '@/lib/supabase/clients';

export type GuideMedia = { image: string | null; articles: string[] };

/**
 * Cover photo and recommended articles per guide slug (table guide_media,
 * edited in Admin → Guides). An empty map when the table does not exist yet
 * or cannot be read: guide pages then fall back to their default photos.
 */
export const getGuideMedia = cached('guides:media', [TAGS.guides], async (): Promise<Record<string, GuideMedia>> => {
  const { data, error } = await publicDb().from('guide_media').select('slug, image_url, article_slugs');
  if (error || !data) return {};
  return Object.fromEntries(
    data.map((r) => [r.slug as string, { image: (r.image_url as string | null) || null, articles: (r.article_slugs as string[] | null) ?? [] }]),
  );
});
