import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { tr } from '../content';
import { MONASTERIES as MONASTERY_DATA } from '../monastery-data';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = tr('metaMonasteriesTitle', locale);
  const description = tr('metaMonasteriesDesc', locale);
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, 'mount-athos/monasteries'),
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/monasteries`])),
    },
  };
}

const MONASTERIES = [
  { rank: 1, el: 'Μεγίστης Λαύρας', en: 'Great Lavra', founded: 963, nation: 'el' },
  { rank: 2, el: 'Βατοπαιδίου', en: 'Vatopedi', founded: 972, nation: 'el' },
  { rank: 3, el: 'Ιβήρων', en: 'Iviron', founded: 976, nation: 'el' },
  { rank: 4, el: 'Χιλανδαρίου', en: 'Chilandariou', founded: 1198, nation: 'rs' },
  { rank: 5, el: 'Διονυσίου', en: 'Dionysiou', founded: 1375, nation: 'el' },
  { rank: 6, el: 'Κουτλουμουσίου', en: 'Koutloumousiou', founded: 1169, nation: 'el' },
  { rank: 7, el: 'Παντοκράτορος', en: 'Pantokratoros', founded: 1363, nation: 'el' },
  { rank: 8, el: 'Ξηροποτάμου', en: 'Xeropotamou', founded: 956, nation: 'el' },
  { rank: 9, el: 'Ζωγράφου', en: 'Zografou', founded: 971, nation: 'bg' },
  { rank: 10, el: 'Δοχειαρίου', en: 'Dochiariou', founded: 1045, nation: 'el' },
  { rank: 11, el: 'Καρακάλου', en: 'Karakalou', founded: 1070, nation: 'el' },
  { rank: 12, el: 'Φιλοθέου', en: 'Philotheou', founded: 992, nation: 'el' },
  { rank: 13, el: 'Σίμωνος Πέτρας', en: 'Simonos Petras', founded: 1257, nation: 'el' },
  { rank: 14, el: 'Αγίου Παύλου', en: 'Agiou Pavlou', founded: 934, nation: 'el' },
  { rank: 15, el: 'Σταυρονικήτα', en: 'Stavronikita', founded: 1541, nation: 'el' },
  { rank: 16, el: 'Ξενοφώντος', en: 'Xenofontos', founded: 998, nation: 'el' },
  { rank: 17, el: 'Γρηγορίου', en: 'Gregoriou', founded: 1345, nation: 'el' },
  { rank: 18, el: 'Εσφιγμένου', en: 'Esphigmenou', founded: 1001, nation: 'el' },
  { rank: 19, el: 'Αγίου Παντελεήμονος', en: 'Agiou Panteleimonos', founded: 1169, nation: 'ru' },
  { rank: 20, el: 'Κωνσταμονίτου', en: 'Konstamonitou', founded: 1080, nation: 'el' },
] as const;

function nationLabel(code: string, locale: string) {
  const map: Record<string, 'nationGreek' | 'nationSerbian' | 'nationBulgarian' | 'nationRussian'> = {
    el: 'nationGreek',
    rs: 'nationSerbian',
    bg: 'nationBulgarian',
    ru: 'nationRussian',
  };
  const key = map[code];
  return key ? tr(key, locale) : '';
}

/* ── Locale-keyed body content ── */
const content: Record<string, {
  heading: string;
  intro1: string;
  intro2: string;
  rankingTitle: string;
  colMonastery: string;
  colFounded: string;
  colNationality: string;
  otherTitle: string;
  otherIntro: string;
  sketes: string;
  sketesDesc: string;
  kellia: string;
  kelliaDesc: string;
  kalyves: string;
  kalyvesDesc: string;
  hesychasteria: string;
  hesychasteriaDesc: string;
}> = {
  el: {
    heading: 'Οι 20 Μονές του Αγίου Όρους',
    intro1: 'Στο Άγιο Όρος λειτουργούν <strong>ακριβώς 20 μοναστήρια</strong> — ούτε ένα περισσότερο, ούτε ένα λιγότερο. Ο αριθμός αυτός είναι κατοχυρωμένος στον Καταστατικό Χάρτη του Αγίου Όρους και δεν μπορεί να αυξηθεί ή να μειωθεί. Κάθε μοναστήρι κατέχει μια θέση στην ιεραρχία που καθορίστηκε αιώνες πριν.',
    intro2: 'Από τα 20 μοναστήρια, τα <strong>17 είναι ελληνικά</strong>, ένα είναι <strong>ρωσικό</strong> (Αγίου Παντελεήμονος), ένα <strong>σερβικό</strong> (Χιλανδαρίου) και ένα <strong>βουλγαρικό</strong> (Ζωγράφου). Όλα μαζί αποτελούν την Ιερά Κοινότητα, το κεντρικό διοικητικό σώμα της Αθωνικής Πολιτείας, με έδρα τις Καρυές.',
    rankingTitle: 'Πλήρης Κατάταξη',
    colMonastery: 'Μοναστήρι',
    colFounded: 'Ίδρυση',
    colNationality: 'Εθνικότητα',
    otherTitle: 'Άλλα Μοναστικά Ιδρύματα',
    otherIntro: 'Εκτός από τα 20 κυρίαρχα μοναστήρια, στο Άγιο Όρος υπάρχουν και πολλά άλλα μοναστικά ιδρύματα που υπάγονται στα μοναστήρια:',
    sketes: 'Σκήτες',
    sketesDesc: 'Μικρότερες μοναστικές κοινότητες που εξαρτώνται από κάποιο μοναστήρι. Υπάρχουν 12 σκήτες, ορισμένες με κοινοβιακή οργάνωση και δικό τους ναό.',
    kellia: 'Κελιά',
    kelliaDesc: 'Μεμονωμένα κτίσματα με παρεκκλήσι, όπου ζουν μικρές ομάδες μοναχών (συνήθως 2-6). Ανήκουν σε κάποιο μοναστήρι και παραχωρούνται εφ\' όρου ζωής.',
    kalyves: 'Καλύβες',
    kalyvesDesc: 'Απλούστερες κατοικίες μοναχών, συχνά χωρίς παρεκκλήσι. Συγκεντρώνονται σε ομάδες που σχηματίζουν σκήτες.',
    hesychasteria: 'Ησυχαστήρια',
    hesychasteriaDesc: 'Απομονωμένα καταφύγια για μοναχούς που αφιερώνονται αποκλειστικά στην προσευχή και την ησυχία. Βρίσκονται σε δυσπρόσιτα σημεία, ακόμη και σε σπηλιές.',
  },
  en: {
    heading: 'The 20 Monasteries of Mount Athos',
    intro1: 'Mount Athos is home to <strong>exactly 20 monasteries</strong> — no more, no less. This number is enshrined in the Constitutional Charter of Mount Athos and cannot be increased or decreased. Each monastery holds a position in the hierarchy that was determined centuries ago.',
    intro2: 'Of the 20 monasteries, <strong>17 are Greek</strong>, one is <strong>Russian</strong> (Agiou Panteleimonos), one is <strong>Serbian</strong> (Chilandariou), and one is <strong>Bulgarian</strong> (Zografou). Together they form the Holy Community, the central governing body of the Athonite State, headquartered in Karyes.',
    rankingTitle: 'Complete Ranking',
    colMonastery: 'Monastery',
    colFounded: 'Founded',
    colNationality: 'Nationality',
    otherTitle: 'Other Monastic Institutions',
    otherIntro: 'Besides the 20 sovereign monasteries, Mount Athos is home to many other monastic institutions that are dependent on the monasteries:',
    sketes: 'Sketes',
    sketesDesc: 'Smaller monastic communities dependent on a monastery. There are 12 sketes, some with a communal organization and their own church.',
    kellia: 'Kellia (Cells)',
    kelliaDesc: 'Individual buildings with a chapel where small groups of monks live (usually 2-6). They belong to a monastery and are granted for the lifetime of the monks.',
    kalyves: 'Kalyves (Huts)',
    kalyvesDesc: 'Simpler monk dwellings, often without a chapel. They are grouped together to form sketes.',
    hesychasteria: 'Hesychasteria (Hermitages)',
    hesychasteriaDesc: 'Isolated retreats for monks devoted exclusively to prayer and silence. They are found in remote locations, sometimes even in caves.',
  },
  de: {
    heading: 'Die 20 Klöster des Berg Athos',
    intro1: 'Auf dem Berg Athos befinden sich <strong>genau 20 Klöster</strong> — nicht mehr und nicht weniger. Diese Zahl ist in der Verfassungscharta des Berg Athos verankert und kann weder erhöht noch verringert werden. Jedes Kloster hat eine Position in der Hierarchie, die vor Jahrhunderten festgelegt wurde.',
    intro2: 'Von den 20 Klöstern sind <strong>17 griechisch</strong>, eines ist <strong>russisch</strong> (Agiou Panteleimonos), eines <strong>serbisch</strong> (Chilandariou) und eines <strong>bulgarisch</strong> (Zografou). Gemeinsam bilden sie die Heilige Gemeinschaft, das zentrale Verwaltungsorgan des Athos-Staates mit Sitz in Karyes.',
    rankingTitle: 'Vollständige Rangliste',
    colMonastery: 'Kloster',
    colFounded: 'Gegründet',
    colNationality: 'Nationalität',
    otherTitle: 'Weitere Klösterliche Einrichtungen',
    otherIntro: 'Neben den 20 souveränen Klöstern gibt es auf dem Berg Athos viele weitere klösterliche Einrichtungen, die von den Klöstern abhängig sind:',
    sketes: 'Skiten',
    sketesDesc: 'Kleinere Mönchsgemeinschaften, die von einem Kloster abhängig sind. Es gibt 12 Skiten, einige mit gemeinschaftlicher Organisation und eigener Kirche.',
    kellia: 'Kellia (Zellen)',
    kelliaDesc: 'Einzelne Gebäude mit einer Kapelle, in denen kleine Gruppen von Mönchen leben (normalerweise 2-6). Sie gehören einem Kloster und werden auf Lebenszeit vergeben.',
    kalyves: 'Kalyves (Hütten)',
    kalyvesDesc: 'Einfachere Mönchsunterkünfte, oft ohne Kapelle. Sie sind in Gruppen zusammengefasst, die Skiten bilden.',
    hesychasteria: 'Hesychasterien (Einsiedeleien)',
    hesychasteriaDesc: 'Abgelegene Rückzugsorte für Mönche, die sich ausschließlich dem Gebet und der Stille widmen. Sie befinden sich an schwer zugänglichen Orten, manchmal sogar in Höhlen.',
  },
  bg: {
    heading: '20-те манастира на Света гора',
    intro1: 'На Света гора функционират <strong>точно 20 манастира</strong> — нито един повече, нито един по-малко. Този брой е закрепен в Конституционната харта на Света гора и не може да бъде увеличен или намален. Всеки манастир заема позиция в йерархията, определена преди векове.',
    intro2: 'От 20-те манастира <strong>17 са гръцки</strong>, един е <strong>руски</strong> (Св. Пантелеймон), един е <strong>сръбски</strong> (Хилендар) и един е <strong>български</strong> (Зограф). Заедно те формират Свещената общност — централния административен орган на Атонската държава със седалище в Карие.',
    rankingTitle: 'Пълна класация',
    colMonastery: 'Манастир',
    colFounded: 'Основан',
    colNationality: 'Националност',
    otherTitle: 'Други монашески институции',
    otherIntro: 'Освен 20-те суверенни манастира, на Света гора има и много други монашески институции, зависими от манастирите:',
    sketes: 'Скитове',
    sketesDesc: 'По-малки монашески общности, зависими от даден манастир. Има 12 скита, някои с общежителна организация и собствен храм.',
    kellia: 'Килии',
    kelliaDesc: 'Отделни сгради с параклис, където живеят малки групи монаси (обикновено 2-6). Принадлежат на манастир и се предоставят за доживотно ползване.',
    kalyves: 'Колиби',
    kalyvesDesc: 'По-прости жилища за монаси, често без параклис. Групирани са заедно и формират скитове.',
    hesychasteria: 'Исихастирии (отшелничества)',
    hesychasteriaDesc: 'Изолирани убежища за монаси, посветени изключително на молитва и тишина. Намират се на труднодостъпни места, понякога дори в пещери.',
  },
  ru: {
    heading: '20 монастырей Святой Горы Афон',
    intro1: 'На Святой Горе Афон действуют <strong>ровно 20 монастырей</strong> — ни одним больше, ни одним меньше. Это число закреплено в Конституционной хартии Святой Горы и не может быть увеличено или уменьшено. Каждый монастырь занимает место в иерархии, определённое века назад.',
    intro2: 'Из 20 монастырей <strong>17 — греческие</strong>, один — <strong>русский</strong> (Св. Пантелеимона), один — <strong>сербский</strong> (Хиландар) и один — <strong>болгарский</strong> (Зограф). Вместе они образуют Священное Сообщество — центральный административный орган Афонского государства со штаб-квартирой в Карее.',
    rankingTitle: 'Полный рейтинг',
    colMonastery: 'Монастырь',
    colFounded: 'Основан',
    colNationality: 'Национальность',
    otherTitle: 'Другие монашеские учреждения',
    otherIntro: 'Помимо 20 суверенных монастырей, на Святой Горе существует множество других монашеских учреждений, зависимых от монастырей:',
    sketes: 'Скиты',
    sketesDesc: 'Небольшие монашеские общины, зависимые от монастыря. Существует 12 скитов, некоторые с общежительной организацией и собственным храмом.',
    kellia: 'Кельи',
    kelliaDesc: 'Отдельные строения с часовней, где живут небольшие группы монахов (обычно 2-6). Принадлежат монастырю и предоставляются пожизненно.',
    kalyves: 'Каливы (хижины)',
    kalyvesDesc: 'Более простые жилища монахов, часто без часовни. Группируются вместе, образуя скиты.',
    hesychasteria: 'Исихастирии (отшельничества)',
    hesychasteriaDesc: 'Уединённые убежища для монахов, посвящённых исключительно молитве и безмолвию. Располагаются в труднодоступных местах, иногда даже в пещерах.',
  },
  ro: {
    heading: 'Cele 20 de mănăstiri din Muntele Athos',
    intro1: 'Pe Muntele Athos funcționează <strong>exact 20 de mănăstiri</strong> — nici una mai mult, nici una mai puțin. Acest număr este consacrat în Carta Constituțională a Muntelui Athos și nu poate fi mărit sau micșorat. Fiecare mănăstire ocupă o poziție în ierarhie stabilită cu secole în urmă.',
    intro2: 'Din cele 20 de mănăstiri, <strong>17 sunt grecești</strong>, una este <strong>rusă</strong> (Agiou Panteleimonos), una este <strong>sârbă</strong> (Chilandariou) și una este <strong>bulgară</strong> (Zografou). Împreună formează Comunitatea Sfântă, organul central de conducere al Statului Athonit, cu sediul în Karyes.',
    rankingTitle: 'Clasamentul complet',
    colMonastery: 'Mănăstire',
    colFounded: 'Fondată',
    colNationality: 'Naționalitate',
    otherTitle: 'Alte instituții monastice',
    otherIntro: 'Pe lângă cele 20 de mănăstiri suverane, Muntele Athos găzduiește și multe alte instituții monastice dependente de mănăstiri:',
    sketes: 'Schituri',
    sketesDesc: 'Comunități monastice mai mici, dependente de o mănăstire. Există 12 schituri, unele cu organizare cenobită și biserică proprie.',
    kellia: 'Chilii',
    kelliaDesc: 'Clădiri individuale cu o capelă, unde trăiesc grupuri mici de călugări (de obicei 2-6). Aparțin unei mănăstiri și sunt acordate pe viață.',
    kalyves: 'Colibe',
    kalyvesDesc: 'Locuințe mai simple pentru călugări, adesea fără capelă. Sunt grupate împreună formând schituri.',
    hesychasteria: 'Isihasterii (pustnicii)',
    hesychasteriaDesc: 'Retrageri izolate pentru călugări dedicați exclusiv rugăciunii și tăcerii. Se găsesc în locații greu accesibile, uneori chiar în peșteri.',
  },
};

export default async function MonasteriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale] || content.en;

  return (
    <article>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-700">{tr('home', locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/mount-athos" className="hover:text-amber-700">{tr('mountAthos', locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{tr('navMonasteries', locale)}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {c.heading}
      </h1>

      {/* Intro */}
      <div className="prose prose-gray max-w-none mb-10">
        <p className="text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: c.intro1 }} />
        <p dangerouslySetInnerHTML={{ __html: c.intro2 }} />
      </div>

      {/* Monasteries table */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {c.rankingTitle}
      </h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-amber-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700 w-12">#</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                {c.colMonastery}
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                {c.colFounded}
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                {c.colNationality}
              </th>
            </tr>
          </thead>
          <tbody>
            {MONASTERY_DATA.map((m) => (
              <tr key={m.rank} className="border-t border-gray-100 hover:bg-amber-50/50 transition-colors">
                <td className="px-4 py-3 text-gray-500 font-medium">{m.rank}</td>
                <td className="px-4 py-3">
                  <Link href={`/mount-athos/monasteries/${m.slug}`} className="font-medium text-amber-800 hover:text-amber-600 hover:underline">
                    {m.name[locale] || m.name.el}
                  </Link>
                  <div className="text-xs text-gray-400 sm:hidden">
                    {m.founded} &middot; {nationLabel(m.nation, locale)}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{m.founded}</td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                  {m.nation !== 'el' ? (
                    <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                      {nationLabel(m.nation, locale)}
                    </span>
                  ) : (
                    nationLabel(m.nation, locale)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other monastic institutions */}
      <div className="prose prose-gray max-w-none mb-10">
        <h2>{c.otherTitle}</h2>
        <p>{c.otherIntro}</p>
        <ul>
          <li><strong>{c.sketes}:</strong> {c.sketesDesc}</li>
          <li><strong>{c.kellia}:</strong> {c.kelliaDesc}</li>
          <li><strong>{c.kalyves}:</strong> {c.kalyvesDesc}</li>
          <li><strong>{c.hesychasteria}:</strong> {c.hesychasteriaDesc}</li>
        </ul>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-10">
        <Link href="/mount-athos" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-amber-700 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {tr('mountAthos', locale)}
        </Link>
        <Link href="/mount-athos/how-to-visit" className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
          {tr('navHowToVisit', locale)}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: c.heading,
        description: tr('metaMonasteriesDesc', locale),
        numberOfItems: 20,
        itemListElement: MONASTERY_DATA.map(m => ({
          '@type': 'ListItem',
          position: m.rank,
          url: localeUrl(locale, `mount-athos/monasteries/${m.slug}`),
          item: {
            '@type': 'Place',
            name: m.name[locale] || m.name.el,
            foundingDate: String(m.founded),
          },
        })),
      })}} />
    </article>
  );
}
