import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { locales, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { AREA_SLUGS, getActivities, getAreas, getBeaches, getListings, getRestaurants, getVillages, type Area } from '@/lib/db/content';
import { nearest } from '@/lib/geo';
import { localize } from '@/lib/i18n/localize';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_LOCATIVE, AREA_NAMES, HALKIDIKI, placeName, villagesInArea } from '@/lib/content/place-names';
import { formatPrice, greekAlt } from '@/lib/content/format';
import { withHeadingIds, plainText } from '@/lib/content/render';
import { assessQuality } from '@/lib/seo/quality';
import { buildMetadata } from '@/lib/seo/metadata';
import { AREA_GET_TO_KNOW, BEACH_AREA_INTRO, RESTAURANT_AREA_INTRO } from '@/content/area-content';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Container, Prose, Section } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { AreaMiniMap } from '@/components/v3/AreaMiniMap';
import { AreaTabs } from '@/components/v3/AreaTabs';
import { renderLinked } from '@/lib/content/autolink';

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
      return assessQuality({ body: b.text, nativeBody: b.native, hasImage: true, locale: l }, 'detail').indexable;
    }),
  });
}

/** Opening paragraph(s) of the area text, shown in the overview; the rest goes to the guide section further down. */
function splitLead(html: string): { lead: string; rest: string } {
  const h2 = html.indexOf('<h2');
  const head = h2 === -1 ? html : html.slice(0, h2);
  const firstP = head.match(/<p[\s>][\s\S]*?<\/p>/);
  if (!firstP) return { lead: '', rest: html };
  return { lead: firstP[0], rest: html.replace(firstP[0], '') };
}

/** Wide card for the food / things-to-do columns: photo left, text right. */
function WideCard({ href, title, image, imageAlt, eyebrow, rating, reviews }: {
  href: string; title: string; image?: string | null; imageAlt?: string | null; eyebrow?: string; rating?: number | null; reviews?: number | null;
}) {
  return (
    <article className="group relative flex items-stretch gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-900/10">
      <div className="relative aspect-[4/3] w-36 shrink-0 overflow-hidden rounded-xl bg-sand-100 sm:w-48">
        {image
          ? <Image src={image} alt={imageAlt || title} fill sizes="12rem" className="object-cover transition duration-500 group-hover:scale-105" />
          : <div className="absolute inset-0 bg-gradient-to-br from-sea-100 to-sand-100" aria-hidden />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-1 pr-2">
        <h3 className="text-base font-bold leading-snug text-gray-900 sm:text-lg">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none group-hover:text-sea-700">{title}</Link>
        </h3>
        {eyebrow && (
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{eyebrow}</span>
          </p>
        )}
        {rating != null && rating > 0 && (
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
            <Star className="size-4 fill-accent-400 text-accent-400" aria-hidden />
            {rating.toFixed(1)}
            {reviews ? <span className="font-normal text-slate-500">({reviews})</span> : null}
          </p>
        )}
        <ArrowRight className="mt-1 size-5 text-sea-700 transition group-hover:translate-x-1" aria-hidden />
      </div>
    </article>
  );
}

/** Photo with the name under it, as in the village and beach rows. */
function PlaceTile({ href, title, image, imageAlt, eyebrow, big = false, className = '' }: {
  href: string; title: string; image?: string | null; imageAlt?: string | null; eyebrow?: string; big?: boolean; className?: string;
}) {
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-900/10 ${className}`}>
      <div className={`relative overflow-hidden bg-sand-100 ${big ? 'aspect-[4/3] lg:aspect-auto lg:flex-1' : 'aspect-[4/3]'}`}>
        {image ? (
          <Image src={image} alt={imageAlt || title} fill sizes={big ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'} className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sea-100 to-sand-100" aria-hidden />
        )}
      </div>
      <div className="px-3 py-2.5 sm:px-4 sm:py-3">
        <h3 className="text-sm font-bold leading-snug text-gray-900 sm:text-base">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none group-hover:text-sea-700">{title}</Link>
        </h3>
        {eyebrow && <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">{eyebrow}</p>}
      </div>
    </article>
  );
}

export default async function AreaPage({ params }: PageProps<'/[locale]/areas/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { row, area } = data;

  const [shell, common, food, stay, activity, beach, places, page, beaches, villages, restaurants, listings, activities] = await Promise.all([
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'food' }),
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'activity' }),
    getTranslations({ locale, namespace: 'beach' }),
    getTranslations({ locale, namespace: 'places' }),
    getTranslations({ locale, namespace: 'areaPage' }),
    getBeaches(),
    getVillages(),
    getRestaurants(),
    getListings(),
    getActivities(),
  ]);

  const name = AREA_NAMES[area][locale];
  const where = AREA_LOCATIVE[area][locale];
  const body = localize(row, 'description', locale);
  const { html, toc } = withHeadingIds(await renderLinked(body.text, locale, `/areas/${slug}`));
  const { lead, rest } = splitLead(html);
  const inArea = <T extends { area: string }>(list: T[]) => list.filter((x) => x.area === area);
  const topBeaches = inArea(beaches).sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0) || Number(Boolean(b.image_url)) - Number(Boolean(a.image_url))).slice(0, 5);
  const topFood = inArea(restaurants).sort((a, b) => (b.rating ?? 0) * Math.log10(10 + (b.reviews_count ?? 0)) - (a.rating ?? 0) * Math.log10(10 + (a.reviews_count ?? 0))).slice(0, 3);
  const stays = inArea(listings).filter((l) => !l.is_closed).slice(0, 6);
  const todo = inArea(activities).slice(0, 3);
  const areaVillages = inArea(villages)
    .filter((v) => v.slug !== 'pyrgadikia-mainland')
    .map((v) => ({ v, beaches: nearest(v, beaches, 99, 10).length }))
    .sort((a, b) => b.beaches - a.beaches);
  // Four villages with a photo get a tile; every village stays linked in the chips under them.
  const villageTiles = areaVillages.filter(({ v }) => v.image_url).slice(0, 4);
  const tiled = new Set(villageTiles.map(({ v }) => v.slug));
  const otherVillages = areaVillages.filter(({ v }) => !tiled.has(v.slug));
  const [beachV, foodV, stayV, todoV] = await Promise.all([
    closestVillagesFor(topBeaches, locale),
    closestVillagesFor(topFood, locale, 10),
    closestVillagesFor(stays, locale, 6),
    closestVillagesFor(todo, locale, 10),
  ]);
  const more = (href: string, label = common('viewAll')) => (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-sea-700 underline-offset-4 hover:underline">
      {label} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
  const heroImage = (row.image_url as string) || topBeaches[0]?.image_url;
  const tabs = [
    { id: 'overview', label: page('overview') },
    areaVillages.length > 0 && { id: 'villages', label: shell('places') },
    topBeaches.length > 0 && { id: 'beaches', label: shell('beaches') },
    stays.length > 0 && { id: 'stay', label: shell('stay') },
    topFood.length > 0 && { id: 'food', label: shell('food') },
    todo.length > 0 && { id: 'activities', label: shell('activities') },
  ].filter((t): t is { id: string; label: string } => Boolean(t));
  // Section puts the id on its h2, so that is what an anchor scrolls to: keep it clear of the sticky header and tabs.
  const section = 'scroll-mt-32 [&_h2]:scroll-mt-32';

  return (
    <Container>
      <div className="pt-5">
        <Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('areas'), path: '/areas' }, { name, path: `/areas/${slug}` }]} />
      </div>

      {/* Hero: the photo carries the title, lead and the two main ways in. */}
      <header className="relative mt-4 isolate flex min-h-[18rem] items-end overflow-hidden rounded-3xl bg-sea-900 sm:min-h-[22rem] lg:min-h-[24rem]">
        {heroImage && <Image src={heroImage} alt={name} fill priority fetchPriority="high" sizes="(min-width: 1280px) 1232px, 100vw" className="-z-10 object-cover" />}
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/30 to-black/0" aria-hidden />
        <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 to-black/0 sm:hidden" aria-hidden />
        <div className="max-w-2xl p-6 text-white sm:p-10">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight drop-shadow sm:text-5xl">{`${name}, ${HALKIDIKI[locale]}`}</h1>
          <p className="mt-3 text-base text-white/90 drop-shadow sm:text-lg">{page('heroLead', { area: where })}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {topBeaches.length > 0 && (
              <a href="#beaches" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-sea-800 shadow-md transition hover:bg-sea-50">
                {page('seeBeaches')}
              </a>
            )}
            {stays.length > 0 && (
              <Link href={`/listings?area=${area}`} className="text-sm font-bold text-white underline decoration-2 underline-offset-4 hover:decoration-accent-400">
                {page('seeStays')}
              </Link>
            )}
          </div>
        </div>
      </header>

      <AreaTabs items={tabs} label={page('sections')} />

      {/* Overview: opening paragraph and the guide's chapters on the left, the peninsula on a small map on the right. */}
      <section id="overview" aria-labelledby="overview-title" className={`mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12 ${section}`}>
        <div className="lg:border-r lg:border-gray-200 lg:pr-12">
          <h2 id="overview-title" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{AREA_GET_TO_KNOW[area][locale]}</h2>
          {!body.native && body.from && <div className="mt-4"><LocaleNotice locale={locale} from={body.from} /></div>}
          {lead && <Prose html={lead} className="mt-4" />}
          {toc.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {toc.slice(0, 4).map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-sea-700 underline underline-offset-4 hover:text-sea-900">
                    {h.text} <ArrowRight className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative isolate aspect-[16/9] overflow-hidden rounded-2xl bg-sky-100 lg:aspect-auto lg:min-h-[13rem]">
          <AreaMiniMap
            area={area}
            label={name}
            villages={areaVillages.filter(({ v }) => v.latitude != null && v.longitude != null).map(({ v }) => ({ lat: v.latitude!, lon: v.longitude! }))}
          />
          <Link href="/map" className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-sea-800 px-4 py-2.5 text-sm font-bold text-white shadow-lg ring-2 ring-white/70 transition hover:bg-sea-900">
            <MapPin className="size-4" aria-hidden />
            {page('openMap')}
          </Link>
        </div>
      </section>

      {areaVillages.length > 0 && (
        <Section id="villages" className={section} title={places('villagesIn', { area: villagesInArea(area, locale) })} action={more('/places')}>
          {villageTiles.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {villageTiles.map(({ v, beaches: n }) => (
                <PlaceTile key={v.slug} href={`/places/${v.slug}`} title={placeName(v.slug, locale, v)} image={v.image_url} imageAlt={greekAlt(v.image_alt, locale)} eyebrow={n > 0 ? places('beachesWithin10', { count: n }) : undefined} />
              ))}
            </div>
          )}
          {otherVillages.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {otherVillages.map(({ v }) => (
                <li key={v.slug}>
                  <Link href={`/places/${v.slug}`} className="inline-flex rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-sea-100">
                    {placeName(v.slug, locale, v)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {topBeaches.length > 0 && (
        <Section id="beaches" className={section} title={beach('inArea', { area: where })} intro={BEACH_AREA_INTRO[area]?.[locale]} action={more('/beaches')}>
          {/* The best-known beach gets the big tile, two rows tall on desktop. */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {topBeaches.map((b, i) => (
              <PlaceTile
                key={b.slug}
                big={i === 0}
                className={i === 0 ? 'col-span-2 lg:row-span-2' : ''}
                href={`/beaches/${b.slug}`}
                title={displayName(b, locale, 'beach')}
                eyebrow={beachV.get(b.slug)}
                image={b.image_url}
                imageAlt={greekAlt(b.image_alt, locale)}
              />
            ))}
          </div>
        </Section>
      )}

      {stays.length > 0 && (
        <Section id="stay" className={section} title={stay('inArea', { area: where })} intro={places('staysIntro')} action={more(`/listings?area=${area}`)}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((l) => (
              <Card
                key={l.slug}
                href={`/listings/${l.slug}`}
                favorite={{ type: 'listing', slug: l.slug }}
                title={displayName(l, locale, 'listing')}
                eyebrow={stayV.get(l.slug)}
                image={l.cover_url}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                highlight={l.featured ? stay('featured') : undefined}
                price={l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${common('perNight')}` : undefined}
                {...ratingProps(l, 'listing')}
              />
            ))}
          </div>
        </Section>
      )}

      {(topFood.length > 0 || todo.length > 0) && (
        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-10">
          {topFood.length > 0 && (
            <section id="food" aria-labelledby="food-title" className={section}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <h2 id="food-title" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{food('inArea', { area: where })}</h2>
                {more('/restaurants')}
              </div>
              <div className="grid gap-4">
                {topFood.map((r) => (
                  <WideCard key={r.slug} href={`/restaurants/${r.slug}`} title={displayName(r, locale, 'restaurant')} eyebrow={foodV.get(r.slug)} image={r.image_url} imageAlt={greekAlt(r.image_alt, locale)} {...ratingProps(r, 'restaurant')} />
                ))}
              </div>
              {/* Under the cards, so the two columns' cards line up. */}
              {RESTAURANT_AREA_INTRO[area]?.[locale] && <p className="mt-5 text-sm leading-relaxed text-slate-500">{RESTAURANT_AREA_INTRO[area]?.[locale]}</p>}
            </section>
          )}
          {todo.length > 0 && (
            <section id="activities" aria-labelledby="activities-title" className={section}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <h2 id="activities-title" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{activity('inArea', { area: where })}</h2>
                {more('/activities')}
              </div>
              <div className="grid gap-4">
                {todo.map((a) => (
                  <WideCard key={a.slug} href={`/activities/${a.slug}`} title={displayName(a, locale, 'activity')} eyebrow={todoV.get(a.slug)} image={a.image_url} imageAlt={greekAlt(a.image_alt, locale)} {...ratingProps(a, 'activity')} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* The rest of the editorial text: the overview links jump to its chapters. */}
      {rest.trim() && (
        <section id="guide" aria-label={AREA_GET_TO_KNOW[area][locale]} className={`mx-auto mt-16 max-w-3xl ${section}`}>
          <Prose html={rest} className="[&_h2]:scroll-mt-32" />
        </section>
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
