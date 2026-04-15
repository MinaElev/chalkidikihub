import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Περιοχές Χαλκιδικής',
    description: 'Εξερευνήστε τις περιοχές της Χαλκιδικής — Κασσάνδρα, Σιθωνία, Άθως και ενδοχώρα. Χωριά, χάρτης, αποστάσεις και χρήσιμες πληροφορίες.',
    alternates: {
      canonical: localeUrl(locale, 'areas'),
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'areas')])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
