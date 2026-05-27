'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { Bell, X, Sparkles, ChevronRight } from 'lucide-react';

// localStorage keys for dismiss persistence
const POPUP_DISMISS_KEY = 'chh_avail_popup_dismissed_at';
const FAB_BADGE_DISMISS_KEY = 'chh_avail_fab_badge_dismissed_at';
const POPUP_SUPPRESS_DAYS = 7;
const FAB_BADGE_SUPPRESS_DAYS = 30;

// Pathnames where the floating CTA is suppressed entirely. Use locale-stripped
// pathname (usePathname from i18n/navigation already does that).
const FAB_HIDDEN_PREFIXES = [
  '/admin',
  '/dashboard',
  '/auth',
  '/availability-request',
  '/requests/',
  '/r/',
  '/book/',
  '/host/',
];

// Pathnames where the exit-intent popup is allowed (high search-intent pages).
function isPopupAllowed(path: string): boolean {
  if (path === '/listings' || path === '/sales') return true;
  if (path.startsWith('/listings/area/')) return true;
  if (path.startsWith('/places/')) return true;
  if (path.startsWith('/beaches/area/') || path === '/beaches') return true;
  if (path.startsWith('/restaurants/area/') || path === '/restaurants') return true;
  if (path.startsWith('/activities/area/') || path === '/activities') return true;
  if (path === '/search') return true;
  return false;
}

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

function readDismiss(key: string, days: number): boolean {
  try {
    const v = localStorage.getItem(key);
    if (!v) return false;
    return daysSince(v) < days;
  } catch {
    return false;
  }
}

function setDismiss(key: string) {
  try {
    localStorage.setItem(key, new Date().toISOString());
  } catch {
    /* ignore */
  }
}

export default function AvailabilityCTAs() {
  const pathname = usePathname();
  const fabHidden = FAB_HIDDEN_PREFIXES.some(p => pathname === p || pathname.startsWith(p));
  const popupAllowed = !fabHidden && isPopupAllowed(pathname);

  return (
    <>
      {!fabHidden && <FloatingCTA />}
      {popupAllowed && <ExitIntentPopup />}
    </>
  );
}

// ─── Floating bottom-right button ────────────────────────────────────
function FloatingCTA() {
  const t = useTranslations('availabilityRequest');
  const [visible, setVisible] = useState(false);
  // Lazy initial state — read localStorage once on mount instead of via effect.
  const [showBadge] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !readDismiss(FAB_BADGE_DISMISS_KEY, FAB_BADGE_SUPPRESS_DAYS);
  });

  useEffect(() => {
    // Slight delay before appearing — avoid jarring entrance on initial paint
    const t1 = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t1);
  }, []);

  function onClick() {
    setDismiss(FAB_BADGE_DISMISS_KEY);
  }

  return (
    <Link
      href="/availability-request"
      onClick={onClick}
      aria-label={t('floating.tooltip')}
      title={t('floating.tooltip')}
      className={`fixed z-[60] bottom-5 right-5 md:bottom-7 md:right-7 group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white pl-3 pr-4 py-3 rounded-full shadow-xl shadow-primary-700/30 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="relative">
        <Bell className="w-5 h-5" />
        {showBadge && (
          <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 h-4 min-w-[16px] rounded-full bg-yellow-400 text-[10px] font-bold text-amber-900 shadow ring-2 ring-white">
            {t('popup.badge')}
          </span>
        )}
      </span>
      <span className="hidden md:inline text-sm font-semibold whitespace-nowrap">
        {t('floating.label')}
      </span>
      <ChevronRight className="hidden md:inline w-4 h-4 -ml-1 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

// ─── Exit-intent / scroll-depth / idle popup ─────────────────────────
function ExitIntentPopup() {
  const t = useTranslations('availabilityRequest');
  const [open, setOpen] = useState(false);

  const trigger = useCallback(() => {
    if (open) return;
    if (readDismiss(POPUP_DISMISS_KEY, POPUP_SUPPRESS_DAYS)) return;
    setOpen(true);
  }, [open]);

  useEffect(() => {
    if (readDismiss(POPUP_DISMISS_KEY, POPUP_SUPPRESS_DAYS)) return;

    // Trigger 1: exit-intent (mouse moves towards top of viewport, desktop only)
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0 && (e.relatedTarget === null || (e.relatedTarget as Element)?.nodeName === 'HTML')) {
        trigger();
      }
    }

    // Trigger 2: scroll-depth >70%
    function onScroll() {
      const doc = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (scrolled > 0.7) trigger();
    }

    // Trigger 3: idle 30s (no scroll/click after mount)
    const idleTimer = setTimeout(trigger, 30_000);

    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimer);
    };
  }, [trigger]);

  function dismiss() {
    setDismiss(POPUP_DISMISS_KEY);
    setOpen(false);
  }

  function acceptAndGo() {
    setDismiss(POPUP_DISMISS_KEY);
    // Link below handles the navigation
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/55 backdrop-blur-sm animate-fade-in"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="avail-popup-title"
    >
      <div
        className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up md:animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="close"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-gray-100 flex items-center justify-center text-gray-600 shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-700 text-white px-6 pt-8 pb-6 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-yellow-300/20 blur-2xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-amber-900 text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full mb-3">
              <Sparkles className="w-3 h-3" /> {t('popup.badge')}
            </span>
            <h2 id="avail-popup-title" className="text-2xl md:text-[26px] font-extrabold leading-tight">
              {t('popup.headline')}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-7">
          <p className="text-gray-700 leading-relaxed text-[15px]">{t('popup.body')}</p>

          <Link
            href="/availability-request"
            onClick={acceptAndGo}
            className="mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-primary-600/20"
          >
            {t('popup.cta')}
            <ChevronRight className="w-4 h-4" />
          </Link>

          <p className="mt-3 text-center text-[12px] text-gray-500 font-medium">
            {t('popup.free')}
          </p>

          <button
            onClick={dismiss}
            className="mt-2 w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            {t('popup.dismiss')}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-up {
          from { transform: translateY(20px) scale(0.96); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        :global(.animate-fade-in) { animation: fade-in 0.2s ease-out; }
        :global(.animate-slide-up) { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        :global(.animate-fade-up) { animation: fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
