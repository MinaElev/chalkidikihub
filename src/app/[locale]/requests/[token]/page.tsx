import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import GuestDashboardClient from './_client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Οι απαντήσεις στο αίτημά σου | ChalkidikiHub',
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  return <GuestDashboardClient token={token} />;
}
