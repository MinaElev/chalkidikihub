import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, BedDouble, Bike, BookOpen, CalendarDays, Car, Check, Coins, Map as MapIcon, MapPin, Route, UtensilsCrossed, Waves } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { AREA_SLUGS, getAreas, getArticles, getBeaches, getListings, getLiveCalendarListingIds, getVillages } from '@/lib/db/content';
import { pick } from '@/lib/i18n/localize';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, placeName } from '@/lib/content/place-names';
import { formatPrice, greekAlt } from '@/lib/content/format';
import { Card, CardGrid, type CardFact } from '@/components/ui/Card';
import { Container } from '@/components/ui/Layout';
import { buildMetadata } from '@/lib/seo/metadata';
import { SearchSuggest } from '@/components/search/SearchSuggest';
import { RecentlyViewed } from '@/components/v3/RecentlyViewed';
import { HomeDeals } from '@/components/home/HomeDeals';
import { RequestBand } from '@/components/home/RequestBand';
import { pickHomeStays } from '@/content/home-stays';

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

// Beach tiles: only tags that have their own page (KEPT_FEATURES) and verified data.
const BEACH_TILES = ['sandy', 'blue-flag', 'free'] as const;

/** Left-hand intro of a section: small label, title, text and one button. */
function Intro({ id, label, title, lead, href, cta }: { id: string; label: string; title: string; lead?: string; href: string; cta: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-sea-700">{label}</p>
      <h2 id={id} className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h2>
      {lead && <p className="mt-3 text-slate-500">{lead}</p>}
      <Link href={href} className="mt-5 inline-flex items-center gap-2 rounded-full bg-sea-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sea-700">
        {cta} <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

/** Photo tile with a label at the bottom. */
function Tile({ href, image, label, icon: Icon, sizes }: { href: string; image?: string | null; label: string; icon?: typeof Waves; sizes: string }) {
  return (
    <Link href={href} className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-sea-800 p-4 text-white shadow-sm">
      {image && <Image src={image} alt="" fill sizes={sizes} className="-z-10 object-cover transition duration-700 group-hover:scale-105" />}
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900/80 via-gray-900/10 to-transparent" aria-hidden />
      <span className="flex items-center gap-2 font-bold">
        {Icon && <Icon className="size-5 shrink-0" aria-hidden />} {label}
      </span>
    </Link>
  );
}

/** Amenities shown as icons on the stay cards, in this order: the same list /listings uses. */
const CARD_FACTS: CardFact['key'][] = ['pool', 'seaView', 'airConditioning', 'wifi', 'petsAllowed', 'parking'];

const TILE_SIZES = '(min-width: 1024px) 17vw, (min-width: 640px) 25vw, 50vw';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, common, search, features, stayT, amenityT, liveIds, beaches, villages, listings, articles, areas] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'search' }),
    getTranslations({ locale, namespace: 'beachFeatures' }),
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'amenities' }),
    getLiveCalendarListingIds(),
    getBeaches(),
    getVillages(),
    getListings(),
    getArticles(),
    getAreas(),
  ]);

  const live = new Set(liveIds);
  // Six stays: Amira House, then Premium, then an hourly rotation of the front-page list (pickHomeStays).
  const stays = pickHomeStays(listings.filter((l) => l.cover_url), live, 6);
  const stayVillages = await closestVillagesFor(stays, locale, 6);

  const ranked = [...beaches]
    .filter((b) => b.image_url)
    .sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0) || (b.rating ?? 0) - (a.rating ?? 0));
  const used = new Set<string>();
  const beachTiles = BEACH_TILES.map((f) => {
    const b = ranked.find((x) => ((x.features as string[] | null) ?? []).includes(f) && !used.has(x.slug));
    if (b) used.add(b.slug);
    return { href: `/beaches/feature/${f}`, label: features(f), image: b?.image_url };
  });
  const anyBeach = ranked.find((b) => !used.has(b.slug));

  const areaImage = (slug: string) => {
    const own = areas.find((a) => a.slug === slug)?.image_url as string | undefined;
    return own || beaches.find((b) => b.area === slug && b.image_url)?.image_url || null;
  };
  const popular = POPULAR_VILLAGES.map((s) => villages.find((v) => v.slug === s)).filter((v): v is NonNullable<typeof v> => Boolean(v));

  const areaLabels = Object.fromEntries(AREA_SLUGS.map((a) => [a, AREA_NAMES[a][locale]]));

  const shortcuts = [
    { href: '/listings', icon: BedDouble, label: shell('stay') },
    { href: '/beaches', icon: Waves, label: shell('beaches') },
    { href: '/places', icon: MapPin, label: shell('places') },
    { href: '/restaurants', icon: UtensilsCrossed, label: shell('food') },
    { href: '/activities', icon: Bike, label: shell('activities') },
  ];
  const strip = [
    { href: '/listings', icon: BedDouble, title: t('stripStays', { count: listings.length }), sub: t('stripStaysSub') },
    { href: '/areas/kassandra', icon: MapIcon, title: t('stripAreas'), sub: (['kassandra', 'sithonia', 'athos'] as const).map((area) => AREA_NAMES[area][locale]).join(' · ') },
    { href: '/beaches', icon: Waves, title: t('stripBeaches', { count: beaches.length }), sub: t('stripBeachesSub') },
    { href: '/blog', icon: BookOpen, title: t('stripBlog'), sub: t('stripBlogSub') },
  ];
  const plan = [
    { href: '/guide/best-time-to-visit', icon: CalendarDays, title: t('planBestTime') },
    { href: '/from', icon: Car, title: t('planGettingHere') },
    { href: '/costs/daily-budget', icon: Coins, title: t('planCosts') },
    { href: '/itinerary/7-days', icon: Route, title: t('planItineraries') },
  ];

  return (
    <>
      {/* ── Hero: shorter than the live one, so the page below shows on first view ── */}
      <section className="relative isolate overflow-hidden text-white">
        <link rel="preload" as="image" href="/images/hero/halkidiki-hero-mobile.avif" type="image/avif" media="(max-width: 640px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/hero/halkidiki-hero.avif" type="image/avif" media="(min-width: 641px)" fetchPriority="high" />
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero/halkidiki-hero-mobile.avif" type="image/avif" />
          <source media="(max-width: 640px)" srcSet="/images/hero/halkidiki-hero-mobile.webp" type="image/webp" />
          <source srcSet="/images/hero/halkidiki-hero.avif" type="image/avif" />
          <img src="/images/hero/halkidiki-hero.webp" alt="" fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover" />
        </picture>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-900/75 via-gray-900/45 to-gray-900/20" aria-hidden />
        <Container>
          <div className="py-10 sm:py-14 lg:py-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/85">{t('eyebrow')}</p>
              <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{t('h1')}</h1>
              <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">{t('lead')}</p>

              {/* z-20: the suggestions list must sit above the rows below it. */}
              <div className="relative z-20 mt-6 max-w-xl">
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

              <ul className="mt-5 grid max-w-2xl grid-cols-3 gap-2 sm:grid-cols-5">
                {shortcuts.map((s, i) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className={`flex h-full flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-center text-xs font-semibold transition sm:text-[13px] ${
                        i === 0 ? 'bg-white text-sea-700 shadow-lg' : 'glass-card text-white hover:bg-white/25'
                      }`}
                    >
                      <s.icon className="size-5 sm:size-6" aria-hidden />
                      <span>{s.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-white/90">
                <li className="flex items-center gap-1.5"><Check className="size-4" aria-hidden /> {t('heroDirect')}</li>
                <li className="flex items-center gap-1.5"><Check className="size-4" aria-hidden /> {t('heroNoFee')}</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── What the site has, in one row ── */}
      <section aria-label={shell('footerExplore')} className="border-b border-gray-100 bg-sand-50">
        <Container>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-5 py-5 lg:grid-cols-4 lg:divide-x lg:divide-gray-200">
            {strip.map((s) => (
              <li key={s.href} className="lg:px-6 lg:first:pl-0">
                <Link href={s.href} className="group flex items-center gap-3">
                  <s.icon className="size-7 shrink-0 text-sea-600" aria-hidden />
                  <span>
                    <span className="block text-sm font-bold text-gray-900 group-hover:text-sea-700">{s.title}</span>
                    <span className="block text-xs text-slate-500">{s.sub}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Availability request, first step (nothing is sent from here) ── */}
      <RequestBand locale={locale} />

      <Container>
        <RecentlyViewed className="pt-8" />
      </Container>

      {/* ── Stays first: the same cards as the live home page ── */}
      <section aria-labelledby="stay" className="py-12 sm:py-16">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h2 id="stay" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t('staysTitle')}</h2>
              <p className="mt-3 text-lg text-slate-500">{t('staysLead')}</p>
            </div>
            <Link href="/listings" className="inline-flex items-center gap-1.5 rounded-xl bg-sea-50 px-4 py-2 text-sm font-semibold text-sea-700 transition-colors hover:bg-sea-100">
              {common('viewAll')} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <CardGrid cols={3}>
            {stays.map((l) => (
              <Card
                key={l.slug}
                href={`/listings/${l.slug}`}
                favorite={{ type: 'listing', slug: l.slug }}
                title={displayName(l, locale, 'listing')}
                eyebrow={stayVillages.get(l.slug)}
                image={l.cover_url}
                live={live.has(l.id) ? stayT('liveAvailability') : undefined}
                meta={stayT('guests', { count: l.guests_max })}
                facts={CARD_FACTS.filter((k) => (l.amenities ?? []).includes(k)).slice(0, 3).map((key) => ({ key, label: amenityT(key) }))}
                price={l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${common('perNight')}` : undefined}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                {...ratingProps(l, 'listing')}
              />
            ))}
          </CardGrid>
        </Container>
      </section>

      {/* ── Last-minute openings (hidden when there are none) ── */}
      <HomeDeals locale={locale} areas={areaLabels} labels={{ badge: t('dealsBadge'), title: t('dealsTitle'), lead: t('dealsLead'), all: t('dealsAll') }} />

      {/* ── Peninsulas ── */}
      <section aria-labelledby="peninsulas" className="bg-mesh-light py-12 sm:py-16">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-[18rem_1fr]">
            <Intro id="peninsulas" label={shell('footerExplore')} title={t('peninsulasTitle')} lead={t('peninsulasLead')} href="/areas/kassandra" cta={t('allAreas')} />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {AREA_SLUGS.map((area) => {
                const img = areaImage(area);
                return (
                  <li key={area}>
                    <Link href={`/areas/${area}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
                        {img && <Image src={img} alt="" fill sizes={TILE_SIZES} className="object-cover transition duration-700 group-hover:scale-105" />}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="flex items-center justify-between gap-2 font-bold text-gray-900">
                          {AREA_NAMES[area][locale]}
                          <ArrowRight className="size-4 shrink-0 text-sea-600 transition group-hover:translate-x-1" aria-hidden />
                        </p>
                        <p className="mt-1 line-clamp-3 text-xs text-slate-500">{t(`${area}Blurb`)}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Beaches by what people look for ── */}
      <section aria-labelledby="beaches" className="py-12 sm:py-16">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-[18rem_1fr]">
            <Intro id="beaches" label={shell('beaches')} title={t('finderTitle')} lead={t('finderLead')} href="/beaches" cta={t('allBeaches')} />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {beachTiles.map((b) => (
                <li key={b.href}><Tile href={b.href} image={b.image} label={b.label} icon={Waves} sizes={TILE_SIZES} /></li>
              ))}
              <li><Tile href="/beaches" image={anyBeach?.image_url} label={t('everyBeach')} icon={MapIcon} sizes={TILE_SIZES} /></li>
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Villages and trip planning: compact, but every link stays ── */}
      <section aria-labelledby="villages" className="bg-sand-50 py-10 sm:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 id="villages" className="text-xl font-bold text-gray-900">{t('villagesTitle')}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {popular.map((v) => (
                  <li key={v.slug}>
                    <Link href={`/places/${v.slug}`} className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-sea-300 hover:bg-sea-50 hover:text-sea-700">
                      {placeName(v.slug, locale, v)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('planTitle')}</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {plan.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-sea-300 hover:text-sea-700">
                      <p.icon className="size-5 shrink-0 text-sea-600" aria-hidden /> {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Articles ── */}
      {articles.length > 0 && (
        <section aria-labelledby="articles" className="py-12 sm:py-16">
          <Container>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sea-700">{shell('blog')}</p>
                <h2 id="articles" className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t('articlesTitle')}</h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-sea-200 px-4 py-2 text-sm font-semibold text-sea-700 transition-colors hover:bg-sea-50">
                {t('allArticles')} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {articles.slice(0, 4).map((a) => (
                <li key={a.slug}>
                  <Link href={`/blog/${a.slug}`} className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
                      {a.image_url && <Image src={a.image_url} alt={greekAlt(a.image_alt, locale) ?? ''} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                    </div>
                    <h3 className="line-clamp-3 p-4 text-sm font-bold leading-snug text-gray-900 group-hover:text-sea-700">{pick(a, 'title', locale)}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
