import { getTranslations } from 'next-intl/server';
import { ArrowRight, BadgeCheck, BedDouble, Building, Compass, Heart, Home, KeyRound, Map as MapIcon, Route, Waves } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';
import { SOCIAL_LINKS } from '@/lib/seo/compat';

/**
 * TEST footer (Nov 2026 redesign), shown only on /home-preview. Same links as
 * the live Footer, regrouped into four columns with icons: every link goes to
 * a page that exists. The owners call-out sits on top as a card.
 */

// Strings that exist only in this test. Other locales fall back to English
// until the design is approved and the texts move to messages/v4.
const COPY = {
  el: {
    stays: 'Καταλύματα στη Χαλκιδική', request: 'Ζήτα διαθεσιμότητα', allBeaches: 'Όλες οι παραλίες', beachMap: 'Παραλίες στον χάρτη',
    trust: [
      ['Αξιόπιστες πληροφορίες', 'με συνεχή ενημέρωση'],
      ['Απευθείας επαφή', 'με ιδιοκτήτες'],
      ['Ολοκληρωμένος οδηγός', 'για όλη τη Χαλκιδική'],
      ['Ιδέες και προτάσεις', 'για τις διακοπές σας'],
    ],
  },
  en: {
    stays: 'Stays in Halkidiki', request: 'Request availability', allBeaches: 'All beaches', beachMap: 'Beaches on the map',
    trust: [
      ['Reliable information', 'kept up to date'],
      ['Direct contact', 'with the owners'],
      ['A complete guide', 'to all of Halkidiki'],
      ['Ideas and tips', 'for your holiday'],
    ],
  },
} as const;

const TRUST_ICONS = [BadgeCheck, Home, MapIcon, Heart] as const;

// lucide-react no longer ships brand logos, so the two we need are inline.
const SOCIAL_ICONS: Record<string, { name: string; path: string }> = {
  'facebook.com': { name: 'Facebook', path: 'M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.200-.1-2.300-.1-2.300 0-3.800 1.400-3.800 3.900v2.300H8v3h2.500V21z' },
  'instagram.com': { name: 'Instagram', path: 'M12 8.200a3.800 3.800 0 1 0 0 7.600 3.800 3.800 0 0 0 0-7.600zm0 6.200a2.400 2.400 0 1 1 0-4.800 2.400 2.400 0 0 1 0 4.800zM16.900 7.100a.900.900 0 1 0 0 1.800.900.900 0 0 0 0-1.800zM16.200 4H7.800A3.800 3.800 0 0 0 4 7.800v8.400A3.800 3.800 0 0 0 7.800 20h8.400a3.800 3.800 0 0 0 3.800-3.800V7.800A3.800 3.800 0 0 0 16.200 4zm2.400 12.200a2.400 2.400 0 0 1-2.400 2.400H7.800a2.400 2.400 0 0 1-2.400-2.400V7.800a2.400 2.400 0 0 1 2.400-2.400h8.400a2.400 2.400 0 0 1 2.400 2.400z' },
};

export async function FooterNext({ locale }: { locale: Locale }) {
  const [t, home, features] = await Promise.all([
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'beachFeatures' }),
  ]);
  const c = COPY[locale === 'el' ? 'el' : 'en'];

  const columns = [
    {
      title: t('stay'), icon: BedDouble,
      links: [
        { href: '/listings', label: c.stays },
        { href: '/availability-request', label: c.request },
        { href: '/last-minute', label: t('lastMinute') },
        { href: '/for-owners', label: t('listProperty') },
        { href: '/sales', label: t('sales') },
      ],
    },
    {
      title: t('footerExplore'), icon: Compass,
      links: [
        { href: '/areas/kassandra', label: t('kassandra') },
        { href: '/areas/sithonia', label: t('sithonia') },
        { href: '/areas/athos', label: t('athosLeg') },
        { href: '/areas/mainland', label: t('mainland') },
        { href: '/places', label: t('places') },
        { href: '/events', label: t('events') },
        { href: '/mount-athos', label: t('athos') },
      ],
    },
    {
      title: t('beaches'), icon: Waves,
      links: [
        { href: '/beaches', label: c.allBeaches },
        { href: '/beaches/feature/sandy', label: features('sandy') },
        { href: '/beaches/feature/blue-flag', label: features('blue-flag') },
        { href: '/beaches/feature/free', label: features('free') },
        { href: '/map', label: c.beachMap },
        { href: '/restaurants', label: t('food') },
        { href: '/activities', label: t('activities') },
      ],
    },
    {
      title: t('footerPlan'), icon: Route,
      links: [
        { href: '/guide/best-time-to-visit', label: t('bestTime') },
        { href: '/from', label: t('gettingHere') },
        { href: '/costs/daily-budget', label: t('costs') },
        { href: '/itinerary/7-days', label: t('itineraries') },
        { href: '/ev-chargers', label: t('evChargers') },
        { href: '/faq', label: t('faq') },
      ],
    },
  ];
  const legal = [
    { href: '/about', label: t('aboutUs') },
    { href: '/editorial-policy', label: t('editorialPolicy') },
    { href: '/contact', label: t('contact') },
    { href: '/terms', label: t('terms') },
    { href: '/privacy', label: t('privacy') },
  ];
  const socials = SOCIAL_LINKS.map((url) => {
    const key = Object.keys(SOCIAL_ICONS).find((k) => url.includes(k));
    return key ? { url, ...SOCIAL_ICONS[key] } : null;
  }).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <footer className="mt-16 bg-gradient-to-b from-[#0b2540] to-[#071a2e] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Owners call-out, where the mockup had a newsletter form. */}
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-sea-500/20 text-sea-300 sm:flex">
              <KeyRound className="size-6" aria-hidden />
            </span>
            <div>
              <p className="text-xl font-bold text-white sm:text-2xl">{home('ownersTitle')}</p>
              <p className="mt-1 max-w-2xl text-sm text-slate-300">{home('ownersText')}</p>
            </div>
          </div>
          <Link href="/for-owners" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sea-500 px-6 py-3 font-semibold text-white shadow-lg shadow-sea-900/40 transition-colors hover:bg-sea-400">
            {home('ownersCta')} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_3fr]">
          <div className="lg:border-r lg:border-white/10 lg:pr-10">
            <p className="flex items-center gap-2.5">
              <BrandIcon size={40} />
              <span className="text-2xl font-bold text-white">Chalkidiki<span className="text-sea-400">Hub</span></span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{t('footerAbout')}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {socials.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white hover:bg-white/10">
                  <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden><path d={s.path} /></svg>
                </a>
              ))}
              <Link href="/sales" className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-900/40 px-3 py-2 transition-colors hover:bg-emerald-800/60">
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-600"><Building className="size-3.5 text-white" aria-hidden /></span>
                <span className="text-xs font-semibold text-white">Chalkidiki <span className="text-emerald-400">Sales</span></span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="flex items-center gap-2 font-bold text-white">
                  <col.icon className="size-5 text-sea-400" aria-hidden /> {col.title}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-white/10 py-6 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {c.trust.map(([title, sub], i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <li key={title} className="flex items-center gap-3 lg:px-6 lg:first:pl-0">
                <Icon className="size-8 shrink-0 text-white" strokeWidth={1.5} aria-hidden />
                <span>
                  <span className="block text-sm font-bold text-white">{title}</span>
                  <span className="block text-xs text-slate-400">{sub}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-4 text-xs sm:text-sm lg:flex-row lg:items-center lg:justify-between">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {legal.map((l, i) => (
              <li key={l.href} className={i ? 'sm:border-l sm:border-white/20 sm:pl-4' : ''}>
                <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
