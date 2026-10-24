import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { preconnect } from 'react-dom';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { routing } from '@/i18n/routing';
import { htmlLang, type Locale } from '@/i18n/config';
import { SITE_URL } from '@/lib/seo/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AvailabilityFab } from '@/components/layout/AvailabilityFab';
import { CookieConsent } from '@/components/v3/CookieConsent';
import { Analytics as GoogleAnalytics } from '@/components/v3/Analytics';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationLd, websiteLd } from '@/lib/seo/jsonld';
import { BackToTop } from '@/components/v3/BackToTop';
import { LangSuggestBanner } from '@/components/v3/LangSuggestBanner';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'ChalkidikiHub',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0891B2',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'shell' });
  const avail = await getTranslations({ locale, namespace: 'availabilityRequest' });
  // Photos come from Supabase Storage: open that connection while the HTML is still arriving,
  // so the hero image (the LCP element on most pages) doesn't pay for DNS + TLS on slow networks.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) preconnect(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <html lang={htmlLang[locale as Locale]}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          {t('skipToContent')}
        </a>
        {/* Only the strings client components need — not the whole catalogue. */}
        <NextIntlClientProvider messages={null}>
          <Header locale={locale as Locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale as Locale} />
          <AvailabilityFab label={avail('floating.label')} tooltip={avail('floating.tooltip')} />
          <BackToTop />
          <LangSuggestBanner />
          <CookieConsent />
          <GoogleAnalytics />
        </NextIntlClientProvider>
        <JsonLd data={[organizationLd(), websiteLd(locale as Locale)]} />
        {/* Vercel-only scripts (served from /_vercel/*); off when self-hosted, e.g. on Plesk. */}
        {process.env.VERCEL && <Analytics />}
        {process.env.VERCEL && <SpeedInsights />}
      </body>
    </html>
  );
}
