import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Φορτιστές EV Χαλκιδικής',
    description: 'Σταθμοί φόρτισης ηλεκτρικών αυτοκινήτων στη Χαλκιδική — χάρτης φορτιστών EV, τύποι βύσματος, ισχύς και διαθεσιμότητα σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/ev-chargers`,
      languages: {
        el: `${SITE_URL}/el/ev-chargers`, en: `${SITE_URL}/en/ev-chargers`,
        de: `${SITE_URL}/de/ev-chargers`, bg: `${SITE_URL}/bg/ev-chargers`,
        ru: `${SITE_URL}/ru/ev-chargers`, ro: `${SITE_URL}/ro/ev-chargers`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
