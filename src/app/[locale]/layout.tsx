import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LangSync } from '@/components/layout/LangSync';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateSiteGraph } from '@/lib/site-schema';

const BackToTop = dynamic(() => import('@/components/ui/BackToTop').then(m => m.BackToTop));
const CookieConsent = dynamic(() => import('@/components/ui/CookieConsent').then(m => m.CookieConsent));
const LangSuggestBanner = dynamic(() => import('@/components/layout/LangSuggestBanner').then(m => m.LangSuggestBanner));
const AvailabilityCTAs = dynamic(() => import('@/components/marketing/AvailabilityCTAs'));

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // CRITICAL: call setRequestLocale BEFORE getMessages() so next-intl reads
  // locale from cache instead of headers(). Skipping this opts the whole
  // route into dynamic rendering and kills ISR on Vercel.
  setRequestLocale(locale);
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
      <LangSync />
      <JsonLd data={generateSiteGraph(locale)} />
      <div lang={locale} dir="ltr" className="min-h-screen flex flex-col bg-white text-gray-900" id="app-shell">
        {/* Skip-to-content link for accessibility (WCAG 2.4.1) */}
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none">
          {locale === 'el' ? 'Μετάβαση στο περιεχόμενο' : locale === 'de' ? 'Zum Inhalt springen' : locale === 'bg' ? 'Към съдържанието' : locale === 'ru' ? 'Перейти к содержимому' : locale === 'ro' ? 'Salt la conținut' : locale === 'sr' ? 'Preskoči na sadržaj' : 'Skip to main content'}
        </a>
        <div id="main-header"><Header /></div>
        <main id="main" className="flex-1">{children}</main>
        <div id="main-footer" className="min-h-[700px] sm:min-h-[580px] md:min-h-[400px]" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}><Footer /></div>
        <BackToTop />
        <CookieConsent />
        <LangSuggestBanner />
        <AvailabilityCTAs />
      </div>
    </NextIntlClientProvider>
  );
}
