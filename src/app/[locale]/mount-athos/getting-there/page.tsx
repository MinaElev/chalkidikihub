import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft, Bus, Ship, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { tr } from '../content';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = { params: Promise<{ locale: string }> };

/* ── 6-language body content ── */
const content: Record<string, {
  pageTitle: string;
  intro: string;
  h2Thessaloniki: string;
  durationThessaloniki: string;
  pThessaloniki: string;
  byCar: string;
  byCarText: string;
  byBus: string;
  byBusText: string;
  byTaxi: string;
  byTaxiText: string;
  h2Ouranoupoli: string;
  durationOuranoupoli: string;
  pOuranoupoli: string;
  ferry: string;
  ferryText: string;
  speedboat: string;
  speedboatText: string;
  h2GettingAround: string;
  pGettingAround: string;
  buses: string;
  busesText: string;
  smallBoats: string;
  smallBoatsText: string;
  vehicles: string;
  vehiclesText: string;
  hiking: string;
  hikingText: string;
  h2Ierissos: string;
  pIerissos: string;
  ierissosEast: string;
  ierissosCrowds: string;
  ierissosTicket: string;
  h2Tips: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;
  tip5: string;
  jsonHeadline: string;
  jsonDescription: string;
}> = {
  el: {
    pageTitle: 'Πώς να Πάτε στο Άγιο Όρος',
    intro: 'Η πρόσβαση στο Άγιο Όρος γίνεται αποκλειστικά διά θαλάσσης. Δεν υπάρχει χερσαία σύνδεση, καθώς τα σύνορα της μοναστικής πολιτείας φυλάσσονται. Ο κύριος δρόμος περνά μέσω Ουρανούπολης, ενώ η Ιερισσός αποτελεί εναλλακτική πύλη εισόδου.',
    h2Thessaloniki: '1. Θεσσαλονίκη → Ουρανούπολη',
    durationThessaloniki: 'Διάρκεια: περίπου 2,5 ώρες',
    pThessaloniki: 'Η Ουρανούπολη είναι το τελευταίο χωριό πριν από το Άγιο Όρος και η κύρια αφετηρία των πλοίων. Βρίσκεται περίπου 130 χιλιόμετρα ανατολικά της Θεσσαλονίκης.',
    byCar: 'Αυτοκίνητο:',
    byCarText: 'Ακολουθήστε την εθνική οδό Θεσσαλονίκης-Μουδανιών και στη συνέχεια τη χερσόνησο της Κασσάνδρας/Άθω. Υπάρχουν χώροι στάθμευσης στην Ουρανούπολη.',
    byBus: 'Λεωφορείο (ΚΤΕΛ):',
    byBusText: 'Υπάρχουν τακτικά δρομολόγια ΚΤΕΛ από τη Θεσσαλονίκη (σταθμός Χαλκιδικής) προς Ουρανούπολη. Συνιστάται κράτηση εκ των προτέρων τους καλοκαιρινούς μήνες.',
    byTaxi: 'Ταξί / Transfer:',
    byTaxiText: 'Ιδιωτικές μεταφορές από Θεσσαλονίκη ή το αεροδρόμιο «Μακεδονία» είναι διαθέσιμες, συνήθως με κόστος 100-150 ευρώ.',
    h2Ouranoupoli: '2. Ουρανούπολη → Δάφνη (Λιμάνι Αγίου Όρους)',
    durationOuranoupoli: 'Διάρκεια: περίπου 2 ώρες',
    pOuranoupoli: 'Η Δάφνη είναι το κεντρικό λιμάνι του Αγίου Όρους και σημείο αποβίβασης για τους περισσότερους επισκέπτες. Το πλοίο σταματά σε αρκετές μονές κατά μήκος της δυτικής ακτής πριν φτάσει στη Δάφνη.',
    ferry: 'Μεγάλο πλοίο (φέρι):',
    ferryText: 'Αναχωρεί καθημερινά από την Ουρανούπολη, συνήθως στις 09:45. Κάνει ενδιάμεσες στάσεις σε μονές (Δοχειαρίου, Ξενοφώντος, κ.ά.).',
    speedboat: 'Ταχύπλοο:',
    speedboatText: 'Ταχύτερη εναλλακτική (περίπου 1 ώρα) με αυξημένο κόστος. Δεν κάνει πάντα ενδιάμεσες στάσεις.',
    h2GettingAround: '3. Μετακινήσεις εντός Αγίου Όρους',
    pGettingAround: 'Από τη Δάφνη μπορείτε να μετακινηθείτε προς τις μονές με διάφορα μέσα. Οι αποστάσεις μεταξύ μοναστηριών μπορεί να είναι μεγάλες και οι δρόμοι χωματένιοι.',
    buses: 'Λεωφορεία:',
    busesText: 'Μικρά λεωφορεία (μίνι-μπας) συνδέουν τη Δάφνη με τις Καρυές, την πρωτεύουσα του Αγίου Όρους.',
    smallBoats: 'Μικρά πλοία (αρσανάδες):',
    smallBoatsText: 'Ακτοπλοϊκά σκάφη μεταφέρουν επισκέπτες σε μονές κατά μήκος της ακτής.',
    vehicles: 'Αγροτικά οχήματα:',
    vehiclesText: 'Ορισμένες μονές χρησιμοποιούν 4x4 αγροτικά οχήματα για τη μεταφορά προσκυνητών σε δύσβατες περιοχές.',
    hiking: 'Πεζοπορία:',
    hikingText: 'Πολλοί επισκέπτες προτιμούν να περπατήσουν μεταξύ μοναστηριών. Υπάρχουν σημαδεμένα μονοπάτια, αλλά απαιτείται καλή φυσική κατάσταση.',
    h2Ierissos: 'Εναλλακτική: Ιερισσός (Ανατολική πλευρά)',
    pIerissos: 'Η Ιερισσός βρίσκεται στην ανατολική πλευρά της χερσονήσου και εξυπηρετεί τις μονές της ανατολικής ακτής. Από εκεί αναχωρούν πλοία προς τη Μεγίστη Λαύρα, τη Μονή Ιβήρων και άλλα μοναστήρια.',
    ierissosEast: 'Ιδανική επιλογή αν θέλετε να επισκεφθείτε μονές στην ανατολική πλευρά.',
    ierissosCrowds: 'Λιγότερο πολυσύχναστη σε σύγκριση με την Ουρανούπολη.',
    ierissosTicket: 'Απαιτείται ξεχωριστό εισιτήριο πλοίου.',
    h2Tips: 'Πρακτικές Συμβουλές',
    tip1: 'Κλείστε εισιτήριο πλοίου εκ των προτέρων, ειδικά σε περιόδους αιχμής (Πάσχα, καλοκαίρι, μεγάλες γιορτές).',
    tip2: 'Φτάστε στην Ουρανούπολη ένα βράδυ νωρίτερα αν ταξιδεύετε από μακριά.',
    tip3: 'Έχετε μαζί σας το διαμονητήριο (άδεια εισόδου) — χωρίς αυτό δεν μπορείτε να επιβιβαστείτε.',
    tip4: 'Πάρτε μαζί νερό, σνακ και άνετα παπούτσια πεζοπορίας αν σκοπεύετε να περπατήσετε.',
    tip5: 'Το κινητό τηλέφωνο έχει περιορισμένο σήμα σε πολλά σημεία του Αγίου Όρους.',
    jsonHeadline: 'Πώς να Πάτε στο Άγιο Όρος',
    jsonDescription: 'Αναλυτικές οδηγίες μετακίνησης προς το Άγιο Όρος από Θεσσαλονίκη, Ουρανούπολη και Ιερισσό.',
  },
  en: {
    pageTitle: 'How to Get to Mount Athos',
    intro: 'Access to Mount Athos is exclusively by sea. There is no overland connection, as the borders of the monastic state are guarded. The main route goes through Ouranoupoli, while Ierissos serves as an alternative gateway.',
    h2Thessaloniki: '1. Thessaloniki → Ouranoupoli',
    durationThessaloniki: 'Duration: approximately 2.5 hours',
    pThessaloniki: 'Ouranoupoli is the last village before Mount Athos and the main departure point for boats. It is located approximately 130 kilometers east of Thessaloniki.',
    byCar: 'By car:',
    byCarText: 'Follow the Thessaloniki-Moudania highway and then the Kassandra/Athos peninsula road. Parking is available in Ouranoupoli.',
    byBus: 'Bus (KTEL):',
    byBusText: 'Regular KTEL bus services run from Thessaloniki (Halkidiki bus station) to Ouranoupoli. Advance booking is recommended during summer months.',
    byTaxi: 'Taxi / Transfer:',
    byTaxiText: 'Private transfers from Thessaloniki or Makedonia Airport are available, typically costing 100-150 euros.',
    h2Ouranoupoli: '2. Ouranoupoli → Dafni (Port of Mount Athos)',
    durationOuranoupoli: 'Duration: approximately 2 hours',
    pOuranoupoli: 'Dafni is the main port of Mount Athos and the disembarkation point for most visitors. The boat makes stops at several monasteries along the western coast before reaching Dafni.',
    ferry: 'Large ferry boat:',
    ferryText: 'Departs daily from Ouranoupoli, usually at 09:45. Makes intermediate stops at monasteries (Dochiariou, Xenophontos, etc.).',
    speedboat: 'Speedboat:',
    speedboatText: 'Faster alternative (about 1 hour) at higher cost. Does not always make intermediate stops.',
    h2GettingAround: '3. Getting Around Mount Athos',
    pGettingAround: 'From Dafni, you can travel to the monasteries by various means. Distances between monasteries can be significant and roads are often unpaved.',
    buses: 'Buses:',
    busesText: 'Small buses (mini-buses) connect Dafni with Karyes, the capital of Mount Athos.',
    smallBoats: 'Small boats (arsanades):',
    smallBoatsText: 'Coastal boats transport visitors to monasteries along the coastline.',
    vehicles: 'Agricultural vehicles:',
    vehiclesText: 'Some monasteries use 4x4 agricultural vehicles to transport pilgrims in difficult terrain.',
    hiking: 'Hiking:',
    hikingText: 'Many visitors prefer to walk between monasteries. There are marked trails, but good physical condition is required.',
    h2Ierissos: 'Alternative: Ierissos (East Side)',
    pIerissos: 'Ierissos is located on the eastern side of the peninsula and serves the monasteries of the eastern coast. Boats depart from there to the Great Lavra, Iviron Monastery and other monasteries.',
    ierissosEast: 'Ideal choice if you want to visit monasteries on the eastern side.',
    ierissosCrowds: 'Less crowded compared to Ouranoupoli.',
    ierissosTicket: 'Requires a separate boat ticket.',
    h2Tips: 'Practical Tips',
    tip1: 'Book your boat ticket in advance, especially during peak periods (Easter, summer, major feast days).',
    tip2: 'Arrive in Ouranoupoli the evening before if traveling from far away.',
    tip3: 'Carry your diamonitirion (entry permit) with you — you cannot board the boat without it.',
    tip4: 'Bring water, snacks and comfortable hiking shoes if you plan to walk between monasteries.',
    tip5: 'Mobile phone signal is limited in many parts of Mount Athos.',
    jsonHeadline: 'How to Get to Mount Athos',
    jsonDescription: 'Detailed transport guide to Mount Athos from Thessaloniki, Ouranoupoli and Ierissos.',
  },
  de: {
    pageTitle: 'Anreise zum Berg Athos',
    intro: 'Der Zugang zum Berg Athos erfolgt ausschließlich auf dem Seeweg. Es gibt keine Landverbindung, da die Grenzen des Klosterstaates bewacht werden. Die Hauptroute führt über Ouranoupoli, während Ierissos als alternativer Zugang dient.',
    h2Thessaloniki: '1. Thessaloniki → Ouranoupoli',
    durationThessaloniki: 'Dauer: ca. 2,5 Stunden',
    pThessaloniki: 'Ouranoupoli ist das letzte Dorf vor dem Berg Athos und der Hauptabfahrtshafen für die Boote. Es liegt etwa 130 Kilometer östlich von Thessaloniki.',
    byCar: 'Mit dem Auto:',
    byCarText: 'Folgen Sie der Autobahn Thessaloniki-Moudania und dann der Straße zur Halbinsel Kassandra/Athos. In Ouranoupoli stehen Parkplätze zur Verfügung.',
    byBus: 'Bus (KTEL):',
    byBusText: 'Regelmäßige KTEL-Busverbindungen verkehren von Thessaloniki (Busbahnhof Chalkidiki) nach Ouranoupoli. In den Sommermonaten wird eine Vorabuchung empfohlen.',
    byTaxi: 'Taxi / Transfer:',
    byTaxiText: 'Private Transfers von Thessaloniki oder dem Flughafen Makedonia sind verfügbar und kosten in der Regel 100-150 Euro.',
    h2Ouranoupoli: '2. Ouranoupoli → Dafni (Hafen des Berg Athos)',
    durationOuranoupoli: 'Dauer: ca. 2 Stunden',
    pOuranoupoli: 'Dafni ist der Haupthafen des Berg Athos und der Anlandepunkt für die meisten Besucher. Das Boot hält an mehreren Klöstern entlang der Westküste, bevor es Dafni erreicht.',
    ferry: 'Große Fähre:',
    ferryText: 'Fährt täglich von Ouranoupoli ab, in der Regel um 09:45 Uhr. Hält zwischendurch an Klöstern (Dochiariou, Xenophontos usw.).',
    speedboat: 'Schnellboot:',
    speedboatText: 'Schnellere Alternative (ca. 1 Stunde) zu höheren Kosten. Macht nicht immer Zwischenstopps.',
    h2GettingAround: '3. Fortbewegung auf dem Berg Athos',
    pGettingAround: 'Von Dafni aus können Sie die Klöster mit verschiedenen Verkehrsmitteln erreichen. Die Entfernungen zwischen den Klöstern können erheblich sein und die Straßen sind oft unbefestigt.',
    buses: 'Busse:',
    busesText: 'Kleinbusse (Minibusse) verbinden Dafni mit Karyes, der Hauptstadt des Berg Athos.',
    smallBoats: 'Kleine Boote (Arsanades):',
    smallBoatsText: 'Küstenboote transportieren Besucher zu Klöstern entlang der Küste.',
    vehicles: 'Landwirtschaftliche Fahrzeuge:',
    vehiclesText: 'Einige Klöster nutzen 4x4-Fahrzeuge, um Pilger in schwierigem Gelände zu transportieren.',
    hiking: 'Wandern:',
    hikingText: 'Viele Besucher ziehen es vor, zwischen den Klöstern zu wandern. Es gibt markierte Wege, aber eine gute körperliche Verfassung ist erforderlich.',
    h2Ierissos: 'Alternative: Ierissos (Ostseite)',
    pIerissos: 'Ierissos liegt auf der Ostseite der Halbinsel und bedient die Klöster der Ostküste. Von dort fahren Boote zur Großen Lavra, zum Kloster Iviron und zu anderen Klöstern.',
    ierissosEast: 'Ideale Wahl, wenn Sie Klöster auf der Ostseite besuchen möchten.',
    ierissosCrowds: 'Weniger überlaufen im Vergleich zu Ouranoupoli.',
    ierissosTicket: 'Ein separates Bootsticket ist erforderlich.',
    h2Tips: 'Praktische Tipps',
    tip1: 'Buchen Sie Ihr Bootsticket im Voraus, besonders in der Hochsaison (Ostern, Sommer, große Feiertage).',
    tip2: 'Reisen Sie am Vorabend nach Ouranoupoli an, wenn Sie von weit her kommen.',
    tip3: 'Führen Sie Ihr Diamonitirion (Einreiseerlaubnis) mit sich — ohne dieses können Sie nicht an Bord gehen.',
    tip4: 'Nehmen Sie Wasser, Snacks und bequeme Wanderschuhe mit, wenn Sie zwischen den Klöstern wandern möchten.',
    tip5: 'Der Mobilfunkempfang ist in vielen Teilen des Berg Athos eingeschränkt.',
    jsonHeadline: 'Anreise zum Berg Athos',
    jsonDescription: 'Detaillierte Anreiseanleitung zum Berg Athos von Thessaloniki, Ouranoupoli und Ierissos.',
  },
  bg: {
    pageTitle: 'Как да стигнете до Света гора',
    intro: 'Достъпът до Света гора е изключително по море. Няма сухопътна връзка, тъй като границите на монашеската държава се охраняват. Основният маршрут минава през Уранополи, а Йерисос служи като алтернативен вход.',
    h2Thessaloniki: '1. Солун → Уранополи',
    durationThessaloniki: 'Продължителност: около 2,5 часа',
    pThessaloniki: 'Уранополи е последното село преди Света гора и основната точка на отплаване за корабите. Намира се на около 130 километра източно от Солун.',
    byCar: 'С кола:',
    byCarText: 'Следвайте магистралата Солун-Муданя и след това пътя към полуостров Касандра/Атос. В Уранополи има паркинги.',
    byBus: 'Автобус (КТЕЛ):',
    byBusText: 'Редовни автобусни линии КТЕЛ се движат от Солун (автогара Халкидики) до Уранополи. Препоръчва се предварителна резервация през летните месеци.',
    byTaxi: 'Такси / Трансфер:',
    byTaxiText: 'Частни трансфери от Солун или летище Македония са налични и обикновено струват 100-150 евро.',
    h2Ouranoupoli: '2. Уранополи → Дафни (Пристанище на Света гора)',
    durationOuranoupoli: 'Продължителност: около 2 часа',
    pOuranoupoli: 'Дафни е главното пристанище на Света гора и точката за слизане на повечето посетители. Корабът спира на няколко манастира по западното крайбрежие, преди да стигне до Дафни.',
    ferry: 'Голям ферибот:',
    ferryText: 'Отплава ежедневно от Уранополи, обикновено в 09:45. Прави междинни спирки при манастири (Дохиариу, Ксенофонтос и др.).',
    speedboat: 'Бърз катер:',
    speedboatText: 'По-бърза алтернатива (около 1 час) на по-висока цена. Не винаги прави междинни спирки.',
    h2GettingAround: '3. Придвижване в Света гора',
    pGettingAround: 'От Дафни можете да пътувате до манастирите с различни средства. Разстоянията между манастирите могат да бъдат значителни, а пътищата често са черни.',
    buses: 'Автобуси:',
    busesText: 'Малки автобуси (микробуси) свързват Дафни с Кариес, столицата на Света гора.',
    smallBoats: 'Малки лодки (арсанадес):',
    smallBoatsText: 'Крайбрежни лодки превозват посетители до манастири по бреговата линия.',
    vehicles: 'Селскостопански превозни средства:',
    vehiclesText: 'Някои манастири използват 4x4 превозни средства за транспортиране на поклонници в труден терен.',
    hiking: 'Пеш:',
    hikingText: 'Много посетители предпочитат да ходят пеша между манастирите. Има маркирани пътеки, но се изисква добра физическа форма.',
    h2Ierissos: 'Алтернатива: Йерисос (Източна страна)',
    pIerissos: 'Йерисос се намира на източната страна на полуострова и обслужва манастирите по източното крайбрежие. Оттам отплават кораби към Великата Лавра, манастира Ивирон и други манастири.',
    ierissosEast: 'Идеален избор, ако искате да посетите манастири от източната страна.',
    ierissosCrowds: 'По-малко натоварен в сравнение с Уранополи.',
    ierissosTicket: 'Изисква се отделен билет за кораб.',
    h2Tips: 'Практически съвети',
    tip1: 'Резервирайте билет за кораб предварително, особено по време на натоварени периоди (Великден, лято, големи празници).',
    tip2: 'Пристигнете в Уранополи вечерта преди това, ако пътувате отдалеч.',
    tip3: 'Носете диамонитирион (разрешително за влизане) със себе си — без него не можете да се качите на кораба.',
    tip4: 'Вземете вода, закуски и удобни обувки за ходене, ако планирате да ходите пеша между манастирите.',
    tip5: 'Мобилният сигнал е ограничен в много части на Света гора.',
    jsonHeadline: 'Как да стигнете до Света гора',
    jsonDescription: 'Подробно ръководство за транспорт до Света гора от Солун, Уранополи и Йерисос.',
  },
  ru: {
    pageTitle: 'Как добраться до Святой Горы Афон',
    intro: 'Доступ на Святую Гору Афон возможен исключительно морским путём. Сухопутного сообщения нет, так как границы монашеского государства охраняются. Основной маршрут проходит через Уранополис, а Иериссос служит альтернативным входом.',
    h2Thessaloniki: '1. Салоники → Уранополис',
    durationThessaloniki: 'Продолжительность: примерно 2,5 часа',
    pThessaloniki: 'Уранополис — последний посёлок перед Святой Горой и главный пункт отправления лодок. Он расположен примерно в 130 километрах к востоку от Салоников.',
    byCar: 'На автомобиле:',
    byCarText: 'Следуйте по автомагистрали Салоники-Муданья, а затем по дороге на полуостров Кассандра/Афон. В Уранополисе есть парковки.',
    byBus: 'Автобус (КТЕЛ):',
    byBusText: 'Регулярные автобусные рейсы КТЕЛ отправляются из Салоников (автовокзал Халкидики) в Уранополис. В летние месяцы рекомендуется предварительное бронирование.',
    byTaxi: 'Такси / Трансфер:',
    byTaxiText: 'Частные трансферы из Салоников или аэропорта Македония доступны и обычно стоят 100-150 евро.',
    h2Ouranoupoli: '2. Уранополис → Дафни (Порт Святой Горы)',
    durationOuranoupoli: 'Продолжительность: примерно 2 часа',
    pOuranoupoli: 'Дафни — главный порт Святой Горы и место высадки для большинства посетителей. Судно делает остановки у нескольких монастырей вдоль западного побережья, прежде чем достигнет Дафни.',
    ferry: 'Большой паром:',
    ferryText: 'Отправляется ежедневно из Уранополиса, обычно в 09:45. Делает промежуточные остановки у монастырей (Дохиариу, Ксенофонтос и др.).',
    speedboat: 'Скоростной катер:',
    speedboatText: 'Более быстрая альтернатива (около 1 часа) по более высокой цене. Не всегда делает промежуточные остановки.',
    h2GettingAround: '3. Передвижение по Святой Горе',
    pGettingAround: 'Из Дафни можно добраться до монастырей различными способами. Расстояния между монастырями могут быть значительными, а дороги часто грунтовые.',
    buses: 'Автобусы:',
    busesText: 'Небольшие автобусы (микроавтобусы) соединяют Дафни с Карьес, столицей Святой Горы.',
    smallBoats: 'Малые суда (арсанадес):',
    smallBoatsText: 'Каботажные суда перевозят посетителей к монастырям вдоль побережья.',
    vehicles: 'Сельскохозяйственная техника:',
    vehiclesText: 'Некоторые монастыри используют полноприводные транспортные средства для перевозки паломников по труднопроходимой местности.',
    hiking: 'Пешком:',
    hikingText: 'Многие посетители предпочитают ходить пешком между монастырями. Есть маркированные тропы, но необходима хорошая физическая форма.',
    h2Ierissos: 'Альтернатива: Иериссос (Восточная сторона)',
    pIerissos: 'Иериссос расположен на восточной стороне полуострова и обслуживает монастыри восточного побережья. Оттуда отправляются лодки к Великой Лавре, монастырю Иверон и другим монастырям.',
    ierissosEast: 'Идеальный выбор, если вы хотите посетить монастыри на восточной стороне.',
    ierissosCrowds: 'Менее многолюдный по сравнению с Уранополисом.',
    ierissosTicket: 'Требуется отдельный билет на лодку.',
    h2Tips: 'Практические советы',
    tip1: 'Бронируйте билет на лодку заранее, особенно в пиковые периоды (Пасха, лето, крупные праздники).',
    tip2: 'Приезжайте в Уранополис накануне вечером, если добираетесь издалека.',
    tip3: 'Имейте при себе диамонитирион (разрешение на въезд) — без него вы не сможете сесть на корабль.',
    tip4: 'Возьмите воду, перекус и удобную обувь для ходьбы, если планируете передвигаться пешком.',
    tip5: 'Сигнал мобильной связи ограничен во многих частях Святой Горы.',
    jsonHeadline: 'Как добраться до Святой Горы Афон',
    jsonDescription: 'Подробное руководство по транспорту до Святой Горы Афон из Салоников, Уранополиса и Иериссоса.',
  },
  ro: {
    pageTitle: 'Cum ajungeți la Muntele Athos',
    intro: 'Accesul la Muntele Athos se face exclusiv pe mare. Nu există legătură terestră, deoarece granițele statului monastic sunt păzite. Ruta principală trece prin Ouranoupoli, iar Ierissos servește ca poartă alternativă.',
    h2Thessaloniki: '1. Salonic → Ouranoupoli',
    durationThessaloniki: 'Durată: aproximativ 2,5 ore',
    pThessaloniki: 'Ouranoupoli este ultimul sat înainte de Muntele Athos și principalul punct de plecare al ambarcațiunilor. Se află la aproximativ 130 de kilometri est de Salonic.',
    byCar: 'Cu mașina:',
    byCarText: 'Urmați autostrada Salonic-Moudania și apoi drumul spre peninsula Kassandra/Athos. În Ouranoupoli există locuri de parcare.',
    byBus: 'Autobuz (KTEL):',
    byBusText: 'Servicii regulate de autobuz KTEL circulă din Salonic (autogara Halkidiki) spre Ouranoupoli. Se recomandă rezervarea din timp în lunile de vară.',
    byTaxi: 'Taxi / Transfer:',
    byTaxiText: 'Transferuri private din Salonic sau de la Aeroportul Macedonia sunt disponibile, costând de obicei 100-150 de euro.',
    h2Ouranoupoli: '2. Ouranoupoli → Dafni (Portul Muntelui Athos)',
    durationOuranoupoli: 'Durată: aproximativ 2 ore',
    pOuranoupoli: 'Dafni este portul principal al Muntelui Athos și punctul de debarcare pentru majoritatea vizitatorilor. Vasul face opriri la mai multe mănăstiri de-a lungul coastei vestice înainte de a ajunge la Dafni.',
    ferry: 'Feribot mare:',
    ferryText: 'Pleacă zilnic din Ouranoupoli, de obicei la 09:45. Face opriri intermediare la mănăstiri (Dochiariou, Xenophontos etc.).',
    speedboat: 'Barcă rapidă:',
    speedboatText: 'Alternativă mai rapidă (circa 1 oră) la un cost mai mare. Nu face întotdeauna opriri intermediare.',
    h2GettingAround: '3. Deplasarea pe Muntele Athos',
    pGettingAround: 'Din Dafni puteți călători spre mănăstiri prin diverse mijloace. Distanțele dintre mănăstiri pot fi semnificative, iar drumurile sunt adesea neasfaltate.',
    buses: 'Autobuze:',
    busesText: 'Microbuze conectează Dafni cu Karyes, capitala Muntelui Athos.',
    smallBoats: 'Bărci mici (arsanades):',
    smallBoatsText: 'Ambarcațiuni de coastă transportă vizitatorii la mănăstiri de-a lungul litoralului.',
    vehicles: 'Vehicule agricole:',
    vehiclesText: 'Unele mănăstiri folosesc vehicule 4x4 pentru transportul pelerinilor pe teren dificil.',
    hiking: 'Pe jos:',
    hikingText: 'Mulți vizitatori preferă să meargă pe jos între mănăstiri. Există trasee marcate, dar este necesară o condiție fizică bună.',
    h2Ierissos: 'Alternativă: Ierissos (Partea de est)',
    pIerissos: 'Ierissos se află pe partea de est a peninsulei și deservește mănăstirile de pe coasta estică. De acolo pleacă bărci spre Marea Lavră, Mănăstirea Iviron și alte mănăstiri.',
    ierissosEast: 'Alegere ideală dacă doriți să vizitați mănăstiri de pe partea de est.',
    ierissosCrowds: 'Mai puțin aglomerat comparativ cu Ouranoupoli.',
    ierissosTicket: 'Este necesar un bilet separat pentru barcă.',
    h2Tips: 'Sfaturi practice',
    tip1: 'Rezervați biletul de barcă din timp, mai ales în perioadele de vârf (Paște, vară, sărbători mari).',
    tip2: 'Ajungeți în Ouranoupoli cu o seară înainte dacă veniți de departe.',
    tip3: 'Aveți la dumneavoastră diamonitirionul (permisul de intrare) — fără el nu puteți urca pe vapor.',
    tip4: 'Luați apă, gustări și pantofi comozi de mers dacă intenționați să mergeți pe jos între mănăstiri.',
    tip5: 'Semnalul telefonului mobil este limitat în multe zone ale Muntelui Athos.',
    jsonHeadline: 'Cum ajungeți la Muntele Athos',
    jsonDescription: 'Ghid detaliat de transport spre Muntele Athos din Salonic, Ouranoupoli și Ierissos.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = tr('metaGettingThereTitle', locale);
  const description = tr('metaGettingThereDesc', locale);
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, 'mount-athos/getting-there'),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, 'mount-athos/getting-there')])),
        'x-default': localeUrl('el', 'mount-athos/getting-there'),
      },
    },
  };
}

export default async function GettingTherePage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{tr('navGettingThere', locale)}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {c.pageTitle}
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed">
          {c.intro}
        </p>

        {/* Step 1: Thessaloniki to Ouranoupoli */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Bus className="w-6 h-6 text-amber-700" />
          {c.h2Thessaloniki}
        </h2>
        <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-4 py-2 not-prose mb-4 mt-2">
          <Clock className="w-4 h-4" />
          <span>{c.durationThessaloniki}</span>
        </div>
        <p>{c.pThessaloniki}</p>
        <ul>
          <li>
            <strong>{c.byCar}</strong>{' '}{c.byCarText}
          </li>
          <li>
            <strong>{c.byBus}</strong>{' '}{c.byBusText}
          </li>
          <li>
            <strong>{c.byTaxi}</strong>{' '}{c.byTaxiText}
          </li>
        </ul>

        {/* Step 2: Ouranoupoli to Dafni */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Ship className="w-6 h-6 text-amber-700" />
          {c.h2Ouranoupoli}
        </h2>
        <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-4 py-2 not-prose mb-4 mt-2">
          <Clock className="w-4 h-4" />
          <span>{c.durationOuranoupoli}</span>
        </div>
        <p>{c.pOuranoupoli}</p>
        <ul>
          <li>
            <strong>{c.ferry}</strong>{' '}{c.ferryText}
          </li>
          <li>
            <strong>{c.speedboat}</strong>{' '}{c.speedboatText}
          </li>
        </ul>

        {/* Step 3: Within Mount Athos */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <MapPin className="w-6 h-6 text-amber-700" />
          {c.h2GettingAround}
        </h2>
        <p>{c.pGettingAround}</p>
        <ul>
          <li>
            <strong>{c.buses}</strong>{' '}{c.busesText}
          </li>
          <li>
            <strong>{c.smallBoats}</strong>{' '}{c.smallBoatsText}
          </li>
          <li>
            <strong>{c.vehicles}</strong>{' '}{c.vehiclesText}
          </li>
          <li>
            <strong>{c.hiking}</strong>{' '}{c.hikingText}
          </li>
        </ul>

        {/* Ierissos alternative */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Ship className="w-6 h-6 text-amber-700" />
          {c.h2Ierissos}
        </h2>
        <p>{c.pIerissos}</p>
        <ul>
          <li>{c.ierissosEast}</li>
          <li>{c.ierissosCrowds}</li>
          <li>{c.ierissosTicket}</li>
        </ul>

        {/* Practical tips */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <AlertTriangle className="w-6 h-6 text-amber-700" />
          {c.h2Tips}
        </h2>
        <ul>
          <li>{c.tip1}</li>
          <li>{c.tip2}</li>
          <li>{c.tip3}</li>
          <li>{c.tip4}</li>
          <li>{c.tip5}</li>
        </ul>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
        <Link href="/mount-athos/how-to-visit" className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
          <ChevronLeft className="w-4 h-4" />
          {tr('navHowToVisit', locale)}
        </Link>
        <Link href="/mount-athos/accommodation" className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
          {tr('navAccommodation', locale)} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: c.jsonHeadline,
        description: c.jsonDescription,
        datePublished: '2025-06-01',
        dateModified: '2026-04-20',
        author: { '@type': 'Organization', name: 'Chalkidiki Hub' },
        publisher: { '@type': 'Organization', name: 'Chalkidiki Hub', url: SITE_URL },
        mainEntityOfPage: localeUrl(locale, 'mount-athos/getting-there'),
      })}} />
    </article>
  );
}
