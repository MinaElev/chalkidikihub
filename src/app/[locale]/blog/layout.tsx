import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Blog & Οδηγοί Χαλκιδικής | Chalkidiki Hub',
    description: 'Ταξιδιωτικά άρθρα, οδηγοί και συμβουλές για διακοπές στη Χαλκιδική — τι να δείτε, πού να φάτε, κρυφά μέρη και πρακτικές πληροφορίες.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: {
        el: `${SITE_URL}/el/blog`, en: `${SITE_URL}/en/blog`,
        de: `${SITE_URL}/de/blog`, bg: `${SITE_URL}/bg/blog`,
        ru: `${SITE_URL}/ru/blog`, ro: `${SITE_URL}/ro/blog`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
