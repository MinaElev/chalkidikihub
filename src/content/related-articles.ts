/**
 * Guides that are about a specific village, beach or theme, so the pages they
 * describe can link back to them (internal-link audit 2026-11-23: these guides
 * had only one or two links from page content). Curated by hand from each
 * guide's subject; a guide is linked only where it is the page's own topic.
 */
export const ARTICLES_BY_VILLAGE: Record<string, string[]> = {
  'neos-marmaras': ['neos-marmaras-guide'],
  ouranoupoli: ['ouranoupolis-guide', 'mount-athos-guide', 'mount-athos-diamonitirion-guide'],
  ierissos: ['mount-athos-guide'],
  'nea-moudania': ['nea-moudania-gateway'],
  'porto-koufo': ['porto-koufo-hidden-harbor'],
  ammouliani: ['ammouliani-island-complete-guide'],
  stagira: ['aristotle-halkidiki'],
};

/** Villages that are the gateways to Mount Athos (boats leave from Ouranoupoli and Ierissos). */
export const ATHOS_GATEWAYS = new Set(['ouranoupoli', 'ierissos']);

export const ARTICLES_BY_BEACH: Record<string, string[]> = {
  // Kavourotripes is the local name of Portokali beach.
  'portokali-sithonia': ['kavourotripes-secret-beach'],
  'porto-koufo-sithonia': ['porto-koufo-hidden-harbor'],
};

/** Beach pages by peninsula. */
export const ARTICLES_BY_AREA: Record<string, string[]> = {
  kassandra: ['keyword-oi-kalyteres-paralies-kassandras', 'top-10-beaches-kassandra'],
  sithonia: ['keyword-oi-kalyteres-paralies-sithonias', 'sithonia-hidden-gems'],
};

/** On beaches holding a Blue Flag this year. */
export const BLUE_FLAG_ARTICLE = 'blue-flag-beaches-halkidiki';

export const ARTICLES_BY_ACTIVITY: Record<string, string[]> = {
  'ancient-stagira': ['aristotle-halkidiki'],
  'church-of-agios-antonios': ['orthodox-monasteries-halkidiki'],
};
export const ARTICLES_BY_CATEGORY: Record<string, string[]> = {
  historical: ['halkidiki-in-mythology'],
  religious: ['orthodox-monasteries-halkidiki'],
};
