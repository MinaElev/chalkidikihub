import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft, BedDouble, Church, UtensilsCrossed, Wallet, Info } from 'lucide-react';
import { tr } from '../content';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = { params: Promise<{ locale: string }> };

/* ── 6-language body content ── */
const content: Record<string, {
  pageTitle: string;
  intro: string;
  h2Archontariki: string;
  pArchontariki: string;
  archFree: string;
  archWelcome: string;
  archRooms: string;
  archMonk: string;
  h2Meals: string;
  pMeals: string;
  mealsTwice: string;
  mealsDiet: string;
  mealsFeast: string;
  mealsSilence: string;
  h2Services: string;
  pServices: string;
  servVespers: string;
  servLiturgy: string;
  servOptional: string;
  h3Sketes: string;
  pSketes: string;
  sketesPhone: string;
  sketesLimited: string;
  h2Expect: string;
  pExpect: string;
  expectWifi: string;
  expectElectricity: string;
  expectSilence: string;
  expectClothing: string;
  expectPhoto: string;
  h2Costs: string;
  pCosts: string;
  costPermit: string;
  costPermitVal: string;
  costBoat: string;
  costBoatVal: string;
  costTransport: string;
  costTransportVal: string;
  costAccom: string;
  costAccomVal: string;
  pCostsTotal: string;
  jsonHeadline: string;
  jsonDescription: string;
}> = {
  el: {
    pageTitle: 'Διαμονή στο Άγιο Όρος',
    intro: 'Στο Άγιο Όρος δεν υπάρχουν ξενοδοχεία ή τουριστικά καταλύματα. Η φιλοξενία παρέχεται δωρεάν από τα μοναστήρια στους αρχονταρίκια (ξενώνες), σύμφωνα με την αρχαία μοναστική παράδοση. Η διαμονή είναι απλή αλλά αυθεντική — ένα πνευματικό ταξίδι, όχι διακοπές πολυτελείας.',
    h2Archontariki: 'Αρχονταρίκι (Ξενώνας Μονής)',
    pArchontariki: 'Κάθε μοναστήρι διαθέτει αρχονταρίκι — τον ειδικό χώρο υποδοχής και φιλοξενίας προσκυνητών. Πρόκειται για δωμάτια με κρεβάτια, συνήθως πολύκλινα, με κοινόχρηστο μπάνιο.',
    archFree: 'Η διαμονή παρέχεται δωρεάν σε όλους τους κατόχους διαμονητηρίου.',
    archWelcome: 'Κατά την άφιξη προσφέρεται λουκούμι, τσίπουρο ή γλυκό κουταλιού μαζί με νερό.',
    archRooms: 'Τα δωμάτια είναι καθαρά και απλά. Παρέχονται σεντόνια και κουβέρτες.',
    archMonk: 'Ο αρχοντάρης (υπεύθυνος μοναχός) οργανώνει τη διαμονή και ενημερώνει για το πρόγραμμα.',
    h2Meals: 'Γεύματα & Τράπεζα',
    pMeals: 'Τα μοναστήρια παρέχουν γεύματα στους επισκέπτες στην κοινή τράπεζα (τραπεζαρία). Η τροφή είναι απλή, λιτή και σύμφωνη με τους εκκλησιαστικούς κανόνες νηστείας.',
    mealsTwice: 'Συνήθως δύο γεύματα την ημέρα (πρωινό μετά τη Θεία Λειτουργία, γεύμα/δείπνο).',
    mealsDiet: 'Η διατροφή βασίζεται σε όσπρια, λαχανικά, ψωμί, ελιές και φρούτα. Κρέας δεν σερβίρεται ποτέ.',
    mealsFeast: 'Κατά τις γιορτές μπορεί να σερβιριστεί ψάρι, κρασί και γλυκά.',
    mealsSilence: 'Τα γεύματα γίνονται σε σιωπή, ενώ ένας μοναχός διαβάζει πνευματικά κείμενα.',
    h2Services: 'Συμμετοχή στις Ακολουθίες',
    pServices: 'Οι προσκυνητές αναμένεται να συμμετέχουν στις θρησκευτικές ακολουθίες, ειδικά στον εσπερινό και τη Θεία Λειτουργία. Αυτό αποτελεί αναπόσπαστο μέρος της εμπειρίας στο Άγιο Όρος.',
    servVespers: 'Ο εσπερινός τελείται συνήθως γύρω στις 4-5 το απόγευμα (βυζαντινή ώρα).',
    servLiturgy: 'Η Θεία Λειτουργία ξεκινά πολύ νωρίς, συχνά στις 3-4 τα ξημερώματα.',
    servOptional: 'Η συμμετοχή δεν είναι υποχρεωτική, αλλά θεωρείται σημάδι σεβασμού.',
    h3Sketes: 'Διαμονή σε Σκήτες και Κελιά',
    pSketes: 'Εκτός από τα μεγάλα μοναστήρια, μπορείτε να μείνετε και σε σκήτες (μικρότερες μοναστικές κοινότητες) ή μεμονωμένα κελιά. Η φιλοξενία εκεί είναι ακόμα πιο λιτή, αλλά η εμπειρία ιδιαίτερα αυθεντική.',
    sketesPhone: 'Απαιτείται τηλεφωνική επικοινωνία εκ των προτέρων.',
    sketesLimited: 'Ο αριθμός φιλοξενούμενων είναι πολύ περιορισμένος.',
    h2Expect: 'Τι να Περιμένετε',
    pExpect: 'Η διαμονή στο Άγιο Όρος είναι μια εμπειρία λιτότητας και πνευματικής αναζήτησης. Δεν πρόκειται για τουριστική φιλοξενία — πρόκειται για μοναστική ζωή.',
    expectWifi: 'Δεν υπάρχει Wi-Fi ή τηλεόραση.',
    expectElectricity: 'Το ηλεκτρικό ρεύμα μπορεί να είναι περιορισμένο σε ορισμένα μοναστήρια.',
    expectSilence: 'Η ησυχία και η σιωπή είναι θεμελιώδεις αξίες.',
    expectClothing: 'Κατάλληλη ενδυμασία: μακριά παντελόνια, πουκάμισο με μανίκια.',
    expectPhoto: 'Αποφύγετε τη φωτογράφιση χωρίς άδεια.',
    h2Costs: 'Κόστος Επίσκεψης',
    pCosts: 'Η συνολική επίσκεψη στο Άγιο Όρος είναι σχετικά οικονομική, δεδομένου ότι η διαμονή και η σίτιση προσφέρονται δωρεάν.',
    costPermit: 'Διαμονητήριο:',
    costPermitVal: 'Περίπου 25 ευρώ (για Έλληνες και Ευρωπαίους πολίτες).',
    costBoat: 'Εισιτήριο πλοίου:',
    costBoatVal: 'Περίπου 10-15 ευρώ (μονή διαδρομή).',
    costTransport: 'Μεταφορές εντός:',
    costTransportVal: 'Λεωφορεία/σκάφη: 5-15 ευρώ ανά διαδρομή.',
    costAccom: 'Διαμονή & φαγητό:',
    costAccomVal: 'Δωρεάν (δωρεές δεκτές αλλά προαιρετικές).',
    pCostsTotal: 'Συνολικά, ένα τριήμερο ταξίδι μπορεί να κοστίσει μόνο 50-100 ευρώ, εξαιρουμένης της μετακίνησης προς Ουρανούπολη.',
    jsonHeadline: 'Διαμονή στο Άγιο Όρος',
    jsonDescription: 'Πού να μείνετε στο Άγιο Όρος: αρχονταρίκια, φιλοξενία, κόστος και τι να περιμένετε.',
  },
  en: {
    pageTitle: 'Accommodation on Mount Athos',
    intro: 'There are no hotels or tourist accommodations on Mount Athos. Hospitality is provided free of charge by the monasteries in their archontariki (guest quarters), following the ancient monastic tradition. The stay is simple but authentic — a spiritual journey, not a luxury vacation.',
    h2Archontariki: 'Archontariki (Monastery Guest Quarters)',
    pArchontariki: 'Each monastery has an archontariki — the dedicated area for receiving and hosting pilgrims. These are rooms with beds, usually shared dormitory-style, with communal bathrooms.',
    archFree: 'Accommodation is provided free of charge to all permit holders.',
    archWelcome: 'Upon arrival, guests are offered loukoumi (Turkish delight), tsipouro or spoon sweets along with water.',
    archRooms: 'Rooms are clean and simple. Sheets and blankets are provided.',
    archMonk: 'The archontaris (the monk in charge) organizes the stay and informs guests about the schedule.',
    h2Meals: 'Meals & Dining',
    pMeals: 'Monasteries provide meals to visitors in the common trapeza (refectory). The food is simple, frugal and follows the ecclesiastical fasting rules.',
    mealsTwice: 'Usually two meals per day (breakfast after the Divine Liturgy, lunch/dinner).',
    mealsDiet: 'The diet is based on legumes, vegetables, bread, olives and fruit. Meat is never served.',
    mealsFeast: 'During feast days, fish, wine and sweets may be served.',
    mealsSilence: 'Meals take place in silence, while a monk reads spiritual texts.',
    h2Services: 'Participation in Services',
    pServices: 'Pilgrims are expected to participate in the religious services, especially vespers and the Divine Liturgy. This is an integral part of the Mount Athos experience.',
    servVespers: 'Vespers is usually held around 4-5 in the afternoon (Byzantine time).',
    servLiturgy: 'The Divine Liturgy starts very early, often at 3-4 in the morning.',
    servOptional: 'Participation is not mandatory, but is considered a sign of respect.',
    h3Sketes: 'Staying in Sketes and Cells',
    pSketes: 'Besides the large monasteries, you can also stay in sketes (smaller monastic communities) or individual cells. Hospitality there is even more frugal, but the experience is particularly authentic.',
    sketesPhone: 'Prior telephone contact is required.',
    sketesLimited: 'The number of guests is very limited.',
    h2Expect: 'What to Expect',
    pExpect: 'Staying on Mount Athos is an experience of simplicity and spiritual seeking. It is not tourist hospitality — it is monastic life.',
    expectWifi: 'There is no Wi-Fi or television.',
    expectElectricity: 'Electricity may be limited in some monasteries.',
    expectSilence: 'Quiet and silence are fundamental values.',
    expectClothing: 'Appropriate clothing: long trousers, shirt with sleeves.',
    expectPhoto: 'Avoid photographing without permission.',
    h2Costs: 'Visit Costs',
    pCosts: 'An overall visit to Mount Athos is relatively affordable, since accommodation and meals are provided free of charge.',
    costPermit: 'Permit (Diamonitirion):',
    costPermitVal: 'Approximately 25 euros (for Greek and EU citizens).',
    costBoat: 'Boat ticket:',
    costBoatVal: 'Approximately 10-15 euros (one way).',
    costTransport: 'Internal transport:',
    costTransportVal: 'Buses/boats: 5-15 euros per route.',
    costAccom: 'Accommodation & food:',
    costAccomVal: 'Free (donations are accepted but optional).',
    pCostsTotal: 'Overall, a three-day trip can cost as little as 50-100 euros, excluding transport to Ouranoupoli.',
    jsonHeadline: 'Accommodation on Mount Athos',
    jsonDescription: 'Where to stay on Mount Athos: guest quarters, hospitality, costs and what to expect.',
  },
  de: {
    pageTitle: 'Unterkunft auf dem Berg Athos',
    intro: 'Auf dem Berg Athos gibt es keine Hotels oder touristischen Unterkünfte. Die Gastfreundschaft wird von den Klöstern in ihren Archontarikia (Gästehäusern) kostenlos angeboten, gemäß der alten monastischen Tradition. Der Aufenthalt ist einfach, aber authentisch — eine spirituelle Reise, kein Luxusurlaub.',
    h2Archontariki: 'Archontariki (Kloster-Gästehaus)',
    pArchontariki: 'Jedes Kloster verfügt über ein Archontariki — den speziellen Bereich für den Empfang und die Beherbergung von Pilgern. Es handelt sich um Zimmer mit Betten, meist als Schlafsaal, mit Gemeinschaftsbädern.',
    archFree: 'Die Unterkunft wird allen Genehmigungsinhabern kostenlos zur Verfügung gestellt.',
    archWelcome: 'Bei der Ankunft werden Loukoumi (türkischer Honig), Tsipouro oder Löffelsüßigkeiten zusammen mit Wasser angeboten.',
    archRooms: 'Die Zimmer sind sauber und einfach. Bettwäsche und Decken werden bereitgestellt.',
    archMonk: 'Der Archontaris (der zuständige Mönch) organisiert den Aufenthalt und informiert die Gäste über den Tagesablauf.',
    h2Meals: 'Mahlzeiten & Speisen',
    pMeals: 'Die Klöster bieten den Besuchern Mahlzeiten in der gemeinsamen Trapeza (Refektorium) an. Das Essen ist einfach, bescheiden und folgt den kirchlichen Fastenregeln.',
    mealsTwice: 'In der Regel zwei Mahlzeiten pro Tag (Frühstück nach der Göttlichen Liturgie, Mittag-/Abendessen).',
    mealsDiet: 'Die Ernährung basiert auf Hülsenfrüchten, Gemüse, Brot, Oliven und Obst. Fleisch wird nie serviert.',
    mealsFeast: 'An Festtagen können Fisch, Wein und Süßigkeiten serviert werden.',
    mealsSilence: 'Die Mahlzeiten finden in Stille statt, während ein Mönch geistliche Texte vorliest.',
    h2Services: 'Teilnahme an Gottesdiensten',
    pServices: 'Von den Pilgern wird erwartet, dass sie an den Gottesdiensten teilnehmen, insbesondere an der Vesper und der Göttlichen Liturgie. Dies ist ein wesentlicher Bestandteil der Berg-Athos-Erfahrung.',
    servVespers: 'Die Vesper findet normalerweise gegen 16-17 Uhr statt (byzantinische Zeit).',
    servLiturgy: 'Die Göttliche Liturgie beginnt sehr früh, oft um 3-4 Uhr morgens.',
    servOptional: 'Die Teilnahme ist nicht verpflichtend, wird aber als Zeichen des Respekts angesehen.',
    h3Sketes: 'Übernachtung in Skiten und Zellen',
    pSketes: 'Neben den großen Klöstern können Sie auch in Skiten (kleinere Klostergemeinschaften) oder einzelnen Zellen übernachten. Die Gastfreundschaft dort ist noch bescheidener, aber das Erlebnis besonders authentisch.',
    sketesPhone: 'Eine vorherige telefonische Kontaktaufnahme ist erforderlich.',
    sketesLimited: 'Die Anzahl der Gäste ist sehr begrenzt.',
    h2Expect: 'Was Sie erwartet',
    pExpect: 'Ein Aufenthalt auf dem Berg Athos ist eine Erfahrung der Einfachheit und der geistlichen Suche. Es handelt sich nicht um touristische Gastfreundschaft — es ist klösterliches Leben.',
    expectWifi: 'Es gibt kein WLAN oder Fernsehen.',
    expectElectricity: 'Strom kann in einigen Klöstern eingeschränkt sein.',
    expectSilence: 'Ruhe und Stille sind grundlegende Werte.',
    expectClothing: 'Angemessene Kleidung: lange Hosen, Hemd mit Ärmeln.',
    expectPhoto: 'Fotografieren Sie nicht ohne Erlaubnis.',
    h2Costs: 'Besuchskosten',
    pCosts: 'Ein Besuch des Berg Athos ist relativ erschwinglich, da Unterkunft und Verpflegung kostenlos bereitgestellt werden.',
    costPermit: 'Genehmigung (Diamonitirion):',
    costPermitVal: 'Ca. 25 Euro (für griechische und EU-Bürger).',
    costBoat: 'Bootsticket:',
    costBoatVal: 'Ca. 10-15 Euro (einfache Fahrt).',
    costTransport: 'Interne Transfers:',
    costTransportVal: 'Busse/Boote: 5-15 Euro pro Strecke.',
    costAccom: 'Unterkunft & Verpflegung:',
    costAccomVal: 'Kostenlos (Spenden werden angenommen, sind aber freiwillig).',
    pCostsTotal: 'Insgesamt kann eine dreitägige Reise nur 50-100 Euro kosten, ohne den Transport nach Ouranoupoli.',
    jsonHeadline: 'Unterkunft auf dem Berg Athos',
    jsonDescription: 'Wo Sie auf dem Berg Athos übernachten: Gästehäuser, Gastfreundschaft, Kosten und was Sie erwartet.',
  },
  bg: {
    pageTitle: 'Настаняване на Света гора',
    intro: 'На Света гора няма хотели или туристически обекти за настаняване. Гостоприемството се предоставя безплатно от манастирите в техните архонтарикия (гостоприемници), следвайки древната монашеска традиция. Престоят е прост, но автентичен — духовно пътуване, а не луксозна ваканция.',
    h2Archontariki: 'Архонтарики (Манастирска гостоприемница)',
    pArchontariki: 'Всеки манастир разполага с архонтарики — специалната зона за приемане и настаняване на поклонници. Това са стаи с легла, обикновено споделени, с общи бани.',
    archFree: 'Настаняването се предоставя безплатно на всички притежатели на разрешително.',
    archWelcome: 'При пристигане се предлагат лукум, ципуро или сладко от лъжичка заедно с вода.',
    archRooms: 'Стаите са чисти и прости. Осигурени са чаршафи и одеяла.',
    archMonk: 'Архондарисът (отговорният монах) организира престоя и информира гостите за програмата.',
    h2Meals: 'Хранене',
    pMeals: 'Манастирите осигуряват храна за посетителите в общата трапеза (трапезария). Храната е проста, скромна и следва църковните правила за пост.',
    mealsTwice: 'Обикновено две хранения на ден (закуска след Божествената литургия, обяд/вечеря).',
    mealsDiet: 'Диетата се основава на бобови, зеленчуци, хляб, маслини и плодове. Месо никога не се сервира.',
    mealsFeast: 'По време на празници може да се сервират риба, вино и сладкиши.',
    mealsSilence: 'Храненето се провежда в тишина, докато монах чете духовни текстове.',
    h2Services: 'Участие в богослуженията',
    pServices: 'Очаква се поклонниците да участват в богослуженията, особено във вечернята и Божествената литургия. Това е неразделна част от преживяването на Света гора.',
    servVespers: 'Вечернята обикновено се провежда около 16-17 часа (византийско време).',
    servLiturgy: 'Божествената литургия започва много рано, често в 3-4 часа сутринта.',
    servOptional: 'Участието не е задължително, но се счита за знак на уважение.',
    h3Sketes: 'Настаняване в скитове и килии',
    pSketes: 'Освен в големите манастири, можете да отседнете и в скитове (по-малки монашески общности) или отделни килии. Гостоприемството там е още по-скромно, но преживяването е особено автентично.',
    sketesPhone: 'Изисква се предварителен телефонен контакт.',
    sketesLimited: 'Броят на гостите е много ограничен.',
    h2Expect: 'Какво да очаквате',
    pExpect: 'Престоят на Света гора е преживяване на простота и духовно търсене. Това не е туристическо гостоприемство — това е монашески живот.',
    expectWifi: 'Няма Wi-Fi или телевизия.',
    expectElectricity: 'Електричеството може да е ограничено в някои манастири.',
    expectSilence: 'Тишината и мълчанието са основни ценности.',
    expectClothing: 'Подходящо облекло: дълги панталони, риза с ръкави.',
    expectPhoto: 'Избягвайте да снимате без разрешение.',
    h2Costs: 'Разходи за посещение',
    pCosts: 'Цялостното посещение на Света гора е сравнително достъпно, тъй като настаняването и храненето са безплатни.',
    costPermit: 'Разрешително (Диамонитирион):',
    costPermitVal: 'Приблизително 25 евро (за граждани на Гърция и ЕС).',
    costBoat: 'Билет за кораб:',
    costBoatVal: 'Приблизително 10-15 евро (в едната посока).',
    costTransport: 'Вътрешен транспорт:',
    costTransportVal: 'Автобуси/лодки: 5-15 евро на маршрут.',
    costAccom: 'Настаняване и храна:',
    costAccomVal: 'Безплатно (дарения се приемат, но са доброволни).',
    pCostsTotal: 'Общо тридневно пътуване може да струва едва 50-100 евро, без транспорта до Уранополи.',
    jsonHeadline: 'Настаняване на Света гора',
    jsonDescription: 'Къде да отседнете на Света гора: гостоприемници, гостоприемство, разходи и какво да очаквате.',
  },
  ru: {
    pageTitle: 'Проживание на Святой Горе Афон',
    intro: 'На Святой Горе нет гостиниц или туристического жилья. Гостеприимство предоставляется бесплатно монастырями в их архондариках (гостевых помещениях), следуя древней монашеской традиции. Проживание простое, но подлинное — это духовное путешествие, а не роскошный отдых.',
    h2Archontariki: 'Архондарик (Гостевые помещения монастыря)',
    pArchontariki: 'Каждый монастырь имеет архондарик — специальную зону для приёма и размещения паломников. Это комнаты с кроватями, обычно общежитного типа, с общими ванными комнатами.',
    archFree: 'Проживание предоставляется бесплатно всем обладателям разрешения.',
    archWelcome: 'По прибытии гостям предлагают лукум, ципуро или варенье из ложечки вместе с водой.',
    archRooms: 'Комнаты чистые и простые. Предоставляются постельное бельё и одеяла.',
    archMonk: 'Архондарис (ответственный монах) организует проживание и информирует гостей о распорядке.',
    h2Meals: 'Трапеза',
    pMeals: 'Монастыри обеспечивают посетителей питанием в общей трапезной. Пища простая, скромная и соответствует церковным правилам поста.',
    mealsTwice: 'Обычно два приёма пищи в день (завтрак после Божественной литургии, обед/ужин).',
    mealsDiet: 'Рацион основан на бобовых, овощах, хлебе, оливках и фруктах. Мясо никогда не подаётся.',
    mealsFeast: 'В праздничные дни могут подаваться рыба, вино и сладости.',
    mealsSilence: 'Трапеза проходит в молчании, пока монах читает духовные тексты.',
    h2Services: 'Участие в богослужениях',
    pServices: 'Паломники должны участвовать в богослужениях, особенно в вечерне и Божественной литургии. Это неотъемлемая часть афонского опыта.',
    servVespers: 'Вечерня обычно совершается около 16-17 часов (по византийскому времени).',
    servLiturgy: 'Божественная литургия начинается очень рано, часто в 3-4 часа утра.',
    servOptional: 'Участие не является обязательным, но считается знаком уважения.',
    h3Sketes: 'Проживание в скитах и кельях',
    pSketes: 'Помимо крупных монастырей, вы можете остановиться в скитах (небольших монашеских общинах) или отдельных кельях. Гостеприимство там ещё более скромное, но впечатления особенно подлинные.',
    sketesPhone: 'Требуется предварительная телефонная связь.',
    sketesLimited: 'Число гостей очень ограничено.',
    h2Expect: 'Чего ожидать',
    pExpect: 'Пребывание на Святой Горе — это опыт простоты и духовных исканий. Это не туристическое гостеприимство — это монашеская жизнь.',
    expectWifi: 'Wi-Fi и телевидения нет.',
    expectElectricity: 'Электричество может быть ограничено в некоторых монастырях.',
    expectSilence: 'Тишина и безмолвие — основополагающие ценности.',
    expectClothing: 'Подходящая одежда: длинные брюки, рубашка с рукавами.',
    expectPhoto: 'Не фотографируйте без разрешения.',
    h2Costs: 'Стоимость посещения',
    pCosts: 'Посещение Святой Горы относительно доступно, поскольку проживание и питание предоставляются бесплатно.',
    costPermit: 'Разрешение (Диамонитирион):',
    costPermitVal: 'Примерно 25 евро (для граждан Греции и ЕС).',
    costBoat: 'Билет на лодку:',
    costBoatVal: 'Примерно 10-15 евро (в одну сторону).',
    costTransport: 'Внутренний транспорт:',
    costTransportVal: 'Автобусы/лодки: 5-15 евро за маршрут.',
    costAccom: 'Проживание и питание:',
    costAccomVal: 'Бесплатно (пожертвования принимаются, но необязательны).',
    pCostsTotal: 'В целом трёхдневная поездка может обойтись всего в 50-100 евро, без учёта транспорта до Уранополиса.',
    jsonHeadline: 'Проживание на Святой Горе Афон',
    jsonDescription: 'Где остановиться на Святой Горе: гостевые помещения, гостеприимство, расходы и чего ожидать.',
  },
  ro: {
    pageTitle: 'Cazare pe Muntele Athos',
    intro: 'Pe Muntele Athos nu există hoteluri sau cazare turistică. Ospitalitatea este oferită gratuit de mănăstiri în archontarikia (camerele de oaspeți), urmând tradiția monastică străveche. Șederea este simplă, dar autentică — o călătorie spirituală, nu o vacanță de lux.',
    h2Archontariki: 'Archontariki (Camera de oaspeți a mănăstirii)',
    pArchontariki: 'Fiecare mănăstire are un archontariki — zona dedicată pentru primirea și găzduirea pelerinilor. Sunt camere cu paturi, de obicei de tip dormitor comun, cu băi comune.',
    archFree: 'Cazarea este oferită gratuit tuturor deținătorilor de permis.',
    archWelcome: 'La sosire, oaspeților li se oferă rahat, țuică sau dulceață alături de apă.',
    archRooms: 'Camerele sunt curate și simple. Se asigură lenjerie de pat și pături.',
    archMonk: 'Archontarisul (călugărul responsabil) organizează șederea și informează oaspeții despre program.',
    h2Meals: 'Mese și ospăț',
    pMeals: 'Mănăstirile oferă mese vizitatorilor în trapeza (sala de mese) comună. Mâncarea este simplă, frugală și respectă regulile de post ale Bisericii.',
    mealsTwice: 'De obicei, două mese pe zi (micul dejun după Sfânta Liturghie, prânz/cină).',
    mealsDiet: 'Dieta se bazează pe leguminoase, legume, pâine, măsline și fructe. Carnea nu este servită niciodată.',
    mealsFeast: 'În zilele de sărbătoare se pot servi pește, vin și dulciuri.',
    mealsSilence: 'Mesele se desfășoară în tăcere, în timp ce un călugăr citește texte spirituale.',
    h2Services: 'Participarea la slujbe',
    pServices: 'Pelerinii sunt așteptați să participe la slujbele religioase, în special la Vecernie și Sfânta Liturghie. Aceasta este o parte integrantă a experienței de pe Muntele Athos.',
    servVespers: 'Vecernia se ține de obicei în jurul orei 16-17 (ora bizantină).',
    servLiturgy: 'Sfânta Liturghie începe foarte devreme, adesea la 3-4 dimineața.',
    servOptional: 'Participarea nu este obligatorie, dar este considerată un semn de respect.',
    h3Sketes: 'Cazare în schituri și chilii',
    pSketes: 'Pe lângă mănăstirile mari, puteți sta și în schituri (comunități monastice mai mici) sau chilii individuale. Ospitalitatea acolo este și mai frugală, dar experiența este deosebit de autentică.',
    sketesPhone: 'Este necesar contactul telefonic prealabil.',
    sketesLimited: 'Numărul de oaspeți este foarte limitat.',
    h2Expect: 'La ce să vă așteptați',
    pExpect: 'Șederea pe Muntele Athos este o experiență de simplitate și căutare spirituală. Nu este ospitalitate turistică — este viață monastică.',
    expectWifi: 'Nu există Wi-Fi sau televizor.',
    expectElectricity: 'Electricitatea poate fi limitată în unele mănăstiri.',
    expectSilence: 'Liniștea și tăcerea sunt valori fundamentale.',
    expectClothing: 'Îmbrăcăminte adecvată: pantaloni lungi, cămașă cu mâneci.',
    expectPhoto: 'Evitați să fotografiați fără permisiune.',
    h2Costs: 'Costul vizitei',
    pCosts: 'O vizită la Muntele Athos este relativ accesibilă, deoarece cazarea și mesele sunt oferite gratuit.',
    costPermit: 'Permis (Diamonitirion):',
    costPermitVal: 'Aproximativ 25 de euro (pentru cetățeni greci și UE).',
    costBoat: 'Bilet de barcă:',
    costBoatVal: 'Aproximativ 10-15 euro (dus).',
    costTransport: 'Transport intern:',
    costTransportVal: 'Autobuze/bărci: 5-15 euro pe traseu.',
    costAccom: 'Cazare și mâncare:',
    costAccomVal: 'Gratuit (donațiile sunt acceptate, dar opționale).',
    pCostsTotal: 'Per total, o excursie de trei zile poate costa doar 50-100 de euro, fără transportul spre Ouranoupoli.',
    jsonHeadline: 'Cazare pe Muntele Athos',
    jsonDescription: 'Unde să stați pe Muntele Athos: camere de oaspeți, ospitalitate, costuri și la ce să vă așteptați.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = tr('metaAccommodationTitle', locale);
  const description = tr('metaAccommodationDesc', locale);
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, 'mount-athos/accommodation'),
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, 'mount-athos/accommodation')])),
    },
  };
}

export default async function AccommodationPage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{tr('navAccommodation', locale)}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {c.pageTitle}
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed">
          {c.intro}
        </p>

        {/* Archontariki */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <BedDouble className="w-6 h-6 text-amber-700" />
          {c.h2Archontariki}
        </h2>
        <p>{c.pArchontariki}</p>
        <ul>
          <li>{c.archFree}</li>
          <li>{c.archWelcome}</li>
          <li>{c.archRooms}</li>
          <li>{c.archMonk}</li>
        </ul>

        {/* Food */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <UtensilsCrossed className="w-6 h-6 text-amber-700" />
          {c.h2Meals}
        </h2>
        <p>{c.pMeals}</p>
        <ul>
          <li>{c.mealsTwice}</li>
          <li>{c.mealsDiet}</li>
          <li>{c.mealsFeast}</li>
          <li>{c.mealsSilence}</li>
        </ul>

        {/* Participation in services */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Church className="w-6 h-6 text-amber-700" />
          {c.h2Services}
        </h2>
        <p>{c.pServices}</p>
        <ul>
          <li>{c.servVespers}</li>
          <li>{c.servLiturgy}</li>
          <li>{c.servOptional}</li>
        </ul>

        {/* Sketes */}
        <h3 className="text-xl font-bold text-gray-900 mt-8">
          {c.h3Sketes}
        </h3>
        <p>{c.pSketes}</p>
        <ul>
          <li>{c.sketesPhone}</li>
          <li>{c.sketesLimited}</li>
        </ul>

        {/* What to expect */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Info className="w-6 h-6 text-amber-700" />
          {c.h2Expect}
        </h2>
        <p>{c.pExpect}</p>
        <ul>
          <li>{c.expectWifi}</li>
          <li>{c.expectElectricity}</li>
          <li>{c.expectSilence}</li>
          <li>{c.expectClothing}</li>
          <li>{c.expectPhoto}</li>
        </ul>

        {/* Costs */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Wallet className="w-6 h-6 text-amber-700" />
          {c.h2Costs}
        </h2>
        <p>{c.pCosts}</p>
        <ul>
          <li>
            <strong>{c.costPermit}</strong>{' '}{c.costPermitVal}
          </li>
          <li>
            <strong>{c.costBoat}</strong>{' '}{c.costBoatVal}
          </li>
          <li>
            <strong>{c.costTransport}</strong>{' '}{c.costTransportVal}
          </li>
          <li>
            <strong>{c.costAccom}</strong>{' '}{c.costAccomVal}
          </li>
        </ul>
        <p>{c.pCostsTotal}</p>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
        <Link href="/mount-athos/getting-there" className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
          <ChevronLeft className="w-4 h-4" />
          {tr('navGettingThere', locale)}
        </Link>
        <Link href="/mount-athos/daily-life" className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
          {tr('navDailyLife', locale)} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: c.jsonHeadline,
        description: c.jsonDescription,
        author: { '@type': 'Organization', name: 'Chalkidiki Hub' },
        publisher: { '@type': 'Organization', name: 'Chalkidiki Hub', url: SITE_URL },
        mainEntityOfPage: localeUrl(locale, 'mount-athos/accommodation'),
      })}} />
    </article>
  );
}
