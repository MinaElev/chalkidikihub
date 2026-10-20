import type { Metadata } from 'next';
import { hreflangMap } from '@/lib/seo/site';
import { localeUrl } from '@/lib/seo/compat';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: ({ el: 'Όροι Χρήσης', en: 'Terms of Use', de: 'Nutzungsbedingungen', bg: 'Условия за ползване', ru: 'Условия использования', ro: 'Termeni de utilizare', sr: 'Uslovi korišćenja' } as Record<string, string>)[locale] ?? 'Terms of Use',
    alternates: {
      canonical: localeUrl(locale, 'terms'),
      languages: hreflangMap('/terms'),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
