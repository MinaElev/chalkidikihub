/**
 * Editorial authors (E-E-A-T). Static config rather than a DB table — only a
 * couple of named editors, and their bylines need to resolve at render time on
 * every article/author page. `blog_articles.author` stores the `username` key;
 * `getAuthor()` resolves it (with legacy team-name fallbacks) to a full profile
 * used for the visible byline, the `/authors/<username>` page and the Person
 * JSON-LD.
 */

export type Author = {
  username: string;
  name: string;
  /** Localised job title. */
  role: Record<string, string>;
  /** Localised bio. */
  bio: Record<string, string>;
  /** Search snippet (≤158 chars); the bio is longer. */
  metaDesc: Record<string, string>;
  /** Topics for Person.knowsAbout — a concrete expertise signal for Google. */
  knowsAbout: string[];
  /** Tailwind gradient classes for the initials avatar (no real photo yet). */
  avatarGradient: string;
};

export const AUTHORS: Record<string, Author> = {
  'dimitris-karagiannis': {
    username: 'dimitris-karagiannis',
    name: 'Dimitris Karagiannis',
    role: {
      el: 'Επικεφαλής Ταξιδιωτικός Συντάκτης',
      en: 'Senior Travel Editor',
      de: 'Senior Reise-Redakteur',
      ro: 'Editor Senior de Călătorii',
      sr: 'Stariji urednik za putovanja',
      bg: 'Старши редактор за пътувания',
      ru: 'Старший редактор по путешествиям',
    },
    bio: {
      el: 'Ο Δημήτρης εξερευνά κάθε γωνιά της Χαλκιδικής, παρουσιάζοντας παραλίες, κρυμμένους προορισμούς, μονοπάτια και ταξιδιωτικούς οδηγούς που βοηθούν τους επισκέπτες να γνωρίσουν την περιοχή σαν ντόπιοι.',
      en: 'Dimitris explores every corner of Halkidiki, covering beaches, hidden destinations, hiking trails and travel guides that help visitors discover the region like locals do.',
      de: 'Dimitris erkundet jede Ecke von Chalkidiki, berichtet über Strände, versteckte Ziele, Wanderwege und Reiseführer, die Besuchern helfen, die Region wie Einheimische zu entdecken.',
      ro: 'Dimitris explorează fiecare colț al Chalkidiki, acoperind plajele, destinațiile ascunse, traseele de drumeție și ghidurile de călătorie care ajută vizitatorii să descopere regiunea ca localnicii.',
      sr: 'Dimitris istražuje svaki kutak Halkidikija, pokrivajući plaže, skrivene destinacije, planinarske staze i vodiče za putovanja koji pomažu posetiocima da otkriju region kao lokalci.',
      bg: 'Димитрис изследва всеки ъгъл на Халкидики, обхващайки плажове, скрити дестинации, пешеходни маршрути и пътеводители, които помагат на посетителите да открият региона като местни жители.',
      ru: 'Димитрис исследует каждый уголок Халкидики, освещая пляжи, скрытые направления, туристические маршруты и путеводители, которые помогают посетителям открывать регион так, как это делают местные жители.',
    },
    metaDesc: {
      el: "Ο Δημήτρης γράφει για τις παραλίες, τα κρυφά σημεία, τα μονοπάτια και τους οδηγούς του ChalkidikiHub, για να γνωρίσετε τη Χαλκιδική όπως οι ντόπιοι.",
      en: "Dimitris writes ChalkidikiHub's guides to beaches, hidden spots, hiking trails and itineraries, to help visitors get to know Halkidiki the way locals do.",
      de: "Dimitris schreibt die ChalkidikiHub-Ratgeber zu Stränden, versteckten Orten, Wanderwegen und Routen, damit Sie Chalkidiki wie Einheimische kennenlernen.",
      ro: "Dimitris scrie ghidurile ChalkidikiHub despre plaje, locuri ascunse, trasee de drumeție și itinerarii, ca să descoperi Halkidiki așa cum o cunosc localnicii.",
      sr: "Dimitris piše vodiče ChalkidikiHub-a o plažama, skrivenim mestima, planinarskim stazama i planovima puta, da biste Halkidiki upoznali kao meštani.",
      bg: "Димитрис пише пътеводителите на ChalkidikiHub за плажове, скрити места, пешеходни пътеки и маршрути, за да опознаете Халкидики като местните.",
      ru: "Димитрис пишет путеводители ChalkidikiHub о пляжах, укромных местах, пеших тропах и маршрутах, чтобы вы узнали Халкидики, как местные жители.",
    },
    knowsAbout: ['Halkidiki beaches', 'Travel guides', 'Hiking trails', 'Sithonia', 'Kassandra', 'Hidden destinations', 'Itineraries'],
    avatarGradient: 'from-sky-500 to-blue-700',
  },
  'sofia-antoniou': {
    username: 'sofia-antoniou',
    name: 'Sofia Antoniou',
    role: {
      el: 'Συντάκτρια Γαστρονομίας & Lifestyle',
      en: 'Food & Lifestyle Editor',
      de: 'Redakteurin für Essen & Lifestyle',
      ro: 'Editor de Gastronomie și Stil de Viață',
      sr: 'Urednik za hranu i stil života',
      bg: 'Редактор за храна и начин на живот',
      ru: 'Редактор по еде и образу жизни',
    },
    bio: {
      el: 'Η Σοφία καλύπτει τη γαστρονομία, τον πολιτισμό και τις τοπικές επιχειρήσεις της Χαλκιδικής, αναδεικνύοντας αυθεντικές εμπειρίες, παραδοσιακές γεύσεις και προτάσεις για κάθε εποχή.',
      en: 'Sofia covers the gastronomy, culture and local businesses of Halkidiki, highlighting authentic experiences, traditional flavours and recommendations for every season.',
      de: 'Sofia berichtet über die Gastronomie, Kultur und lokalen Unternehmen von Chalkidiki und hebt authentische Erlebnisse, traditionelle Geschmäcker und Empfehlungen für jede Jahreszeit hervor.',
      ro: 'Sofia acoperă gastronomia, cultura și afacerile locale din Chalkidiki, evidențiind experiențe autentice, arome tradiționale și recomandări pentru fiecare sezon.',
      sr: 'Sofija pokriva gastronomiju, kulturu i lokalne biznise Halkidikija, ističući autentična iskustva, tradicionalne ukuse i preporuke za svaku sezonu.',
      bg: 'София обхваща гастрономията, културата и местния бизнес на Халкидики, подчертавайки автентични преживявания, традиционни вкусове и препоръки за всеки сезон.',
      ru: 'София освещает гастрономию, культуру и местный бизнес Халкидики, подчеркивая аутентичные впечатления, традиционные вкусы и рекомендации для каждого сезона.',
    },
    metaDesc: {
      el: "Η Σοφία γράφει για τη γαστρονομία, τον πολιτισμό και τις τοπικές επιχειρήσεις της Χαλκιδικής: παραδοσιακές γεύσεις, ταβέρνες και προτάσεις για κάθε εποχή.",
      en: "Sofia writes about Halkidiki's food, culture and local businesses: traditional flavours, tavernas, local products and recommendations for every season.",
      de: "Sofia schreibt über Küche, Kultur und lokale Betriebe in Chalkidiki: traditionelle Gerichte, Tavernen, regionale Produkte und Tipps für jede Jahreszeit.",
      ro: "Sofia scrie despre gastronomia, cultura și afacerile locale din Halkidiki: arome tradiționale, taverne, produse locale și recomandări pentru fiecare sezon.",
      sr: "Sofija piše o gastronomiji, kulturi i lokalnim biznisima Halkidikija: tradicionalni ukusi, taverne, lokalni proizvodi i preporuke za svaku sezonu.",
      bg: "София пише за кухнята, културата и местния бизнес на Халкидики: традиционни вкусове, таверни, местни продукти и препоръки за всеки сезон.",
      ru: "София пишет о кухне, культуре и местном бизнесе Халкидики: традиционные вкусы, таверны, местные продукты и советы на любой сезон.",
    },
    knowsAbout: ['Greek cuisine', 'Halkidiki gastronomy', 'Local products', 'Tavernas', 'Culture', 'Local businesses', 'Lifestyle'],
    avatarGradient: 'from-rose-500 to-amber-600',
  },
};

export const AUTHOR_LIST: Author[] = Object.values(AUTHORS);

/** Category → default author username, before the food/lifestyle keyword override. */
const CATEGORY_AUTHOR: Record<string, string> = {
  food: 'sofia-antoniou',
  culture: 'sofia-antoniou',
  guides: 'dimitris-karagiannis',
  tips: 'dimitris-karagiannis',
  beaches: 'dimitris-karagiannis',
  activities: 'dimitris-karagiannis',
};

const DEFAULT_AUTHOR = 'dimitris-karagiannis';

// Aliases for any legacy stored values (dotted usernames or team names) →
// current profile. URL segments can't contain dots (i18n middleware skips them),
// so usernames are hyphenated; these keep old rows resolving.
const ALIASES: Record<string, string> = {
  'dimitris.karagiannis': 'dimitris-karagiannis',
  'sofia.antoniou': 'sofia-antoniou',
  'ChalkidikihubWriterTeam': 'dimitris-karagiannis',
  'ChalkidikiHub Writer Team': 'dimitris-karagiannis',
  'Halkidiki Hub': 'dimitris-karagiannis',
  'Chalkidiki Hub': 'dimitris-karagiannis',
};

/** Resolve a stored `author` value (username, alias, or display name) to a profile. */
export function getAuthor(value: string | null | undefined): Author {
  if (value) {
    if (AUTHORS[value]) return AUTHORS[value];
    if (ALIASES[value] && AUTHORS[ALIASES[value]]) return AUTHORS[ALIASES[value]];
    const byName = AUTHOR_LIST.find((a) => a.name === value);
    if (byName) return byName;
  }
  return AUTHORS[DEFAULT_AUTHOR];
}

/** Pick the author for a blog article by category (used when assigning bylines). */
export function authorForCategory(category: string | null | undefined): string {
  return (category && CATEGORY_AUTHOR[category]) || DEFAULT_AUTHOR;
}

export function authorUrl(username: string): string {
  return `/authors/${username}`;
}

export function authorInitials(name: string): string {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}
