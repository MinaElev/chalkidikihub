import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getSiteStats } from '@/lib/site-stats';
import RegisterClient from './_client';

type Props = { params: Promise<{ locale: string }> };

// /auth/* is already disallowed in robots.txt; the meta tag covers the case of
// a link leaking into the index from elsewhere.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const stats = await getSiteStats();
  return <RegisterClient stats={stats} />;
}
