import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Navigation, PlugZap } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getVillages } from '@/lib/db/content';
import { getChargers } from '@/lib/ev';
import { mapsDirectionsUrl, nearest } from '@/lib/geo';
import { AREA_OF, placeName } from '@/lib/content/place-names';
import { buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[locale]/ev-chargers'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'ev' });
  const chargers = await getChargers();
  return buildMetadata({ locale, path: '/ev-chargers', title: t('metaTitle'), description: t('metaDesc'), indexableLocales: chargers.length >= 5 ? undefined : [] });
}

export default async function EvPage({ params }: PageProps<'/[locale]/ev-chargers'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, common, chargers, villages] = await Promise.all([
    getTranslations({ locale, namespace: 'ev' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getChargers(),
    getVillages(),
  ]);
  const placed = chargers.map((c) => {
    const v = nearest(c, villages.filter((x) => x.slug !== 'pyrgadikia-mainland'), 1, 15)[0]?.item;
    return { c, village: v ?? null, area: v?.area ?? null };
  });

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('evChargers'), path: '/ev-chargers' }]} />}
        title={t('title')}
        lead={t('lead')}
      />
      {chargers.length === 0 && <p className="text-slate-600">{t('none')}</p>}
      {AREA_SLUGS.map((area) => {
        const list = placed.filter((p) => p.area === area);
        if (!list.length) return null;
        return (
          <Section key={area} id={area} title={`${shell('evChargers')} ${AREA_OF[area][locale]}`}>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map(({ c, village }) => (
                <li key={c.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="flex items-start gap-2 font-semibold text-slate-900">
                    <PlugZap className="mt-0.5 size-5 shrink-0 text-sea-600" aria-hidden />
                    {c.title}
                  </p>
                  {village && <p className="mt-1 text-sm text-slate-500">{t('near', { place: placeName(village.slug, locale, village) })}</p>}
                  {c.connectors.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {c.connectors.map((k, i) => (
                        <li key={i} className="rounded-full bg-sea-50 px-2.5 py-0.5 text-xs font-medium text-sea-800">
                          {k.type}{k.kw ? ` · ${k.kw} kW` : ''}{k.count > 1 ? ` ×${k.count}` : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                  <dl className="mt-3 space-y-1 text-sm text-slate-600">
                    {c.operator && <div><dt className="inline text-slate-500">{t('operator')}: </dt><dd className="inline">{c.operator}</dd></div>}
                    {c.usageCost && <div><dt className="inline text-slate-500">{t('cost')}: </dt><dd className="inline">{c.usageCost}</dd></div>}
                    {c.points ? <div>{t('points', { count: c.points })}</div> : null}
                  </dl>
                  <a href={mapsDirectionsUrl(c)} target="_blank" rel="noopener nofollow" className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-sea-700 hover:underline">
                    <Navigation className="size-4" aria-hidden /> {common('directions')}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
      <p className="mt-10 text-xs text-slate-500">{t('source')}</p>
    </Container>
  );
}
