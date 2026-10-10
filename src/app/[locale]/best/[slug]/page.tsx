import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getActivities, getBeaches, getRestaurants } from '@/lib/db/content';
import { bestGuides, field } from '@/lib/editorial';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { renderRichText } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { ENRICHMENTS } from '@/content/editorial/best-enrichments';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { Container, Narrow, PageIntro, Prose, Section } from '@/components/ui/Layout';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return bestGuides().map((g) => ({ slug: g.slug }));
}

type Kind = 'beach' | 'restaurant' | 'activity';
type Pick = { kind: Kind; match: (row: Record<string, unknown>) => boolean };

const has = (key: string, v: string) => (r: Record<string, unknown>) => ((r[key] as string[]) ?? []).includes(v);
const is = (key: string, v: unknown) => (r: Record<string, unknown>) => r[key] === v;
const all = () => true;

/** What each list contains — explicit, instead of v3's parsed API URLs. */
const SELECTION: Record<string, Pick> = {
  'beaches-kassandra': { kind: 'beach', match: is('area', 'kassandra') },
  'beaches-sithonia': { kind: 'beach', match: is('area', 'sithonia') },
  'quiet-beaches': { kind: 'beach', match: (r) => has('features', 'free')(r) && !has('features', 'organized')(r) },
  'instagram-spots': { kind: 'beach', match: all },
  'snorkeling-spots': { kind: 'beach', match: has('features', 'pebble') },
  'seafood-restaurants': { kind: 'restaurant', match: has('cuisine', 'seafood') },
  'beach-bars': { kind: 'restaurant', match: has('cuisine', 'beachBar') },
  'romantic-restaurants': { kind: 'restaurant', match: is('has_sea_view', true) },
  'traditional-tavernas': { kind: 'restaurant', match: has('cuisine', 'traditional') },
  'restaurants-kassandra': { kind: 'restaurant', match: is('area', 'kassandra') },
  'restaurants-sithonia': { kind: 'restaurant', match: is('area', 'sithonia') },
  'hiking-trails': { kind: 'activity', match: is('category', 'nature') },
  'historical-sites': { kind: 'activity', match: is('category', 'historical') },
  'water-sports': { kind: 'activity', match: is('category', 'waterSports') },
  'kids-activities': { kind: 'activity', match: is('category', 'family') },
};

const BASE: Record<Kind, string> = { beach: '/beaches', restaurant: '/restaurants', activity: '/activities' };

async function load(slug: string) {
  const guide = bestGuides().find((g) => g.slug === slug);
  const sel = SELECTION[slug];
  if (!guide || !sel) return null;
  const rows = (sel.kind === 'beach' ? await getBeaches() : sel.kind === 'restaurant' ? await getRestaurants() : await getActivities()) as unknown as Array<Record<string, unknown> & { slug: string; latitude: number | null; longitude: number | null }>;
  const weight = (r: Record<string, unknown>) => (Number(r.rating) || 0) * Math.log10(10 + (Number(r.reviews_count) || 0)) + (r.image_url ? 0.5 : 0);
  const items = rows.filter(sel.match).sort((a, b) => weight(b) - weight(a)).slice(0, 20);
  return { guide, sel, items };
}

export async function generateMetadata({ params }: PageProps<'/[locale]/best/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await load(slug);
  if (!data) return {};
  const { guide, items } = data;
  return buildMetadata({
    locale,
    path: `/best/${slug}`,
    title: field(guide.metaTitle, locale).text.replace(/\s*\|\s*[^|]+$/, '') || field(guide.title, locale).text,
    description: field(guide.metaDesc, locale).text,
    image: (items.find((i) => i.image_url)?.image_url as string) ?? undefined,
    indexableLocales: items.length >= 4 && ENRICHMENTS[slug]?.intro?.[locale] ? undefined : [],
  });
}

export default async function BestPage({ params }: PageProps<'/[locale]/best/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { guide, sel, items } = data;
  const [t, shell, common] = await Promise.all([
    getTranslations({ locale, namespace: 'guides' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const e = ENRICHMENTS[slug] ?? {};
  const text = (m?: Record<string, string>) => (m ? field(m, locale) : { text: '', native: false });
  const villages = await closestVillagesFor(items, locale, 10);
  const title = field(guide.title, locale).text;
  const faqs = (e.faqs ?? [])
    .map((f) => ({ q: text(f.q).text, a: text(f.a).text.replace(/<[^>]+>/g, '') }))
    .filter((f) => f.q && f.a);

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('guides'), path: '/guide' },
              { name: title, path: `/best/${slug}` },
            ]}
          />
        }
        title={title}
        lead={field(guide.description, locale).text}
      />
      {e.intro && (
        <Narrow className="!mx-0 !px-0">
          <Prose html={renderRichText(text(e.intro).text, locale)} />
        </Narrow>
      )}
      <Section id="list" title={t('bestListTitle')}>
        <CardGrid>
          {items.map((r, i) => (
            <Card
              key={r.slug}
              href={`${BASE[sel.kind]}/${r.slug}`}
              title={displayName(r, locale, sel.kind)}
              eyebrow={villages.get(r.slug)}
              image={r.image_url as string}
              imageAlt={r.image_alt as string}
              priority={i < 2}
              {...ratingProps(r, sel.kind)}
            />
          ))}
        </CardGrid>
      </Section>
      {[e.criteria, e.seasonal, e.tips].filter(Boolean).map((block, i) => (
        <Narrow key={i} className="!mx-0 mt-12 !px-0">
          <Prose html={renderRichText(text(block).text, locale)} />
        </Narrow>
      ))}
      <Faq title={common('faqTitle')} items={faqs} />
      <JsonLd data={itemListLd(locale, items.map((r) => ({ name: displayName(r, locale, sel.kind), path: `${BASE[sel.kind]}/${r.slug}` })))} />
    </Container>
  );
}
