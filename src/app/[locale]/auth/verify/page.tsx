import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import VerifyClient from './_client';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function VerifyEmailPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <VerifyClient />;
}
