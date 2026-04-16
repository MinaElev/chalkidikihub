import type { Metadata } from 'next';
import { getCostGuide } from './costs-data';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; topic: string }> }): Promise<Metadata> {
  const { locale, topic } = await params;
  const guide = getCostGuide(topic);
  if (!guide) return { title: 'Costs & Prices | ChalkidikiHub' };
  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const description = guide.metaDesc[locale] || guide.metaDesc.en;
  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, `costs/${topic}`),
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/costs/${topic}`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
