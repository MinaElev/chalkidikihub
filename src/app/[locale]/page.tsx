import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { FeaturedAreas } from '@/components/layout/FeaturedAreas';
import { HomeBeachesSection } from '@/components/layout/HomeBeachesSection';
import { HomeBlogSection } from '@/components/layout/HomeBlogSection';
import { HomeFeaturedListings } from '@/components/layout/HomeFeaturedListings';
import { JsonLd } from '@/components/ui/JsonLd';
import { HeroSearchBox } from '@/components/layout/HeroSearchBox';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { MapPin, Home, Star, QrCode } from 'lucide-react';
import { localeUrl } from '@/lib/seo';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

const descriptions: Record<string, string> = {
  el: 'Βρείτε το τέλειο κατάλυμα για τις διακοπές σας στο πιο όμορφο μέρος της Ελλάδας. Παραλίες, εστιατόρια, χωριά και οδηγοί σε 7 γλώσσες.',
  en: 'Find the perfect accommodation for your holidays in the most beautiful part of Greece. Beaches, restaurants, villages and guides in 7 languages.',
  de: 'Finden Sie die perfekte Unterkunft für Ihren Urlaub im schönsten Teil Griechenlands. Strände, Restaurants, Dörfer und Reiseführer.',
  bg: 'Намерете перфектното настаняване за вашата ваканция в най-красивата част на Гърция. Плажове, ресторанти, села и пътеводители.',
  ru: 'Найдите идеальное жильё для отпуска в самой красивой части Греции. Пляжи, рестораны, деревни и путеводители.',
  ro: 'Găsiți cazarea perfectă pentru vacanța dumneavoastră în cea mai frumoasă parte a Greciei. Plaje, restaurante, sate și ghiduri.',
  sr: 'Pronađite savršen smeštaj za vaš odmor u najlepšem delu Grčke. Plaže, restorani, sela i vodiči na 7 jezika.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const t = (messages as Record<string, Record<string, string>>).common;
  const desc = descriptions[locale] || descriptions.el;

  const titles: Record<string, string> = {
    el: 'ChalkidikiHub | Ανακαλύψτε τη Χαλκιδική',
    en: 'ChalkidikiHub | Discover Halkidiki, Greece',
    de: 'ChalkidikiHub | Chalkidiki entdecken',
    bg: 'ChalkidikiHub | Открийте Халкидики',
    ru: 'ChalkidikiHub | Откройте Халкидики',
    ro: 'ChalkidikiHub | Descoperiți Halkidiki',
    sr: 'ChalkidikiHub | Otkrijte Halkidiki',
  };

  return {
    title: titles[locale] || titles.en,
    description: desc,
    openGraph: {
      title: titles[locale] || titles.en,
      description: desc,
      type: 'website',
      locale,
      siteName: 'Chalkidiki Hub',
      images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(titles[locale] || titles.en)}&type=home`, alt: 'Chalkidiki Hub', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description: desc,
      images: [`${SITE_URL}/api/og?title=${encodeURIComponent(titles[locale] || titles.en)}&type=home`],
    },
    alternates: {
      canonical: localeUrl(locale),
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l)])),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chalkidiki Hub',
    url: SITE_URL,
    description: 'Find the best accommodation, beaches, restaurants and activities in Halkidiki, Greece',
    inLanguage: ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${localeUrl(locale, 'listings')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chalkidiki Hub',
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: 'The ultimate tourism platform for Halkidiki, Greece',
    areaServed: {
      '@type': 'Place',
      name: 'Halkidiki, Greece',
      geo: { '@type': 'GeoCoordinates', latitude: 40.15, longitude: 23.6 },
    },
    sameAs: [],
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <HeroSection />
      <FeaturedAreas />
      <HomeFeaturedListings />
      <HomeBeachesSection />
      <HomeBlogSection />
      <QRFeatureSection />
    </>
  );
}

function HeroSection() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const tHome = useTranslations('homepage');
  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
      <HeroBackground />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-100 max-w-2xl">
            {t('subtitle')}
          </p>

          {/* Search Box */}
          <HeroSearchBox placeholder={t('searchPlaceholder')} buttonLabel={tCommon('search')} />
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 text-primary-300" />
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-primary-200">{tHome('properties')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-primary-300" />
            <div>
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-primary-200">{tHome('avgRating')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary-300" />
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-primary-200">{tHome('locations')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// FeaturedAreasSection moved to @/components/layout/FeaturedAreas (client component with DB fetch)

// FeaturedListingsSection moved to @/components/layout/HomeFeaturedListings (client component with DB fetch)

// BlogSection moved to @/components/layout/HomeBlogSection (client component with DB fetch)

function QRFeatureSection() {
  const tHome = useTranslations('homepage');
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Icon */}
          <div className="shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
              <QrCode className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <span className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              {tHome('digitalConcierge')}
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              {tHome('qrGuideTitle')}
            </h2>
            <p className="mt-3 text-lg text-gray-600 leading-relaxed max-w-xl">
              {tHome('qrGuideDesc')}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start text-sm text-gray-500">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                {tHome('qrBeaches')}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                {tHome('qrRestaurants')}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                {tHome('qrActivities')}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                {tHome('qrPhones')}
              </span>
            </div>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md"
            >
              <QrCode className="w-5 h-5" />
              {tHome('createQR')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <section className="py-16 bg-primary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white">{t('forOwners')}</h2>
        <p className="mt-3 text-lg text-primary-100">{t('description')}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
          >
            {t('registerProperty')}
          </Link>
          <Link
            href="/listings"
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            {tNav('listings')}
          </Link>
        </div>
      </div>
    </section>
  );
}
