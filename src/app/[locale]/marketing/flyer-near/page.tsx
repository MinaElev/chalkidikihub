/**
 * Print-friendly A4 flyer with the /near QR code.
 *
 * Open in any browser → press Ctrl/Cmd+P → "Save as PDF" → A4.
 * Designed to render edge-to-edge at 100% scale (210mm × 297mm).
 *
 * No auth: the QR endpoint is origin-restricted, the content is generic
 * marketing copy, and the public-facing utility outweighs the small risk
 * of a third party hot-linking it.
 */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { FlyerNearClient } from './_client';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Print Flyer — Near Me QR | ChalkidikiHub',
  robots: { index: false, follow: false },
};

export default async function FlyerNearPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FlyerNearClient locale={locale} />;
}
