import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Φορτιστές EV Χαλκιδικής',
    description: 'Σταθμοί φόρτισης ηλεκτρικών αυτοκινήτων στη Χαλκιδική — χάρτης φορτιστών EV, τύποι βύσματος, ισχύς και διαθεσιμότητα σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: localeUrl(locale, 'ev-chargers'),
      languages: {
        ...Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'ev-chargers')])),
        'x-default': localeUrl('el', 'ev-chargers'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
