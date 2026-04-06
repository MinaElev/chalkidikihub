'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { GlobalSearch } from './GlobalSearch';
import { FavoritesCounter } from './FavoritesCounter';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

function DropdownMenu({ label, items }: { label: string; items: Array<{ href: string; label: string }> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              Chalkidiki<span className="text-primary-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              {t('home')}
            </Link>
            <Link href="/listings" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              {t('listings')}
            </Link>
            <DropdownMenu
              label={t('areas')}
              items={[
                { href: '/areas', label: t('areas') },
                { href: '/beaches', label: t('beaches') },
                { href: '/activities', label: t('activities') },
                { href: '/ev-chargers', label: t('evChargers') },
                { href: '/map', label: '🗺️ ' + (locale === 'el' ? 'Χάρτης' : 'Map') },
              ]}
            />
            <Link href="/restaurants" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              {t('restaurants')}
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              {t('blog')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <FavoritesCounter />
            <LanguageSwitcher />
            <div className="hidden md:flex items-center gap-2">
              <UserMenu />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('home')}</Link>
              <Link href="/listings" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('listings')}</Link>

              <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('areas')}</div>
              <Link href="/areas" className="px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('areas')}</Link>
              <Link href="/beaches" className="px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('beaches')}</Link>
              <Link href="/activities" className="px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('activities')}</Link>
              <Link href="/ev-chargers" className="px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('evChargers')}</Link>

              <Link href="/restaurants" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('restaurants')}</Link>
              <Link href="/blog" className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}>{t('blog')}</Link>
              <hr className="my-2" />
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('login')}
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('register')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
