import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getBeach, getBeaches, type BeachCard } from '@/lib/db/content';
import { hasCoords } from '@/lib/geo';
import { localize } from '@/lib/i18n/localize';
import {
  closestVillage, displayName, nearBeaches, nearListings, nearRestaurants, ratingProps,
} from '@/lib/content/nearby';
import { AREA_LOCATIVE, AREA_NAMES, fromPlace, inPlace, placeName } from '@/lib/content/place-names';
import { formatDistance, formatList, formatMetres, greekAlt } from '@/lib/content/format';
import { BEACH_PROFILES, BLUE_FLAG_2026, BLUE_FLAG_SOURCE, BLUE_FLAG_YEAR, PROFILE_SOURCE, SEATRAC_BEACHES, SEATRAC_SOURCE, LIFEGUARD_REQUIRED, LIFEGUARD_SOURCE, LIFEGUARD_YEARS } from '@/content/beach-facts';
import { documentedFeatures, OFFICIAL_ONLY } from '@/lib/content/beach-documented';
import { plainText } from '@/lib/content/render';
import { genuineReviews, ratingOf, type ReviewRow } from '@/lib/content/reviews';
import { buildMetadata, DESC_MAX } from '@/lib/seo/metadata';
import { beachIndex } from '@/lib/seo/indexability';
import { addressLd, geoLd, type Faq as FaqItem } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { Container, FactList, HeroImage, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { Reviews } from '@/components/ui/Reviews';
import { SeaTemperature } from '@/components/beach/SeaTemperature';
import { QuickActions } from '@/components/ui/QuickActions';
import { ReviewForm } from '@/components/v3/ReviewForm';
import { ShareButtons } from '@/components/v3/ShareButtons';
import { CrowdIndicator } from '@/components/v3/CrowdIndicator';
import { ClientIntl } from '@/components/ClientIntl';
import { RecentlyViewed } from '@/components/v3/RecentlyViewed';
import { renderLinked } from '@/lib/content/autolink';
import { detailParams } from '@/lib/build-params';

export const revalidate = 86400;

export async function generateStaticParams() {
  return detailParams(async () => (await getBeaches()).map((b) => ({ slug: b.slug })));
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

// Stored de/bg/ru/ro/sr titles and descriptions were machine-translated word by
// word ("Пляж Гимнастов", "Plaja Gura Cormoranului"), and some el/en ones name the
// peninsula the beach is not on (v3's slugs had the wrong one). Those fall back to
// the templates, which use the corrected names.
const AREA_WORDS: Record<string, RegExp> = {
  kassandra: /Kassandra|Κασσάνδρ/i,
  sithonia: /Sithonia|Σιθωνί/i,
  athos: /Athos|Άθω|Αθώ/i,
};
function storedMetaOk(text: string, locale: Locale, area: string) {
  if (locale !== 'el' && locale !== 'en') return false;
  return !Object.entries(AREA_WORDS).some(([a, re]) => a !== area && re.test(text));
}

/** German feature labels that begin with an adjective ("Organisiert", "Flaches Wasser"). */
const DE_ADJECTIVE_LABELS = new Set(['organized', 'free', 'shallowWater', 'accessible', 'secluded', 'family-friendly']);


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
  // Labels go lower-case mid-sentence. German keeps nouns capitalised ("Blaue Flagge",
  // "Sandstrand") and lower-cases only the labels that start with an adjective.
  const lower = (key: string, s: string) =>
    locale !== 'de' ? s.toLocaleLowerCase(locale) : DE_ADJECTIVE_LABELS.has(key) ? s.charAt(0).toLocaleLowerCase('de') + s.slice(1) : s;
  const featureLabels = documentedFeatures(slug, features(beach)).filter((f) => labels.has(f)).map((f) => lower(f, labels(f)));
  const inPlaceText = village ? inPlace(village.item.slug, locale) : place;
  // Up to four features, fewer when a long beach or village name would push the
  // description past Google's snippet length (it would be cut mid-word).
  let generatedDesc = '';
  for (let n = Math.min(4, featureLabels.length); n >= 1; n--) {
    generatedDesc = t('metaDesc', { name, inPlace: inPlaceText, features: formatList(featureLabels.slice(0, n), locale) });
    if (generatedDesc.length <= DESC_MAX) break;
  }
  // No documented features, or none fit: the same sentence without the feature list.
  if (!generatedDesc || generatedDesc.length > DESC_MAX) generatedDesc = t('metaDescPlain', { name, inPlace: inPlaceText });

  return buildMetadata({
    locale,
    path: `/beaches/${slug}`,
    // Keep hand-written titles that already rank; generate the rest.
    title: metaTitle.native && storedMetaOk(metaTitle.text, locale, beach.area) ? metaTitle.text : t('metaTitle', { name, place }),
    description: metaDesc.native && storedMetaOk(metaDesc.text, locale, beach.area)
      ? metaDesc.text
      : generatedDesc,
    image: beach.image_url,
    imageAlt: greekAlt(beach.image_alt, locale) ?? name,
    indexableLocales: (await beachIndex())[slug] ?? [],
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

  // Shore, depth and Blue Flag come only from official sources
  // (src/content/beach-facts.ts): checked against them, the sandy/pebble and
  // shallowWater tags were wrong for several beaches (2026-11 audit).
  const profile = BEACH_PROFILES[slug];
  const blueFlag = BLUE_FLAG_2026.has(slug);
  const shore = profile?.coast ? t(profile.coast === 'sand-fine' ? 'shoreSandFine' : profile.coast === 'sand-coarse' ? 'shoreSandCoarse' : 'shoreSand') : null;
  const depth = profile?.depth5m ? formatMetres(profile.depth5m, locale) : null;
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
      }),
    });
  }
  if (shore) faqs.push({ q: t('faqShoreQ'), a: t('faqShoreOfficialA', { shore }) });
  if (profile?.shallow !== undefined) {
    const key = profile.shallow ? 'faqShallowYesA' : 'faqShallowNoA';
    faqs.push({ q: t('faqShallowQ'), a: depth ? `${t(key)} ${t('faqDepthA', { m: depth })}` : t(key) });
  }
  if (organized) faqs.push({ q: t('faqSunbedsQ'), a: t('faqSunbedsA') });
  if (f.includes('parking')) faqs.push({ q: t('faqParkingQ'), a: t('faqParkingA') });
  if (f.includes('nudist')) faqs.push({ q: t('faqNudistQ'), a: t('faqNudistA') });
  if (blueFlag) faqs.push({ q: t('faqBlueFlagQ'), a: t('faqBlueFlagOfficialA', { year: BLUE_FLAG_YEAR }) });
  if (LIFEGUARD_REQUIRED.has(slug)) faqs.push({ q: t('faqLifeguardQ'), a: t('faqLifeguardA', { years: LIFEGUARD_YEARS }) });
  if (SEATRAC_BEACHES[slug]) faqs.push({ q: t('faqAccessibleQ'), a: t('faqSeatracA') });

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
        <QuickActions lat={geo ? beach.latitude : null} lng={geo ? beach.longitude : null} directionsLabel={common('directions')} shareTitle={name} label={shell('quickActions')}>
          {geo && (
            // Same-size placeholder: the figure streams in a moment later and must not push the photo down.
            <Suspense fallback={<span className="inline-block h-9 w-48 rounded-full bg-sea-50" aria-hidden />}>
              <SeaTemperature chip locale={locale} lat={beach.latitude!} lng={beach.longitude!} />
            </Suspense>
          )}
        </QuickActions>
      </PageIntro>
      <HeroImage src={beach.image_url} alt={greekAlt(beach.image_alt, locale) ?? name} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
          <Prose html={await renderLinked(body.text, locale, `/beaches/${slug}`)} />
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
              {
                label: t('blueFlagLabel'),
                value: blueFlag ? (
                  <a href={BLUE_FLAG_SOURCE} target="_blank" rel="noopener" className="text-sea-700 hover:underline">
                    {t('blueFlagValue', { year: BLUE_FLAG_YEAR })}
                  </a>
                ) : null,
              },
              {
                label: t('officialLabel'),
                value: profile ? (
                  <>
                    {[
                      profile.shallow === true && t('factShallow'),
                      profile.shallow === false && t('factNormalDepth'),
                      depth && t('factDepth5m', { m: depth }),
                      profile.lengthM && t('factLength', { m: formatMetres(profile.lengthM, locale) }),
                    ].filter(Boolean).join(' · ')}
                    {' '}
                    <a href={PROFILE_SOURCE(profile.profile)} target="_blank" rel="noopener" className="whitespace-nowrap text-sea-700 hover:underline">
                      {t('officialProfile')}
                    </a>
                  </>
                ) : null,
              },
              {
                label: t('lifeguardLabel'),
                value: LIFEGUARD_REQUIRED.has(slug) ? (
                  <a href={LIFEGUARD_SOURCE} target="_blank" rel="noopener" className="text-sea-700 hover:underline">
                    {t('lifeguardValue')}
                  </a>
                ) : null,
              },
              {
                label: t('seatracLabel'),
                value: SEATRAC_BEACHES[slug] ? (
                  <a href={SEATRAC_SOURCE(SEATRAC_BEACHES[slug])} target="_blank" rel="noopener" className="text-sea-700 hover:underline">
                    {t('seatracValue')}
                  </a>
                ) : null,
              },
              { label: t('access'), value: access },
              {
                label: t('features'),
                // Shore, depth and Blue Flag are shown from official sources above, never from tags.
                value: f.filter((x) => labels.has(x) && !OFFICIAL_ONLY.includes(x) && !['free', 'organized'].includes(x)).map((x) => labels(x)).join(' · ') || null,
              },
            ]}
          />
          {/* v3: live crowd estimate and weather. */}
          <ClientIntl namespaces={['crowd']}>
            <CrowdIndicator beachSlug={slug} />
          </ClientIntl>
          {geo && (
            <Suspense fallback={null}>
              <SeaTemperature locale={locale} lat={beach.latitude!} lng={beach.longitude!} />
            </Suspense>
          )}
          {geo && <MapEmbed lat={beach.latitude!} lng={beach.longitude!} title={`${t('map')}: ${name}`} directionsLabel={common('directions')} />}
        </aside>
      </div>

      <Reviews locale={locale} title={t('reviewsHeading')} empty={t('noReviews')} reviews={reviews} rating={rating} />
      <div className="max-w-2xl">
        <ReviewForm type="beach" itemId={String(beach.id)} itemName={name} />
      </div>
      <div className="mt-8">
        <ShareButtons title={name} />
      </div>
      <RecentlyViewed type="beach" slug={slug} title={name} image={beach.image_url as string | null} />
      <Faq title={common('faqTitle')} items={faqs} />

      {otherBeaches.length > 0 && (
        <Section id="nearby-beaches" title={t('nearbyBeaches')}>
          <CardGrid cols={3}>
            {otherBeaches.map(({ item, km }) => (
              <Card key={item.slug} href={`/beaches/${item.slug}`}
                favorite={{ type: 'beach', slug: item.slug }} title={displayName(item, locale, 'beach')} image={item.image_url} imageAlt={greekAlt(item.image_alt, locale)} distance={formatDistance(km, locale)} {...ratingProps(item, 'beach')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {food.length > 0 && (
        <Section id="nearby-food" title={t('nearbyFood')}>
          <CardGrid>
            {food.map(({ item, km }) => (
              <Card key={item.slug} href={`/restaurants/${item.slug}`}
                favorite={{ type: 'restaurant', slug: item.slug }} title={displayName(item, locale, 'restaurant')} image={item.image_url} imageAlt={greekAlt(item.image_alt, locale)} distance={formatDistance(km, locale)} {...ratingProps(item, 'restaurant')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {stays.length > 0 && (
        <Section id="nearby-stays" title={t('nearbyStays')}>
          <CardGrid>
            {stays.map(({ item, km }) => (
              <Card key={item.slug} href={`/listings/${item.slug}`}
                favorite={{ type: 'listing', slug: item.slug }} title={displayName(item, locale, 'listing')} image={item.cover_url} distance={formatDistance(km, locale)} {...ratingProps(item, 'listing')} />
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
          // No aggregateRating: Google accepts review snippets only on types such as LocalBusiness,
          // Product or Event; on Beach/TouristAttraction Search Console flags it as an invalid
          // <parent_node>. The rating is still shown on the page.
          amenityFeature: documentedFeatures(slug, f)
            .filter((x) => labels.has(x))
            .map((x) => ({ '@type': 'LocationFeatureSpecification', name: labels(x), value: true })),
        }}
      />
    </Container>
  );
}
