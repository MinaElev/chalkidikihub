import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const BackToTop = dynamic(() => import('@/components/ui/BackToTop').then(m => m.BackToTop));
const CookieConsent = dynamic(() => import('@/components/ui/CookieConsent').then(m => m.CookieConsent));

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const t = (messages as Record<string, Record<string, string>>).common;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr'),
    title: {
      default: `${t.siteName} - ${t.siteDescription}`,
      template: `%s | ${t.siteName}`,
    },
    description: t.siteDescription,
    openGraph: {
      siteName: t.siteName,
      locale: locale,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} dir="ltr" className="min-h-screen flex flex-col bg-white text-gray-900" id="app-shell">
        <div id="main-header"><Header /></div>
        <main className="flex-1">{children}</main>
        <div id="main-footer" className="min-h-[700px] sm:min-h-[580px] md:min-h-[400px]" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}><Footer /></div>
        <BackToTop />
        <CookieConsent />
      </div>
    </NextIntlClientProvider>
  );
}
