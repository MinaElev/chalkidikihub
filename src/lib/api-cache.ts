import 'server-only';
import type { NextRequest } from 'next/server';

/**
 * In-process cache for public GET API routes.
 *
 * These routes used to rely on `s-maxage`, which only a CDN honours (Vercel
 * had one). Self-hosted on Plesk nothing sits in front of Node, so every
 * beach view queried Supabase for the crowd estimate, every home view for the
 * deals, every village view called the weather service. Here the server keeps
 * each answer for `seconds`, keyed by path + query, and concurrent requests for
 * the same key share one upstream call. Only 200 responses up to 1 MB are kept,
 * and the store is capped so odd query strings cannot grow it without bound.
 *
 * Never wrap a route that reads the session or cookies: its answer is per user.
 */
type Entry = { at: number; status: number; headers: [string, string][]; body: ArrayBuffer };

const MAX_ENTRIES = 1000;
const MAX_BYTES = 1_000_000;
const store = new Map<string, Entry>();
const pending = new Map<string, Promise<Entry>>();

function respond(e: Entry, seconds: number, hit: boolean): Response {
  const headers = new Headers(e.headers);
  // Browsers may keep it too (up to 5 minutes), so a visitor's repeat views cost nothing.
  headers.set('Cache-Control', `public, max-age=${Math.min(seconds, 300)}, s-maxage=${seconds}`);
  headers.set('X-Cache', hit ? 'HIT' : 'MISS');
  return new Response(e.body.slice(0), { status: e.status, headers });
}

export function cachedGet<A extends unknown[]>(
  handler: (request: NextRequest, ...rest: A) => Promise<Response> | Response,
  seconds: number,
) {
  return async (request: NextRequest, ...rest: A): Promise<Response> => {
    const params = [...request.nextUrl.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
    const key = `${request.nextUrl.pathname}?${new URLSearchParams(params)}`;

    const hit = store.get(key);
    if (hit && Date.now() - hit.at < seconds * 1000) return respond(hit, seconds, true);

    let job = pending.get(key);
    if (!job) {
      job = (async () => {
        const res = await handler(request, ...rest);
        const body = await res.arrayBuffer();
        const entry: Entry = { at: Date.now(), status: res.status, headers: [...res.headers.entries()], body };
        if (res.status === 200 && body.byteLength <= MAX_BYTES) {
          store.delete(key);
          store.set(key, entry);
          if (store.size > MAX_ENTRIES) store.delete(store.keys().next().value!);
        }
        return entry;
      })().finally(() => pending.delete(key));
      pending.set(key, job);
    }
    return respond(await job, seconds, false);
  };
}
