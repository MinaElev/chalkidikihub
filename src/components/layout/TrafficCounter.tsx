'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Cookieless traffic counter (see /api/t). Counts every visitor — no cookie,
 * no stored id, nothing that identifies anyone — so it needs no consent:
 *  • one beacon per page view (landing or client-side navigation),
 *  • one when the page is left/hidden, with how long it was visible,
 *  • one per contact action: call, email, WhatsApp, directions, booking link,
 *    owner website, other outbound link, and the inquiry / availability forms
 *    (those dispatch `chub:track`).
 * Browsers marked by Admin ("don't count this browser") send nothing.
 */

// Module-level: the first view of this page load (survives component re-mounts).
const sessionlessSeen = new Set<string>();

type View = { p: string; r: string; u?: string; c?: string; n?: 1 };

const PRIVATE = /^\/(?:(?:en|de|ro|sr|bg|ru)\/)?(?:admin|dashboard|auth|requests|r|book|guest|favorites|zz-)(?:\/|$)/;

function send(data: Record<string, unknown>) {
  try {
    const body = JSON.stringify(data);
    if (navigator.sendBeacon) navigator.sendBeacon('/api/t', new Blob([body], { type: 'text/plain' }));
    else fetch('/api/t', { method: 'POST', body, keepalive: true }).catch(() => {});
  } catch { /* never break the page */ }
}

function skip(): boolean {
  try {
    if (navigator.webdriver) return true;
    return localStorage.getItem('chub_no_count') === '1';
  } catch { return false; }
}

/** Contact action behind a clicked link, if any. */
function eventForLink(a: HTMLAnchorElement): string | null {
  const explicit = a.closest<HTMLElement>('[data-track]')?.dataset.track;
  if (explicit) return explicit;
  const href = a.getAttribute('href') || '';
  if (href.startsWith('tel:')) return 'call';
  if (href.startsWith('mailto:')) return 'email';
  let url: URL;
  try { url = new URL(href, location.href); } catch { return null; }
  if (url.origin === location.origin) return null;
  const h = url.hostname.replace(/^www\./, '');
  if (/(^|\.)wa\.me$|whatsapp\.com$/.test(h)) return 'whatsapp';
  if (/(^|\.)google\.[a-z.]+$/.test(h) && url.pathname.startsWith('/maps') || h === 'maps.app.goo.gl' || h === 'goo.gl') return 'directions';
  if (/(^|\.)(booking\.com|airbnb\.[a-z.]+)$/.test(h)) return 'booking_link';
  return 'outbound';
}

export function TrafficCounter() {
  const pathname = usePathname();
  const view = useRef<View | null>(null);
  const visibleSince = useRef<number | null>(null);
  const visibleMs = useRef(0);
  const timingSent = useRef(false);

  // Send how long the current page was visible (once per page view).
  const flushTiming = () => {
    const v = view.current;
    if (!v || timingSent.current) return;
    if (visibleSince.current != null) { visibleMs.current += Date.now() - visibleSince.current; visibleSince.current = null; }
    const s = Math.round(visibleMs.current / 1000);
    timingSent.current = true;
    if (s > 0) send({ ...v, s });
  };

  // A page view per path (the first one carries the real referrer).
  useEffect(() => {
    if (PRIVATE.test(pathname) || skip()) { view.current = null; return; }
    flushTiming();
    const first = view.current === null && !sessionlessSeen.has('first');
    sessionlessSeen.add('first');
    const q = new URLSearchParams(location.search);
    const v: View = first
      ? { p: pathname, r: document.referrer, u: q.get('utm_source') || undefined, c: q.get('utm_campaign') || undefined }
      : { p: pathname, r: '', n: 1 };
    view.current = v;
    visibleMs.current = 0;
    timingSent.current = false;
    visibleSince.current = document.visibilityState === 'visible' ? Date.now() : null;
    send(v);
     
  }, [pathname]);

  // Visible time, contact clicks and form events.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushTiming();
      else if (!timingSent.current) visibleSince.current = Date.now();
    };
    const onClick = (e: MouseEvent) => {
      const v = view.current;
      if (!v) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a) return;
      const ev = eventForLink(a as HTMLAnchorElement);
      if (ev) send({ ...v, e: ev });
    };
    const onTrack = (e: Event) => {
      const v = view.current;
      const ev = (e as CustomEvent<string>).detail;
      if (v && typeof ev === 'string') send({ ...v, e: ev });
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flushTiming);
    document.addEventListener('click', onClick, true);
    window.addEventListener('chub:track', onTrack);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flushTiming);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('chub:track', onTrack);
    };
     
  }, []);

  return null;
}

/** For forms: count a completed inquiry / availability request. */
export function trackEvent(event: 'inquiry' | 'availability_request') {
  try { window.dispatchEvent(new CustomEvent('chub:track', { detail: event })); } catch { /* ignore */ }
}
