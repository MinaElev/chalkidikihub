// Guard: public by design (every visitor counts); bots, private pages and
// floods are dropped, and nothing identifying is stored.
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import {
  EVENTS, PRIVATE_PATH, athensDay, classifySource, deviceFromUA, isBot, normalizePath, type TrafficEvent,
} from '@/lib/traffic';

/**
 * Cookieless traffic counter. The page sends one small beacon per page view,
 * one when it is hidden (how long it was visible), and one per contact action
 * (call, email, inquiry…). Each adds to a daily total; no per-visit row, no
 * IP, no cookie, no user id is ever written.
 *
 * Body (text/plain JSON, from navigator.sendBeacon):
 *   { p: path, r: referrer, u?: utm_source, c?: utm_campaign, n: 1 if a
 *     client-side navigation, e?: event, s?: seconds visible }
 */

// Flood guard, in memory only (the address is never stored).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const seen = new Map<string, { n: number; t: number }>();
function tooMany(key: string): boolean {
  const now = Date.now();
  if (seen.size > 5000) for (const [k, v] of seen) if (now - v.t > WINDOW_MS) seen.delete(k);
  const s = seen.get(key);
  if (!s || now - s.t > WINDOW_MS) { seen.set(key, { n: 1, t: now }); return false; }
  s.n += 1;
  return s.n > MAX_PER_WINDOW;
}

const ok = () => new NextResponse(null, { status: 204 });

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get('user-agent') || '';
    if (isBot(ua)) return ok();
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
    if (tooMany(ip)) return ok();

    const body = JSON.parse(await req.text() || '{}') as {
      p?: string; r?: string; u?: string; c?: string; n?: number; e?: string; s?: number;
    };
    if (typeof body.p !== 'string' || !body.p.startsWith('/') || PRIVATE_PATH.test(body.p)) return ok();

    const { path, lang } = normalizePath(body.p);
    const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || 'chalkidikihub.gr').split(':')[0];
    // Local development shares the production database: never count it.
    if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.localhost')) return ok();
    const source = body.n ? 'internal' : classifySource(typeof body.r === 'string' ? body.r : '', host, body.u);
    const campaign = typeof body.c === 'string' ? body.c.trim().toLowerCase().replace(/[^a-z0-9._ -]/g, '').slice(0, 60) : '';

    let event = '';
    let hits = 0, entries = 0, seconds = 0, timed = 0, engaged = 0;
    if (body.e) {
      if (!(EVENTS as readonly string[]).includes(body.e)) return ok();
      event = body.e as TrafficEvent;
      hits = 1;
    } else if (typeof body.s === 'number') {
      const s = Math.round(body.s);
      if (!(s > 0)) return ok();
      seconds = Math.min(s, 1800);
      timed = 1;
      engaged = s >= 10 ? 1 : 0;
    } else {
      hits = 1;
      entries = source === 'internal' ? 0 : 1;
    }

    await createAdminClient().rpc('analytics_hit', {
      p_day: athensDay(), p_path: path, p_event: event, p_source: source, p_campaign: campaign,
      p_device: deviceFromUA(ua), p_lang: lang,
      p_hits: hits, p_entries: entries, p_seconds: seconds, p_timed: timed, p_engaged: engaged,
    });
  } catch { /* counting must never break a page */ }
  return ok();
}
