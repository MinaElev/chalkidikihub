import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import LastMinuteClient from './_client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const el = locale === 'el';
  return {
    title: el ? 'Διαθεσιμότητες τελευταίας στιγμής' : 'Last-minute availability',
    description: el
      ? 'Κενά δωμάτια που άνοιξαν από ακυρώσεις στη Χαλκιδική — δημοσιευμένα απευθείας από τους ιδιοκτήτες. Κλείσε πριν προλάβει κάποιος άλλος.'
      : 'Rooms that opened up from cancellations in Halkidiki — published straight by the owners. Book before someone else does.',
    alternates: { canonical: `/${locale}/last-minute` },
    robots: { index: true, follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LastMinuteClient />;
}
