import { getTranslations } from 'next-intl/server';
import { BedDouble, BookOpen, Building, CalendarDays, ChevronDown, Church, Compass, FileText, Heart, Landmark, Map, MapPin, Menu, UtensilsCrossed, Waves, X } from 'lucide-react';
import { AREA_SLUGS, getVillages } from '@/lib/db/content';
import { AREA_NAMES, placeName } from '@/lib/content/place-names';
import { Link } from '@/i18n/navigation';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { AccountMenu, MobileAccount, type AccountLabels } from './AccountMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { SearchOverlay, type SearchOverlayLabels } from '@/components/search/SearchOverlay';
import { InstallApp } from './InstallApp';

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

// Icons for the mobile menu rows.
const NAV_ICONS = { beaches: Waves, places: MapPin, stay: BedDouble, food: UtensilsCrossed, activities: Landmark, guides: Compass, athos: Church } as const;

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'shell' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const search = await getTranslations({ locale, namespace: 'search' });
  const searchLabels: SearchOverlayLabels = {
    title: search('title'),
    placeholder: search('placeholder'),
    submit: search('submit'),
    close: t('close'),
    all: search.raw('all'),
    none: search.raw('none'),
    kinds: Object.fromEntries(['area', 'village', 'beach', 'listing', 'restaurant', 'activity', 'article'].map((k) => [k, search(`kind_${k}`)])),
  };
  // v3's areas mega menu: each peninsula with its villages. Pure CSS (hover /
  // focus-within), so it costs no JavaScript and its links are crawlable.
  const villages = (await getVillages()).filter((v) => v.slug !== 'pyrgadikia-mainland');
  const byArea = AREA_SLUGS.map((area) => ({
    area,
    list: villages.filter((v) => v.area === area).sort((a, b) => (b.population ?? 0) - (a.population ?? 0)),
  }));
  const DOTS: Record<string, string> = { kassandra: 'bg-blue-500', sithonia: 'bg-green-500', athos: 'bg-amber-500', mainland: 'bg-gray-400' };
  const languages = locales.map((l) => ({ code: l, name: localeNames[l] }));
  const accountLabels: AccountLabels = {
    login: nav('login'), register: nav('register'), dashboard: nav('dashboard'), listings: nav('myListings'),
    profile: nav('profile'), favourites: FAVOURITES[locale], logout: nav('logout'), account: nav('myAccount'), admin: 'Admin panel',
  };

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
          {/* Phones under 640px: the bar has no room for it, the menu carries Favourites instead. */}
          <Link prefetch={false} href="/favorites" className="hidden size-10 items-center sm:flex justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-red-500" aria-label={FAVOURITES[locale]} title={FAVOURITES[locale]}>
            <Heart className="size-5" aria-hidden />
          </Link>
          <SearchOverlay locale={locale} labels={searchLabels} />
          <LanguageSwitcher current={locale} languages={languages} label={t('language')} />
          <AccountMenu labels={accountLabels} />

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
              <MobileAccount labels={accountLabels} />
              <div className="pt-3">
                <SearchOverlay locale={locale} labels={searchLabels} trigger="field" />
              </div>
              <ul className="divide-y divide-slate-100 text-base font-medium text-slate-800">
                {PRIMARY_NAV.map((item) => {
                  const Icon = NAV_ICONS[item.key];
                  return item.key === 'places' ? (
                    // Villages by peninsula, as in the desktop mega menu.
                    <li key={item.href}>
                      <details className="group/places">
                        <summary className="flex items-center gap-3 py-3.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          <Icon className="size-5 text-sea-600" aria-hidden />
                          <span className="flex-1">{t(item.key)}</span>
                          <ChevronDown className="size-4 text-slate-400 transition-transform group-open/places:rotate-180" aria-hidden />
                        </summary>
                        <div className="space-y-4 pb-4 pl-8">
                          {byArea.map(({ area, list }) => (
                            <div key={area}>
                              <Link prefetch={false} href={`/areas/${area}`} className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <span className={`size-2 rounded-full ${DOTS[area]}`} aria-hidden />
                                {AREA_NAMES[area][locale]}
                              </Link>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {list.slice(0, 8).map((v) => (
                                  <Link prefetch={false} key={v.slug} href={`/places/${v.slug}`} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-normal text-slate-700">
                                    {placeName(v.slug, locale, v)}
                                  </Link>
                                ))}
                                {list.length > 8 && (
                                  <Link prefetch={false} href={`/areas/${area}`} className="px-2 py-1 text-xs font-normal text-sea-700">+{list.length - 8}</Link>
                                )}
                              </div>
                            </div>
                          ))}
                          <Link prefetch={false} href="/places" className="inline-block text-sm font-semibold text-sea-700">{t('areas')} →</Link>
                        </div>
                      </details>
                    </li>
                  ) : (
                    <li key={item.href}>
                      <Link href={item.href} className="flex items-center gap-3 py-3.5">
                        <Icon className="size-5 text-sea-600" aria-hidden />
                        {t(item.key)}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link href="/events" className="flex items-center gap-3 py-3.5"><CalendarDays className="size-5 text-sea-600" aria-hidden />{t('events')}</Link>
                </li>
                <li>
                  <Link href="/map" className="flex items-center gap-3 py-3.5"><Map className="size-5 text-sea-600" aria-hidden />{t('map')}</Link>
                </li>
                <li>
                  <Link href="/blog" className="flex items-center gap-3 py-3.5"><BookOpen className="size-5 text-sea-600" aria-hidden />{t('blog')}</Link>
                </li>
                <li>
                  <Link prefetch={false} href="/favorites" className="flex items-center gap-3 py-3.5"><Heart className="size-5 text-sea-600" aria-hidden />{FAVOURITES[locale]}</Link>
                </li>
                <li>
                  <Link prefetch={false} href="/sales" className="flex items-center gap-3 py-3.5 text-emerald-700"><Building className="size-5" aria-hidden />{nav('sales')}</Link>
                </li>
                <li>
                  <Link prefetch={false} href="/about" className="flex items-center gap-3 py-3.5 text-slate-600"><FileText className="size-5 text-slate-400" aria-hidden />{nav('about')}</Link>
                </li>
              </ul>
              <InstallApp label={t('installApp')} />
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
