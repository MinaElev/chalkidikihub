import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { Church, MapPin, Users, Bus, BedDouble, Clock, Mountain, BookOpen, ChevronRight } from 'lucide-react';
import { tr } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = tr('metaLandingTitle', locale);
  const description = tr('metaLandingDesc', locale);
  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos`])),
    },
  };
}

const GUIDE_SECTIONS = [
  { href: '/mount-athos/monasteries', icon: Church, titleKey: 'navMonasteries' as const, descKey: 'descMonasteries' as const },
  { href: '/mount-athos/how-to-visit', icon: Users, titleKey: 'navHowToVisit' as const, descKey: 'descHowToVisit' as const },
  { href: '/mount-athos/getting-there', icon: Bus, titleKey: 'navGettingThere' as const, descKey: 'descGettingThere' as const },
  { href: '/mount-athos/accommodation', icon: BedDouble, titleKey: 'navAccommodation' as const, descKey: 'descAccommodation' as const },
  { href: '/mount-athos/daily-life', icon: Clock, titleKey: 'navDailyLife' as const, descKey: 'descDailyLife' as const },
  { href: '/mount-athos/hiking', icon: Mountain, titleKey: 'navHiking' as const, descKey: 'descHiking' as const },
  { href: '/mount-athos/history', icon: BookOpen, titleKey: 'navHistory' as const, descKey: 'descHistory' as const },
];

export default async function MountAthosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <article>
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-2xl p-8 md:p-12 text-white mb-8">
        <nav className="flex items-center gap-2 text-sm text-amber-200 mb-4">
          <Link href="/" className="hover:text-white">{tr('home', locale)}</Link>
          <ChevronRight className="w-3 h-3" />
          <span>{tr('mountAthos', locale)}</span>
        </nav>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{tr('landingTitle', locale)}</h1>
        <p className="text-lg text-amber-100 max-w-3xl">{tr('landingSubtitle', locale)}</p>
        <div className="flex flex-wrap gap-4 mt-6 text-sm text-amber-200">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {tr('landingLocation', locale)}</span>
          <span className="flex items-center gap-1.5"><Mountain className="w-4 h-4" /> 2.033 m</span>
          <span className="flex items-center gap-1.5"><Church className="w-4 h-4" /> 20 {tr('monasteries', locale)}</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> ~2.000 {tr('monks', locale)}</span>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose prose-gray max-w-none mb-10">
        <p className="text-lg text-gray-700 leading-relaxed">{tr('landingIntro', locale)}</p>
        <p>{tr('landingIntro2', locale)}</p>
      </div>

      {/* Guide sections grid */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{tr('guideTitle', locale)}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {GUIDE_SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}
            className="group flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
              <s.icon className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-800 transition-colors">{tr(s.titleKey, locale)}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{tr(s.descKey, locale)}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-600 mt-1 shrink-0 transition-colors" />
          </Link>
        ))}
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: tr('mountAthos', locale),
        description: tr('metaLandingDesc', locale),
        geo: { '@type': 'GeoCoordinates', latitude: 40.1572, longitude: 24.3264 },
        isAccessibleForFree: true,
        touristType: 'Pilgrimage',
        containedInPlace: { '@type': 'AdministrativeArea', name: 'Halkidiki, Greece' },
      })}} />
    </article>
  );
}
