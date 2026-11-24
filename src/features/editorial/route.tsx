import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { buildMetadata } from '@/lib/seo/metadata';
import { field, guideBody, indexableLocales, type EditorialDoc } from '@/lib/editorial';
import { plainText } from '@/lib/content/render';
import { EditorialPage } from './EditorialPage';
import { Narrow } from '@/components/ui/Layout';
import { RequestBand } from '@/components/home/RequestBand';
import { GuideAfter, guideCovers } from './extras';

type Params = Promise<{ locale: string } & Record<string, string>>;

/**
 * One implementation for every editorial family (/guide, /costs, /from,
 * /itinerary): static params from the kept list, metadata with the quality
 * gate, and the shared page layout.
 */
export function editorialRoute(opts: {
  list: () => EditorialDoc[];
  base: string;
  param: string;
  sectionKey: 'secPlan' | 'secCosts' | 'secFrom' | 'secItineraries';
  sectionHref: string;
  useOverrides?: boolean;
  /** Extra block above the body (e.g. a comparison table). */
  top?: (slug: string, locale: Locale) => React.ReactNode;
  /** Extra block after the body (e.g. a distance table). */
  bottom?: (slug: string, locale: Locale) => React.ReactNode;
}) {
  const find = (slug: string) => opts.list().find((d) => d.slug === slug);

  async function generateMetadata({ params }: { params: Params }) {
    const p = await params;
    const locale = p.locale as Locale;
    const doc = find(p[opts.param]);
    if (!doc) return {};
    const title = field(doc.metaTitle, locale);
    const desc = field(doc.metaDesc, locale);
    const body = opts.useOverrides ? await guideBody(doc, locale) : field(doc.content, locale);
    return buildMetadata({
      locale,
      path: `${opts.base}/${doc.slug}`,
      title: (title.text || field(doc.title, locale).text).replace(/\s*\|\s*(Chalkidiki ?Hub|ChalkidikiHub)\s*$/i, ''),
      description: desc.text || plainText(body.text, 155),
      type: 'article',
      indexableLocales: await indexableLocales(doc, opts.useOverrides),
    });
  }

  async function Page({ params }: { params: Params }) {
    const p = await params;
    const locale = p.locale as Locale;
    setRequestLocale(locale);
    const doc = find(p[opts.param]);
    if (!doc) notFound();
    const [t, shell, articles] = await Promise.all([
      getTranslations({ locale, namespace: 'guides' }),
      getTranslations({ locale, namespace: 'shell' }),
      getTranslations({ locale, namespace: 'articles' }),
    ]);
    const body = opts.useOverrides ? await guideBody(doc, locale) : field(doc.content, locale);
    const title = field(doc.title, locale).text;
    const related = opts
      .list()
      .filter((d) => d.slug !== doc.slug)
      .slice(0, 8)
      .map((d) => ({ href: `${opts.base}/${d.slug}`, label: field(d.title, locale).text }));

    // Guides get a cover photo, the request band and cards; /costs, /from and /itinerary keep the plain layout.
    const enhanced = opts.base === '/guide';
    const covers = enhanced ? await guideCovers(opts.list().map((d) => d.slug)) : {};

    return (
      <EditorialPage
        locale={locale}
        path={`${opts.base}/${doc.slug}`}
        crumbs={[
          { name: shell('home'), path: '/' },
          { name: shell('guides'), path: '/guide' },
          ...(opts.sectionHref !== '/guide' ? [{ name: t(opts.sectionKey), path: opts.sectionHref }] : []),
          { name: title, path: `${opts.base}/${doc.slug}` },
        ]}
        title={title}
        lead={field(doc.description, locale).text}
        body={body}
        contentsLabel={articles('contents')}
        related={related}
        relatedLabel={t('related')}
        top={opts.top?.(doc.slug, locale)}
        cover={enhanced ? covers[doc.slug] : undefined}
        mid={enhanced ? <RequestBand locale={locale} /> : undefined}
        after={enhanced ? (
          <GuideAfter
            slug={doc.slug}
            locale={locale}
            othersLabel={t('related')}
            others={opts.list().filter((d) => d.slug !== doc.slug).map((d) => ({ href: `${opts.base}/${d.slug}`, label: field(d.title, locale).text, image: covers[d.slug] }))}
          />
        ) : undefined}
      >
        {opts.bottom && <Narrow>{opts.bottom(doc.slug, locale)}</Narrow>}
      </EditorialPage>
    );
  }

  const generateStaticParams = () => opts.list().map((d) => ({ [opts.param]: d.slug }));
  return { generateMetadata, generateStaticParams, Page };
}
