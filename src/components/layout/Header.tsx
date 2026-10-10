import { getTranslations } from 'next-intl/server';
import { Menu, Search, X, UserRound } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';

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
  const languages = locales.map((l) => ({ code: l, name: localeNames[l] }));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="ChalkidikiHub">
          <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-sea-600 font-display text-lg text-white">
            C
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-900">
            Chalkidiki<span className="text-sea-600">Hub</span>
          </span>
        </Link>

        <nav aria-label={t('menu')} className="ml-4 hidden xl:block">
          <ul className="flex items-center gap-1 text-[0.94rem] font-medium text-slate-700">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-lg px-3 py-2 hover:bg-sea-50 hover:text-sea-800">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/search" className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100" aria-label={t('search')}>
            <Search className="size-5" aria-hidden />
          </Link>
          <LanguageSwitcher current={locale} languages={languages} label={t('language')} />
          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 xl:flex"
          >
            <UserRound className="size-4" aria-hidden />
            {t('account')}
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
