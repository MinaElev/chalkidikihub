import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Blog & Οδηγοί Χαλκιδικής',
    description: 'Ταξιδιωτικά άρθρα, οδηγοί και συμβουλές για διακοπές στη Χαλκιδική — τι να δείτε, πού να φάτε, κρυφά μέρη και πρακτικές πληροφορίες.',
    alternates: {
      canonical: localeUrl(locale, 'blog'),
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'blog')])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
