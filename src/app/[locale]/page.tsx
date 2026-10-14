import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, CalendarDays, Car, ChevronDown, Coins, Route, Search } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { AREA_SLUGS, getAreas, getArticles, getBeaches, getListings, getVillages } from '@/lib/db/content';
import { nearest } from '@/lib/geo';
import { pick } from '@/lib/i18n/localize';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, placeName } from '@/lib/content/place-names';
import { formatPrice } from '@/lib/content/format';
import { plainText } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Layout';
import { PhotoCard } from '@/components/ui/PhotoCard';
import { Rail } from '@/components/ui/Rail';
import { ClientIntl } from '@/components/ClientIntl';
import { BeachFinder, type FinderBeach } from '@/components/home/BeachFinder';

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

function Heading({ id, title, lead, action, light = false }: { id: string; title: string; lead?: string; action?: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <h2 id={id} className={`font-display text-3xl font-semibold leading-tight sm:text-4xl ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
        {lead && <p className={`mt-3 text-lg ${light ? 'text-white/80' : 'text-slate-600'}`}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, common, search, finder, features, beaches, villages, listings, articles, areas] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'search' }),
    getTranslations({ locale, namespace: 'finder' }),
    getTranslations({ locale, namespace: 'beachFeatures' }),
    getBeaches(),
    getVillages(),
    getListings(),
    getArticles(),
    getAreas(),
  ]);

  const ranked = [...beaches]
    .filter((b) => b.image_url)
    .sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0) || (b.rating ?? 0) - (a.rating ?? 0));
  const openStays = listings.filter((l) => !l.is_closed && l.cover_url).slice(0, 10);
  const [beachVillages, stayVillages] = await Promise.all([closestVillagesFor(ranked, locale), closestVillagesFor(openStays, locale, 6)]);

  const finderBeaches: FinderBeach[] = ranked.map((b) => ({
    slug: b.slug,
    name: displayName(b, locale, 'beach'),
    village: beachVillages.get(b.slug),
    image: b.image_url,
    imageAlt: b.image_alt,
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
    { href: '/guide/best-time-to-visit', icon: CalendarDays, title: t('planBestTime'), text: t('planBestTimeText'), tone: 'from-sea-500 to-sea-700' },
    { href: '/from', icon: Car, title: t('planGettingHere'), text: t('planGettingHereText'), tone: 'from-sun-600 to-sun-700' },
    { href: '/costs/daily-budget', icon: Coins, title: t('planCosts'), text: t('planCostsText'), tone: 'from-pine-600 to-sea-800' },
    { href: '/itinerary/7-days', icon: Route, title: t('planItineraries'), text: t('planItinerariesText'), tone: 'from-sea-800 to-sea-950' },
  ];
  const [lead, ...moreArticles] = articles.slice(0, 4);
  const viewAll = (href: string, light = false) => (
    <Link href={href} className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${light ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-sea-50 text-sea-800 hover:bg-sea-100'}`}>
      {common('viewAll')} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative isolate flex min-h-[600px] items-end overflow-hidden text-white" style={{ height: '92svh' }}>
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero/halkidiki-hero-mobile.avif" type="image/avif" />
          <source media="(max-width: 640px)" srcSet="/images/hero/halkidiki-hero-mobile.webp" type="image/webp" />
          <source srcSet="/images/hero/halkidiki-hero.avif" type="image/avif" />
          <img src="/images/hero/halkidiki-hero.webp" alt="" fetchPriority="high" decoding="async" className="kenburns absolute inset-0 -z-20 size-full object-cover" />
        </picture>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sea-950/50 via-sea-950/20 to-sea-950/85" aria-hidden />
        <Container className="pb-20 sm:pb-28">
          <p className="rise inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/25 backdrop-blur">{t('heroEyebrow')}</p>
          <h1 className="rise rise-2 mt-5 max-w-4xl font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">{t('h1')}</h1>
          <p className="rise rise-3 mt-5 max-w-2xl text-lg text-white/90 sm:text-xl">{t('lead')}</p>
          <form action={locale === 'el' ? '/search' : `/${locale}/search`} role="search" className="rise rise-4 mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white/95 p-1.5 pl-5 shadow-2xl shadow-sea-950/30 ring-1 ring-white/40">
            <Search className="size-5 shrink-0 text-sea-700" aria-hidden />
            <label htmlFor="hero-q" className="sr-only">{search('title')}</label>
            <input id="hero-q" name="q" type="search" minLength={2} required placeholder={search('placeholder')} className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none" />
            <button type="submit" className="rounded-full bg-sun-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sun-700">{search('submit')}</button>
          </form>
          <div className="rise rise-4 mt-5 flex flex-wrap gap-2">
            <Link href="/beaches" className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25">{t('ctaBeaches')}</Link>
            <Link href="/listings" className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25">{t('ctaStay')}</Link>
            <Link href="/places" className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25">{shell('places')}</Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-white/85">
            <div><dt className="sr-only">{t('statBeaches')}</dt><dd><span className="font-display text-3xl font-semibold text-white">{beaches.length}</span> {t('statBeaches')}</dd></div>
            <div><dt className="sr-only">{t('statVillages')}</dt><dd><span className="font-display text-3xl font-semibold text-white">{villages.length - 1}</span> {t('statVillages')}</dd></div>
            <div><dt className="sr-only">{t('statStays')}</dt><dd><span className="font-display text-3xl font-semibold text-white">{listings.length}</span> {t('statStays')}</dd></div>
          </dl>
        </Container>
        <a href="#peninsulas" className="nudge absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full bg-white/15 p-2 ring-1 ring-white/30 backdrop-blur sm:block" aria-label={t('peninsulasTitle')}>
          <ChevronDown className="size-5" aria-hidden />
        </a>
      </section>

      {/* ── Peninsulas: an accordion of photos on desktop, a swipe row on phones ── */}
      <section aria-labelledby="peninsulas" className="reveal py-16 sm:py-24">
        <Container>
          <Heading id="peninsulas" title={t('peninsulasTitle')} lead={t('peninsulasLead')} />
          <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:h-[30rem] lg:overflow-visible lg:px-0">
            {AREA_SLUGS.map((area) => {
              const img = areaImage(area);
              return (
                <Link
                  key={area}
                  href={`/areas/${area}`}
                  className="group relative isolate flex aspect-[3/4] w-[75vw] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl bg-sea-800 p-6 text-white transition-[flex-grow] duration-700 ease-out sm:w-[22rem] lg:aspect-auto lg:w-auto lg:flex-1 lg:hover:flex-[2.2]"
                >
                  {img && <Image src={img} alt="" fill sizes="(min-width: 1024px) 40vw, 75vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />}
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
                  <span className="block font-display text-2xl font-semibold sm:text-3xl">{AREA_NAMES[area][locale]}</span>
                  <span className="mt-2 block max-w-sm text-sm text-white/85 transition duration-500 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-24 lg:group-hover:opacity-100">{t(`${area}Blurb`)}</span>
                  <span className="mt-4 inline-flex size-10 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 backdrop-blur transition group-hover:bg-sun-600 group-hover:ring-sun-500">
                    <ArrowRight className="size-5" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Beach finder ── */}
      <section aria-labelledby="beaches" className="bg-gradient-to-b from-sand-50 to-white py-16 sm:py-24">
        <Container className="reveal">
          <Heading id="beaches" title={t('finderTitle')} lead={t('finderLead')} />
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

      {/* ── Stays ── */}
      <section aria-labelledby="stay" className="reveal py-16 sm:py-24">
        <Container>
          <Heading id="stay" title={t('staysTitle')} lead={t('staysLead')} action={viewAll('/listings')} />
          <Rail prevLabel={finder('prev')} nextLabel={finder('next')}>
            {openStays.map((l) => (
              <PhotoCard
                key={l.slug}
                href={`/listings/${l.slug}`}
                title={displayName(l, locale, 'listing')}
                eyebrow={stayVillages.get(l.slug)}
                image={l.cover_url}
                meta={l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${common('perNight')}` : undefined}
                {...ratingProps(l, 'listing')}
              />
            ))}
          </Rail>
        </Container>
      </section>

      {/* ── Villages ── */}
      <section aria-labelledby="villages" className="reveal bg-sea-950 py-16 text-white sm:py-24">
        <Container>
          <Heading id="villages" title={t('villagesTitle')} action={viewAll('/places', true)} light />
          {pictured.length > 0 && (
            <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] lg:grid-cols-4">
              {pictured.map((v, i) => (
                <Link
                  key={v.slug}
                  href={`/places/${v.slug}`}
                  className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-3xl p-5 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                >
                  <Image src={v.image_url!} alt="" fill sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'} className="-z-10 object-cover transition duration-700 group-hover:scale-110" />
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 to-transparent" aria-hidden />
                  <span className={`font-display font-semibold ${i === 0 ? 'text-3xl' : 'text-xl'}`}>{placeName(v.slug, locale, v)}</span>
                  {nearest(v, beaches, 99, 10).length > 0 && (
                    <span className="text-sm text-white/80">{common('nearby')}: {nearest(v, beaches, 99, 10).length} {t('statBeaches')}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
          <ul className="mt-6 flex flex-wrap gap-2">
            {chips.map((v) => (
              <li key={v.slug}>
                <Link href={`/places/${v.slug}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/15 transition hover:bg-white/20">
                  {placeName(v.slug, locale, v)}
                  <span className="text-xs text-sun-300">{nearest(v, beaches, 99, 10).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Plan ── */}
      <section aria-labelledby="plan" className="reveal py-16 sm:py-24">
        <Container>
          <Heading id="plan" title={t('planTitle')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plan.map((p) => (
              <Link key={p.href} href={p.href} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.tone} p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}>
                <p.icon className="size-8 text-white/90 transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" aria-hidden />
                <p className="mt-6 font-display text-xl font-semibold">{p.title}</p>
                <p className="mt-1.5 text-sm text-white/85">{p.text}</p>
                <ArrowRight className="mt-4 size-5 transition group-hover:translate-x-1" aria-hidden />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Articles: one lead story and two more ── */}
      {lead && (
        <section aria-labelledby="articles" className="reveal pb-16 sm:pb-24">
          <Container>
            <Heading id="articles" title={t('articlesTitle')} action={viewAll('/blog')} />
            <div className="grid gap-6 lg:grid-cols-5">
              <Link href={`/blog/${lead.slug}`} className="group lg:col-span-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-sand-100 shadow-lg shadow-sea-950/10">
                  {lead.image_url && <Image src={lead.image_url} alt={lead.image_alt || ''} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold leading-snug text-slate-900 group-hover:text-sea-700 sm:text-3xl">{pick(lead, 'title', locale)}</h3>
                <p className="mt-2 line-clamp-3 text-slate-600">{plainText(pick(lead, 'excerpt', locale), 220)}</p>
              </Link>
              <div className="grid content-start gap-6 lg:col-span-2">
                {moreArticles.map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`} className="group grid grid-cols-[8rem_1fr] items-center gap-4 sm:grid-cols-[11rem_1fr]">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand-100">
                      {a.image_url && <Image src={a.image_url} alt={a.image_alt || ''} fill sizes="11rem" className="object-cover transition duration-700 group-hover:scale-110" />}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-snug text-slate-900 group-hover:text-sea-700">{pick(a, 'title', locale)}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{plainText(pick(a, 'excerpt', locale), 120)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Owners ── */}
      <section className="reveal px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-sea-800 via-sea-900 to-sea-950 px-6 py-12 text-white sm:px-12 sm:py-16">
          <span className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-sun-500/30 blur-3xl" aria-hidden />
          <span className="absolute -bottom-32 left-1/3 -z-10 size-80 rounded-full bg-sea-400/20 blur-3xl" aria-hidden />
          <h2 className="max-w-2xl font-display text-3xl font-semibold sm:text-4xl">{t('ownersTitle')}</h2>
          <p className="mt-3 max-w-2xl text-lg text-white/85">{t('ownersText')}</p>
          <Link href="/for-owners" className="mt-7 inline-flex items-center gap-2 rounded-full bg-sun-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-sun-700">
            {t('ownersCta')} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
