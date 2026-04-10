import type { Metadata } from 'next';
import { getBestGuide } from './best-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getBestGuide(slug);
  if (!guide) return { title: 'Best of Halkidiki | ChalkidikiHub' };

  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const description = guide.metaDesc[locale] || guide.metaDesc.en;

  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/best/${slug}`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/best/${slug}`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
