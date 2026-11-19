'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';

const DISMISS_KEY = 'chh_avail_popup_dismissed_at';
const SUPPRESS_DAYS = 7;
const IDLE_MS = 30_000;
const SCROLL_DEPTH = 0.7;

/** v3's rule: only pages where the visitor is still searching for a stay or a place. */
const EXACT = ['/listings', '/beaches', '/restaurants', '/activities', '/sales', '/search', '/last-minute'];
const PREFIXES = ['/stay/', '/places/', '/areas/', '/beaches/feature/', '/restaurants/category/'];
const allowed = (path: string) => EXACT.includes(path) || PREFIXES.some((p) => path.startsWith(p));

function dismissedRecently(): boolean {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    return Boolean(v) && (Date.now() - Date.parse(v!)) / 86_400_000 < SUPPRESS_DAYS;
  } catch {
    return false;
  }
}
function rememberDismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
  } catch {
    /* private mode: it just shows again next visit */
  }
}

export type ExitIntentLabels = { headline: string; body: string; cta: string; free: string; dismiss: string; close: string };

/**
 * v3's "Didn't find what you were looking for?" popup, back in v4. It opens
 * once per visit on search pages when the visitor heads for the tab bar
 * (desktop), scrolls past 70% of the page, or sits idle for 30 s, and points
 * them to the availability request (one request reaches every owner in the
 * area). Closing it keeps it away for 7 days. It never opens over the cookie
 * bar or the last-minute deals popup.
 */
export function ExitIntentPopup({ labels }: { labels: ExitIntentLabels }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const shown = useRef(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const enabled = allowed(pathname);

  const trigger = useCallback(() => {
    if (shown.current || dismissedRecently()) return;
    const root = document.documentElement;
    if (root.hasAttribute('data-consent-open') || root.hasAttribute('data-deal-open')) return;
    shown.current = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!enabled || shown.current || dismissedRecently()) return;
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    const onScroll = () => {
      const doc = document.documentElement;
      if ((window.scrollY + window.innerHeight) / doc.scrollHeight > SCROLL_DEPTH) trigger();
    };
    const idle = window.setTimeout(trigger, IDLE_MS);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(idle);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled, pathname, trigger]);

  const close = useCallback(() => {
    rememberDismiss();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.setAttribute('data-exit-open', '');
    ctaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => {
      root.removeAttribute('data-exit-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  if (!open || !enabled) return null;

  return (
    <div
      className="exit-popup-backdrop fixed inset-0 z-[100] flex items-end justify-center bg-black/55 backdrop-blur-sm md:items-center"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
    >
      <div
        className="exit-popup-panel relative w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl md:max-w-md md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label={labels.close}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-gray-100"
        >
          <X className="size-4" aria-hidden />
        </button>
        <div className="relative overflow-hidden bg-gradient-to-br from-sea-600 to-sea-800 px-6 pb-6 pt-8 text-white">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/15 blur-2xl" aria-hidden />
          <div className="absolute -bottom-12 -left-12 size-44 rounded-full bg-accent-400/20 blur-2xl" aria-hidden />
          <h2 id="exit-popup-title" className="relative pr-8 text-2xl font-extrabold leading-tight md:text-[26px]">
            {labels.headline}
          </h2>
        </div>
        <div className="px-6 pb-7 pt-5">
          <p className="text-[15px] leading-relaxed text-gray-700">{labels.body}</p>
          <Link
            ref={ctaRef}
            href="/availability-request"
            prefetch={false}
            onClick={rememberDismiss}
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sea-600 to-sea-700 py-3.5 font-semibold text-white shadow-lg shadow-sea-600/20 transition hover:from-sea-700 hover:to-sea-800"
          >
            {labels.cta}
            <ChevronRight className="size-4" aria-hidden />
          </Link>
          <p className="mt-3 text-center text-xs font-medium text-slate-500">{labels.free}</p>
          <button type="button" onClick={close} className="mt-2 w-full py-2 text-center text-sm text-slate-500 hover:text-gray-800">
            {labels.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
