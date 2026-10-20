import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getEvents } from '@/lib/db/content';
import { pick } from '@/lib/i18n/localize';
import { closestVillagesFor } from '@/lib/content/nearby';
import { CATEGORY_LABELS, sortByCalendar, whenLabel, type EventRow } from '@/lib/events';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro } from '@/components/ui/Layout';
import { REGION_WIDE_EVENTS } from '@/content/editorial/event-venues';
import { greekAlt } from '@/lib/content/format';

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[locale]/events'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'events' });
  return buildMetadata({ locale, path: '/events', title: t('hubMetaTitle'), description: t('hubLead') });
}

export default async function EventsPage({ params }: PageProps<'/[locale]/events'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, rows] = await Promise.all([
    getTranslations({ locale, namespace: 'events' }),
    getTranslations({ locale, namespace: 'shell' }),
    getEvents(),
  ]);
  const events = sortByCalendar(rows as unknown as EventRow[]);
  const villages = await closestVillagesFor(events as unknown as Array<{ slug: string; latitude: number | null; longitude: number | null }>, locale, 8);

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('events'), path: '/events' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      <CardGrid cols={3}>
        {events.map((e, i) => (
          <Card
            key={e.slug}
            href={`/events/${e.slug}`}
            title={pick(e, 'name', locale)}
            eyebrow={whenLabel(e, locale)}
            image={e.image_url}
            imageAlt={greekAlt(e.image_alt, locale)}
            meta={[REGION_WIDE_EVENTS.has(e.slug) ? null : villages.get(e.slug), CATEGORY_LABELS[e.category]?.[locale]].filter(Boolean).join(' · ')}
            badges={e.is_free ? [t('freeEntry')] : []}
            priority={i < 2}
          />
        ))}
      </CardGrid>
      <JsonLd data={itemListLd(locale, events.map((e) => ({ name: pick(e, 'name', locale), path: `/events/${e.slug}` })))} />
    </Container>
  );
}
