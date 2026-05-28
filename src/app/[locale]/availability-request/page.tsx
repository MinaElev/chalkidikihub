import type { Metadata } from 'next';
import { setRequestLocale, getMessages } from 'next-intl/server';
import AvailabilityRequestClient from './_client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const block = (messages as Record<string, Record<string, string>>).availabilityRequest || {};
  return {
    title: block.metaTitle || 'Request availability',
    description: block.metaDescription || '',
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
