import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { NearClient } from './_client';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en'] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'el'
    ? 'Κοντά μου — Παραλίες, εστιατόρια & δραστηριότητες'
    : 'Near Me — Beaches, Restaurants & Activities';
  const desc = locale === 'el'
    ? 'Βρες τις πιο κοντινές παραλίες, εστιατόρια, δραστηριότητες και καταλύματα στην τοποθεσία σου στη Χαλκιδική.'
    : 'Find the closest beaches, restaurants, activities and accommodation to your location in Halkidiki.';
  return {
    title,
    description: desc,
    robots: { index: true, follow: true },
    alternates: {
      canonical: localeUrl(locale, 'near'),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, 'near')])),
        'x-default': localeUrl('el', 'near'),
      },
    },
    openGraph: {
      title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub',
      images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=near`, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function NearPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NearClient locale={locale} />;
}
