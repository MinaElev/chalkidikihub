import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getArticle, getArticles, getBeaches } from '@/lib/db/content';
import { localize, pick } from '@/lib/i18n/localize';
import { displayName, ratingProps } from '@/lib/content/nearby';
import { formatDate, greekAlt } from '@/lib/content/format';
import { plainText, renderRichText, withHeadingIds } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { articleIndex } from '@/lib/seo/indexability';
import { localeUrl, SITE_NAME, SITE_URL } from '@/lib/seo/site';
import { getAuthor, authorInitials } from '@/content/authors';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { HeroImage, Narrow, Prose, Section, Container } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { CommentSection } from '@/components/v3/CommentSection';
import { ShareButtons } from '@/components/v3/ShareButtons';
import { RecentlyViewed } from '@/components/v3/RecentlyViewed';
import { renderLinked } from '@/lib/content/autolink';
import { detailParams } from '@/lib/build-params';

export const revalidate = 86400;

export async function generateStaticParams() {
  return detailParams(async () => (await getArticles()).map((a) => ({ slug: a.slug })));
}

type Row = Awaited<ReturnType<typeof getArticle>> & Record<string, unknown>;

const slugList = (v: unknown) => (Array.isArray(v) ? (v as string[]).filter((s) => typeof s === 'string') : []);

export async function generateMetadata({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const a = (await getArticle(slug)) as Row | null;
  if (!a) return {};
  const title = localize(a, 'meta_title', locale);
  const desc = localize(a, 'meta_description', locale);
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: title.native ? title.text : pick(a, 'title', locale),
    description: desc.native ? desc.text : plainText(pick(a, 'excerpt', locale) || pick(a, 'content', locale), 400),
    image: a.image_url,
    imageAlt: greekAlt(a.image_alt, locale) ?? undefined,
    type: 'article',
    publishedTime: a.published_at,
    modifiedTime: a.updated_at,
    indexableLocales: (await articleIndex())[slug] ?? [],
  });
}

export default async function ArticlePage({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const a = (await getArticle(slug)) as Row | null;
  if (!a) notFound();

  const [t, shell, all, beaches] = await Promise.all([
    getTranslations({ locale, namespace: 'articles' }),
    getTranslations({ locale, namespace: 'shell' }),
    getArticles(),
    getBeaches(),
  ]);

  const title = pick(a, 'title', locale);
  const body = localize(a, 'content', locale);
  const { html, toc } = withHeadingIds(await renderLinked(body.text, locale, `/blog/${slug}`));
  const author = getAuthor(a.author);
  const modified = a.updated_at && a.updated_at.slice(0, 10) !== a.published_at.slice(0, 10) ? a.updated_at : null;

  const relatedSlugs = slugList(a.related_article_slugs);
  const related = [
    ...relatedSlugs.map((s) => all.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x)),
    ...all.filter((x) => x.slug !== slug && x.category === a.category && !relatedSlugs.includes(x.slug)),
  ].slice(0, 3);
  const relatedBeaches = slugList(a.related_beach_slugs)
    .map((s) => beaches.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .slice(0, 8);

  return (
    <>
      <Narrow className="pt-6">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: shell('home'), path: '/' },
            { name: shell('blog'), path: '/blog' },
            { name: title, path: `/blog/${slug}` },
          ]}
        />
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-sea-700">
          {t.has(`cat_${a.category}`) ? t(`cat_${a.category}`) : a.category}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Link href={`/authors/${author.username}`} className="flex items-center gap-2 font-medium text-slate-900 hover:underline">
            <span aria-hidden className={`grid size-8 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${author.avatarGradient}`}>
              {authorInitials(author.name)}
            </span>
            {author.name}
          </Link>
          <span>·</span>
          <time dateTime={a.published_at}>{formatDate(a.published_at, locale)}</time>
          {modified && (
            <>
              <span>·</span>
              <span>{t('updated', { date: formatDate(modified, locale) })}</span>
            </>
          )}
          {a.read_time_min ? (
            <>
              <span>·</span>
              <span>{t('readTime', { minutes: a.read_time_min })}</span>
            </>
          ) : null}
        </div>
      </Narrow>

      <Container className="mt-8">
        <HeroImage src={a.image_url} alt={greekAlt(a.image_alt, locale) ?? title} />
      </Container>

      <Narrow className="mt-10">
        {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
        {toc.length >= 3 && (
          <nav aria-label={t('contents')} className="mb-10 rounded-2xl bg-sand-50 p-5">
            <p className="text-sm font-semibold text-slate-900">{t('contents')}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-sea-800">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="hover:underline">{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Prose html={html} />

        <aside className="mt-14 flex gap-4 rounded-2xl border border-slate-200 p-5">
          <span aria-hidden className={`grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br text-lg font-semibold text-white ${author.avatarGradient}`}>
            {authorInitials(author.name)}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('aboutAuthor')}</p>
            <p className="mt-1 font-semibold text-slate-900">{author.name}</p>
            <p className="text-sm text-slate-600">{author.role[locale] ?? author.role.en}</p>
            <p className="mt-2 text-sm text-slate-700">{author.bio[locale] ?? author.bio.en}</p>
            <Link href={`/authors/${author.username}`} className="mt-2 inline-block text-sm font-semibold text-sea-700 hover:underline">
              {t('allByAuthor', { name: author.name })} →
            </Link>
          </div>
        </aside>

        <div className="mt-8">
          <ShareButtons title={pick(a, 'title', locale)} />
        </div>

        <CommentSection articleId={String(a.id)} />
        <RecentlyViewed type="blog" slug={slug} title={pick(a, 'title', locale)} image={a.image_url as string | null} />
      </Narrow>

      <Container>
        {relatedBeaches.length > 0 && (
          <Section id="beaches" title={t('relatedBeaches')}>
            <CardGrid>
              {relatedBeaches.map((b) => (
                <Card key={b.slug} href={`/beaches/${b.slug}`}
                favorite={{ type: 'beach', slug: b.slug }} title={displayName(b, locale, 'beach')} image={b.image_url} imageAlt={greekAlt(b.image_alt, locale)} {...ratingProps(b, 'beach')} />
              ))}
            </CardGrid>
          </Section>
        )}
        {related.length > 0 && (
          <Section id="related" title={t('relatedArticles')}>
            <CardGrid cols={3}>
              {related.map((r) => (
                <Card key={r.slug} href={`/blog/${r.slug}`} title={pick(r, 'title', locale)} image={r.image_url} imageAlt={greekAlt(r.image_alt, locale)} meta={plainText(pick(r, 'excerpt', locale), 110)} />
              ))}
            </CardGrid>
          </Section>
        )}
      </Container>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title.slice(0, 110),
          description: plainText(pick(a, 'excerpt', locale), 200),
          image: a.image_url ? [a.image_url] : undefined,
          datePublished: a.published_at,
          dateModified: a.updated_at || a.published_at,
          inLanguage: locale,
          mainEntityOfPage: localeUrl(locale, `/blog/${slug}`),
          author: { '@type': 'Person', name: author.name, url: localeUrl(locale, `/authors/${author.username}`) },
          publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
        }}
      />
    </>
  );
}
