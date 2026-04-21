import { NextRequest, NextResponse } from 'next/server';
import { pingIndexNow, INDEXNOW_KEY } from '@/lib/indexnow';

/**
 * POST /api/indexnow
 *
 * Body: { "urls": ["https://chalkidikihub.gr/...", ...] }
 * Header: `x-indexnow-token: <INDEXNOW_KEY>` (uses the same key as the
 * hosted verification file — no separate secret needed).
 *
 * Wire this into content mutations (blog publish, listing update, etc.)
 * or call it from a cron with URLs changed in the last 24h.
 */

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-indexnow-token');
  if (token !== INDEXNOW_KEY) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { urls?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const urls = Array.isArray(body.urls) ? body.urls.filter((u): u is string => typeof u === 'string') : [];
  if (urls.length === 0) {
    return NextResponse.json({ error: 'no urls' }, { status: 400 });
  }

  const result = await pingIndexNow(urls);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
