import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { tr } from '../content';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = tr('metaHistoryTitle', locale);
  const description = tr('metaHistoryDesc', locale);
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, 'mount-athos/history'),
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, 'mount-athos/history')])),
    },
  };
}

/* ─── body content keyed by locale ─── */
const content: Record<string, {
  h1: string;
  importanceTitle: string;
  importanceP1: string;
  importanceP2: string;
  mysteriesTitle: string;
  mysteries: { title: string; desc: string }[];
  monksTitle: string;
  monks: { name: string; desc: string }[];
  uniqueTitle: string;
  uniqueText: string;
  jsonHeadline: string;
  jsonDesc: string;
}> = {
  el: {
    h1: 'Ιστορία & Θρύλοι του Αγίου Όρους',
    importanceTitle: 'Γιατί το Άγιο Όρος Είναι Σημαντικό',
    importanceP1: 'Το Άγιο Όρος είναι το αρχαιότερο εν λειτουργία μοναστικό κέντρο στον κόσμο. Η μοναστική ζωή εδώ λειτουργεί αδιάλειπτα από τον 10ο αιώνα, κάνοντάς το ένα ζωντανό μνημείο της βυζαντινής παράδοσης. Τα μοναστήρια φυλάσσουν ανεκτίμητα χειρόγραφα, εικόνες και κειμήλια ηλικίας άνω των 1.000 ετών.',
    importanceP2: 'Ο πολιτιστικός πλούτος είναι τεράστιος: βιβλιοθήκες με σπάνια χειρόγραφα, βυζαντινές τοιχογραφίες, χρυσοκέντητα άμφια και λειτουργικά σκεύη που αντιπροσωπεύουν αιώνες τέχνης και πίστης.',
    mysteriesTitle: 'Μυστήρια & Θρύλοι',
    mysteries: [
      { title: 'Θαυματουργές εικόνες', desc: 'Πολλά μοναστήρια φυλάσσουν εικόνες στις οποίες αποδίδονται θαύματα, όπως η Παναγία η Τριχερούσα και η Παναγία η Πορταΐτισσα.' },
      { title: 'Ερημίτες σε σπηλιές', desc: 'Ακόμα και σήμερα, ασκητές ζουν σε απρόσιτες σπηλιές στους βράχους της χερσονήσου, ακολουθώντας την αρχαία παράδοση της ερημιτικής ζωής.' },
      { title: 'Θαύματα & Προφητείες', desc: 'Αναρίθμητες αφηγήσεις θαυμάτων και προφητειών συνδέονται με το Άγιο Όρος, τρέφοντας τον μύθο και τη μυστική του αύρα.' },
    ],
    monksTitle: 'Διάσημοι Μοναχοί',
    monks: [
      { name: 'Γέροντας Παΐσιος ο Αγιορείτης', desc: 'Ένας από τους πιο αγαπημένους γέροντες του 20ού αιώνα, γνωστός για τη σοφία, το χιούμορ και τα χαρίσματά του.' },
      { name: 'Γέροντας Ιωσήφ ο Ησυχαστής', desc: 'Μεγάλος ασκητής και δάσκαλος της νοεράς προσευχής, του οποίου η επιρροή διαμόρφωσε ολόκληρη γενιά μοναχών.' },
      { name: 'Άγιος Σιλουανός ο Αθωνίτης', desc: 'Ρώσος μοναχός που αγιοποιήθηκε, γνωστός για τα γραπτά του περί ταπείνωσης και αγάπης.' },
    ],
    uniqueTitle: 'Γιατί Είναι Μοναδικό',
    uniqueText: 'Το Άγιο Όρος λειτουργεί αδιάλειπτα από τον 10ο αιώνα, με δική του αυτοδιοίκηση, και παραμένει το πνευματικό κέντρο της Ορθοδοξίας. Εδώ συνεχίζεται η αυθεντική μοναστική ζωή όπως ακριβώς βιωνόταν στο Βυζάντιο. Για πολλούς ανθρώπους, αποτελεί έναν από τους πιο ιερούς τόπους στον πλανήτη.',
    jsonHeadline: 'Ιστορία & Θρύλοι του Αγίου Όρους',
    jsonDesc: 'Η ιστορία, οι θρύλοι και η σημασία του Αγίου Όρους.',
  },
  en: {
    h1: 'History & Legends of Mount Athos',
    importanceTitle: 'Why Mount Athos Matters',
    importanceP1: 'Mount Athos is the oldest continuously operating monastic center in the world. Monastic life here has continued uninterrupted since the 10th century, making it a living monument to Byzantine tradition. The monasteries safeguard priceless manuscripts, icons, and relics over 1,000 years old.',
    importanceP2: 'The cultural wealth is immense: libraries with rare manuscripts, Byzantine frescoes, gold-embroidered vestments, and liturgical vessels representing centuries of art and faith.',
    mysteriesTitle: 'Mysteries & Legends',
    mysteries: [
      { title: 'Miraculous icons', desc: 'Many monasteries house icons attributed with miracles, such as the Panagia Tricherousa and the Panagia Portaitissa.' },
      { title: 'Hermits in caves', desc: 'Even today, ascetics live in inaccessible caves on the cliffs of the peninsula, following the ancient tradition of hermitic life.' },
      { title: 'Miracles & Prophecies', desc: 'Countless accounts of miracles and prophecies are connected to Mount Athos, feeding its myth and mystical aura.' },
    ],
    monksTitle: 'Famous Monks',
    monks: [
      { name: 'Elder Paisios the Athonite', desc: 'One of the most beloved elders of the 20th century, known for his wisdom, humor, and spiritual gifts.' },
      { name: 'Elder Joseph the Hesychast', desc: 'A great ascetic and teacher of the prayer of the heart, whose influence shaped an entire generation of monks.' },
      { name: 'Saint Silouan the Athonite', desc: 'A Russian monk who was canonized, known for his writings on humility and love.' },
    ],
    uniqueTitle: 'Why It Is Unique',
    uniqueText: 'Mount Athos has operated continuously since the 10th century, with its own self-governance, and remains the spiritual center of Orthodoxy. Here, authentic monastic life continues exactly as it was experienced in Byzantium. For many people, it is one of the holiest places on the planet.',
    jsonHeadline: 'History & Legends of Mount Athos',
    jsonDesc: 'The history, legends, and significance of Mount Athos.',
  },
  de: {
    h1: 'Geschichte & Legenden des Berg Athos',
    importanceTitle: 'Warum der Berg Athos bedeutend ist',
    importanceP1: 'Der Berg Athos ist das älteste ununterbrochen betriebene Klosterzentrum der Welt. Das monastische Leben besteht hier seit dem 10. Jahrhundert ohne Unterbrechung und macht ihn zu einem lebendigen Denkmal der byzantinischen Tradition. Die Klöster bewahren unbezahlbare Handschriften, Ikonen und Reliquien, die über 1.000 Jahre alt sind.',
    importanceP2: 'Der kulturelle Reichtum ist immens: Bibliotheken mit seltenen Handschriften, byzantinische Fresken, goldbestickte Gewänder und liturgische Gefäße, die Jahrhunderte von Kunst und Glauben repräsentieren.',
    mysteriesTitle: 'Geheimnisse & Legenden',
    mysteries: [
      { title: 'Wundertätige Ikonen', desc: 'Viele Klöster beherbergen Ikonen, denen Wunder zugeschrieben werden, wie die Panagia Tricherousa und die Panagia Portaitissa.' },
      { title: 'Einsiedler in Höhlen', desc: 'Noch heute leben Asketen in unzugänglichen Höhlen an den Klippen der Halbinsel und folgen der alten Tradition des Einsiedlerlebens.' },
      { title: 'Wunder & Prophezeiungen', desc: 'Unzählige Berichte über Wunder und Prophezeiungen sind mit dem Berg Athos verbunden und nähren seinen Mythos und seine mystische Aura.' },
    ],
    monksTitle: 'Berühmte Mönche',
    monks: [
      { name: 'Starez Paisios der Athonit', desc: 'Einer der beliebtesten Ältesten des 20. Jahrhunderts, bekannt für seine Weisheit, seinen Humor und seine geistlichen Gaben.' },
      { name: 'Starez Joseph der Hesychast', desc: 'Ein großer Asket und Lehrer des Herzensgebets, dessen Einfluss eine ganze Generation von Mönchen prägte.' },
      { name: 'Heiliger Siluan der Athonit', desc: 'Ein russischer Mönch, der heiliggesprochen wurde und für seine Schriften über Demut und Liebe bekannt ist.' },
    ],
    uniqueTitle: 'Warum er einzigartig ist',
    uniqueText: 'Der Berg Athos ist seit dem 10. Jahrhundert ununterbrochen in Betrieb, verfügt über eine eigene Selbstverwaltung und bleibt das spirituelle Zentrum der Orthodoxie. Hier wird das authentische monastische Leben genau so fortgeführt, wie es in Byzanz gelebt wurde. Für viele Menschen ist er einer der heiligsten Orte der Welt.',
    jsonHeadline: 'Geschichte & Legenden des Berg Athos',
    jsonDesc: 'Die Geschichte, Legenden und Bedeutung des Berg Athos.',
  },
  bg: {
    h1: 'История и легенди на Света гора',
    importanceTitle: 'Защо Света гора е важна',
    importanceP1: 'Света гора е най-старият непрекъснато действащ монашески център в света. Монашеският живот тук продължава без прекъсване от X век, което я превръща в жив паметник на византийската традиция. Манастирите пазят безценни ръкописи, икони и реликви на над 1000 години.',
    importanceP2: 'Културното богатство е огромно: библиотеки с редки ръкописи, византийски стенописи, златошити одежди и литургични съдове, представляващи векове на изкуство и вяра.',
    mysteriesTitle: 'Тайни и легенди',
    mysteries: [
      { title: 'Чудотворни икони', desc: 'Много манастири съхраняват икони, на които се приписват чудеса, като Света Богородица Троеручица и Света Богородица Портаитиса.' },
      { title: 'Отшелници в пещери', desc: 'Дори и днес аскети живеят в недостъпни пещери по скалите на полуострова, следвайки древната традиция на отшелническия живот.' },
      { title: 'Чудеса и пророчества', desc: 'Безброй разкази за чудеса и пророчества са свързани със Света гора, подхранвайки нейния мит и мистична аура.' },
    ],
    monksTitle: 'Известни монаси',
    monks: [
      { name: 'Старец Паисий Светогорец', desc: 'Един от най-обичаните старци на XX век, известен с мъдростта, хумора и духовните си дарби.' },
      { name: 'Старец Йосиф Исихаст', desc: 'Велик аскет и учител на умната молитва, чието влияние оформи цяло поколение монаси.' },
      { name: 'Свети Силуан Атонски', desc: 'Руски монах, канонизиран за светец, известен с писанията си за смирение и любов.' },
    ],
    uniqueTitle: 'Защо е уникална',
    uniqueText: 'Света гора действа непрекъснато от X век, с собствено самоуправление, и остава духовният център на Православието. Тук автентичният монашески живот продължава точно както се е преживявал във Византия. За много хора тя е едно от най-свещените места на планетата.',
    jsonHeadline: 'История и легенди на Света гора',
    jsonDesc: 'Историята, легендите и значението на Света гора.',
  },
  ru: {
    h1: 'История и легенды Святой Горы Афон',
    importanceTitle: 'Почему Святая Гора Афон важна',
    importanceP1: 'Святая Гора Афон — старейший непрерывно действующий монашеский центр в мире. Монашеская жизнь здесь продолжается без перерыва с X века, что делает его живым памятником византийской традиции. Монастыри хранят бесценные рукописи, иконы и реликвии возрастом более 1000 лет.',
    importanceP2: 'Культурное богатство огромно: библиотеки с редкими рукописями, византийские фрески, золотошвейные облачения и литургические сосуды, представляющие века искусства и веры.',
    mysteriesTitle: 'Тайны и легенды',
    mysteries: [
      { title: 'Чудотворные иконы', desc: 'Многие монастыри хранят иконы, которым приписываются чудеса, такие как Богородица Троеручица и Богородица Портаитисса.' },
      { title: 'Отшельники в пещерах', desc: 'Даже сегодня аскеты живут в труднодоступных пещерах на скалах полуострова, следуя древней традиции отшельнической жизни.' },
      { title: 'Чудеса и пророчества', desc: 'Бесчисленные рассказы о чудесах и пророчествах связаны со Святой Горой Афон, питая её мифы и мистическую ауру.' },
    ],
    monksTitle: 'Знаменитые монахи',
    monks: [
      { name: 'Старец Паисий Святогорец', desc: 'Один из самых любимых старцев XX века, известный своей мудростью, юмором и духовными дарами.' },
      { name: 'Старец Иосиф Исихаст', desc: 'Великий аскет и учитель умной молитвы, влияние которого сформировало целое поколение монахов.' },
      { name: 'Святой Силуан Афонский', desc: 'Русский монах, канонизированный как святой, известный своими писаниями о смирении и любви.' },
    ],
    uniqueTitle: 'Почему она уникальна',
    uniqueText: 'Святая Гора Афон непрерывно действует с X века, обладает собственным самоуправлением и остаётся духовным центром Православия. Здесь продолжается подлинная монашеская жизнь точно так, как она переживалась в Византии. Для многих людей это одно из самых священных мест на планете.',
    jsonHeadline: 'История и легенды Святой Горы Афон',
    jsonDesc: 'История, легенды и значение Святой Горы Афон.',
  },
  ro: {
    h1: 'Istorie și legende ale Muntelui Athos',
    importanceTitle: 'De ce contează Muntele Athos',
    importanceP1: 'Muntele Athos este cel mai vechi centru monastic în funcțiune continuă din lume. Viața monahală aici a continuat neîntrerupt din secolul al X-lea, făcându-l un monument viu al tradiției bizantine. Mănăstirile păzesc manuscrise, icoane și relicve neprețuite, cu o vechime de peste 1.000 de ani.',
    importanceP2: 'Bogăția culturală este imensă: biblioteci cu manuscrise rare, fresce bizantine, veșminte brodate cu aur și vase liturgice care reprezintă secole de artă și credință.',
    mysteriesTitle: 'Mistere și legende',
    mysteries: [
      { title: 'Icoane miraculoase', desc: 'Multe mănăstiri adăpostesc icoane cărora li se atribuie minuni, precum Panagia Tricherousa și Panagia Portaitissa.' },
      { title: 'Pustnici în peșteri', desc: 'Chiar și astăzi, asceți trăiesc în peșteri inaccesibile pe stâncile peninsulei, urmând tradiția străveche a vieții de pustnic.' },
      { title: 'Minuni și profeții', desc: 'Nenumărate relatări despre minuni și profeții sunt legate de Muntele Athos, alimentându-i mitul și aura mistică.' },
    ],
    monksTitle: 'Călugări celebri',
    monks: [
      { name: 'Stareț Paisie Aghioritul', desc: 'Unul dintre cei mai iubiți stareți ai secolului XX, cunoscut pentru înțelepciunea, umorul și darurile sale spirituale.' },
      { name: 'Stareț Iosif Isihastul', desc: 'Un mare ascet și învățător al rugăciunii inimii, a cărui influență a modelat o întreagă generație de călugări.' },
      { name: 'Sfântul Siluan Athonitul', desc: 'Un călugăr rus care a fost canonizat, cunoscut pentru scrierile sale despre smerenie și iubire.' },
    ],
    uniqueTitle: 'De ce este unic',
    uniqueText: 'Muntele Athos funcționează continuu din secolul al X-lea, cu propria autoguvernare, și rămâne centrul spiritual al Ortodoxiei. Aici, viața monahală autentică continuă exact așa cum era trăită în Bizanț. Pentru mulți oameni, este unul dintre cele mai sfinte locuri de pe planetă.',
    jsonHeadline: 'Istorie și legende ale Muntelui Athos',
    jsonDesc: 'Istoria, legendele și semnificația Muntelui Athos.',
  },
};

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale] || content.el;

  return (
    <article>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-700">{tr('home', locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/mount-athos" className="hover:text-amber-700">{tr('mountAthos', locale)}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{tr('navHistory', locale)}</span>
      </nav>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <h1>{c.h1}</h1>

        <h2>{c.importanceTitle}</h2>

        <p>{c.importanceP1}</p>

        <p>{c.importanceP2}</p>

        <h2>{c.mysteriesTitle}</h2>

        <ul>
          {c.mysteries.map(m => (
            <li key={m.title}>
              <strong>{m.title}</strong> —{' '}{m.desc}
            </li>
          ))}
        </ul>

        <h2>{c.monksTitle}</h2>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          {c.monks.map(m => (
            <div key={m.name} className="bg-amber-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm">{m.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{m.desc}</p>
            </div>
          ))}
        </div>

        <h2>{c.uniqueTitle}</h2>

        <p>{c.uniqueText}</p>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
        <Link href="/mount-athos/hiking" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <ChevronLeft className="w-4 h-4" />
          <span>{tr('navHiking', locale)}</span>
        </Link>
        <div />
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: c.jsonHeadline,
        description: c.jsonDesc,
        author: { '@type': 'Organization', name: 'ChalkidikiHub' },
        datePublished: '2025-06-01',
        publisher: { '@type': 'Organization', name: 'ChalkidikiHub', url: SITE_URL },
      })}} />
    </article>
  );
}
