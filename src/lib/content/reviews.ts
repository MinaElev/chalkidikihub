/**
 * Only genuine visitor reviews are shown or counted.
 *
 * v3 shipped seeded reviews (supabase/migrations/004_seed_data.sql) dated
 * 2024 — before the site existed; its first real account is 2026-04-03.
 * Showing invented reviews is unlawful in the EU (Directive 2019/2161) and
 * against Google's review-snippet policy, so anything older than the launch
 * date is ignored everywhere, and ratings are recomputed from what remains.
 */
export const SITE_LAUNCH = '2026-04-01T00:00:00Z';

export type ReviewRow = {
  id?: string;
  author_name?: string | null;
  rating: number;
  comment_el?: string | null;
  created_at: string;
  status?: string | null;
};

export function genuineReviews<T extends ReviewRow>(rows: T[] | null | undefined): T[] {
  return (rows ?? [])
    .filter((r) => (r.status ?? 'approved') === 'approved' && r.created_at >= SITE_LAUNCH && r.rating >= 1)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function ratingOf(rows: ReviewRow[]): { rating: number | null; count: number } {
  if (!rows.length) return { rating: null, count: 0 };
  const avg = rows.reduce((s, r) => s + r.rating, 0) / rows.length;
  return { rating: Math.round(avg * 10) / 10, count: rows.length };
}
