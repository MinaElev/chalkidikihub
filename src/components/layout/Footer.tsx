'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-xl text-white">
                Chalkidiki<span className="text-primary-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">{t('description')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {tNav('listings')}
                </Link>
              </li>
              <li>
                <Link href="/areas" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {tNav('areas')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('forOwners')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('registerProperty')}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {tNav('login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-400">{t('terms')}</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">{t('privacy')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">{t('copyright', { year })}</p>
        </div>
      </div>
    </footer>
  );
}
