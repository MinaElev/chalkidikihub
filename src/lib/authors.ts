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
    },
    bio: {
      el: 'Ο Δημήτρης εξερευνά κάθε γωνιά της Χαλκιδικής, παρουσιάζοντας παραλίες, κρυμμένους προορισμούς, μονοπάτια και ταξιδιωτικούς οδηγούς που βοηθούν τους επισκέπτες να γνωρίσουν την περιοχή σαν ντόπιοι.',
      en: 'Dimitris explores every corner of Halkidiki, covering beaches, hidden destinations, hiking trails and travel guides that help visitors discover the region like locals do.',
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
    },
    bio: {
      el: 'Η Σοφία καλύπτει τη γαστρονομία, τον πολιτισμό και τις τοπικές επιχειρήσεις της Χαλκιδικής, αναδεικνύοντας αυθεντικές εμπειρίες, παραδοσιακές γεύσεις και προτάσεις για κάθε εποχή.',
      en: 'Sofia covers the gastronomy, culture and local businesses of Halkidiki, highlighting authentic experiences, traditional flavours and recommendations for every season.',
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
