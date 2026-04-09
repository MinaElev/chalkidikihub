'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { Church, MapPin, Users, Bus, BedDouble, Clock, Mountain, BookOpen, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/mount-athos', icon: Church, labelEl: 'Άγιο Όρος', labelEn: 'Mount Athos' },
  { href: '/mount-athos/monasteries', icon: Church, labelEl: 'Οι 20 Μονές', labelEn: 'The 20 Monasteries' },
  { href: '/mount-athos/how-to-visit', icon: Users, labelEl: 'Πώς να Επισκεφθείτε', labelEn: 'How to Visit' },
  { href: '/mount-athos/getting-there', icon: Bus, labelEl: 'Πώς να Πάτε', labelEn: 'Getting There' },
  { href: '/mount-athos/accommodation', icon: BedDouble, labelEl: 'Διαμονή', labelEn: 'Accommodation' },
  { href: '/mount-athos/daily-life', icon: Clock, labelEl: 'Καθημερινή Ζωή', labelEn: 'Daily Life' },
  { href: '/mount-athos/hiking', icon: Mountain, labelEl: 'Ανάβαση στον Άθω', labelEn: 'Hiking to the Peak' },
  { href: '/mount-athos/history', icon: BookOpen, labelEl: 'Ιστορία & Θρύλοι', labelEn: 'History & Legends' },
];

export function MountAthosNav() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sticky top-24">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Church className="w-5 h-5 text-amber-700" />
        <span className="font-bold text-amber-900 text-sm">{locale === 'el' ? 'Οδηγός Αγίου Όρους' : 'Mount Athos Guide'}</span>
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
              <span className="flex-1">{locale === 'el' ? item.labelEl : item.labelEn}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link href="/areas/athos" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700">
          <MapPin className="w-3 h-3" /> {locale === 'el' ? 'Περιοχή Άθως' : 'Athos Area'}
        </Link>
      </div>
    </div>
  );
}
