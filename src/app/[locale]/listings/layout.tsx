import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Καταλύματα στη Χαλκιδική',
    description: 'Βρείτε τα καλύτερα καταλύματα στη Χαλκιδική — ξενοδοχεία, ενοικιαζόμενα δωμάτια, βίλες και διαμερίσματα σε Κασσάνδρα, Σιθωνία και Άθως.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/listings`,
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, `${SITE_URL}/${l}/listings`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
