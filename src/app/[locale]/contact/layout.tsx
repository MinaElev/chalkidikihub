import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Επικοινωνία | Chalkidiki Hub',
    description: 'Επικοινωνήστε μαζί μας για πληροφορίες, προτάσεις ή συνεργασίες σχετικά με τη Χαλκιδική. Φόρμα επικοινωνίας και στοιχεία επαφής.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages: {
        el: `${SITE_URL}/el/contact`, en: `${SITE_URL}/en/contact`,
        de: `${SITE_URL}/de/contact`, bg: `${SITE_URL}/bg/contact`,
        ru: `${SITE_URL}/ru/contact`, ro: `${SITE_URL}/ro/contact`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
