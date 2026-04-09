import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

const CATEGORY_NAMES: Record<string, string> = {
  guides: 'Οδηγοί',
  beaches: 'Παραλίες',
  food: 'Φαγητό',
  activities: 'Δραστηριότητες',
  tips: 'Συμβουλές',
  culture: 'Πολιτισμός',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  const categoryName = CATEGORY_NAMES[category] || category;
  const title = `${categoryName} - Blog Χαλκιδικής`;
  const description = `Άρθρα και οδηγοί για ${categoryName.toLowerCase()} στη Χαλκιδική. Ενημερωθείτε για τα τελευταία νέα και tips.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/category/${category}`,
      languages: Object.fromEntries(
        LOCALES.map(l => [l, `${SITE_URL}/${l}/blog/category/${category}`])
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
