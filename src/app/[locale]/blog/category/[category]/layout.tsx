import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

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
      canonical: localeUrl(locale, `blog/category/${category}`),
      languages: Object.fromEntries(
        LOCALES.map(l => [l, localeUrl(l, `blog/category/${category}`)])
      ),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
