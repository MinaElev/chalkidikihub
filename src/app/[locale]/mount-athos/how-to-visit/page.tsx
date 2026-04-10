import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { tr } from '../content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = tr('metaHowToVisitTitle', locale);
  const description = tr('metaHowToVisitDesc', locale);
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/how-to-visit`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/how-to-visit`])),
    },
  };
}

/* ── Locale-keyed body content ── */
const content: Record<string, {
  heading: string;
  intro: string;
  whoTitle: string;
  whoText: string;
  avatonTitle: string;
  avatonText: string;
  permitTitle: string;
  permitText: string;
  permitOrthodox: string;
  permitNonOrthodox: string;
  permitDuration: string;
  permitCost: string;
  accessTitle: string;
  accessText: string;
  accessFerryDeparts: string;
  accessJourneyTime: string;
  accessStops: string;
  bringTitle: string;
  bringId: string;
  bringClothing: string;
  bringShoes: string;
  bringSupplies: string;
  bringFlashlight: string;
  noteTitle: string;
  noteText: string;
  faqWho: string;
  faqWhoAnswer: string;
  faqPermit: string;
  faqPermitAnswer: string;
  faqVisitors: string;
  faqVisitorsAnswer: string;
}> = {
  el: {
    heading: 'Πώς να Επισκεφθείτε το Άγιο Όρος',
    intro: 'Η επίσκεψη στο Άγιο Όρος δεν είναι σαν κάθε άλλο ταξίδι. Απαιτεί <strong>προγραμματισμό εβδομάδων</strong>, ειδική άδεια εισόδου και τήρηση αυστηρών κανόνων που ισχύουν εδώ και αιώνες.',
    whoTitle: 'Ποιος Μπορεί να Επισκεφθεί',
    whoText: 'Η είσοδος στο Άγιο Όρος επιτρέπεται <strong>αποκλειστικά σε άνδρες</strong> που έχουν συμπληρώσει το <strong>18ο έτος</strong> της ηλικίας τους. Δεν υπάρχει εξαίρεση σε αυτόν τον κανόνα — ισχύει ανεξαρτήτως θρησκεύματος ή εθνικότητας.',
    avatonTitle: 'Το Άβατον',
    avatonText: 'Το <strong>Άβατον</strong> είναι η απαγόρευση εισόδου γυναικών στο Άγιο Όρος. Ισχύει εδώ και περίπου <strong>1.000 χρόνια</strong> (από τον 10ο-11ο αιώνα) και είναι κατοχυρωμένο τόσο στον Καταστατικό Χάρτη του Αγίου Όρους όσο και στο ελληνικό Σύνταγμα. Η παραβίαση του Αβάτου αποτελεί ποινικό αδίκημα.',
    permitTitle: 'Διαμονητήριο (Άδεια Εισόδου)',
    permitText: 'Για να εισέλθει κανείς στο Άγιο Όρος χρειάζεται ειδική άδεια που ονομάζεται <strong>Διαμονητήριο</strong>. Η κράτηση γίνεται μέσω του <strong>Γραφείου Προσκυνητών του Αγίου Όρους</strong> στη Θεσσαλονίκη ή ηλεκτρονικά. Συνιστάται να κάνετε κράτηση <strong>τουλάχιστον 2-4 εβδομάδες νωρίτερα</strong>, ειδικά τους καλοκαιρινούς μήνες και τις περιόδους μεγάλων εορτών.',
    permitOrthodox: '<strong>Ορθόδοξοι Χριστιανοί:</strong> Έως 100 επισκέπτες ημερησίως',
    permitNonOrthodox: '<strong>Μη Ορθόδοξοι:</strong> Έως 10 επισκέπτες ημερησίως',
    permitDuration: '<strong>Διάρκεια:</strong> Το τυπικό διαμονητήριο ισχύει για 4 ημέρες και 3 διανυκτερεύσεις',
    permitCost: '<strong>Κόστος:</strong> Περίπου 25 ευρώ (εκδίδεται στην Ουρανούπολη)',
    accessTitle: 'Πρόσβαση: Ουρανούπολη - Δάφνη',
    accessText: 'Η είσοδος στο Άγιο Όρος γίνεται <strong>αποκλειστικά δια θαλάσσης</strong>. Το σημείο αναχώρησης είναι η <strong>Ουρανούπολη</strong>, ένα μικρό παραθαλάσσιο χωριό στο τέλος του οδικού δικτύου της Χαλκιδικής. Από εκεί αναχωρεί το πλοίο (φέρι) προς τη <strong>Δάφνη</strong>, το μοναδικό λιμάνι εισόδου.',
    accessFerryDeparts: 'Το πλοίο αναχωρεί κάθε πρωί (συνήθως στις 9:45)',
    accessJourneyTime: 'Η διαδρομή διαρκεί περίπου 2 ώρες',
    accessStops: 'Κατά τη διαδρομή, το πλοίο κάνει στάσεις σε διάφορα μοναστήρια κατά μήκος της ακτογραμμής',
    bringTitle: 'Τι να Πάρετε Μαζί σας',
    bringId: 'Ταυτότητα ή διαβατήριο',
    bringClothing: 'Άνετα ρούχα — απαγορεύονται τα κοντά παντελόνια και τα αμάνικα',
    bringShoes: 'Καλά παπούτσια πεζοπορίας',
    bringSupplies: 'Νερό, βασικά τρόφιμα, φαρμακείο πρώτων βοηθειών',
    bringFlashlight: 'Φακός — πολλά μοναστήρια δεν έχουν πλήρη φωτισμό',
    noteTitle: 'Σημαντική Σημείωση',
    noteText: 'Το Άγιο Όρος είναι τόπος λατρείας και προσευχής. Οι επισκέπτες καλούνται να σέβονται την ησυχία, τους κανόνες των μοναστηριών και τον μοναστικό τρόπο ζωής. Η φωτογράφιση και η βιντεοσκόπηση επιτρέπονται μόνο σε εξωτερικούς χώρους, εκτός αν δοθεί ρητή άδεια.',
    faqWho: 'Ποιος μπορεί να επισκεφθεί το Άγιο Όρος;',
    faqWhoAnswer: 'Μόνο άνδρες άνω των 18 ετών μπορούν να εισέλθουν στο Άγιο Όρος.',
    faqPermit: 'Πώς εκδίδεται το διαμονητήριο;',
    faqPermitAnswer: 'Μέσω του Γραφείου Προσκυνητών Αγίου Όρους στη Θεσσαλονίκη ή ηλεκτρονικά, τουλάχιστον 2-4 εβδομάδες νωρίτερα.',
    faqVisitors: 'Πόσοι επισκέπτες επιτρέπονται ημερησίως;',
    faqVisitorsAnswer: '100 Ορθόδοξοι Χριστιανοί και 10 μη Ορθόδοξοι ημερησίως.',
  },
  en: {
    heading: 'How to Visit Mount Athos',
    intro: 'Visiting Mount Athos is not like any other trip. It requires <strong>weeks of planning</strong>, a special entry permit, and strict observance of rules that have been in place for centuries.',
    whoTitle: 'Who Can Visit',
    whoText: 'Entry to Mount Athos is permitted <strong>exclusively to men</strong> who are at least <strong>18 years old</strong>. There are no exceptions to this rule — it applies regardless of religion or nationality.',
    avatonTitle: 'The Avaton',
    avatonText: 'The <strong>Avaton</strong> is the prohibition of women from entering Mount Athos. It has been in effect for approximately <strong>1,000 years</strong> (since the 10th-11th century) and is enshrined in both the Constitutional Charter of Mount Athos and the Greek Constitution. Violating the Avaton is a criminal offense.',
    permitTitle: 'Diamonitirion (Entry Permit)',
    permitText: 'To enter Mount Athos, you need a special permit called the <strong>Diamonitirion</strong>. Reservations are made through the <strong>Mount Athos Pilgrims\' Bureau</strong> in Thessaloniki or online. It is recommended to book <strong>at least 2-4 weeks in advance</strong>, especially during summer months and major feast days.',
    permitOrthodox: '<strong>Orthodox Christians:</strong> Up to 100 visitors per day',
    permitNonOrthodox: '<strong>Non-Orthodox:</strong> Up to 10 visitors per day',
    permitDuration: '<strong>Duration:</strong> The standard permit is valid for 4 days and 3 nights',
    permitCost: '<strong>Cost:</strong> Approximately 25 euros (issued in Ouranoupoli)',
    accessTitle: 'Access: Ouranoupoli to Dafni',
    accessText: 'Entry to Mount Athos is <strong>exclusively by sea</strong>. The departure point is <strong>Ouranoupoli</strong>, a small seaside village at the end of Halkidiki\'s road network. From there, a ferry departs to <strong>Dafni</strong>, the sole entry port.',
    accessFerryDeparts: 'The ferry departs every morning (usually at 9:45 AM)',
    accessJourneyTime: 'The journey takes approximately 2 hours',
    accessStops: 'Along the way, the ferry stops at various monasteries along the coastline',
    bringTitle: 'What to Bring',
    bringId: 'ID card or passport',
    bringClothing: 'Comfortable clothing — shorts and sleeveless tops are prohibited',
    bringShoes: 'Good hiking shoes',
    bringSupplies: 'Water, basic food supplies, first-aid kit',
    bringFlashlight: 'Flashlight — many monasteries do not have full lighting',
    noteTitle: 'Important Note',
    noteText: 'Mount Athos is a place of worship and prayer. Visitors are expected to respect the silence, monastery rules, and the monastic way of life. Photography and video recording are only allowed in exterior areas unless explicit permission is given.',
    faqWho: 'Who can visit Mount Athos?',
    faqWhoAnswer: 'Only men aged 18 and over can enter Mount Athos.',
    faqPermit: 'How do I get a Diamonitirion?',
    faqPermitAnswer: 'Through the Mount Athos Pilgrims\' Bureau in Thessaloniki or online, at least 2-4 weeks in advance.',
    faqVisitors: 'How many visitors are allowed per day?',
    faqVisitorsAnswer: '100 Orthodox Christians and 10 non-Orthodox visitors per day.',
  },
  de: {
    heading: 'Wie man den Berg Athos besucht',
    intro: 'Ein Besuch des Berg Athos ist nicht wie jede andere Reise. Er erfordert <strong>wochenlange Planung</strong>, eine spezielle Einreisegenehmigung und die strikte Einhaltung von Regeln, die seit Jahrhunderten gelten.',
    whoTitle: 'Wer darf besuchen',
    whoText: 'Der Zutritt zum Berg Athos ist <strong>ausschließlich Männern</strong> gestattet, die mindestens <strong>18 Jahre alt</strong> sind. Es gibt keine Ausnahmen von dieser Regel — sie gilt unabhängig von Religion oder Nationalität.',
    avatonTitle: 'Das Avaton',
    avatonText: 'Das <strong>Avaton</strong> ist das Verbot für Frauen, den Berg Athos zu betreten. Es ist seit etwa <strong>1.000 Jahren</strong> in Kraft (seit dem 10.-11. Jahrhundert) und ist sowohl in der Verfassungscharta des Berg Athos als auch in der griechischen Verfassung verankert. Ein Verstoß gegen das Avaton ist eine Straftat.',
    permitTitle: 'Diamonitirion (Einreisegenehmigung)',
    permitText: 'Um den Berg Athos zu betreten, benötigen Sie eine spezielle Genehmigung namens <strong>Diamonitirion</strong>. Reservierungen erfolgen über das <strong>Pilgerbüro des Berg Athos</strong> in Thessaloniki oder online. Es wird empfohlen, <strong>mindestens 2-4 Wochen im Voraus</strong> zu buchen, insbesondere in den Sommermonaten und an großen Feiertagen.',
    permitOrthodox: '<strong>Orthodoxe Christen:</strong> Bis zu 100 Besucher pro Tag',
    permitNonOrthodox: '<strong>Nicht-Orthodoxe:</strong> Bis zu 10 Besucher pro Tag',
    permitDuration: '<strong>Dauer:</strong> Die Standardgenehmigung gilt für 4 Tage und 3 Nächte',
    permitCost: '<strong>Kosten:</strong> Etwa 25 Euro (ausgestellt in Ouranoupoli)',
    accessTitle: 'Zugang: Ouranoupoli nach Dafni',
    accessText: 'Die Einreise zum Berg Athos erfolgt <strong>ausschließlich auf dem Seeweg</strong>. Der Abfahrtsort ist <strong>Ouranoupoli</strong>, ein kleines Küstendorf am Ende des Straßennetzes von Chalkidiki. Von dort fährt eine Fähre nach <strong>Dafni</strong>, dem einzigen Einreisehafen.',
    accessFerryDeparts: 'Die Fähre fährt jeden Morgen ab (normalerweise um 9:45 Uhr)',
    accessJourneyTime: 'Die Fahrt dauert etwa 2 Stunden',
    accessStops: 'Unterwegs hält die Fähre an verschiedenen Klöstern entlang der Küste',
    bringTitle: 'Was Sie mitbringen sollten',
    bringId: 'Personalausweis oder Reisepass',
    bringClothing: 'Bequeme Kleidung — kurze Hosen und ärmellose Oberteile sind verboten',
    bringShoes: 'Gute Wanderschuhe',
    bringSupplies: 'Wasser, grundlegende Lebensmittel, Erste-Hilfe-Set',
    bringFlashlight: 'Taschenlampe — viele Klöster haben keine vollständige Beleuchtung',
    noteTitle: 'Wichtiger Hinweis',
    noteText: 'Der Berg Athos ist ein Ort der Anbetung und des Gebets. Besucher werden gebeten, die Stille, die Klosterregeln und die monastische Lebensweise zu respektieren. Fotografieren und Videoaufnahmen sind nur in Außenbereichen erlaubt, sofern keine ausdrückliche Genehmigung erteilt wird.',
    faqWho: 'Wer darf den Berg Athos besuchen?',
    faqWhoAnswer: 'Nur Männer ab 18 Jahren dürfen den Berg Athos betreten.',
    faqPermit: 'Wie bekomme ich ein Diamonitirion?',
    faqPermitAnswer: 'Über das Pilgerbüro des Berg Athos in Thessaloniki oder online, mindestens 2-4 Wochen im Voraus.',
    faqVisitors: 'Wie viele Besucher sind pro Tag erlaubt?',
    faqVisitorsAnswer: '100 orthodoxe Christen und 10 nicht-orthodoxe Besucher pro Tag.',
  },
  bg: {
    heading: 'Как да посетите Света гора',
    intro: 'Посещението на Света гора не е като всяко друго пътуване. То изисква <strong>седмици на планиране</strong>, специално разрешително за влизане и стриктно спазване на правила, които са в сила от векове.',
    whoTitle: 'Кой може да посети',
    whoText: 'Влизането в Света гора е разрешено <strong>изключително за мъже</strong>, навършили <strong>18 години</strong>. Няма изключения от това правило — то важи независимо от религия или националност.',
    avatonTitle: 'Аватонът',
    avatonText: '<strong>Аватонът</strong> е забраната за влизане на жени в Света гора. Той е в сила от приблизително <strong>1000 години</strong> (от 10-11 век) и е закрепен както в Конституционната харта на Света гора, така и в гръцката конституция. Нарушаването на Аватона е наказуемо деяние.',
    permitTitle: 'Диамонитирион (разрешително за влизане)',
    permitText: 'За да влезете в Света гора, имате нужда от специално разрешително, наречено <strong>Диамонитирион</strong>. Резервациите се правят чрез <strong>Бюрото за поклонници на Света гора</strong> в Солун или онлайн. Препоръчително е да резервирате <strong>поне 2-4 седмици предварително</strong>, особено през летните месеци и по време на големи празници.',
    permitOrthodox: '<strong>Православни християни:</strong> До 100 посетители дневно',
    permitNonOrthodox: '<strong>Неправославни:</strong> До 10 посетители дневно',
    permitDuration: '<strong>Продължителност:</strong> Стандартното разрешително е валидно за 4 дни и 3 нощувки',
    permitCost: '<strong>Цена:</strong> Приблизително 25 евро (издава се в Уранополи)',
    accessTitle: 'Достъп: Уранополи до Дафни',
    accessText: 'Влизането в Света гора е <strong>изключително по море</strong>. Точката на отпътуване е <strong>Уранополи</strong>, малко крайбрежно село в края на пътната мрежа на Халкидики. Оттам тръгва ферибот към <strong>Дафни</strong>, единственото входно пристанище.',
    accessFerryDeparts: 'Ферибот тръгва всяка сутрин (обикновено в 9:45)',
    accessJourneyTime: 'Пътуването отнема приблизително 2 часа',
    accessStops: 'По пътя ферибот спира при различни манастири по крайбрежието',
    bringTitle: 'Какво да вземете със себе си',
    bringId: 'Лична карта или паспорт',
    bringClothing: 'Удобни дрехи — къси панталони и потници са забранени',
    bringShoes: 'Добри обувки за планински преходи',
    bringSupplies: 'Вода, основни хранителни продукти, аптечка за първа помощ',
    bringFlashlight: 'Фенерче — много манастири нямат пълно осветление',
    noteTitle: 'Важна забележка',
    noteText: 'Света гора е място за богослужение и молитва. От посетителите се очаква да уважават тишината, правилата на манастирите и монашеския начин на живот. Снимането и заснемането на видео са разрешени само в екстериорни зони, освен ако не е дадено изрично разрешение.',
    faqWho: 'Кой може да посети Света гора?',
    faqWhoAnswer: 'Само мъже на 18 и повече години могат да влязат в Света гора.',
    faqPermit: 'Как да получа Диамонитирион?',
    faqPermitAnswer: 'Чрез Бюрото за поклонници на Света гора в Солун или онлайн, поне 2-4 седмици предварително.',
    faqVisitors: 'Колко посетители са разрешени дневно?',
    faqVisitorsAnswer: '100 православни християни и 10 неправославни посетители дневно.',
  },
  ru: {
    heading: 'Как посетить Святую Гору Афон',
    intro: 'Посещение Святой Горы Афон — это не обычная поездка. Оно требует <strong>недель планирования</strong>, специального разрешения на въезд и строгого соблюдения правил, действующих на протяжении веков.',
    whoTitle: 'Кто может посетить',
    whoText: 'Вход на Святую Гору Афон разрешён <strong>исключительно мужчинам</strong>, достигшим <strong>18 лет</strong>. Исключений из этого правила нет — оно действует вне зависимости от вероисповедания или национальности.',
    avatonTitle: 'Аватон',
    avatonText: '<strong>Аватон</strong> — это запрет на посещение Святой Горы Афон женщинами. Он действует приблизительно <strong>1000 лет</strong> (с X-XI века) и закреплён как в Конституционной хартии Святой Горы, так и в греческой конституции. Нарушение Аватона является уголовным преступлением.',
    permitTitle: 'Диамонитирион (разрешение на въезд)',
    permitText: 'Для въезда на Святую Гору Афон необходимо специальное разрешение — <strong>Диамонитирион</strong>. Бронирование осуществляется через <strong>Бюро паломников Святой Горы</strong> в Салониках или онлайн. Рекомендуется бронировать <strong>не менее чем за 2-4 недели</strong>, особенно в летние месяцы и в периоды крупных праздников.',
    permitOrthodox: '<strong>Православные христиане:</strong> До 100 посетителей в день',
    permitNonOrthodox: '<strong>Неправославные:</strong> До 10 посетителей в день',
    permitDuration: '<strong>Срок действия:</strong> Стандартное разрешение действительно 4 дня и 3 ночи',
    permitCost: '<strong>Стоимость:</strong> Примерно 25 евро (выдаётся в Уранополисе)',
    accessTitle: 'Доступ: Уранополис — Дафни',
    accessText: 'Въезд на Святую Гору Афон осуществляется <strong>исключительно морем</strong>. Пункт отправления — <strong>Уранополис</strong>, небольшая прибрежная деревня в конце дорожной сети Халкидики. Оттуда отправляется паром в <strong>Дафни</strong>, единственный порт въезда.',
    accessFerryDeparts: 'Паром отправляется каждое утро (обычно в 9:45)',
    accessJourneyTime: 'Путь занимает приблизительно 2 часа',
    accessStops: 'По пути паром делает остановки у различных монастырей вдоль побережья',
    bringTitle: 'Что взять с собой',
    bringId: 'Удостоверение личности или паспорт',
    bringClothing: 'Удобная одежда — шорты и майки запрещены',
    bringShoes: 'Хорошая обувь для ходьбы по горам',
    bringSupplies: 'Вода, основные продукты питания, аптечка первой помощи',
    bringFlashlight: 'Фонарик — во многих монастырях нет полного освещения',
    noteTitle: 'Важное примечание',
    noteText: 'Святая Гора Афон — место богослужения и молитвы. Посетители должны уважать тишину, правила монастырей и монашеский уклад жизни. Фото- и видеосъёмка разрешены только на открытых территориях, если не получено специальное разрешение.',
    faqWho: 'Кто может посетить Святую Гору Афон?',
    faqWhoAnswer: 'Только мужчины от 18 лет и старше могут войти на Святую Гору Афон.',
    faqPermit: 'Как получить Диамонитирион?',
    faqPermitAnswer: 'Через Бюро паломников Святой Горы в Салониках или онлайн, не менее чем за 2-4 недели.',
    faqVisitors: 'Сколько посетителей допускается в день?',
    faqVisitorsAnswer: '100 православных христиан и 10 неправославных посетителей в день.',
  },
  ro: {
    heading: 'Cum să vizitați Muntele Athos',
    intro: 'Vizitarea Muntelui Athos nu este ca orice altă călătorie. Necesită <strong>săptămâni de planificare</strong>, un permis special de intrare și respectarea strictă a regulilor care sunt în vigoare de secole.',
    whoTitle: 'Cine poate vizita',
    whoText: 'Accesul pe Muntele Athos este permis <strong>exclusiv bărbaților</strong> care au împlinit <strong>18 ani</strong>. Nu există excepții de la această regulă — se aplică indiferent de religie sau naționalitate.',
    avatonTitle: 'Avatonul',
    avatonText: '<strong>Avatonul</strong> este interdicția femeilor de a intra pe Muntele Athos. Este în vigoare de aproximativ <strong>1.000 de ani</strong> (din secolele X-XI) și este consacrat atât în Carta Constituțională a Muntelui Athos, cât și în Constituția greacă. Încălcarea Avatonului este o infracțiune penală.',
    permitTitle: 'Diamonitirion (permis de intrare)',
    permitText: 'Pentru a intra pe Muntele Athos, aveți nevoie de un permis special numit <strong>Diamonitirion</strong>. Rezervările se fac prin <strong>Biroul Pelerinilor din Muntele Athos</strong> din Salonic sau online. Se recomandă rezervarea <strong>cu cel puțin 2-4 săptămâni înainte</strong>, mai ales în lunile de vară și în perioadele marilor sărbători.',
    permitOrthodox: '<strong>Creștini ortodocși:</strong> Până la 100 de vizitatori pe zi',
    permitNonOrthodox: '<strong>Neortodocși:</strong> Până la 10 vizitatori pe zi',
    permitDuration: '<strong>Durată:</strong> Permisul standard este valabil pentru 4 zile și 3 nopți',
    permitCost: '<strong>Cost:</strong> Aproximativ 25 de euro (eliberat în Ouranoupoli)',
    accessTitle: 'Acces: Ouranoupoli spre Dafni',
    accessText: 'Intrarea pe Muntele Athos se face <strong>exclusiv pe mare</strong>. Punctul de plecare este <strong>Ouranoupoli</strong>, un mic sat de coastă la capătul rețelei rutiere din Halkidiki. De acolo, un feribot pleacă spre <strong>Dafni</strong>, singurul port de intrare.',
    accessFerryDeparts: 'Feribotul pleacă în fiecare dimineață (de obicei la ora 9:45)',
    accessJourneyTime: 'Călătoria durează aproximativ 2 ore',
    accessStops: 'Pe parcurs, feribotul oprește la diverse mănăstiri de-a lungul coastei',
    bringTitle: 'Ce să luați cu voi',
    bringId: 'Carte de identitate sau pașaport',
    bringClothing: 'Haine confortabile — pantalonii scurți și tricourile fără mâneci sunt interzise',
    bringShoes: 'Încălțăminte bună de drumeție',
    bringSupplies: 'Apă, provizii alimentare de bază, trusă de prim ajutor',
    bringFlashlight: 'Lanternă — multe mănăstiri nu au iluminat complet',
    noteTitle: 'Notă importantă',
    noteText: 'Muntele Athos este un loc de rugăciune și închinare. Vizitatorilor li se cere să respecte liniștea, regulile mănăstirilor și modul de viață monastic. Fotografierea și filmarea sunt permise doar în zonele exterioare, cu excepția cazului în care se acordă permisiune explicită.',
    faqWho: 'Cine poate vizita Muntele Athos?',
    faqWhoAnswer: 'Doar bărbații de 18 ani și peste pot intra pe Muntele Athos.',
    faqPermit: 'Cum obțin un Diamonitirion?',
    faqPermitAnswer: 'Prin Biroul Pelerinilor din Muntele Athos din Salonic sau online, cu cel puțin 2-4 săptămâni înainte.',
    faqVisitors: 'Câți vizitatori sunt permisi pe zi?',
    faqVisitorsAnswer: '100 de creștini ortodocși și 10 vizitatori neortodocși pe zi.',
  },
};

export default async function HowToVisitPage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{tr('navHowToVisit', locale)}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {c.heading}
      </h1>

      <div className="prose prose-gray max-w-none mb-10">
        <p className="text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: c.intro }} />

        {/* Who can enter */}
        <h2>{c.whoTitle}</h2>
        <p dangerouslySetInnerHTML={{ __html: c.whoText }} />

        {/* Avaton */}
        <h2>{c.avatonTitle}</h2>
        <p dangerouslySetInnerHTML={{ __html: c.avatonText }} />

        {/* Diamonitirion */}
        <h2>{c.permitTitle}</h2>
        <p dangerouslySetInnerHTML={{ __html: c.permitText }} />
        <ul>
          <li dangerouslySetInnerHTML={{ __html: c.permitOrthodox }} />
          <li dangerouslySetInnerHTML={{ __html: c.permitNonOrthodox }} />
          <li dangerouslySetInnerHTML={{ __html: c.permitDuration }} />
          <li dangerouslySetInnerHTML={{ __html: c.permitCost }} />
        </ul>

        {/* How to get there */}
        <h2>{c.accessTitle}</h2>
        <p dangerouslySetInnerHTML={{ __html: c.accessText }} />
        <ul>
          <li>{c.accessFerryDeparts}</li>
          <li>{c.accessJourneyTime}</li>
          <li>{c.accessStops}</li>
        </ul>

        {/* What to bring */}
        <h2>{c.bringTitle}</h2>
        <ul>
          <li>{c.bringId}</li>
          <li>{c.bringClothing}</li>
          <li>{c.bringShoes}</li>
          <li>{c.bringSupplies}</li>
          <li>{c.bringFlashlight}</li>
        </ul>
      </div>

      {/* Important notice box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
        <h3 className="font-bold text-amber-900 mb-2">
          {c.noteTitle}
        </h3>
        <p className="text-sm text-amber-800">
          {c.noteText}
        </p>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-10">
        <Link href="/mount-athos/monasteries" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-amber-700 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {tr('navMonasteries', locale)}
        </Link>
        <Link href="/mount-athos/getting-there" className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
          {tr('navGettingThere', locale)}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: c.faqWho,
            acceptedAnswer: {
              '@type': 'Answer',
              text: c.faqWhoAnswer,
            },
          },
          {
            '@type': 'Question',
            name: c.faqPermit,
            acceptedAnswer: {
              '@type': 'Answer',
              text: c.faqPermitAnswer,
            },
          },
          {
            '@type': 'Question',
            name: c.faqVisitors,
            acceptedAnswer: {
              '@type': 'Answer',
              text: c.faqVisitorsAnswer,
            },
          },
        ],
      })}} />
    </article>
  );
}
