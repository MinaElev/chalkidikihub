import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getVillage, getVillages, type VillageCard } from '@/lib/db/content';
import { hasCoords, driveMinutes } from '@/lib/geo';
import {
  nearActivities, nearBeaches, nearRestaurants, nearVillages, displayName, shownRating, type EntityKind,
  NEAR_RADIUS_KM, type Near,
} from '@/lib/content/nearby';
import { inPlace, placeName, HALKIDIKI } from '@/lib/content/place-names';
import { formatDistance, formatList } from '@/lib/content/format';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd, type Faq as FaqItem } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

export type NearbyKind = 'beaches' | 'restaurants' | 'activities';

/** A "near X" page is only worth indexing if it really lists several nearby places. */
const MIN_ITEMS_WITHIN = 3;
const INDEX_RADIUS_KM = 25;

type Item = { slug: string; name: string; km: number; image: string | null; alt: string | null; rating: number | null; reviews: number | null; source: 'google' | 'own' | null; tags: string[]; raw: Record<string, unknown> };

const ENTITY: Record<NearbyKind, EntityKind> = { beaches: 'beach', restaurants: 'restaurant', activities: 'activity' };

async function load(kind: NearbyKind, slug: string, locale: Locale) {
  const village = (await getVillage(slug)) as VillageCard | null;
  if (!village || !hasCoords(village)) return null;

  const rows: Near<Record<string, unknown> & { slug: string }>[] =
    kind === 'beaches' ? await nearBeaches(village)
    : kind === 'restaurants' ? await nearRestaurants(village)
    : await nearActivities(village);

  const labels = await getTranslations({ locale });
  const items: Item[] = rows.map(({ item, km }) => {
    const tags =
      kind === 'beaches'
        ? ((item.features as string[]) ?? []).filter((f) => labels.has(`beachFeatures.${f}`)).map((f) => labels(`beachFeatures.${f}`))
        : kind === 'restaurants'
          ? ((item.cuisine as string[]) ?? []).filter((c) => labels.has(`cuisineTypes.${c}`)).map((c) => labels(`cuisineTypes.${c}`))
          : item.category && labels.has(`activityCategories.${item.category}`) ? [labels(`activityCategories.${item.category}`)] : [];
    return {
      slug: item.slug,
      name: displayName(item, locale, ENTITY[kind]),
      km,
      image: (item.image_url as string) || null,
      alt: (item.image_alt as string) || null,
      ...(({ rating, reviews, source }) => ({ rating, reviews, source }))(shownRating(item, ENTITY[kind])),
      tags,
      raw: item,
    };
  });

  const withinIndexRadius = items.filter((i) => i.km <= INDEX_RADIUS_KM).length;
  return { village, items, indexable: withinIndexRadius >= MIN_ITEMS_WITHIN };
}

export function nearbyStaticParams() {
  return async () => (await getVillages()).filter((v) => v.slug !== 'pyrgadikia-mainland').map((v) => ({ slug: v.slug }));
}

export async function nearbyMetadata(kind: NearbyKind, locale: Locale, slug: string): Promise<Metadata> {
  const data = await load(kind, slug, locale);
  if (!data || !data.items.length) return {};
  const t = await getTranslations({ locale, namespace: 'places' });
  const first = data.items[0];
  const vars = {
    count: data.items.length,
    inPlace: inPlace(slug, locale),
    nearest: first.name,
    km: formatDistance(first.km, locale),
  };
  return buildMetadata({
    locale,
    path: `/places/${slug}/${kind}`,
    title: `${t(`${kind}Title`, vars)}, ${HALKIDIKI[locale]}`,
    description: t(`${kind}MetaDesc`, vars),
    image: first.image,
    indexableLocales: data.indexable ? locales : [],
  });
}

const has = (raw: Record<string, unknown>, f: string) => ((raw.features as string[]) ?? []).includes(f);

async function buildFaqs(kind: NearbyKind, locale: Locale, slug: string, items: Item[]): Promise<FaqItem[]> {
  const t = await getTranslations({ locale, namespace: 'places' });
  const ip = inPlace(slug, locale);
  const near = items.filter((i) => i.km <= NEAR_RADIUS_KM);
  const names = (list: Item[]) =>
    formatList(list.slice(0, 4).map((i) => `${i.name} (${formatDistance(i.km, locale)})`), locale);
  const faqs: FaqItem[] = [];
  const first = items[0];

  if (kind === 'beaches') {
    faqs.push({
      q: t('faqNearestQ', { inPlace: ip }),
      a: t('faqNearestA', { nearest: first.name, km: formatDistance(first.km, locale), minutes: driveMinutes(first.km) }),
    });
    const sandy = near.filter((i) => has(i.raw, 'sandy'));
    if (sandy.length) faqs.push({ q: t('faqSandyQ', { inPlace: ip }), a: t('faqSandyA', { list: names(sandy) }) });
    const organized = near.filter((i) => has(i.raw, 'organized') || has(i.raw, 'sunbeds'));
    if (organized.length) faqs.push({ q: t('faqOrganizedQ', { inPlace: ip }), a: t('faqOrganizedA', { list: names(organized) }) });
    const quiet = near.filter((i) => has(i.raw, 'free') && !has(i.raw, 'organized'));
    if (quiet.length) faqs.push({ q: t('faqQuietQ'), a: t('faqQuietA', { list: names(quiet) }) });
  } else if (kind === 'restaurants') {
    faqs.push({
      q: t('faqRestaurantNearestQ', { inPlace: ip }),
      a: t('faqRestaurantNearestA', { nearest: first.name, km: formatDistance(first.km, locale) }),
    });
    const cuisines = [...new Set(near.flatMap((i) => i.tags))].slice(0, 5);
    if (cuisines.length >= 2) faqs.push({ q: t('faqCuisineQ', { inPlace: ip }), a: t('faqCuisineA', { list: formatList(cuisines.map((c) => c.toLocaleLowerCase()), locale) }) });
    const seafood = near.filter((i) => ((i.raw.cuisine as string[]) ?? []).includes('seafood'));
    if (seafood.length) faqs.push({ q: t('faqSeafoodQ', { inPlace: ip }), a: t('faqSeafoodA', { list: names(seafood) }) });
  } else {
    faqs.push({ q: t('faqActivityNearestQ', { inPlace: ip }), a: t('faqActivityNearestA', { list: names(items) }) });
  }

  const rated = items.filter((i) => (i.reviews ?? 0) >= 3).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
  if (kind === 'beaches' && rated?.rating) {
    faqs.push({
      q: t('faqTopRatedQ'),
      a: t('faqTopRatedA', { name: rated.name, rating: rated.rating.toFixed(1), count: rated.reviews ?? 0 }),
    });
  }
  return faqs;
}

export async function NearbyPage({ kind, locale, slug }: { kind: NearbyKind; locale: Locale; slug: string }) {
  setRequestLocale(locale);
  const data = await load(kind, slug, locale);
  if (!data || !data.items.length) notFound();
  const { village, items } = data;

  const t = await getTranslations({ locale, namespace: 'places' });
  const shell = await getTranslations({ locale, namespace: 'shell' });
  const common = await getTranslations({ locale, namespace: 'common' });

  const name = placeName(slug, locale, village);
  const ip = inPlace(slug, locale);
  const first = items[0];
  const withinRadius = items.filter((i) => i.km <= NEAR_RADIUS_KM).length;
  const vars = { count: items.length, inPlace: ip, nearest: first.name, km: formatDistance(first.km, locale) };

  let intro = t(`${kind}Intro`, { ...vars, within: withinRadius, radius: NEAR_RADIUS_KM });
  if (kind === 'beaches') {
    const sandy = items.filter((i) => has(i.raw, 'sandy')).length;
    const organized = items.filter((i) => has(i.raw, 'organized') || has(i.raw, 'sunbeds')).length;
    const free = items.filter((i) => has(i.raw, 'free') && !has(i.raw, 'organized')).length;
    intro += ` ${t('beachesMix', { sandy, organized, free })}`;
  }

  const faqs = await buildFaqs(kind, locale, slug, items);
  const villages = await nearVillages(village, 6);
  const basePath = kind === 'beaches' ? '/beaches' : kind === 'restaurants' ? '/restaurants' : '/activities';
  const sections: NearbyKind[] = ['beaches', 'restaurants', 'activities'];

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('places'), path: '/places' },
              { name, path: `/places/${slug}` },
              { name: shell(kind === 'beaches' ? 'beaches' : kind === 'restaurants' ? 'food' : 'activities'), path: `/places/${slug}/${kind}` },
            ]}
          />
        }
        title={t(`${kind}Title`, vars)}
        lead={intro}
      >
        <nav className="mt-5 flex flex-wrap gap-2 text-sm" aria-label={name}>
          {sections.map((s) => (
            <Link
              key={s}
              href={`/places/${slug}/${s}`}
              aria-current={s === kind ? 'page' : undefined}
              className="rounded-full border border-slate-200 px-3.5 py-1.5 font-medium text-slate-700 hover:border-sea-300 aria-[current]:border-sea-600 aria-[current]:bg-sea-600 aria-[current]:text-white"
            >
              {shell(s === 'beaches' ? 'beaches' : s === 'restaurants' ? 'food' : 'activities')}
            </Link>
          ))}
          <Link href={`/places/${slug}`} className="rounded-full border border-slate-200 px-3.5 py-1.5 font-medium text-slate-700 hover:border-sea-300">
            {name}
          </Link>
        </nav>
      </PageIntro>

      <CardGrid>
        {items.map((i, idx) => (
          <Card
            key={i.slug}
            href={`${basePath}/${i.slug}`}
            favorite={{ type: kind === 'beaches' ? 'beach' : kind === 'restaurants' ? 'restaurant' : 'activity', slug: i.slug }}
            title={i.name}
            image={i.image}
            imageAlt={i.alt}
            distance={formatDistance(i.km, locale)}
            rating={i.rating}
            reviews={i.reviews}
            ratingSource={i.source === 'google' ? 'Google' : null}
            badges={i.tags}
            priority={idx < 2}
          />
        ))}
      </CardGrid>
      <JsonLd data={itemListLd(locale, items.map((i) => ({ name: i.name, path: `${basePath}/${i.slug}` })))} />

      <Faq title={common('faqTitle')} items={faqs} />

      {villages.length > 0 && (
        <Section id="nearby-villages" title={t('nearbyVillages')}>
          <ul className="flex flex-wrap gap-2">
            {villages.map(({ item: v, km }) => (
              <li key={v.slug}>
                <Link
                  href={`/places/${v.slug}/${kind}`}
                  className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-sea-100"
                >
                  {t(`${kind}NearLink`, { inPlace: inPlace(v.slug, locale) })}
                  <span className="text-xs text-slate-500">{formatDistance(km, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

    </Container>
  );
}
