import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Παραλίες Χαλκιδικής',
    description: 'Ανακαλύψτε τις ομορφότερες παραλίες της Χαλκιδικής — κρυστάλλινα νερά, αμμουδιές με Γαλάζια Σημαία και κρυφοί κόλποι στην Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: localeUrl(locale, 'beaches'),
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, `${SITE_URL}/${l}/beaches`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
