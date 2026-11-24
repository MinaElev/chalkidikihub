/**
 * PostgREST returns at most 1,000 rows per request (the project's max-rows),
 * however large `.limit()` is. Tables that can outgrow that (listing_images
 * has 1,310 rows) must be read in pages, or rows past 1,000 vanish silently.
 *
 *   const rows = await fetchAll((from, to) =>
 *     supabase.from('listing_images').select('id, listing_id').order('id').range(from, to));
 *
 * The query must have a stable `.order()`, or pages can overlap or skip rows.
 */
export const MAX_ROWS = 1000;

type Page<T> = PromiseLike<{ data: T[] | null; error: { message: string } | null }>;

export async function fetchAll<T>(page: (from: number, to: number) => Page<T>, cap = 50_000): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < cap; from += MAX_ROWS) {
    const { data, error } = await page(from, from + MAX_ROWS - 1);
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    out.push(...rows);
    if (rows.length < MAX_ROWS) break;
  }
  return out;
}
