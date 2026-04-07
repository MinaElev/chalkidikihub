import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Για Ιδιοκτήτες | Chalkidiki Hub',
    description: 'Καταχωρίστε δωρεάν την επιχείρησή σας στο Chalkidiki Hub — προβολή καταλυμάτων, εστιατορίων και δραστηριοτήτων στη Χαλκιδική σε 6 γλώσσες.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/for-owners`,
      languages: {
        el: `${SITE_URL}/el/for-owners`, en: `${SITE_URL}/en/for-owners`,
        de: `${SITE_URL}/de/for-owners`, bg: `${SITE_URL}/bg/for-owners`,
        ru: `${SITE_URL}/ru/for-owners`, ro: `${SITE_URL}/ro/for-owners`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
