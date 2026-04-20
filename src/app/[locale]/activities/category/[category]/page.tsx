import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import PageClient from './_client';
import { localeUrl, generateBreadcrumbLD, ogImageUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export const revalidate = 3600; // ISR: 1 hour

type CategoryKey = 'historical' | 'nature' | 'waterSports' | 'boatTrips' | 'wellness' | 'family' | 'nightlife' | 'religious';

const VALID_CATEGORIES: CategoryKey[] = ['historical', 'nature', 'waterSports', 'boatTrips', 'wellness', 'family', 'nightlife', 'religious'];

// ── Category Labels (7 languages) ──────────────────────────────────────
const CATEGORY_LABELS: Record<CategoryKey, Record<string, string>> = {
  historical: {
    el: 'Ιστορικά & Αρχαιολογικά',
    en: 'Historical & Archaeological',
    de: 'Historisch & Archäologisch',
    bg: 'Исторически & Археологически',
    ru: 'Исторические & Археологические',
    ro: 'Istoric & Arheologic',
    sr: 'Istorijski & Arheološki',
  },
  nature: {
    el: 'Φύση & Πεζοπορία',
    en: 'Nature & Hiking',
    de: 'Natur & Wandern',
    bg: 'Природа & Пешеходен Туризъм',
    ru: 'Природа & Пешие Прогулки',
    ro: 'Natură & Drumeții',
    sr: 'Priroda & Planinarenje',
  },
  waterSports: {
    el: 'Θαλάσσια Σπορ',
    en: 'Water Sports',
    de: 'Wassersport',
    bg: 'Водни Спортове',
    ru: 'Водные Виды Спорта',
    ro: 'Sporturi Nautice',
    sr: 'Vodeni Sportovi',
  },
  boatTrips: {
    el: 'Βόλτες με Σκάφος',
    en: 'Boat Trips',
    de: 'Bootsausflüge',
    bg: 'Разходки с Лодка',
    ru: 'Морские Прогулки',
    ro: 'Excursii cu Barca',
    sr: 'Izleti Brodom',
  },
  wellness: {
    el: 'Wellness & Spa',
    en: 'Wellness & Spa',
    de: 'Wellness & Spa',
    bg: 'Уелнес & Спа',
    ru: 'Велнес & Спа',
    ro: 'Wellness & Spa',
    sr: 'Velnes & Spa',
  },
  family: {
    el: 'Οικογενειακές Δραστηριότητες',
    en: 'Family Activities',
    de: 'Familienaktivitäten',
    bg: 'Семейни Дейности',
    ru: 'Семейные Развлечения',
    ro: 'Activități pentru Familie',
    sr: 'Porodične Aktivnosti',
  },
  nightlife: {
    el: 'Νυχτερινή Ζωή',
    en: 'Nightlife',
    de: 'Nachtleben',
    bg: 'Нощен Живот',
    ru: 'Ночная Жизнь',
    ro: 'Viață de Noapte',
    sr: 'Noćni Život',
  },
  religious: {
    el: 'Θρησκευτικός Τουρισμός',
    en: 'Religious Tourism',
    de: 'Religiöser Tourismus',
    bg: 'Религиозен Туризъм',
    ru: 'Религиозный Туризм',
    ro: 'Turism Religios',
    sr: 'Verski Turizam',
  },
};

// ── Meta Descriptions (7 languages) ────────────────────────────────────
const CATEGORY_DESCRIPTIONS: Record<CategoryKey, Record<string, string>> = {
  historical: {
    el: 'Εξερευνήστε αρχαιολογικούς χώρους στη Χαλκιδική: Αρχαία Στάγειρα, Σπήλαιο Πετραλώνων, Αρχαία Όλυνθος, Μουσείο Πολυγύρου. Οδηγός 2025.',
    en: 'Explore archaeological sites in Halkidiki: Ancient Stagira, Petralona Cave, Ancient Olynthos, Polygyros Museum. Complete guide 2025.',
    de: 'Entdecken Sie archäologische Stätten in Chalkidiki: Antikes Stagira, Petralona-Höhle, Antikes Olynthos, Museum Polygyros. Reiseführer 2025.',
    bg: 'Разгледайте археологически обекти в Халкидики: Древна Стагира, Пещера Петралона, Древен Олинт, Музей Полигирос. Пътеводител 2025.',
    ru: 'Исследуйте археологические памятники Халкидики: Древняя Стагира, Пещера Петралона, Древний Олинф, Музей Полигирос. Путеводитель 2025.',
    ro: 'Explorați siturile arheologice din Halkidiki: Stagira Antică, Peștera Petralona, Olynthos Antic, Muzeul Polygyros. Ghid 2025.',
    sr: 'Istražite arheološke lokalitete u Halkidikiju: Drevna Stagira, Pećina Petralona, Drevni Olint, Muzej Poligiros. Vodič 2025.',
  },
  nature: {
    el: 'Πεζοπορία και φύση στη Χαλκιδική: μονοπάτια Σιθωνίας, Χολομόντας (1.165μ), δάσος Ταξιάρχη, παρατήρηση πουλιών. Οδηγός 2025.',
    en: 'Hiking and nature in Halkidiki: Sithonia trails, Mount Holomontas (1,165m), Taxiarchis beech forest, birdwatching. Complete guide 2025.',
    de: 'Wandern und Natur in Chalkidiki: Sithonia-Pfade, Berg Holomontas (1.165m), Buchenwald Taxiarchis, Vogelbeobachtung. Reiseführer 2025.',
    bg: 'Пешеходен туризъм и природа в Халкидики: пътеки в Ситония, Холомонтас (1165м), букова гора Таксиархис. Пътеводител 2025.',
    ru: 'Пешие маршруты и природа Халкидики: тропы Ситонии, Холомонтас (1165м), буковый лес Таксиархис, наблюдение за птицами. Путеводитель 2025.',
    ro: 'Drumeții și natură în Halkidiki: trasee Sithonia, Muntele Holomontas (1.165m), pădurea de fagi Taxiarchis. Ghid 2025.',
    sr: 'Planinarenje i priroda u Halkidikiju: staze Sitonije, Holomontas (1.165m), bukova šuma Taksijarhis. Vodič 2025.',
  },
  waterSports: {
    el: 'Θαλάσσια σπορ στη Χαλκιδική: jet ski, windsurf, SUP, parasailing, καγιάκ. Οργανωμένες παραλίες Κασσάνδρας & Σιθωνίας.',
    en: 'Water sports in Halkidiki: jet ski, windsurf, SUP, parasailing, kayak. Organized beaches in Kassandra & Sithonia.',
    de: 'Wassersport in Chalkidiki: Jetski, Windsurfen, SUP, Parasailing, Kajak. Organisierte Strände in Kassandra & Sithonia.',
    bg: 'Водни спортове в Халкидики: джет ски, уиндсърф, SUP, парасейлинг, каяк. Организирани плажове в Касандра и Ситония.',
    ru: 'Водные виды спорта в Халкидики: джет-ски, виндсерфинг, SUP, парасейлинг, каякинг. Организованные пляжи Кассандры и Ситонии.',
    ro: 'Sporturi nautice în Halkidiki: jet ski, windsurf, SUP, parasailing, caiac. Plaje organizate în Kassandra și Sithonia.',
    sr: 'Vodeni sportovi u Halkidikiju: džet ski, vindserf, SUP, parasejling, kajak. Organizovane plaže Kasandre i Sitonije.',
  },
  boatTrips: {
    el: 'Βόλτες με σκάφος στη Χαλκιδική: κρουαζιέρα Άθως από Ουρανούπολη, νησάκια Δρένια, Blue Lagoon Βουρβουρού, ηλιοβασίλεμα.',
    en: 'Boat trips in Halkidiki: Mount Athos cruise from Ouranoupoli, Drenia islands, Blue Lagoon Vourvourou, sunset cruises.',
    de: 'Bootsausflüge in Chalkidiki: Athos-Kreuzfahrt ab Ouranoupoli, Drenia-Inseln, Blue Lagoon Vourvourou, Sonnenuntergangsfahrten.',
    bg: 'Разходки с лодка в Халкидики: круиз до Атон от Уранополис, острови Дрения, Синята лагуна Вурвуру, залез.',
    ru: 'Морские прогулки в Халкидики: круиз к Афону из Уранополиса, острова Дрения, Голубая лагуна Вурвуру, закаты.',
    ro: 'Excursii cu barca în Halkidiki: croazieră Athos din Ouranoupoli, insulele Drenia, Blue Lagoon Vourvourou, croaziere la apus.',
    sr: 'Izleti brodom u Halkidikiju: krstarenje Atos iz Uranopolisa, ostrva Drenija, Plava laguna Vurvuru, zalasci sunca.',
  },
  wellness: {
    el: 'Wellness & Spa στη Χαλκιδική: Miraggio Thermal Spa, Sani Resort, Eagles Palace, θερμές πηγές, yoga retreats.',
    en: 'Wellness & spa in Halkidiki: Miraggio Thermal Spa, Sani Resort, Eagles Palace, thermal springs, yoga retreats.',
    de: 'Wellness & Spa in Chalkidiki: Miraggio Thermal Spa, Sani Resort, Eagles Palace, Thermalquellen, Yoga-Retreats.',
    bg: 'Уелнес и спа в Халкидики: Miraggio Thermal Spa, Sani Resort, Eagles Palace, термални извори, йога ретрийти.',
    ru: 'Велнес и спа в Халкидики: Miraggio Thermal Spa, Sani Resort, Eagles Palace, термальные источники, йога-ретриты.',
    ro: 'Wellness și spa în Halkidiki: Miraggio Thermal Spa, Sani Resort, Eagles Palace, izvoare termale, retrageri yoga.',
    sr: 'Velnes i spa u Halkidikiju: Miraggio Thermal Spa, Sani Resort, Eagles Palace, termalni izvori, joga retreati.',
  },
  family: {
    el: 'Οικογενειακές δραστηριότητες στη Χαλκιδική: Σπήλαιο Πετραλώνων, mini golf, banana boat, ιππασία, water parks.',
    en: 'Family activities in Halkidiki: Petralona Cave tours, mini golf, banana boat, horseback riding, water parks.',
    de: 'Familienaktivitäten in Chalkidiki: Petralona-Höhle, Minigolf, Bananenboot, Reiten, Wasserparks.',
    bg: 'Семейни дейности в Халкидики: Пещера Петралона, мини голф, банан, езда, водни паркове.',
    ru: 'Семейные развлечения в Халкидики: Пещера Петралона, мини-гольф, банан, верховая езда, аквапарки.',
    ro: 'Activități pentru familie în Halkidiki: Peștera Petralona, mini golf, banana boat, călărie, parcuri acvatice.',
    sr: 'Porodične aktivnosti u Halkidikiju: Pećina Petralona, mini golf, banana čamac, jahanje, vodeni parkovi.',
  },
  nightlife: {
    el: 'Νυχτερινή ζωή στη Χαλκιδική: Cavo Club, Cabana Beach Bar, Di Luna, μπαρ Χανιώτης. Οδηγός νυχτερινής διασκέδασης.',
    en: 'Nightlife in Halkidiki: Cavo Club, Cabana Beach Bar, Di Luna, Hanioti bars. Complete nightlife guide.',
    de: 'Nachtleben in Chalkidiki: Cavo Club, Cabana Beach Bar, Di Luna, Bars in Hanioti. Nachtleben-Guide.',
    bg: 'Нощен живот в Халкидики: Cavo Club, Cabana Beach Bar, Di Luna, барове в Ханиоти. Пътеводител за нощен живот.',
    ru: 'Ночная жизнь Халкидики: Cavo Club, Cabana Beach Bar, Di Luna, бары Ханиоти. Путеводитель по ночной жизни.',
    ro: 'Viață de noapte în Halkidiki: Cavo Club, Cabana Beach Bar, Di Luna, baruri Hanioti. Ghid viață de noapte.',
    sr: 'Noćni život u Halkidikiju: Cavo Club, Cabana Beach Bar, Di Luna, barovi Hanioti. Vodič za noćni život.',
  },
  religious: {
    el: 'Θρησκευτικός τουρισμός στη Χαλκιδική: προσκύνημα Άγιον Όρος, βυζαντινές εκκλησίες, μοναστήρια, ορθόδοξες γιορτές.',
    en: 'Religious tourism in Halkidiki: Mount Athos pilgrimage, Byzantine churches, monasteries, orthodox celebrations.',
    de: 'Religiöser Tourismus in Chalkidiki: Athos-Pilgerfahrt, byzantinische Kirchen, Klöster, orthodoxe Feste.',
    bg: 'Религиозен туризъм в Халкидики: поклонничество Атон, византийски църкви, манастири, православни празници.',
    ru: 'Религиозный туризм в Халкидики: паломничество на Афон, византийские церкви, монастыри, православные праздники.',
    ro: 'Turism religios în Halkidiki: pelerinaj Athos, biserici bizantine, mănăstiri, sărbători ortodoxe.',
    sr: 'Verski turizam u Halkidikiju: hodočašće Atos, vizantijske crkve, manastiri, pravoslavne proslave.',
  },
};

// ── Unique Content per Category (7 languages, real Halkidiki info) ──────
const CATEGORY_CONTENT: Record<CategoryKey, Record<string, string>> = {
  historical: {
    el: '<h2>Αρχαιολογικοί Θησαυροί της Χαλκιδικής</h2><p>Η Χαλκιδική φιλοξενεί μερικούς από τους σημαντικότερους αρχαιολογικούς χώρους της Ελλάδας. Τα <strong>Αρχαία Στάγειρα</strong>, γενέτειρα του Αριστοτέλη, προσφέρουν εντυπωσιακή θέα στο Αιγαίο. Το <strong>Σπήλαιο Πετραλώνων</strong> (700.000 ετών) φιλοξενεί το αρχαιότερο ανθρώπινο εύρημα στην Ευρώπη. Τα μωσαϊκά της <strong>Αρχαίας Ολύνθου</strong> αποτελούν μοναδικό δείγμα κλασικής τέχνης, ενώ το <strong>Αρχαιολογικό Μουσείο Πολυγύρου</strong> συγκεντρώνει ευρήματα από ολόκληρη τη Χαλκιδική. Μην παραλείψετε τη <strong>Διώρυγα της Νέας Ποτίδαιας</strong>, που χρονολογείται από την αρχαιότητα.</p>',
    en: '<h2>Archaeological Treasures of Halkidiki</h2><p>Halkidiki is home to some of Greece\'s most important archaeological sites. <strong>Ancient Stagira</strong>, birthplace of Aristotle, offers stunning Aegean views. <strong>Petralona Cave</strong> (700,000 years old) houses Europe\'s oldest human remains. The mosaics of <strong>Ancient Olynthos</strong> are a unique example of classical art, while the <strong>Polygyros Archaeological Museum</strong> gathers finds from across Halkidiki. Don\'t miss the <strong>Nea Potidea canal</strong>, dating back to antiquity.</p>',
    de: '<h2>Archäologische Schätze Chalkidikis</h2><p>Chalkidiki beherbergt einige der bedeutendsten archäologischen Stätten Griechenlands. <strong>Antikes Stagira</strong>, Geburtsort von Aristoteles, bietet atemberaubende Ägäis-Ausblicke. Die <strong>Petralona-Höhle</strong> (700.000 Jahre alt) beherbergt die ältesten menschlichen Überreste Europas. Die Mosaike von <strong>Antik Olynthos</strong> sind ein einzigartiges Beispiel klassischer Kunst, und das <strong>Archäologische Museum Polygyros</strong> sammelt Funde aus ganz Chalkidiki. Verpassen Sie nicht den <strong>Kanal von Nea Potidea</strong> aus der Antike.</p>',
    bg: '<h2>Археологически Съкровища на Халкидики</h2><p>Халкидики е дом на едни от най-важните археологически обекти в Гърция. <strong>Древна Стагира</strong>, родното място на Аристотел, предлага зашеметяващи гледки към Егейско море. <strong>Пещерата Петралона</strong> (на 700 000 години) пази най-старите човешки останки в Европа. Мозайките на <strong>Древен Олинт</strong> са уникален образец на класическото изкуство, а <strong>Археологическият музей в Полигирос</strong> събира находки от целия Халкидики.</p>',
    ru: '<h2>Археологические Сокровища Халкидики</h2><p>Халкидики является домом для одних из самых важных археологических памятников Греции. <strong>Древняя Стагира</strong>, родина Аристотеля, предлагает потрясающие виды на Эгейское море. <strong>Пещера Петралона</strong> (700 000 лет) хранит древнейшие человеческие останки в Европе. Мозаики <strong>Древнего Олинфа</strong> являются уникальным образцом классического искусства, а <strong>Археологический музей Полигироса</strong> собирает находки со всего Халкидики. Не пропустите <strong>канал Неа Потидеа</strong>, восходящий к античности.</p>',
    ro: '<h2>Comori Arheologice ale Halkidiki</h2><p>Halkidiki găzduiește unele dintre cele mai importante situri arheologice din Grecia. <strong>Stagira Antică</strong>, locul nașterii lui Aristotel, oferă vederi impresionante ale Mării Egee. <strong>Peștera Petralona</strong> (700.000 de ani) adăpostește cele mai vechi rămășițe umane din Europa. Mozaicurile din <strong>Olynthos Antic</strong> sunt un exemplu unic de artă clasică, iar <strong>Muzeul Arheologic Polygyros</strong> colectează descoperiri din întregul Halkidiki.</p>',
    sr: '<h2>Arheološka Blaga Halkidikija</h2><p>Halkidiki je dom nekih od najvažnijih arheoloških lokaliteta u Grčkoj. <strong>Drevna Stagira</strong>, rodno mesto Aristotela, pruža zapanjujuće poglede na Egejsko more. <strong>Pećina Petralona</strong> (700.000 godina stara) čuva najstarije ljudske ostatke u Evropi. Mozaici <strong>Drevnog Olinta</strong> su jedinstven primer klasične umetnosti, dok <strong>Arheološki muzej Poligirosa</strong> sakuplja nalaze iz celog Halkidikija.</p>',
  },
  nature: {
    el: '<h2>Φύση & Πεζοπορία στη Χαλκιδική</h2><p>Η Χαλκιδική προσφέρει εξαιρετικά μονοπάτια πεζοπορίας μέσα σε πευκοδάση και ελαιώνες. Η κορυφή του <strong>Χολομόντα</strong> (1.165μ) είναι το ψηλότερο σημείο, με μονοπάτια διαφόρων επιπέδων. Το <strong>δάσος οξιάς Ταξιάρχη</strong> αποτελεί μοναδικό οικοσύστημα με αιωνόβια δέντρα. Οι <strong>υγρότοποι Αγίου Μαμά</strong> φιλοξενούν σπάνια είδη πουλιών, ιδανικοί για birdwatching. Στη Σιθωνία, τα παράκτια μονοπάτια οδηγούν σε κρυφές παραλίες και φυσικά τοπία αξεπέραστης ομορφιάς.</p>',
    en: '<h2>Nature & Hiking in Halkidiki</h2><p>Halkidiki offers exceptional hiking trails through pine forests and olive groves. The summit of <strong>Mount Holomontas</strong> (1,165m) is the highest point, with trails of various difficulty levels. The <strong>Taxiarchis beech forest</strong> is a unique ecosystem with centuries-old trees. The <strong>Agios Mamas wetlands</strong> host rare bird species, ideal for birdwatching. In Sithonia, coastal trails lead to hidden beaches and natural landscapes of unsurpassed beauty.</p>',
    de: '<h2>Natur & Wandern in Chalkidiki</h2><p>Chalkidiki bietet außergewöhnliche Wanderwege durch Kiefernwälder und Olivenhaine. Der Gipfel des <strong>Berges Holomontas</strong> (1.165m) ist der höchste Punkt, mit Wegen verschiedener Schwierigkeitsgrade. Der <strong>Buchenwald von Taxiarchis</strong> ist ein einzigartiges Ökosystem mit jahrhundertealten Bäumen. Die <strong>Feuchtgebiete von Agios Mamas</strong> beherbergen seltene Vogelarten, ideal zur Vogelbeobachtung. In Sithonia führen Küstenwege zu versteckten Stränden und Naturlandschaften von unübertroffener Schönheit.</p>',
    bg: '<h2>Природа & Пешеходен Туризъм в Халкидики</h2><p>Халкидики предлага изключителни пешеходни пътеки през борови гори и маслинови горички. Върхът на <strong>Холомонтас</strong> (1165м) е най-високата точка, с пътеки с различна трудност. <strong>Буковата гора Таксиархис</strong> е уникална екосистема с вековни дървета. <strong>Влажните зони Агиос Мамас</strong> са дом на редки птици, идеални за наблюдение на птици. В Ситония крайбрежните пътеки водят до скрити плажове.</p>',
    ru: '<h2>Природа & Пешие Маршруты Халкидики</h2><p>Халкидики предлагает исключительные пешеходные маршруты через сосновые леса и оливковые рощи. Вершина <strong>Холомонтас</strong> (1165м) - высшая точка, с маршрутами различной сложности. <strong>Буковый лес Таксиархис</strong> - уникальная экосистема с вековыми деревьями. <strong>Водно-болотные угодья Агиос Мамас</strong> являются домом для редких видов птиц, идеальным местом для наблюдения за птицами. В Ситонии прибрежные тропы ведут к скрытым пляжам невероятной красоты.</p>',
    ro: '<h2>Natură & Drumeții în Halkidiki</h2><p>Halkidiki oferă trasee excepționale prin păduri de pini și livezi de măslini. Vârful <strong>Muntelui Holomontas</strong> (1.165m) este punctul cel mai înalt, cu trasee de diferite niveluri de dificultate. <strong>Pădurea de fagi Taxiarchis</strong> este un ecosistem unic cu arbori seculari. <strong>Zonele umede Agios Mamas</strong> găzduiesc specii rare de păsări, ideale pentru birdwatching. În Sithonia, traseele de coastă conduc la plaje ascunse.</p>',
    sr: '<h2>Priroda & Planinarenje u Halkidikiju</h2><p>Halkidiki nudi izvanredne staze za planinarenje kroz borove šume i maslinike. Vrh <strong>Holomontasa</strong> (1.165m) je najviša tačka, sa stazama različite težine. <strong>Bukova šuma Taksijarhis</strong> je jedinstven ekosistem sa vekovnim stablima. <strong>Močvare Agios Mamas</strong> su dom retkih vrsta ptica, idealne za posmatranje ptica. U Sitoniji, obalne staze vode do skrivenih plaža.</p>',
  },
  waterSports: {
    el: '<h2>Θαλάσσια Σπορ στη Χαλκιδική</h2><p>Η Χαλκιδική είναι παράδεισος για θαλάσσια σπορ. Στις οργανωμένες παραλίες της <strong>Κασσάνδρας</strong> θα βρείτε jet ski, windsurf, SUP και parasailing. Η <strong>Σιθωνία</strong> προσφέρει εξαιρετικές διαδρομές καγιάκ κατά μήκος της άγριας ακτογραμμής. Τα κρυστάλλινα νερά του <strong>Τορωναίου κόλπου</strong> είναι ιδανικά για snorkeling και καταδύσεις. Σχολές θαλάσσιων σπορ λειτουργούν σε δεκάδες παραλίες από Μάιο έως Οκτώβριο.</p>',
    en: '<h2>Water Sports in Halkidiki</h2><p>Halkidiki is a paradise for water sports. On the organized beaches of <strong>Kassandra</strong> you\'ll find jet ski, windsurf, SUP and parasailing. <strong>Sithonia</strong> offers exceptional kayak routes along the wild coastline. The crystal-clear waters of the <strong>Toroneos Gulf</strong> are ideal for snorkeling and diving. Water sports schools operate on dozens of beaches from May to October.</p>',
    de: '<h2>Wassersport in Chalkidiki</h2><p>Chalkidiki ist ein Paradies für Wassersport. An den organisierten Stränden von <strong>Kassandra</strong> finden Sie Jetski, Windsurfen, SUP und Parasailing. <strong>Sithonia</strong> bietet außergewöhnliche Kajakrouten entlang der wilden Küste. Die kristallklaren Gewässer des <strong>Golfs von Toroneos</strong> sind ideal zum Schnorcheln und Tauchen. Wassersportschulen sind an Dutzenden von Stränden von Mai bis Oktober in Betrieb.</p>',
    bg: '<h2>Водни Спортове в Халкидики</h2><p>Халкидики е рай за водните спортове. На организираните плажове на <strong>Касандра</strong> ще намерите джет ски, уиндсърф, SUP и парасейлинг. <strong>Ситония</strong> предлага изключителни маршрути за каяк по дивия бряг. Кристално чистите води на <strong>залива Торонеос</strong> са идеални за гмуркане. Школи за водни спортове работят на десетки плажове от май до октомври.</p>',
    ru: '<h2>Водные Виды Спорта в Халкидики</h2><p>Халкидики - рай для водных видов спорта. На организованных пляжах <strong>Кассандры</strong> вы найдете джет-ски, виндсерфинг, SUP и парасейлинг. <strong>Ситония</strong> предлагает исключительные маршруты для каякинга вдоль дикого побережья. Кристально чистые воды <strong>залива Торонеос</strong> идеальны для снорклинга и дайвинга. Школы водных видов спорта работают на десятках пляжей с мая по октябрь.</p>',
    ro: '<h2>Sporturi Nautice în Halkidiki</h2><p>Halkidiki este un paradis pentru sporturile nautice. Pe plajele organizate din <strong>Kassandra</strong> veți găsi jet ski, windsurf, SUP și parasailing. <strong>Sithonia</strong> oferă rute excepționale de caiac de-a lungul coastei sălbatice. Apele cristal-clear ale <strong>Golfului Toroneos</strong> sunt ideale pentru snorkeling și scufundări. Școlile de sporturi nautice funcționează pe zeci de plaje din mai până în octombrie.</p>',
    sr: '<h2>Vodeni Sportovi u Halkidikiju</h2><p>Halkidiki je raj za vodene sportove. Na organizovanim plažama <strong>Kasandre</strong> naći ćete džet ski, vindserf, SUP i parasejling. <strong>Sitonija</strong> nudi izvanredne rute za kajak duž divlje obale. Kristalno čiste vode <strong>Toronejskog zaliva</strong> su idealne za ronjenje. Škole vodenih sportova rade na desetinama plaža od maja do oktobra.</p>',
  },
  boatTrips: {
    el: '<h2>Βόλτες με Σκάφος στη Χαλκιδική</h2><p>Η κρουαζιέρα στο <strong>Άγιον Όρος</strong> από την Ουρανούπολη (3 ώρες, ~20-30 ευρώ) προσφέρει μοναδική θέα στα μοναστήρια από τη θάλασσα. Τα <strong>νησάκια Δρένια</strong> κοντά στην Αμμουλιανή είναι ιδανικά για μονοήμερη εκδρομή. Η <strong>Blue Lagoon</strong> στο Βουρβουρού εντυπωσιάζει με τα τιρκουάζ νερά της. Ενοικίαση σκάφους, sunset cruises και ψαρόβαρκες διατίθενται σε όλη την ακτογραμμή.</p>',
    en: '<h2>Boat Trips in Halkidiki</h2><p>The <strong>Mount Athos cruise</strong> from Ouranoupoli (3 hours, ~20-30 euros) offers unique views of the monasteries from the sea. The <strong>Drenia islands</strong> near Ammouliani are perfect for a day trip. The <strong>Blue Lagoon</strong> in Vourvourou impresses with its turquoise waters. Private boat rental, sunset cruises and fishing boats are available along the entire coastline.</p>',
    de: '<h2>Bootsausflüge in Chalkidiki</h2><p>Die <strong>Athos-Kreuzfahrt</strong> ab Ouranoupoli (3 Stunden, ~20-30 Euro) bietet einzigartige Blicke auf die Klöster vom Meer aus. Die <strong>Drenia-Inseln</strong> bei Ammouliani sind perfekt für einen Tagesausflug. Die <strong>Blaue Lagune</strong> in Vourvourou beeindruckt mit ihrem türkisfarbenen Wasser. Privatbootvermietung, Sonnenuntergangsfahrten und Fischerboote sind entlang der gesamten Küste verfügbar.</p>',
    bg: '<h2>Разходки с Лодка в Халкидики</h2><p>Круизът до <strong>Атон</strong> от Уранополис (3 часа, ~20-30 евро) предлага уникална гледка към манастирите от морето. <strong>Островите Дрения</strong> близо до Амулиани са перфектни за еднодневна екскурзия. <strong>Синята лагуна</strong> във Вурвуру впечатлява с тюркоазените си води. Отдаване под наем на лодки и круизи по залез са достъпни по цялото крайбрежие.</p>',
    ru: '<h2>Морские Прогулки в Халкидики</h2><p>Круиз к <strong>Афону</strong> из Уранополиса (3 часа, ~20-30 евро) предлагает уникальные виды на монастыри с моря. <strong>Острова Дрения</strong> возле Аммулиани идеальны для однодневной поездки. <strong>Голубая лагуна</strong> в Вурвуру впечатляет бирюзовыми водами. Аренда лодок, круизы на закате и рыбацкие лодки доступны вдоль всего побережья.</p>',
    ro: '<h2>Excursii cu Barca în Halkidiki</h2><p>Croaziera la <strong>Muntele Athos</strong> din Ouranoupoli (3 ore, ~20-30 euro) oferă vederi unice ale mănăstirilor de pe mare. <strong>Insulele Drenia</strong> lângă Ammouliani sunt perfecte pentru o excursie de o zi. <strong>Laguna Albastră</strong> din Vourvourou impresionează cu apele sale turcoaz. Închiriere privată de bărci și croaziere la apus sunt disponibile de-a lungul întregii coaste.</p>',
    sr: '<h2>Izleti Brodom u Halkidikiju</h2><p>Krstarenje do <strong>Atosa</strong> iz Uranopolisa (3 sata, ~20-30 evra) pruža jedinstvene poglede na manastire sa mora. <strong>Ostrva Drenija</strong> blizu Amulianija su savršena za jednodnevni izlet. <strong>Plava laguna</strong> u Vurvuruu impresionira tirkiznim vodama. Iznajmljivanje brodova, krstarenja zalaskom sunca i ribarski čamci su dostupni duž cele obale.</p>',
  },
  wellness: {
    el: '<h2>Wellness & Spa στη Χαλκιδική</h2><p>Η Χαλκιδική φιλοξενεί κορυφαία spa resorts. Το <strong>Miraggio Thermal Spa</strong> στην Κασσάνδρα προσφέρει θερμαλιστικές θεραπείες με θαλασσινό νερό. Το <strong>Sani Resort</strong> διαθέτει πολυτελή spa εμπειρία δίπλα στη θάλασσα. Το <strong>Eagles Palace</strong> στην Ουρανούπολη συνδυάζει spa με θέα στο Άγιον Όρος. Θερμές πηγές, yoga retreats και ολιστικές θεραπείες ολοκληρώνουν την εμπειρία ευεξίας σε ένα μοναδικό φυσικό περιβάλλον.</p>',
    en: '<h2>Wellness & Spa in Halkidiki</h2><p>Halkidiki hosts top spa resorts. <strong>Miraggio Thermal Spa</strong> in Kassandra offers thalassotherapy treatments with sea water. <strong>Sani Resort</strong> features a luxury spa experience by the sea. <strong>Eagles Palace</strong> in Ouranoupoli combines spa with Mount Athos views. Thermal springs, yoga retreats and holistic therapies complete the wellness experience in a unique natural setting.</p>',
    de: '<h2>Wellness & Spa in Chalkidiki</h2><p>Chalkidiki beherbergt erstklassige Spa-Resorts. Das <strong>Miraggio Thermal Spa</strong> in Kassandra bietet Thalassotherapie-Behandlungen mit Meerwasser. Das <strong>Sani Resort</strong> bietet ein luxuriöses Spa-Erlebnis am Meer. Der <strong>Eagles Palace</strong> in Ouranoupoli kombiniert Spa mit Blick auf den Berg Athos. Thermalquellen, Yoga-Retreats und ganzheitliche Therapien vervollständigen das Wellness-Erlebnis in einer einzigartigen Naturumgebung.</p>',
    bg: '<h2>Уелнес & Спа в Халкидики</h2><p>Халкидики е дом на водещи спа курорти. <strong>Miraggio Thermal Spa</strong> в Касандра предлага таласотерапия с морска вода. <strong>Sani Resort</strong> предлага луксозно спа изживяване до морето. <strong>Eagles Palace</strong> в Уранополис съчетава спа с гледка към Атон. Термални извори, йога ретрийти и холистични терапии допълват уелнес изживяването.</p>',
    ru: '<h2>Велнес & Спа в Халкидики</h2><p>Халкидики является домом для лучших спа-курортов. <strong>Miraggio Thermal Spa</strong> в Кассандре предлагает талассотерапию морской водой. <strong>Sani Resort</strong> предлагает роскошный спа-опыт у моря. <strong>Eagles Palace</strong> в Уранополисе сочетает спа с видом на Афон. Термальные источники, йога-ретриты и холистические терапии дополняют велнес-опыт в уникальной природной среде.</p>',
    ro: '<h2>Wellness & Spa în Halkidiki</h2><p>Halkidiki găzduiește resorturi spa de top. <strong>Miraggio Thermal Spa</strong> în Kassandra oferă tratamente de talasoterapie cu apă de mare. <strong>Sani Resort</strong> oferă o experiență spa de lux lângă mare. <strong>Eagles Palace</strong> în Ouranoupoli combină spa cu vederi spre Muntele Athos. Izvoare termale, retrageri yoga și terapii holistice completează experiența de wellness.</p>',
    sr: '<h2>Velnes & Spa u Halkidikiju</h2><p>Halkidiki je dom vodećih spa rizorta. <strong>Miraggio Thermal Spa</strong> u Kasandri nudi talasoterapiju morskom vodom. <strong>Sani Resort</strong> pruža luksuzno spa iskustvo pored mora. <strong>Eagles Palace</strong> u Uranopolisu kombinuje spa sa pogledom na Atos. Termalni izvori, joga retreati i holističke terapije upotpunjuju velnes iskustvo.</p>',
  },
  family: {
    el: '<h2>Οικογενειακές Δραστηριότητες στη Χαλκιδική</h2><p>Η Χαλκιδική είναι ιδανικός προορισμός για οικογένειες. Το <strong>Σπήλαιο Πετραλώνων</strong> εντυπωσιάζει μικρούς και μεγάλους με τους σταλακτίτες του. <strong>Mini golf</strong>, banana boat, glass-bottom boats και <strong>ιππασία</strong> βρίσκονται σε πολλά τουριστικά θέρετρα. Τα water parks και οι ρηχές παραλίες με γαλάζια σημαία καθιστούν τη Χαλκιδική ασφαλή επιλογή για παιδιά. Εκπαιδευτικές δραστηριότητες όπως επισκέψεις σε μελισσοκομεία και ελαιοτριβεία προσφέρουν μοναδικές εμπειρίες.</p>',
    en: '<h2>Family Activities in Halkidiki</h2><p>Halkidiki is an ideal destination for families. <strong>Petralona Cave</strong> impresses young and old with its stalactites. <strong>Mini golf</strong>, banana boat, glass-bottom boats and <strong>horseback riding</strong> are found at many tourist resorts. Water parks and shallow Blue Flag beaches make Halkidiki a safe choice for children. Educational activities like visits to beekeeping farms and olive presses offer unique experiences.</p>',
    de: '<h2>Familienaktivitäten in Chalkidiki</h2><p>Chalkidiki ist ein ideales Reiseziel für Familien. Die <strong>Petralona-Höhle</strong> beeindruckt Jung und Alt mit ihren Stalaktiten. <strong>Minigolf</strong>, Bananenboot, Glasbodenboote und <strong>Reiten</strong> finden sich in vielen Ferienorten. Wasserparks und flache Strände mit Blauer Flagge machen Chalkidiki zu einer sicheren Wahl für Kinder. Lehrreiche Aktivitäten wie Besuche bei Imkereien und Ölmühlen bieten einzigartige Erlebnisse.</p>',
    bg: '<h2>Семейни Дейности в Халкидики</h2><p>Халкидики е идеална дестинация за семейства. <strong>Пещерата Петралона</strong> впечатлява малки и големи със сталактитите си. <strong>Мини голф</strong>, банан, лодки със стъклено дъно и <strong>езда</strong> се предлагат в много курорти. Водни паркове и плитки плажове със Син флаг правят Халкидики безопасен избор за деца.</p>',
    ru: '<h2>Семейные Развлечения в Халкидики</h2><p>Халкидики - идеальное направление для семей. <strong>Пещера Петралона</strong> впечатляет и детей, и взрослых своими сталактитами. <strong>Мини-гольф</strong>, банан, лодки со стеклянным дном и <strong>верховая езда</strong> доступны во многих курортах. Аквапарки и мелкие пляжи с Голубым флагом делают Халкидики безопасным выбором для детей. Образовательные мероприятия, такие как посещение пчелиных ферм и маслобоен, предлагают уникальные впечатления.</p>',
    ro: '<h2>Activități pentru Familie în Halkidiki</h2><p>Halkidiki este o destinație ideală pentru familii. <strong>Peștera Petralona</strong> impresionează tineri și bătrâni cu stalactitele sale. <strong>Mini golf</strong>, banana boat, bărci cu fund de sticlă și <strong>călărie</strong> se găsesc în multe stațiuni turistice. Parcurile acvatice și plajele cu Steag Albastru fac din Halkidiki o alegere sigură pentru copii.</p>',
    sr: '<h2>Porodične Aktivnosti u Halkidikiju</h2><p>Halkidiki je idealna destinacija za porodice. <strong>Pećina Petralona</strong> impresionira male i velike svojim stalaktitima. <strong>Mini golf</strong>, banana čamac, čamci sa staklenim dnom i <strong>jahanje</strong> se nalaze u mnogim turističkim mestima. Vodeni parkovi i plitke plaže sa Plavom zastavom čine Halkidiki bezbednim izborom za decu.</p>',
  },
  nightlife: {
    el: '<h2>Νυχτερινή Ζωή στη Χαλκιδική</h2><p>Η <strong>Κασσάνδρα</strong> είναι το κέντρο της νυχτερινής διασκέδασης στη Χαλκιδική. Το <strong>Cavo Club</strong> στο Πολύχρονο, το <strong>Cabana Beach Bar</strong> και το <strong>Di Luna</strong> προσφέρουν μουσική μέχρι το πρωί. Η <strong>Χανιώτη</strong> είναι γνωστή για τον πεζόδρομο γεμάτο μπαρ και καφετέριες. Η Σιθωνία προσφέρει πιο ήρεμη νυχτερινή ζωή, με beach bars στον Νέο Μαρμαρά και τη Νικήτη. Κατά τους θερινούς μήνες, πολλά beach bars οργανώνουν πάρτι και live events.</p>',
    en: '<h2>Nightlife in Halkidiki</h2><p><strong>Kassandra</strong> is the nightlife hub of Halkidiki. <strong>Cavo Club</strong> in Polychrono, <strong>Cabana Beach Bar</strong> and <strong>Di Luna</strong> offer music until morning. <strong>Hanioti</strong> is known for its walking street packed with bars and cafes. Sithonia offers a more relaxed nightlife scene, with beach bars in Neos Marmaras and Nikiti. During summer months, many beach bars host parties and live events.</p>',
    de: '<h2>Nachtleben in Chalkidiki</h2><p><strong>Kassandra</strong> ist das Nachtleben-Zentrum Chalkidikis. <strong>Cavo Club</strong> in Polychrono, <strong>Cabana Beach Bar</strong> und <strong>Di Luna</strong> bieten Musik bis zum Morgen. <strong>Hanioti</strong> ist bekannt für seine Fußgängerzone voller Bars und Cafés. Sithonia bietet ein entspannteres Nachtleben, mit Strandbars in Neos Marmaras und Nikiti. In den Sommermonaten veranstalten viele Strandbars Partys und Live-Events.</p>',
    bg: '<h2>Нощен Живот в Халкидики</h2><p><strong>Касандра</strong> е центърът на нощния живот в Халкидики. <strong>Cavo Club</strong> в Полихроно, <strong>Cabana Beach Bar</strong> и <strong>Di Luna</strong> предлагат музика до сутринта. <strong>Ханиоти</strong> е известен с пешеходната си улица, пълна с барове и кафенета. Ситония предлага по-спокоен нощен живот с плажни барове в Неос Мармарас и Никити.</p>',
    ru: '<h2>Ночная Жизнь в Халкидики</h2><p><strong>Кассандра</strong> - центр ночной жизни Халкидики. <strong>Cavo Club</strong> в Полихроно, <strong>Cabana Beach Bar</strong> и <strong>Di Luna</strong> предлагают музыку до утра. <strong>Ханиоти</strong> известен своей пешеходной улицей, полной баров и кафе. Ситония предлагает более спокойную ночную жизнь с пляжными барами в Неос Мармарас и Никити. Летом многие пляжные бары проводят вечеринки и живые мероприятия.</p>',
    ro: '<h2>Viață de Noapte în Halkidiki</h2><p><strong>Kassandra</strong> este centrul vieții de noapte din Halkidiki. <strong>Cavo Club</strong> în Polychrono, <strong>Cabana Beach Bar</strong> și <strong>Di Luna</strong> oferă muzică până dimineața. <strong>Hanioti</strong> este cunoscut pentru strada pietonală plină de baruri și cafenele. Sithonia oferă o viață de noapte mai relaxată, cu baruri de plajă în Neos Marmaras și Nikiti.</p>',
    sr: '<h2>Noćni Život u Halkidikiju</h2><p><strong>Kasandra</strong> je centar noćnog života u Halkidikiju. <strong>Cavo Club</strong> u Polihronu, <strong>Cabana Beach Bar</strong> i <strong>Di Luna</strong> nude muziku do jutra. <strong>Hanioti</strong> je poznat po pešačkoj ulici punoj barova i kafića. Sitonija nudi opušteniji noćni život, sa plažnim barovima u Neos Marmarasu i Nikitiju.</p>',
  },
  religious: {
    el: '<h2>Θρησκευτικός Τουρισμός στη Χαλκιδική</h2><p>Το <strong>Άγιον Όρος</strong>, η αυτόνομη μοναστική πολιτεία, είναι ο κορυφαίος θρησκευτικός προορισμός (μόνο για άνδρες, απαιτείται διαμονητήριο). Η Χαλκιδική φιλοξενεί δεκάδες <strong>βυζαντινές εκκλησίες</strong> και παραδοσιακά μοναστήρια. Η <strong>Ιερά Μονή Χιλανδαρίου</strong> (σερβική) στο Άγιον Όρος αποτελεί σημαντικό προσκύνημα. Ορθόδοξες γιορτές, θαυματουργές εικόνες και η μοναδική πνευματικότητα κάνουν τη Χαλκιδική ξεχωριστό θρησκευτικό προορισμό.</p>',
    en: '<h2>Religious Tourism in Halkidiki</h2><p><strong>Mount Athos</strong>, the autonomous monastic state, is the premier religious destination (men only, permit required). Halkidiki hosts dozens of <strong>Byzantine churches</strong> and traditional monasteries. <strong>Hilandar Monastery</strong> (Serbian) on Mount Athos is an important pilgrimage site. Orthodox celebrations, miraculous icons and the unique spirituality make Halkidiki a distinguished religious tourism destination.</p>',
    de: '<h2>Religiöser Tourismus in Chalkidiki</h2><p>Der <strong>Berg Athos</strong>, der autonome Mönchsstaat, ist das wichtigste religiöse Reiseziel (nur für Männer, Genehmigung erforderlich). Chalkidiki beherbergt Dutzende <strong>byzantinischer Kirchen</strong> und traditioneller Klöster. Das <strong>Kloster Hilandar</strong> (serbisch) auf dem Berg Athos ist eine wichtige Pilgerstätte. Orthodoxe Feste, wundertätige Ikonen und die einzigartige Spiritualität machen Chalkidiki zu einem besonderen religiösen Reiseziel.</p>',
    bg: '<h2>Религиозен Туризъм в Халкидики</h2><p><strong>Света гора Атон</strong>, автономната монашеска държава, е водещата религиозна дестинация (само за мъже, нужно е разрешение). Халкидики е дом на десетки <strong>византийски църкви</strong> и традиционни манастири. <strong>Манастирът Хилендар</strong> (сръбски) на Атон е важно поклонническо място. Православни празници, чудотворни икони и уникалната духовност правят Халкидики специална религиозна дестинация.</p>',
    ru: '<h2>Религиозный Туризм в Халкидики</h2><p><strong>Святая Гора Афон</strong>, автономное монашеское государство, является главным религиозным направлением (только для мужчин, требуется разрешение). Халкидики является домом для десятков <strong>византийских церквей</strong> и традиционных монастырей. <strong>Монастырь Хиландар</strong> (сербский) на Афоне является важным местом паломничества. Православные праздники, чудотворные иконы и уникальная духовность делают Халкидики особым религиозным направлением.</p>',
    ro: '<h2>Turism Religios în Halkidiki</h2><p><strong>Muntele Athos</strong>, statul monastic autonom, este destinația religioasă principală (doar bărbați, permis necesar). Halkidiki găzduiește zeci de <strong>biserici bizantine</strong> și mănăstiri tradiționale. <strong>Mănăstirea Hilandar</strong> (sârbă) de pe Muntele Athos este un important loc de pelerinaj. Sărbătorile ortodoxe, icoanele miraculoase și spiritualitatea unică fac din Halkidiki o destinație de turism religios remarcabilă.</p>',
    sr: '<h2>Verski Turizam u Halkidikiju</h2><p><strong>Sveta Gora Atos</strong>, autonomna monaška država, je vrhunska verska destinacija (samo za muškarce, potrebna dozvola). Halkidiki je dom desetina <strong>vizantijskih crkava</strong> i tradicionalnih manastira. <strong>Manastir Hilandar</strong> (srpski) na Atosu je važno hodočasničko mesto. Pravoslavne proslave, čudotvorne ikone i jedinstvena duhovnost čine Halkidiki izuzetnom verskom turističkom destinacijom.</p>',
  },
};

// ── Home & Activities labels for breadcrumbs ───────────────────────────
const HOME_LABEL: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
const ACTIVITIES_LABEL: Record<string, string> = { el: 'Δραστηριότητες', en: 'Activities', de: 'Aktivitäten', bg: 'Дейности', ru: 'Активности', ro: 'Activități', sr: 'Aktivnosti' };
const IN_HALKIDIKI: Record<string, string> = { el: 'στη Χαλκιδική', en: 'in Halkidiki', de: 'in Chalkidiki', bg: 'в Халкидики', ru: 'в Халкидики', ro: 'în Halkidiki', sr: 'u Halkidikiju' };

// ── Page Types ─────────────────────────────────────────────────────────
type Props = { params: Promise<{ locale: string; category: string }> };

function isValidCategory(c: string): c is CategoryKey {
  return VALID_CATEGORIES.includes(c as CategoryKey);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isValidCategory(category)) return {};

  const label = CATEGORY_LABELS[category][locale] || CATEGORY_LABELS[category].en;
  const halkidiki = IN_HALKIDIKI[locale] || IN_HALKIDIKI.en;
  const title = `${label} ${halkidiki} | ChalkidikiHub`;
  const description = CATEGORY_DESCRIPTIONS[category][locale] || CATEGORY_DESCRIPTIONS[category].en;
  const path = `activities/category/${category}`;
  const image = ogImageUrl(label, 'activity');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      siteName: 'Chalkidiki Hub',
      images: [{ url: image, width: 1200, height: 630, alt: label }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: localeUrl(locale, path),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, path)])),
        'x-default': localeUrl('el', path),
      },
    },
  };
}

export default async function ActivityCategoryPage({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!isValidCategory(category)) notFound();

  const content = CATEGORY_CONTENT[category]?.[locale] || CATEGORY_CONTENT[category]?.en || '';
  const label = CATEGORY_LABELS[category][locale] || CATEGORY_LABELS[category].en;

  const breadcrumbLD = generateBreadcrumbLD([
    { name: HOME_LABEL[locale] || 'Home', url: localeUrl(locale) },
    { name: ACTIVITIES_LABEL[locale] || 'Activities', url: localeUrl(locale, 'activities') },
    { name: label, url: localeUrl(locale, `activities/category/${category}`) },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbLD as Record<string, unknown>} />
      {content && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
      <PageClient />
    </>
  );
}
