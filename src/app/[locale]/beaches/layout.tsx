import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Παραλίες Χαλκιδικής | Chalkidiki Hub',
    description: 'Ανακαλύψτε τις ομορφότερες παραλίες της Χαλκιδικής — κρυστάλλινα νερά, αμμουδιές με Γαλάζια Σημαία και κρυφοί κόλποι στην Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/beaches`,
      languages: {
        el: `${SITE_URL}/el/beaches`, en: `${SITE_URL}/en/beaches`,
        de: `${SITE_URL}/de/beaches`, bg: `${SITE_URL}/bg/beaches`,
        ru: `${SITE_URL}/ru/beaches`, ro: `${SITE_URL}/ro/beaches`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
