import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { field } from '@/lib/editorial';
import { buildMetadata } from '@/lib/seo/metadata';
import { faqLd } from '@/lib/seo/jsonld';
import { FAQ_PAGES } from '@/content/editorial/faq';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Narrow } from '@/components/ui/Layout';

// v3 had six thin FAQ topic pages (2 clicks in 90 days between them). They
// 301 here as anchored sections of one page that answers everything.
export const revalidate = 86400;

const plain = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function sections(locale: Locale) {
  return FAQ_PAGES.map((p) => ({
    slug: p.slug,
    title: field(p.title, locale).text,
    items: p.faqs
      .map((f) => ({ q: field(f.question, locale), a: field(f.answer, locale) }))
      .filter((f) => f.q.text && f.a.text),
  }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/faq'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'guides' });
  const nativeIn = locales.filter((l) => sections(l).every((s) => s.items.every((i) => i.q.native && i.a.native)));
  return buildMetadata({ locale, path: '/faq', title: t('faqTitle'), description: t('faqLead'), indexableLocales: nativeIn });
}

export default async function FaqPage({ params }: PageProps<'/[locale]/faq'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell] = await Promise.all([
    getTranslations({ locale, namespace: 'guides' }),
    getTranslations({ locale, namespace: 'shell' }),
  ]);
  const secs = sections(locale);
  return (
    <Narrow className="pt-6">
      <Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('faq'), path: '/faq' }]} />
      <h1 className="mt-6 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{t('faqTitle')}</h1>
      <p className="mt-4 text-lg text-slate-600">{t('faqLead')}</p>
      <nav className="mt-6 flex flex-wrap gap-2" aria-label={t('faqTitle')}>
        {secs.map((s) => (
          <a key={s.slug} href={`#${s.slug}`} className="rounded-full bg-sand-100 px-3.5 py-1.5 text-sm font-medium text-slate-800 hover:bg-sea-100">{s.title}</a>
        ))}
      </nav>
      {secs.map((s) => (
        <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-h`} className="mt-12 scroll-mt-24">
          <h2 id={`${s.slug}-h`} className="font-display text-2xl font-semibold text-slate-900">{s.title}</h2>
          <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {s.items.map((f) => (
              <details key={f.q.text} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-slate-900 [&::-webkit-details-marker]:hidden">{f.q.text}</summary>
                <div className="prose-ch mt-3 text-[0.98rem]" dangerouslySetInnerHTML={{ __html: f.a.text }} />
              </details>
            ))}
          </div>
        </section>
      ))}
      <JsonLd data={faqLd(secs.flatMap((s) => s.items.map((f) => ({ q: f.q.text, a: plain(f.a.text) }))))} />
    </Narrow>
  );
}
