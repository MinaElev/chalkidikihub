import type { Metadata } from 'next';
import { getFromCity } from './from-data';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; city: string }> }): Promise<Metadata> {
  const { locale, city } = await params;
  const guide = getFromCity(city);
  if (!guide) return { title: 'Travel to Halkidiki | ChalkidikiHub' };
  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const description = guide.metaDesc[locale] || guide.metaDesc.en;
  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, `from/${city}`),
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/from/${city}`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
