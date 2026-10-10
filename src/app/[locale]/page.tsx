import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, CalendarDays, Car, Coins, Route } from 'lucide-react';
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
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, Section } from '@/components/ui/Layout';

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

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, common, beaches, villages, listings, articles, areas] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getBeaches(),
    getVillages(),
    getListings(),
    getArticles(),
    getAreas(),
  ]);

  const topBeaches = [...beaches]
    .filter((b) => b.image_url)
    .sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0) || (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 8);
  const openStays = listings.filter((l) => !l.is_closed && l.cover_url).slice(0, 8);
  const [beachVillages, stayVillages] = await Promise.all([closestVillagesFor(topBeaches, locale), closestVillagesFor(openStays, locale, 6)]);
  const popular = POPULAR_VILLAGES.map((s) => villages.find((v) => v.slug === s)).filter((v): v is NonNullable<typeof v> => Boolean(v));
  const areaImage = (slug: string) => {
    const row = areas.find((a) => a.slug === slug);
    const own = row?.image_url as string | undefined;
    if (own && own.startsWith('http')) return own;
    if (own) return own;
    return beaches.find((b) => b.area === slug && b.image_url)?.image_url ?? null;
  };

  const plan = [
    { href: '/guide/best-time-to-visit', icon: CalendarDays, title: t('planBestTime'), text: t('planBestTimeText') },
    { href: '/from', icon: Car, title: t('planGettingHere'), text: t('planGettingHereText') },
    { href: '/costs/daily-budget', icon: Coins, title: t('planCosts'), text: t('planCostsText') },
    { href: '/itinerary/7-days', icon: Route, title: t('planItineraries'), text: t('planItinerariesText') },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero/halkidiki-hero-mobile.avif" type="image/avif" />
          <source media="(max-width: 640px)" srcSet="/images/hero/halkidiki-hero-mobile.webp" type="image/webp" />
          <source srcSet="/images/hero/halkidiki-hero.avif" type="image/avif" />
          <img
            src="/images/hero/halkidiki-hero.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sea-950/30 via-sea-950/40 to-sea-950/70" aria-hidden />
        <Container className="py-24 text-white sm:py-32">
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">{t('h1')}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90">{t('lead')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/beaches" className="rounded-xl bg-white px-5 py-3 font-semibold text-sea-900 hover:bg-sand-50">{t('ctaBeaches')}</Link>
            <Link href="/listings" className="rounded-xl bg-sea-600 px-5 py-3 font-semibold text-white ring-1 ring-white/30 hover:bg-sea-700">{t('ctaStay')}</Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-white/90">
            <div><dt className="sr-only">{t('statBeaches')}</dt><dd><span className="text-2xl font-semibold text-white">{beaches.length}</span> {t('statBeaches')}</dd></div>
            <div><dt className="sr-only">{t('statVillages')}</dt><dd><span className="text-2xl font-semibold text-white">{villages.length - 1}</span> {t('statVillages')}</dd></div>
            <div><dt className="sr-only">{t('statStays')}</dt><dd><span className="text-2xl font-semibold text-white">{listings.length}</span> {t('statStays')}</dd></div>
          </dl>
        </Container>
      </section>

      <Container>
        <Section id="peninsulas" title={t('peninsulasTitle')} intro={t('peninsulasLead')}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AREA_SLUGS.map((area) => {
              const img = areaImage(area);
              return (
                <Link key={area} href={`/areas/${area}`} className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-sea-800 p-5 text-white">
                  {img && <Image src={img} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="-z-0 object-cover transition duration-500 group-hover:scale-105" />}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden />
                  <span className="relative">
                    <span className="block font-display text-2xl font-semibold">{AREA_NAMES[area][locale]}</span>
                    <span className="mt-1 block text-sm text-white/85">{t(`${area}Blurb`)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </Section>

        <Section
          id="beaches"
          title={t('beachesTitle')}
          action={<Link href="/beaches" className="inline-flex items-center gap-1 text-sm font-semibold text-sea-700 hover:underline">{common('viewAll')} <ArrowRight className="size-4" aria-hidden /></Link>}
        >
          <CardGrid>
            {topBeaches.map((b) => (
              <Card key={b.slug} href={`/beaches/${b.slug}`} title={displayName(b, locale, 'beach')} eyebrow={beachVillages.get(b.slug)} image={b.image_url} imageAlt={b.image_alt} {...ratingProps(b, 'beach')} />
            ))}
          </CardGrid>
        </Section>

        <Section
          id="stay"
          title={t('staysTitle')}
          intro={t('staysLead')}
          action={<Link href="/listings" className="inline-flex items-center gap-1 text-sm font-semibold text-sea-700 hover:underline">{common('viewAll')} <ArrowRight className="size-4" aria-hidden /></Link>}
        >
          <CardGrid>
            {openStays.map((l) => (
              <Card
                key={l.slug}
                href={`/listings/${l.slug}`}
                title={displayName(l, locale, 'listing')}
                eyebrow={stayVillages.get(l.slug)}
                image={l.cover_url}
                meta={l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${common('perNight')}` : undefined}
                {...ratingProps(l, 'listing')}
              />
            ))}
          </CardGrid>
        </Section>

        <Section id="villages" title={t('villagesTitle')}>
          <ul className="flex flex-wrap gap-2">
            {popular.map((v) => {
              const count = nearest(v, beaches, 99, 10).length;
              return (
                <li key={v.slug}>
                  <Link href={`/places/${v.slug}`} className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-sea-100">
                    {placeName(v.slug, locale, v)}
                    <span className="text-xs text-slate-500">{count}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/places" className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-sea-700 hover:underline">
                {shell('places')} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </li>
          </ul>
        </Section>

        <Section id="plan" title={t('planTitle')}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plan.map((p) => (
              <Link key={p.href} href={p.href} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-sea-300 hover:shadow-md">
                <p.icon className="size-6 text-sea-600" aria-hidden />
                <p className="mt-3 font-semibold text-slate-900">{p.title}</p>
                <p className="mt-1 text-sm text-slate-600">{p.text}</p>
              </Link>
            ))}
          </div>
        </Section>

        <Section
          id="articles"
          title={t('articlesTitle')}
          action={<Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-sea-700 hover:underline">{common('viewAll')} <ArrowRight className="size-4" aria-hidden /></Link>}
        >
          <CardGrid cols={3}>
            {articles.slice(0, 3).map((a) => (
              <Card key={a.slug} href={`/blog/${a.slug}`} title={pick(a, 'title', locale)} image={a.image_url} imageAlt={a.image_alt} meta={plainText(pick(a, 'excerpt', locale), 110)} />
            ))}
          </CardGrid>
        </Section>

        <section className="mt-16 rounded-3xl bg-sea-900 px-6 py-10 text-white sm:px-10">
          <h2 className="font-display text-2xl font-semibold">{t('ownersTitle')}</h2>
          <p className="mt-2 max-w-2xl text-white/85">{t('ownersText')}</p>
          <Link href="/for-owners" className="mt-5 inline-flex items-center gap-1 rounded-xl bg-white px-5 py-3 font-semibold text-sea-900 hover:bg-sand-50">
            {t('ownersCta')} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </Container>
    </>
  );
}
