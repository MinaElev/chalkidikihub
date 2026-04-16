import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight, Waves, Hotel, Car, UtensilsCrossed, Info, Compass } from 'lucide-react';
import { FAQ_PAGES } from './[slug]/faq-data';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Waves, Hotel, Car, UtensilsCrossed, Info, Compass,
};

const COLOR_MAP: Record<string, string> = {
  cyan: 'bg-cyan-100 text-cyan-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  violet: 'bg-violet-100 text-violet-700',
  emerald: 'bg-emerald-100 text-emerald-700',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    el: 'Συχνές Ερωτήσεις — Χαλκιδική | ChalkidikiHub',
    en: 'Frequently Asked Questions — Halkidiki | ChalkidikiHub',
    de: 'Häufig gestellte Fragen — Chalkidiki | ChalkidikiHub',
    bg: 'Често задавани въпроси — Халкидики | ChalkidikiHub',
    ru: 'Часто задаваемые вопросы — Халкидики | ChalkidikiHub',
    ro: 'Intrebari frecvente — Halkidiki | ChalkidikiHub',
    sr: 'Najcesca pitanja — Halkidiki | ChalkidikiHub',
  };
  const descs: Record<string, string> = {
    el: 'Βρείτε απαντήσεις σε όλες τις ερωτήσεις σας για διακοπές στη Χαλκιδική: παραλίες, καταλύματα, μετακινήσεις, φαγητό, δραστηριότητες.',
    en: 'Find answers to all your questions about holidays in Halkidiki: beaches, accommodation, transport, food, activities.',
    de: 'Finden Sie Antworten auf alle Ihre Fragen zum Urlaub in Chalkidiki: Strände, Unterkunft, Transport, Essen, Aktivitäten.',
    bg: 'Намерете отговори на всички ваши въпроси за ваканция в Халкидики: плажове, настаняване, транспорт, храна, дейности.',
    ru: 'Найдите ответы на все вопросы об отдыхе в Халкидики: пляжи, жилье, транспорт, еда, развлечения.',
    ro: 'Gasiti raspunsuri la toate intrebarile despre vacanta in Halkidiki: plaje, cazare, transport, mancare, activitati.',
    sr: 'Pronadjite odgovore na sva pitanja o odmoru na Halkidikiju: plaze, smestaj, prevoz, hrana, aktivnosti.',
  };
  const title = titles[locale] || titles.en;
  const desc = descs[locale] || descs.en;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub' },
    alternates: {
      canonical: localeUrl(locale, 'faq'),
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/faq`])),
    },
  };
}

export default async function FaqIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const heading: Record<string, string> = {
    el: 'Συχνές Ερωτήσεις για τη Χαλκιδική',
    en: 'Frequently Asked Questions about Halkidiki',
    de: 'Häufig gestellte Fragen über Chalkidiki',
    bg: 'Често задавани въпроси за Халкидики',
    ru: 'Часто задаваемые вопросы о Халкидики',
    ro: 'Intrebari frecvente despre Halkidiki',
    sr: 'Najcesca pitanja o Halkidikiju',
  };
  const subtitle: Record<string, string> = {
    el: 'Βρείτε απαντήσεις σε κάθε ερώτηση για τις διακοπές σας',
    en: 'Find answers to every question about your holiday',
    de: 'Finden Sie Antworten auf jede Frage zu Ihrem Urlaub',
    bg: 'Намерете отговори на всички въпроси за вашата ваканция',
    ru: 'Найдите ответы на все вопросы об отпуске',
    ro: 'Gasiti raspunsuri la fiecare intrebare despre vacanta dvs.',
    sr: 'Pronadjite odgovore na svako pitanje o vasem odmoru',
  };
  const homeLabel = locale === 'el' ? 'Αρχική' : locale === 'de' ? 'Startseite' : locale === 'bg' ? 'Начало' : locale === 'ru' ? 'Главная' : locale === 'ro' ? 'Acasa' : locale === 'sr' ? 'Pocetna' : 'Home';
  const faqLabel = locale === 'el' ? 'Συχνές Ερωτήσεις' : 'FAQ';
  const questionsLabel = locale === 'el' ? 'ερωτήσεις' : locale === 'de' ? 'Fragen' : locale === 'bg' ? 'въпроса' : locale === 'ru' ? 'вопросов' : locale === 'ro' ? 'intrebari' : locale === 'sr' ? 'pitanja' : 'questions';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{homeLabel}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{faqLabel}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {heading[locale] || heading.en}
      </h1>
      <p className="text-gray-500 mb-8">
        {subtitle[locale] || subtitle.en}
      </p>

      {/* FAQ Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FAQ_PAGES.map(faq => {
          const Icon = ICON_MAP[faq.icon] || Info;
          const colorClasses = COLOR_MAP[faq.color] || COLOR_MAP.blue;
          return (
            <Link
              key={faq.slug}
              href={`/faq/${faq.slug}`}
              className="group flex flex-col gap-3 p-5 bg-white border border-gray-200 rounded-2xl hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {faq.title[locale] || faq.title.en}
              </h2>
              <p className="text-sm text-gray-500">
                {faq.description[locale] || faq.description.en}
              </p>
              <span className="text-xs text-gray-400">
                {faq.faqs.length} {questionsLabel}
              </span>
            </Link>
          );
        })}
      </div>

      {/* JSON-LD for the index page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: heading[locale] || heading.en,
          description: subtitle[locale] || subtitle.en,
          hasPart: FAQ_PAGES.map(faq => ({
            '@type': 'WebPage',
            name: faq.title[locale] || faq.title.en,
            url: `${SITE_URL}/${locale}/faq/${faq.slug}`,
          })),
        })}}
      />
    </div>
  );
}
