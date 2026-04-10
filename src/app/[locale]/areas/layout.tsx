import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Περιοχές Χαλκιδικής',
    description: 'Εξερευνήστε τις περιοχές της Χαλκιδικής — Κασσάνδρα, Σιθωνία, Άθως και ενδοχώρα. Χωριά, χάρτης, αποστάσεις και χρήσιμες πληροφορίες.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/areas`,
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, `${SITE_URL}/${l}/areas`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
