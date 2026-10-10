import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getArticles } from '@/lib/db/content';
import { localize, pick } from '@/lib/i18n/localize';
import { formatDate } from '@/lib/content/format';
import { plainText } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

export const revalidate = 3600;

const CATEGORIES = ['beaches', 'guides', 'food', 'activities', 'culture', 'tips'];

export async function generateMetadata({ params }: PageProps<'/[locale]/blog'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'articles' });
  const articles = await getArticles();
  return buildMetadata({
    locale,
    path: '/blog',
    title: t('hubMetaTitle', { count: articles.length }),
    description: t('hubLead'),
    image: articles[0]?.image_url,
  });
}

export default async function BlogPage({ params }: PageProps<'/[locale]/blog'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, articles] = await Promise.all([
    getTranslations({ locale, namespace: 'articles' }),
    getTranslations({ locale, namespace: 'shell' }),
    getArticles(),
  ]);
  // Articles readable in this language first; fallbacks stay reachable below.
  const native = articles.filter((a) => localize(a, 'title', locale).native);
  const latest = native.slice(0, 6);

  const card = (a: (typeof articles)[number], i = 9) => (
    <Card
      key={a.slug}
      href={`/blog/${a.slug}`}
      title={pick(a, 'title', locale)}
      image={a.image_url}
      imageAlt={a.image_alt}
      eyebrow={formatDate(a.published_at, locale)}
      meta={plainText(pick(a, 'excerpt', locale), 120)}
      priority={i < 2}
    />
  );

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('blog'), path: '/blog' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      <Section id="latest" title={t('latest')}>
        <CardGrid cols={3}>{latest.map((a, i) => card(a, i))}</CardGrid>
      </Section>
      {CATEGORIES.map((cat) => {
        const list = native.filter((a) => a.category === cat && !latest.includes(a));
        if (!list.length) return null;
        return (
          <Section key={cat} id={cat} title={t(`cat_${cat}`)}>
            <CardGrid>{list.map((a) => card(a))}</CardGrid>
          </Section>
        );
      })}
      <JsonLd data={itemListLd(locale, native.map((a) => ({ name: pick(a, 'title', locale), path: `/blog/${a.slug}` })))} />
    </Container>
  );
}
