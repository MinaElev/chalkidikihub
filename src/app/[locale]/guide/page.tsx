import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { bestGuides, costs, field, fromCities, guides, itineraries, type EditorialDoc } from '@/lib/editorial';
import { buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[locale]/guide'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'guides' });
  return buildMetadata({ locale, path: '/guide', title: t('hubMetaTitle'), description: t('hubMetaDesc') });
}

export default async function GuidesHub({ params }: PageProps<'/[locale]/guide'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell] = await Promise.all([
    getTranslations({ locale, namespace: 'guides' }),
    getTranslations({ locale, namespace: 'shell' }),
  ]);

  const group = (title: string, base: string, docs: EditorialDoc[]) => (
    <Section id={base.slice(1)} title={title}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => (
          <li key={d.slug}>
            <Link href={`${base}/${d.slug}`} className="block h-full rounded-2xl border border-slate-200 bg-white p-5 hover:border-sea-300 hover:shadow-md">
              <span className="font-semibold text-slate-900">{field(d.title, locale).text}</span>
              <span className="mt-1 block text-sm text-slate-600">{field(d.description, locale).text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('guides'), path: '/guide' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      {group(t('secPlan'), '/guide', guides())}
      {group(t('secFrom'), '/from', fromCities())}
      {group(t('secCosts'), '/costs', costs())}
      {group(t('secItineraries'), '/itinerary', itineraries())}
      {group(t('secBest'), '/best', bestGuides())}
      <Section id="more" title={t('secMore')}>
        <ul className="flex flex-wrap gap-2">
          {[
            { href: '/mount-athos', label: shell('athos') },
            { href: '/faq', label: shell('faq') },
            { href: '/events', label: shell('events') },
            { href: '/ev-chargers', label: shell('evChargers') },
            { href: '/blog', label: shell('blog') },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-block rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-sea-100">{l.label}</Link>
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  );
}
