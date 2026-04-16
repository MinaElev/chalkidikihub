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
  // === FREE BEACHES ===
  {
    slug: 'free-beaches', contentType: 'beaches', apiUrl: '/api/beaches?feature=free&limit=20',
    icon: 'Waves', color: 'cyan',
    title: { el: 'Ελεύθερες Παραλίες Χαλκιδικής', en: 'Free Beaches in Halkidiki', de: 'Freie Strände in Chalkidiki', bg: 'Безплатни плажове в Халкидики', ru: 'Бесплатные пляжи Халкидики', ro: 'Plaje gratuite în Halkidiki', sr: 'Besplatne plaže u Halkidikiju' },
    description: { el: 'Αδιοργάνωτες παραλίες χωρίς ξαπλώστρες — φυσική ομορφιά και ελευθερία', en: 'Unorganized beaches with no sunbed fees — natural beauty and freedom', de: 'Unorganisierte Strände ohne Liegengebühren — natürliche Schönheit und Freiheit', bg: 'Неорганизирани плажове без такси за шезлонги — природна красота и свобода', ru: 'Дикие пляжи без платы за шезлонги — природная красота и свобода', ro: 'Plaje neamenajate fără taxe pentru șezlonguri — frumusețe naturală și libertate', sr: 'Neuređene plaže bez naknade za ležaljke — prirodna lepota i sloboda' },
    metaTitle: { el: 'Ελεύθερες Παραλίες Χαλκιδικής | Χωρίς Ξαπλώστρες', en: 'Free Beaches Halkidiki | No Sunbed Fees', de: 'Freie Strände Chalkidiki | Ohne Liegen', bg: 'Безплатни плажове Халкидики', ru: 'Бесплатные пляжи Халкидики', ro: 'Plaje gratuite Halkidiki', sr: 'Besplatne plaže Halkidiki' },
    metaDesc: { el: 'Ανακαλύψτε τις καλύτερες ελεύθερες παραλίες στη Χαλκιδική — χωρίς ξαπλώστρες, φυσικό περιβάλλον, ηρεμία.', en: 'Discover the best free beaches in Halkidiki — no sunbed fees, natural settings, tranquility.', de: 'Entdecken Sie die besten freien Strände in Chalkidiki — ohne Liegen, Natur pur, Ruhe.', bg: 'Открийте най-добрите безплатни плажове в Халкидики — без шезлонги, природа, тишина.', ru: 'Откройте лучшие бесплатные пляжи Халкидики — без шезлонгов, природа, тишина.', ro: 'Descoperiți cele mai bune plaje gratuite din Halkidiki — fără șezlonguri, natură, liniște.', sr: 'Otkrijte najbolje besplatne plaže u Halkidikiju — bez ležaljki, priroda, tišina.' },
  },
  // === LUXURY HOTELS ===
  {
    slug: 'luxury-hotels', contentType: 'mixed', apiUrl: '/api/listings?sort=rating&limit=20',
    icon: 'Landmark', color: 'amber',
    title: { el: 'Πολυτελή Ξενοδοχεία Χαλκιδικής', en: 'Luxury Hotels & Resorts in Halkidiki', de: 'Luxushotels & Resorts in Chalkidiki', bg: 'Луксозни хотели и курорти в Халкидики', ru: 'Роскошные отели и курорты Халкидики', ro: 'Hoteluri de lux și resorturi în Halkidiki', sr: 'Luksuzni hoteli i letovališta u Halkidikiju' },
    description: { el: 'Τα καλύτερα 5-αστέρων ξενοδοχεία — Sani, Ikos, Eagles Palace και άλλα', en: 'Top 5-star properties — Sani, Ikos, Eagles Palace and more', de: 'Top 5-Sterne-Hotels — Sani, Ikos, Eagles Palace und mehr', bg: 'Топ 5-звездни хотели — Sani, Ikos, Eagles Palace и други', ru: 'Лучшие 5-звёздочные отели — Sani, Ikos, Eagles Palace и другие', ro: 'Cele mai bune proprietăți de 5 stele — Sani, Ikos, Eagles Palace și altele', sr: 'Najbolji hoteli sa 5 zvezdica — Sani, Ikos, Eagles Palace i drugi' },
    metaTitle: { el: 'Πολυτελή Ξενοδοχεία Χαλκιδικής | 5 Αστέρων', en: 'Luxury Hotels & Resorts | Halkidiki', de: 'Luxushotels & Resorts | Chalkidiki', bg: 'Луксозни хотели Халкидики | 5 звезди', ru: 'Роскошные отели Халкидики | 5 звёзд', ro: 'Hoteluri de lux Halkidiki | 5 stele', sr: 'Luksuzni hoteli Halkidiki | 5 zvezdica' },
    metaDesc: { el: 'Ανακαλύψτε τα πολυτελέστερα ξενοδοχεία και resorts στη Χαλκιδική — Sani, Ikos, Eagles Palace.', en: 'Discover the most luxurious hotels and resorts in Halkidiki — Sani, Ikos, Eagles Palace.', de: 'Entdecken Sie die luxuriösesten Hotels und Resorts in Chalkidiki — Sani, Ikos, Eagles Palace.', bg: 'Открийте най-луксозните хотели и курорти в Халкидики — Sani, Ikos, Eagles Palace.', ru: 'Откройте самые роскошные отели и курорты Халкидики — Sani, Ikos, Eagles Palace.', ro: 'Descoperiți cele mai luxoase hoteluri și resorturi din Halkidiki — Sani, Ikos, Eagles Palace.', sr: 'Otkrijte najluksuznije hotele i letovališta u Halkidikiju — Sani, Ikos, Eagles Palace.' },
  },
  // === CAMPING SPOTS ===
  {
    slug: 'camping-spots', contentType: 'mixed', apiUrl: '/api/beaches?feature=free&limit=20',
    icon: 'Landmark', color: 'amber',
    title: { el: 'Κάμπινγκ στη Χαλκιδική', en: 'Best Camping Spots in Halkidiki', de: 'Beste Campingplätze in Chalkidiki', bg: 'Най-добрите места за къмпинг в Халкидики', ru: 'Лучшие места для кемпинга в Халкидики', ro: 'Cele mai bune locuri de camping în Halkidiki', sr: 'Najbolja mesta za kampovanje u Halkidikiju' },
    description: { el: 'Οργανωμένα κάμπινγκ και σημεία ελεύθερης κατασκήνωσης στη Χαλκιδική', en: 'Campgrounds and wild camping locations across Halkidiki', de: 'Campingplätze und Wildcamping-Standorte in Chalkidiki', bg: 'Къмпинги и места за свободно къмпингуване в Халкидики', ru: 'Кемпинги и места для дикого отдыха в Халкидики', ro: 'Campinguri și locuri de camping sălbatic în Halkidiki', sr: 'Kampovi i mesta za divlje kampovanje u Halkidikiju' },
    metaTitle: { el: 'Κάμπινγκ Χαλκιδική | Κατασκήνωση & Φύση', en: 'Camping Spots | Halkidiki', de: 'Campingplätze | Chalkidiki', bg: 'Къмпинг Халкидики | Природа', ru: 'Кемпинг Халкидики | Природа', ro: 'Camping Halkidiki | Natură', sr: 'Kampovanje Halkidiki | Priroda' },
    metaDesc: { el: 'Βρείτε τα καλύτερα κάμπινγκ στη Χαλκιδική — οργανωμένα και ελεύθερα, κοντά σε παραλίες.', en: 'Find the best camping spots in Halkidiki — campgrounds and wild camping near beaches.', de: 'Finden Sie die besten Campingplätze in Chalkidiki — organisiert und wild, nahe am Strand.', bg: 'Намерете най-добрите места за къмпинг в Халкидики — организирани и свободни, близо до плажове.', ru: 'Найдите лучшие места для кемпинга в Халкидики — организованные и дикие, рядом с пляжами.', ro: 'Găsiți cele mai bune locuri de camping din Halkidiki — organizate și sălbatice, lângă plaje.', sr: 'Pronađite najbolja mesta za kampovanje u Halkidikiju — organizovana i divlja, blizu plaža.' },
  },
  // === INSTAGRAM SPOTS ===
  {
    slug: 'instagram-spots', contentType: 'beaches', apiUrl: '/api/beaches?limit=30',
    icon: 'Landmark', color: 'amber',
    title: { el: 'Instagrammable Σημεία Χαλκιδικής', en: 'Most Instagrammable Places in Halkidiki', de: 'Die fotogensten Orte in Chalkidiki', bg: 'Най-инстаграмски места в Халкидики', ru: 'Самые инстаграмные места Халкидики', ro: 'Cele mai instagramabile locuri din Halkidiki', sr: 'Najfotogeničnija mesta u Halkidikiju' },
    description: { el: 'Φωτογενικές τοποθεσίες, πανοραμικά σημεία και μαγευτικά τοπία', en: 'Photogenic locations, scenic viewpoints and breathtaking landscapes', de: 'Fotogene Orte, Aussichtspunkte und atemberaubende Landschaften', bg: 'Фотогенични локации, панорамни гледки и спиращи дъха пейзажи', ru: 'Фотогеничные локации, смотровые площадки и захватывающие пейзажи', ro: 'Locații fotogenice, puncte panoramice și peisaje uluitoare', sr: 'Fotogenične lokacije, panoramske tačke i zapanjujući pejzaži' },
    metaTitle: { el: 'Instagrammable Χαλκιδική | Φωτογενικά Σημεία', en: 'Most Instagrammable Places | Halkidiki', de: 'Fotogenste Orte | Chalkidiki', bg: 'Инстаграмски места | Халкидики', ru: 'Инстаграмные места | Халкидики', ro: 'Locuri instagramabile | Halkidiki', sr: 'Fotogenična mesta | Halkidiki' },
    metaDesc: { el: 'Τα πιο φωτογενικά σημεία στη Χαλκιδική — ιδανικά για Instagram, πανοραμικές θέες, εκπληκτικά τοπία.', en: 'The most photogenic spots in Halkidiki — perfect for Instagram, panoramic views, stunning scenery.', de: 'Die fotogensten Orte in Chalkidiki — perfekt für Instagram, Panoramablick, atemberaubende Landschaft.', bg: 'Най-фотогеничните места в Халкидики — перфектни за Instagram, панорамни гледки, зашеметяващи пейзажи.', ru: 'Самые фотогеничные места Халкидики — идеально для Instagram, панорамные виды, потрясающие пейзажи.', ro: 'Cele mai fotogenice locuri din Halkidiki — perfecte pentru Instagram, vederi panoramice, peisaje uimitoare.', sr: 'Najfotogeničnija mesta u Halkidikiju — savršena za Instagram, panoramski pogledi, zapanjujući pejzaži.' },
  },
  // === KIDS ACTIVITIES ===
  {
    slug: 'kids-activities', contentType: 'activities', apiUrl: '/api/activities?category=family&limit=20',
    filterFn: 'category', filterValue: 'family',
    icon: 'Landmark', color: 'amber',
    title: { el: 'Δραστηριότητες για Παιδιά στη Χαλκιδική', en: 'Kids Activities in Halkidiki', de: 'Kinderaktivitäten in Chalkidiki', bg: 'Детски дейности в Халкидики', ru: 'Развлечения для детей в Халкидики', ro: 'Activități pentru copii în Halkidiki', sr: 'Aktivnosti za decu u Halkidikiju' },
    description: { el: 'Οικογενειακή διασκέδαση — Σπήλαιο Πετραλώνων, νεροτσουλήθρες, βαρκάδες', en: 'Family fun — Petralona Cave, water parks, boat rides', de: 'Familienspaß — Petralona-Höhle, Wasserparks, Bootsfahrten', bg: 'Семейно забавление — пещера Петралона, аквапаркове, разходки с лодка', ru: 'Семейные развлечения — пещера Петралона, аквапарки, прогулки на лодке', ro: 'Distracție în familie — Peștera Petralona, parcuri acvatice, plimbări cu barca', sr: 'Porodična zabava — Pećina Petralona, akva parkovi, vožnja čamcem' },
    metaTitle: { el: 'Δραστηριότητες για Παιδιά | Χαλκιδική', en: 'Kids Activities | Halkidiki', de: 'Kinderaktivitäten | Chalkidiki', bg: 'Детски дейности | Халкидики', ru: 'Развлечения для детей | Халкидики', ro: 'Activități copii | Halkidiki', sr: 'Aktivnosti za decu | Halkidiki' },
    metaDesc: { el: 'Οι καλύτερες δραστηριότητες για παιδιά στη Χαλκιδική — σπήλαια, aqua parks, βαρκάδες, φύση.', en: 'Best kids activities in Halkidiki — caves, water parks, boat rides, nature adventures.', de: 'Beste Kinderaktivitäten in Chalkidiki — Höhlen, Wasserparks, Bootsfahrten, Natur.', bg: 'Най-добрите детски дейности в Халкидики — пещери, аквапаркове, лодки, природа.', ru: 'Лучшие развлечения для детей в Халкидики — пещеры, аквапарки, лодки, природа.', ro: 'Cele mai bune activități pentru copii din Halkidiki — peșteri, parcuri acvatice, bărci, natură.', sr: 'Najbolje aktivnosti za decu u Halkidikiju — pećine, akva parkovi, čamci, priroda.' },
  },
  // === SNORKELING SPOTS ===
  {
    slug: 'snorkeling-spots', contentType: 'beaches', apiUrl: '/api/beaches?limit=30',
    icon: 'Waves', color: 'cyan',
    title: { el: 'Σημεία για Snorkeling στη Χαλκιδική', en: 'Best Snorkeling Spots in Halkidiki', de: 'Beste Schnorchelplätze in Chalkidiki', bg: 'Най-добрите места за шнорхелинг в Халкидики', ru: 'Лучшие места для снорклинга в Халкидики', ro: 'Cele mai bune locuri de snorkeling în Halkidiki', sr: 'Najbolja mesta za ronjenje u Halkidikiju' },
    description: { el: 'Κρυστάλλινα νερά, θαλάσσια ζωή, βραχώδεις κολπίσκοι', en: 'Crystal clear water, marine life, rocky coves', de: 'Kristallklares Wasser, Meeresleben, Felsbuchten', bg: 'Кристално чиста вода, морски живот, скалисти заливчета', ru: 'Кристально чистая вода, морская жизнь, скалистые бухты', ro: 'Apă cristalină, viață marină, golfuri stâncoase', sr: 'Kristalno čista voda, morski život, stenoviti zalivi' },
    metaTitle: { el: 'Snorkeling Χαλκιδική | Κρυστάλλινα Νερά', en: 'Best Snorkeling Spots | Halkidiki', de: 'Beste Schnorchelplätze | Chalkidiki', bg: 'Шнорхелинг Халкидики | Кристална вода', ru: 'Снорклинг Халкидики | Чистая вода', ro: 'Snorkeling Halkidiki | Apă cristalină', sr: 'Ronjenje Halkidiki | Kristalna voda' },
    metaDesc: { el: 'Τα καλύτερα σημεία για snorkeling στη Χαλκιδική — διάφανα νερά, βραχώδεις κολπίσκοι, θαλάσσια ζωή.', en: 'Best snorkeling spots in Halkidiki — crystal clear waters, rocky coves, marine life.', de: 'Beste Schnorchelplätze in Chalkidiki — kristallklares Wasser, Felsbuchten, Meeresleben.', bg: 'Най-добрите места за шнорхелинг в Халкидики — кристална вода, скалисти заливи, морски живот.', ru: 'Лучшие места для снорклинга в Халкидики — кристальная вода, скалистые бухты, морская жизнь.', ro: 'Cele mai bune locuri de snorkeling din Halkidiki — apă cristalină, golfuri stâncoase, viață marină.', sr: 'Najbolja mesta za ronjenje u Halkidikiju — kristalna voda, stenoviti zalivi, morski život.' },
  },
  // === ROMANTIC GETAWAYS ===
  {
    slug: 'romantic-getaways', contentType: 'mixed', apiUrl: '/api/listings?sort=rating&limit=20',
    icon: 'Landmark', color: 'amber',
    title: { el: 'Ρομαντικές Αποδράσεις στη Χαλκιδική', en: 'Romantic Getaways in Halkidiki', de: 'Romantische Ausflüge in Chalkidiki', bg: 'Романтични почивки в Халкидики', ru: 'Романтический отдых в Халкидики', ro: 'Escapade romantice în Halkidiki', sr: 'Romantična putovanja u Halkidikiju' },
    description: { el: 'Boutique ξενοδοχεία, απομονωμένες παραλίες, αποδράσεις για ζευγάρια', en: 'Couples retreats, boutique hotels, secluded beaches', de: 'Paarurlaube, Boutique-Hotels, abgelegene Strände', bg: 'Почивки за двойки, бутикови хотели, усамотени плажове', ru: 'Отдых для пар, бутик-отели, уединённые пляжи', ro: 'Retrageri pentru cupluri, hoteluri boutique, plaje izolate', sr: 'Odmori za parove, butik hoteli, skrivene plaže' },
    metaTitle: { el: 'Ρομαντικές Αποδράσεις | Χαλκιδική', en: 'Romantic Getaways | Halkidiki', de: 'Romantische Ausflüge | Chalkidiki', bg: 'Романтични почивки | Халкидики', ru: 'Романтический отдых | Халкидики', ro: 'Escapade romantice | Halkidiki', sr: 'Romantična putovanja | Halkidiki' },
    metaDesc: { el: 'Ρομαντικές αποδράσεις στη Χαλκιδική — boutique ξενοδοχεία, απομονωμένες παραλίες, ιδανικά για ζευγάρια.', en: 'Romantic getaways in Halkidiki — boutique hotels, secluded beaches, perfect for couples.', de: 'Romantische Ausflüge in Chalkidiki — Boutique-Hotels, abgelegene Strände, perfekt für Paare.', bg: 'Романтични почивки в Халкидики — бутикови хотели, усамотени плажове, идеални за двойки.', ru: 'Романтический отдых в Халкидики — бутик-отели, уединённые пляжи, идеально для пар.', ro: 'Escapade romantice în Halkidiki — hoteluri boutique, plaje izolate, perfecte pentru cupluri.', sr: 'Romantična putovanja u Halkidikiju — butik hoteli, skrivene plaže, savršeno za parove.' },
  },
  // === TRADITIONAL TAVERNAS ===
  {
    slug: 'traditional-tavernas', contentType: 'restaurants', apiUrl: '/api/restaurants?limit=30',
    filterFn: 'cuisine', filterValue: 'traditional',
    icon: 'UtensilsCrossed', color: 'red',
    title: { el: 'Παραδοσιακές Ταβέρνες Χαλκιδικής', en: 'Traditional Tavernas in Halkidiki', de: 'Traditionelle Tavernen in Chalkidiki', bg: 'Традиционни таверни в Халкидики', ru: 'Традиционные таверны Халкидики', ro: 'Taverne tradiționale în Halkidiki', sr: 'Tradicionalne taverne u Halkidikiju' },
    description: { el: 'Αυθεντική ελληνική κουζίνα, τοπική ατμόσφαιρα, σπιτικές γεύσεις', en: 'Authentic Greek food, local atmosphere, homemade flavors', de: 'Authentische griechische Küche, lokale Atmosphäre, hausgemachte Aromen', bg: 'Автентична гръцка кухня, местна атмосфера, домашни вкусове', ru: 'Аутентичная греческая кухня, местная атмосфера, домашние вкусы', ro: 'Bucătărie grecească autentică, atmosferă locală, arome de casă', sr: 'Autentična grčka kuhinja, lokalna atmosfera, domaći ukusi' },
    metaTitle: { el: 'Παραδοσιακές Ταβέρνες | Χαλκιδική', en: 'Traditional Tavernas | Halkidiki', de: 'Traditionelle Tavernen | Chalkidiki', bg: 'Традиционни таверни | Халкидики', ru: 'Традиционные таверны | Халкидики', ro: 'Taverne tradiționale | Halkidiki', sr: 'Tradicionalne taverne | Halkidiki' },
    metaDesc: { el: 'Οι καλύτερες παραδοσιακές ταβέρνες στη Χαλκιδική — σπιτικό φαγητό, τοπικές γεύσεις, ελληνική φιλοξενία.', en: 'Best traditional tavernas in Halkidiki — homemade food, local flavors, Greek hospitality.', de: 'Beste traditionelle Tavernen in Chalkidiki — hausgemachtes Essen, lokale Aromen, griechische Gastfreundschaft.', bg: 'Най-добрите традиционни таверни в Халкидики — домашна храна, местни вкусове, гръцко гостоприемство.', ru: 'Лучшие традиционные таверны Халкидики — домашняя еда, местные вкусы, греческое гостеприимство.', ro: 'Cele mai bune taverne tradiționale din Halkidiki — mâncare de casă, arome locale, ospitalitate grecească.', sr: 'Najbolje tradicionalne taverne u Halkidikiju — domaća hrana, lokalni ukusi, grčko gostoprimstvo.' },
  },
];

export function getBestGuide(slug: string): BestGuide | undefined {
  return BEST_GUIDES.find(g => g.slug === slug);
}
