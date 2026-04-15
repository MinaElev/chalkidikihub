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
  const title = tr('metaHikingTitle', locale);
  const description = tr('metaHikingDesc', locale);
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, 'mount-athos/hiking'),
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, 'mount-athos/hiking')])),
    },
  };
}

/* ─── body content keyed by locale ─── */
const content: Record<string, {
  h1: string;
  intro: string;
  facts: { label: string; value: string }[];
  routeTitle: string;
  routeText: string;
  tipsTitle: string;
  tips: string[];
  experienceTitle: string;
  experienceText: string;
  jsonHeadline: string;
  jsonDesc: string;
}> = {
  el: {
    h1: 'Ανάβαση στην Κορυφή του Άθω',
    intro: 'Η ανάβαση στην κορυφή του Άθω, στα 2.033 μέτρα, αποτελεί μία από τις πιο εντυπωσιακές πεζοπορίες στην Ελλάδα. Η θέα από την κορυφή εκτείνεται σε ολόκληρο το Αιγαίο, ενώ η εμπειρία συνδυάζει τη φυσική πρόκληση με τη βαθιά πνευματικότητα του τόπου.',
    facts: [
      { label: 'Υψόμετρο', value: '2.033 m' },
      { label: 'Διάρκεια', value: '6-8 ώρες' },
      { label: 'Δυσκολία', value: 'Υψηλή' },
      { label: 'Αφετηρία', value: 'Μ. Αγ. Παύλου' },
    ],
    routeTitle: 'Η Διαδρομή',
    routeText: 'Η πιο συνηθισμένη αφετηρία είναι η Μονή Αγίου Παύλου, η οποία βρίσκεται στη νοτιοδυτική πλευρά της χερσονήσου. Από εκεί, το μονοπάτι ανεβαίνει σταδιακά μέσα από πυκνά δάση καστανιάς και οξιάς, περνώντας από το εκκλησάκι της Παναγίας και τελικά φτάνει στην κορυφή, όπου βρίσκεται ο ναός της Μεταμορφώσεως του Σωτήρος.',
    tipsTitle: 'Συμβουλές & Τι να Περιμένετε',
    tips: [
      'Ξεκινήστε νωρίς το πρωί για να αποφύγετε τη ζέστη και να έχετε αρκετό φως',
      'Πάρτε αρκετό νερό (τουλάχιστον 2-3 λίτρα) και τροφή',
      'Φορέστε στιβαρά ορειβατικά παπούτσια',
      'Ο καιρός αλλάζει απότομα στην κορυφή — πάρτε αντιανεμικό',
      'Η κατάβαση είναι εξίσου απαιτητική — μην υποτιμάτε τον χρόνο',
      'Η θέα από την κορυφή είναι ανεπανάληπτη, ιδιαίτερα κατά την ανατολή του ηλίου',
    ],
    experienceTitle: 'Η Εμπειρία',
    experienceText: 'Η ανάβαση στον Άθω δεν είναι απλά μια πεζοπορία — είναι ένα προσκύνημα. Πολλοί πεζοπόροι περιγράφουν μια βαθιά αίσθηση γαλήνης καθώς πλησιάζουν στην κορυφή. Η σιωπή, η απομόνωση και η ιερότητα του τόπου δημιουργούν μια μοναδική εμπειρία που συνδυάζει τη σωματική δοκιμασία με την πνευματική ανύψωση.',
    jsonHeadline: 'Ανάβαση στην Κορυφή του Άθω',
    jsonDesc: 'Οδηγός ανάβασης στην κορυφή του Άθω στα 2.033 μέτρα.',
  },
  en: {
    h1: 'Climbing Mount Athos Peak',
    intro: 'The ascent to the peak of Mount Athos, at 2,033 meters, is one of the most impressive hikes in Greece. The view from the summit stretches across the entire Aegean Sea, while the experience combines physical challenge with the deep spirituality of the place.',
    facts: [
      { label: 'Altitude', value: '2,033 m' },
      { label: 'Duration', value: '6-8 hours' },
      { label: 'Difficulty', value: 'High' },
      { label: 'Starting point', value: 'Agios Pavlos Mon.' },
    ],
    routeTitle: 'The Route',
    routeText: 'The most common starting point is the Monastery of Agios Pavlos (Saint Paul), located on the southwestern side of the peninsula. From there, the path climbs gradually through dense chestnut and beech forests, passing the small chapel of the Virgin Mary, and ultimately reaches the summit where the Church of the Transfiguration of the Savior stands.',
    tipsTitle: 'Tips & What to Expect',
    tips: [
      'Start early in the morning to avoid the heat and ensure enough daylight',
      'Bring plenty of water (at least 2-3 liters) and food',
      'Wear sturdy hiking boots',
      'Weather changes rapidly at the summit - bring a windbreaker',
      'The descent is equally demanding - do not underestimate the time needed',
      'The view from the peak is breathtaking, especially at sunrise',
    ],
    experienceTitle: 'The Experience',
    experienceText: 'Climbing Athos is not merely a hike - it is a pilgrimage. Many hikers describe a profound sense of peace as they approach the summit. The silence, isolation, and sacredness of the place create a unique experience that combines physical challenge with spiritual elevation.',
    jsonHeadline: 'Climbing Mount Athos Peak',
    jsonDesc: 'Guide to climbing the peak of Mount Athos at 2,033 meters.',
  },
  de: {
    h1: 'Besteigung des Gipfels des Berg Athos',
    intro: 'Der Aufstieg zum Gipfel des Berg Athos auf 2.033 Metern ist eine der eindrucksvollsten Wanderungen in Griechenland. Die Aussicht vom Gipfel erstreckt sich über die gesamte Ägäis, während das Erlebnis körperliche Herausforderung mit der tiefen Spiritualität des Ortes verbindet.',
    facts: [
      { label: 'Höhe', value: '2.033 m' },
      { label: 'Dauer', value: '6-8 Stunden' },
      { label: 'Schwierigkeit', value: 'Hoch' },
      { label: 'Startpunkt', value: 'Kl. Agios Pavlos' },
    ],
    routeTitle: 'Die Route',
    routeText: 'Der häufigste Ausgangspunkt ist das Kloster Agios Pavlos (Sankt Paulus) an der südwestlichen Seite der Halbinsel. Von dort führt der Weg allmählich durch dichte Kastanien- und Buchenwälder, vorbei an der kleinen Kapelle der Jungfrau Maria, und erreicht schließlich den Gipfel, wo die Kirche der Verklärung des Erlösers steht.',
    tipsTitle: 'Tipps & Was Sie erwartet',
    tips: [
      'Starten Sie früh am Morgen, um die Hitze zu vermeiden und genügend Tageslicht zu haben',
      'Nehmen Sie ausreichend Wasser (mindestens 2-3 Liter) und Verpflegung mit',
      'Tragen Sie stabile Wanderschuhe',
      'Das Wetter ändert sich am Gipfel schnell — nehmen Sie eine Windjacke mit',
      'Der Abstieg ist ebenso anspruchsvoll — unterschätzen Sie die benötigte Zeit nicht',
      'Die Aussicht vom Gipfel ist atemberaubend, besonders bei Sonnenaufgang',
    ],
    experienceTitle: 'Das Erlebnis',
    experienceText: 'Die Besteigung des Athos ist nicht nur eine Wanderung — es ist eine Pilgerreise. Viele Wanderer beschreiben ein tiefes Gefühl des Friedens, wenn sie sich dem Gipfel nähern. Die Stille, Abgeschiedenheit und Heiligkeit des Ortes schaffen ein einzigartiges Erlebnis, das körperliche Herausforderung mit spiritueller Erhebung verbindet.',
    jsonHeadline: 'Besteigung des Gipfels des Berg Athos',
    jsonDesc: 'Wanderführer zur Besteigung des Berg Athos auf 2.033 Metern.',
  },
  bg: {
    h1: 'Изкачване на върха на Атос',
    intro: 'Изкачването до върха на Атос на 2033 метра е един от най-впечатляващите преходи в Гърция. Гледката от върха се простира над цялото Егейско море, а преживяването съчетава физическо предизвикателство с дълбоката духовност на мястото.',
    facts: [
      { label: 'Височина', value: '2033 m' },
      { label: 'Продължителност', value: '6-8 часа' },
      { label: 'Трудност', value: 'Висока' },
      { label: 'Начална точка', value: 'Ман. Агиос Павлос' },
    ],
    routeTitle: 'Маршрутът',
    routeText: 'Най-честата начална точка е манастирът Агиос Павлос (Свети Павел), разположен на югозападната страна на полуострова. Оттам пътеката се изкачва постепенно през гъсти кестенови и букови гори, минава покрай малката параклис на Дева Мария и накрая достига върха, където се намира храмът на Преображение Господне.',
    tipsTitle: 'Съвети и какво да очаквате',
    tips: [
      'Тръгнете рано сутринта, за да избегнете жегата и да имате достатъчно светлина',
      'Вземете достатъчно вода (поне 2-3 литра) и храна',
      'Носете здрави туристически обувки',
      'Времето се променя рязко на върха — вземете ветроустойчиво яке',
      'Слизането е също толкова трудно — не подценявайте нужното време',
      'Гледката от върха е незабравима, особено при изгрев',
    ],
    experienceTitle: 'Преживяването',
    experienceText: 'Изкачването на Атос не е просто поход — то е поклонничество. Много туристи описват дълбоко чувство на мир, когато се приближават до върха. Тишината, изолацията и свещеността на мястото създават уникално преживяване, което съчетава физическо изпитание с духовно извисяване.',
    jsonHeadline: 'Изкачване на върха на Атос',
    jsonDesc: 'Пътеводител за изкачване на върха на Атос на 2033 метра.',
  },
  ru: {
    h1: 'Восхождение на вершину Афон',
    intro: 'Восхождение на вершину Афон высотой 2033 метра является одним из самых впечатляющих пеших маршрутов в Греции. Вид с вершины простирается на всё Эгейское море, а само переживание сочетает физическое испытание с глубокой духовностью этого места.',
    facts: [
      { label: 'Высота', value: '2033 м' },
      { label: 'Длительность', value: '6-8 часов' },
      { label: 'Сложность', value: 'Высокая' },
      { label: 'Начальная точка', value: 'Мон. Агиос Павлос' },
    ],
    routeTitle: 'Маршрут',
    routeText: 'Наиболее распространённая начальная точка — монастырь Агиос Павлос (Святого Павла), расположенный на юго-западной стороне полуострова. Оттуда тропа постепенно поднимается через густые каштановые и буковые леса, минуя небольшую часовню Богородицы, и в конечном итоге достигает вершины, где стоит храм Преображения Господня.',
    tipsTitle: 'Советы и чего ожидать',
    tips: [
      'Выходите рано утром, чтобы избежать жары и иметь достаточно светового дня',
      'Возьмите достаточно воды (не менее 2-3 литров) и еды',
      'Наденьте крепкие треккинговые ботинки',
      'Погода на вершине меняется резко — возьмите ветровку',
      'Спуск столь же сложен — не недооценивайте необходимое время',
      'Вид с вершины потрясающий, особенно на рассвете',
    ],
    experienceTitle: 'Впечатления',
    experienceText: 'Восхождение на Афон — это не просто поход, это паломничество. Многие путешественники описывают глубокое чувство умиротворения по мере приближения к вершине. Тишина, уединённость и священность этого места создают уникальный опыт, сочетающий физическое испытание с духовным возвышением.',
    jsonHeadline: 'Восхождение на вершину Афон',
    jsonDesc: 'Путеводитель по восхождению на вершину Афон высотой 2033 метра.',
  },
  ro: {
    h1: 'Ascensiunea pe vârful Muntelui Athos',
    intro: 'Ascensiunea pe vârful Muntelui Athos, la 2.033 de metri, este una dintre cele mai impresionante drumeții din Grecia. Priveliștea de pe vârf se întinde peste întreaga Mare Egee, iar experiența combină provocarea fizică cu spiritualitatea profundă a locului.',
    facts: [
      { label: 'Altitudine', value: '2.033 m' },
      { label: 'Durată', value: '6-8 ore' },
      { label: 'Dificultate', value: 'Ridicată' },
      { label: 'Punct de plecare', value: 'Mân. Agios Pavlos' },
    ],
    routeTitle: 'Traseul',
    routeText: 'Cel mai frecvent punct de plecare este Mănăstirea Agios Pavlos (Sfântul Pavel), situată pe partea sud-vestică a peninsulei. De acolo, poteca urcă treptat prin păduri dese de castan și fag, trece pe lângă mica capelă a Maicii Domnului și ajunge în final pe vârf, unde se află Biserica Schimbării la Față a Mântuitorului.',
    tipsTitle: 'Sfaturi și la ce să vă așteptați',
    tips: [
      'Porniți devreme dimineața pentru a evita căldura și a avea suficientă lumină',
      'Luați suficientă apă (cel puțin 2-3 litri) și hrană',
      'Purtați bocanci de drumeție solizi',
      'Vremea se schimbă brusc la vârf — luați o jachetă antivânt',
      'Coborârea este la fel de solicitantă — nu subestimați timpul necesar',
      'Priveliștea de pe vârf este uluitoare, mai ales la răsărit',
    ],
    experienceTitle: 'Experiența',
    experienceText: 'Urcarea pe Athos nu este doar o drumeție — este un pelerinaj. Mulți drumeți descriu un profund sentiment de pace pe măsură ce se apropie de vârf. Liniștea, izolarea și sacralitatea locului creează o experiență unică, ce combină provocarea fizică cu înălțarea spirituală.',
    jsonHeadline: 'Ascensiunea pe vârful Muntelui Athos',
    jsonDesc: 'Ghid de urcare pe vârful Muntelui Athos la 2.033 de metri.',
  },
};

export default async function HikingPage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{tr('navHiking', locale)}</span>
      </nav>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <h1>{c.h1}</h1>

        <p>{c.intro}</p>

        {/* Quick facts */}
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          {c.facts.map(f => (
            <div key={f.label} className="bg-amber-50 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide">{f.label}</div>
              <div className="text-lg font-bold text-amber-900 mt-1">{f.value}</div>
            </div>
          ))}
        </div>

        <h2>{c.routeTitle}</h2>

        <p>{c.routeText}</p>

        <h2>{c.tipsTitle}</h2>

        <ul>
          {c.tips.map(tip => <li key={tip}>{tip}</li>)}
        </ul>

        <h2>{c.experienceTitle}</h2>

        <p>{c.experienceText}</p>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
        <Link href="/mount-athos/daily-life" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <ChevronLeft className="w-4 h-4" />
          <span>{tr('navDailyLife', locale)}</span>
        </Link>
        <Link href="/mount-athos/history" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <span>{tr('navHistory', locale)}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
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
