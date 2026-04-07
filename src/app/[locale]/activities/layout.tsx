import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Δραστηριότητες & Αξιοθέατα Χαλκιδικής | Chalkidiki Hub',
    description: 'Δραστηριότητες και αξιοθέατα στη Χαλκιδική — θαλάσσια σπορ, πεζοπορία, εκδρομές, κρουαζιέρες και πολιτιστικά μνημεία σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/activities`,
      languages: {
        el: `${SITE_URL}/el/activities`, en: `${SITE_URL}/en/activities`,
        de: `${SITE_URL}/de/activities`, bg: `${SITE_URL}/bg/activities`,
        ru: `${SITE_URL}/ru/activities`, ro: `${SITE_URL}/ro/activities`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
