import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];

const TYPE_PATHS: Record<string, string> = {
  beaches: 'beaches',
  restaurants: 'restaurants',
  activities: 'activities',
  blog: 'blog',
  listings: 'listings',
  sales: 'sales',
  villages: 'places',
  areas: 'areas',
  host: 'host',
};

// Content types whose items are featured on the homepage. ONLY these need the
// homepage cache cleared when they change. Everything else was regenerating 7
// homepage variants per push for nothing — pure ISR-write waste.
const HOMEPAGE_TYPES = new Set(['beaches', 'blog', 'listings', 'areas']);

// Data-cache tags registered by the *BySlug / *Filtered fetchers in data.ts.
const TAG_MAP: Record<string, string> = {
  beaches: 'beaches',
  restaurants: 'restaurants',
  activities: 'activities',
  blog: 'blog',
  listings: 'listings',
  villages: 'villages',
};

/**
 * Authorize a revalidation request.
 *
 * - If REVALIDATE_TOKEN is unset, the endpoint stays open (backwards
 *   compatible — admin/dashboard browser calls keep working out of the box).
 * - Once REVALIDATE_TOKEN is set in the environment, a request must EITHER
 *   carry a matching `x-revalidate-token` header (server-to-server: push
 *   scripts, cron) OR be a same-origin browser call (admin/dashboard pages,
 *   which can't safely embed the secret in client code). This blocks
 *   anonymous, cross-origin abuse that would otherwise burn origin transfer
 *   by forcing regeneration. Note: the Origin header can be spoofed by a
 *   determined attacker, so this is drive-by protection, not a hard gate —
 *   the token is the real guard for non-browser callers.
 */
function isAuthorized(request: NextRequest): boolean {
  const token = process.env.REVALIDATE_TOKEN;
  if (!token) return true;
  if (request.headers.get('x-revalidate-token') === token) return true;
  // Same-origin browser fetch sets Origin to this deployment's own origin.
  return request.headers.get('origin') === request.nextUrl.origin;
}

// IndexNow: instantly notify Bing (which also feeds ChatGPT Search) and other
// IndexNow-enabled engines about changed URLs, instead of waiting for a crawl.
// The key file is served from public/<key>.txt. Fire-and-forget with a short
// timeout — indexing hints must never fail or slow down a revalidation.
const INDEXNOW_KEY = 'd1e25f18a689c0de50f07d9237835dc0';

async function pingIndexNow(baseUrl: string, paths: string[]) {
  if (paths.length === 0) return;
  const host = new URL(baseUrl).host;
  // Public locales only: el is unprefixed, en is prefixed.
  const urlList = paths.flatMap((p) => [`${baseUrl}${p}`, `${baseUrl}/en${p}`]).slice(0, 500);
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Best-effort only — a failed ping must not affect the revalidation result.
  }
}

/**
 * On-demand revalidation endpoint.
 *
 * POST /api/revalidate {
 *   type: 'beaches',
 *   slug?: 'sani',          // single item (legacy — admin saves)
 *   slugs?: ['sani', ...],  // batch — one bulk push = one request
 *   locales?: ['el'],       // optional: only these languages changed
 * }
 *
 * Cost model: the collection page, the homepage and the data-cache tag are
 * each revalidated ONCE per request — not once per slug. A previous version
 * fired `revalidateTag` + homepage + collection on every slug, so a 130-item
 * push wiped and rebuilt the whole type's cache 130× (the ISR-write spike).
 */
export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, slug, slugs, locales } = await request.json();
    const basePath = TYPE_PATHS[type];

    if (!basePath) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Only touch the languages that actually changed. A Greek-only description
    // rewrite can pass `locales: ['el']` and skip regenerating the other 6
    // variants. Unknown locales are dropped; empty/missing = all locales.
    const targetLocales = Array.isArray(locales) && locales.length
      ? locales.filter((l: string) => LOCALES.includes(l))
      : LOCALES;

    // Accept both the legacy single `slug` and a batched `slugs` array.
    const slugList = [...new Set([
      ...(Array.isArray(slugs) ? slugs : []),
      ...(slug ? [slug] : []),
    ].filter(Boolean))] as string[];

    // Collection page — once per locale (not once per slug).
    for (const locale of targetLocales) {
      revalidatePath(`/${locale}/${basePath}`);
    }

    // Detail pages — one per changed slug per locale.
    for (const s of slugList) {
      for (const locale of targetLocales) {
        revalidatePath(`/${locale}/${basePath}/${s}`);
      }
    }

    // Homepage — once, and only for types actually featured there.
    if (HOMEPAGE_TYPES.has(type)) {
      for (const locale of targetLocales) {
        revalidatePath(`/${locale}`);
      }
    }

    // Data-cache tag — once. Next 16: revalidateTag requires a cache profile
    // as 2nd arg; 'default' matches the standard cacheLife the entries used.
    if (TAG_MAP[type]) {
      revalidateTag(TAG_MAP[type], 'default');
    }

    // Tell IndexNow-enabled engines (Bing/ChatGPT Search, Yandex, Seznam…)
    // exactly which pages changed — collection page + each detail page.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
    await pingIndexNow(baseUrl, [`/${basePath}`, ...slugList.map((s) => `/${basePath}/${s}`)]);

    return NextResponse.json({
      revalidated: true,
      type,
      slugs: slugList,
      locales: targetLocales,
      homepage: HOMEPAGE_TYPES.has(type),
      tag: TAG_MAP[type] || null,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
