import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'el' ? 'Όροι Χρήσης | ChalkidikiHub' : locale === 'sr' ? 'Uslovi korišćenja | ChalkidikiHub' : 'Terms of Use | ChalkidikiHub',
    alternates: {
      canonical: localeUrl(locale, 'terms'),
      languages: Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, `${SITE_URL}/${l}/terms`])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
