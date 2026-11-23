import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getArticles } from '@/lib/db/content';
import { pick } from '@/lib/i18n/localize';
import { plainText } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { localeUrl } from '@/lib/seo/site';
import { AUTHORS, AUTHOR_LIST, authorInitials, getAuthor } from '@/content/authors';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, Section } from '@/components/ui/Layout';
import { greekAlt } from '@/lib/content/format';

export const revalidate = 86400;
// No dynamicParams = false: in Next 16 an on-demand revalidation (admin save) then caches a 404 (NoFallbackError) for every page of the route. Unknown params still 404 via notFound().

export function generateStaticParams() {
  return AUTHOR_LIST.map((a) => ({ username: a.username }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/authors/[username]'>) {
  const { locale: raw, username } = await params;
  const locale = raw as Locale;
  const author = AUTHORS[username];
  if (!author) return {};
  return buildMetadata({
    locale,
    path: `/authors/${username}`,
    title: `${author.name} — ${author.role[locale] ?? author.role.en}`,
    description: author.bio[locale] ?? author.bio.en,
  });
}

export default async function AuthorPage({ params }: PageProps<'/[locale]/authors/[username]'>) {
  const { locale: raw, username } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const author = AUTHORS[username];
  if (!author) notFound();
  const [t, shell, articles] = await Promise.all([
    getTranslations({ locale, namespace: 'articles' }),
    getTranslations({ locale, namespace: 'shell' }),
    getArticles(),
  ]);
  const mine = articles.filter((a) => getAuthor(a.author).username === username);

  return (
    <Container>
      <div className="pt-6">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: shell('home'), path: '/' },
            { name: shell('blog'), path: '/blog' },
            { name: author.name, path: `/authors/${username}` },
          ]}
        />
      </div>
      <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        <span aria-hidden className={`grid size-24 shrink-0 place-items-center rounded-full bg-gradient-to-br text-3xl font-semibold text-white ${author.avatarGradient}`}>
          {authorInitials(author.name)}
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">{author.name}</h1>
          <p className="mt-1 text-slate-600">{author.role[locale] ?? author.role.en}</p>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">{author.bio[locale] ?? author.bio.en}</p>
          <p className="mt-2 text-sm text-slate-500">{t('articlesCount', { count: mine.length })}</p>
        </div>
      </header>
      <Section id="articles" title={t('allByAuthor', { name: author.name })}>
        <CardGrid cols={3}>
          {mine.map((a) => (
            <Card key={a.slug} href={`/blog/${a.slug}`} title={pick(a, 'title', locale)} image={a.image_url} imageAlt={greekAlt(a.image_alt, locale)} meta={plainText(pick(a, 'excerpt', locale), 110)} />
          ))}
        </CardGrid>
      </Section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: author.name,
            jobTitle: author.role[locale] ?? author.role.en,
            description: author.bio[locale] ?? author.bio.en,
            knowsAbout: author.knowsAbout,
            url: localeUrl(locale, `/authors/${username}`),
            worksFor: { '@type': 'Organization', name: 'ChalkidikiHub' },
          },
        }}
      />
    </Container>
  );
}
