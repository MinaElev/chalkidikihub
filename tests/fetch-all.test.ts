import { describe, expect, it } from 'vitest';
import { fetchAll, MAX_ROWS } from '@/lib/supabase/fetch-all';

const fakeTable = (n: number) => {
  const calls: Array<[number, number]> = [];
  const page = (from: number, to: number) => {
    calls.push([from, to]);
    const rows = Array.from({ length: Math.max(0, Math.min(to, n - 1) - from + 1) }, (_, i) => from + i);
    return Promise.resolve({ data: rows, error: null });
  };
  return { page, calls };
};

describe('fetchAll', () => {
  it('reads past the 1,000-row cap (1,310 listing_images)', async () => {
    const t = fakeTable(1310);
    const rows = await fetchAll(t.page);
    expect(rows).toHaveLength(1310);
    expect(new Set(rows).size).toBe(1310);
    expect(t.calls).toEqual([[0, MAX_ROWS - 1], [MAX_ROWS, 2 * MAX_ROWS - 1]]);
  });
  it('stops after one request when under the cap', async () => {
    const t = fakeTable(135);
    expect(await fetchAll(t.page)).toHaveLength(135);
    expect(t.calls).toHaveLength(1);
  });
  it('makes one extra request when the count is an exact multiple', async () => {
    const t = fakeTable(2000);
    expect(await fetchAll(t.page)).toHaveLength(2000);
    expect(t.calls).toHaveLength(3);
  });
  it('throws on a database error', async () => {
    await expect(fetchAll(() => Promise.resolve({ data: null, error: { message: 'boom' } }))).rejects.toThrow('boom');
  });
});
