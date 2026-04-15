import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Φαγητό & Ποτό Χαλκιδικής',
    description: 'Εστιατόρια, ταβέρνες, καφετέριες και beach bars στη Χαλκιδική — ελληνική κουζίνα, θαλασσινά και τοπικές γεύσεις σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: localeUrl(locale, 'restaurants'),
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'restaurants')])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
