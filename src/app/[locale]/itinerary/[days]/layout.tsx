import type { Metadata } from 'next';
import { getItinerary } from './itinerary-data';
import { localeUrl } from '@/lib/seo';

const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only - hidden locales remain routable but unindexed

export async function generateMetadata({ params }: { params: Promise<{ locale: string; days: string }> }): Promise<Metadata> {
  const { locale, days } = await params;
  const guide = getItinerary(days);
  if (!guide) return { title: 'Itinerary' };
  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const description = guide.metaDesc[locale] || guide.metaDesc.en;
  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, `itinerary/${days}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `itinerary/${days}`)])),
        'x-default': localeUrl('el', `itinerary/${days}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
