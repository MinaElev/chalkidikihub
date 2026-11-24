import 'server-only';
import { unstable_cache } from 'next/cache';

/**
 * Content tags. Saving an entity in the dashboard/admin calls
 * revalidateTag(tag) for its table, so pages refresh within seconds while
 * every other request is served from cache.
 */
export const TAGS = {
  beaches: 'beaches',
  restaurants: 'restaurants',
  activities: 'activities',
  villages: 'villages',
  listings: 'listings',
  blog: 'blog',
  monasteries: 'monasteries',
  events: 'events',
  sales: 'sales',
  areas: 'areas',
  hosts: 'hosts',
  deals: 'deals',
  reviews: 'reviews',
  guides: 'guides',
} as const;
export type Tag = (typeof TAGS)[keyof typeof TAGS];

/** Wraps a loader in the data cache (1 day; tags give instant invalidation). */
export function cached<A extends unknown[], R>(
  key: string,
  tags: Tag[],
  fn: (...args: A) => Promise<R>,
  revalidate = 86400,
) {
  return unstable_cache(fn, [key], { tags, revalidate });
}
