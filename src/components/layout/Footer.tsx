'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MapPin, Waves, UtensilsCrossed, Landmark, Zap, FileText } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-xl text-white">
                Chalkidiki<span className="text-primary-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{t('description')}</p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav('home')}</Link></li>
              <li><Link href="/listings" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav('listings')}</Link></li>
              <li><Link href="/areas" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><MapPin className="w-3 h-3" />{tNav('areas')}</Link></li>
              <li><Link href="/beaches" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><Waves className="w-3 h-3" />{tNav('beaches')}</Link></li>
              <li><Link href="/restaurants" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><UtensilsCrossed className="w-3 h-3" />{tNav('restaurants')}</Link></li>
              <li><Link href="/activities" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><Landmark className="w-3 h-3" />{tNav('activities')}</Link></li>
              <li><Link href="/ev-chargers" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><Zap className="w-3 h-3" />{tNav('evChargers')}</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><FileText className="w-3 h-3" />{tNav('blog')}</Link></li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-white font-semibold mb-4">{tNav('areas')}</h3>
            <ul className="space-y-2">
              <li><Link href="/areas/kassandra" className="text-sm text-gray-400 hover:text-white transition-colors">Κασσάνδρα</Link></li>
              <li><Link href="/areas/sithonia" className="text-sm text-gray-400 hover:text-white transition-colors">Σιθωνία</Link></li>
              <li><Link href="/areas/athos" className="text-sm text-gray-400 hover:text-white transition-colors">Άθως</Link></li>
              <li><Link href="/areas/mainland" className="text-sm text-gray-400 hover:text-white transition-colors">Ενδοχώρα</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('forOwners')}</h3>
            <ul className="space-y-2">
              <li><Link href="/for-owners" className="text-sm text-gray-400 hover:text-white transition-colors">{locale === 'el' ? 'Γιατί ChalkidikiHub' : 'Why ChalkidikiHub'}</Link></li>
              <li><Link href="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">{t('registerProperty')}</Link></li>
              <li><Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav('login')}</Link></li>
              <li><Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav('dashboard')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">{t('terms')}</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">{locale === 'el' ? 'Επικοινωνία' : 'Contact'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">{t('copyright', { year })}</p>
          <p className="text-xs text-gray-600 mt-1">v1.1.0</p>
        </div>
      </div>
    </footer>
  );
}
