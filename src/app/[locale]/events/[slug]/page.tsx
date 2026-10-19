import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { getEvents } from '@/lib/db/content';
import { hasCoords } from '@/lib/geo';
import { localize, pick } from '@/lib/i18n/localize';
import { closestVillage, displayName, nearBeaches, nearListings, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, placeName } from '@/lib/content/place-names';
import { formatDistance } from '@/lib/content/format';
import { plainText, renderRichText } from '@/lib/content/render';
import { CATEGORY_LABELS, hasCurrentDates, whenLabel, type EventRow } from '@/lib/events';
import { buildMetadata } from '@/lib/seo/metadata';
import { eventIndex } from '@/lib/seo/indexability';
import { addressLd, geoLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, FactList, HeroImage, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { MapEmbed } from '@/components/ui/MapEmbed';

export const revalidate = 86400;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

type Row = EventRow & Record<string, unknown> & { latitude: number | null; longitude: number | null };

async function load(slug: string) {
  const e = ((await getEvents()) as unknown as Row[]).find((x) => x.slug === slug);
  if (!e) return null;
  const village = hasCoords(e) ? await closestVillage(e, 10) : null;
  return { e, village };
}

export async function generateMetadata({ params }: PageProps<'/[locale]/events/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await load(slug);
  if (!data) return {};
  const { e, village } = data;
  const t = await getTranslations({ locale, namespace: 'events' });
  const name = pick(e, 'name', locale);
  const place = village ? placeName(village.item.slug, locale, village.item) : AREA_NAMES[e.area as keyof typeof AREA_NAMES]?.[locale] ?? '';
  const when = whenLabel(e, locale);
  return buildMetadata({
    locale,
    path: `/events/${slug}`,
    title: t('metaTitle', { name, when, place }),
    description: t('metaDesc', { name, when }),
    image: e.image_url,
    indexableLocales: (await eventIndex())[slug] ?? [],
  });
}

export default async function EventPage({ params }: PageProps<'/[locale]/events/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { e, village } = data;
  const [t, shell, common] = await Promise.all([
    getTranslations({ locale, namespace: 'events' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const name = pick(e, 'name', locale);
  const body = localize(e, 'description', locale);
  const geo = hasCoords(e);
  const villageName = village ? placeName(village.item.slug, locale, village.item) : null;
  const [stays, beaches] = geo ? await Promise.all([nearListings(e, 4, 10), nearBeaches(e, 4)]) : [[], []];

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('events'), path: '/events' }, { name, path: `/events/${slug}` }]} />}
        title={name}
      >
        <p className="mt-2 text-slate-600">{whenLabel(e, locale)}{villageName ? ` · ${villageName}` : ''}</p>
      </PageIntro>
      <HeroImage src={e.image_url} alt={e.image_alt || name} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
          <Prose html={renderRichText(body.text, locale)} />
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <FactList
            items={[
              { label: t('when'), value: whenLabel(e, locale) },
              { label: t('where'), value: [e.venue, villageName].filter(Boolean).join(', ') || null },
              { label: t('category'), value: CATEGORY_LABELS[e.category]?.[locale] ?? null },
              { label: t('entry'), value: e.is_free ? t('freeEntry') : null },
            ]}
          />
          {e.official_url && (
            <a href={e.official_url} target="_blank" rel="noopener nofollow" className="flex items-center justify-center gap-2 rounded-xl border border-sea-200 px-4 py-3 font-semibold text-sea-800 hover:bg-sea-50">
              <ExternalLink className="size-4" aria-hidden /> {t('official')}
            </a>
          )}
          {geo && <MapEmbed lat={e.latitude!} lng={e.longitude!} title={name} directionsLabel={common('directions')} />}
        </aside>
      </div>
      {stays.length > 0 && (
        <Section id="stays" title={t('nearbyStays')}>
          <CardGrid>
            {stays.map(({ item, km }) => (
              <Card key={item.slug} href={`/listings/${item.slug}`}
                favorite={{ type: 'listing', slug: item.slug }} title={displayName(item, locale, 'listing')} image={item.cover_url} distance={formatDistance(km, locale)} {...ratingProps(item, 'listing')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {beaches.length > 0 && (
        <Section id="beaches" title={t('nearbyBeaches')}>
          <CardGrid>
            {beaches.map(({ item, km }) => (
              <Card key={item.slug} href={`/beaches/${item.slug}`}
                favorite={{ type: 'beach', slug: item.slug }} title={displayName(item, locale, 'beach')} image={item.image_url} imageAlt={item.image_alt} distance={formatDistance(km, locale)} {...ratingProps(item, 'beach')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {hasCurrentDates(e) && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Event',
            name,
            description: plainText(body.text, 300),
            image: e.image_url ?? undefined,
            startDate: e.start_date,
            endDate: e.end_date ?? e.start_date,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            isAccessibleForFree: e.is_free ?? undefined,
            location: { '@type': 'Place', name: e.venue || villageName || name, address: addressLd(villageName), geo: geoLd(e) },
            organizer: e.official_url ? { '@type': 'Organization', name, url: e.official_url } : undefined,
          }}
        />
      )}
    </Container>
  );
}
