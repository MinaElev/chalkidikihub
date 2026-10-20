import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft, BedDouble, Church, UtensilsCrossed, Wallet, Info } from 'lucide-react';
import { tr } from '@/content/editorial/athos';
import { localeUrl, finalizeTitle } from '@/lib/seo/compat';
import { hreflangMap } from '@/lib/seo/site';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

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
    servVespers: 'Ο εσπερινός τελείται αργά το απόγευμα (το καλοκαίρι γύρω στις 17:00). Πολλές μονές ακολουθούν τη βυζαντινή ώρα, οπότε οι ώρες διαφέρουν.',
    servLiturgy: 'Η ημέρα ξεκινά πολύ νωρίς: ο Όρθρος αρχίζει γύρω στις 3-4 τα ξημερώματα και ακολουθεί η Θεία Λειτουργία με το χάραμα.',
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
    costPermitVal: 'Περίπου 25-30 ευρώ, ανάλογα με την κατηγορία επισκέπτη.',
    costBoat: 'Εισιτήριο πλοίου:',
    costBoatVal: 'Διαφέρει ανάλογα με το πλοίο και τη διαδρομή· δείτε τις τρέχουσες τιμές στο λιμάνι της Ουρανούπολης.',
    costTransport: 'Μεταφορές εντός:',
    costTransportVal: 'Μικρά λεωφορεία και καραβάκια της ακτής, με χαμηλό εισιτήριο που διαφέρει ανά διαδρομή.',
    costAccom: 'Διαμονή & φαγητό:',
    costAccomVal: 'Δωρεάν (δωρεές δεκτές αλλά προαιρετικές).',
    pCostsTotal: 'Καθώς η διαμονή και το φαγητό προσφέρονται δωρεάν, τα κύρια έξοδα είναι το διαμονητήριο και οι μετακινήσεις.',
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
    servVespers: 'Vespers is held in the late afternoon (around 17:00 in summer). Many monasteries keep Byzantine time, so exact times vary.',
    servLiturgy: 'The day starts very early: Orthros begins around 3-4 in the morning and the Divine Liturgy follows at dawn.',
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
    costPermitVal: 'About 25-30 euros, depending on the visitor category.',
    costBoat: 'Boat ticket:',
    costBoatVal: 'Varies by vessel and route; check current fares at the port of Ouranoupoli.',
    costTransport: 'Internal transport:',
    costTransportVal: 'Minibuses and coastal boats, with low fares that vary by route.',
    costAccom: 'Accommodation & food:',
    costAccomVal: 'Free (donations are accepted but optional).',
    pCostsTotal: 'Since accommodation and food are free, the main costs are the permit and transport.',
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
    servVespers: 'Die Vesper findet am späten Nachmittag statt (im Sommer gegen 17 Uhr). Viele Klöster folgen der byzantinischen Zeit, daher variieren die Uhrzeiten.',
    servLiturgy: 'Der Tag beginnt sehr früh: Der Orthros beginnt gegen 3-4 Uhr morgens, die Göttliche Liturgie folgt im Morgengrauen.',
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
    pCosts: 'Ein Besuch des Berges Athos ist relativ erschwinglich, da Unterkunft und Verpflegung kostenlos bereitgestellt werden.',
    costPermit: 'Genehmigung (Diamonitirion):',
    costPermitVal: 'Etwa 25-30 Euro, je nach Besucherkategorie.',
    costBoat: 'Bootsticket:',
    costBoatVal: 'Je nach Schiff und Strecke unterschiedlich; aktuelle Preise am Hafen von Ouranoupoli prüfen.',
    costTransport: 'Interne Transfers:',
    costTransportVal: 'Kleinbusse und Küstenboote mit günstigen, je nach Strecke unterschiedlichen Preisen.',
    costAccom: 'Unterkunft & Verpflegung:',
    costAccomVal: 'Kostenlos (Spenden werden angenommen, sind aber freiwillig).',
    pCostsTotal: 'Da Unterkunft und Verpflegung kostenlos sind, fallen vor allem die Genehmigung und die Fahrten ins Gewicht.',
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
    servVespers: 'Вечернята се служи късно следобед (през лятото около 17:00). Много манастири спазват византийското време, затова часовете се различават.',
    servLiturgy: 'Денят започва много рано: утренята започва около 3-4 часа сутринта, а Божествената литургия следва призори.',
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
    costPermitVal: 'Около 25-30 евро в зависимост от категорията посетител.',
    costBoat: 'Билет за кораб:',
    costBoatVal: 'Зависи от плавателния съд и маршрута; проверете актуалните цени на пристанището в Уранополи.',
    costTransport: 'Вътрешен транспорт:',
    costTransportVal: 'Микробуси и крайбрежни лодки с ниски цени, които зависят от маршрута.',
    costAccom: 'Настаняване и храна:',
    costAccomVal: 'Безплатно (дарения се приемат, но са доброволни).',
    pCostsTotal: 'Тъй като настаняването и храната са безплатни, основните разходи са разрешителното и транспортът.',
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
    servVespers: 'Вечерня совершается ближе к вечеру (летом около 17:00). Многие монастыри живут по византийскому времени, поэтому часы различаются.',
    servLiturgy: 'День начинается очень рано: утреня начинается около 3-4 часов утра, а на рассвете за ней следует Божественная литургия.',
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
    costPermitVal: 'Около 25-30 евро в зависимости от категории посетителя.',
    costBoat: 'Билет на лодку:',
    costBoatVal: 'Зависит от судна и маршрута; актуальные цены уточняйте в порту Уранополиса.',
    costTransport: 'Внутренний транспорт:',
    costTransportVal: 'Микроавтобусы и прибрежные катера; цены невысокие и зависят от маршрута.',
    costAccom: 'Проживание и питание:',
    costAccomVal: 'Бесплатно (пожертвования принимаются, но необязательны).',
    pCostsTotal: 'Поскольку проживание и питание бесплатны, основные расходы — это разрешение и транспорт.',
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
    servVespers: 'Vecernia se oficiază spre seară (vara în jurul orei 17:00). Multe mănăstiri țin ora bizantină, așa că orele diferă.',
    servLiturgy: 'Ziua începe foarte devreme: Utrenia începe în jurul orei 3-4 dimineața, iar Sfânta Liturghie urmează în zori.',
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
    costPermitVal: 'Aproximativ 25-30 de euro, în funcție de categoria vizitatorului.',
    costBoat: 'Bilet de barcă:',
    costBoatVal: 'Diferă în funcție de navă și rută; verificați tarifele actuale în portul Ouranoupoli.',
    costTransport: 'Transport intern:',
    costTransportVal: 'Microbuze și ambarcațiuni de coastă, cu tarife mici care diferă în funcție de rută.',
    costAccom: 'Cazare și mâncare:',
    costAccomVal: 'Gratuit (donațiile sunt acceptate, dar opționale).',
    pCostsTotal: 'Deoarece cazarea și masa sunt gratuite, principalele cheltuieli sunt permisul și transportul.',
    jsonHeadline: 'Cazare pe Muntele Athos',
    jsonDescription: 'Unde să stați pe Muntele Athos: camere de oaspeți, ospitalitate, costuri și la ce să vă așteptați.',
  },
  sr: {
    pageTitle: 'Smeštaj na Svetoj Gori',
    intro: 'Na Svetoj Gori nema hotela ni turističkog smeštaja. Manastiri besplatno ugošćuju posetioce u svojim arhondarikima (konacima za goste), po drevnoj monaškoj tradiciji. Boravak je jednostavan, ali autentičan – duhovno putovanje, a ne luksuzni odmor.',
    h2Archontariki: 'Arhondarici (manastirski konaci za goste)',
    pArchontariki: 'Svaki manastir ima arhondarik – prostor namenjen prijemu i smeštaju hodočasnika. To su sobe s krevetima, najčešće zajedničke, sa zajedničkim kupatilima.',
    archFree: 'Smeštaj je besplatan za sve koji imaju dozvolu za ulazak.',
    archWelcome: 'Po dolasku gostima se nudi ratluk, cipuro ili slatko, uz čašu vode.',
    archRooms: 'Sobe su čiste i jednostavne. Posteljina i ćebad su obezbeđeni.',
    archMonk: 'Arhondar (monah zadužen za goste) organizuje boravak i obaveštava goste o rasporedu.',
    h2Meals: 'Obroci i trpeza',
    pMeals: 'Manastiri posetiocima služe obroke u zajedničkoj trpezariji. Hrana je jednostavna, skromna i prati crkvena pravila posta.',
    mealsTwice: 'Obično dva obroka dnevno (prvi posle Božanstvene liturgije, drugi uveče).',
    mealsDiet: 'Ishrana se zasniva na mahunarkama, povrću, hlebu, maslinama i voću. Meso se nikada ne služi.',
    mealsFeast: 'Za praznike se mogu služiti riba, vino i slatkiši.',
    mealsSilence: 'Obroci protiču u tišini, dok jedan monah čita duhovne tekstove.',
    h2Services: 'Učešće u bogosluženjima',
    pServices: 'Od hodočasnika se očekuje da prisustvuju bogosluženjima, naročito večernju i Božanstvenoj liturgiji. To je sastavni deo doživljaja Svete Gore.',
    servVespers: 'Večernje se služi kasno popodne (leti oko 17:00). Mnogi manastiri drže vizantijsko vreme, pa se tačni časovi razlikuju.',
    servLiturgy: 'Dan počinje veoma rano: jutrenje počinje oko 3-4 sata ujutru, a u svitanje sledi Božanstvena liturgija.',
    servOptional: 'Učešće nije obavezno, ali se smatra znakom poštovanja.',
    h3Sketes: 'Boravak u skitovima i kelijama',
    pSketes: 'Osim u velikim manastirima, možete odsesti i u skitovima (manjim monaškim zajednicama) ili pojedinačnim kelijama. Gostoprimstvo je tamo još skromnije, ali je doživljaj naročito autentičan.',
    sketesPhone: 'Neophodan je prethodni telefonski dogovor.',
    sketesLimited: 'Broj gostiju je veoma ograničen.',
    h2Expect: 'Šta da očekujete',
    pExpect: 'Boravak na Svetoj Gori je iskustvo jednostavnosti i duhovnog traganja. To nije turističko gostoprimstvo – to je monaški život.',
    expectWifi: 'Nema bežičnog interneta ni televizije.',
    expectElectricity: 'U nekim manastirima struja može biti ograničena.',
    expectSilence: 'Mir i tišina su osnovne vrednosti.',
    expectClothing: 'Prikladna odeća: duge pantalone i košulja s rukavima.',
    expectPhoto: 'Ne fotografišite bez dozvole.',
    h2Costs: 'Troškovi posete',
    pCosts: 'Poseta Svetoj Gori je relativno povoljna, jer su smeštaj i obroci besplatni.',
    costPermit: 'Dozvola (dijamonitirion):',
    costPermitVal: 'Oko 25-30 evra, u zavisnosti od kategorije posetioca.',
    costBoat: 'Karta za brod:',
    costBoatVal: 'Zavisi od broda i linije; aktuelne cene proverite u luci Uranupolis.',
    costTransport: 'Prevoz na Svetoj Gori:',
    costTransportVal: 'Mali autobusi i priobalni brodovi, s niskim cenama koje zavise od linije.',
    costAccom: 'Smeštaj i hrana:',
    costAccomVal: 'Besplatno (prilozi se primaju, ali nisu obavezni).',
    pCostsTotal: 'Pošto su smeštaj i hrana besplatni, glavni troškovi su dozvola i prevoz.',
    jsonHeadline: 'Smeštaj na Svetoj Gori',
    jsonDescription: 'Gde odsesti na Svetoj Gori: arhondarici, gostoprimstvo, troškovi i šta da očekujete.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = tr('metaAccommodationTitle', locale);
  const description = tr('metaAccommodationDesc', locale);
  return {
    title: { absolute: finalizeTitle(title) },
    description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, 'mount-athos/accommodation'),
      languages: hreflangMap(`/mount-athos/accommodation`),
    },
  };
}

export default async function AccommodationPage({ params }: Props) {
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
        datePublished: '2025-06-01',
        dateModified: '2026-04-20',
        author: { '@type': 'Organization', name: 'Chalkidiki Hub' },
        publisher: { '@type': 'Organization', name: 'Chalkidiki Hub', url: SITE_URL },
        mainEntityOfPage: localeUrl(locale, 'mount-athos/accommodation'),
      })}} />
    </article>
  );
}
