import 'server-only';
import { lookup } from 'node:dns/promises';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/supabase/clients';
import { locales } from '@/i18n/config';
import { addDays, busyNights, checkIcalUrl, isIcalText, isPrivateIp, parseIcal } from './ical';

const TIMEOUT_MS = 10_000;
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;
/** How far ahead we import. The public calendar shows 3 months. */
const HORIZON_DAYS = 400;

export interface FeedRow {
  id: string;
  listing_id: string;
  url: string;
}

export interface FeedResult {
  feedId: string;
  ok: boolean;
  busyDays: number;
  changed: boolean;
  error?: string;
}

class FeedError extends Error {}

/**
 * Fetch an allowlisted iCal URL. Every hop (including redirects) must pass
 * checkIcalUrl and resolve to public IPs only, the body is capped at 2 MB and
 * the whole request at 10 s.
 */
async function fetchFeed(raw: string): Promise<string> {
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let current = raw;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const check = checkIcalUrl(current);
    if (!check.ok) throw new FeedError(hop ? 'Redirect to a host we do not allow' : 'URL not allowed');
    const addrs = await lookup(check.url.hostname, { all: true }).catch(() => {
      throw new FeedError('Host not found');
    });
    if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) throw new FeedError('Host resolves to a private address');

    const res = await fetch(check.url, {
      redirect: 'manual',
      signal,
      cache: 'no-store',
      headers: { 'User-Agent': 'ChalkidikiHub-Calendar/1.0 (+https://chalkidikihub.gr)', Accept: 'text/calendar, */*;q=0.5' },
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (!loc) throw new FeedError(`HTTP ${res.status} without Location`);
      current = new URL(loc, check.url).toString();
      continue;
    }
    if (!res.ok) throw new FeedError(`HTTP ${res.status}`);
    if (Number(res.headers.get('content-length') ?? 0) > MAX_BYTES) throw new FeedError('Feed larger than 2 MB');
    if (!res.body) return '';

    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new FeedError('Feed larger than 2 MB');
      }
      chunks.push(value);
    }
    return new TextDecoder().decode(Buffer.concat(chunks));
  }
  throw new FeedError('Too many redirects');
}

function today(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
}

/**
 * Pull one feed and reconcile its rows in listing_availability (feed_id = feed).
 * Days the owner marked by hand (feed_id null) or another feed already holds
 * are left alone. Past days are not touched.
 */
export async function syncFeed(feed: FeedRow): Promise<FeedResult> {
  const db = adminDb();
  const from = today();
  const to = addDays(from, HORIZON_DAYS);

  let wanted: string[];
  try {
    const text = await fetchFeed(feed.url);
    if (!isIcalText(text)) throw new FeedError('Not an iCal feed');
    wanted = busyNights(parseIcal(text), from, to);
  } catch (err) {
    const error = err instanceof FeedError ? err.message : err instanceof Error && err.name === 'TimeoutError' ? 'Timed out after 10 s' : 'Fetch failed';
    await db.from('listing_ical_feeds').update({ last_synced_at: new Date().toISOString(), last_status: 'error', last_error: error }).eq('id', feed.id);
    return { feedId: feed.id, ok: false, busyDays: 0, changed: false, error };
  }

  const { data: rows, error: readErr } = await db
    .from('listing_availability')
    .select('date, feed_id')
    .eq('listing_id', feed.listing_id)
    .gte('date', from);
  if (readErr) {
    await db.from('listing_ical_feeds').update({ last_synced_at: new Date().toISOString(), last_status: 'error', last_error: 'Database read failed' }).eq('id', feed.id);
    return { feedId: feed.id, ok: false, busyDays: 0, changed: false, error: readErr.message };
  }

  const mine = new Set<string>();
  const taken = new Set<string>();
  for (const r of rows ?? []) (r.feed_id === feed.id ? mine : taken).add(r.date as string);
  const want = new Set(wanted);
  const toDelete = [...mine].filter((d) => !want.has(d));
  const toInsert = wanted.filter((d) => !mine.has(d) && !taken.has(d));

  for (let i = 0; i < toDelete.length; i += 200) {
    await db.from('listing_availability').delete().eq('feed_id', feed.id).in('date', toDelete.slice(i, i + 200));
  }
  if (toInsert.length) {
    // ignoreDuplicates: a manual edit racing this sync wins.
    await db
      .from('listing_availability')
      .upsert(toInsert.map((date) => ({ listing_id: feed.listing_id, date, status: 'booked', feed_id: feed.id })), { onConflict: 'listing_id,date', ignoreDuplicates: true });
  }

  await db
    .from('listing_ical_feeds')
    .update({ last_synced_at: new Date().toISOString(), last_status: 'ok', last_error: null, busy_days: wanted.length })
    .eq('id', feed.id);
  return { feedId: feed.id, ok: true, busyDays: wanted.length, changed: toDelete.length + toInsert.length > 0 };
}

/** Sync feeds a few at a time, then refresh the public pages whose calendar changed. */
export async function syncFeeds(feeds: FeedRow[]): Promise<FeedResult[]> {
  const results: FeedResult[] = [];
  const queue = [...feeds];
  await Promise.all(
    Array.from({ length: Math.min(4, queue.length) }, async () => {
      for (let f = queue.shift(); f; f = queue.shift()) results.push(await syncFeed(f));
    }),
  );
  const changedListings = [...new Set(feeds.filter((f) => results.find((r) => r.feedId === f.id)?.changed).map((f) => f.listing_id))];
  await revalidateListings(changedListings);
  return results;
}

export async function revalidateListings(listingIds: string[]) {
  if (!listingIds.length) return;
  const { data } = await adminDb().from('listings').select('slug').in('id', listingIds);
  for (const { slug } of data ?? []) {
    if (!slug) continue;
    for (const locale of locales) revalidatePath(`/${locale}/listings/${slug}`);
  }
}
