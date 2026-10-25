'use client';

import { BedDouble, Bell, MapPin, UtensilsCrossed, Waves } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';

// Where the bar would be in the way: back-office, sign-in, the request form
// itself, guest/host token pages, and a stay's page (it has its own booking bar).
const HIDDEN = ['/admin', '/dashboard', '/auth', '/availability-request', '/requests/', '/r/', '/guest/', '/host/'];
const hiddenOn = (p: string) => HIDDEN.some((h) => p === h || p.startsWith(h)) || /^\/listings\/[^/]+$/.test(p);

type Labels = { beaches: string; places: string; stay: string; food: string; availability: string; menu: string };

/**
 * Phones: the main sections one thumb away, Booking/Airbnb style. Also takes
 * over from the floating "Request availability" button, which on a phone sat
 * on top of the content. Hidden from 768px up, where the header has room.
 */
export function BottomNav({ labels }: { labels: Labels }) {
  const pathname = usePathname();
  if (hiddenOn(pathname)) return null;

  const items = [
    { href: '/beaches', label: labels.beaches, Icon: Waves },
    { href: '/places', label: labels.places, Icon: MapPin },
    { href: '/listings', label: labels.stay, Icon: BedDouble },
    { href: '/restaurants', label: labels.food, Icon: UtensilsCrossed },
  ];

  return (
    <>
      {/* Keeps the footer's last lines clear of the bar. */}
      <div className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" aria-hidden />
      <nav
        aria-label={labels.menu}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="grid h-16 grid-cols-5">
          {items.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium ${active ? 'text-sea-700' : 'text-slate-600'}`}
                >
                  <Icon className={`size-5 ${active ? 'stroke-[2.5]' : ''}`} aria-hidden />
                  <span className="max-w-full truncate px-1">{label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link prefetch={false} href="/availability-request" className="flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-sea-700">
              <span className="flex size-7 items-center justify-center rounded-full bg-sea-600 text-white shadow-sm"><Bell className="size-4" aria-hidden /></span>
              <span className="max-w-full truncate px-1">{labels.availability}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
