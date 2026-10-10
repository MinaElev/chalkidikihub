import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'shell' });

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
    <footer className="mt-20 border-t border-slate-200 bg-sand-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-xl font-semibold text-slate-900">
            Chalkidiki<span className="text-sea-600">Hub</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">{t('footerAbout')}</p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-sm font-semibold text-slate-900">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sea-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-slate-200/80">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-500 sm:px-6">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
