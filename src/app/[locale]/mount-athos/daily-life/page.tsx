import { setRequestLocale } from 'next-intl/server';
import { publicLocales } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { tr } from '../content';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = publicLocales;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = tr('metaDailyLifeTitle', locale);
  const description = tr('metaDailyLifeDesc', locale);
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, 'mount-athos/daily-life'),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, 'mount-athos/daily-life')])),
        'x-default': localeUrl('el', 'mount-athos/daily-life'),
      },
    },
  };
}

/* ─── body content keyed by locale ─── */
const content: Record<string, {
  h1: string;
  intro: string;
  scheduleTitle: string;
  thTime: string;
  thActivity: string;
  schedule: { time: string; activity: string }[];
  visitorsTitle: string;
  visitors: string[];
  spiritualTitle: string;
  spiritualText: string;
  jsonHeadline: string;
  jsonDesc: string;
}> = {
  el: {
    h1: 'Καθημερινή Ζωή στο Άγιο Όρος',
    intro: 'Η ζωή στο Άγιο Όρος ακολουθεί έναν ρυθμό που παραμένει σχεδόν αναλλοίωτος εδώ και αιώνες. Βασίζεται σε τέσσερις πυλώνες: προσευχή, εργασία, υπακοή και ταπεινοφροσύνη. Κάθε μέρα ακολουθεί ένα αυστηρό πρόγραμμα που εναλλάσσει τη λατρεία με τη χειρωνακτική εργασία.',
    scheduleTitle: 'Ημερήσιο Πρόγραμμα Μοναχών',
    thTime: 'Ώρα',
    thActivity: 'Δραστηριότητα',
    schedule: [
      { time: '03:00', activity: 'Όρθρος (πρωινή ακολουθία)' },
      { time: '06:00', activity: 'Θεία Λειτουργία' },
      { time: '08:00', activity: 'Εργασία (διακονήματα)' },
      { time: '13:00', activity: 'Κοινό γεύμα στην τράπεζα' },
      { time: '14:00', activity: 'Απογευματινή εργασία ή προσευχή' },
      { time: '19:00', activity: 'Εσπερινός' },
    ],
    visitorsTitle: 'Τι Κάνει ο Επισκέπτης',
    visitors: [
      'Προσκύνηση εικόνων και ιερών λειψάνων',
      'Συζητήσεις με μοναχούς για πνευματικά θέματα',
      'Περπάτημα σε μονοπάτια μέσα στη φύση',
      'Παρακολούθηση ακολουθιών και λειτουργιών',
      'Βίωση της σιωπής και της ησυχίας της φύσης',
    ],
    spiritualTitle: 'Πνευματικό Ταξίδι',
    spiritualText: 'Για πολλούς επισκέπτες, η παραμονή στο Άγιο Όρος αποτελεί ένα βαθύ πνευματικό ταξίδι. Μακριά από τον θόρυβο και τις υποχρεώσεις της σύγχρονης ζωής, το Άγιο Όρος λειτουργεί ως ένα είδος αποτοξίνωσης από τον σύγχρονο κόσμο. Η απλότητα, η σιωπή και η ησυχαστική ατμόσφαιρα φέρνουν τον επισκέπτη σε επαφή με τον εαυτό του και το πνευματικό του βάθος.',
    jsonHeadline: 'Καθημερινή Ζωή στο Άγιο Όρος',
    jsonDesc: 'Πρόγραμμα μοναχών, τι κάνει ο επισκέπτης και η πνευματική εμπειρία στο Άγιο Όρος.',
  },
  en: {
    h1: 'Daily Life on Mount Athos',
    intro: 'Life on Mount Athos follows a rhythm that has remained virtually unchanged for centuries. It is built upon four pillars: prayer, work, obedience, and humility. Each day follows a strict schedule that alternates worship with manual labor.',
    scheduleTitle: "Monks' Daily Schedule",
    thTime: 'Time',
    thActivity: 'Activity',
    schedule: [
      { time: '03:00', activity: 'Orthros (morning service)' },
      { time: '06:00', activity: 'Divine Liturgy' },
      { time: '08:00', activity: 'Work (obediences)' },
      { time: '13:00', activity: 'Communal meal in the refectory' },
      { time: '14:00', activity: 'Afternoon work or prayer' },
      { time: '19:00', activity: 'Vespers' },
    ],
    visitorsTitle: 'What Visitors Do',
    visitors: [
      'Venerate holy icons and sacred relics',
      'Conversations with monks on spiritual topics',
      'Walking on paths through nature',
      'Attending services and liturgies',
      "Experiencing nature's silence and stillness",
    ],
    spiritualTitle: 'A Spiritual Journey',
    spiritualText: 'For many visitors, staying on Mount Athos is a profound spiritual journey. Far from the noise and obligations of modern life, Mount Athos serves as a kind of detox from the contemporary world. The simplicity, silence, and hesychastic atmosphere bring visitors into contact with themselves and their spiritual depth.',
    jsonHeadline: 'Daily Life on Mount Athos',
    jsonDesc: "Monks' schedule, what visitors do, and the spiritual experience on Mount Athos.",
  },
  de: {
    h1: 'Tägliches Leben auf dem Berg Athos',
    intro: 'Das Leben auf dem Berg Athos folgt einem Rhythmus, der seit Jahrhunderten nahezu unverändert geblieben ist. Es basiert auf vier Säulen: Gebet, Arbeit, Gehorsam und Demut. Jeder Tag folgt einem strengen Programm, das Gottesdienst mit körperlicher Arbeit abwechselt.',
    scheduleTitle: 'Täglicher Ablauf der Mönche',
    thTime: 'Zeit',
    thActivity: 'Aktivität',
    schedule: [
      { time: '03:00', activity: 'Orthros (Morgengottesdienst)' },
      { time: '06:00', activity: 'Göttliche Liturgie' },
      { time: '08:00', activity: 'Arbeit (Dienste)' },
      { time: '13:00', activity: 'Gemeinsames Essen im Refektorium' },
      { time: '14:00', activity: 'Nachmittagsarbeit oder Gebet' },
      { time: '19:00', activity: 'Vesper' },
    ],
    visitorsTitle: 'Was Besucher tun',
    visitors: [
      'Verehrung heiliger Ikonen und Reliquien',
      'Gespräche mit Mönchen über spirituelle Themen',
      'Wanderungen auf Pfaden durch die Natur',
      'Teilnahme an Gottesdiensten und Liturgien',
      'Erleben der Stille und Ruhe der Natur',
    ],
    spiritualTitle: 'Eine spirituelle Reise',
    spiritualText: 'Für viele Besucher ist der Aufenthalt auf dem Berg Athos eine tiefgreifende spirituelle Reise. Fern vom Lärm und den Verpflichtungen des modernen Lebens dient der Berg Athos als eine Art Entgiftung von der heutigen Welt. Die Einfachheit, Stille und hesychastische Atmosphäre bringen die Besucher in Kontakt mit sich selbst und ihrer spirituellen Tiefe.',
    jsonHeadline: 'Tägliches Leben auf dem Berg Athos',
    jsonDesc: 'Mönchsprogramm, was Besucher tun und die spirituelle Erfahrung auf dem Berg Athos.',
  },
  bg: {
    h1: 'Ежедневие на Света гора',
    intro: 'Животът на Света гора следва ритъм, който е останал почти непроменен от векове. Той е изграден върху четири стълба: молитва, труд, послушание и смирение. Всеки ден следва строг график, който редува богослужение с физически труд.',
    scheduleTitle: 'Дневна програма на монасите',
    thTime: 'Час',
    thActivity: 'Дейност',
    schedule: [
      { time: '03:00', activity: 'Утреня (сутрешна служба)' },
      { time: '06:00', activity: 'Божествена литургия' },
      { time: '08:00', activity: 'Работа (послушания)' },
      { time: '13:00', activity: 'Обща трапеза в трапезарията' },
      { time: '14:00', activity: 'Следобедна работа или молитва' },
      { time: '19:00', activity: 'Вечерня' },
    ],
    visitorsTitle: 'Какво правят посетителите',
    visitors: [
      'Поклонение пред свети икони и мощи',
      'Разговори с монаси на духовни теми',
      'Разходки по пътеки сред природата',
      'Участие в богослужения и литургии',
      'Преживяване на тишината и спокойствието на природата',
    ],
    spiritualTitle: 'Духовно пътуване',
    spiritualText: 'За много посетители престоят на Света гора е дълбоко духовно пътуване. Далеч от шума и задълженията на съвременния живот, Света гора служи като вид пречистване от модерния свят. Простотата, тишината и исихастката атмосфера свързват посетителите със самите тях и тяхната духовна дълбочина.',
    jsonHeadline: 'Ежедневие на Света гора',
    jsonDesc: 'Програма на монасите, какво правят посетителите и духовното преживяване на Света гора.',
  },
  ru: {
    h1: 'Повседневная жизнь на Святой Горе Афон',
    intro: 'Жизнь на Святой Горе Афон следует ритму, который остается практически неизменным на протяжении веков. Она строится на четырех столпах: молитва, труд, послушание и смирение. Каждый день подчинен строгому распорядку, чередующему богослужение с физическим трудом.',
    scheduleTitle: 'Ежедневное расписание монахов',
    thTime: 'Время',
    thActivity: 'Занятие',
    schedule: [
      { time: '03:00', activity: 'Утреня (утренняя служба)' },
      { time: '06:00', activity: 'Божественная литургия' },
      { time: '08:00', activity: 'Работа (послушания)' },
      { time: '13:00', activity: 'Общая трапеза в трапезной' },
      { time: '14:00', activity: 'Послеобеденная работа или молитва' },
      { time: '19:00', activity: 'Вечерня' },
    ],
    visitorsTitle: 'Чем занимаются посетители',
    visitors: [
      'Поклонение святым иконам и мощам',
      'Беседы с монахами на духовные темы',
      'Прогулки по тропам среди природы',
      'Участие в богослужениях и литургиях',
      'Переживание тишины и покоя природы',
    ],
    spiritualTitle: 'Духовное путешествие',
    spiritualText: 'Для многих посетителей пребывание на Святой Горе Афон становится глубоким духовным путешествием. Вдали от шума и обязательств современной жизни Святая Гора служит своеобразной детоксикацией от современного мира. Простота, тишина и исихастская атмосфера помогают посетителям соприкоснуться с самими собой и своей духовной глубиной.',
    jsonHeadline: 'Повседневная жизнь на Святой Горе Афон',
    jsonDesc: 'Расписание монахов, чем занимаются посетители и духовный опыт на Святой Горе Афон.',
  },
  ro: {
    h1: 'Viața zilnică pe Muntele Athos',
    intro: 'Viața pe Muntele Athos urmează un ritm care a rămas practic neschimbat de secole. Se bazează pe patru piloni: rugăciune, muncă, ascultare și smerenie. Fiecare zi urmează un program strict care alternează slujbele religioase cu munca fizică.',
    scheduleTitle: 'Programul zilnic al călugărilor',
    thTime: 'Ora',
    thActivity: 'Activitate',
    schedule: [
      { time: '03:00', activity: 'Utrenia (slujba de dimineață)' },
      { time: '06:00', activity: 'Sfânta Liturghie' },
      { time: '08:00', activity: 'Muncă (ascultări)' },
      { time: '13:00', activity: 'Masă comună în trapeză' },
      { time: '14:00', activity: 'Muncă după-amiază sau rugăciune' },
      { time: '19:00', activity: 'Vecernia' },
    ],
    visitorsTitle: 'Ce fac vizitatorii',
    visitors: [
      'Închinare la icoane sfinte și moaște sacre',
      'Conversații cu călugării pe teme spirituale',
      'Plimbări pe poteci prin natură',
      'Participarea la slujbe și liturghii',
      'Trăirea liniștii și tăcerii naturii',
    ],
    spiritualTitle: 'O călătorie spirituală',
    spiritualText: 'Pentru mulți vizitatori, șederea pe Muntele Athos este o călătorie spirituală profundă. Departe de zgomotul și obligațiile vieții moderne, Muntele Athos funcționează ca un fel de detoxifiere de lumea contemporană. Simplitatea, liniștea și atmosfera isihastă îi aduc pe vizitatori în contact cu ei înșiși și cu profunzimea lor spirituală.',
    jsonHeadline: 'Viața zilnică pe Muntele Athos',
    jsonDesc: 'Programul călugărilor, ce fac vizitatorii și experiența spirituală pe Muntele Athos.',
  },
};

export default async function DailyLifePage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{tr('navDailyLife', locale)}</span>
      </nav>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <h1>{c.h1}</h1>

        <p>{c.intro}</p>

        <h2>{c.scheduleTitle}</h2>

        <div className="not-prose overflow-hidden rounded-xl border border-gray-200 mb-8">
          <table className="w-full text-sm">
            <thead className="bg-amber-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">{c.thTime}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">{c.thActivity}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {c.schedule.map(row => (
                <tr key={row.time}><td className="px-4 py-3 font-medium text-amber-800">{row.time}</td><td className="px-4 py-3 text-gray-700">{row.activity}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>{c.visitorsTitle}</h2>

        <ul>
          {c.visitors.map(v => <li key={v}>{v}</li>)}
        </ul>

        <h2>{c.spiritualTitle}</h2>

        <p>{c.spiritualText}</p>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
        <Link href="/mount-athos/accommodation" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <ChevronLeft className="w-4 h-4" />
          <span>{tr('navAccommodation', locale)}</span>
        </Link>
        <Link href="/mount-athos/hiking" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <span>{tr('navHiking', locale)}</span>
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
        dateModified: '2026-04-20',
        publisher: { '@type': 'Organization', name: 'ChalkidikiHub', url: SITE_URL },
      })}} />
    </article>
  );
}
