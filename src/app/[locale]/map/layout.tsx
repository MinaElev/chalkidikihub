import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'el' ? 'Χάρτης Χαλκιδικής | ChalkidikiHub' : locale === 'sr' ? 'Mapa Halkidikija | ChalkidikiHub' : 'Halkidiki Map | ChalkidikiHub',
    alternates: {
      canonical: `${SITE_URL}/${locale}/map`,
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, `${SITE_URL}/${l}/map`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
