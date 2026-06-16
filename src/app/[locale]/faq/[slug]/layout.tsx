import type { Metadata } from 'next';
import { getFaqPage } from './faq-data';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only - hidden locales remain routable but unindexed

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const faq = getFaqPage(slug);
  if (!faq) return { title: 'FAQ' };
  const title = faq.metaTitle[locale] || faq.metaTitle.en;
  const description = faq.metaDesc[locale] || faq.metaDesc.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale, siteName: 'Chalkidiki Hub', images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=faq`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=faq`] },
    alternates: {
      canonical: localeUrl(locale, `faq/${slug}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `faq/${slug}`)])),
        'x-default': localeUrl('el', `faq/${slug}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
