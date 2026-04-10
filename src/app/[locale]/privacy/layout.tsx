import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'el' ? 'Πολιτική Απορρήτου | ChalkidikiHub' : locale === 'sr' ? 'Politika privatnosti | ChalkidikiHub' : 'Privacy Policy | ChalkidikiHub',
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, `${SITE_URL}/${l}/privacy`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
