import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getVillage, getVillages, type VillageCard } from '@/lib/db/content';
import { hasCoords } from '@/lib/geo';
import {
  nearActivities, nearBeaches, nearRestaurants, nearVillages, displayName, shownRating, type EntityKind,
  NEAR_RADIUS_KM, type Near,
} from '@/lib/content/nearby';
import { inPlace, placeName, HALKIDIKI } from '@/lib/content/place-names';
import { formatDistance, formatList, formatMetres, greekAlt } from '@/lib/content/format';
import { BEACH_PROFILES, BLUE_FLAG_2026, BLUE_FLAG_SOURCE, BLUE_FLAG_YEAR, PROFILE_SOURCE } from '@/content/beach-facts';
import { buildMetadata } from '@/lib/seo/metadata';
import { nearbyListPasses } from '@/lib/seo/quality';
import { itemListLd, type Faq as FaqItem } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { documentedFeatures } from '@/lib/content/beach-documented';
import { isNearestBeach } from '@/lib/content/beach-coverage';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

export type NearbyKind = 'beaches' | 'restaurants' | 'activities';

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
        ? documentedFeatures(item.slug, item.features as string[]).filter((f) => labels.has(`beachFeatures.${f}`)).map((f) => labels(`beachFeatures.${f}`))
        : kind === 'restaurants'
          ? ((item.cuisine as string[]) ?? []).filter((c) => labels.has(`cuisineTypes.${c}`)).map((c) => labels(`cuisineTypes.${c}`))
          : item.category && labels.has(`activityCategories.${item.category}`) ? [labels(`activityCategories.${item.category}`)] : [];
    return {
      slug: item.slug,
      name: displayName(item, locale, ENTITY[kind]),
      km,
      image: (item.image_url as string) || null,
      alt: greekAlt(item.image_alt, locale) ?? null,
      ...(({ rating, reviews, source }) => ({ rating, reviews, source }))(shownRating(item, ENTITY[kind])),
      tags,
      raw: item,
    };
  });

  // Indexed only if the village really has several close by (lib/seo/quality.ts).
  return { village, items, indexable: nearbyListPasses(kind, items.map((i) => i.km)) };
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
  const moreVars = { ...vars, within: data.items.filter((i) => i.km <= NEAR_RADIUS_KM).length, radius: NEAR_RADIUS_KM };
  return buildMetadata({
    locale,
    path: `/places/${slug}/${kind}`,
    title: `${t(`${kind}Title`, vars)}, ${HALKIDIKI[locale]}`,
    description: t(`${kind}MetaDesc`, vars),
    extra: [[`${kind}MetaMore`, `${kind}MetaMoreShort`].map((key) => t(key, moreVars))],
    image: first.image,
    indexableLocales: data.indexable ? locales : [],
  });
}


async function buildFaqs(kind: NearbyKind, locale: Locale, slug: string, items: Item[], village: { latitude: number | null; longitude: number | null }): Promise<FaqItem[]> {
  const t = await getTranslations({ locale, namespace: 'places' });
  const ip = inPlace(slug, locale);
  const near = items.filter((i) => i.km <= NEAR_RADIUS_KM);
  // `max` 4 for "the nearest …" answers; Infinity where the answer claims to be the full set.
  const names = (list: Item[], max = 4) =>
    formatList(list.slice(0, max).map((i) => `${i.name} (${formatDistance(i.km, locale)})`), locale);
  const faqs: FaqItem[] = [];
  const first = items[0];

  if (kind === 'beaches') {
    if (isNearestBeach(village, first.km)) faqs.push({
      q: t('faqNearestQ', { inPlace: ip }),
      a: t('faqNearestA', { nearest: first.name, km: formatDistance(first.km, locale) }),
    });
    // Only answers with an official source (src/content/beach-facts.ts). The
    // database's sandy/organised/free tags are incomplete, so they are not
    // turned into claims here.
    const flagged = near.filter((i) => BLUE_FLAG_2026.has(i.slug));
    if (flagged.length) {
      faqs.push({ q: t('faqBlueFlagQ', { inPlace: ip, year: BLUE_FLAG_YEAR }), a: t('faqBlueFlagA', { list: names(flagged, Infinity), year: BLUE_FLAG_YEAR }) });
    }
    const shallow = near.filter((i) => BEACH_PROFILES[i.slug]?.shallow === true);
    if (shallow.length) faqs.push({ q: t('faqShallowQ', { inPlace: ip }), a: t('faqShallowA', { list: names(shallow, Infinity) }) });
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
  // Beaches within the radius that an official source says something about.
  const documented = kind === 'beaches'
    ? items.filter((i) => i.km <= NEAR_RADIUS_KM && (BLUE_FLAG_2026.has(i.slug) || BEACH_PROFILES[i.slug])).slice(0, 8)
    : [];
  if (kind === 'beaches') {
    const flagged = items.filter((i) => i.km <= NEAR_RADIUS_KM && BLUE_FLAG_2026.has(i.slug));
    if (flagged.length) {
      // Name every one: "7 of them … : A, B, C and D" would read as if four were all.
      intro += ` ${t('beachesBlueFlag', { count: flagged.length, year: BLUE_FLAG_YEAR, list: formatList(flagged.map((i) => i.name), locale) })}`;
    }
  }

  const faqs = await buildFaqs(kind, locale, slug, items, village as { latitude: number | null; longitude: number | null });
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

      {documented.length > 0 && (
        <Section id="official-beach-data" title={t('officialTitle')} intro={t('officialIntro', { radius: NEAR_RADIUS_KM })}>
          <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {documented.map((i) => {
              const p = BEACH_PROFILES[i.slug];
              const facts = [
                BLUE_FLAG_2026.has(i.slug) && t('factBlueFlag', { year: BLUE_FLAG_YEAR }),
                p?.coast && t(p.coast === 'sand-fine' ? 'factSandFine' : p.coast === 'sand-coarse' ? 'factSandCoarse' : 'factSand'),
                p?.shallow === true && t('factShallow'),
                p?.shallow === false && t('factNormalDepth'),
                p?.depth5m && t('factDepth5m', { m: formatMetres(p.depth5m, locale) }),
                p?.lengthM && t('factLength', { m: formatMetres(p.lengthM, locale) }),
              ].filter(Boolean) as string[];
              return (
                <li key={i.slug} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-3">
                  <Link href={`/beaches/${i.slug}`} className="font-semibold text-sea-700 hover:underline">{i.name}</Link>
                  <span className="text-sm text-slate-500">{formatDistance(i.km, locale)}</span>
                  <span className="text-sm text-slate-700 sm:flex-1">{facts.join(' · ')}</span>
                  {p && (
                    <a href={PROFILE_SOURCE(p.profile)} target="_blank" rel="noopener" className="text-xs text-slate-500 underline hover:text-sea-700">
                      {t('officialProfile')}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            {t.rich('officialSources', {
              year: BLUE_FLAG_YEAR,
              profiles: (c) => <a href="https://bathingwaterprofiles.gr/el" target="_blank" rel="noopener" className="underline hover:text-sea-700">{c}</a>,
              flags: (c) => <a href={BLUE_FLAG_SOURCE} target="_blank" rel="noopener" className="underline hover:text-sea-700">{c}</a>,
            })}
          </p>
        </Section>
      )}

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
