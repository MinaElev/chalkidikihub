import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'el' ? 'Χάρτης Χαλκιδικής | ChalkidikiHub' : locale === 'sr' ? 'Mapa Halkidikija | ChalkidikiHub' : 'Halkidiki Map | ChalkidikiHub',
    alternates: {
      canonical: localeUrl(locale, 'map'),
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'map')])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
