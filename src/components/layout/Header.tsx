'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const t = useTranslations('nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              Halkidiki<span className="text-primary-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {t('home')}
            </Link>
            <Link
              href="/listings"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {t('listings')}
            </Link>
            <Link
              href="/areas"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {t('areas')}
            </Link>
            <Link
              href="/beaches"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {t('beaches')}
            </Link>
            <Link
              href="/ev-chargers"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {t('evChargers')}
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {t('blog')}
            </Link>
            <Link
              href="/activities"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {t('activities')}
            </Link>
            <Link
              href="/restaurants"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {t('restaurants')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="hidden md:flex items-center gap-2">
              <UserMenu />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                href="/listings"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('listings')}
              </Link>
              <Link
                href="/areas"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('areas')}
              </Link>
              <Link
                href="/beaches"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('beaches')}
              </Link>
              <Link
                href="/ev-chargers"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('evChargers')}
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('blog')}
              </Link>
              <Link
                href="/activities"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('activities')}
              </Link>
              <Link
                href="/restaurants"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('restaurants')}
              </Link>
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
