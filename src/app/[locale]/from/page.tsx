import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { field, fromCities, guideBody } from '@/lib/editorial';
import { GUIDES } from '@/content/editorial/guides';
import { buildMetadata } from '@/lib/seo/metadata';
import { assessQuality } from '@/lib/seo/quality';
import { EditorialPage } from '@/features/editorial/EditorialPage';
import { Narrow } from '@/components/ui/Layout';

// The hub for every "/from/<city>" page. Its body is v3's getting-here guide
// (that URL now 301s here), so the general "how to get to Halkidiki" query
// and the per-city pages live under one roof.
export const revalidate = 86400;

const doc = GUIDES.find((g) => g.slug === 'getting-here')!;

export async function generateMetadata({ params }: PageProps<'/[locale]/from'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'guides' });
  const passing: Locale[] = [];
  for (const l of locales) {
    const b = await guideBody(doc, l);
    if (assessQuality({ body: b.text, nativeBody: b.native, hasImage: true }, 'hub').indexable) passing.push(l);
  }
  return buildMetadata({ locale, path: '/from', title: t('fromHubTitle'), description: t('fromHubLead'), indexableLocales: passing });
}

export default async function FromHub({ params }: PageProps<'/[locale]/from'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, articles] = await Promise.all([
    getTranslations({ locale, namespace: 'guides' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'articles' }),
  ]);
  const cities = fromCities();
  return (
    <EditorialPage
      locale={locale}
      path="/from"
      crumbs={[{ name: shell('home'), path: '/' }, { name: shell('guides'), path: '/guide' }, { name: t('secFrom'), path: '/from' }]}
      title={t('fromHubTitle')}
      lead={t('fromHubLead')}
      body={await guideBody(doc, locale)}
      contentsLabel={articles('contents')}
    >
      <Narrow className="mt-12">
        <ul className="grid gap-3 sm:grid-cols-2">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link href={`/from/${c.slug}`} className="block rounded-2xl border border-slate-200 p-4 hover:border-sea-300 hover:shadow-md">
                <span className="font-semibold text-slate-900">{field(c.title, locale).text}</span>
                <span className="mt-1 block text-sm text-slate-600">{field(c.description, locale).text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Narrow>
    </EditorialPage>
  );
}
