import type { Metadata } from 'next';
import { hreflangMap } from '@/lib/seo/site';
import { localeUrl } from '@/lib/seo/compat';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: ({ el: 'Πολιτική Απορρήτου', en: 'Privacy Policy', de: 'Datenschutzerklärung', bg: 'Политика за поверителност', ru: 'Политика конфиденциальности', ro: 'Politica de confidențialitate', sr: 'Politika privatnosti' } as Record<string, string>)[locale] ?? 'Privacy Policy',
    alternates: {
      canonical: localeUrl(locale, 'privacy'),
      languages: hreflangMap('/privacy'),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
