import type { Metadata } from 'next';
import { getFromCity } from './from-data';
import { localeUrl } from '@/lib/seo';

const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only - hidden locales remain routable but unindexed

export async function generateMetadata({ params }: { params: Promise<{ locale: string; city: string }> }): Promise<Metadata> {
  const { locale, city } = await params;
  const guide = getFromCity(city);
  if (!guide) return { title: 'Travel to Halkidiki' };
  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const description = guide.metaDesc[locale] || guide.metaDesc.en;
  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, `from/${city}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `from/${city}`)])),
        'x-default': localeUrl('el', `from/${city}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
