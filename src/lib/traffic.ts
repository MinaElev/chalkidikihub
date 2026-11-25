/**
 * Cookieless traffic counter — classification helpers (pure, unit-tested).
 *
 * Nothing here identifies a visitor: the page, where the visit came from,
 * the device class and the site language are all that is kept, summed per day.
 */

export const LOCALES = ['el', 'en', 'de', 'ro', 'sr', 'bg', 'ru'] as const;

/** Contact actions we count. Anything else is dropped. */
export const EVENTS = ['call', 'email', 'whatsapp', 'inquiry', 'inquiry_calendar', 'inquiry_similar', 'availability_request', 'booking_link', 'website', 'directions', 'outbound'] as const;
export type TrafficEvent = (typeof EVENTS)[number];

/** Sections of the site the counter never looks at. */
export const PRIVATE_PATH = /^\/(?:(?:en|de|ro|sr|bg|ru)\/)?(?:admin|dashboard|auth|requests|r|book|guest|favorites|api|zz-)(?:\/|$)/;

/** "/en/listings/x?y#z" → { path: "/listings/x", lang: "en" }. Lower case, no trailing slash. */
export function normalizePath(raw: string): { path: string; lang: string } {
  let p = (raw || '/').split(/[?#]/)[0].toLowerCase();
  try { p = decodeURIComponent(p); } catch { /* keep as is */ }
  let lang = 'el';
  const m = p.match(/^\/(en|de|ro|sr|bg|ru)(?=\/|$)/);
  if (m) { lang = m[1]; p = p.slice(m[0].length) || '/'; }
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return { path: (p || '/').slice(0, 200), lang };
}

const SEARCH: [RegExp, string][] = [
  [/(^|\.)google\./, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)duckduckgo\.com$/, 'duckduckgo'],
  [/(^|\.)yahoo\./, 'yahoo'],
  [/(^|\.)yandex\./, 'yandex'],
  [/(^|\.)ecosia\.org$/, 'ecosia'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|m\.facebook\.com|l\.facebook\.com)$/, 'facebook'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)(t\.co|twitter\.com|x\.com)$/, 'x'],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, 'linkedin'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)pinterest\./, 'pinterest'],
  [/(^|\.)(chatgpt\.com|chat\.openai\.com)$/, 'chatgpt'],
  [/(^|\.)perplexity\.ai$/, 'perplexity'],
  [/(^|\.)gemini\.google\.com$/, 'gemini'],
  [/(^|\.)copilot\.microsoft\.com$/, 'copilot'],
  [/(^|\.)claude\.ai$/, 'claude'],
  [/(^|\.)(mail\.google\.com|outlook\.(live|office)\.com|mail\.yahoo\.com)$/, 'email'],
];

/**
 * Where a page view came from. `internal` = from another page of this site
 * (not a new visit). A utm_source in the URL wins over the referrer.
 */
export function classifySource(referrer: string, ownHost: string, utmSource?: string | null): string {
  const utm = (utmSource || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 40);
  if (utm) return utm === 'ig' ? 'instagram' : utm === 'fb' ? 'facebook' : utm;
  if (!referrer) return 'direct';
  let host = '';
  try { host = new URL(referrer).hostname.toLowerCase(); } catch { return 'direct'; }
  host = host.replace(/^www\./, '');
  const own = ownHost.toLowerCase().replace(/^www\./, '');
  if (host === own || host === 'localhost' || host.endsWith('.' + own)) return 'internal';
  if (host === 'gemini.google.com') return 'gemini';
  for (const [re, name] of SEARCH) if (re.test(host)) return name;
  return host.slice(0, 60);
}

export function deviceFromUA(ua: string): 'mobile' | 'tablet' | 'desktop' {
  const u = ua || '';
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(u)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|Opera Mini/i.test(u)) return 'mobile';
  return 'desktop';
}

export function isBot(ua: string): boolean {
  return !ua || /bot|crawl|spider|slurp|preview|fetch|monitor|lighthouse|headless|phantom|puppeteer|playwright|selenium|curl|wget|python|java\/|go-http|axios|node-fetch|facebookexternalhit|embedly|quora link|bingpreview|google-inspectiontool|chrome-lighthouse|pagespeed|gtmetrix|semrush|ahrefs|mj12|dotbot|petal|bytespider|gptbot|claudebot|ccbot|perplexitybot|applebot/i.test(ua);
}

/** Athens calendar day, so "today" matches the owner's day, not UTC. */
export function athensDay(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

/** What kind of page a path is, for the "by content type" breakdown. */
export function pageKind(path: string): string {
  if (path === '/') return 'home';
  const seg = path.split('/')[1] || '';
  const map: Record<string, string> = {
    listings: 'listings', stay: 'listings', beaches: 'beaches', places: 'places', areas: 'places',
    restaurants: 'food', activities: 'activities', blog: 'articles', guide: 'guides', guides: 'guides',
    events: 'events', 'ev-chargers': 'ev', search: 'search', map: 'map', 'availability-request': 'availability',
    'for-owners': 'owners', pricing: 'owners', host: 'listings', sales: 'sales', 'last-minute': 'listings',
  };
  return map[seg] || 'other';
}
