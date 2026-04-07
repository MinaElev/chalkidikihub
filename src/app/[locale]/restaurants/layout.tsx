import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Φαγητό & Ποτό Χαλκιδικής | Chalkidiki Hub',
    description: 'Εστιατόρια, ταβέρνες, καφετέριες και beach bars στη Χαλκιδική — ελληνική κουζίνα, θαλασσινά και τοπικές γεύσεις σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/restaurants`,
      languages: {
        el: `${SITE_URL}/el/restaurants`, en: `${SITE_URL}/en/restaurants`,
        de: `${SITE_URL}/de/restaurants`, bg: `${SITE_URL}/bg/restaurants`,
        ru: `${SITE_URL}/ru/restaurants`, ro: `${SITE_URL}/ro/restaurants`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
