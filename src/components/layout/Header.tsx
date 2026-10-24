import { getTranslations } from 'next-intl/server';
import { Building, ChevronDown, Heart, Menu, Search, X } from 'lucide-react';
import { AREA_SLUGS, getVillages } from '@/lib/db/content';
import { AREA_NAMES, placeName } from '@/lib/content/place-names';
import { Link } from '@/i18n/navigation';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { AccountMenu } from './AccountMenu';
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
  // v3's areas mega menu: each peninsula with its villages. Pure CSS (hover /
  // focus-within), so it costs no JavaScript and its links are crawlable.
  const villages = (await getVillages()).filter((v) => v.slug !== 'pyrgadikia-mainland');
  const byArea = AREA_SLUGS.map((area) => ({
    area,
    list: villages.filter((v) => v.area === area).sort((a, b) => (b.population ?? 0) - (a.population ?? 0)),
  }));
  const DOTS: Record<string, string> = { kassandra: 'bg-blue-500', sithonia: 'bg-green-500', athos: 'bg-amber-500', mainland: 'bg-gray-400' };
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
            {PRIMARY_NAV.map((item) =>
              item.key === 'places' ? (
                <li key={item.href} className="group relative">
                  <Link href={item.href} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 transition-colors hover:bg-gray-50 hover:text-sea-600 group-focus-within:text-sea-600 group-hover:text-sea-600">
                    {t(item.key)}
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 w-[46rem] -translate-x-1/2 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="whitespace-normal rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
                      <div className="grid grid-cols-4 gap-5">
                        {byArea.map(({ area, list }) => (
                          <div key={area}>
                            <Link prefetch={false} href={`/areas/${area}`} className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-sea-600">
                              <span className={`size-2 rounded-full ${DOTS[area]}`} aria-hidden />
                              {AREA_NAMES[area][locale]}
                            </Link>
                            <div className="flex flex-wrap gap-1.5">
                              {list.slice(0, 8).map((v) => (
                                <Link prefetch={false} key={v.slug} href={`/places/${v.slug}`} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-normal text-gray-600 hover:border-sea-300 hover:bg-sea-50 hover:text-sea-700">
                                  {placeName(v.slug, locale, v)}
                                </Link>
                              ))}
                              {list.length > 8 && (
                                <Link prefetch={false} href={`/areas/${area}`} className="px-2 py-1 text-[11px] font-normal text-sea-700 hover:underline">+{list.length - 8}</Link>
                              )}
                            </div>
                            {area === 'athos' && (
                              <Link prefetch={false} href="/mount-athos" className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] font-semibold text-amber-900 hover:bg-amber-100">
                                <span aria-hidden>⛪</span> {t('athos')}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 text-xs font-normal">
                        <Link prefetch={false} href="/areas" className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200">📍 {t('areas')}</Link>
                        <Link prefetch={false} href="/beaches" className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200">🏖️ {t('beaches')}</Link>
                        <Link prefetch={false} href="/activities" className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200">🏛️ {t('activities')}</Link>
                        <Link prefetch={false} href="/map" className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200">🗺️ {t('map')}</Link>
                        <Link prefetch={false} href="/ev-chargers" className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200">⚡ {t('evChargers')}</Link>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className="rounded-lg px-2.5 py-2 transition-colors hover:bg-gray-50 hover:text-sea-600">
                    {t(item.key)}
                  </Link>
                </li>
              ),
            )}
            <li>
              {/* emerald-700, not 600: white 14px text needs 4.5:1. */}
              <Link prefetch={false} href="/sales" className="ml-2 flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-white transition-colors hover:bg-emerald-800">
                <Building className="size-3.5" aria-hidden />
                {nav('sales')}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link prefetch={false} href="/favorites" className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-red-500" aria-label={FAVOURITES[locale]} title={FAVOURITES[locale]}>
            <Heart className="size-5" aria-hidden />
          </Link>
          <Link href="/search" className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100" aria-label={t('search')}>
            <Search className="size-5" aria-hidden />
          </Link>
          <LanguageSwitcher current={locale} languages={languages} label={t('language')} />
          <AccountMenu
            labels={{
              login: nav('login'), register: nav('register'), dashboard: nav('dashboard'), listings: nav('myListings'),
              profile: nav('profile'), favourites: FAVOURITES[locale], logout: nav('logout'), account: nav('myAccount'),
            }}
          />

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
                  <Link prefetch={false} href="/sales" className="block py-3.5 text-emerald-700">{nav('sales')}</Link>
                </li>
                <li>
                  <Link prefetch={false} href="/dashboard" className="block py-3.5 text-sea-700">{t('account')}</Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
