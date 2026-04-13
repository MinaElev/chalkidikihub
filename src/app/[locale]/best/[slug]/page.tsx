import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import BestOfClient from './_client';
import { getBestGuide, BEST_GUIDES } from './best-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return BEST_GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getBestGuide(slug);
  if (!guide) return { title: 'Not Found' };

  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const desc = guide.metaDesc[locale] || guide.metaDesc.en;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub', images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=best`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=best`] },
    alternates: {
      canonical: `${SITE_URL}/${locale}/best/${slug}`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/best/${slug}`])),
    },
  };
}

export default async function BestOfPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BestOfClient />;
}
