import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, CalendarDays, Car, ChevronDown, Coins, Home, MapPin, Route, Waves } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { AREA_SLUGS, getAreas, getArticles, getBeaches, getListings, getVillages } from '@/lib/db/content';
import { nearest } from '@/lib/geo';
import { pick } from '@/lib/i18n/localize';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, placeName } from '@/lib/content/place-names';
import { formatPrice, greekAlt } from '@/lib/content/format';
import { plainText } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container } from '@/components/ui/Layout';
import { SearchSuggest } from '@/components/search/SearchSuggest';
import { RecentlyViewed } from '@/components/v3/RecentlyViewed';
import { ClientIntl } from '@/components/ClientIntl';
import { BeachFinder, type FinderBeach } from '@/components/home/BeachFinder';
import { LastMinuteDealsPopup } from '@/components/v3/LastMinuteDealsPopup';

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'home' });
  const [beaches, villages] = await Promise.all([getBeaches(), getVillages()]);
  return buildMetadata({
    locale,
    path: '/',
    title: t('metaTitle'),
    absoluteTitle: true,
    description: t('metaDesc', { beaches: beaches.length, villages: villages.length - 1 }),
    image: '/images/hero/halkidiki-hero.webp',
  });
}

// Villages people search for most (GSC 2026-09, village sub-pages by clicks).
const POPULAR_VILLAGES = ['kallithea', 'nikiti', 'neos-marmaras', 'sarti', 'afytos', 'pefkohori', 'hanioti', 'vourvourou', 'ouranoupoli', 'polychrono', 'nea-moudania', 'toroni'];

// Beach filters shown in the finder, most asked-for first. Labels come from the beachFeatures messages.
const FINDER_FEATURES = ['sandy', 'shallowWater', 'blue-flag', 'organized', 'beachBar', 'parking', 'free', 'nudist'];

/** v3 section heading: pill badge, bold title, grey subtitle. */
function Heading({ id, badge, title, lead, action, center = false }: { id: string; badge?: string; title: string; lead?: string; action?: React.ReactNode; center?: boolean }) {
  return (
    <div className={`mb-8 flex flex-wrap gap-4 ${center ? 'flex-col items-center text-center' : 'items-end justify-between'}`}>
      <div className="max-w-3xl">
        {badge && <p className="mb-3 inline-flex rounded-full bg-sea-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sea-700">{badge}</p>}
        <h2 id={id} className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
        {lead && <p className="mt-3 text-lg text-slate-500">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, common, search, features, avail, beaches, villages, listings, articles, areas] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'search' }),
    getTranslations({ locale, namespace: 'beachFeatures' }),
    getTranslations({ locale, namespace: 'availabilityRequest' }),
    getBeaches(),
    getVillages(),
    getListings(),
    getArticles(),
    getAreas(),
  ]);

  const ranked = [...beaches]
    .filter((b) => b.image_url)
    .sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0) || (b.rating ?? 0) - (a.rating ?? 0));
  const openStays = listings.filter((l) => !l.is_closed && l.cover_url).slice(0, 6);
  const [beachVillages, stayVillages] = await Promise.all([closestVillagesFor(ranked, locale), closestVillagesFor(openStays, locale, 6)]);

  const finderBeaches: FinderBeach[] = ranked.map((b) => ({
    slug: b.slug,
    name: displayName(b, locale, 'beach'),
    village: beachVillages.get(b.slug),
    image: b.image_url,
    imageAlt: greekAlt(b.image_alt, locale),
    area: b.area,
    features: (b.features as string[] | null) ?? [],
    ...ratingProps(b, 'beach'),
  }));

  const popular = POPULAR_VILLAGES.map((s) => villages.find((v) => v.slug === s)).filter((v): v is NonNullable<typeof v> => Boolean(v));
  // The mosaic needs exactly five photos (one large, four small): popular
  // villages first, then the largest other villages that have a photo.
  const withPhoto = [
    ...popular.filter((v) => v.image_url),
    ...villages.filter((v) => v.image_url && !POPULAR_VILLAGES.includes(v.slug)).sort((a, b) => (b.population ?? 0) - (a.population ?? 0)),
  ];
  const pictured = withPhoto.length >= 5 ? withPhoto.slice(0, 5) : [];
  const chips = popular.filter((v) => !pictured.includes(v));

  const areaImage = (slug: string) => {
    const own = areas.find((a) => a.slug === slug)?.image_url as string | undefined;
    return own || beaches.find((b) => b.area === slug && b.image_url)?.image_url || null;
  };

  const plan = [
    { href: '/guide/best-time-to-visit', icon: CalendarDays, title: t('planBestTime'), text: t('planBestTimeText') },
    { href: '/from', icon: Car, title: t('planGettingHere'), text: t('planGettingHereText') },
    { href: '/costs/daily-budget', icon: Coins, title: t('planCosts'), text: t('planCostsText') },
    { href: '/itinerary/7-days', icon: Route, title: t('planItineraries'), text: t('planItinerariesText') },
  ];
  const stats = [
    { icon: Waves, value: beaches.length, label: t('statBeaches'), tone: 'bg-sea-500/25 text-sea-200' },
    { icon: MapPin, value: villages.length - 1, label: t('statVillages'), tone: 'bg-emerald-500/25 text-emerald-200' },
    { icon: Home, value: listings.length, label: t('statStays'), tone: 'bg-accent-400/25 text-accent-400' },
  ];
  const [lead, ...moreArticles] = articles.slice(0, 4);
  const viewAll = (href: string) => (
    <Link href={href} className="inline-flex items-center gap-1.5 rounded-xl bg-sea-50 px-4 py-2 text-sm font-semibold text-sea-700 transition-colors hover:bg-sea-100">
      {common('viewAll')} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );

  return (
    <>
      {/* ── Hero (v3 layout: slow zoom, glass search, glass stat cards) ── */}
      <section className="relative isolate flex min-h-[600px] items-center overflow-hidden text-white" style={{ height: '88svh' }}>
        {/* The hero photo is the LCP element: React hoists these into <head>, so the download starts
            with the stylesheet instead of after it. Same media/type split as the <picture> below. */}
        <link rel="preload" as="image" href="/images/hero/halkidiki-hero-mobile.avif" type="image/avif" media="(max-width: 640px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/hero/halkidiki-hero.avif" type="image/avif" media="(min-width: 641px)" fetchPriority="high" />
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero/halkidiki-hero-mobile.avif" type="image/avif" />
          <source media="(max-width: 640px)" srcSet="/images/hero/halkidiki-hero-mobile.webp" type="image/webp" />
          <source srcSet="/images/hero/halkidiki-hero.avif" type="image/avif" />
          <img src="/images/hero/halkidiki-hero.webp" alt="" fetchPriority="high" className="kenburns absolute inset-0 -z-20 size-full object-cover" />
        </picture>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/70" aria-hidden />
        <Container>
          <h1 className="rise max-w-4xl text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">{t('h1')}</h1>
          <p className="rise rise-2 mt-5 max-w-2xl text-lg text-white/85 sm:text-xl">{t('lead')}</p>
          {/* z-20: the suggestions list must sit above the animated rows below it. */}
          <div className="rise rise-3 relative z-20 mt-8 max-w-2xl">
            <SearchSuggest
              locale={locale}
              action={locale === 'el' ? '/search' : `/${locale}/search`}
              formClassName="glass-card flex flex-col gap-2 rounded-2xl p-2 sm:flex-row"
              label={search('title')}
              placeholder={search('placeholder')}
              submit={search('submit')}
              allLabel={search.raw('all')}
              noneLabel={search.raw('none')}
              kinds={Object.fromEntries(['area', 'village', 'beach', 'listing', 'restaurant', 'activity', 'article'].map((k) => [k, search(`kind_${k}`)]))}
            />
          </div>
          {/* v3: one request reaches every owner in the area. */}
          <p className="rise rise-4 mt-3 flex flex-wrap items-center gap-2 text-sm text-white/80">
            {avail('ctaHeroPrefix')}
            <Link href="/availability-request" className="glass-card inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-semibold text-white transition hover:bg-white/25">
              {avail('ctaHero')} <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </p>
          <div className="rise rise-4 mt-4 flex flex-wrap gap-2">
            <Link href="/beaches" className="glass-card rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/25">{t('ctaBeaches')}</Link>
            <Link href="/listings" className="glass-card rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/25">{t('ctaStay')}</Link>
            <Link href="/places" className="glass-card rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/25">{shell('places')}</Link>
          </div>
          <ul className="rise rise-4 mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map((st) => (
              <li key={st.label} className="glass-card flex items-center gap-3 rounded-2xl p-3 sm:p-4">
                <span className={`hidden size-10 shrink-0 items-center justify-center rounded-xl sm:flex ${st.tone}`}>
                  <st.icon className="size-5" aria-hidden />
                </span>
                <p>
                  <span className="block text-xl font-bold leading-none sm:text-2xl">{st.value}</span>
                  <span className="mt-1 block text-xs text-white/75">{st.label}</span>
                </p>
              </li>
            ))}
          </ul>
        </Container>
        <a href="#peninsulas" className="nudge glass-card absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full p-2 sm:block" aria-label={t('peninsulasTitle')}>
          <ChevronDown className="size-5" aria-hidden />
        </a>
      </section>

      {/* ── Returning visitors: pick up where they left off (this browser only; renders nothing for first visits) ── */}
      <Container>
        <RecentlyViewed className="pt-10" />
      </Container>

      {/* ── Peninsulas: an accordion of photos on desktop, a swipe row on phones ── */}
      <section aria-labelledby="peninsulas" className="bg-mesh-light reveal py-16 sm:py-20">
        <Container>
          <Heading id="peninsulas" badge={shell('footerExplore')} title={t('peninsulasTitle')} lead={t('peninsulasLead')} center />
          <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:h-[28rem] lg:overflow-visible lg:px-0">
            {AREA_SLUGS.map((area) => {
              const img = areaImage(area);
              return (
                <Link
                  key={area}
                  href={`/areas/${area}`}
                  className="group relative isolate flex aspect-[3/4] w-[75vw] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl bg-sea-800 p-5 text-white shadow-lg transition-[flex-grow] duration-700 ease-out sm:w-[20rem] lg:aspect-auto lg:w-auto lg:flex-1 lg:hover:flex-[2]"
                >
                  {img && <Image src={img} alt="" fill sizes="(min-width: 1024px) 40vw, 75vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />}
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900/85 via-gray-900/25 to-transparent" aria-hidden />
                  <span className="block text-xl font-bold sm:text-2xl">{AREA_NAMES[area][locale]}</span>
                  <span className="mt-1.5 block max-w-sm text-sm text-white/80 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:max-h-24 lg:group-hover:opacity-100">{t(`${area}Blurb`)}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                    {common('viewAll')} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Stays (v3 grid of white cards) ── */}
      <section aria-labelledby="stay" className="reveal py-16 sm:py-20">
        <Container>
          <Heading id="stay" badge={shell('stay')} title={t('staysTitle')} lead={t('staysLead')} action={viewAll('/listings')} />
          <CardGrid cols={3}>
            {openStays.map((l) => (
              <Card
                key={l.slug}
                href={`/listings/${l.slug}`}
                favorite={{ type: 'listing', slug: l.slug }}
                title={displayName(l, locale, 'listing')}
                eyebrow={stayVillages.get(l.slug)}
                image={l.cover_url}
                price={l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${common('perNight')}` : undefined}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                {...ratingProps(l, 'listing')}
              />
            ))}
          </CardGrid>
        </Container>
      </section>

      {/* ── Beach finder ── */}
      <section aria-labelledby="beaches" className="bg-mesh-blue bg-sand-50 py-16 sm:py-20">
        <Container className="reveal">
          <Heading id="beaches" badge={shell('beaches')} title={t('finderTitle')} lead={t('finderLead')} />
          <ClientIntl namespaces={['finder']}>
            <BeachFinder
              beaches={finderBeaches}
              labels={{
                areas: Object.fromEntries(AREA_SLUGS.map((a) => [a, AREA_NAMES[a][locale]])),
                features: Object.fromEntries(FINDER_FEATURES.map((f) => [f, features(f)])),
              }}
            />
          </ClientIntl>
        </Container>
      </section>

      {/* ── Villages ── */}
      <section aria-labelledby="villages" className="reveal py-16 sm:py-20">
        <Container>
          <Heading id="villages" badge={shell('places')} title={t('villagesTitle')} action={viewAll('/places')} />
          {pictured.length > 0 && (
            <div className="grid auto-rows-[11rem] grid-cols-2 gap-4 sm:auto-rows-[13rem] lg:grid-cols-4">
              {pictured.map((v, i) => {
                const near = nearest(v, beaches, 99, 10).length;
                return (
                  <Link
                    key={v.slug}
                    href={`/places/${v.slug}`}
                    className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl p-5 text-white shadow-lg ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                  >
                    <Image src={v.image_url!} alt="" fill sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'} className="-z-10 object-cover transition duration-700 group-hover:scale-110" />
                    <span className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900/80 to-transparent" aria-hidden />
                    <span className={`font-bold ${i === 0 ? 'text-3xl' : 'text-lg'}`}>{placeName(v.slug, locale, v)}</span>
                    {near > 0 && <span className="text-sm text-white/80">{common('nearby')}: {near} {t('statBeaches')}</span>}
                  </Link>
                );
              })}
            </div>
          )}
          <ul className="mt-6 flex flex-wrap gap-2">
            {chips.map((v) => (
              <li key={v.slug}>
                <Link href={`/places/${v.slug}`} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-sea-300 hover:bg-sea-50 hover:text-sea-700">
                  {placeName(v.slug, locale, v)}
                  <span className="text-xs text-slate-500">{nearest(v, beaches, 99, 10).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Plan (v3 "explore" tiles) ── */}
      <section aria-labelledby="plan" className="reveal bg-sand-50 py-16 sm:py-20">
        <Container>
          <Heading id="plan" badge={shell('footerPlan')} title={t('planTitle')} center />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plan.map((p) => (
              <Link key={p.href} href={p.href} className="card-premium group rounded-2xl border border-sea-100 bg-white p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-sea-50 text-sea-600 transition-colors group-hover:bg-sea-600 group-hover:text-white">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 font-bold text-gray-900">{p.title}</p>
                <p className="mt-1 text-sm text-slate-500">{p.text}</p>
                <ArrowRight className="mt-3 size-4 text-sea-600 transition group-hover:translate-x-1" aria-hidden />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Articles: one lead story and three more ── */}
      {lead && (
        <section aria-labelledby="articles" className="reveal py-16 sm:py-20">
          <Container>
            <Heading id="articles" badge={shell('blog')} title={t('articlesTitle')} action={viewAll('/blog')} />
            <div className="grid gap-6 lg:grid-cols-5">
              <Link href={`/blog/${lead.slug}`} className="group lg:col-span-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sand-100 shadow-sm">
                  {lead.image_url && <Image src={lead.image_url} alt={greekAlt(lead.image_alt, locale) ?? ''} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                </div>
                <h3 className="mt-5 text-2xl font-bold leading-snug text-gray-900 group-hover:text-sea-600 sm:text-3xl">{pick(lead, 'title', locale)}</h3>
                <p className="mt-2 line-clamp-3 text-slate-500">{plainText(pick(lead, 'excerpt', locale), 220)}</p>
              </Link>
              <div className="grid content-start gap-5 lg:col-span-2">
                {moreArticles.map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`} className="group grid grid-cols-[8rem_1fr] items-center gap-4 sm:grid-cols-[10rem_1fr]">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-sand-100">
                      {a.image_url && <Image src={a.image_url} alt={greekAlt(a.image_alt, locale) ?? ''} fill sizes="10rem" className="object-cover transition duration-700 group-hover:scale-110" />}
                    </div>
                    <div>
                      <h3 className="font-bold leading-snug text-gray-900 group-hover:text-sea-600">{pick(a, 'title', locale)}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{plainText(pick(a, 'excerpt', locale), 120)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
      {/* v3: last-minute deals popup (homepage only). */}
      <LastMinuteDealsPopup />
    </>
  );
}
