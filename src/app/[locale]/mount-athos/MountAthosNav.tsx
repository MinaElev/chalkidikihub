'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { Church, MapPin, Users, Bus, BedDouble, Clock, Mountain, BookOpen, ChevronRight } from 'lucide-react';
import { tr } from './content';

const NAV_ITEMS = [
  { href: '/mount-athos', icon: Church, key: 'mountAthos' as const },
  { href: '/mount-athos/monasteries', icon: Church, key: 'navMonasteries' as const },
  { href: '/mount-athos/how-to-visit', icon: Users, key: 'navHowToVisit' as const },
  { href: '/mount-athos/getting-there', icon: Bus, key: 'navGettingThere' as const },
  { href: '/mount-athos/accommodation', icon: BedDouble, key: 'navAccommodation' as const },
  { href: '/mount-athos/daily-life', icon: Clock, key: 'navDailyLife' as const },
  { href: '/mount-athos/hiking', icon: Mountain, key: 'navHiking' as const },
  { href: '/mount-athos/history', icon: BookOpen, key: 'navHistory' as const },
];

export function MountAthosNav() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sticky top-24">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Church className="w-5 h-5 text-amber-700" />
        <span className="font-bold text-amber-900 text-sm">{tr('guide', locale)}</span>
      </div>
      <nav className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/mount-athos' && pathname.startsWith(item.href));
          const isHome = item.href === '/mount-athos' && pathname === '/mount-athos';
          const active = isActive || isHome;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-amber-700 text-white' : 'text-gray-700 hover:bg-amber-50 hover:text-amber-800'
              }`}>
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{tr(item.key, locale)}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link href="/areas/athos" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700">
          <MapPin className="w-3 h-3" /> {tr('areaAthos', locale)}
        </Link>
      </div>
    </div>
  );
}
