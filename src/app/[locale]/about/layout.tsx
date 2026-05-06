import type { Metadata } from 'next';
import { localeUrl, ogImageUrl } from '@/lib/seo';
import { ABOUT } from './about-content';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = ABOUT[locale] || ABOUT.en;
  const image = ogImageUrl(c.hero.title, 'about');
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      type: 'website',
      locale,
      siteName: 'Chalkidiki Hub',
      images: [{ url: image, width: 1200, height: 630, alt: c.hero.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.metaTitle,
      description: c.metaDescription,
      images: [image],
    },
    alternates: {
      canonical: localeUrl(locale, 'about'),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, 'about')])),
        'x-default': localeUrl('el', 'about'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
