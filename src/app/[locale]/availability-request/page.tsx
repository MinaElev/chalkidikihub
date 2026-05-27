import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import AvailabilityRequestClient from './_client';

const titles: Record<string, string> = {
  el: 'Ζήτα διαθεσιμότητα σε όλη την περιοχή | ChalkidikiHub',
  en: 'Request availability across the area | ChalkidikiHub',
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: titles[locale] || titles.el,
    description:
      'Στείλε ένα αίτημα και θα ειδοποιηθούν αυτόματα ιδιοκτήτες καταλυμάτων στη Χαλκιδική. Όσοι έχουν διαθέσιμο θα επικοινωνήσουν μαζί σου.',
    robots: { index: true, follow: true },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ area?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  return <AvailabilityRequestClient initialArea={sp.area || ''} />;
}
