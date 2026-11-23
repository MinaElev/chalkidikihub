import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Phone, Star } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getRestaurant, getRestaurants, type RestaurantCard } from '@/lib/db/content';
import { hasCoords } from '@/lib/geo';
import { localize } from '@/lib/i18n/localize';
import { closestVillage, displayName, nearBeaches, nearRestaurants, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, inPlace, placeName } from '@/lib/content/place-names';
import { formatDistance, formatList, greekAlt } from '@/lib/content/format';
import { parseHours, hoursSummary } from '@/lib/content/hours';
import { plainText } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { restaurantIndex } from '@/lib/seo/indexability';
import { addressLd, geoLd, type Faq as FaqItem } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { SeeAlso } from '@/components/ui/SeeAlso';
import { bestListsFor } from '@/lib/content/best';
import { Container, FactList, HeroImage, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { ReviewForm } from '@/components/v3/ReviewForm';
import { ShareButtons } from '@/components/v3/ShareButtons';
import { RecentlyViewed } from '@/components/v3/RecentlyViewed';
import { renderLinked } from '@/lib/content/autolink';
import { BLUE_FLAG_2026, BLUE_FLAG_YEAR } from '@/content/beach-facts';
import { MUNICIPALITY_NAMES, VILLAGE_FACTS } from '@/content/village-facts';
import { COORDS_IN_DOUBT } from '@/content/restaurant-checks';
import { isNearestBeach } from '@/lib/content/beach-coverage';
import { detailParams } from '@/lib/build-params';

export const revalidate = 86400;

export async function generateStaticParams() {
  return detailParams(async () => (await getRestaurants()).map((r) => ({ slug: r.slug })));
}

type Row = RestaurantCard & Record<string, unknown>;

async function load(slug: string) {
  const r = (await getRestaurant(slug)) as Row | null;
  if (!r) return null;
  const village = hasCoords(r) ? await closestVillage(r, 10) : null;
  return { r, village };
}

const PRICE_SYMBOL: Record<string, string> = { budget: '€', moderate: '€€', upscale: '€€€', fineDining: '€€€€' };

export async function generateMetadata({ params }: PageProps<'/[locale]/restaurants/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await load(slug);
  if (!data) return {};
  const { r, village } = data;
  const [t, cuisines] = await Promise.all([
    getTranslations({ locale, namespace: 'food' }),
    getTranslations({ locale, namespace: 'cuisineTypes' }),
  ]);
  const name = displayName(r, locale, 'restaurant');
  const place = village ? placeName(village.item.slug, locale, village.item) : AREA_NAMES[r.area][locale];
  const cuisine = formatList((r.cuisine ?? []).filter((c) => cuisines.has(c)).slice(0, 3).map((c) => cuisines(c).toLocaleLowerCase()), locale);
  return buildMetadata({
    locale,
    path: `/restaurants/${slug}`,
    // Always generated: stored meta titles carry v3's translated brand names
    // ("The Cricket" for Τζίτζικας). People search these places by name.
    title: t('metaTitle', { name, place }),
    description: t('metaDesc', { name, inPlace: village ? inPlace(village.item.slug, locale) : place, cuisine }),
    image: r.image_url,
    indexableLocales: (await restaurantIndex())[slug] ?? [],
  });
}

export default async function RestaurantPage({ params }: PageProps<'/[locale]/restaurants/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { r, village } = data;

  const [t, shell, common, cuisines] = await Promise.all([
    getTranslations({ locale, namespace: 'food' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'cuisineTypes' }),
  ]);
  const name = displayName(r, locale, 'restaurant');
  const body = localize(r, 'description', locale);
  const hours = parseHours(r.hours as string, locale);
  const phone = ((r.phone as string) || '').trim();
  const cuisineLabels = (r.cuisine ?? []).filter((c) => cuisines.has(c)).map((c) => cuisines(c));
  const geo = hasCoords(r);
  const villageName = village ? placeName(village.item.slug, locale, village.item) : null;

  const [beaches, food] = geo ? await Promise.all([nearBeaches(r, 4), nearRestaurants(r, 5)]) : [[], []];
  const otherFood = food.filter((f) => f.item.slug !== slug).slice(0, 4);

  // Location facts from our own verified data: coordinates, ELSTAT municipality,
  // EEPF Blue Flag list. Distances are straight-line, and the text says so.
  const nearestBeach = !COORDS_IN_DOUBT.has(slug) && beaches[0] && isNearestBeach(r, beaches[0].km) ? beaches[0] : undefined;
  const facts = village ? VILLAGE_FACTS[village.item.slug] : undefined;
  const beachArgs = nearestBeach
    ? {
        beach: displayName(nearestBeach.item, locale, 'beach'),
        beachKm: formatDistance(nearestBeach.km, locale),
        flag: BLUE_FLAG_2026.has(nearestBeach.item.slug) ? 'yes' : 'no',
        year: BLUE_FLAG_YEAR,
      }
    : null;
  const locationText = village && !COORDS_IN_DOUBT.has(slug)
    ? [
        t('locationFacts', {
          name,
          village: villageName!,
          villageKm: formatDistance(village.km, locale),
          municipality: facts ? MUNICIPALITY_NAMES[facts.municipality][locale] : 'none',
        }),
        beachArgs ? t('locationBeach', beachArgs) : '',
      ].filter(Boolean).join(' ')
    : null;

  const faqs: FaqItem[] = [];
  if (hours.length) faqs.push({ q: t('faqHoursQ'), a: t('faqHoursA', { hours: hoursSummary(r.hours as string, locale) }) });
  if (r.accepts_reservations) faqs.push({ q: t('faqReservationsQ'), a: `${t('faqReservationsA')}${phone ? ` ${t('faqPhoneA', { phone })}` : ''}` });
  if (r.has_sea_view) faqs.push({ q: t('faqSeaViewQ'), a: t('faqSeaViewA') });
  if (r.price_level && t.has(`faqPrice_${r.price_level}`)) faqs.push({ q: t('faqPriceQ'), a: t(`faqPrice_${r.price_level}`) });

  if (beachArgs) faqs.push({ q: t('faqNearestBeachQ', { name }), a: t('faqNearestBeachA', beachArgs) });

  const rating = ratingProps(r, 'restaurant');

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('food'), path: '/restaurants' },
              ...(village ? [{ name: villageName!, path: `/places/${village.item.slug}/restaurants` }] : []),
              { name, path: `/restaurants/${slug}` },
            ]}
          />
        }
        title={name}
      >
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600">
          <span>{villageName ? `${villageName}, ${AREA_NAMES[r.area][locale]}` : AREA_NAMES[r.area][locale]}</span>
          {cuisineLabels.length > 0 && <span>· {cuisineLabels.slice(0, 3).join(', ')}</span>}
          {r.price_level && <span>· {PRICE_SYMBOL[r.price_level] ?? ''}</span>}
          {rating.rating && (
            <span className="inline-flex items-center gap-1">
              · <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden /> {rating.rating.toFixed(1)}
              <span className="text-sm">({rating.reviews} · {t('googleRating')})</span>
            </span>
          )}
        </p>
      </PageIntro>
      <HeroImage src={r.image_url} alt={greekAlt(r.image_alt, locale) ?? name} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
          <Prose html={await renderLinked(body.text, locale, `/restaurants/${slug}`)} />
          {locationText && <p className="mt-6 max-w-3xl leading-relaxed text-slate-700">{locationText}</p>}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <FactList
            items={[
              { label: t('cuisine'), value: cuisineLabels.join(', ') || null },
              { label: t('price'), value: r.price_level ? PRICE_SYMBOL[r.price_level] : null },
              { label: t('reservations'), value: r.accepts_reservations ? t('yes') : null },
              { label: t('seaView'), value: r.has_sea_view ? t('yes') : null },
              { label: t('liveMusic'), value: r.has_live_music ? t('yes') : null },
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
          {hours.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm">
              <p className="font-semibold text-slate-900">{t('hours')}</p>
              <dl className="mt-2 space-y-1">
                {hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4">
                    <dt className="text-slate-500">{h.days}</dt>
                    <dd className="font-medium text-slate-800">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {phone && (
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center justify-center gap-2 rounded-xl border border-sea-200 bg-white px-4 py-3 font-semibold text-sea-800 hover:bg-sea-50">
              <Phone className="size-4" aria-hidden /> {phone}
            </a>
          )}
          {geo && <MapEmbed lat={r.latitude!} lng={r.longitude!} title={name} directionsLabel={common('directions')} />}
          {rating.rating && <p className="text-xs text-slate-500">{t('googleNote')}</p>}
        </aside>
      </div>
      <div className="max-w-2xl">
        <ReviewForm type="restaurant" itemId={String(r.id)} itemName={name} />
      </div>
      <div className="mt-8">
        <ShareButtons title={name} />
      </div>
      <RecentlyViewed type="restaurant" slug={slug} title={name} image={r.image_url as string | null} />

      <SeeAlso title={common('seeAlso')} links={(await bestListsFor('restaurant', r as Record<string, unknown>, locale)).map((b) => ({ href: `/best/${b.slug}`, label: b.title }))} />
      <Faq title={common('faqTitle')} items={faqs} />

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
      {otherFood.length > 0 && (
        <Section id="nearby-food" title={t('nearbyFood')}>
          <CardGrid>
            {otherFood.map(({ item, km }) => (
              <Card key={item.slug} href={`/restaurants/${item.slug}`}
                favorite={{ type: 'restaurant', slug: item.slug }} title={displayName(item, locale, 'restaurant')} image={item.image_url} imageAlt={greekAlt(item.image_alt, locale)} distance={formatDistance(km, locale)} {...ratingProps(item, 'restaurant')} />
            ))}
          </CardGrid>
        </Section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Restaurant',
          name,
          description: plainText(body.text, 300),
          image: r.image_url ?? undefined,
          servesCuisine: cuisineLabels.length ? cuisineLabels : undefined,
          priceRange: r.price_level ? PRICE_SYMBOL[r.price_level] : undefined,
          telephone: phone || undefined,
          acceptsReservations: r.accepts_reservations ? true : undefined,
          address: addressLd(villageName),
          geo: geoLd(r),
          // No aggregateRating: the figures are Google's, not first-party.
        }}
      />
    </Container>
  );
}
