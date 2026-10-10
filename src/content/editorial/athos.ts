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
  } as L,
  landingLocation: { el: 'Χερσόνησος Άθω, Χαλκιδική', en: 'Athos Peninsula, Halkidiki', de: 'Athos-Halbinsel, Chalkidiki', bg: 'Полуостров Атос, Халкидики', ru: 'Полуостров Афон, Халкидики', ro: 'Peninsula Athos, Halkidiki' , sr: 'Poluostrvo Atos, Halkidiki' } as L,
  landingIntro: {
    el: 'Το Άγιο Όρος αποτελεί έναν από τους πιο ιδιαίτερους και πνευματικά σημαντικούς τόπους στον κόσμο. Πρόκειται για μια μοναστική πολιτεία με ιστορία άνω των 1.000 ετών, η οποία βρίσκεται στην τρίτη χερσόνησο της Χαλκιδικής.',
    en: 'Mount Athos is one of the most unique and spiritually significant places in the world. It is a monastic state with a history spanning over 1,000 years, located on the third peninsula of Halkidiki.',
    de: 'Der Berg Athos ist einer der einzigartigsten und spirituell bedeutendsten Orte der Welt. Es ist ein Klosterstaat mit einer über 1.000-jährigen Geschichte auf der dritten Halbinsel von Chalkidiki.',
    bg: 'Света гора е едно от най-уникалните и духовно значими места в света. Това е монашеска държава с над 1000-годишна история, разположена на третия полуостров на Халкидики.',
    ru: 'Святая Гора Афон — одно из самых уникальных и духовно значимых мест в мире. Это монашеское государство с более чем 1000-летней историей, расположенное на третьем полуострове Халкидики.',
    ro: 'Muntele Athos este unul dintre cele mai unice și semnificative locuri spirituale din lume. Este un stat monastic cu o istorie de peste 1.000 de ani, situat pe a treia peninsulă din Halkidiki.',
  } as L,
  landingIntro2: {
    el: 'Συχνά αποκαλείται «Περιβόλι της Παναγίας» και λειτουργεί ως Αυτόνομη Μοναστική Πολιτεία σύμφωνα με το ελληνικό Σύνταγμα. Η περιοχή εκτείνεται σε 335 τετραγωνικά χιλιόμετρα, με κορυφή στα 2.033 μέτρα. Σήμερα φιλοξενεί περίπου 2.000 μοναχούς.',
    en: 'Often called "The Garden of the Virgin Mary", it functions as an Autonomous Monastic State under the Greek Constitution. The area covers 335 square kilometers, with the peak reaching 2,033 meters. Today it is home to approximately 2,000 monks.',
    de: 'Oft als "Garten der Jungfrau Maria" bezeichnet, funktioniert es als autonomer Klosterstaat gemäß der griechischen Verfassung. Das Gebiet umfasst 335 Quadratkilometer, mit dem Gipfel auf 2.033 Metern. Heute leben dort etwa 2.000 Mönche.',
    bg: 'Често наричана „Градината на Богородица", тя функционира като автономна монашеска държава съгласно гръцката конституция. Територията обхваща 335 квадратни километра, а върхът достига 2033 метра. Днес там живеят около 2000 монаси.',
    ru: 'Часто называемая «Садом Богородицы», она функционирует как Автономное монашеское государство согласно греческой конституции. Территория охватывает 335 квадратных километров, а вершина достигает 2033 метров. Сегодня здесь проживают около 2000 монахов.',
    ro: 'Adesea numit „Grădina Maicii Domnului", funcționează ca Stat Monastic Autonom conform Constituției grecești. Zona acoperă 335 de kilometri pătrați, cu vârful la 2.033 de metri. Astăzi găzduiește aproximativ 2.000 de călugări.',
  } as L,
  guideTitle: { el: 'Οδηγός Αγίου Όρους', en: 'Mount Athos Guide', de: 'Berg Athos Reiseführer', bg: 'Пътеводител', ru: 'Путеводитель', ro: 'Ghid', sr: 'Vodič' } as L,

  // Nav items
  navMonasteries: { el: 'Οι 20 Μονές', en: 'The 20 Monasteries', de: 'Die 20 Klöster', bg: '20-те манастира', ru: '20 монастырей', ro: 'Cele 20 de mănăstiri', sr: '20 manastira' } as L,
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
  } as L,
  descHowToVisit: {
    el: 'Κανόνες εισόδου, διαμονητήριο, Άβατον, ποιος μπορεί να μπει',
    en: 'Entry rules, permits, Avaton, who can enter',
    de: 'Einreiseregeln, Genehmigungen, Avaton, wer einreisen darf',
    bg: 'Правила за влизане, разрешителни, Аватон, кой може да влезе',
    ru: 'Правила входа, разрешения, Аватон, кто может войти',
    ro: 'Reguli de intrare, permise, Avaton, cine poate intra',
  } as L,
  descGettingThere: {
    el: 'Μεταφορές από Θεσσαλονίκη, Ουρανούπολη, πλοία προς Δάφνη',
    en: 'Transport from Thessaloniki, Ouranoupoli, boats to Dafni',
    de: 'Transport von Thessaloniki, Ouranoupoli, Boote nach Dafni',
    bg: 'Транспорт от Солун, Уранополи, кораби до Дафни',
    ru: 'Транспорт из Салоников, Уранополис, лодки до Дафни',
    ro: 'Transport din Salonic, Ouranoupoli, bărci spre Dafni',
  } as L,
  descAccommodation: {
    el: 'Αρχονταρίκι, ξενώνες μονών, φιλοξενία και κόστος',
    en: 'Archontariki, monastery guesthouses, hospitality and costs',
    de: 'Archontariki, Klostergästehäuser, Gastfreundschaft und Kosten',
    bg: 'Архонтарики, манастирски гостоприемници, гостоприемство и разходи',
    ru: 'Архондарик, монастырские гостиницы, гостеприимство и расходы',
    ro: 'Archontariki, case de oaspeți mănăstirești, ospitalitate și costuri',
  } as L,
  descDailyLife: {
    el: 'Πρόγραμμα μοναχών, τι κάνει ο επισκέπτης, πνευματικό ταξίδι',
    en: 'Monks schedule, what visitors do, spiritual journey',
    de: 'Mönchsprogramm, was Besucher tun, spirituelle Reise',
    bg: 'Програма на монасите, какво правят посетителите, духовно пътуване',
    ru: 'Расписание монахов, чем занимаются посетители, духовное путешествие',
    ro: 'Programul călugărilor, ce fac vizitatorii, călătorie spirituală',
  } as L,
  descHiking: {
    el: 'Κορυφή 2.033 μέτρα, διαδρομή 6-8 ώρες, πρακτικές πληροφορίες',
    en: 'Summit 2,033 meters, 6-8 hour route, practical information',
    de: 'Gipfel 2.033 Meter, 6-8 Stunden Route, praktische Informationen',
    bg: 'Връх 2033 метра, маршрут 6-8 часа, практическа информация',
    ru: 'Вершина 2033 метра, маршрут 6-8 часов, практическая информация',
    ro: 'Vârf 2.033 metri, traseu de 6-8 ore, informații practice',
  } as L,
  descHistory: {
    el: 'Βυζαντινή κληρονομιά, θαυματουργές εικόνες, διάσημοι μοναχοί',
    en: 'Byzantine heritage, miraculous icons, famous monks',
    de: 'Byzantinisches Erbe, wundertätige Ikonen, berühmte Mönche',
    bg: 'Византийско наследство, чудотворни икони, известни монаси',
    ru: 'Византийское наследие, чудотворные иконы, знаменитые монахи',
    ro: 'Moștenire bizantină, icoane miraculoase, călugări celebri',
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
    el: 'Όλα όσα πρέπει να ξέρετε για το Άγιο Όρος: μοναστήρια, πώς να πάτε, κανόνες επίσκεψης, διαμονή, ιστορία.',
    en: 'Everything you need to know about Mount Athos: monasteries, how to visit, rules, accommodation, history.',
    de: 'Alles was Sie über den Berg Athos wissen müssen: Klöster, Besuch, Regeln, Unterkunft, Geschichte.',
    bg: 'Всичко, което трябва да знаете за Света гора: манастири, как да посетите, правила, настаняване, история.',
    ru: 'Всё, что нужно знать о Святой Горе Афон: монастыри, как посетить, правила, проживание, история.',
    ro: 'Tot ce trebuie să știți despre Muntele Athos: mănăstiri, cum să vizitați, reguli, cazare, istorie.',
    sr: 'Sve što treba da znate o Svetoj Gori: manastiri, kako posetiti, pravila, smeštaj, istorija.',
  } as L,
  metaMonasteriesTitle: {
    el: 'Οι 20 Μονές του Αγίου Όρους | Χαλκιδική',
    en: 'The 20 Monasteries of Mount Athos | Halkidiki',
    de: 'Die 20 Klöster des Berg Athos | Chalkidiki',
    bg: '20-те манастира на Света гора | Халкидики',
    ru: '20 монастырей Святой Горы Афон | Халкидики',
    ro: 'Cele 20 de mănăstiri din Muntele Athos | Halkidiki', sr: '20 manastira Svete Gore | Halkidiki',
  } as L,
  metaMonasteriesDesc: {
    el: 'Πλήρης λίστα και των 20 μοναστηριών του Αγίου Όρους κατά σειρά ιεραρχίας, με πληροφορίες για σκήτες, κελιά και καλύβες.',
    en: 'Complete list of all 20 monasteries of Mount Athos in hierarchical order, with information about sketes, cells and hermitages.',
    de: 'Vollständige Liste aller 20 Klöster des Berg Athos in hierarchischer Reihenfolge, mit Informationen über Skiten, Zellen und Einsiedeleien.',
    bg: 'Пълен списък на всичките 20 манастира на Света гора в йерархичен ред, с информация за скитове, килии и отшелничества.',
    ru: 'Полный список всех 20 монастырей Святой Горы Афон в иерархическом порядке, с информацией о скитах, кельях и отшельничествах.',
    ro: 'Lista completă a tuturor celor 20 de mănăstiri din Muntele Athos în ordine ierarhică, cu informații despre schituri, chilii și pustnicii.',
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
    el: 'Κανόνες επίσκεψης Αγίου Όρους: Άβατον, διαμονητήριο, ποιος μπορεί να μπει, πρόσβαση μέσω Ουρανούπολης.',
    en: 'Mount Athos visiting rules: Avaton, Diamonitirion permit, who can enter, access via Ouranoupoli.',
    de: 'Besuchsregeln für den Berg Athos: Avaton, Diamonitirion-Genehmigung, wer einreisen darf, Zugang über Ouranoupoli.',
    bg: 'Правила за посещение на Света гора: Аватон, разрешително Диамонитирион, кой може да влезе, достъп през Уранополи.',
    ru: 'Правила посещения Святой Горы Афон: Аватон, разрешение Диамонитирион, кто может войти, доступ через Уранополис.',
    ro: 'Regulile de vizitare a Muntelui Athos: Avaton, permisul Diamonitirion, cine poate intra, acces prin Ouranoupoli.',
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
    de: 'Wanderung zum Gipfel des Berg Athos | Chalkidiki',
    bg: 'Изкачване на връх Атос | Халкидики',
    ru: 'Восхождение на вершину Афон | Халкидики',
    ro: 'Drumeție la vârful Muntelui Athos | Halkidiki', sr: 'Penjanje na vrh Atosa | Halkidiki',
  } as L,
  metaHistoryTitle: {
    el: 'Ιστορία & Θρύλοι του Αγίου Όρους | Χαλκιδική',
    en: 'History & Legends of Mount Athos | Halkidiki',
    de: 'Geschichte & Legenden des Berg Athos | Chalkidiki',
    bg: 'История и легенди на Света гора | Халкидики',
    ru: 'История и легенды Святой Горы Афон | Халкидики',
    ro: 'Istorie și legende ale Muntelui Athos | Halkidiki', sr: 'Istorija i legende Svete Gore | Halkidiki',
  } as L,
  metaGettingThereDesc: {
    el: 'Αναλυτικές οδηγίες μετακίνησης προς το Άγιο Όρος: από Θεσσαλονίκη στην Ουρανούπολη, πλοίο προς Δάφνη, εναλλακτική είσοδος από Ιερισσό.',
    en: 'Detailed transport guide to Mount Athos: from Thessaloniki to Ouranoupoli, boat to Dafni, alternative entry from Ierissos.',
    de: 'Detaillierte Anreiseanleitung zum Berg Athos: von Thessaloniki nach Ouranoupoli, Boot nach Dafni, alternativer Zugang über Ierissos.',
    bg: 'Подробно ръководство за транспорт до Света гора: от Солун до Уранополи, кораб до Дафни, алтернативен вход от Йерисос.',
    ru: 'Подробный путеводитель по транспорту до Святой Горы Афон: из Салоников в Уранополис, лодка до Дафни, альтернативный вход из Иериссоса.',
    ro: 'Ghid detaliat de transport spre Muntele Athos: din Salonic la Ouranoupoli, barcă spre Dafni, intrare alternativă din Ierissos.',
  } as L,
  metaAccommodationDesc: {
    el: 'Πού να μείνετε στο Άγιο Όρος: αρχονταρίκια μονών, φιλοξενία, κόστος, τι να περιμένετε και πρακτικές πληροφορίες.',
    en: 'Where to stay on Mount Athos: monastery guest quarters, hospitality, costs, what to expect and practical information.',
    de: 'Unterkunft auf dem Berg Athos: Klostergästehäuser, Gastfreundschaft, Kosten, was Sie erwartet und praktische Informationen.',
    bg: 'Къде да отседнете на Света гора: манастирски гостоприемници, гостоприемство, разходи, какво да очаквате и практическа информация.',
    ru: 'Где остановиться на Святой Горе Афон: монастырские гостиницы, гостеприимство, расходы, чего ожидать и практическая информация.',
    ro: 'Unde să stați pe Muntele Athos: camerele de oaspeți ale mănăstirilor, ospitalitate, costuri, la ce să vă așteptați și informații practice.',
  } as L,
  metaDailyLifeDesc: {
    el: 'Ανακαλύψτε την καθημερινή ζωή στο Άγιο Όρος: πρόγραμμα μοναχών, προσευχή, εργασία, τι κάνει ο επισκέπτης και η πνευματική εμπειρία.',
    en: 'Discover daily life on Mount Athos: monk schedules, prayer, work, what visitors experience, and the spiritual journey.',
    de: 'Entdecken Sie das tägliche Leben auf dem Berg Athos: Mönchsprogramm, Gebet, Arbeit, Besuchererlebnisse und die spirituelle Reise.',
    bg: 'Открийте ежедневието на Света гора: програма на монасите, молитва, работа, какво преживяват посетителите и духовното пътуване.',
    ru: 'Откройте повседневную жизнь на Святой Горе Афон: расписание монахов, молитва, труд, впечатления посетителей и духовное путешествие.',
    ro: 'Descoperiți viața zilnică pe Muntele Athos: programul călugărilor, rugăciune, muncă, experiența vizitatorilor și călătoria spirituală.',
  } as L,
  metaHikingDesc: {
    el: 'Ανεβείτε στην κορυφή του Άθω στα 2.033 μέτρα: διαδρομή, διάρκεια 6-8 ώρες, συμβουλές και τι να περιμένετε.',
    en: 'Climb to the peak of Mount Athos at 2,033 meters: route, 6-8 hour duration, tips, and what to expect.',
    de: 'Besteigen Sie den Gipfel des Berg Athos auf 2.033 Metern: Route, 6-8 Stunden Dauer, Tipps und was Sie erwartet.',
    bg: 'Изкачете се на върха на Атос на 2033 метра: маршрут, продължителност 6-8 часа, съвети и какво да очаквате.',
    ru: 'Поднимитесь на вершину Афон на высоте 2033 метра: маршрут, продолжительность 6-8 часов, советы и чего ожидать.',
    ro: 'Urcați pe vârful Muntelui Athos la 2.033 de metri: traseu, durată 6-8 ore, sfaturi și la ce să vă așteptați.',
  } as L,
  metaHistoryDesc: {
    el: 'Η ιστορία του Αγίου Όρους, βυζαντινή κληρονομιά, θαυματουργές εικόνες, διάσημοι μοναχοί και γιατί είναι μοναδικό.',
    en: 'The history of Mount Athos, Byzantine heritage, miraculous icons, famous monks, and why it is unique.',
    de: 'Die Geschichte des Berg Athos, byzantinisches Erbe, wundertätige Ikonen, berühmte Mönche und warum er einzigartig ist.',
    bg: 'Историята на Света гора, византийско наследство, чудотворни икони, известни монаси и защо е уникална.',
    ru: 'История Святой Горы Афон, византийское наследие, чудотворные иконы, знаменитые монахи и почему она уникальна.',
    ro: 'Istoria Muntelui Athos, moștenire bizantină, icoane miraculoase, călugări celebri și de ce este unic.',
  } as L,
};

// Helper to get translated string
export function tr(key: keyof typeof t, locale: string): string {
  return t[key]?.[locale] || t[key]?.el || t[key]?.en || '';
}
