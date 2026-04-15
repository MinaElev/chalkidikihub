import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Φορτιστές EV Χαλκιδικής',
    description: 'Σταθμοί φόρτισης ηλεκτρικών αυτοκινήτων στη Χαλκιδική — χάρτης φορτιστών EV, τύποι βύσματος, ισχύς και διαθεσιμότητα σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: localeUrl(locale, 'ev-chargers'),
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, `${SITE_URL}/${l}/ev-chargers`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
