import { serbianLatin } from '@/lib/i18n/script';
// Mount Athos guide content in 6 languages
// Each key maps to { el, en, de, bg, ru, ro }

type L = Record<string, string>;

export const t = {
  // Common
  home: { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' } as L,
  mountAthos: { el: 'Άγιο Όρος', en: 'Mount Athos', de: 'Berg Athos', bg: 'Света гора', ru: 'Святая Гора', ro: 'Muntele Athos', sr: 'Sveta Gora' } as L,
  guide: { el: 'Οδηγός Αγίου Όρους', en: 'Mount Athos Guide', de: 'Berg Athos Reiseführer', bg: 'Пътеводител за Света гора', ru: 'Путеводитель по Святой Горе', ro: 'Ghid Muntele Athos', sr: 'Vodič za Svetu Goru' } as L,
  areaAthos: { el: 'Περιοχή Άθως', en: 'Athos Area', de: 'Region Athos', bg: 'Район Атос', ru: 'Район Афон', ro: 'Zona Athos', sr: 'Oblast Atos' } as L,
  monasteries: { el: 'Μοναστήρια', en: 'Monasteries', de: 'Klöster', bg: 'Манастири', ru: 'Монастыри', ro: 'Mănăstiri', sr: 'Manastiri' } as L,
  monks: { el: 'Μοναχοί', en: 'Monks', de: 'Mönche', bg: 'Монаси', ru: 'Монахи', ro: 'Călugări', sr: 'Monasi' } as L,

  // Landing page
  landingTitle: { el: 'Το Άγιο Όρος', en: 'Mount Athos', de: 'Der Berg Athos', bg: 'Света гора', ru: 'Святая Гора Афон', ro: 'Muntele Athos', sr: 'Sveta Gora' } as L,
  landingSubtitle: {
    el: 'Ο πλήρης οδηγός για την Αθωνική Πολιτεία — το σημαντικότερο κέντρο του ορθόδοξου μοναχισμού παγκοσμίως',
    en: 'The complete guide to the Athonite State — the most important center of Orthodox monasticism worldwide',
    de: 'Der vollständige Reiseführer zum Athos-Staat — das wichtigste Zentrum des orthodoxen Mönchtums weltweit',
    bg: 'Пълен пътеводител за Атонската държава — най-важният център на православното монашество в света',
    ru: 'Полный путеводитель по Афонскому государству — важнейший центр православного монашества в мире',
    ro: 'Ghidul complet al Statului Athonit — cel mai important centru al monahismului ortodox din lume',
    sr: 'Potpuni vodič kroz Svetu Goru – najvažnije središte pravoslavnog monaštva u svetu',
  } as L,
  landingLocation: { el: 'Χερσόνησος Άθω, Χαλκιδική', en: 'Athos Peninsula, Halkidiki', de: 'Athos-Halbinsel, Chalkidiki', bg: 'Полуостров Атос, Халкидики', ru: 'Полуостров Афон, Халкидики', ro: 'Peninsula Athos, Halkidiki' , sr: 'Poluostrvo Atos, Halkidiki' } as L,
  landingIntro: {
    el: 'Το Άγιο Όρος αποτελεί έναν από τους πιο ιδιαίτερους και πνευματικά σημαντικούς τόπους στον κόσμο. Πρόκειται για μια μοναστική πολιτεία με ιστορία άνω των 1.000 ετών, η οποία βρίσκεται στην τρίτη χερσόνησο της Χαλκιδικής.',
    en: 'Mount Athos is one of the most unique and spiritually significant places in the world. It is a monastic state with a history spanning over 1,000 years, located on the third peninsula of Halkidiki.',
    de: 'Der Berg Athos ist einer der einzigartigsten und spirituell bedeutendsten Orte der Welt. Es ist ein Klosterstaat mit einer über 1.000-jährigen Geschichte auf der dritten Halbinsel von Chalkidiki.',
    bg: 'Света гора е едно от най-уникалните и духовно значими места в света. Това е монашеска държава с над 1000-годишна история, разположена на третия полуостров на Халкидики.',
    ru: 'Святая Гора Афон — одно из самых уникальных и духовно значимых мест в мире. Это монашеское государство с более чем 1000-летней историей, расположенное на третьем полуострове Халкидики.',
    ro: 'Muntele Athos este unul dintre cele mai unice și semnificative locuri spirituale din lume. Este un stat monastic cu o istorie de peste 1.000 de ani, situat pe a treia peninsulă din Halkidiki.',
    sr: 'Sveta Gora je jedno od najosobenijih i duhovno najznačajnijih mesta na svetu. To je monaška država s istorijom dužom od 1.000 godina, smeštena na trećem poluostrvu Halkidikija.',
  } as L,
  landingIntro2: {
    el: 'Συχνά αποκαλείται «Περιβόλι της Παναγίας» και λειτουργεί ως Αυτόνομη Μοναστική Πολιτεία σύμφωνα με το ελληνικό Σύνταγμα. Η περιοχή εκτείνεται σε 335 τετραγωνικά χιλιόμετρα, με κορυφή στα 2.033 μέτρα. Σήμερα φιλοξενεί περίπου 2.000 μοναχούς.',
    en: 'Often called "The Garden of the Virgin Mary", it functions as an Autonomous Monastic State under the Greek Constitution. The area covers 335 square kilometers, with the peak reaching 2,033 meters. Today it is home to approximately 2,000 monks.',
    de: 'Oft als "Garten der Jungfrau Maria" bezeichnet, funktioniert es als autonomer Klosterstaat gemäß der griechischen Verfassung. Das Gebiet umfasst 335 Quadratkilometer, mit dem Gipfel auf 2.033 Metern. Heute leben dort etwa 2.000 Mönche.',
    bg: 'Често наричана „Градината на Богородица", тя функционира като автономна монашеска държава съгласно гръцката конституция. Територията обхваща 335 квадратни километра, а върхът достига 2033 метра. Днес там живеят около 2000 монаси.',
    ru: 'Часто называемая «Садом Богородицы», она функционирует как Автономное монашеское государство согласно греческой конституции. Территория охватывает 335 квадратных километров, а вершина достигает 2033 метров. Сегодня здесь проживают около 2000 монахов.',
    ro: 'Adesea numit „Grădina Maicii Domnului", funcționează ca Stat Monastic Autonom conform Constituției grecești. Zona acoperă 335 de kilometri pătrați, cu vârful la 2.033 de metri. Astăzi găzduiește aproximativ 2.000 de călugări.',
    sr: 'Često je nazivaju „Vrtom Presvete Bogorodice“. Ima status samoupravne monaške zajednice prema grčkom Ustavu. Prostire se na oko 335 kvadratnih kilometara, a njen vrh dostiže 2.033 metra. Danas na njoj živi oko 2.000 monaha.',
  } as L,
  guideTitle: { el: 'Οδηγός Αγίου Όρους', en: 'Mount Athos Guide', de: 'Berg Athos Reiseführer', bg: 'Пътеводител', ru: 'Путеводитель', ro: 'Ghid', sr: 'Vodič' } as L,

  // Nav items
  navMonasteries: { el: 'Οι 20 Μονές', en: 'The 20 Monasteries', de: 'Die 20 Klöster', bg: '20-те манастира', ru: '20 монастырей', ro: 'Cele 20 de mănăstiri', sr: '20 manastira' } as L,
  nearbyMonasteries: { el: 'Κοντινές μονές', en: 'Nearby monasteries', de: 'Klöster in der Nähe', bg: 'Близки манастири', ru: 'Ближайшие монастыри', ro: 'Mănăstiri din apropiere', sr: 'Obližnji manastiri' } as L,
  navHowToVisit: { el: 'Πώς να Επισκεφθείτε', en: 'How to Visit', de: 'Besuch planen', bg: 'Как да посетите', ru: 'Как посетить', ro: 'Cum să vizitați', sr: 'Kako posetiti' } as L,
  navGettingThere: { el: 'Πώς να Πάτε', en: 'Getting There', de: 'Anreise', bg: 'Как да стигнете', ru: 'Как добраться', ro: 'Cum ajungeți', sr: 'Kako stići' } as L,
  navAccommodation: { el: 'Διαμονή', en: 'Accommodation', de: 'Unterkunft', bg: 'Настаняване', ru: 'Проживание', ro: 'Cazare', sr: 'Smeštaj' } as L,
  navDailyLife: { el: 'Καθημερινή Ζωή', en: 'Daily Life', de: 'Tägliches Leben', bg: 'Ежедневие', ru: 'Повседневная жизнь', ro: 'Viața zilnică', sr: 'Svakodnevni život' } as L,
  navHiking: { el: 'Ανάβαση στον Άθω', en: 'Hiking to the Peak', de: 'Wanderung zum Gipfel', bg: 'Изкачване на върха', ru: 'Восхождение на вершину', ro: 'Drumeție la vârf', sr: 'Penjanje na vrh' } as L,
  navHistory: { el: 'Ιστορία & Θρύλοι', en: 'History & Legends', de: 'Geschichte & Legenden', bg: 'История и легенди', ru: 'История и легенды', ro: 'Istorie și legende', sr: 'Istorija i legende' } as L,

  // Section card descriptions (landing page)
  descMonasteries: {
    el: 'Αναλυτική λίστα όλων των μοναστηριών, ιστορία και εθνικότητα',
    en: 'Complete list of all monasteries, history and nationality',
    de: 'Vollständige Liste aller Klöster, Geschichte und Nationalität',
    bg: 'Пълен списък на всички манастири, история и националност',
    ru: 'Полный список всех монастырей, история и национальность',
    ro: 'Lista completă a tuturor mănăstirilor, istorie și naționalitate',
    sr: 'Potpun spisak svih manastira, istorija i narodnost',
  } as L,
  descHowToVisit: {
    el: 'Κανόνες εισόδου, διαμονητήριο, Άβατον, ποιος μπορεί να μπει',
    en: 'Entry rules, permits, Avaton, who can enter',
    de: 'Einreiseregeln, Genehmigungen, Avaton, wer einreisen darf',
    bg: 'Правила за влизане, разрешителни, Аватон, кой може да влезе',
    ru: 'Правила входа, разрешения, Аватон, кто может войти',
    ro: 'Reguli de intrare, permise, Avaton, cine poate intra',
    sr: 'Pravila ulaska, dozvole, avaton, ko može da uđe',
  } as L,
  descGettingThere: {
    el: 'Μεταφορές από Θεσσαλονίκη, Ουρανούπολη, πλοία προς Δάφνη',
    en: 'Transport from Thessaloniki, Ouranoupoli, boats to Dafni',
    de: 'Transport von Thessaloniki, Ouranoupoli, Boote nach Dafni',
    bg: 'Транспорт от Солун, Уранополи, кораби до Дафни',
    ru: 'Транспорт из Салоников, Уранополис, лодки до Дафни',
    ro: 'Transport din Salonic, Ouranoupoli, bărci spre Dafni',
    sr: 'Prevoz iz Soluna i Uranupolisa, brodovi do Dafnija',
  } as L,
  descAccommodation: {
    el: 'Αρχονταρίκι, ξενώνες μονών, φιλοξενία και κόστος',
    en: 'Archontariki, monastery guesthouses, hospitality and costs',
    de: 'Archontariki, Klostergästehäuser, Gastfreundschaft und Kosten',
    bg: 'Архонтарики, манастирски гостоприемници, гостоприемство и разходи',
    ru: 'Архондарик, монастырские гостиницы, гостеприимство и расходы',
    ro: 'Archontariki, case de oaspeți mănăstirești, ospitalitate și costuri',
    sr: 'Arhondarici, manastirski konaci, gostoprimstvo i troškovi',
  } as L,
  descDailyLife: {
    el: 'Πρόγραμμα μοναχών, τι κάνει ο επισκέπτης, πνευματικό ταξίδι',
    en: 'Monks schedule, what visitors do, spiritual journey',
    de: 'Mönchsprogramm, was Besucher tun, spirituelle Reise',
    bg: 'Програма на монасите, какво правят посетителите, духовно пътуване',
    ru: 'Расписание монахов, чем занимаются посетители, духовное путешествие',
    ro: 'Programul călugărilor, ce fac vizitatorii, călătorie spirituală',
    sr: 'Raspored monaha, šta rade posetioci, duhovno putovanje',
  } as L,
  descHiking: {
    el: 'Κορυφή 2.033 μέτρα, διαδρομή 6-8 ώρες, πρακτικές πληροφορίες',
    en: 'Summit 2,033 meters, 6-8 hour route, practical information',
    de: 'Gipfel 2.033 Meter, 6-8 Stunden Route, praktische Informationen',
    bg: 'Връх 2033 метра, маршрут 6-8 часа, практическа информация',
    ru: 'Вершина 2033 метра, маршрут 6-8 часов, практическая информация',
    ro: 'Vârf 2.033 metri, traseu de 6-8 ore, informații practice',
    sr: 'Vrh na 2.033 metra, staza od 6–8 sati, praktične informacije',
  } as L,
  descHistory: {
    el: 'Βυζαντινή κληρονομιά, θαυματουργές εικόνες, διάσημοι μοναχοί',
    en: 'Byzantine heritage, miraculous icons, famous monks',
    de: 'Byzantinisches Erbe, wundertätige Ikonen, berühmte Mönche',
    bg: 'Византийско наследство, чудотворни икони, известни монаси',
    ru: 'Византийское наследие, чудотворные иконы, знаменитые монахи',
    ro: 'Moștenire bizantină, icoane miraculoase, călugări celebri',
    sr: 'Vizantijsko nasleđe, čudotvorne ikone, poznati monasi',
  } as L,

  // Nationality labels
  nationGreek: { el: 'Ελληνική', en: 'Greek', de: 'Griechisch', bg: 'Гръцки', ru: 'Греческий', ro: 'Greacă', sr: 'Grčki' } as L,
  nationSerbian: { el: 'Σερβική', en: 'Serbian', de: 'Serbisch', bg: 'Сръбски', ru: 'Сербский', ro: 'Sârbă', sr: 'Srpski' } as L,
  nationBulgarian: { el: 'Βουλγαρική', en: 'Bulgarian', de: 'Bulgarisch', bg: 'Български', ru: 'Болгарский', ro: 'Bulgară', sr: 'Bugarski' } as L,
  nationRussian: { el: 'Ρωσική', en: 'Russian', de: 'Russisch', bg: 'Руски', ru: 'Русский', ro: 'Rusă', sr: 'Ruski' } as L,

  // Important note
  importantNote: { el: 'Σημαντική Σημείωση', en: 'Important Note', de: 'Wichtiger Hinweis', bg: 'Важна забележка', ru: 'Важное примечание', ro: 'Notă importantă', sr: 'Važna napomena' } as L,

  // SEO meta
  metaLandingTitle: {
    el: 'Άγιο Όρος - Ο Πλήρης Οδηγός | Χαλκιδική',
    en: 'Mount Athos - Complete Guide | Halkidiki',
    de: 'Berg Athos - Vollständiger Reiseführer | Chalkidiki',
    bg: 'Света гора - Пълен пътеводител | Халкидики',
    ru: 'Святая Гора Афон - Полный путеводитель | Халкидики',
    ro: 'Muntele Athos - Ghid complet | Halkidiki', sr: 'Sveta Gora - Kompletan vodič | Halkidiki',
  } as L,
  metaLandingDesc: {
    el: "Το Άγιο Όρος, η μοναστική πολιτεία στο τρίτο πόδι της Χαλκιδικής: 20 μονές, περίπου 2.000 μοναχοί, κορυφή 2.033 μ., κανόνες εισόδου, διαμονητήριο, πρόσβαση.",
    en: "Mount Athos, the monastic state on Halkidiki's third peninsula: 20 monasteries, about 2,000 monks, the 2,033 m peak, entry rules, permits, getting there.",
    de: "Der Berg Athos, Mönchsrepublik auf Chalkidikis dritter Halbinsel: 20 Klöster, rund 2.000 Mönche, Gipfel 2.033 m, Einreiseregeln, Genehmigung und Anreise.",
    bg: "Света гора, монашеската държава на третия полуостров на Халкидики: 20 манастира, около 2000 монаси, връх 2033 м, правила за влизане, разрешително, достъп.",
    ru: "Афон — монашеское государство на третьем полуострове Халкидики: 20 монастырей, около 2000 монахов, вершина 2033 м, правила въезда, разрешение и дорога.",
    ro: "Muntele Athos, statul monahal din a treia peninsulă a Halkidikiului: 20 de mănăstiri, circa 2.000 de călugări, vârful de 2.033 m, reguli de intrare și acces.",
    sr: "Sveta Gora, monaška država na trećem poluostrvu Halkidikija: 20 manastira, oko 2.000 monaha, vrh od 2.033 m, pravila ulaska, dozvola i kako stići.",
  } as L,
  metaMonasteriesTitle: {
    el: 'Οι 20 Μονές του Αγίου Όρους | Χαλκιδική',
    en: 'The 20 Monasteries of Mount Athos | Halkidiki',
    de: 'Die 20 Klöster des Berges Athos | Chalkidiki',
    bg: '20-те манастира на Света гора | Халкидики',
    ru: '20 монастырей Святой Горы Афон | Халкидики',
    ro: 'Cele 20 de mănăstiri din Muntele Athos | Halkidiki', sr: '20 manastira Svete Gore | Halkidiki',
  } as L,
  metaMonasteriesDesc: {
    el: "Οι 20 μονές του Αγίου Όρους κατά ιεραρχία, από τη Μεγίστη Λαύρα (963) ως την Κωνσταμονίτου: 17 ελληνικές, μία ρωσική, μία σερβική και μία βουλγαρική.",
    en: "The 20 monasteries of Mount Athos in order of rank, from Great Lavra (963) to Konstamonitou: 17 Greek, plus one Russian, one Serbian and one Bulgarian.",
    de: "Die 20 Klöster des Athos nach Rang, von der Großen Lavra (963) bis Konstamonitou: 17 griechische sowie je ein russisches, serbisches und bulgarisches.",
    bg: "20-те манастира на Света гора по ранг, от Великата лавра (963) до Костамонит: 17 гръцки и по един руски, сръбски и български (Зограф).",
    ru: "20 монастырей Афона по иерархии, от Великой Лавры (963) до Констамониту: 17 греческих и по одному русскому, сербскому и болгарскому.",
    ro: "Cele 20 de mănăstiri ale Muntelui Athos în ordinea rangului, de la Marea Lavră (963) la Konstamonitou: 17 grecești și câte una rusă, sârbă și bulgară.",
    sr: "20 manastira Svete Gore po rangu, od Velike Lavre (963) do Konstamonita: 17 grčkih i po jedan ruski, srpski (Hilandar) i bugarski (Zograf).",
  } as L,
  metaHowToVisitTitle: {
    el: 'Πώς να Επισκεφθείτε το Άγιο Όρος | Χαλκιδική',
    en: 'How to Visit Mount Athos | Halkidiki',
    de: 'Berg Athos besuchen | Chalkidiki',
    bg: 'Как да посетите Света гора | Халкидики',
    ru: 'Как посетить Святую Гору Афон | Халкидики',
    ro: 'Cum să vizitați Muntele Athos | Halkidiki', sr: 'Kako posetiti Svetu Goru | Halkidiki',
  } as L,
  metaHowToVisitDesc: {
    el: "Πώς να επισκεφθείτε το Άγιο Όρος: μόνο άνδρες άνω των 18, διαμονητήριο για 4 μέρες και 3 νύχτες, κράτηση 2–4 εβδομάδες νωρίτερα, πλοίο Ουρανούπολη–Δάφνη.",
    en: "How to visit Mount Athos: men aged 18+ only, a Diamonitirion permit for 4 days and 3 nights, booked 2–4 weeks ahead, and the boat from Ouranoupoli to Dafni.",
    de: "Besuch auf dem Athos: nur Männer ab 18, Diamonitirion für 4 Tage und 3 Nächte, 2–4 Wochen im Voraus buchen, dann mit dem Schiff von Ouranoupoli nach Dafni.",
    bg: "Как да посетите Света гора: само мъже над 18 г., разрешително Диамонитирион за 4 дни и 3 нощи, резервация 2–4 седмици предварително, кораб Уранополи–Дафни.",
    ru: "Как посетить Афон: только мужчины от 18 лет, разрешение диамонитирион на 4 дня и 3 ночи, бронь за 2–4 недели, затем паром из Уранополиса в Дафни.",
    ro: "Vizita la Athos: doar bărbați de peste 18 ani, permisul Diamonitirion pentru 4 zile și 3 nopți, rezervat cu 2–4 săptămâni mai devreme, vapor până la Dafni.",
    sr: "Kako posetiti Svetu Goru: samo muškarci od 18 godina, dozvola diamonitirion za 4 dana i 3 noći, rezervacija 2–4 nedelje ranije, brod Uranopolis–Dafni.",
  } as L,
  metaGettingThereTitle: {
    el: 'Πώς να Πάτε στο Άγιο Όρος | Χαλκιδική',
    en: 'How to Get to Mount Athos | Halkidiki',
    de: 'Anreise zum Berg Athos | Chalkidiki',
    bg: 'Как да стигнете до Света гора | Халкидики',
    ru: 'Как добраться до Святой Горы Афон | Халкидики',
    ro: 'Cum ajungeți la Muntele Athos | Halkidiki', sr: 'Kako stići do Svete Gore | Halkidiki',
  } as L,
  metaAccommodationTitle: {
    el: 'Διαμονή στο Άγιο Όρος | Χαλκιδική',
    en: 'Accommodation on Mount Athos | Halkidiki',
    de: 'Unterkunft auf dem Berg Athos | Chalkidiki',
    bg: 'Настаняване на Света гора | Халкидики',
    ru: 'Проживание на Святой Горе Афон | Халкидики',
    ro: 'Cazare pe Muntele Athos | Halkidiki', sr: 'Smeštaj na Svetoj Gori | Halkidiki',
  } as L,
  metaDailyLifeTitle: {
    el: 'Καθημερινή Ζωή στο Άγιο Όρος | Χαλκιδική',
    en: 'Daily Life on Mount Athos | Halkidiki',
    de: 'Tägliches Leben auf dem Berg Athos | Chalkidiki',
    bg: 'Ежедневие на Света гора | Халкидики',
    ru: 'Повседневная жизнь на Святой Горе Афон | Халкидики',
    ro: 'Viața zilnică pe Muntele Athos | Halkidiki', sr: 'Svakodnevni život na Svetoj Gori | Halkidiki',
  } as L,
  metaHikingTitle: {
    el: 'Ανάβαση στην Κορυφή του Άθω | Χαλκιδική',
    en: 'Hiking to Mount Athos Peak | Halkidiki',
    de: 'Wanderung zum Gipfel des Berges Athos | Chalkidiki',
    bg: 'Изкачване на връх Атос | Халкидики',
    ru: 'Восхождение на вершину Афон | Халкидики',
    ro: 'Drumeție la vârful Muntelui Athos | Halkidiki', sr: 'Penjanje na vrh Atosa | Halkidiki',
  } as L,
  metaHistoryTitle: {
    el: 'Ιστορία & Θρύλοι του Αγίου Όρους | Χαλκιδική',
    en: 'History & Legends of Mount Athos | Halkidiki',
    de: 'Geschichte & Legenden des Berges Athos | Chalkidiki',
    bg: 'История и легенди на Света гора | Халкидики',
    ru: 'История и легенды Святой Горы Афон | Халкидики',
    ro: 'Istorie și legende ale Muntelui Athos | Halkidiki', sr: 'Istorija i legende Svete Gore | Halkidiki',
  } as L,
  metaGettingThereDesc: {
    el: "Πώς πάτε στο Άγιο Όρος: μόνο από θάλασσα. Θεσσαλονίκη–Ουρανούπολη περίπου 145 χλμ. (2,5 ώρες) με αυτοκίνητο ή ΚΤΕΛ, μετά πλοίο για Δάφνη, περίπου 2 ώρες.",
    en: "Getting to Mount Athos: only by sea. Thessaloniki to Ouranoupoli is about 145 km (2.5 hours) by car or KTEL bus, then the boat to Dafni takes about 2 hours.",
    de: "Anreise zum Athos: nur auf dem Seeweg. Thessaloniki–Ouranoupoli rund 145 km (2,5 Std.) mit Auto oder KTEL-Bus, dann ca. 2 Stunden mit dem Schiff nach Dafni.",
    bg: "Как да стигнете до Света гора: само по море. Солун–Уранополи е около 145 км (2,5 ч) с кола или автобус КТЕЛ, после корабът до Дафни пътува около 2 часа.",
    ru: "Как добраться до Афона: только морем. От Салоник до Уранополиса около 145 км (2,5 ч) на машине или автобусе KTEL, затем около 2 часов на пароме до Дафни.",
    ro: "Cum ajungeți la Muntele Athos: doar pe mare. Salonic–Ouranoupoli, circa 145 km (2,5 ore) cu mașina sau autobuzul KTEL, apoi vaporul până la Dafni, cam 2 ore.",
    sr: "Kako stići do Svete Gore: samo morem. Od Soluna do Uranopolisa oko 145 km (2,5 sata) kolima ili autobusom KTEL, pa brodom do Dafnija oko 2 sata.",
  } as L,
  metaAccommodationDesc: {
    el: "Διαμονή στο Άγιο Όρος: δεν υπάρχουν ξενοδοχεία. Οι μονές φιλοξενούν δωρεάν στο αρχονταρίκι όσους έχουν διαμονητήριο, σε απλά κοινόχρηστα δωμάτια.",
    en: "Accommodation on Mount Athos: no hotels. Monasteries host permit holders free in their archontariki, in simple shared rooms, with two frugal meals a day.",
    de: "Unterkunft auf dem Athos: keine Hotels. Die Klöster beherbergen Pilger mit Genehmigung kostenlos im Archontariki, in einfachen Schlafsälen.",
    bg: "Настаняване на Света гора: няма хотели. Манастирите приемат безплатно поклонниците с разрешително в архондарика – прости общи стаи и две скромни хранения.",
    ru: "Проживание на Афоне: гостиниц нет. Монастыри бесплатно принимают паломников с разрешением в архондарике — простые общие комнаты и две скромные трапезы в день.",
    ro: "Cazare pe Muntele Athos: nu există hoteluri. Mănăstirile găzduiesc gratuit pelerinii cu permis în arhondaric, în camere comune simple, cu două mese pe zi.",
    sr: "Smeštaj na Svetoj Gori: hotela nema. Manastiri besplatno primaju hodočasnike sa dozvolom u arhondariku – jednostavne zajedničke sobe i dva skromna obroka.",
  } as L,
  metaDailyLifeDesc: {
    el: "Η καθημερινή ζωή στο Άγιο Όρος: προσευχή, εργασία, υπακοή, ταπείνωση. Η μέρα των μοναχών ξεκινά με το Μεσονυκτικό στις 3:00 και κλείνει με το Απόδειπνο.",
    en: "Daily life on Mount Athos: prayer, work, obedience and humility. The monks' day starts with the Midnight Office at 3:00 and ends with Compline.",
    de: "Alltag auf dem Athos: Gebet, Arbeit, Gehorsam und Demut. Der Tag der Mönche beginnt um 3 Uhr mit dem Mitternachtsgebet und endet mit der Komplet.",
    bg: "Ежедневието на Света гора: молитва, труд, послушание и смирение. Денят на монасите започва в 3:00 с полунощницата и завършва с повечерието.",
    ru: "Повседневная жизнь на Афоне: молитва, труд, послушание и смирение. День монахов начинается в 3:00 с полунощницы и заканчивается повечерием.",
    ro: "Viața zilnică pe Muntele Athos: rugăciune, muncă, ascultare și smerenie. Ziua călugărilor începe la 3:00 cu Miezonoptica și se încheie cu Pavecernița.",
    sr: "Svakodnevni život na Svetoj Gori: molitva, rad, poslušanje i smirenje. Dan monaha počinje u 3:00 polunoćnicom i završava se povečerjem. Šta rade posetioci.",
  } as L,
  metaHikingDesc: {
    el: "Ανάβαση στον Άθω: κορυφή 2.033 μ. σε 6–8 ώρες, από τη Σκήτη της Αγίας Άννας μέσα από δάσος με καστανιές και έλατα ως τον ναό της Μεταμόρφωσης.",
    en: "Climbing Mount Athos: the 2,033 m summit in 6–8 hours, from the Skete of Agia Anna through chestnut and fir forest to the Church of the Transfiguration.",
    de: "Aufstieg auf den Athos: 2.033 m in 6–8 Stunden, von der Skite Agia Anna durch Kastanien- und Tannenwald bis zur Verklärungskirche auf dem Gipfel.",
    bg: "Изкачване на Атон: връх 2033 м за 6–8 часа, от скита „Света Анна“ през кестенови и елови гори до храма „Преображение Господне“ на върха.",
    ru: "Восхождение на Афон: вершина 2033 м за 6–8 часов, от скита Святой Анны через каштановые и пихтовые леса к храму Преображения на вершине.",
    ro: "Urcarea pe Muntele Athos: vârful de 2.033 m în 6–8 ore, de la Schitul Sfânta Ana, prin păduri de castani și brazi, până la biserica Schimbării la Față.",
    sr: "Uspon na Atos: vrh od 2.033 m za 6–8 sati, od skita Svete Ane kroz šume kestena i jele do crkve Preobraženja Gospodnjeg na samom vrhu.",
  } as L,
  metaHistoryDesc: {
    el: "Η ιστορία του Αγίου Όρους: μοναχική ζωή χωρίς διακοπή από τον 10ο αιώνα, χειρόγραφα και εικόνες άνω των 1.000 ετών και μοναχοί όπως ο Άγιος Παΐσιος.",
    en: "History of Mount Athos: monastic life unbroken since the 10th century, manuscripts and icons over 1,000 years old, and monks such as Saint Paisios.",
    de: "Geschichte des Athos: ununterbrochenes Mönchsleben seit dem 10. Jahrhundert, über 1.000 Jahre alte Handschriften und Ikonen und Mönche wie der hl. Paisios.",
    bg: "Историята на Света гора: непрекъснат монашески живот от X век, ръкописи и икони на повече от 1000 години и монаси като свети Паисий Светогорец.",
    ru: "История Афона: непрерывная монашеская жизнь с X века, рукописи и иконы старше 1000 лет, чудотворные иконы и монахи, такие как преподобный Паисий.",
    ro: "Istoria Muntelui Athos: viață monahală neîntreruptă din secolul al X-lea, manuscrise și icoane de peste 1.000 de ani și călugări precum Sfântul Paisie.",
    sr: "Istorija Svete Gore: neprekidan monaški život od 10. veka, rukopisi i ikone stariji od 1.000 godina i monasi poput Svetog Pajsija Svetogorca.",
  } as L,
};

// Helper to get translated string
// Missing languages fall back to English, never to Greek (a Serbian reader
// can follow English, not Greek); Serbian is shown in the Latin alphabet.
export function tr(key: keyof typeof t, locale: string): string {
  const own = t[key]?.[locale];
  if (own) return locale === 'sr' ? serbianLatin(own) : own;
  return t[key]?.en || t[key]?.el || '';
}
