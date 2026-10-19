import type { Metadata } from 'next';
import { hreflangMap } from '@/lib/seo/site';
import { localeUrl } from '@/lib/seo/compat';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'el' ? 'Όροι Χρήσης' : locale === 'sr' ? 'Uslovi korišćenja' : 'Terms of Use',
    alternates: {
      canonical: localeUrl(locale, 'terms'),
      languages: hreflangMap('/terms'),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
