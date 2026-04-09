import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

const CATEGORY_NAMES: Record<string, string> = {
  historical: 'Ιστορικά Αξιοθέατα',
  nature: 'Φύση & Περιπάτοι',
  waterSports: 'Θαλάσσια Σπορ',
  boatTrips: 'Βόλτες με Σκάφος',
  wellness: 'Ευεξία & Spa',
  family: 'Οικογενειακές Δραστηριότητες',
  nightlife: 'Νυχτερινή Ζωή',
  religious: 'Θρησκευτικός Τουρισμός',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  const categoryName = CATEGORY_NAMES[category] || category;
  const title = `${categoryName} - Χαλκιδική`;
  const description = `${categoryName} στη Χαλκιδική. Ανακαλύψτε δραστηριότητες, αξιοθέατα και εμπειρίες.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/activities/category/${category}`,
      languages: Object.fromEntries(
        LOCALES.map(l => [l, `${SITE_URL}/${l}/activities/category/${category}`])
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
