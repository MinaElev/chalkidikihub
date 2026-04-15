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
import { MapPin, Home, Star, QrCode, Shield, Globe, Award, Smartphone } from 'lucide-react';
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
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 },
    description: 'The ultimate tourism platform for Halkidiki, Greece — accommodation, beaches, restaurants, activities in 7 languages',
    foundingDate: '2024',
    areaServed: {
      '@type': 'Place',
      name: 'Halkidiki, Greece',
      geo: { '@type': 'GeoCoordinates', latitude: 40.15, longitude: 23.6 },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${SITE_URL}/contact`,
      availableLanguage: ['Greek', 'English', 'German', 'Bulgarian', 'Russian', 'Romanian', 'Serbian'],
    },
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <HeroSection />
      <TrustStrip />
      <FeaturedAreas locale={locale} />
      <HomeFeaturedListings locale={locale} />
      <HomeBeachesSection locale={locale} />
      <HomeBlogSection locale={locale} />
      <QRFeatureSection />
    </>
  );
}

function HeroSection() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const tHome = useTranslations('homepage');
  const locale = useLocale();
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] bg-primary-950 text-white overflow-hidden flex items-center">
      {/* Background image + cinematic overlay */}
      <HeroBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-primary-950/40 to-primary-950/70" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        {/* Trust badge */}
        <div className="animate-fade-in mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-primary-200">
            <Award className="w-4 h-4 text-accent-400" />
            {locale === 'el' ? '#1 Πλατφόρμα Τουρισμού Χαλκιδικής' : '#1 Halkidiki Tourism Platform'}
          </span>
        </div>

        <div className="max-w-3xl animate-fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Search Box */}
          <HeroSearchBox placeholder={t('searchPlaceholder')} buttonLabel={tCommon('search')} />
        </div>

        {/* Stats — glass cards */}
        <div className="mt-14 flex flex-wrap gap-4 md:gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-300" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">500+</div>
              <div className="text-xs text-white/50">{tHome('properties')}</div>
            </div>
          </div>
          <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">4.8</div>
              <div className="text-xs text-white/50">{tHome('avgRating')}</div>
            </div>
          </div>
          <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">50+</div>
              <div className="text-xs text-white/50">{tHome('locations')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const locale = useLocale();
  const items = [
    { icon: Shield, text: locale === 'el' ? 'Χωρίς προμήθειες' : 'No commissions' },
    { icon: Globe, text: locale === 'el' ? '7 γλώσσες' : '7 languages' },
    { icon: Smartphone, text: locale === 'el' ? 'QR Guest Guide' : 'QR Guest Guide' },
    { icon: Award, text: locale === 'el' ? 'SEO Optimized' : 'SEO Optimized' },
  ];
  return (
    <div className="relative -mt-8 z-10 max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/5 border border-gray-100 px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
            <Icon className="w-4 h-4 text-primary-600" />
            <span className="font-medium">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// FeaturedAreasSection moved to @/components/layout/FeaturedAreas (client component with DB fetch)

// FeaturedListingsSection moved to @/components/layout/HomeFeaturedListings (client component with DB fetch)

// BlogSection moved to @/components/layout/HomeBlogSection (client component with DB fetch)

function QRFeatureSection() {
  const tHome = useTranslations('homepage');
  return (
    <section className="py-20 md:py-28 bg-primary-950 text-white overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Icon — larger, with glow */}
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded-3xl blur-2xl" />
              <div className="relative w-36 h-36 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl ring-1 ring-white/10">
                <QrCode className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <span className="section-badge bg-primary-800 text-primary-300 mb-4">
              {tHome('digitalConcierge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              {tHome('qrGuideTitle')}
            </h2>
            <p className="mt-4 text-lg text-white/60 leading-relaxed max-w-xl">
              {tHome('qrGuideDesc')}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 justify-center md:justify-start">
              {[tHome('qrBeaches'), tHome('qrRestaurants'), tHome('qrActivities'), tHome('qrPhones')].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/8 rounded-lg border border-white/10 text-sm text-white/70">
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 bg-white text-primary-900 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-lg"
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
