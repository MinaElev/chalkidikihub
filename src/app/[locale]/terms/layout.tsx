import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'el' ? 'Όροι Χρήσης' : locale === 'sr' ? 'Uslovi korišćenja' : 'Terms of Use',
    alternates: {
      canonical: localeUrl(locale, 'terms'),
      languages: {
        ...Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'terms')])),
        'x-default': localeUrl('el', 'terms'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
