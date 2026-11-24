import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { withHeadingIds } from '@/lib/content/render';
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
  locale, crumbs, title, lead, body, path, contentsLabel, related, relatedLabel, top, children, updated, cover, mid, after,
}: {
  /** Cover photo under the lead. */
  cover?: string;
  /** Full-width block placed between two sections, about halfway down the text. */
  mid?: React.ReactNode;
  /** Replaces the plain related-links row after the text (e.g. cards). */
  after?: React.ReactNode;
  /** Shown above the table of contents, e.g. a comparison table. */
  top?: React.ReactNode;
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
  const [htmlA, htmlB] = mid ? splitAtMiddleHeading(html) : [html, ''];
  return (
    <>
      <Narrow className="pt-6">
        <Breadcrumbs locale={locale} crumbs={crumbs} />
        <h1 className="mt-6 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{title}</h1>
        {lead && <p className="mt-4 text-lg leading-relaxed text-slate-600">{lead}</p>}
        {cover && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-sand-100">
            <Image src={cover} alt="" fill priority sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" />
          </div>
        )}
      </Narrow>
      <Narrow className="mt-8">
        {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
        {top}
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
        <Prose html={htmlA} />
      </Narrow>
      {/* Short texts (fewer than four sections) are not split: the block goes after the text. */}
      {mid && (
        <>
          <div className="my-10">{mid}</div>
          {htmlB && <Narrow><Prose html={htmlB} /></Narrow>}
        </>
      )}
      {children}
      {after}
      {!after && related && related.length > 0 && (
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

/** Splits body HTML in two at the <h2> nearest its middle; [html, ''] when there are fewer than four sections. */
function splitAtMiddleHeading(html: string): [string, string] {
  const starts = [...html.matchAll(/<h2[\s>]/g)].map((m) => m.index ?? 0);
  if (starts.length < 4) return [html, ''];
  const cut = starts.reduce((best, i) => (Math.abs(i - html.length / 2) < Math.abs(best - html.length / 2) ? i : best), starts[1]);
  return cut > 0 ? [html.slice(0, cut), html.slice(cut)] : [html, ''];
}
