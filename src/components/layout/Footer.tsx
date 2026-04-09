'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MapPin, Waves, UtensilsCrossed, Landmark, Zap, FileText, Building, ChevronRight, Home } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Why ChalkidikiHub */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {locale === 'el' ? 'Γιατί ChalkidikiHub;' : 'Why ChalkidikiHub?'}
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'Δωρεάν καταχώρηση καταλύματος σε 6 γλώσσες' : 'Free accommodation listing in 6 languages'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'Παραλίες, εστιατόρια, δραστηριότητες — όλη η Χαλκιδική σε ένα site' : 'Beaches, restaurants, activities — all of Halkidiki in one site'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'SEO optimized — το κατάλυμά σας εμφανίζεται στο Google' : 'SEO optimized — your property appears on Google'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'QR Guest Guide — ψηφιακός concierge για τους πελάτες σας' : 'QR Guest Guide — digital concierge for your guests'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'Χωρίς προμήθειες, χωρίς κρυφές χρεώσεις' : 'No commissions, no hidden fees'}</span>
                </li>
              </ul>
            </div>
            <div className="bg-primary-900/50 rounded-2xl p-6 text-center border border-primary-800">
              <h3 className="text-lg font-bold text-white mb-2">
                {locale === 'el' ? 'Καταχωρήστε το κατάλυμά σας' : 'List your property'}
              </h3>
              <p className="text-sm text-primary-300 mb-4">
                {locale === 'el' ? 'Δωρεάν, σε 5 λεπτά, σε 6 γλώσσες' : 'Free, in 5 minutes, in 6 languages'}
              </p>
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
                <Home className="w-5 h-5" />
                {t('registerProperty')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand + Sales link */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-xl text-white">
                Chalkidiki<span className="text-primary-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">{t('description')}</p>
            <Link href="/sales"
              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-900/60 border border-emerald-700/50 rounded-xl hover:bg-emerald-800/60 transition-colors">
              <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                <Building className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-white">Chalkidiki <span className="text-emerald-400">Sales</span></span>
            </Link>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav('home')}</Link></li>
              <li><Link href="/listings" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav('listings')}</Link></li>
              <li><Link href="/beaches" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><Waves className="w-3 h-3" />{tNav('beaches')}</Link></li>
              <li><Link href="/restaurants" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><UtensilsCrossed className="w-3 h-3" />{tNav('restaurants')}</Link></li>
              <li><Link href="/activities" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><Landmark className="w-3 h-3" />{tNav('activities')}</Link></li>
              <li><Link href="/ev-chargers" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><Zap className="w-3 h-3" />{tNav('evChargers')}</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"><FileText className="w-3 h-3" />{tNav('blog')}</Link></li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{tNav('areas')}</h3>
            <ul className="space-y-2">
              <li><Link href="/areas/kassandra" className="text-sm text-gray-400 hover:text-white transition-colors">Κασσάνδρα</Link></li>
              <li><Link href="/areas/sithonia" className="text-sm text-gray-400 hover:text-white transition-colors">Σιθωνία</Link></li>
              <li><Link href="/areas/athos" className="text-sm text-gray-400 hover:text-white transition-colors">Άθως</Link></li>
              <li><Link href="/areas/mainland" className="text-sm text-gray-400 hover:text-white transition-colors">{locale === 'el' ? 'Ενδοχώρα' : 'Mainland'}</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{t('forOwners')}</h3>
            <ul className="space-y-2">
              <li><Link href="/for-owners" className="text-sm text-gray-400 hover:text-white transition-colors">{locale === 'el' ? 'Γιατί ChalkidikiHub' : 'Why ChalkidikiHub'}</Link></li>
              <li><Link href="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">{t('registerProperty')}</Link></li>
              <li><Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav('login')}</Link></li>
              <li><Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav('dashboard')}</Link></li>
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{t('legal')}</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">{t('terms')}</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">{locale === 'el' ? 'Επικοινωνία' : 'Contact'}</Link></li>
              <li><Link href="/sales" className="text-sm hover:text-emerald-400 transition-colors text-emerald-500">{locale === 'el' ? 'Πωλήσεις Ακινήτων' : 'Real Estate Sales'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          <p className="text-gray-500">{t('copyright', { year })}</p>
          <Link href="/changelog" className="text-gray-600 hover:text-gray-400 mt-1 inline-block">v1.7.0</Link>
        </div>
      </div>
    </footer>
  );
}
