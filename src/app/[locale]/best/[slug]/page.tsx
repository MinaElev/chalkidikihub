import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { bestGuides, field } from '@/lib/editorial';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { renderRichText } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { BASE, bestIndexable, loadBest } from '@/lib/content/best';
import { itemListLd } from '@/lib/seo/jsonld';
import { ENRICHMENTS } from '@/content/editorial/best-enrichments';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { Container, Narrow, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { renderLinked } from '@/lib/content/autolink';
import { greekAlt } from '@/lib/content/format';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return bestGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/best/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await loadBest(slug);
  if (!data) return {};
  const { guide, items } = data;
  return buildMetadata({
    locale,
    path: `/best/${slug}`,
    title: field(guide.metaTitle, locale).text.replace(/\s*\|\s*[^|]+$/, '') || field(guide.title, locale).text,
    description: field(guide.metaDesc, locale).text,
    image: (items.find((i) => i.image_url)?.image_url as string) ?? undefined,
    indexableLocales: bestIndexable(slug, items.length),
  });
}

export default async function BestPage({ params }: PageProps<'/[locale]/best/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await loadBest(slug);
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
          <Prose html={await renderLinked(text(e.intro).text, locale, `/best/${slug}`)} />
        </Narrow>
      )}
      <Section id="list" title={t('bestListTitle')}>
        <CardGrid>
          {items.map((r, i) => (
            <Card
              key={r.slug}
              href={`${BASE[sel.kind]}/${r.slug}`}
              favorite={{ type: sel.kind, slug: r.slug }}
              title={displayName(r, locale, sel.kind)}
              eyebrow={villages.get(r.slug)}
              image={r.image_url as string}
              imageAlt={greekAlt(r.image_alt, locale)}
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
