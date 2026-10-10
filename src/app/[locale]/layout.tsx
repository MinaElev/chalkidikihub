import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { routing } from '@/i18n/routing';
import { htmlLang, type Locale } from '@/i18n/config';
import { SITE_URL } from '@/lib/seo/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationLd, websiteLd } from '@/lib/seo/jsonld';

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Noto_Serif({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['600'],
  variable: '--font-display-face',
  display: 'swap',
});

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
  themeColor: '#0e7596',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'shell' });

  return (
    <html lang={htmlLang[locale as Locale]} className={`${inter.variable} ${display.variable}`}>
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
        </NextIntlClientProvider>
        <JsonLd data={[organizationLd(), websiteLd(locale as Locale)]} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
