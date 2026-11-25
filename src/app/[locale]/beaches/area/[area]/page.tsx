import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getBeaches, type Area } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, AREA_OF } from '@/lib/content/place-names';
import { greekAlt } from '@/lib/content/format';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro, Section } from '@/components/ui/Layout';
import { documentedFeatures } from '@/lib/content/beach-documented';
import { Link } from '@/i18n/navigation';

/**
 * Every beach of one peninsula, grouped by the nearest village: /beaches shows
 * the ten best-known per peninsula and links here for the rest.
 */
export const revalidate = 86400;
// No dynamicParams = false: in Next 16 an on-demand revalidation then caches a 404 for the route. Unknown areas 404 via notFound().

export function generateStaticParams() {
  return AREA_SLUGS.map((area) => ({ area }));
}

type Beach = Awaited<ReturnType<typeof getBeaches>>[number];
const score = (b: Beach) => (b.reviews_count ? (b.rating ?? 0) * 10 + Math.min(b.reviews_count, 20) : 0) + (b.image_url ? 1 : 0);

async function load(area: string) {
  if (!AREA_SLUGS.includes(area as Area)) return null;
  const list = (await getBeaches()).filter((b) => b.area === area);
  return list.length ? { area: area as Area, list } : null;
}

export async function generateMetadata({ params }: PageProps<'/[locale]/beaches/area/[area]'>) {
  const { locale: raw, area } = await params;
  const locale = raw as Locale;
  const data = await load(area);
  if (!data) return {};
  const [t, more] = await Promise.all([
    getTranslations({ locale, namespace: 'beach' }),
    getTranslations({ locale, namespace: 'metaExtra' }),
  ]);
  const where = AREA_OF[data.area][locale];
  // The same village grouping the page shows: count, then the villages with the most beaches.
  const villages = await closestVillagesFor(data.list, locale);
  const counts = new Map<string, number>();
  for (const b of data.list) {
    const v = villages.get(b.slug);
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort(([a, x], [b, y]) => y - x || a.localeCompare(b, locale)).slice(0, 3);
  return buildMetadata({
    locale,
    path: `/beaches/area/${area}`,
    title: t('areaMetaTitle', { area: where, count: data.list.length }),
    description: t('areaLead', { area: where }),
    extra: [
      counts.size > 1 && more('areaBeachCount', { count: data.list.length, villages: counts.size }),
      top.length > 1 && [3, 2].map((n) => more('areaBeachTop', { list: top.slice(0, n).map(([v, c]) => `${v} (${c})`).join(', ') })),
    ],
    image: [...data.list].sort((a, b) => score(b) - score(a)).find((b) => b.image_url)?.image_url,
  });
}

export default async function BeachAreaPage({ params }: PageProps<'/[locale]/beaches/area/[area]'>) {
  const { locale: raw, area: slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { area, list } = data;
  const [t, shell, labels] = await Promise.all([
    getTranslations({ locale, namespace: 'beach' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'beachFeatures' }),
  ]);
  const villages = await closestVillagesFor(list, locale);
  const where = AREA_OF[area][locale];

  // Group by nearest village; the villages with the most beaches first, beaches with no village last.
  const groups = new Map<string, Beach[]>();
  for (const b of [...list].sort((a, b) => score(b) - score(a))) {
    const key = villages.get(b.slug) ?? '';
    groups.set(key, [...(groups.get(key) ?? []), b]);
  }
  const ordered = [...groups.entries()].sort(([a, x], [b, y]) => Number(a === '') - Number(b === '') || y.length - x.length || a.localeCompare(b, locale));

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('beaches'), path: '/beaches' },
              { name: AREA_NAMES[area][locale], path: `/beaches/area/${area}` },
            ]}
          />
        }
        title={t('inArea', { area: where })}
        lead={t('areaLead', { area: where })}
      >
        {/* Jump to a village. */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {ordered.map(([name, items], i) => (
            <li key={name || 'other'}>
              <a href={`#v${i}`} className="inline-block rounded-full bg-sea-50 px-3.5 py-1.5 text-sm font-medium text-sea-800 hover:bg-sea-100">
                {name || t('otherBeaches')} <span className="text-sea-600/70">{items.length}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          {AREA_SLUGS.filter((a) => a !== area).map((a, i) => (
            <span key={a}>
              {i > 0 && ' · '}
              <Link href={`/beaches/area/${a}`} className="font-medium text-sea-700 hover:underline">{AREA_NAMES[a][locale]}</Link>
            </span>
          ))}
        </p>
      </PageIntro>

      {ordered.map(([name, items], i) => (
        <Section key={name || 'other'} id={`v${i}`} title={name || t('otherBeaches')}>
          <CardGrid>
            {items.map((b, j) => (
              <Card
                key={b.slug}
                href={`/beaches/${b.slug}`}
                favorite={{ type: 'beach', slug: b.slug }}
                title={displayName(b, locale, 'beach')}
                eyebrow={name || undefined}
                image={b.image_url}
                imageAlt={greekAlt(b.image_alt, locale)}
                badges={documentedFeatures(b.slug, b.features).filter((f) => labels.has(f)).slice(0, 2).map((f) => labels(f))}
                priority={i === 0 && j < 2}
                {...ratingProps(b, 'beach')}
              />
            ))}
          </CardGrid>
        </Section>
      ))}
      <JsonLd data={itemListLd(locale, ordered.flatMap(([, items]) => items).map((b) => ({ name: displayName(b, locale, 'beach'), path: `/beaches/${b.slug}` })))} />
    </Container>
  );
}
