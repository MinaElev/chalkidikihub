'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { UserMenu } from '@/components/layout/UserMenu';
import { Menu, X, Building } from 'lucide-react';

export function SalesHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations('sales');
  const tNav = useTranslations('nav');
  const tProp = useTranslations('propertyTypes');

  const navItems = [
    { href: '/sales', label: locale === 'el' ? 'Αρχική' : 'Home' },
    { href: '/sales?type=house', label: tProp('house') },
    { href: '/sales?type=apartment', label: tProp('apartment') },
    { href: '/sales?type=land', label: tProp('land') },
    { href: '/sales?type=commercial', label: tProp('commercial') },
    { href: '/contact', label: locale === 'el' ? 'Επικοινωνία' : 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/sales" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-900">Chalkidiki</span>
              <span className="font-bold text-emerald-600">Sales</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden md:inline-flex text-xs text-gray-400 hover:text-primary-600 mr-2">
              ← {locale === 'el' ? 'Καταλύματα' : 'Rentals'}
            </Link>
            <LanguageSwitcher />
            <div className="hidden md:flex items-center gap-2">
              <UserMenu />
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                {item.label}
              </Link>
            ))}
            <hr className="my-2" />
            <Link href="/" onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-50 rounded-lg">
              ← {locale === 'el' ? 'Πίσω στα Καταλύματα' : 'Back to Rentals'}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
