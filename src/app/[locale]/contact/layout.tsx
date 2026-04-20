import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Επικοινωνία',
    description: 'Επικοινωνήστε μαζί μας για πληροφορίες, προτάσεις ή συνεργασίες σχετικά με τη Χαλκιδική. Φόρμα επικοινωνίας και στοιχεία επαφής.',
    alternates: {
      canonical: localeUrl(locale, 'contact'),
      languages: {
        ...Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'contact')])),
        'x-default': localeUrl('el', 'contact'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
