import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { VillagePage } from '@/components/villages/VillagePage';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';
import { localeUrl } from '@/lib/seo';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

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
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `places/${slug}`)])),
    },
  };
}

export default async function VillageDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data } = await supabase.from('villages').select('id').eq('slug', slug).single();
  if (!data) notFound();

  return <VillagePage slug={slug} />;
}
