import { getTranslations } from 'next-intl/server';
import { ArrowRight, Building } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'shell' });
  const home = await getTranslations({ locale, namespace: 'home' });

  const columns = [
    {
      title: t('footerExplore'),
      links: [
        { href: '/areas/kassandra', label: t('kassandra') },
        { href: '/areas/sithonia', label: t('sithonia') },
        { href: '/areas/athos', label: t('athosLeg') },
        { href: '/areas/mainland', label: t('mainland') },
        { href: '/beaches', label: t('beaches') },
        { href: '/places', label: t('places') },
        { href: '/events', label: t('events') },
        { href: '/mount-athos', label: t('athos') },
      ],
    },
    {
      title: t('footerPlan'),
      links: [
        { href: '/guide/best-time-to-visit', label: t('bestTime') },
        { href: '/from', label: t('gettingHere') },
        { href: '/costs/daily-budget', label: t('costs') },
        { href: '/itinerary/7-days', label: t('itineraries') },
        { href: '/listings', label: t('stay') },
        { href: '/last-minute', label: t('lastMinute') },
        { href: '/ev-chargers', label: t('evChargers') },
        { href: '/faq', label: t('faq') },
      ],
    },
    {
      title: t('footerCompany'),
      links: [
        { href: '/about', label: t('aboutUs') },
        { href: '/editorial-policy', label: t('editorialPolicy') },
        { href: '/contact', label: t('contact') },
        { href: '/for-owners', label: t('listProperty') },
        { href: '/sales', label: t('sales') },
        { href: '/privacy', label: t('privacy') },
        { href: '/terms', label: t('terms') },
      ],
    },
  ];

  return (
    <footer data-site-footer className="mt-20 bg-gray-900 text-gray-400">
      {/* Owners call-out, as on v3. */}
      <div className="border-b border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center">
          <div>
            <p className="text-2xl font-bold text-white">{home('ownersTitle')}</p>
            <p className="mt-2 max-w-2xl text-sm">{home('ownersText')}</p>
          </div>
          <Link href="/for-owners" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sea-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-sea-700">
            {home('ownersCta')} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="flex items-center gap-2">
            <BrandIcon size={32} />
            <span className="text-xl font-bold text-white">
              Chalkidiki<span className="text-sea-400">Hub</span>
            </span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">{t('footerAbout')}</p>
          <Link href="/sales" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-700/50 bg-emerald-900/60 px-3 py-2 transition-colors hover:bg-emerald-800/60">
            <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-600">
              <Building className="size-3.5 text-white" aria-hidden />
            </span>
            <span className="text-xs font-semibold text-white">Chalkidiki <span className="text-emerald-400">Sales</span></span>
          </Link>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-sm font-semibold text-white">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-gray-800">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-xs sm:px-6">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
