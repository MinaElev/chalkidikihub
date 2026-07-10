import { useTranslations, useLocale } from 'next-intl';
import { publicLocales } from '@/i18n/config';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { FeaturedAreas } from '@/components/layout/FeaturedAreas';
import { HomeBeachesSection } from '@/components/layout/HomeBeachesSection';
import { HomeBlogSection } from '@/components/layout/HomeBlogSection';
import { HomeFeaturedListings } from '@/components/layout/HomeFeaturedListings';
import { HeroSearchBox } from '@/components/layout/HeroSearchBox';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { MapPin, Home, Star, QrCode, Shield, Globe, Award, Smartphone, Sparkles, BookOpen, HelpCircle, Compass, ChevronRight } from 'lucide-react';
import { localeUrl, generateItemListLD } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { LastMinuteDealsPopup } from '@/components/LastMinuteDealsPopup';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = publicLocales;

// Static prerender at build time + ISR every 24h. Without force-static,
// next-intl internals opt the route into dynamic rendering and Vercel returns
// Cache-Control: no-store. Combined they deliver CDN-cached HTML at ~200ms
// TTFB instead of ~1100ms SSR. Admin saves call /api/revalidate to surface
// new featured items immediately — the 24h TTL is only a safety net.
export const dynamic = 'force-static';
export const revalidate = 2592000; // ISR: 30d - homepage is mostly static; admin saves trigger on-demand revalidation

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
  // CRITICAL: call setRequestLocale BEFORE getMessages() so next-intl reads
  // locale from cache instead of headers(). Skipping this opts the whole
  // route into dynamic rendering and kills ISR on Vercel.
  setRequestLocale(locale);
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
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l)])),
        'x-default': localeUrl('el'),
      },
    },
  };
}

// ── Homepage FAQPage + ItemList JSON-LD ──────────────────────────────
// Organization + WebSite JSON-LD already ship once from [locale]/layout.tsx.
// Here we add two page-scoped graphs Google/LLMs quote directly:
//  • ItemList of the four Halkidiki "legs" (helps sitelinks + AI area answers)
//  • FAQPage answering the highest-intent planning questions (rich results +
//    the exact snippets ChatGPT/Perplexity pull for "which part of Halkidiki…").
// Static (homepage is force-static) — el/en only, other locales fall back to en.
const HOME_AREAS: Array<{ slug: string; name: Record<string, string> }> = [
  { slug: 'kassandra', name: { el: 'Κασσάνδρα', en: 'Kassandra' } },
  { slug: 'sithonia', name: { el: 'Σιθωνία', en: 'Sithonia' } },
  { slug: 'athos', name: { el: 'Άθως / Ουρανούπολη', en: 'Athos / Ouranoupoli' } },
  { slug: 'mainland', name: { el: 'Ηπειρωτική Χαλκιδική', en: 'Mainland Halkidiki' } },
];

const HOME_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  el: [
    { q: 'Ποιο «πόδι» της Χαλκιδικής να επιλέξω;', a: 'Η Κασσάνδρα (1ο πόδι) είναι πιο κοσμική και οργανωμένη με πολλά beach bars και ζωντάνια. Η Σιθωνία (2ο πόδι) είναι πιο άγρια και φυσική με εξωτικές παραλίες. Το 3ο πόδι (Άθως) φιλοξενεί το μοναστικό κράτος και την Ουρανούπολη.' },
    { q: 'Πότε είναι η καλύτερη εποχή για διακοπές στη Χαλκιδική;', a: 'Ιούνιος και Σεπτέμβριος προσφέρουν ζεστή θάλασσα, λιγότερο κόσμο και καλύτερες τιμές. Ιούλιος–Αύγουστος είναι η αιχμή με τη μεγαλύτερη ζωντάνια αλλά και πλήθος.' },
    { q: 'Πώς φτάνω στη Χαλκιδική;', a: 'Το πλησιέστερο αεροδρόμιο είναι της Θεσσαλονίκης (SKG), 1–2 ώρες οδικώς από τα περισσότερα θέρετρα. Το ενοικιαζόμενο αυτοκίνητο είναι ο πιο βολικός τρόπος μετακίνησης.' },
    { q: 'Χρειάζομαι αυτοκίνητο στη Χαλκιδική;', a: 'Συνιστάται ιδιαίτερα. Οι παραλίες, τα χωριά και τα εστιατόρια είναι διάσπαρτα και τα ΜΜΜ περιορισμένα, οπότε το αυτοκίνητο δίνει ελευθερία εξερεύνησης.' },
  ],
  en: [
    { q: 'Which "leg" of Halkidiki should I choose?', a: 'Kassandra (1st leg) is livelier and more developed, with plenty of beach bars and nightlife. Sithonia (2nd leg) is wilder and more natural, with exotic beaches. The 3rd leg (Athos) holds the monastic state and the town of Ouranoupoli.' },
    { q: 'When is the best time to visit Halkidiki?', a: 'June and September offer warm sea, thinner crowds and better prices. July–August is peak season — the busiest and most vibrant, but also the most crowded.' },
    { q: 'How do I get to Halkidiki?', a: 'The nearest airport is Thessaloniki (SKG), 1–2 hours by road from most resorts. Renting a car is the most convenient way to get around.' },
    { q: 'Do I need a car in Halkidiki?', a: 'Highly recommended. Beaches, villages and tavernas are spread out and public transport is limited, so a car gives you the freedom to explore.' },
  ],
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Organization + WebSite JSON-LD is emitted once in [locale]/layout.tsx via
  // generateSiteGraph (single @graph block). Emitting standalone copies here
  // produced duplicate schemas + advertised hidden languages to crawlers.
  const areaListName = locale === 'el' ? 'Περιοχές της Χαλκιδικής' : 'Areas of Halkidiki';
  const areaItems = HOME_AREAS.map(a => ({
    name: a.name[locale] || a.name.en,
    url: localeUrl(locale, `areas/${a.slug}`),
  }));
  const faqs = HOME_FAQS[locale] || HOME_FAQS.en;
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={generateItemListLD(areaListName, areaItems) as Record<string, unknown>} />
      <JsonLd data={faqLD} />
      <HeroSection />
      <TrustStrip />
      <FeaturedAreas locale={locale} />
      <HomeFeaturedListings locale={locale} />
      <HomeBeachesSection locale={locale} />
      <HomeBlogSection locale={locale} />
      <ExploreHubsSection locale={locale} />
      <QRFeatureSection />
      <LastMinuteDealsPopup />
    </>
  );
}

// Internal-linking section — surfaces hub pages (/best, /places, /guide, /faq)
// from the homepage so Google's crawler can find them via the most
// authoritative page on the site. Each hub then distributes link equity
// to its dozens of sub-pages.
function ExploreHubsSection({ locale }: { locale: string }) {
  const HEAD: Record<string, string> = {
    el: 'Εξερεύνησε τη Χαλκιδική',
    en: 'Explore Halkidiki',
    de: 'Chalkidiki entdecken',
    bg: 'Открийте Халкидики',
    ru: 'Исследуйте Халкидики',
    ro: 'Explorați Halkidiki',
    sr: 'Istražite Halkidiki',
  };
  const SUB: Record<string, string> = {
    el: 'Οδηγοί, χωριά, συχνές ερωτήσεις — όλα όσα χρειάζεσαι για τις διακοπές σου.',
    en: 'Guides, villages, FAQs — everything you need to plan your trip.',
    de: 'Reiseführer, Dörfer, FAQs — alles für Ihre Reise.',
    bg: 'Пътеводители, села, въпроси — всичко, което ви трябва.',
    ru: 'Путеводители, деревни, вопросы — всё для планирования поездки.',
    ro: 'Ghiduri, sate, întrebări — tot ce aveți nevoie.',
    sr: 'Vodiči, sela, pitanja — sve što vam treba.',
  };
  const prefix = locale === 'el' ? '' : `/${locale}`;
  const cards = [
    {
      href: `${prefix}/best`,
      icon: Sparkles,
      iconColor: 'text-accent-400',
      title: { el: 'Best of Χαλκιδική', en: 'Best of Halkidiki', de: 'Best of Chalkidiki', bg: 'Най-доброто', ru: 'Лучшее', ro: 'Best of Halkidiki', sr: 'Najbolje' },
      sub:   { el: 'Ταξιδιωτικοί οδηγοί', en: 'Curated travel guides', de: 'Kuratierte Reiseführer', bg: 'Избрани пътеводители', ru: 'Подборки', ro: 'Ghiduri tematice', sr: 'Tematski vodiči' },
    },
    {
      href: `${prefix}/places`,
      icon: Compass,
      iconColor: 'text-primary-600',
      title: { el: 'Χωριά & Περιοχές', en: 'Villages & Areas', de: 'Dörfer & Regionen', bg: 'Села & Региони', ru: 'Деревни & Регионы', ro: 'Sate & Zone', sr: 'Sela & Regije' },
      sub:   { el: 'Οδηγοί ανά χωριό', en: 'Village-by-village guides', de: 'Ortschaftsführer', bg: 'Пътеводители по села', ru: 'Гиды по деревням', ro: 'Ghiduri sate', sr: 'Vodiči po selima' },
    },
    {
      href: `${prefix}/guide/best-time-to-visit`,
      icon: BookOpen,
      iconColor: 'text-primary-700',
      title: { el: 'Travel Guides', en: 'Travel Guides', de: 'Reiseführer', bg: 'Пътеводители', ru: 'Путеводители', ro: 'Ghiduri călătorie', sr: 'Vodiči putovanja' },
      sub:   { el: 'Καιρός, μεταφορές, tips', en: 'Weather, transport, tips', de: 'Wetter, Transport, Tipps', bg: 'Време, транспорт, съвети', ru: 'Погода, транспорт', ro: 'Vreme, transport, sfaturi', sr: 'Vreme, prevoz' },
    },
    {
      href: `${prefix}/faq`,
      icon: HelpCircle,
      iconColor: 'text-primary-500',
      title: { el: 'Συχνές Ερωτήσεις', en: 'FAQ', de: 'Häufige Fragen', bg: 'Въпроси', ru: 'Вопросы', ro: 'Întrebări', sr: 'Pitanja' },
      sub:   { el: 'Παραλίες, φαγητό, διαμονή', en: 'Beaches, food, stay', de: 'Strände, Essen, Unterkunft', bg: 'Плажове, храна', ru: 'Пляжи, еда, жильё', ro: 'Plaje, mâncare', sr: 'Plaže, hrana' },
    },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{HEAD[locale] || HEAD.en}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{SUB[locale] || SUB.en}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <a
              key={card.href}
              href={card.href}
              className="group flex flex-col p-5 rounded-2xl border-2 bg-primary-50 border-primary-200 hover:border-primary-400 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm mb-3">
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{card.title[locale as keyof typeof card.title] || card.title.en}</h3>
              <p className="text-xs text-gray-600 leading-relaxed flex-1">{card.sub[locale as keyof typeof card.sub] || card.sub.en}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function HeroSection() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const tHome = useTranslations('homepage');
  const tAvail = useTranslations('availabilityRequest');
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] bg-primary-950 text-white overflow-hidden flex items-center">
      {/* Background image + cinematic overlay */}
      <HeroBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/60 via-primary-950/40 to-primary-950/70" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-3xl animate-fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Search Box */}
          <HeroSearchBox placeholder={t('searchPlaceholder')} buttonLabel={tCommon('search')} />

          {/* Availability broadcast CTA — secondary action under hero */}
          <div className="mt-5 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <span className="text-sm text-white/60">{tAvail('ctaHeroPrefix')}</span>
            <Link
              href={'/availability-request'}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl backdrop-blur transition"
            >
              {tAvail('ctaHero')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
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
