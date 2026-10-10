import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { locales, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { AREA_SLUGS, getActivities, getAreas, getBeaches, getListings, getRestaurants, getVillages, type Area } from '@/lib/db/content';
import { nearest } from '@/lib/geo';
import { localize } from '@/lib/i18n/localize';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_LOCATIVE, AREA_NAMES, HALKIDIKI, placeName, villagesInArea } from '@/lib/content/place-names';
import { formatPrice } from '@/lib/content/format';
import { renderRichText, withHeadingIds, plainText } from '@/lib/content/render';
import { assessQuality } from '@/lib/seo/quality';
import { buildMetadata } from '@/lib/seo/metadata';
import { BEACH_AREA_INTRO, RESTAURANT_AREA_INTRO } from '@/content/area-content';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, HeroImage, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return AREA_SLUGS.map((slug) => ({ slug }));
}

async function load(slug: string) {
  if (!AREA_SLUGS.includes(slug as Area)) return null;
  const row = (await getAreas()).find((a) => a.slug === slug) ?? null;
  return row ? { row, area: slug as Area } : null;
}

export async function generateMetadata({ params }: PageProps<'/[locale]/areas/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await load(slug);
  if (!data) return {};
  const title = localize(data.row, 'meta_title', locale);
  const desc = localize(data.row, 'meta_description', locale);
  const body = localize(data.row, 'description', locale);
  return buildMetadata({
    locale,
    path: `/areas/${slug}`,
    title: title.native ? title.text : `${AREA_NAMES[data.area][locale]}, ${HALKIDIKI[locale]}`,
    description: desc.native ? desc.text : plainText(body.text, 155),
    image: (data.row.image_url as string) || undefined,
    indexableLocales: locales.filter((l) => {
      const b = localize(data.row, 'description', l);
      return assessQuality({ body: b.text, nativeBody: b.native, hasImage: true }, 'detail').indexable;
    }),
  });
}

export default async function AreaPage({ params }: PageProps<'/[locale]/areas/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { row, area } = data;

  const [shell, common, food, stay, activity, beach, places, beaches, villages, restaurants, listings, activities] = await Promise.all([
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'food' }),
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'activity' }),
    getTranslations({ locale, namespace: 'beach' }),
    getTranslations({ locale, namespace: 'places' }),
    getBeaches(),
    getVillages(),
    getRestaurants(),
    getListings(),
    getActivities(),
  ]);

  const name = AREA_NAMES[area][locale];
  const body = localize(row, 'description', locale);
  const { html } = withHeadingIds(renderRichText(body.text, locale));
  const inArea = <T extends { area: string }>(list: T[]) => list.filter((x) => x.area === area);
  const topBeaches = inArea(beaches).sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0) || Number(Boolean(b.image_url)) - Number(Boolean(a.image_url))).slice(0, 8);
  const topFood = inArea(restaurants).sort((a, b) => (b.rating ?? 0) * Math.log10(10 + (b.reviews_count ?? 0)) - (a.rating ?? 0) * Math.log10(10 + (a.reviews_count ?? 0))).slice(0, 8);
  const stays = inArea(listings).filter((l) => !l.is_closed).slice(0, 8);
  const todo = inArea(activities).slice(0, 4);
  const areaVillages = inArea(villages)
    .filter((v) => v.slug !== 'pyrgadikia-mainland')
    .map((v) => ({ v, beaches: nearest(v, beaches, 99, 10).length }))
    .sort((a, b) => b.beaches - a.beaches);
  const [beachV, foodV, stayV] = await Promise.all([
    closestVillagesFor(topBeaches, locale),
    closestVillagesFor(topFood, locale, 10),
    closestVillagesFor(stays, locale, 6),
  ]);
  const more = (href: string) => (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-sea-700 hover:underline">
      {common('viewAll')} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('areas'), path: '/areas' }, { name, path: `/areas/${slug}` }]} />}
        title={`${name}, ${HALKIDIKI[locale]}`}
      />
      <HeroImage src={(row.image_url as string) || topBeaches[0]?.image_url} alt={name} />

      <div className="mx-auto mt-10 max-w-3xl">
        {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
        <Prose html={html} />
      </div>

      <Section id="villages" title={places('villagesIn', { area: villagesInArea(area, locale) })}>
        <ul className="flex flex-wrap gap-2">
          {areaVillages.map(({ v, beaches: n }) => (
            <li key={v.slug}>
              <Link href={`/places/${v.slug}`} className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-sea-100">
                {placeName(v.slug, locale, v)}
                {n > 0 && <span className="text-xs text-slate-500">{places('beachesWithin10', { count: n })}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {topBeaches.length > 0 && (
        <Section id="beaches" title={beach('inArea', { area: AREA_LOCATIVE[area][locale] })} intro={BEACH_AREA_INTRO[area]?.[locale]} action={more('/beaches')}>
          <CardGrid>
            {topBeaches.map((b) => (
              <Card key={b.slug} href={`/beaches/${b.slug}`} title={displayName(b, locale, 'beach')} eyebrow={beachV.get(b.slug)} image={b.image_url} imageAlt={b.image_alt} {...ratingProps(b, 'beach')} />
            ))}
          </CardGrid>
        </Section>
      )}

      {stays.length > 0 && (
        <Section id="stay" title={stay('inArea', { area: AREA_LOCATIVE[area][locale] })} intro={stay('hubLead')} action={more('/listings')}>
          <CardGrid>
            {stays.map((l) => (
              <Card
                key={l.slug}
                href={`/listings/${l.slug}`}
                title={displayName(l, locale, 'listing')}
                eyebrow={stayV.get(l.slug)}
                image={l.cover_url}
                highlight={l.featured ? stay('featured') : undefined}
                meta={l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${common('perNight')}` : undefined}
                {...ratingProps(l, 'listing')}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      {topFood.length > 0 && (
        <Section id="food" title={food('inArea', { area: AREA_LOCATIVE[area][locale] })} intro={RESTAURANT_AREA_INTRO[area]?.[locale]} action={more('/restaurants')}>
          <CardGrid>
            {topFood.map((r) => (
              <Card key={r.slug} href={`/restaurants/${r.slug}`} title={displayName(r, locale, 'restaurant')} eyebrow={foodV.get(r.slug)} image={r.image_url} imageAlt={r.image_alt} {...ratingProps(r, 'restaurant')} />
            ))}
          </CardGrid>
        </Section>
      )}

      {todo.length > 0 && (
        <Section id="activities" title={activity('hubTitle')} action={more('/activities')}>
          <CardGrid>
            {todo.map((a) => (
              <Card key={a.slug} href={`/activities/${a.slug}`} title={displayName(a, locale, 'activity')} image={a.image_url} imageAlt={a.image_alt} {...ratingProps(a, 'activity')} />
            ))}
          </CardGrid>
        </Section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TouristDestination',
          name: `${name}, ${HALKIDIKI[locale]}`,
          description: plainText(body.text, 300),
          image: (row.image_url as string) || undefined,
          containsPlace: areaVillages.slice(0, 20).map(({ v }) => ({ '@type': 'Place', name: placeName(v.slug, locale, v) })),
        }}
      />
    </Container>
  );
}
