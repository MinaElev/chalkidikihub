import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Περιοχές Χαλκιδικής',
    description: 'Εξερευνήστε τις περιοχές της Χαλκιδικής — Κασσάνδρα, Σιθωνία, Άθως και ενδοχώρα. Χωριά, χάρτης, αποστάσεις και χρήσιμες πληροφορίες.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/areas`,
      languages: {
        el: `${SITE_URL}/el/areas`, en: `${SITE_URL}/en/areas`,
        de: `${SITE_URL}/de/areas`, bg: `${SITE_URL}/bg/areas`,
        ru: `${SITE_URL}/ru/areas`, ro: `${SITE_URL}/ro/areas`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
