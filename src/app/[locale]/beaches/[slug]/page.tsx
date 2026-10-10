import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getBeach, getBeaches, type BeachCard } from '@/lib/db/content';
import { driveMinutes, hasCoords } from '@/lib/geo';
import { localize, pick } from '@/lib/i18n/localize';
import {
  closestVillage, displayName, nearBeaches, nearListings, nearRestaurants, ratingProps,
} from '@/lib/content/nearby';
import { AREA_LOCATIVE, AREA_NAMES, fromPlace, inPlace, placeName } from '@/lib/content/place-names';
import { formatDistance, formatList } from '@/lib/content/format';
import { plainText, renderRichText } from '@/lib/content/render';
import { genuineReviews, ratingOf, type ReviewRow } from '@/lib/content/reviews';
import { assessQuality } from '@/lib/seo/quality';
import { buildMetadata } from '@/lib/seo/metadata';
import { addressLd, geoLd, ratingLd, type Faq as FaqItem } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { Container, FactList, HeroImage, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { Reviews } from '@/components/ui/Reviews';
import { SeaTemperature } from '@/components/beach/SeaTemperature';

export const revalidate = 86400;

export async function generateStaticParams() {
  return (await getBeaches()).map((b) => ({ slug: b.slug }));
}

type BeachRow = BeachCard & Record<string, unknown> & { beach_reviews?: ReviewRow[] };

async function load(slug: string) {
  const beach = (await getBeach(slug)) as BeachRow | null;
  if (!beach) return null;
  const village = hasCoords(beach) ? await closestVillage(beach, 12) : null;
  const reviews = genuineReviews(beach.beach_reviews);
  return { beach, village, reviews, rating: ratingOf(reviews) };
}

const features = (b: BeachRow) => (b.features as string[]) ?? [];

function indexable(beach: BeachRow): Locale[] {
  return locales.filter((l) => {
    const body = localize(beach, 'description', l);
    return assessQuality({ body: body.text, nativeBody: body.native, hasImage: Boolean(beach.image_url) }, 'detail').indexable;
  });
}

export async function generateMetadata({ params }: PageProps<'/[locale]/beaches/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await load(slug);
  if (!data) return {};
  const { beach, village } = data;
  const t = await getTranslations({ locale, namespace: 'beach' });
  const labels = await getTranslations({ locale, namespace: 'beachFeatures' });
  const name = displayName(beach, locale, 'beach');
  const place = village ? placeName(village.item.slug, locale, village.item) : AREA_NAMES[beach.area][locale];
  const metaTitle = localize(beach, 'meta_title', locale);
  const metaDesc = localize(beach, 'meta_description', locale);
  const featureText = formatList(features(beach).filter((f) => labels.has(f)).slice(0, 4).map((f) => labels(f).toLocaleLowerCase()), locale);

  return buildMetadata({
    locale,
    path: `/beaches/${slug}`,
    // Keep hand-written titles that already rank; generate the rest.
    title: metaTitle.native ? metaTitle.text : t('metaTitle', { name, place }),
    description: metaDesc.native
      ? metaDesc.text
      : t('metaDesc', { name, inPlace: village ? inPlace(village.item.slug, locale) : place, features: featureText || plainText(pick(beach, 'description', locale), 60) }),
    image: beach.image_url,
    imageAlt: beach.image_alt ?? name,
    indexableLocales: indexable(beach),
  });
}

export default async function BeachPage({ params }: PageProps<'/[locale]/beaches/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { beach, village, reviews, rating } = data;

  const [t, shell, common, labels] = await Promise.all([
    getTranslations({ locale, namespace: 'beach' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'beachFeatures' }),
  ]);

  const name = displayName(beach, locale, 'beach');
  const body = localize(beach, 'description', locale);
  const f = features(beach);
  const geo = hasCoords(beach);

  const [beaches, food, stays] = geo
    ? await Promise.all([nearBeaches(beach, 7), nearRestaurants(beach, 4), nearListings(beach, 4, 8)])
    : [[], [], []];
  const otherBeaches = beaches.filter((b) => b.item.slug !== slug).slice(0, 6);

  const shore = f.includes('sandy') && f.includes('pebble') ? t('faqMixedShoreA') : f.includes('sandy') ? t('faqSandyA') : f.includes('pebble') ? t('faqPebbleA') : null;
  const organized = f.includes('organized') || f.includes('sunbeds');
  const access = organized && f.includes('free') ? t('mixedValue') : organized ? t('organizedValue') : f.includes('free') ? t('freeValue') : null;
  const villageName = village ? placeName(village.item.slug, locale, village.item) : null;

  // FAQ answers state only what the data positively records — v3 turned a
  // missing tag into "no sunbeds" and contradicted its own article.
  const faqs: FaqItem[] = [];
  if (village) {
    faqs.push({
      q: t('faqWhereQ', { name }),
      a: t('faqWhereA', {
        inArea: AREA_LOCATIVE[beach.area][locale],
        km: formatDistance(village.km, locale),
        fromPlace: fromPlace(village.item.slug, locale, village.item),
        minutes: driveMinutes(village.km),
      }),
    });
  }
  if (shore) faqs.push({ q: t('faqShoreQ'), a: shore });
  if (f.includes('shallowWater')) faqs.push({ q: t('faqKidsQ'), a: t('faqKidsA') });
  if (organized) faqs.push({ q: t('faqSunbedsQ'), a: t('faqSunbedsA') });
  if (f.includes('parking')) faqs.push({ q: t('faqParkingQ'), a: t('faqParkingA') });
  if (f.includes('nudist')) faqs.push({ q: t('faqNudistQ'), a: t('faqNudistA') });
  if (f.includes('blue-flag')) faqs.push({ q: t('faqBlueFlagQ'), a: t('faqBlueFlagA') });
  if (f.includes('accessible')) faqs.push({ q: t('faqAccessibleQ'), a: t('faqAccessibleA') });

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('beaches'), path: '/beaches' },
              ...(village ? [{ name: villageName!, path: `/places/${village.item.slug}/beaches` }] : []),
              { name, path: `/beaches/${slug}` },
            ]}
          />
        }
        title={name}
      >
        <p className="mt-2 text-slate-600">
          {village ? `${villageName}, ${AREA_NAMES[beach.area][locale]}` : AREA_NAMES[beach.area][locale]}
        </p>
      </PageIntro>
      <HeroImage src={beach.image_url} alt={beach.image_alt || name} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
          <Prose html={renderRichText(body.text, locale)} />
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <FactList
            items={[
              {
                label: t('location'),
                value: village ? (
                  <Link href={`/places/${village.item.slug}`} className="text-sea-700 hover:underline">
                    {t('distanceTo', { km: formatDistance(village.km, locale), fromPlace: fromPlace(village.item.slug, locale, village.item) })}
                  </Link>
                ) : AREA_NAMES[beach.area][locale],
              },
              { label: t('shore'), value: shore },
              { label: t('access'), value: access },
              {
                label: t('features'),
                value: f.filter((x) => labels.has(x) && !['sandy', 'pebble', 'free', 'organized'].includes(x)).map((x) => labels(x)).join(' · ') || null,
              },
            ]}
          />
          {geo && (
            <Suspense fallback={null}>
              <SeaTemperature locale={locale} lat={beach.latitude!} lng={beach.longitude!} />
            </Suspense>
          )}
          {geo && <MapEmbed lat={beach.latitude!} lng={beach.longitude!} title={`${t('map')}: ${name}`} directionsLabel={common('directions')} />}
        </aside>
      </div>

      <Reviews locale={locale} title={t('reviewsHeading')} empty={t('noReviews')} reviews={reviews} rating={rating} />
      <Faq title={common('faqTitle')} items={faqs} />

      {otherBeaches.length > 0 && (
        <Section id="nearby-beaches" title={t('nearbyBeaches')}>
          <CardGrid cols={3}>
            {otherBeaches.map(({ item, km }) => (
              <Card key={item.slug} href={`/beaches/${item.slug}`} title={displayName(item, locale, 'beach')} image={item.image_url} imageAlt={item.image_alt} distance={formatDistance(km, locale)} {...ratingProps(item, 'beach')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {food.length > 0 && (
        <Section id="nearby-food" title={t('nearbyFood')}>
          <CardGrid>
            {food.map(({ item, km }) => (
              <Card key={item.slug} href={`/restaurants/${item.slug}`} title={displayName(item, locale, 'restaurant')} image={item.image_url} imageAlt={item.image_alt} distance={formatDistance(km, locale)} {...ratingProps(item, 'restaurant')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {stays.length > 0 && (
        <Section id="nearby-stays" title={t('nearbyStays')}>
          <CardGrid>
            {stays.map(({ item, km }) => (
              <Card key={item.slug} href={`/listings/${item.slug}`} title={displayName(item, locale, 'listing')} image={item.cover_url} distance={formatDistance(km, locale)} {...ratingProps(item, 'listing')} />
            ))}
          </CardGrid>
        </Section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Beach',
          name,
          description: plainText(body.text, 300),
          image: beach.image_url ?? undefined,
          geo: geoLd(beach),
          address: addressLd(villageName),
          aggregateRating: ratingLd(rating.rating, rating.count),
          amenityFeature: f
            .filter((x) => labels.has(x))
            .map((x) => ({ '@type': 'LocationFeatureSpecification', name: labels(x), value: true })),
        }}
      />
    </Container>
  );
}
