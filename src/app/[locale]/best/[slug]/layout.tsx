import type { Metadata } from 'next';
import { publicLocales } from '@/i18n/config';
import { getBestGuide } from './best-data';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = publicLocales;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getBestGuide(slug);
  if (!guide) return { title: 'Best of Halkidiki' };

  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const description = guide.metaDesc[locale] || guide.metaDesc.en;

  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, `best/${slug}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `best/${slug}`)])),
        'x-default': localeUrl('el', `best/${slug}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
