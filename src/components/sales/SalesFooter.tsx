'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Building } from 'lucide-react';

export function SalesFooter() {
  const t = useTranslations('sales');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Chalkidiki Sales</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/sales" className="hover:text-white">{t('home')}</Link>
            <Link href="/contact" className="hover:text-white">{t('contact')}</Link>
            <Link href="/" className="hover:text-white">{t('rentals')}</Link>
            <Link href="/terms" className="hover:text-white">{t('terms')}</Link>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-xs">
          <p>© {year} ChalkidikiHub Sales — chalkidikihub.gr</p>
        </div>
      </div>
    </footer>
  );
}
