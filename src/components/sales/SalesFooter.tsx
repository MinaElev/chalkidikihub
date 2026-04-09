'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Building, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

export function SalesFooter() {
  const t = useTranslations('sales');
  const tAreas = useTranslations('areas');
  const tProp = useTranslations('propertyTypes');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Why ChalkidikiHub Sales */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {locale === 'el' ? 'Γιατί ChalkidikiHub Sales;' : 'Why ChalkidikiHub Sales?'}
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'Δωρεάν καταχώρηση ακινήτου σε 6 γλώσσες' : 'Free property listing in 6 languages'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'Χιλιάδες επισκέπτες από Ελλάδα, Γερμανία, Βουλγαρία, Ρωσία' : 'Thousands of visitors from Greece, Germany, Bulgaria, Russia'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'SEO optimized — το ακίνητό σας εμφανίζεται στο Google' : 'SEO optimized — your property appears on Google'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'Φωτογραφίες, χάρτης, χαρακτηριστικά — πλήρες προφίλ ακινήτου' : 'Photos, map, features — complete property profile'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{locale === 'el' ? 'Χωρίς προμήθειες, χωρίς κρυφές χρεώσεις' : 'No commissions, no hidden fees'}</span>
                </li>
              </ul>
            </div>
            <div className="bg-emerald-900/50 rounded-2xl p-6 text-center border border-emerald-800">
              <h3 className="text-lg font-bold text-white mb-2">
                {locale === 'el' ? 'Καταχωρήστε το ακίνητό σας' : 'List your property'}
              </h3>
              <p className="text-sm text-emerald-300 mb-4">
                {locale === 'el' ? 'Δωρεάν, σε 5 λεπτά, σε 6 γλώσσες' : 'Free, in 5 minutes, in 6 languages'}
              </p>
              <Link href="/dashboard/sales/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors">
                <Building className="w-5 h-5" />
                {t('listProperty')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo + desc */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">Chalkidiki Sales</span>
            </div>
            <p className="text-xs text-gray-500">
              {locale === 'el'
                ? 'Η πλατφόρμα πωλήσεων ακινήτων της Χαλκιδικής.'
                : 'The real estate platform of Halkidiki.'}
            </p>
          </div>

          {/* Property types */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{t('allTypes')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sales?type=house" className="hover:text-white">{tProp('house')}</Link></li>
              <li><Link href="/sales?type=apartment" className="hover:text-white">{tProp('apartment')}</Link></li>
              <li><Link href="/sales?type=land" className="hover:text-white">{tProp('land')}</Link></li>
              <li><Link href="/sales?type=commercial" className="hover:text-white">{tProp('commercial')}</Link></li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{locale === 'el' ? 'Περιοχές' : 'Areas'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sales?area=kassandra" className="hover:text-white">{tAreas('kassandra.name')}</Link></li>
              <li><Link href="/sales?area=sithonia" className="hover:text-white">{tAreas('sithonia.name')}</Link></li>
              <li><Link href="/sales?area=athos" className="hover:text-white">{tAreas('athos.name')}</Link></li>
              <li><Link href="/sales?area=mainland" className="hover:text-white">{tAreas('mainlandHalkidiki.name')}</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{t('contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sales" className="hover:text-white">{t('home')}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{t('contact')}</Link></li>
              <li><Link href="/" className="hover:text-white">{t('rentals')}</Link></li>
              <li><Link href="/terms" className="hover:text-white">{t('terms')}</Link></li>
              <li><Link href="/dashboard/sales/new" className="hover:text-emerald-400">{t('listProperty')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          <p>© {year} ChalkidikiHub Sales — chalkidikihub.gr/sales</p>
        </div>
      </div>
    </footer>
  );
}
