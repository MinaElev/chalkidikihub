import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getBeaches, getEvents, getListings, getRestaurants, getVillage, getVillages, type VillageCard } from '@/lib/db/content';
import { BLUE_FLAG_2026, BLUE_FLAG_YEAR } from '@/content/beach-facts';
import { CENSUS_SOURCE, CENSUS_YEAR, MUNICIPALITY_NAMES, SEATRAC_VILLAGES, VILLAGE_FACTS } from '@/content/village-facts';
import { SEATRAC_SOURCE } from '@/content/beach-facts';
import { hasCoords, nearest } from '@/lib/geo';
import { cuisineStats, priceStats } from '@/lib/content/place-stats';
import { VillagePriceBenchmark } from '@/components/v3/VillagePriceBenchmark';
import { VillageCuisineRatio } from '@/components/v3/VillageCuisineRatio';
import { localize, pick } from '@/lib/i18n/localize';
import {
  nearActivities, nearBeaches, nearListings, nearRestaurants, nearVillages, displayName, ratingProps,
} from '@/lib/content/nearby';
import { AREA_NAMES, HALKIDIKI, inPlace, placeName } from '@/lib/content/place-names';
import { formatDistance, greekAlt } from '@/lib/content/format';
import { buildMetadata } from '@/lib/seo/metadata';
import { villageIndex } from '@/lib/seo/indexability';
import { geoLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, FactList, HeroImage, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { Faq } from '@/components/ui/Faq';
import { SeeAlso } from '@/components/ui/SeeAlso';
import { relatedArticles } from '@/lib/content/related';
import { ARTICLES_BY_VILLAGE, ATHOS_GATEWAYS } from '@/content/related-articles';
import { tr } from '@/content/editorial/athos';
import type { Faq as FaqItem } from '@/lib/seo/jsonld';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { WeatherBadge } from '@/components/v3/WeatherBadge';
import { QuickActions } from '@/components/ui/QuickActions';
import { RecentlyViewed } from '@/components/v3/RecentlyViewed';
import { renderLinked } from '@/lib/content/autolink';
import { detailParams } from '@/lib/build-params';

export const revalidate = 86400;

export async function generateStaticParams() {
  return detailParams(async () => (await getVillages()).filter((v) => v.slug !== 'pyrgadikia-mainland').map((v) => ({ slug: v.slug })));
}

async function load(slug: string) {
  const village = (await getVillage(slug)) as (VillageCard & Record<string, unknown>) | null;
  if (!village) return null;
  const beaches = hasCoords(village) ? await nearBeaches(village, 6) : [];
  const image = village.image_url || beaches[0]?.item.image_url || null;
  return { village, beaches, image };
}


export async function generateMetadata({ params }: PageProps<'/[locale]/places/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await load(slug);
  if (!data) return {};
  const t = await getTranslations({ locale, namespace: 'places' });
  const name = placeName(slug, locale, data.village);
  return buildMetadata({
    locale,
    path: `/places/${slug}`,
    title: t('villageMetaTitle', { name }),
    description: t('villageMetaDesc', { name, inPlace: inPlace(slug, locale), beaches: data.beaches.length }),
    image: data.image,
    indexableLocales: (await villageIndex())[slug] ?? [],
  });
}

export default async function VillagePage({ params }: PageProps<'/[locale]/places/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { village, beaches, image } = data;

  const [t, shell, common] = await Promise.all([
    getTranslations({ locale, namespace: 'places' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const name = placeName(slug, locale, village);
  const ip = inPlace(slug, locale);
  const body = localize(village, 'description', locale);
  const geo = hasCoords(village);

  // v3's price and cuisine insights, from the cached lists (no extra queries).
  const [allListings, allRestaurants, allVillages, allBeaches] = await Promise.all([getListings(), getRestaurants(), getVillages(), getBeaches()]);

  // Official facts only (src/content/village-facts.ts, beach-facts.ts). The
  // table's own population column held estimates and is never shown.
  const facts = VILLAGE_FACTS[slug];
  const blueFlagNear = geo
    ? nearest(village as { latitude: number; longitude: number }, allBeaches, 99, 10).filter(({ item }) => BLUE_FLAG_2026.has(item.slug)).length
    : 0;
  const municipality = facts ? MUNICIPALITY_NAMES[facts.municipality][locale] : null;
  const villageFaqs: FaqItem[] = [];
  if (facts) {
    villageFaqs.push({
      q: t('faqPopulationQ', { name }),
      a: t('faqPopulationA', { name, n: facts.population, year: CENSUS_YEAR }),
    });
    villageFaqs.push({ q: t('faqMunicipalityQ', { name }), a: t('faqMunicipalityA', { name, municipality: municipality! }) });
  }
  const homes = allVillages.filter((v) => v.slug !== 'pyrgadikia-mainland');
  const homeOf = (row: { latitude: number | null; longitude: number | null }) =>
    hasCoords(row) ? nearest(row as { latitude: number; longitude: number }, homes, 1, 6)[0]?.item.slug : undefined;
  const prices = priceStats(allListings.filter((l) => !l.is_closed && homeOf(l) === slug), allListings.filter((l) => !l.is_closed));
  const cuisine = cuisineStats(allRestaurants.filter((r) => homeOf(r) === slug), allRestaurants.filter((r) => r.area === village.area));

  const [restaurants, activities, stays, villages] = geo
    ? await Promise.all([
        nearRestaurants(village, 6),
        nearActivities(village, 4),
        nearListings(village, 8, 5),
        nearVillages(village, 6),
      ])
    : [[], [], [], []];
  // Events held in this village (closest village to the venue).
  const events = (await getEvents())
    .filter((e) => !/Σε όλη/.test(String(e.location_name ?? '')) && homeOf(e as unknown as { latitude: number | null; longitude: number | null }) === slug)
    .map((e) => ({ slug: String(e.slug), name: pick(e, 'name', locale) }))
    .filter((e) => e.name);
  // Every other stay that sits in this village (its closest village), by name.
  const shown = new Set(stays.map(({ item }) => item.slug));
  const moreStays = allListings
    .filter((l) => !l.is_closed && !shown.has(l.slug) && homeOf(l) === slug)
    .map((l) => ({ slug: l.slug, name: displayName(l, locale, 'listing') }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: AREA_NAMES[village.area][locale], path: `/areas/${village.area}` },
              { name, path: `/places/${slug}` },
            ]}
          />
        }
        title={`${name}, ${HALKIDIKI[locale]}`}
      >
        {village.latitude && village.longitude ? (
          <div className="mt-3">
            <WeatherBadge latitude={Number(village.latitude)} longitude={Number(village.longitude)} />
          </div>
        ) : null}
        <QuickActions lat={geo ? village.latitude : null} lng={geo ? village.longitude : null} directionsLabel={common('directions')} shareTitle={`${name}, ${HALKIDIKI[locale]}`} label={shell('quickActions')} />
      </PageIntro>
      <HeroImage src={image} alt={greekAlt(village.image_alt, locale) ?? name} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
          {/* Stored descriptions use <h3> sections; under the page <h1> they are the second level. */}
          <Prose html={await renderLinked(/<h2[\s>]/i.test(body.text) ? body.text : body.text.replace(/<(\/?)h3(?=[\s>])/gi, '<$1h2'), locale, `/places/${slug}`)} />
        </div>
        <aside className="space-y-3 text-sm lg:sticky lg:top-24 lg:self-start">
          <FactList
            items={[
              { label: t('factMunicipality'), value: municipality ? t('factMunicipalityValue', { municipality }) : null },
              {
                label: t('factPopulation'),
                value: facts ? (
                  <a href={CENSUS_SOURCE} target="_blank" rel="noopener" className="hover:text-sea-700 hover:underline">
                    {t('factPopulationValue', { n: facts.population, year: CENSUS_YEAR })}
                  </a>
                ) : null,
              },
              {
                label: t('factSeatrac'),
                value: SEATRAC_VILLAGES[slug] ? (
                  <a href={SEATRAC_SOURCE(SEATRAC_VILLAGES[slug])} target="_blank" rel="noopener" className="text-sea-700 hover:underline">
                    {t('factSeatracValue')}
                  </a>
                ) : null,
              },
              {
                label: t('factBlueFlagNear'),
                value: blueFlagNear > 0 ? (
                  <Link href={`/places/${slug}/beaches`} className="text-sea-700 hover:underline">
                    {t('factBlueFlagNearValue', { count: blueFlagNear, year: BLUE_FLAG_YEAR })}
                  </Link>
                ) : null,
              },
            ]}
          />
          {(['beaches', 'restaurants', 'activities'] as const).map((k) => (
            <Link
              key={k}
              href={`/places/${slug}/${k}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-800 hover:border-sea-300 hover:bg-sea-50"
            >
              {t(`${k}NearLink`, { inPlace: ip })}
              <span aria-hidden>→</span>
            </Link>
          ))}
        </aside>
      </div>

      {beaches.length > 0 && (
        <Section
          id="beaches"
          title={t('beachesNearHeading')}
          action={<Link href={`/places/${slug}/beaches`} className="text-sm font-semibold text-sea-700 hover:underline">{t('allNearbyBeaches')} →</Link>}
        >
          <CardGrid cols={3}>
            {beaches.map(({ item, km }) => (
              <Card
                key={item.slug}
                href={`/beaches/${item.slug}`}
                favorite={{ type: 'beach', slug: item.slug }}
                title={displayName(item, locale, 'beach')}
                image={item.image_url}
                imageAlt={greekAlt(item.image_alt, locale)}
                distance={formatDistance(km, locale)}
                {...ratingProps(item, 'beach')}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      {(prices.village || cuisine.total > 0) && (
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <VillagePriceBenchmark stats={prices} villageName={locale === 'el' ? ip : name} locale={locale} />
          <VillageCuisineRatio stats={cuisine} locale={locale} />
        </div>
      )}

      {stays.length > 0 && (
        <Section id="stay" title={t('staysHeading', { inPlace: ip })} intro={t('staysIntro')}>
          <CardGrid>
            {stays.map(({ item, km }) => (
              <Card
                key={item.slug}
                href={`/listings/${item.slug}`}
                favorite={{ type: 'listing', slug: item.slug }}
                title={displayName(item, locale, 'listing')}
                image={item.cover_url}
                distance={formatDistance(km, locale)}
                {...ratingProps(item, 'listing')}
                price={item.price_per_night ? `${common('from')} €${Math.round(item.price_per_night)} ${common('perNight')}` : undefined}
              />
            ))}
          </CardGrid>
          {moreStays.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">{t('moreStaysHeading', { inPlace: ip, count: moreStays.length })}</h3>
              <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {moreStays.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/listings/${m.slug}`} className="text-sea-700 hover:underline">{m.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {events.length > 0 && (
        <Section id="events" title={t('eventsHeading', { inPlace: ip })}>
          <ul className="flex flex-wrap gap-2">
            {events.map((e) => (
              <li key={e.slug}>
                <Link href={`/events/${e.slug}`} className="inline-block rounded-full border border-sea-200 bg-white px-3 py-1.5 text-sm font-medium text-sea-800 hover:bg-sea-50">{e.name}</Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {restaurants.length > 0 && (
        <Section
          id="food"
          title={t('restaurantsNearHeading')}
          action={<Link href={`/places/${slug}/restaurants`} className="text-sm font-semibold text-sea-700 hover:underline">{t('allNearbyRestaurants')} →</Link>}
        >
          <CardGrid cols={3}>
            {restaurants.map(({ item, km }) => (
              <Card
                key={item.slug}
                href={`/restaurants/${item.slug}`}
                favorite={{ type: 'restaurant', slug: item.slug }}
                title={displayName(item, locale, 'restaurant')}
                image={item.image_url}
                imageAlt={greekAlt(item.image_alt, locale)}
                distance={formatDistance(km, locale)}
                {...ratingProps(item, 'restaurant')}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      {activities.length > 0 && (
        <Section
          id="activities"
          title={t('activitiesNearHeading')}
          action={<Link href={`/places/${slug}/activities`} className="text-sm font-semibold text-sea-700 hover:underline">{t('allNearbyActivities')} →</Link>}
        >
          <CardGrid>
            {activities.map(({ item, km }) => (
              <Card
                key={item.slug}
                href={`/activities/${item.slug}`}
                favorite={{ type: 'activity', slug: item.slug }}
                title={displayName(item, locale, 'activity')}
                image={item.image_url}
                imageAlt={greekAlt(item.image_alt, locale)}
                distance={formatDistance(km, locale)}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      <SeeAlso
        title={common('seeAlso')}
        links={[
          ...(ATHOS_GATEWAYS.has(slug)
            ? [
                { href: '/mount-athos', label: tr('guide', locale) },
                { href: '/mount-athos/how-to-visit', label: `${tr('mountAthos', locale)}: ${tr('navHowToVisit', locale)}` },
                { href: '/mount-athos/monasteries', label: tr('navMonasteries', locale) },
              ]
            : []),
          ...(await relatedArticles(ARTICLES_BY_VILLAGE[slug] ?? [], locale)),
        ]}
      />
      <Faq title={common('faqTitle')} items={villageFaqs} />

      {villages.length > 0 && (
        <Section id="nearby-villages" title={t('nearbyVillages')}>
          <ul className="flex flex-wrap gap-2">
            {villages.map(({ item: v, km }) => (
              <li key={v.slug}>
                <Link href={`/places/${v.slug}`} className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-sea-100">
                  {placeName(v.slug, locale, v)}
                  <span className="text-xs text-slate-500">{formatDistance(km, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <RecentlyViewed type="village" slug={slug} title={name} image={image} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Place',
          name,
          containedInPlace: { '@type': 'Place', name: `${AREA_NAMES[village.area][locale]}, ${HALKIDIKI[locale]}` },
          geo: geoLd(village),
          image: image ?? undefined,
        }}
      />
    </Container>
  );
}
