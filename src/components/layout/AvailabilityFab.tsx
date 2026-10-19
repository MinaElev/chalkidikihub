'use client';

import { Bell, ChevronRight } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';

// Pages where the button would get in the way or makes no sense.
const HIDDEN = ['/admin', '/dashboard', '/auth', '/availability-request', '/requests/', '/r/', '/guest/', '/host/'];

/**
 * v3's floating "Request availability" button: one request reaches every
 * owner in the chosen area (app/[locale]/availability-request). It fades in
 * after a moment so it doesn't compete with the page's first paint.
 */
export function AvailabilityFab({ label, tooltip }: { label: string; tooltip: string }) {
  const pathname = usePathname();
  if (HIDDEN.some((p) => pathname === p || pathname.startsWith(p))) return null;
  return (
    <Link
      href="/availability-request"
      prefetch={false}
      aria-label={tooltip}
      title={tooltip}
      className="availability-fab fab-in group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sea-600 to-sea-700 py-3 pl-3 pr-4 text-white shadow-xl shadow-sea-700/30 transition hover:from-sea-700 hover:to-sea-800 md:bottom-7 md:right-7"
    >
      <Bell className="size-5" aria-hidden />
      <span className="hidden whitespace-nowrap text-sm font-semibold md:inline">{label}</span>
      <ChevronRight className="-ml-1 hidden size-4 transition-transform group-hover:translate-x-0.5 md:inline" aria-hidden />
    </Link>
  );
}
