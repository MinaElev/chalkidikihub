import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicChargerDetail } from '@/components/listings/DynamicChargerDetail';
import { getChargers } from '@/lib/get-chargers';
import { localeUrl, ogImageUrl } from '@/lib/seo';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Data comes from the OCM API via getChargers(); a daily ISR window is
// plenty (chargers don't move). Static params are skipped — pages are
// generated on first hit and cached for `revalidate`.
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const chargers = await getChargers();
    const charger = chargers.find((c) => c.slug === slug);

    if (!charger) {
      return { title: 'EV Charger | Chalkidiki Hub' };
    }

    const name = charger.name[locale] || charger.name.en || 'EV Charger';
    const description = charger.description[locale] || charger.description.en || 'EV charging station in Halkidiki';
    const maxPower = Math.max(...charger.connectors.map((c) => c.power_kw));
    const title = `${name} - ${maxPower}kW | Chalkidiki Hub`;
    const image = ogImageUrl(name, 'ev-charger');

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        locale,
        siteName: 'Chalkidiki Hub',
        images: [{ url: image, width: 1200, height: 630, alt: name }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: localeUrl(locale, `ev-chargers/${slug}`),
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, `ev-chargers/${slug}`)])),
          'x-default': localeUrl('el', `ev-chargers/${slug}`),
        },
      },
    };
  } catch {
    return { title: 'EV Charger | Chalkidiki Hub' };
  }
}

export default async function ChargerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Validate slug against live OCM data (chargers are NOT stored in Supabase)
  try {
    const chargers = await getChargers();
    const charger = chargers.find((c) => c.slug === slug);
    if (!charger) notFound();
  } catch {
    // If OCM API fails, still render — the client component will retry
  }

  return <DynamicChargerDetail slug={slug} />;
}
