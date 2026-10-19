import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { renderRichText, withHeadingIds } from '@/lib/content/render';
import type { Crumb } from '@/lib/seo/jsonld';
import { localeUrl, SITE_NAME, SITE_URL } from '@/lib/seo/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Narrow, Prose } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { renderLinked } from '@/lib/content/autolink';

type Body = { text: string; native: boolean; from: Locale | null };

/** Long-form editorial page: breadcrumbs, H1, lead, table of contents, body, related links. */
export async function EditorialPage({
  locale, crumbs, title, lead, body, path, contentsLabel, related, relatedLabel, children, updated,
}: {
  locale: Locale;
  crumbs: Crumb[];
  title: string;
  lead?: string;
  body: Body;
  path: string;
  contentsLabel: string;
  related?: Array<{ href: string; label: string }>;
  relatedLabel?: string;
  children?: React.ReactNode;
  updated?: string;
}) {
  const { html, toc } = withHeadingIds(await renderLinked(body.text, locale, path));
  return (
    <>
      <Narrow className="pt-6">
        <Breadcrumbs locale={locale} crumbs={crumbs} />
        <h1 className="mt-6 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{title}</h1>
        {lead && <p className="mt-4 text-lg leading-relaxed text-slate-600">{lead}</p>}
      </Narrow>
      <Narrow className="mt-8">
        {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
        {toc.length >= 3 && (
          <nav aria-label={contentsLabel} className="mb-10 rounded-2xl bg-sand-50 p-5">
            <p className="text-sm font-semibold text-slate-900">{contentsLabel}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-sea-800">
              {toc.map((h) => (
                <li key={h.id}><a href={`#${h.id}`} className="hover:underline">{h.text}</a></li>
              ))}
            </ol>
          </nav>
        )}
        <Prose html={html} />
      </Narrow>
      {children}
      {related && related.length > 0 && (
        <Narrow className="mt-14">
          <h2 className="font-display text-xl font-semibold text-slate-900">{relatedLabel}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="inline-block rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-sea-100">{r.label}</Link>
              </li>
            ))}
          </ul>
        </Narrow>
      )}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title.slice(0, 110),
          description: lead,
          inLanguage: locale,
          mainEntityOfPage: localeUrl(locale, path),
          dateModified: updated,
          author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
        }}
      />
    </>
  );
}
