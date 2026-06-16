import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'el' ? 'Χάρτης Χαλκιδικής' : locale === 'sr' ? 'Mapa Halkidikija' : 'Halkidiki Map',
    alternates: {
      canonical: localeUrl(locale, 'map'),
      languages: {
        ...Object.fromEntries(['el','en'].map(l => [l, localeUrl(l, 'map')])),
        'x-default': localeUrl('el', 'map'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
