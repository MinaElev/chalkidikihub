import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { VillagePage } from '@/components/villages/VillagePage';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';
import { localeUrl, generateBreadcrumbLD } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// MUST be force-dynamic: generateStaticParams returns [] while setRequestLocale
// triggers headers() via next-intl → "static to dynamic at runtime" 500s in prod.
// Regression was introduced in 7889755; see d2545c4 for the original fix.
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = createApiClient();
  const { data } = await supabase.from('villages')
    .select('name_el, name_en, meta_title_el, meta_title_en, meta_description_el, meta_description_en, image_url, image_alt, meta_title_de, meta_title_bg, meta_title_ru, meta_title_ro, meta_description_de, meta_description_bg, meta_description_ru, meta_description_ro')
    .eq('slug', slug).single();

  if (!data) return { title: 'Village | ChalkidikiHub' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any;
  const title = row[`meta_title_${locale}`] || row.meta_title_el || row.meta_title_en || row[`name_${locale}`] || row.name_el || row.name_en;
  const description = row[`meta_description_${locale}`] || row.meta_description_el || row.meta_description_en || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: row.image_url ? [{ url: row.image_url, alt: row.image_alt || title }] : [],
    },
    alternates: {
      canonical: localeUrl(locale, `places/${slug}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `places/${slug}`)])),
        'x-default': localeUrl('el', `places/${slug}`),
      },
    },
  };
}

export default async function VillageDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data } = await supabase.from('villages').select('id, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr').eq('slug', slug).single();
  if (!data) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any;
  const homeLabel: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
  const sectionLabel: Record<string, string> = { el: 'Χωριά', en: 'Places', de: 'Orte', bg: 'Места', ru: 'Места', ro: 'Locuri', sr: 'Mesta' };
  const villageName = row[`name_${locale}`] || row.name_el || row.name_en || '';

  return (
    <>
      <JsonLd data={generateBreadcrumbLD([
        { name: homeLabel[locale] || 'Home', url: localeUrl(locale) },
        { name: sectionLabel[locale] || 'Places', url: localeUrl(locale, 'places') },
        { name: villageName, url: localeUrl(locale, `places/${slug}`) },
      ]) as Record<string, unknown>} />
      <VillagePage slug={slug} />
    </>
  );
}
