import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { FeaturedAreas } from '@/components/layout/FeaturedAreas';
import { HomeBeachesSection } from '@/components/layout/HomeBeachesSection';
import { HomeBlogSection } from '@/components/layout/HomeBlogSection';
import { HomeFeaturedListings } from '@/components/layout/HomeFeaturedListings';
import { JsonLd } from '@/components/ui/JsonLd';
import { Search, MapPin, Home, Star } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chalkidiki Hub',
    url: SITE_URL,
    description: 'Find the best accommodation, beaches, restaurants and activities in Halkidiki, Greece',
    inLanguage: ['el', 'en', 'de', 'bg', 'ru', 'ro'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/${locale}/listings?q={search_term_string}`,
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
      <CTASection />
    </>
  );
}

function HeroSection() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');

  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-100 max-w-2xl">
            {t('subtitle')}
          </p>

          {/* Search Box */}
          <div className="mt-8 bg-white rounded-2xl p-4 md:p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="date"
                  placeholder={t('checkIn')}
                  className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  type="date"
                  placeholder={t('checkOut')}
                  className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
                <Search className="w-5 h-5" />
                <span>{t.raw('guestsLabel') ? tCommon('search') : 'Search'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 text-primary-300" />
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-primary-200">Properties</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-primary-300" />
            <div>
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-primary-200">Average rating</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary-300" />
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-primary-200">Locations</div>
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
