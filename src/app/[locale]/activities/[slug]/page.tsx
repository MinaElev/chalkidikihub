import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getActivities, getActivity, type ActivityCard } from '@/lib/db/content';
import { hasCoords } from '@/lib/geo';
import { localize } from '@/lib/i18n/localize';
import { closestVillage, displayName, nearActivities, nearBeaches, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, inPlace, placeName } from '@/lib/content/place-names';
import { formatDistance, greekAlt } from '@/lib/content/format';
import { localizeToken } from '@/lib/content/hours';
import { plainText, renderRichText } from '@/lib/content/render';
import { genuineReviews, ratingOf, type ReviewRow } from '@/lib/content/reviews';
import { buildMetadata } from '@/lib/seo/metadata';
import { activityIndex } from '@/lib/seo/indexability';
import { addressLd, geoLd, type Faq as FaqItem } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { Container, FactList, HeroImage, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { Reviews } from '@/components/ui/Reviews';
import { ReviewForm } from '@/components/v3/ReviewForm';
import { ShareButtons } from '@/components/v3/ShareButtons';
import { RecentlyViewed } from '@/components/v3/RecentlyViewed';
import { renderLinked } from '@/lib/content/autolink';
import { detailParams } from '@/lib/build-params';

export const revalidate = 86400;

export async function generateStaticParams() {
  return detailParams(async () => (await getActivities()).map((a) => ({ slug: a.slug })));
}

type Row = ActivityCard & Record<string, unknown> & { activity_reviews?: ReviewRow[] };

async function load(slug: string) {
  const a = (await getActivity(slug)) as Row | null;
  if (!a) return null;
  const village = hasCoords(a) ? await closestVillage(a, 12) : null;
  const reviews = genuineReviews(a.activity_reviews);
  return { a, village, reviews, rating: ratingOf(reviews) };
}

export async function generateMetadata({ params }: PageProps<'/[locale]/activities/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await load(slug);
  if (!data) return {};
  const { a, village } = data;
  const [t, cats] = await Promise.all([
    getTranslations({ locale, namespace: 'activity' }),
    getTranslations({ locale, namespace: 'activityCategories' }),
  ]);
  const name = displayName(a, locale, 'activity');
  const place = village ? placeName(village.item.slug, locale, village.item) : AREA_NAMES[a.area][locale];
  const metaTitle = localize(a, 'meta_title', locale);
  const metaDesc = localize(a, 'meta_description', locale);
  const category = a.category && cats.has(a.category) ? cats(a.category).toLocaleLowerCase() : '';
  return buildMetadata({
    locale,
    path: `/activities/${slug}`,
    title: metaTitle.native ? metaTitle.text : t('metaTitle', { name, place }),
    description: metaDesc.native
      ? metaDesc.text
      : t('metaDesc', { name, inPlace: village ? inPlace(village.item.slug, locale) : place, category }),
    image: a.image_url,
    indexableLocales: (await activityIndex())[slug] ?? [],
  });
}

export default async function ActivityPage({ params }: PageProps<'/[locale]/activities/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { a, village, reviews, rating } = data;

  const [t, shell, common, cats] = await Promise.all([
    getTranslations({ locale, namespace: 'activity' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'activityCategories' }),
  ]);
  const name = displayName(a, locale, 'activity');
  const body = localize(a, 'description', locale);
  const geo = hasCoords(a);
  const villageName = village ? placeName(village.item.slug, locale, village.item) : null;
  const duration = localizeToken(a.duration, locale);
  const price = localizeToken(a.price_range, locale);
  const category = a.category && cats.has(a.category) ? cats(a.category) : null;

  const [others, beaches] = geo ? await Promise.all([nearActivities(a, 5), nearBeaches(a, 4)]) : [[], []];
  const otherActivities = others.filter((o) => o.item.slug !== slug).slice(0, 4);

  const faqs: FaqItem[] = [];
  if (duration) faqs.push({ q: t('faqDurationQ'), a: t('faqDurationA', { duration }) });
  if (price) faqs.push({ q: t('faqPriceQ'), a: t('faqPriceA', { price }) });

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('activities'), path: '/activities' },
              { name, path: `/activities/${slug}` },
            ]}
          />
        }
        title={name}
      >
        <p className="mt-2 text-slate-600">
          {[category, villageName ? `${villageName}, ${AREA_NAMES[a.area][locale]}` : AREA_NAMES[a.area][locale]].filter(Boolean).join(' · ')}
        </p>
      </PageIntro>
      <HeroImage src={a.image_url} alt={greekAlt(a.image_alt, locale) ?? name} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
          <Prose html={await renderLinked(body.text, locale, `/activities/${slug}`)} />
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <FactList
            items={[
              { label: t('category'), value: category },
              { label: t('duration'), value: duration || null },
              { label: t('price'), value: price || null },
              {
                label: t('location'),
                value: village ? (
                  <Link href={`/places/${village.item.slug}`} className="text-sea-700 hover:underline">
                    {villageName} · {formatDistance(village.km, locale)}
                  </Link>
                ) : null,
              },
            ]}
          />
          {geo && <MapEmbed lat={a.latitude!} lng={a.longitude!} title={name} directionsLabel={common('directions')} />}
        </aside>
      </div>

      {reviews.length > 0 && (
        <Reviews locale={locale} title={common('reviews', { count: rating.count })} empty="" reviews={reviews} rating={rating} />
      )}
      <div className="max-w-2xl">
        <ReviewForm type="activity" itemId={String(a.id)} itemName={name} />
      </div>
      <div className="mt-8">
        <ShareButtons title={name} />
      </div>
      <RecentlyViewed type="activity" slug={slug} title={name} image={a.image_url as string | null} />
      <Faq title={common('faqTitle')} items={faqs} />

      {otherActivities.length > 0 && (
        <Section id="nearby-activities" title={t('nearbyActivities')}>
          <CardGrid>
            {otherActivities.map(({ item, km }) => (
              <Card key={item.slug} href={`/activities/${item.slug}`}
                favorite={{ type: 'activity', slug: item.slug }} title={displayName(item, locale, 'activity')} image={item.image_url} imageAlt={greekAlt(item.image_alt, locale)} distance={formatDistance(km, locale)} {...ratingProps(item, 'activity')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {beaches.length > 0 && (
        <Section id="nearby-beaches" title={t('nearbyBeaches')}>
          <CardGrid>
            {beaches.map(({ item, km }) => (
              <Card key={item.slug} href={`/beaches/${item.slug}`}
                favorite={{ type: 'beach', slug: item.slug }} title={displayName(item, locale, 'beach')} image={item.image_url} imageAlt={greekAlt(item.image_alt, locale)} distance={formatDistance(km, locale)} {...ratingProps(item, 'beach')} />
            ))}
          </CardGrid>
        </Section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TouristAttraction',
          name,
          description: plainText(body.text, 300),
          image: a.image_url ?? undefined,
          address: addressLd(villageName),
          geo: geoLd(a),
          isAccessibleForFree: /free/i.test(a.price_range ?? '') || undefined,
          // No aggregateRating: Google accepts review snippets only on types such as LocalBusiness,
          // Product or Event; on Beach/TouristAttraction Search Console flags it as an invalid
          // <parent_node>. The rating is still shown on the page.
        }}
      />
    </Container>
  );
}
