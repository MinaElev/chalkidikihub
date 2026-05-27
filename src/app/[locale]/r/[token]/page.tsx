import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import OwnerResponseClient from './_client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Αίτημα διαθεσιμότητας | ChalkidikiHub',
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; token: string }>;
  searchParams: Promise<{ a?: string }>;
}) {
  const { locale, token } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  return <OwnerResponseClient token={token} initialAction={sp.a || ''} />;
}
