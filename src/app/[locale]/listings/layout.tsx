import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Καταλύματα στη Χαλκιδική | Chalkidiki Hub',
    description: 'Βρείτε τα καλύτερα καταλύματα στη Χαλκιδική — ξενοδοχεία, ενοικιαζόμενα δωμάτια, βίλες και διαμερίσματα σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/listings`,
      languages: {
        el: `${SITE_URL}/el/listings`, en: `${SITE_URL}/en/listings`,
        de: `${SITE_URL}/de/listings`, bg: `${SITE_URL}/bg/listings`,
        ru: `${SITE_URL}/ru/listings`, ro: `${SITE_URL}/ro/listings`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
