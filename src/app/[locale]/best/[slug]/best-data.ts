type L = Record<string, string>;

export interface BestGuide {
  slug: string;
  contentType: 'beaches' | 'restaurants' | 'activities' | 'mixed';
  apiUrl: string; // API endpoint to fetch data
  filterFn?: string; // client-side filter key
  filterValue?: string;
  title: L;
  description: L;
  metaTitle: L;
  metaDesc: L;
  icon: string; // lucide icon name
  color: string; // tailwind color
}

export const BEST_GUIDES: BestGuide[] = [
  // === BEACHES by AREA ===
  {
    slug: 'beaches-kassandra', contentType: 'beaches', apiUrl: '/api/beaches?area=kassandra&limit=20',
    icon: 'Waves', color: 'cyan',
    title: { el: 'Καλύτερες Παραλίες Κασσάνδρας', en: 'Best Beaches in Kassandra', de: 'Beste Strände in Kassandra', bg: 'Най-добрите плажове в Касандра', ru: 'Лучшие пляжи Кассандры', ro: 'Cele mai bune plaje din Kassandra' },
    description: { el: 'Οι top-rated παραλίες στο πρώτο πόδι της Χαλκιδικής', en: 'Top-rated beaches on the first peninsula of Halkidiki', de: 'Die bestbewerteten Strände auf der ersten Halbinsel', bg: 'Най-добре оценените плажове на първия полуостров', ru: 'Лучшие пляжи на первом полуострове', ro: 'Cele mai bine cotate plaje de pe prima peninsulă' },
    metaTitle: { el: 'Καλύτερες Παραλίες Κασσάνδρας | Χαλκιδική', en: 'Best Beaches Kassandra | Halkidiki', de: 'Beste Strände Kassandra | Chalkidiki', bg: 'Най-добри плажове Касандра | Халкидики', ru: 'Лучшие пляжи Кассандры | Халкидики', ro: 'Cele mai bune plaje Kassandra | Halkidiki' },
    metaDesc: { el: 'Ανακαλύψτε τις καλύτερες παραλίες στην Κασσάνδρα — αξιολογήσεις, φωτογραφίες, χάρτης, τι να περιμένετε.', en: 'Discover the best beaches in Kassandra — ratings, photos, map, what to expect.', de: 'Entdecken Sie die besten Strände in Kassandra — Bewertungen, Fotos, Karte.', bg: 'Открийте най-добрите плажове в Касандра — оценки, снимки, карта.', ru: 'Откройте лучшие пляжи Кассандры — рейтинги, фото, карта.', ro: 'Descoperiți cele mai bune plaje din Kassandra — evaluări, fotografii, hartă.' },
  },
  {
    slug: 'beaches-sithonia', contentType: 'beaches', apiUrl: '/api/beaches?area=sithonia&limit=20',
    icon: 'Waves', color: 'cyan',
    title: { el: 'Καλύτερες Παραλίες Σιθωνίας', en: 'Best Beaches in Sithonia', de: 'Beste Strände in Sithonia', bg: 'Най-добрите плажове в Ситония', ru: 'Лучшие пляжи Ситонии', ro: 'Cele mai bune plaje din Sithonia' },
    description: { el: 'Οι πιο εξωτικές παραλίες στο δεύτερο πόδι', en: 'The most exotic beaches on the second peninsula', de: 'Die exotischsten Strände auf der zweiten Halbinsel', bg: 'Най-екзотичните плажове на втория полуостров', ru: 'Самые экзотические пляжи второго полуострова', ro: 'Cele mai exotice plaje de pe a doua peninsulă' },
    metaTitle: { el: 'Καλύτερες Παραλίες Σιθωνίας | Χαλκιδική', en: 'Best Beaches Sithonia | Halkidiki', de: 'Beste Strände Sithonia | Chalkidiki', bg: 'Най-добри плажове Ситония | Халкидики', ru: 'Лучшие пляжи Ситонии | Халкидики', ro: 'Cele mai bune plaje Sithonia | Halkidiki' },
    metaDesc: { el: 'Οι καλύτερες παραλίες Σιθωνίας — εξωτικά νερά, φύση, ηρεμία.', en: 'Best beaches in Sithonia — exotic waters, nature, tranquility.', de: 'Beste Strände Sithonia — exotisches Wasser, Natur, Ruhe.', bg: 'Най-добри плажове Ситония — екзотични води, природа, тишина.', ru: 'Лучшие пляжи Ситонии — экзотические воды, природа, тишина.', ro: 'Cele mai bune plaje Sithonia — ape exotice, natură, liniște.' },
  },
  // === THEMATIC BEACHES ===
  {
    slug: 'family-beaches', contentType: 'beaches', apiUrl: '/api/beaches?feature=shallowWater&limit=20',
    icon: 'Waves', color: 'cyan',
    title: { el: 'Οικογενειακές Παραλίες Χαλκιδικής', en: 'Family Beaches in Halkidiki', de: 'Familienstrände in Chalkidiki', bg: 'Семейни плажове в Халкидики', ru: 'Семейные пляжи Халкидики', ro: 'Plaje pentru familii în Halkidiki' },
    description: { el: 'Ασφαλείς παραλίες με ρηχά νερά, ιδανικές για παιδιά', en: 'Safe beaches with shallow waters, perfect for kids', de: 'Sichere Strände mit flachem Wasser, perfekt für Kinder', bg: 'Безопасни плажове с плитки води, идеални за деца', ru: 'Безопасные пляжи с мелководьем, идеальны для детей', ro: 'Plaje sigure cu apă puțin adâncă, perfecte pentru copii' },
    metaTitle: { el: 'Οικογενειακές Παραλίες Χαλκιδικής | Ρηχά Νερά', en: 'Family Beaches Halkidiki | Shallow Water', de: 'Familienstrände Chalkidiki | Flaches Wasser', bg: 'Семейни плажове Халкидики | Плитка вода', ru: 'Семейные пляжи Халкидики | Мелководье', ro: 'Plaje familii Halkidiki | Apă puțin adâncă' },
    metaDesc: { el: 'Παραλίες με ρηχά νερά για ασφαλείς διακοπές με παιδιά στη Χαλκιδική.', en: 'Shallow water beaches for safe holidays with children in Halkidiki.', de: 'Strände mit flachem Wasser für sichere Ferien mit Kindern.', bg: 'Плажове с плитки води за безопасни ваканции с деца.', ru: 'Пляжи с мелководьем для безопасного отдыха с детьми.', ro: 'Plaje cu apă puțin adâncă pentru vacanțe sigure cu copiii.' },
  },
  {
    slug: 'quiet-beaches', contentType: 'beaches', apiUrl: '/api/beaches?feature=free&limit=20',
    icon: 'Waves', color: 'cyan',
    title: { el: 'Ήσυχες Παραλίες Χαλκιδικής', en: 'Quiet Beaches in Halkidiki', de: 'Ruhige Strände in Chalkidiki', bg: 'Тихи плажове в Халкидики', ru: 'Тихие пляжи Халкидики', ro: 'Plaje liniștite în Halkidiki' },
    description: { el: 'Ελεύθερες, ήρεμες παραλίες μακριά από τα πλήθη', en: 'Free, peaceful beaches away from the crowds', de: 'Freie, ruhige Strände abseits der Massen', bg: 'Свободни, тихи плажове далеч от тълпите', ru: 'Свободные тихие пляжи вдали от толп', ro: 'Plaje libere și liniștite departe de mulțimi' },
    metaTitle: { el: 'Ήσυχες Παραλίες Χαλκιδικής | Μακριά από Πλήθη', en: 'Quiet Beaches Halkidiki | Away from Crowds', de: 'Ruhige Strände Chalkidiki', bg: 'Тихи плажове Халкидики', ru: 'Тихие пляжи Халкидики', ro: 'Plaje liniștite Halkidiki' },
    metaDesc: { el: 'Ήρεμες, ελεύθερες παραλίες στη Χαλκιδική για χαλάρωση μακριά από τον κόσμο.', en: 'Peaceful free beaches in Halkidiki for relaxation away from crowds.', de: 'Ruhige freie Strände in Chalkidiki zum Entspannen.', bg: 'Тихи свободни плажове в Халкидики за отдих.', ru: 'Тихие свободные пляжи Халкидики для отдыха.', ro: 'Plaje liniștite gratuite în Halkidiki pentru relaxare.' },
  },
  // === FOOD ===
  {
    slug: 'seafood-restaurants', contentType: 'restaurants', apiUrl: '/api/restaurants?limit=30',
    filterFn: 'cuisine', filterValue: 'seafood',
    icon: 'UtensilsCrossed', color: 'red',
    title: { el: 'Ψαροταβέρνες Χαλκιδικής', en: 'Seafood Restaurants in Halkidiki', de: 'Fischrestaurants in Chalkidiki', bg: 'Рибни ресторанти в Халкидики', ru: 'Рыбные рестораны Халкидики', ro: 'Restaurante cu fructe de mare în Halkidiki' },
    description: { el: 'Οι καλύτερες ψαροταβέρνες με φρέσκα θαλασσινά', en: 'Best fish taverns with fresh seafood', de: 'Beste Fischtavernen mit frischen Meeresfrüchten', bg: 'Най-добрите рибни таверни с пресни морски дарове', ru: 'Лучшие рыбные таверны со свежими морепродуктами', ro: 'Cele mai bune taverne cu fructe de mare proaspete' },
    metaTitle: { el: 'Ψαροταβέρνες Χαλκιδικής | Θαλασσινά', en: 'Seafood Restaurants Halkidiki', de: 'Fischrestaurants Chalkidiki', bg: 'Рибни ресторанти Халкидики', ru: 'Рыбные рестораны Халкидики', ro: 'Restaurante fructe de mare Halkidiki' },
    metaDesc: { el: 'Οι καλύτερες ψαροταβέρνες στη Χαλκιδική — φρέσκα ψάρια, θαλασσινά, θέα θάλασσα.', en: 'Best seafood restaurants in Halkidiki — fresh fish, sea views.', de: 'Beste Fischrestaurants in Chalkidiki — frischer Fisch, Meerblick.', bg: 'Най-добрите рибни ресторанти — прясна риба, морска гледка.', ru: 'Лучшие рыбные рестораны — свежая рыба, вид на море.', ro: 'Cele mai bune restaurante — pește proaspăt, vedere la mare.' },
  },
  {
    slug: 'beach-bars', contentType: 'restaurants', apiUrl: '/api/restaurants?limit=30',
    filterFn: 'cuisine', filterValue: 'beach-bar',
    icon: 'UtensilsCrossed', color: 'red',
    title: { el: 'Beach Bars Χαλκιδικής', en: 'Beach Bars in Halkidiki', de: 'Beach Bars in Chalkidiki', bg: 'Плажни барове в Халкидики', ru: 'Пляжные бары Халкидики', ro: 'Baruri de plajă în Halkidiki' },
    description: { el: 'Τα καλύτερα beach bars για κοκτέιλ δίπλα στη θάλασσα', en: 'Best beach bars for cocktails by the sea', de: 'Beste Beach Bars für Cocktails am Meer', bg: 'Най-добрите плажни барове за коктейли край морето', ru: 'Лучшие пляжные бары для коктейлей у моря', ro: 'Cele mai bune baruri de plajă pentru cocktailuri lângă mare' },
    metaTitle: { el: 'Beach Bars Χαλκιδικής | Κοκτέιλ & Θάλασσα', en: 'Beach Bars Halkidiki | Cocktails & Sea', de: 'Beach Bars Chalkidiki', bg: 'Плажни барове Халкидики', ru: 'Пляжные бары Халкидики', ro: 'Baruri plajă Halkidiki' },
    metaDesc: { el: 'Τα top beach bars στη Χαλκιδική — μουσική, κοκτέιλ, ηλιοβασίλεμα, ατμόσφαιρα.', en: 'Top beach bars in Halkidiki — music, cocktails, sunset, atmosphere.', de: 'Top Beach Bars in Chalkidiki — Musik, Cocktails, Sonnenuntergang.', bg: 'Топ плажни барове — музика, коктейли, залез, атмосфера.', ru: 'Топ пляжные бары — музыка, коктейли, закат, атмосфера.', ro: 'Top baruri de plajă — muzică, cocktailuri, apus, atmosferă.' },
  },
  {
    slug: 'romantic-restaurants', contentType: 'restaurants', apiUrl: '/api/restaurants?limit=30',
    filterFn: 'has_sea_view', filterValue: 'true',
    icon: 'UtensilsCrossed', color: 'red',
    title: { el: 'Ρομαντικά Εστιατόρια Χαλκιδικής', en: 'Romantic Restaurants in Halkidiki', de: 'Romantische Restaurants in Chalkidiki', bg: 'Романтични ресторанти в Халкидики', ru: 'Романтические рестораны Халкидики', ro: 'Restaurante romantice în Halkidiki' },
    description: { el: 'Εστιατόρια με θέα θάλασσα για ρομαντικό δείπνο', en: 'Sea view restaurants for romantic dinner', de: 'Restaurants mit Meerblick für ein romantisches Abendessen', bg: 'Ресторанти с морска гледка за романтична вечеря', ru: 'Рестораны с видом на море для романтического ужина', ro: 'Restaurante cu vedere la mare pentru cină romantică' },
    metaTitle: { el: 'Ρομαντικά Εστιατόρια Χαλκιδικής | Θέα Θάλασσα', en: 'Romantic Restaurants Halkidiki | Sea View', de: 'Romantische Restaurants Chalkidiki', bg: 'Романтични ресторанти Халкидики', ru: 'Романтические рестораны Халкидики', ro: 'Restaurante romantice Halkidiki' },
    metaDesc: { el: 'Ρομαντικά εστιατόρια με θέα θάλασσα στη Χαλκιδική — ιδανικά για ζευγάρια.', en: 'Romantic sea view restaurants in Halkidiki — perfect for couples.', de: 'Romantische Restaurants mit Meerblick — perfekt für Paare.', bg: 'Романтични ресторанти с морска гледка — идеални за двойки.', ru: 'Романтические рестораны с видом на море — идеальны для пар.', ro: 'Restaurante romantice cu vedere la mare — perfecte pentru cupluri.' },
  },
  // === ACTIVITIES ===
  {
    slug: 'hiking-trails', contentType: 'activities', apiUrl: '/api/activities?limit=30',
    filterFn: 'category', filterValue: 'nature',
    icon: 'Landmark', color: 'amber',
    title: { el: 'Πεζοπορικές Διαδρομές Χαλκιδικής', en: 'Hiking Trails in Halkidiki', de: 'Wanderwege in Chalkidiki', bg: 'Пешеходни маршрути в Халкидики', ru: 'Пешие маршруты Халкидики', ro: 'Trasee de drumeție în Halkidiki' },
    description: { el: 'Μονοπάτια στη φύση — βουνά, δάση, ακρωτήρια', en: 'Nature trails — mountains, forests, capes', de: 'Naturpfade — Berge, Wälder, Kaps', bg: 'Природни пътеки — планини, гори, носове', ru: 'Природные тропы — горы, леса, мысы', ro: 'Trasee în natură — munți, păduri, capuri' },
    metaTitle: { el: 'Πεζοπορία Χαλκιδική | Μονοπάτια & Φύση', en: 'Hiking Halkidiki | Trails & Nature', de: 'Wandern Chalkidiki | Wege & Natur', bg: 'Пешеходен туризъм Халкидики', ru: 'Пешие прогулки Халкидики', ro: 'Drumeții Halkidiki | Trasee & Natură' },
    metaDesc: { el: 'Πεζοπορικές διαδρομές στη Χαλκιδική — μονοπάτια στη φύση, βουνό Άθως, δάση.', en: 'Hiking trails in Halkidiki — nature paths, Mount Athos, forests.', de: 'Wanderwege in Chalkidiki — Naturpfade, Berg Athos, Wälder.', bg: 'Пешеходни маршрути — природни пътеки, планини, гори.', ru: 'Пешие маршруты — природные тропы, гора Афон, леса.', ro: 'Trasee drumeție — poteci în natură, Muntele Athos, păduri.' },
  },
  {
    slug: 'historical-sites', contentType: 'activities', apiUrl: '/api/activities?limit=30',
    filterFn: 'category', filterValue: 'historical',
    icon: 'Landmark', color: 'amber',
    title: { el: 'Ιστορικά Αξιοθέατα Χαλκιδικής', en: 'Historical Sites in Halkidiki', de: 'Historische Stätten in Chalkidiki', bg: 'Исторически забележителности в Халкидики', ru: 'Исторические достопримечательности Халкидики', ro: 'Obiective istorice în Halkidiki' },
    description: { el: 'Αρχαιολογικοί χώροι, μουσεία, βυζαντινά μνημεία', en: 'Archaeological sites, museums, Byzantine monuments', de: 'Archäologische Stätten, Museen, byzantinische Denkmäler', bg: 'Археологически обекти, музеи, византийски паметници', ru: 'Археологические объекты, музеи, византийские памятники', ro: 'Situri arheologice, muzee, monumente bizantine' },
    metaTitle: { el: 'Ιστορικά Αξιοθέατα Χαλκιδικής', en: 'Historical Sites Halkidiki', de: 'Historische Stätten Chalkidiki', bg: 'Исторически забележителности Халкидики', ru: 'Исторические места Халкидики', ro: 'Obiective istorice Halkidiki' },
    metaDesc: { el: 'Αρχαία Στάγειρα, Όλυνθος, Πετράλωνα — ιστορικά αξιοθέατα Χαλκιδικής.', en: 'Ancient Stagira, Olynthos, Petralona — historical sites in Halkidiki.', de: 'Antike Stagira, Olynthos, Petralona — historische Stätten.', bg: 'Античен Стагира, Олинт, Петралона — исторически места.', ru: 'Древняя Стагира, Олинф, Петралона — исторические места.', ro: 'Stagira antică, Olynthos, Petralona — situri istorice.' },
  },
  {
    slug: 'water-sports', contentType: 'activities', apiUrl: '/api/activities?limit=30',
    filterFn: 'category', filterValue: 'waterSports',
    icon: 'Landmark', color: 'amber',
    title: { el: 'Θαλάσσια Σπορ Χαλκιδικής', en: 'Water Sports in Halkidiki', de: 'Wassersport in Chalkidiki', bg: 'Водни спортове в Халкидики', ru: 'Водные виды спорта в Халкидики', ro: 'Sporturi nautice în Halkidiki' },
    description: { el: 'Windsurf, kayak, SUP, jet ski, σκάφη', en: 'Windsurf, kayak, SUP, jet ski, boats', de: 'Windsurfen, Kajak, SUP, Jet-Ski, Boote', bg: 'Уиндсърф, каяк, SUP, джет ски, лодки', ru: 'Виндсёрфинг, каяк, SUP, гидроцикл, лодки', ro: 'Windsurf, caiac, SUP, jet ski, bărci' },
    metaTitle: { el: 'Θαλάσσια Σπορ Χαλκιδικής | Water Sports', en: 'Water Sports Halkidiki', de: 'Wassersport Chalkidiki', bg: 'Водни спортове Халкидики', ru: 'Водные виды спорта Халкидики', ro: 'Sporturi nautice Halkidiki' },
    metaDesc: { el: 'Θαλάσσια σπορ στη Χαλκιδική — windsurf, kayak, SUP, jet ski, scuba diving.', en: 'Water sports in Halkidiki — windsurf, kayak, SUP, jet ski, diving.', de: 'Wassersport in Chalkidiki — Windsurfen, Kajak, SUP, Tauchen.', bg: 'Водни спортове — уиндсърф, каяк, SUP, гмуркане.', ru: 'Водные виды спорта — виндсёрфинг, каяк, SUP, дайвинг.', ro: 'Sporturi nautice — windsurf, caiac, SUP, scufundări.' },
  },
  // === MIXED/AREA ===
  {
    slug: 'restaurants-kassandra', contentType: 'restaurants', apiUrl: '/api/restaurants?area=kassandra&limit=20',
    icon: 'UtensilsCrossed', color: 'red',
    title: { el: 'Καλύτερα Εστιατόρια Κασσάνδρας', en: 'Best Restaurants in Kassandra', de: 'Beste Restaurants in Kassandra', bg: 'Най-добрите ресторанти в Касандра', ru: 'Лучшие рестораны Кассандры', ro: 'Cele mai bune restaurante din Kassandra' },
    description: { el: 'Τα top εστιατόρια στο πρώτο πόδι', en: 'Top restaurants on the first peninsula', de: 'Top-Restaurants auf der ersten Halbinsel', bg: 'Топ ресторанти на първия полуостров', ru: 'Топ рестораны на первом полуострове', ro: 'Top restaurante pe prima peninsulă' },
    metaTitle: { el: 'Εστιατόρια Κασσάνδρας | Χαλκιδική', en: 'Restaurants Kassandra | Halkidiki', de: 'Restaurants Kassandra | Chalkidiki', bg: 'Ресторанти Касандра | Халкидики', ru: 'Рестораны Кассандры | Халкидики', ro: 'Restaurante Kassandra | Halkidiki' },
    metaDesc: { el: 'Τα καλύτερα εστιατόρια και ταβέρνες στην Κασσάνδρα, Χαλκιδική.', en: 'Best restaurants and taverns in Kassandra, Halkidiki.', de: 'Beste Restaurants und Tavernen in Kassandra.', bg: 'Най-добрите ресторанти и таверни в Касандра.', ru: 'Лучшие рестораны и таверны в Кассандре.', ro: 'Cele mai bune restaurante și taverne din Kassandra.' },
  },
  {
    slug: 'restaurants-sithonia', contentType: 'restaurants', apiUrl: '/api/restaurants?area=sithonia&limit=20',
    icon: 'UtensilsCrossed', color: 'red',
    title: { el: 'Καλύτερα Εστιατόρια Σιθωνίας', en: 'Best Restaurants in Sithonia', de: 'Beste Restaurants in Sithonia', bg: 'Най-добрите ресторанти в Ситония', ru: 'Лучшие рестораны Ситонии', ro: 'Cele mai bune restaurante din Sithonia' },
    description: { el: 'Τα top εστιατόρια στο δεύτερο πόδι', en: 'Top restaurants on the second peninsula', de: 'Top-Restaurants auf der zweiten Halbinsel', bg: 'Топ ресторанти на втория полуостров', ru: 'Топ рестораны на втором полуострове', ro: 'Top restaurante pe a doua peninsulă' },
    metaTitle: { el: 'Εστιατόρια Σιθωνίας | Χαλκιδική', en: 'Restaurants Sithonia | Halkidiki', de: 'Restaurants Sithonia | Chalkidiki', bg: 'Ресторанти Ситония | Халкидики', ru: 'Рестораны Ситонии | Халкидики', ro: 'Restaurante Sithonia | Halkidiki' },
    metaDesc: { el: 'Τα καλύτερα εστιατόρια στη Σιθωνία — ψάρι, θέα, ατμόσφαιρα.', en: 'Best restaurants in Sithonia — fish, views, atmosphere.', de: 'Beste Restaurants in Sithonia — Fisch, Aussicht, Atmosphäre.', bg: 'Най-добри ресторанти Ситония — риба, гледка, атмосфера.', ru: 'Лучшие рестораны Ситонии — рыба, виды, атмосфера.', ro: 'Cele mai bune restaurante Sithonia — pește, priveliște, atmosferă.' },
  },
];

export function getBestGuide(slug: string): BestGuide | undefined {
  return BEST_GUIDES.find(g => g.slug === slug);
}
