import { getTranslations } from 'next-intl/server';
import { Building, Heart, Menu, Search, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { BrandIcon } from '@/components/ui/BrandIcon';

const FAVOURITES: Record<Locale, string> = {
  el: 'Αγαπημένα', en: 'Favourites', de: 'Favoriten', ro: 'Favorite', bg: 'Любими', sr: 'Omiljeno', ru: 'Избранное',
};

export const PRIMARY_NAV = [
  { href: '/beaches', key: 'beaches' },
  { href: '/places', key: 'places' },
  { href: '/listings', key: 'stay' },
  { href: '/restaurants', key: 'food' },
  { href: '/activities', key: 'activities' },
  { href: '/guide', key: 'guides' },
  { href: '/mount-athos', key: 'athos' },
] as const;

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'shell' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const languages = locales.map((l) => ({ code: l, name: localeNames[l] }));

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 shadow-sm shadow-gray-900/[0.03] backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <BrandIcon size={32} />
          <span className="text-xl font-bold text-gray-900">
            Chalkidiki<span className="text-sea-600">Hub</span>
          </span>
        </Link>

        <nav aria-label={t('menu')} className="ml-4 hidden xl:block">
          <ul className="flex items-center gap-0.5 whitespace-nowrap text-sm font-medium text-gray-600">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-lg px-2.5 py-2 transition-colors hover:bg-gray-50 hover:text-sea-600">
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li>
              {/* emerald-700, not 600: white 14px text needs 4.5:1. */}
              <Link href="/sales" className="ml-2 flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-white transition-colors hover:bg-emerald-800">
                <Building className="size-3.5" aria-hidden />
                {nav('sales')}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/favorites" className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-red-500" aria-label={FAVOURITES[locale]} title={FAVOURITES[locale]}>
            <Heart className="size-5" aria-hidden />
          </Link>
          <Link href="/search" className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100" aria-label={t('search')}>
            <Search className="size-5" aria-hidden />
          </Link>
          <LanguageSwitcher current={locale} languages={languages} label={t('language')} />
          {/* /dashboard sends signed-out visitors to the login form and signed-in ones straight in. */}
          <Link href="/dashboard" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-sea-600 transition-colors hover:bg-sea-50 xl:block">
            {nav('login')}
          </Link>
          <Link href="/auth/register" className="hidden rounded-lg bg-sea-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sea-700 xl:block">
            {nav('register')}
          </Link>

          {/* Mobile menu: native <details>, so it works before any JS loads. */}
          <details className="group relative xl:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
              <Menu className="size-5 group-open:hidden" aria-hidden />
              <X className="hidden size-5 group-open:block" aria-hidden />
              <span className="sr-only">{t('menu')}</span>
            </summary>
            <nav
              aria-label={t('menu')}
              className="fixed inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-6 pt-2 shadow-lg"
            >
              <ul className="divide-y divide-slate-100 text-base font-medium text-slate-800">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-3.5">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/events" className="block py-3.5">{t('events')}</Link>
                </li>
                <li>
                  <Link href="/map" className="block py-3.5">{t('map')}</Link>
                </li>
                <li>
                  <Link href="/blog" className="block py-3.5">{t('blog')}</Link>
                </li>
                <li>
                  <Link href="/sales" className="block py-3.5 text-emerald-700">{nav('sales')}</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="block py-3.5 text-sea-700">{t('account')}</Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
