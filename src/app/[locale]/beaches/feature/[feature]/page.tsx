import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import PageClient from './_client';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

/* ------------------------------------------------------------------ */
/*  FEATURE_LABELS — covers all 12 DB features + legacy hyphenated    */
/* ------------------------------------------------------------------ */
const FEATURE_LABELS: Record<string, Record<string, string>> = {
  'sandy': { el: 'Αμμώδεις', en: 'Sandy', de: 'Sandstrände', bg: 'Пясъчни', ru: 'Песчаные', ro: 'Cu nisip', sr: 'Peščane' },
  'pebble': { el: 'Βοτσαλωτές', en: 'Pebble', de: 'Kiesstrände', bg: 'Чакълести', ru: 'Галечные', ro: 'Cu pietriș', sr: 'Šljunkovite' },
  'organized': { el: 'Οργανωμένες', en: 'Organized', de: 'Organisierte', bg: 'Организирани', ru: 'Организованные', ro: 'Organizate', sr: 'Organizovane' },
  'free': { el: 'Ελεύθερες', en: 'Free', de: 'Freie', bg: 'Безплатни', ru: 'Бесплатные', ro: 'Gratuite', sr: 'Besplatne' },
  'parking': { el: 'Με Πάρκινγκ', en: 'With Parking', de: 'Mit Parkplatz', bg: 'С паркинг', ru: 'С парковкой', ro: 'Cu parcare', sr: 'Sa parkingom' },
  'beachBar': { el: 'Με Beach Bar', en: 'With Beach Bar', de: 'Mit Beach Bar', bg: 'С плажен бар', ru: 'С пляжным баром', ro: 'Cu bar de plajă', sr: 'Sa bič barom' },
  'shallowWater': { el: 'Ρηχά Νερά', en: 'Shallow Water', de: 'Flaches Wasser', bg: 'Плитка вода', ru: 'Мелководье', ro: 'Apă puțin adâncă', sr: 'Plitka voda' },
  'waterSports': { el: 'Θαλάσσια Σπορ', en: 'Water Sports', de: 'Wassersport', bg: 'Водни спортове', ru: 'Водные виды спорта', ro: 'Sporturi nautice', sr: 'Vodeni sportovi' },
  'accessible': { el: 'Προσβάσιμες', en: 'Accessible', de: 'Barrierefreie', bg: 'Достъпни', ru: 'Доступные', ro: 'Accesibile', sr: 'Pristupačne' },
  'sunbeds': { el: 'Με Ξαπλώστρες', en: 'With Sunbeds', de: 'Mit Liegen', bg: 'С шезлонги', ru: 'С шезлонгами', ro: 'Cu șezlonguri', sr: 'Sa ležaljkama' },
  'lifeguard': { el: 'Με Ναυαγοσώστη', en: 'With Lifeguard', de: 'Mit Rettungsschwimmer', bg: 'С спасител', ru: 'Со спасателем', ro: 'Cu salvamar', sr: 'Sa spasilcem' },
  'nudist': { el: 'Γυμνιστών', en: 'Nudist', de: 'FKK', bg: 'Нудистки', ru: 'Нудистские', ro: 'Nudiste', sr: 'Nudističke' },
  // Legacy hyphenated keys for backward compatibility
  'secluded': { el: 'Απομονωμένες', en: 'Secluded', de: 'Abgelegene', bg: 'Уединени', ru: 'Уединённые', ro: 'Izolate', sr: 'Skrivene' },
  'family-friendly': { el: 'Οικογενειακές', en: 'Family-Friendly', de: 'Familienfreundliche', bg: 'За семейства', ru: 'Семейные', ro: 'Pentru familii', sr: 'Za porodice' },
  'blue-flag': { el: 'Γαλάζια Σημαία', en: 'Blue Flag', de: 'Blaue Flagge', bg: 'Син флаг', ru: 'Голубой флаг', ro: 'Steag Albastru', sr: 'Plava zastava' },
  'water-sports': { el: 'Θαλάσσια Σπορ', en: 'Water Sports', de: 'Wassersport', bg: 'Водни спортове', ru: 'Водные виды спорта', ro: 'Sporturi nautice', sr: 'Vodeni sportovi' },
};

/* ------------------------------------------------------------------ */
/*  FEATURE_DESCRIPTIONS — rich SEO meta descriptions (150+ chars)    */
/* ------------------------------------------------------------------ */
const FEATURE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  'sandy': {
    el: 'Ανακαλύψτε τις καλύτερες αμμώδεις παραλίες στη Χαλκιδική — λεπτή χρυσή άμμος, τιρκουάζ νερά, ιδανικές για οικογένειες και ζευγάρια στην Κασσάνδρα, Σιθωνία και Άθως.',
    en: 'Discover the best sandy beaches in Halkidiki, Greece — fine golden sand, turquoise waters, perfect for families and couples across Kassandra, Sithonia and Athos peninsulas.',
    de: 'Entdecken Sie die besten Sandstrände in Chalkidiki, Griechenland — feiner goldener Sand, türkisfarbenes Wasser, perfekt für Familien und Paare auf Kassandra, Sithonia und Athos.',
    bg: 'Открийте най-добрите пясъчни плажове в Халкидики, Гърция — фин златен пясък, тюркоазени води, идеални за семейства и двойки в Касандра, Ситония и Атон.',
    ru: 'Откройте лучшие песчаные пляжи Халкидики, Греция — мелкий золотистый песок, бирюзовые воды, идеальные для семей и пар на полуостровах Кассандра, Ситония и Афон.',
    ro: 'Descoperiți cele mai bune plaje cu nisip din Halkidiki, Grecia — nisip fin auriu, ape turcoaz, perfecte pentru familii și cupluri pe Kassandra, Sithonia și Athos.',
    sr: 'Otkrijte najbolje peščane plaže na Halkidikiju, Grčka — fin zlatni pesak, tirkizne vode, idealne za porodice i parove na Kasandri, Sitoniji i Atosu.',
  },
  'pebble': {
    el: 'Βοτσαλωτές παραλίες στη Χαλκιδική με κρυστάλλινα νερά — ιδανικές για snorkeling, καταδύσεις και φυσική ομορφιά στη Σιθωνία και τον Άθω.',
    en: 'Pebble beaches in Halkidiki with crystal-clear waters — ideal for snorkeling, diving and natural beauty across Sithonia and Athos peninsulas in Greece.',
    de: 'Kiesstrände in Chalkidiki mit kristallklarem Wasser — ideal zum Schnorcheln, Tauchen und für Naturliebhaber auf Sithonia und Athos in Griechenland.',
    bg: 'Чакълести плажове в Халкидики с кристално чисти води — идеални за шнорхелинг, гмуркане и природна красота в Ситония и Атон.',
    ru: 'Галечные пляжи Халкидики с кристально чистой водой — идеальны для снорклинга, дайвинга и природной красоты на полуостровах Ситония и Афон.',
    ro: 'Plaje cu pietriș în Halkidiki cu ape cristaline — ideale pentru snorkeling, scufundări și frumusețe naturală pe Sithonia și Athos.',
    sr: 'Šljunkovite plaže na Halkidikiju sa kristalno čistim vodama — idealne za ronjenje, zaranjanje i prirodnu lepotu na Sitoniji i Atosu.',
  },
  'organized': {
    el: 'Οργανωμένες παραλίες στη Χαλκιδική με ξαπλώστρες, ομπρέλες, beach bar και ναυαγοσώστη — κορυφαίες επιλογές στην Κασσάνδρα και τη Σιθωνία.',
    en: 'Organized beaches in Halkidiki with sunbeds, umbrellas, beach bars and lifeguards — top picks across Kassandra and Sithonia peninsulas in Greece.',
    de: 'Organisierte Strände in Chalkidiki mit Liegen, Sonnenschirmen, Strandbars und Rettungsschwimmern — die besten Strände auf Kassandra und Sithonia.',
    bg: 'Организирани плажове в Халкидики с шезлонги, чадъри, плажни барове и спасители — топ избори в Касандра и Ситония.',
    ru: 'Организованные пляжи Халкидики с шезлонгами, зонтами, пляжными барами и спасателями — лучшие пляжи на Кассандре и Ситонии.',
    ro: 'Plaje organizate în Halkidiki cu șezlonguri, umbrele, baruri de plajă și salvamari — cele mai bune alegeri pe Kassandra și Sithonia.',
    sr: 'Organizovane plaže na Halkidikiju sa ležaljkama, suncobranima, beach barovima i spasiocima — najbolji izbori na Kasandri i Sitoniji.',
  },
  'free': {
    el: 'Δωρεάν παραλίες στη Χαλκιδική χωρίς ξαπλώστρες και είσοδο — αυθεντική φύση, ελευθερία και ηρεμία κυρίως στη Σιθωνία και τον Άθω.',
    en: 'Free beaches in Halkidiki with no entry fee or sunbed charges — authentic nature, freedom and tranquility mainly on Sithonia and Athos peninsulas.',
    de: 'Freie Strände in Chalkidiki ohne Eintritt und Liegengebühren — authentische Natur, Freiheit und Ruhe vor allem auf Sithonia und Athos.',
    bg: 'Безплатни плажове в Халкидики без входна такса и такса за шезлонги — автентична природа, свобода и спокойствие предимно в Ситония и Атон.',
    ru: 'Бесплатные пляжи Халкидики без входной платы и аренды шезлонгов — настоящая природа, свобода и спокойствие на Ситонии и Афоне.',
    ro: 'Plaje gratuite în Halkidiki fără taxă de intrare sau taxe pentru șezlonguri — natură autentică, libertate și liniște pe Sithonia și Athos.',
    sr: 'Besplatne plaže na Halkidikiju bez ulaznice i naknade za ležaljke — autentična priroda, sloboda i mir na Sitoniji i Atosu.',
  },
  'parking': {
    el: 'Παραλίες με εύκολο πάρκινγκ στη Χαλκιδική — δωρεάν στάθμευση κοντά στη θάλασσα, ιδανικές για οικογένειες με αυτοκίνητο στην Κασσάνδρα και Σιθωνία.',
    en: 'Beaches with easy parking in Halkidiki — free parking near the sea, ideal for families traveling by car across Kassandra and Sithonia peninsulas.',
    de: 'Strände mit Parkplatz in Chalkidiki — kostenlose Parkplätze am Meer, ideal für Familien mit Auto auf Kassandra und Sithonia.',
    bg: 'Плажове с лесен паркинг в Халкидики — безплатно паркиране близо до морето, идеално за семейства с кола.',
    ru: 'Пляжи с удобной парковкой в Халкидики — бесплатная стоянка у моря, идеально для семей на автомобиле на Кассандре и Ситонии.',
    ro: 'Plaje cu parcare ușoară în Halkidiki — parcare gratuită lângă mare, ideale pentru familii care călătoresc cu mașina.',
    sr: 'Plaže sa lakim parkingom na Halkidikiju — besplatno parkiranje blizu mora, idealne za porodice sa automobilom na Kasandri i Sitoniji.',
  },
  'beachBar': {
    el: 'Παραλίες με beach bar στη Χαλκιδική — κοκτέιλ, μουσική και ατμόσφαιρα δίπλα στη θάλασσα στις καλύτερες παραλίες της Κασσάνδρας και Σιθωνίας.',
    en: 'Beaches with beach bars in Halkidiki — cocktails, music and seaside atmosphere at the best beaches across Kassandra and Sithonia in Greece.',
    de: 'Strände mit Beach Bar in Chalkidiki — Cocktails, Musik und Meeresstimmung an den besten Stränden auf Kassandra und Sithonia in Griechenland.',
    bg: 'Плажове с плажен бар в Халкидики — коктейли, музика и атмосфера край морето на най-добрите плажове в Касандра и Ситония.',
    ru: 'Пляжи с пляжными барами в Халкидики — коктейли, музыка и морская атмосфера на лучших пляжах Кассандры и Ситонии.',
    ro: 'Plaje cu baruri de plajă în Halkidiki — cocktailuri, muzică și atmosferă la malul mării pe cele mai bune plaje din Kassandra și Sithonia.',
    sr: 'Plaže sa beach barovima na Halkidikiju — kokteli, muzika i atmosfera pored mora na najboljim plažama Kasandre i Sitonije.',
  },
  'shallowWater': {
    el: 'Παραλίες με ρηχά νερά στη Χαλκιδική — ασφαλείς για μικρά παιδιά, ιδανικές για οικογένειες, με ήρεμη θάλασσα στην Κασσάνδρα και Σιθωνία.',
    en: 'Shallow water beaches in Halkidiki — safe for small children, ideal for families, with calm seas across Kassandra and Sithonia in Greece.',
    de: 'Strände mit flachem Wasser in Chalkidiki — sicher für kleine Kinder, ideal für Familien, mit ruhigem Meer auf Kassandra und Sithonia.',
    bg: 'Плажове с плитка вода в Халкидики — безопасни за малки деца, идеални за семейства, със спокойно море в Касандра и Ситония.',
    ru: 'Пляжи с мелководьем в Халкидики — безопасные для маленьких детей, идеальные для семей, со спокойным морем на Кассандре и Ситонии.',
    ro: 'Plaje cu apă puțin adâncă în Halkidiki — sigure pentru copii mici, ideale pentru familii, cu mare liniștită pe Kassandra și Sithonia.',
    sr: 'Plaže sa plitkom vodom na Halkidikiju — bezbedne za malu decu, idealne za porodice, sa mirnim morem na Kasandri i Sitoniji.',
  },
  'waterSports': {
    el: 'Παραλίες για θαλάσσια σπορ στη Χαλκιδική — windsurf, jet ski, kayak, SUP, σκι στις καλύτερες παραλίες της Κασσάνδρας και Σιθωνίας.',
    en: 'Water sports beaches in Halkidiki — windsurf, jet ski, kayak, SUP and water skiing at the best beaches across Kassandra and Sithonia in Greece.',
    de: 'Wassersport-Strände in Chalkidiki — Windsurfen, Jet-Ski, Kajak, SUP und Wasserski an den besten Stränden auf Kassandra und Sithonia.',
    bg: 'Плажове за водни спортове в Халкидики — уиндсърф, джет ски, каяк, SUP и водни ски на най-добрите плажове в Касандра и Ситония.',
    ru: 'Пляжи для водных видов спорта в Халкидики — виндсёрфинг, гидроцикл, каяк, SUP и водные лыжи на лучших пляжах Кассандры и Ситонии.',
    ro: 'Plaje pentru sporturi nautice în Halkidiki — windsurf, jet ski, caiac, SUP și schi nautic pe cele mai bune plaje din Kassandra și Sithonia.',
    sr: 'Plaže za vodene sportove na Halkidikiju — windsurf, jet ski, kajak, SUP i skijanje na vodi na najboljim plažama Kasandre i Sitonije.',
  },
  'accessible': {
    el: 'Προσβάσιμες παραλίες στη Χαλκιδική για ΑΜΕΑ — ράμπες, ειδικά αμαξίδια θάλασσας, εύκολη πρόσβαση στην Κασσάνδρα και Σιθωνία.',
    en: 'Wheelchair accessible beaches in Halkidiki with ramps and sea wheelchairs — easy access for everyone across Kassandra and Sithonia in Greece.',
    de: 'Barrierefreie Strände in Chalkidiki mit Rampen und Strandrollstühlen — einfacher Zugang für alle auf Kassandra und Sithonia in Griechenland.',
    bg: 'Достъпни плажове в Халкидики за хора с увреждания — рампи, специални морски инвалидни колички, лесен достъп в Касандра и Ситония.',
    ru: 'Доступные пляжи Халкидики для людей с инвалидностью — пандусы, морские коляски, удобный подход на Кассандре и Ситонии.',
    ro: 'Plaje accesibile în Halkidiki pentru persoane cu dizabilități — rampe, scaune cu rotile de mare, acces ușor pe Kassandra și Sithonia.',
    sr: 'Pristupačne plaže na Halkidikiju za osobe sa invaliditetom — rampe, morska kolica, lak pristup na Kasandri i Sitoniji.',
  },
  'sunbeds': {
    el: 'Παραλίες με ξαπλώστρες και ομπρέλες στη Χαλκιδική — άνεση, χαλάρωση και σέρβις στην άμμο στις καλύτερες παραλίες Κασσάνδρας και Σιθωνίας.',
    en: 'Beaches with sunbeds and umbrellas in Halkidiki — comfort, relaxation and beach service at the best beaches across Kassandra and Sithonia.',
    de: 'Strände mit Liegen und Sonnenschirmen in Chalkidiki — Komfort, Entspannung und Strandservice an den besten Stränden auf Kassandra und Sithonia.',
    bg: 'Плажове с шезлонги и чадъри в Халкидики — комфорт, релакс и обслужване на плажа в Касандра и Ситония.',
    ru: 'Пляжи с шезлонгами и зонтами в Халкидики — комфорт, отдых и пляжный сервис на лучших пляжах Кассандры и Ситонии.',
    ro: 'Plaje cu șezlonguri și umbrele în Halkidiki — confort, relaxare și servicii pe plajă pe cele mai bune plaje din Kassandra și Sithonia.',
    sr: 'Plaže sa ležaljkama i suncobranima na Halkidikiju — komfor, opuštanje i usluge na plaži na Kasandri i Sitoniji.',
  },
  'lifeguard': {
    el: 'Ασφαλείς παραλίες με ναυαγοσώστη στη Χαλκιδική — ιδανικές για οικογένειες με παιδιά, με πρώτες βοήθειες και εποπτεία στην Κασσάνδρα και Σιθωνία.',
    en: 'Safe beaches with lifeguards in Halkidiki — ideal for families with children, with first aid and supervision across Kassandra and Sithonia.',
    de: 'Sichere Strände mit Rettungsschwimmern in Chalkidiki — ideal für Familien mit Kindern, mit Erster Hilfe und Überwachung auf Kassandra und Sithonia.',
    bg: 'Безопасни плажове със спасители в Халкидики — идеални за семейства с деца, с първа помощ и наблюдение в Касандра и Ситония.',
    ru: 'Безопасные пляжи со спасателями в Халкидики — идеальны для семей с детьми, с первой помощью и наблюдением на Кассандре и Ситонии.',
    ro: 'Plaje sigure cu salvamari în Halkidiki — ideale pentru familii cu copii, cu prim ajutor și supraveghere pe Kassandra și Sithonia.',
    sr: 'Bezbedne plaže sa spasiocima na Halkidikiju — idealne za porodice sa decom, sa prvom pomoći i nadzorom na Kasandri i Sitoniji.',
  },
  'nudist': {
    el: 'Παραλίες γυμνιστών στη Χαλκιδική — απομονωμένες, φυσικές και ελεύθερες παραλίες για γυμνισμό κυρίως στη Σιθωνία και τον Άθω.',
    en: 'Nudist beaches in Halkidiki — secluded, natural and free-spirited beaches for naturism mainly on Sithonia and Athos peninsulas in Greece.',
    de: 'FKK-Strände in Chalkidiki — abgelegene, natürliche und freie Strände für Naturismus vor allem auf Sithonia und Athos in Griechenland.',
    bg: 'Нудистки плажове в Халкидики — уединени, естествени и свободни плажове за натуризъм предимно в Ситония и Атон.',
    ru: 'Нудистские пляжи Халкидики — уединённые, природные и свободные пляжи для натуризма на полуостровах Ситония и Афон.',
    ro: 'Plaje nudiste în Halkidiki — izolate, naturale și libere pentru naturism pe Sithonia și Athos.',
    sr: 'Nudističke plaže na Halkidikiju — izolovane, prirodne i slobodne plaže za naturizam na Sitoniji i Atosu.',
  },
  // Legacy hyphenated keys
  'secluded': {
    el: 'Απομονωμένες παραλίες στη Χαλκιδική — κρυμμένοι παράδεισοι με κρυστάλλινα νερά, ησυχία και αυθεντική φύση στη Σιθωνία και τον Άθω.',
    en: 'Secluded beaches in Halkidiki — hidden paradises with crystal-clear waters, tranquility and authentic nature on Sithonia and Athos.',
    de: 'Abgelegene Strände in Chalkidiki — versteckte Paradiese mit kristallklarem Wasser, Ruhe und Natur auf Sithonia und Athos.',
    bg: 'Уединени плажове в Халкидики — скрити райове с кристално чисти води, спокойствие и природа в Ситония и Атон.',
    ru: 'Уединённые пляжи Халкидики — скрытые райские уголки с кристально чистой водой, тишиной и природой на Ситонии и Афоне.',
    ro: 'Plaje izolate în Halkidiki — paradisuri ascunse cu ape cristaline, liniște și natură pe Sithonia și Athos.',
    sr: 'Skrivene plaže na Halkidikiju — skriveni rajevi sa kristalno čistom vodom, mirom i prirodom na Sitoniji i Atosu.',
  },
  'family-friendly': {
    el: 'Οικογενειακές παραλίες στη Χαλκιδική — ρηχά νερά, ασφάλεια, εγκαταστάσεις για παιδιά και άνεση στην Κασσάνδρα και Σιθωνία.',
    en: 'Family-friendly beaches in Halkidiki — shallow waters, safety, facilities for children and comfort across Kassandra and Sithonia.',
    de: 'Familienfreundliche Strände in Chalkidiki — flaches Wasser, Sicherheit, Einrichtungen für Kinder und Komfort auf Kassandra und Sithonia.',
    bg: 'Семейни плажове в Халкидики — плитки води, безопасност, удобства за деца и комфорт в Касандра и Ситония.',
    ru: 'Семейные пляжи Халкидики — мелководье, безопасность, удобства для детей и комфорт на Кассандре и Ситонии.',
    ro: 'Plaje pentru familii în Halkidiki — ape puțin adânci, siguranță, facilități pentru copii și confort pe Kassandra și Sithonia.',
    sr: 'Porodične plaže na Halkidikiju — plitke vode, bezbednost, sadržaji za decu i komfor na Kasandri i Sitoniji.',
  },
  'blue-flag': {
    el: 'Παραλίες με Γαλάζια Σημαία στη Χαλκιδική — βραβευμένες παραλίες με καθαρά νερά, υψηλή ποιότητα υπηρεσιών και περιβαλλοντική πιστοποίηση.',
    en: 'Blue Flag beaches in Halkidiki — award-winning beaches with clean waters, high-quality services and environmental certification in Greece.',
    de: 'Blaue Flagge Strände in Chalkidiki — preisgekrönte Strände mit sauberem Wasser, hochwertigen Dienstleistungen und Umweltzertifizierung.',
    bg: 'Плажове със Син флаг в Халкидики — награждавани плажове с чисти води, висококачествени услуги и екологичен сертификат.',
    ru: 'Пляжи с Голубым флагом в Халкидики — отмеченные наградами пляжи с чистой водой и экологической сертификацией.',
    ro: 'Plaje cu Steag Albastru în Halkidiki — plaje premiate cu ape curate, servicii de calitate și certificare de mediu.',
    sr: 'Plaže sa Plavom zastavom na Halkidikiju — nagrađivane plaže sa čistom vodom i ekološkim sertifikatom.',
  },
  'water-sports': {
    el: 'Παραλίες για θαλάσσια σπορ στη Χαλκιδική — windsurf, jet ski, kayak, SUP, σκι στις καλύτερες παραλίες της Κασσάνδρας και Σιθωνίας.',
    en: 'Water sports beaches in Halkidiki — windsurf, jet ski, kayak, SUP and water skiing at the best beaches across Kassandra and Sithonia in Greece.',
    de: 'Wassersport-Strände in Chalkidiki — Windsurfen, Jet-Ski, Kajak, SUP und Wasserski an den besten Stränden auf Kassandra und Sithonia.',
    bg: 'Плажове за водни спортове в Халкидики — уиндсърф, джет ски, каяк, SUP и водни ски на най-добрите плажове в Касандра и Ситония.',
    ru: 'Пляжи для водных видов спорта в Халкидики — виндсёрфинг, гидроцикл, каяк, SUP и водные лыжи на лучших пляжах Кассандры и Ситонии.',
    ro: 'Plaje pentru sporturi nautice în Halkidiki — windsurf, jet ski, caiac, SUP și schi nautic pe cele mai bune plaje din Kassandra și Sithonia.',
    sr: 'Plaže za vodene sportove na Halkidikiju — windsurf, jet ski, kajak, SUP i skijanje na vodi na najboljim plažama Kasandre i Sitonije.',
  },
};

/* ------------------------------------------------------------------ */
/*  FEATURE_CONTENT — unique rich HTML content per feature for SEO    */
/* ------------------------------------------------------------------ */
const FEATURE_CONTENT: Record<string, Record<string, string>> = {
  'sandy': {
    el: '<h2>Αμμώδεις Παραλίες στη Χαλκιδική</h2><p>Η Χαλκιδική φημίζεται για τις αμμώδεις παραλίες της με λεπτή, χρυσή άμμο και ζεστά, ρηχά νερά. Από τις δημοφιλείς παραλίες της Κασσάνδρας μέχρι τους κρυφούς παραδείσους της Σιθωνίας, κάθε αμμώδης παραλία προσφέρει μοναδική εμπειρία.</p><p>Οι αμμώδεις παραλίες είναι ιδανικές για οικογένειες με μικρά παιδιά, καθώς η ομαλή είσοδος στη θάλασσα και τα ρηχά νερά εγγυώνται ασφάλεια και απόλαυση. Πολλές διαθέτουν ξαπλώστρες, ομπρέλες και beach bar για μέγιστη άνεση.</p><p>Ανακαλύψτε τις αμμώδεις παραλίες της Χαλκιδικής — από τη Χανιώτη και τα Πευκοχώρι μέχρι τη Σάρτη και τον Καβουρότρυπα.</p>',
    en: '<h2>Sandy Beaches in Halkidiki</h2><p>Halkidiki is renowned for its sandy beaches with fine golden sand and warm, shallow waters. From the popular shores of Kassandra to the hidden gems of Sithonia, every sandy beach offers a unique experience in northern Greece.</p><p>Sandy beaches are perfect for families with small children, as the gentle entry into the sea and shallow waters ensure safety and enjoyment. Many are fully organized with sunbeds, umbrellas and beach bars for maximum comfort.</p><p>Explore the sandy beaches of Halkidiki — from Hanioti and Pefkohori to Sarti and Kavourotrypes.</p>',
    de: '<h2>Sandstrände in Chalkidiki</h2><p>Chalkidiki ist berühmt für seine Sandstrände mit feinem goldenem Sand und warmem, flachem Wasser. Von den beliebten Stränden auf Kassandra bis zu den versteckten Perlen auf Sithonia bietet jeder Sandstrand ein einzigartiges Erlebnis.</p><p>Entdecken Sie die Sandstrände Chalkidikis — von Chanioti und Pefkochori bis Sarti und Kavourotrypes.</p>',
  },
  'pebble': {
    el: '<h2>Βοτσαλωτές Παραλίες στη Χαλκιδική</h2><p>Οι βοτσαλωτές παραλίες της Χαλκιδικής ξεχωρίζουν για τα κρυστάλλινα νερά τους — η έλλειψη άμμου σημαίνει εξαιρετική ορατότητα στον βυθό, ιδανική για snorkeling και κολύμβηση με μάσκα.</p><p>Θα βρείτε τις περισσότερες βοτσαλωτές παραλίες στη Σιθωνία και κοντά στον Άθω, συχνά σε πιο απομονωμένες τοποθεσίες. Ένα ζευγάρι aqua shoes είναι το μόνο που χρειάζεστε για να απολαύσετε αυτούς τους φυσικούς παραδείσους.</p>',
    en: '<h2>Pebble Beaches in Halkidiki</h2><p>Halkidiki\'s pebble beaches stand out for their crystal-clear waters — the absence of sand means exceptional underwater visibility, ideal for snorkeling and swimming with a mask.</p><p>You will find most pebble beaches on Sithonia and near Athos, often in more secluded locations. A pair of aqua shoes is all you need to enjoy these natural paradises with their stunning turquoise waters.</p>',
    de: '<h2>Kiesstrände in Chalkidiki</h2><p>Die Kiesstrände Chalkidikis zeichnen sich durch ihr kristallklares Wasser aus — ideal zum Schnorcheln. Sie finden die meisten auf Sithonia und in der Nähe von Athos. Ein Paar Wasserschuhe reicht aus, um diese Naturparadiese zu genießen.</p>',
  },
  'organized': {
    el: '<h2>Οργανωμένες Παραλίες στη Χαλκιδική</h2><p>Οι οργανωμένες παραλίες της Χαλκιδικής προσφέρουν πλήρεις υπηρεσίες — ξαπλώστρες, ομπρέλες, ντους, beach bar και σέρβις ποτών στην αμμουδιά. Ιδανικές για όσους θέλουν άνεση χωρίς εκπτώσεις στην ποιότητα.</p><p>Στην Κασσάνδρα θα βρείτε κοσμοπολίτικες παραλίες, ενώ στη Σιθωνία η οργάνωση συνδυάζεται με φυσική ομορφιά. Πολλές οργανωμένες παραλίες διαθέτουν ναυαγοσώστη και πρόσβαση για ΑΜΕΑ.</p>',
    en: '<h2>Organized Beaches in Halkidiki</h2><p>Halkidiki\'s organized beaches offer full services — sunbeds, umbrellas, showers, beach bars and drink service right on the sand. Perfect for those who want comfort without compromising on quality.</p><p>Kassandra features cosmopolitan beaches, while Sithonia combines organization with natural beauty. Many organized beaches also have lifeguards and wheelchair access for a safe, inclusive experience.</p>',
    de: '<h2>Organisierte Strände in Chalkidiki</h2><p>Chalkidikis organisierte Strände bieten vollen Service — Liegen, Sonnenschirme, Duschen, Strandbars und Getränkeservice direkt am Sand. Kassandra bietet kosmopolitische Strände, während Sithonia Organisation mit natürlicher Schönheit verbindet.</p>',
  },
  'free': {
    el: '<h2>Ελεύθερες Παραλίες στη Χαλκιδική</h2><p>Η Χαλκιδική φημίζεται για τις δωρεάν παραλίες της — κυρίως στη Σιθωνία και τον Άθω. Χωρίς ξαπλώστρες, χωρίς ομπρέλες, μόνο φύση, ελευθερία και τιρκουάζ νερά. Αυτές οι παραλίες προσφέρουν μια αυθεντική εμπειρία κολύμβησης μακριά από τον συνωστισμό.</p><p>Πάρτε τα δικά σας πράγματα, ένα καλό βιβλίο και αφήστε τη φύση να κάνει τα υπόλοιπα. Ιδανικές για campers, backpackers και όσους αναζητούν ηρεμία.</p>',
    en: '<h2>Free Beaches in Halkidiki</h2><p>Halkidiki is famous for its free beaches — mainly on Sithonia and Athos. No sunbeds, no umbrellas, just nature, freedom and turquoise waters. These beaches offer an authentic swimming experience away from the crowds.</p><p>Bring your own gear, a good book and let nature do the rest. Perfect for campers, backpackers and anyone seeking peace and tranquility on unspoiled shores.</p>',
    de: '<h2>Freie Strände in Chalkidiki</h2><p>Chalkidiki ist bekannt für seine freien Strände — hauptsächlich auf Sithonia und Athos. Keine Liegen, keine Sonnenschirme, nur Natur, Freiheit und türkisfarbenes Wasser. Perfekt für Camper, Rucksackreisende und Ruhesuchende.</p>',
  },
  'parking': {
    el: '<h2>Παραλίες με Πάρκινγκ στη Χαλκιδική</h2><p>Δεν χρειάζεται να ψάχνετε στάθμευση — αυτές οι παραλίες στη Χαλκιδική έχουν εύκολο, δωρεάν πάρκινγκ κοντά στη θάλασσα. Ιδανικές για οικογένειες που ταξιδεύουν με αυτοκίνητο και δεν θέλουν μεγάλο περπάτημα.</p><p>Στην Κασσάνδρα και τη Σιθωνία πολλές παραλίες διαθέτουν οργανωμένο χώρο στάθμευσης ή ευρύχωρους χωματόδρομους δίπλα στη θάλασσα.</p>',
    en: '<h2>Beaches with Parking in Halkidiki</h2><p>No need to search for a parking spot — these Halkidiki beaches have easy, free parking close to the sea. Ideal for families traveling by car who want convenience without a long walk to the beach.</p><p>Across Kassandra and Sithonia, many beaches offer organized parking lots or spacious dirt roads right by the water\'s edge.</p>',
    de: '<h2>Strände mit Parkplatz in Chalkidiki</h2><p>Kein langes Suchen nach einem Parkplatz — diese Strände in Chalkidiki bieten kostenloses Parken in Meeresnähe. Ideal für Familien mit Auto auf Kassandra und Sithonia.</p>',
  },
  'beachBar': {
    el: '<h2>Παραλίες με Beach Bar στη Χαλκιδική</h2><p>Cocktails με θέα τη θάλασσα! Οι παραλίες με beach bar στη Χαλκιδική συνδυάζουν κολύμπι και nightlife σε ένα μοναδικό σκηνικό. Απολαύστε μουσική, δροσερά ποτά και ηλιοβασιλέματα δίπλα στα κύματα.</p><p>Η Κασσάνδρα είναι ο κορυφαίος προορισμός για beach bars — από τη Χανιώτη μέχρι τα Πευκοχώρι. Στη Σιθωνία θα βρείτε πιο χαλαρά, boho-style beach bars σε εξωτικά σκηνικά.</p>',
    en: '<h2>Beaches with Beach Bars in Halkidiki</h2><p>Cocktails with a sea view! Halkidiki\'s beach bar beaches combine swimming and nightlife in a unique setting. Enjoy music, cool drinks and sunsets right by the waves.</p><p>Kassandra is the top destination for beach bars — from Hanioti to Pefkohori. On Sithonia, you will find more relaxed, boho-style beach bars in exotic settings along stunning coastlines.</p>',
    de: '<h2>Strände mit Beach Bar in Chalkidiki</h2><p>Cocktails mit Meerblick! Die Beach-Bar-Strände in Chalkidiki kombinieren Schwimmen und Nachtleben. Kassandra ist die Topdestination für Beach Bars — von Chanioti bis Pefkochori. Auf Sithonia finden Sie entspannte Boho-Strandbars.</p>',
  },
  'shallowWater': {
    el: '<h2>Παραλίες με Ρηχά Νερά στη Χαλκιδική</h2><p>Ιδανικές για παιδιά! Οι παραλίες με ρηχά νερά στη Χαλκιδική επιτρέπουν στα μικρά παιδιά να παίζουν με ασφάλεια — μπορείτε να περπατήσετε 50 μέτρα μέσα στη θάλασσα χωρίς να φτάσει το νερό στη μέση σας.</p><p>Αυτές οι παραλίες είναι η πρώτη επιλογή για οικογένειες με βρέφη και νήπια. Τα ήρεμα, ζεστά νερά προσφέρουν ξεγνοιασιά στους γονείς και χαρά στα παιδιά.</p>',
    en: '<h2>Shallow Water Beaches in Halkidiki</h2><p>Perfect for kids! Halkidiki\'s shallow water beaches let small children play safely — you can walk 50 meters into the sea without the water reaching your waist.</p><p>These beaches are the top choice for families with babies and toddlers. The calm, warm waters provide peace of mind for parents and joy for children throughout the summer season.</p>',
    de: '<h2>Strände mit flachem Wasser in Chalkidiki</h2><p>Perfekt für Kinder! An den Stränden mit flachem Wasser in Chalkidiki können kleine Kinder sicher spielen — Sie können 50 Meter ins Meer gehen, ohne dass das Wasser Ihre Hüfte erreicht. Ideal für Familien mit Kleinkindern.</p>',
  },
  'waterSports': {
    el: '<h2>Παραλίες με Θαλάσσια Σπορ στη Χαλκιδική</h2><p>Η Χαλκιδική είναι παράδεισος για τα θαλάσσια σπορ — windsurf, jet ski, kayak, SUP, banana, parasailing και σκι στις πιο δυναμικές παραλίες. Ιδανικοί άνεμοι και κρυστάλλινα νερά δημιουργούν τέλειες συνθήκες.</p><p>Στην Κασσάνδρα θα βρείτε μεγάλα κέντρα θαλάσσιων σπορ, ενώ στη Σιθωνία τα SUP και kayak είναι ο τέλειος τρόπος εξερεύνησης κρυφών κόλπων.</p>',
    en: '<h2>Water Sports Beaches in Halkidiki</h2><p>Halkidiki is a paradise for water sports — windsurfing, jet skiing, kayaking, SUP, banana rides, parasailing and water skiing at the most dynamic beaches. Ideal winds and crystal-clear waters create perfect conditions.</p><p>Kassandra hosts major water sports centers, while on Sithonia SUP and kayaking are the perfect way to explore hidden coves and coastlines.</p>',
    de: '<h2>Wassersport-Strände in Chalkidiki</h2><p>Chalkidiki ist ein Paradies für Wassersport — Windsurfen, Jet-Ski, Kajak, SUP und Wasserski an den dynamischsten Stränden. Kassandra bietet große Wassersportzentren, auf Sithonia sind SUP und Kajak ideal zum Erkunden.</p>',
  },
  'accessible': {
    el: '<h2>Προσβάσιμες Παραλίες στη Χαλκιδική</h2><p>Η Χαλκιδική επενδύει στην προσβασιμότητα — ολοένα και περισσότερες παραλίες διαθέτουν ράμπες, ειδικά αμαξίδια θάλασσας (seatrac) και εύκολη πρόσβαση για ΑΜΕΑ. Η θάλασσα είναι δικαίωμα όλων.</p><p>Προσβάσιμες παραλίες θα βρείτε τόσο στην Κασσάνδρα όσο και στη Σιθωνία, με πλήρεις εγκαταστάσεις, ναυαγοσώστη και αποδυτήρια.</p>',
    en: '<h2>Accessible Beaches in Halkidiki</h2><p>Halkidiki is investing in accessibility — more and more beaches feature ramps, sea wheelchairs (seatrac systems) and easy access for people with disabilities. The sea is a right for everyone.</p><p>You will find accessible beaches on both Kassandra and Sithonia, with full facilities, lifeguards and changing rooms designed for inclusive enjoyment.</p>',
    de: '<h2>Barrierefreie Strände in Chalkidiki</h2><p>Chalkidiki investiert in Barrierefreiheit — immer mehr Strände bieten Rampen, Strandrollstühle (Seatrac-Systeme) und leichten Zugang. Barrierefreie Strände finden Sie auf Kassandra und Sithonia.</p>',
  },
  'sunbeds': {
    el: '<h2>Παραλίες με Ξαπλώστρες στη Χαλκιδική</h2><p>Οργανωμένη χαλάρωση — ξαπλώστρες, ομπρέλες, σέρβις ποτών στην αμμουδιά. Οι παραλίες με ξαπλώστρες στη Χαλκιδική προσφέρουν τον τέλειο συνδυασμό άνεσης και ομορφιάς.</p><p>Τιμές ξαπλώστρας κυμαίνονται συνήθως από 5 έως 15 ευρώ ανά σετ, ανάλογα με την παραλία και την τοποθεσία. Κρατήστε νωρίς σε δημοφιλείς παραλίες τον Ιούλιο και Αύγουστο.</p>',
    en: '<h2>Beaches with Sunbeds in Halkidiki</h2><p>Organized relaxation — sunbeds, umbrellas, drink service right on the sand. Halkidiki\'s sunbed beaches offer the perfect combination of comfort and beauty for a laid-back beach day.</p><p>Sunbed prices typically range from 5 to 15 euros per set, depending on the beach and location. Book early at popular beaches during July and August for the best spots.</p>',
    de: '<h2>Strände mit Liegen in Chalkidiki</h2><p>Organisierte Entspannung — Liegen, Sonnenschirme, Getränkeservice direkt am Strand. Die Preise liegen typischerweise zwischen 5 und 15 Euro pro Set. Buchen Sie an beliebten Stränden im Juli und August frühzeitig.</p>',
  },
  'lifeguard': {
    el: '<h2>Παραλίες με Ναυαγοσώστη στη Χαλκιδική</h2><p>Η ασφάλεια είναι σημαντική, ειδικά για οικογένειες. Αυτές οι παραλίες στη Χαλκιδική διαθέτουν ναυαγοσώστη όλο το καλοκαίρι — από τον Ιούνιο μέχρι τον Σεπτέμβριο, με πρώτες βοήθειες και εποπτεία.</p><p>Οι παραλίες με ναυαγοσώστη είναι η ιδανική επιλογή για οικογένειες με μικρά παιδιά, για ηλικιωμένους και για όσους θέλουν ξεγνοιασιά στο μπάνιο τους.</p>',
    en: '<h2>Beaches with Lifeguards in Halkidiki</h2><p>Safety matters, especially for families. These Halkidiki beaches have lifeguards throughout the summer — from June to September, with first aid stations and professional supervision.</p><p>Beaches with lifeguards are the ideal choice for families with small children, elderly visitors and anyone who wants peace of mind while swimming in the beautiful Aegean waters.</p>',
    de: '<h2>Strände mit Rettungsschwimmer in Chalkidiki</h2><p>Sicherheit ist wichtig, besonders für Familien. Diese Strände in Chalkidiki haben den ganzen Sommer über Rettungsschwimmer — von Juni bis September, mit Erster Hilfe und professioneller Überwachung.</p>',
  },
  'nudist': {
    el: '<h2>Παραλίες Γυμνιστών στη Χαλκιδική</h2><p>Η Χαλκιδική διαθέτει αρκετές παραλίες φιλικές προς τον γυμνισμό — κυρίως σε απομονωμένους κόλπους της Σιθωνίας και κοντά στον Άθω. Αυτές οι παραλίες προσφέρουν απόλυτη ιδιωτικότητα σε φυσικά σκηνικά εξαιρετικής ομορφιάς.</p><p>Συνήθως πρόκειται για μη οργανωμένες παραλίες, ελεύθερες, με κρυστάλλινα νερά και φυσική σκιά από πεύκα ή βράχους.</p>',
    en: '<h2>Nudist Beaches in Halkidiki</h2><p>Halkidiki has several naturism-friendly beaches — mainly in secluded coves on Sithonia and near Athos. These beaches offer complete privacy in natural settings of exceptional beauty.</p><p>Most are unorganized, free beaches with crystal-clear waters and natural shade from pine trees or rocks, providing an authentic back-to-nature experience.</p>',
    de: '<h2>FKK-Strände in Chalkidiki</h2><p>Chalkidiki hat mehrere FKK-freundliche Strände — hauptsächlich in abgelegenen Buchten auf Sithonia und nahe Athos. Diese Strände bieten Privatsphäre in natürlicher Umgebung mit kristallklarem Wasser und Schatten von Pinien.</p>',
  },
  // Legacy hyphenated keys
  'secluded': {
    el: '<h2>Απομονωμένες Παραλίες στη Χαλκιδική</h2><p>Για όσους αναζητούν ηρεμία, η Χαλκιδική κρύβει δεκάδες μυστικές παραλίες — μικροί κόλποι με κρυστάλλινα νερά, προσβάσιμοι μόνο με χωματόδρομο ή βάρκα.</p><p>Οι πιο απομονωμένες παραλίες βρίσκονται στη Σιθωνία και κοντά στον Άθω, μακριά από τον τουριστικό συνωστισμό. Ιδανικές για ρομαντικές αποδράσεις και φωτογραφίες.</p>',
    en: '<h2>Secluded Beaches in Halkidiki</h2><p>For those seeking tranquility, Halkidiki hides dozens of secret beaches — small coves with crystal-clear waters, accessible only by dirt road or boat.</p><p>The most secluded beaches are found on Sithonia and near Athos, far from the tourist crowds. Perfect for romantic getaways and photography enthusiasts.</p>',
    de: '<h2>Abgelegene Strände in Chalkidiki</h2><p>Für Ruhesuchende verbirgt Chalkidiki Dutzende geheime Strände — kleine Buchten mit kristallklarem Wasser, nur über Schotterstraßen oder per Boot erreichbar. Die abgelegensten Strände finden Sie auf Sithonia und nahe Athos.</p>',
  },
  'family-friendly': {
    el: '<h2>Οικογενειακές Παραλίες στη Χαλκιδική</h2><p>Η Χαλκιδική είναι ο κορυφαίος οικογενειακός προορισμός στη Βόρεια Ελλάδα. Οι οικογενειακές παραλίες συνδυάζουν ρηχά, ζεστά νερά, καθαρή άμμο, ναυαγοσώστη και εγκαταστάσεις που κάνουν τις διακοπές εύκολες.</p><p>Πολλές παραλίες διαθέτουν παιδικές χαρές, αλλαξιέρες, καντίνες και εύκολο πάρκινγκ — ό,τι χρειάζεται μια οικογένεια για ξέγνοιαστες μέρες στη θάλασσα.</p>',
    en: '<h2>Family-Friendly Beaches in Halkidiki</h2><p>Halkidiki is the top family destination in northern Greece. Family-friendly beaches combine shallow, warm waters, clean sand, lifeguards and facilities that make vacations easy and stress-free.</p><p>Many beaches feature playgrounds, changing facilities, snack bars and easy parking — everything a family needs for carefree days by the sea.</p>',
    de: '<h2>Familienfreundliche Strände in Chalkidiki</h2><p>Chalkidiki ist das Top-Familienziel in Nordgriechenland. Familienfreundliche Strände bieten flaches, warmes Wasser, sauberen Sand, Rettungsschwimmer und Einrichtungen für stressfreien Urlaub mit Kindern.</p>',
  },
  'blue-flag': {
    el: '<h2>Παραλίες με Γαλάζια Σημαία στη Χαλκιδική</h2><p>Η Χαλκιδική κατέχει σταθερά μία από τις πρώτες θέσεις σε βραβεύσεις Γαλάζιας Σημαίας στην Ελλάδα. Αυτό σημαίνει καθαρά νερά, υψηλές υπηρεσίες, περιβαλλοντική διαχείριση και ασφάλεια.</p><p>Μια παραλία με Γαλάζια Σημαία εγγυάται ποιότητα — καθαρισμένη αμμουδιά, ναυαγοσώστη, πρόσβαση για ΑΜΕΑ και τακτικούς ελέγχους νερού.</p>',
    en: '<h2>Blue Flag Beaches in Halkidiki</h2><p>Halkidiki consistently ranks among the top areas in Greece for Blue Flag awards. This means clean waters, high-quality services, environmental management and safety for swimmers.</p><p>A Blue Flag beach guarantees quality — clean sand, lifeguards, wheelchair access and regular water quality testing throughout the swimming season.</p>',
    de: '<h2>Blaue Flagge Strände in Chalkidiki</h2><p>Chalkidiki gehört regelmäßig zu den Top-Regionen in Griechenland für Blaue-Flagge-Auszeichnungen. Das bedeutet sauberes Wasser, hochwertige Dienstleistungen und Umweltmanagement. Eine Blaue Flagge garantiert Qualität.</p>',
  },
  'water-sports': {
    el: '<h2>Παραλίες με Θαλάσσια Σπορ στη Χαλκιδική</h2><p>Η Χαλκιδική είναι παράδεισος για τα θαλάσσια σπορ — windsurf, jet ski, kayak, SUP, banana, parasailing και σκι στις πιο δυναμικές παραλίες. Ιδανικοί άνεμοι και κρυστάλλινα νερά δημιουργούν τέλειες συνθήκες.</p><p>Στην Κασσάνδρα θα βρείτε μεγάλα κέντρα θαλάσσιων σπορ, ενώ στη Σιθωνία τα SUP και kayak είναι ο τέλειος τρόπος εξερεύνησης κρυφών κόλπων.</p>',
    en: '<h2>Water Sports Beaches in Halkidiki</h2><p>Halkidiki is a paradise for water sports — windsurfing, jet skiing, kayaking, SUP, banana rides, parasailing and water skiing at the most dynamic beaches. Ideal winds and crystal-clear waters create perfect conditions.</p><p>Kassandra hosts major water sports centers, while on Sithonia SUP and kayaking are the perfect way to explore hidden coves and coastlines.</p>',
    de: '<h2>Wassersport-Strände in Chalkidiki</h2><p>Chalkidiki ist ein Paradies für Wassersport — Windsurfen, Jet-Ski, Kajak, SUP und Wasserski an den dynamischsten Stränden. Kassandra bietet große Wassersportzentren, auf Sithonia sind SUP und Kajak ideal zum Erkunden.</p>',
  },
};

/* ------------------------------------------------------------------ */
/*  Static params — all features x all locales                        */
/* ------------------------------------------------------------------ */
const ALL_FEATURES = [
  'sandy', 'pebble', 'organized', 'free', 'parking', 'beachBar',
  'shallowWater', 'waterSports', 'accessible', 'sunbeds', 'lifeguard',
  'nudist', 'secluded', 'family-friendly', 'blue-flag', 'water-sports',
];

export function generateStaticParams() {
  return LOCALES.flatMap(locale =>
    ALL_FEATURES.map(feature => ({ locale, feature }))
  );
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */
type Props = { params: Promise<{ locale: string; feature: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, feature } = await params;
  const featureLabel = FEATURE_LABELS[feature]?.[locale] || FEATURE_LABELS[feature]?.en || feature;
  const title = `${featureLabel} Beaches | Halkidiki | ChalkidikiHub`;
  const desc = FEATURE_DESCRIPTIONS[feature]?.[locale] || FEATURE_DESCRIPTIONS[feature]?.en || `${featureLabel} beaches in Halkidiki.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub', images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=beach`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=beach`] },
    alternates: {
      canonical: localeUrl(locale, `beaches/feature/${feature}`),
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/beaches/feature/${feature}`])),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page — renders unique content server-side + client component      */
/* ------------------------------------------------------------------ */
export default async function Page({ params }: Props) {
  const { locale, feature } = await params;
  setRequestLocale(locale);
  const uniqueContent = FEATURE_CONTENT[feature]?.[locale] || FEATURE_CONTENT[feature]?.en || '';
  return (
    <>
      {uniqueContent && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: uniqueContent }} />
        </div>
      )}
      <PageClient />
    </>
  );
}
