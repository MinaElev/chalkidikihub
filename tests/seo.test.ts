import { describe, expect, it } from 'vitest';
import { assessQuality, indexableIn, nearbyListPasses, wordCount } from '@/lib/seo/quality';
import { parseSitemapId, sitemapGroup } from '@/lib/seo/sitemap-groups';
import { locales } from '@/i18n/config';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildRedirects, resolveInLocation } from '@/lib/seo/redirects';
import { localize } from '@/lib/i18n/localize';

describe('quality gate', () => {
  const body = 'λέξη '.repeat(130);
  it('passes a native, deep, illustrated page', () => {
    expect(assessQuality({ body, nativeBody: true, hasImage: true }, 'detail').indexable).toBe(true);
  });
  it('fails a fallback translation even when long', () => {
    const v = assessQuality({ body, nativeBody: false, hasImage: true }, 'detail');
    expect(v.indexable).toBe(false);
    expect(v.reasons).toContain('not-translated');
  });
  it('counts words without markup', () => {
    expect(wordCount('<p>Ένα <b>δύο</b> — τρία</p>')).toBe(3);
  });
});

describe('localize', () => {
  it('reports fallbacks as non-native', () => {
    const row = { name_el: 'Σάνη', name_en: 'Sani', name_de: '' };
    expect(localize(row, 'name', 'de')).toEqual({ text: 'Sani', from: 'en', native: false });
    expect(localize(row, 'name', 'el').native).toBe(true);
  });
});

describe('buildMetadata', () => {
  it('lists only indexable locales in hreflang and noindexes the rest', () => {
    const indexed = buildMetadata({
      locale: 'en', path: '/beaches/sani', title: 'Sani', description: 'd', indexableLocales: ['el', 'en'],
    });
    expect(Object.keys(indexed.alternates?.languages ?? {})).toEqual(['el', 'en', 'x-default']);
    expect(indexed.alternates?.canonical).toBe('https://chalkidikihub.gr/en/beaches/sani');

    const fallback = buildMetadata({
      locale: 'ru', path: '/beaches/sani', title: 'Sani', description: 'd', indexableLocales: ['el', 'en'],
    });
    expect(fallback.robots).toEqual({ index: false, follow: true });
    expect(fallback.alternates?.languages).toBeUndefined();
  });

  it('greek canonical is unprefixed', () => {
    const m = buildMetadata({ locale: 'el', path: '/', title: 'x', description: 'd' });
    expect(m.alternates?.canonical).toBe('https://chalkidikihub.gr/');
  });
});

describe('redirects', () => {
  const rules = buildRedirects();
  const find = (source: string) => rules.find((r) => r.source === source);

  it('folds duplicate patterns into the canonical page, for every locale', () => {
    expect(find('/stay/:slug')).toBeUndefined();
    expect(find('/stay/:slug/guide')?.destination).toBe('/guest/:slug');
    expect(find('/:locale(en|de|ro|bg|sr|ru)/stay/:slug/guide')?.destination).toBe('/:locale/guest/:slug');
    expect(find('/restaurants/area/sithonia')?.destination).toBe('/areas/sithonia');
    // /beaches/area/{area} is a page of its own (every beach of the peninsula).
    expect(find('/beaches/area/sithonia')).toBeUndefined();
  });

  it('keeps the brunch category out of the catch-all', () => {
    const catchAll = find('/restaurants/category/:type((?!brunch$).*)');
    expect(catchAll).toBeDefined();
    expect(new RegExp('^(?!brunch$).*$').test('brunch')).toBe(false);
  });

  it('every specific rule comes before its catch-all', () => {
    const specific = rules.findIndex((r) => r.source === '/restaurants/category/seafood');
    const general = rules.findIndex((r) => r.source.startsWith('/restaurants/category/:type'));
    expect(specific).toBeLessThan(general);
  });

  it('stays well under the platform route limit', () => {
    expect(rules.length).toBeLessThan(400);
  });

  it('maps legacy /in URLs to the village pages', () => {
    expect(resolveInLocation('nea-fokea', 'beaches')).toBe('/places/nea-fokaia/beaches');
    expect(resolveInLocation('nikiti', 'listings')).toBe('/places/nikiti');
    expect(resolveInLocation('nowhere', 'beaches')).toBeNull();
  });
});

import robots from '@/app/robots';

describe('robots.txt', () => {
  // Google's matching: a rule matches if the path starts with it; "$" anchors the end.
  const matches = (rule: string, path: string) => {
    const anchored = rule.endsWith('$');
    const body = (anchored ? rule.slice(0, -1) : rule).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(`^${body}${anchored ? '$' : ''}`).test(path);
  };

  it('never blocks a public section', () => {
    const rules = robots().rules;
    const star = (Array.isArray(rules) ? rules : [rules]).find((r) => r.userAgent === '*')!;
    const disallow = ([] as string[]).concat(star.disallow ?? []);
    for (const path of ['/authors/dimitris-karagiannis', '/restaurants', '/en/restaurants/x', '/beaches', '/blog/x', '/de/authors/x', '/places/x']) {
      expect(disallow.filter((r) => matches(r, path)), path).toEqual([]);
    }
    for (const path of ['/auth', '/auth/login', '/en/dashboard', '/admin/users', '/r/abc']) {
      expect(disallow.some((r) => matches(r, path)), path).toBe(true);
    }
  });
});

describe('quality gate word minimum per locale', () => {
  const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`).join(' ');
  it('scales the minimum for terse locales', () => {
    expect(assessQuality({ body: words(100), nativeBody: true, hasImage: true, locale: 'ru' }, 'detail').indexable).toBe(true);
    expect(assessQuality({ body: words(100), nativeBody: true, hasImage: true, locale: 'en' }, 'detail').indexable).toBe(false);
    expect(assessQuality({ body: words(95), nativeBody: true, hasImage: true, locale: 'ru' }, 'detail').indexable).toBe(false);
  });

  it('asks more of translated venue pages than of the Greek original', () => {
    const venue = (n: number, locale: 'el' | 'en') => assessQuality({ body: words(n), nativeBody: true, hasImage: true, locale }, 'venue').indexable;
    expect(venue(60, 'el')).toBe(true);
    expect(venue(60, 'en')).toBe(false);
    expect(venue(80, 'en')).toBe(true);
  });
});

describe('index scope (2026-11 "crawled, not indexed" clean-up)', () => {
  it('indexes Russian only on main hubs and proven URLs', () => {
    expect(indexableIn('/beaches/test-beach', locales)).not.toContain('ru');
    // A Russian URL that already earns clicks stays indexed.
    expect(indexableIn('/beaches/sani-kassandra', locales)).toContain('ru');
    expect(indexableIn('/beaches', locales)).toContain('ru');
    expect(indexableIn('/beaches/sani-kassandra', locales)).toContain('de');
    const m = buildMetadata({ locale: 'ru', path: '/places/afytos/activities', title: 'x', description: 'd' });
    expect(m.robots).toEqual({ index: false, follow: true });
  });

  it('indexes a village list only with several places close by', () => {
    expect(nearbyListPasses('beaches', [1, 2, 3, 4, 9])).toBe(true);
    expect(nearbyListPasses('beaches', [1, 2, 3, 4, 12, 20])).toBe(false);
    expect(nearbyListPasses('activities', [3, 8, 11, 14, 15])).toBe(true);
    expect(nearbyListPasses('activities', [3, 8, 11, 14, 22])).toBe(false);
  });

  it('files every path under one sitemap family and round-trips the file id', () => {
    expect(sitemapGroup('/')).toBe('hubs');
    expect(sitemapGroup('/beaches')).toBe('hubs');
    expect(sitemapGroup('/places/afytos')).toBe('places');
    expect(sitemapGroup('/places/afytos/beaches')).toBe('places-lists');
    expect(sitemapGroup('/beaches/feature/nudist')).toBe('beaches');
    expect(sitemapGroup('/guide/day-trips')).toBe('guides');
    expect(sitemapGroup('/mount-athos/monasteries/iviron')).toBe('athos');
    expect(parseSitemapId('de-places-lists')).toEqual({ locale: 'de', group: 'places-lists' });
    expect(parseSitemapId('xx-beaches')).toBeNull();
    expect(parseSitemapId('de-nonsense')).toBeNull();
  });
});

describe('beach slug renames', () => {
  it('301s the wrong-peninsula slug to the corrected one', async () => {
    const { publicSlug, dbSlug } = await import('@/content/rewrites/slug-renames');
    expect(publicSlug('beaches', 'glarokavos-nudist-beach-sithonia')).toBe('glarokavos-nudist-beach-kassandra');
    expect(dbSlug('beaches', 'glarokavos-nudist-beach-kassandra')).toBe('glarokavos-nudist-beach-sithonia');
    const rules = buildRedirects();
    expect(rules.find((r) => r.source === '/beaches/mykoniatika-nudist-beach-kassandra')?.destination).toBe('/beaches/mykoniatika-nudist-beach-mainland');
  });
});

describe('content overlays', () => {
  it('lets the database win and fills only blanks', async () => {
    const { withRewrite, REWRITES } = await import('@/content/rewrites');
    const slug = Object.keys(REWRITES.villages)[0];
    const edited = withRewrite('villages', { slug, description_el: 'Κείμενο από το admin' });
    expect(edited.description_el).toBe('Κείμενο από το admin');
    const blank = withRewrite('villages', { slug, description_el: '' });
    expect(blank.description_el).toBe(REWRITES.villages[slug].el);
  });
});

describe('PMS removal redirects', () => {
  const rules = buildRedirects();
  it('sends old PMS and booking-flow URLs somewhere useful', () => {
    expect(rules).toContainEqual({ source: '/dashboard/pms/:path*', destination: '/dashboard/calendars', permanent: true });
    expect(rules.some((r) => r.source === '/book/:slug/:step(success|confirmed|cancelled)' && r.destination === '/listings/:slug')).toBe(true);
  });
});

describe('redirect loops', () => {
  it('has no rule whose source matches its own destination (Next matches case-insensitively)', () => {
    const loops = buildRedirects().filter((r) => r.source.toLowerCase() === r.destination.toLowerCase());
    expect(loops).toEqual([]);
  });
});

describe('internal link resolution', () => {
  it('sends content links straight to the final URL', async () => {
    const { resolveInternal } = await import('@/lib/seo/redirects');
    expect(resolveInternal('/best/family-beaches')).toBe('/blog/best-beaches-shallow-water');
    expect(resolveInternal('/in/ouranoupoli/beaches')).toBe('/places/ouranoupoli/beaches');
    expect(resolveInternal('/beaches/glarokavos-nudist-beach-sithonia')).toBe('/beaches/glarokavos-nudist-beach-kassandra');
    expect(resolveInternal('/blog/BARbatolis')).toBe('/blog/barbatolis');
    expect(resolveInternal('/restaurants/category/brunch')).toBe('/restaurants/category/brunch');
    expect(resolveInternal('/beaches/karidi-sithonia')).toBe('/beaches/karidi-sithonia');
  });

  it('folds the 404s Search Console reported on 2026-11-23 into their successors', async () => {
    const { resolveInternal } = await import('@/lib/seo/redirects');
    expect(resolveInternal('/places/arnea')).toBe('/places/arnaia');
    expect(resolveInternal('/places/arnea/beaches')).toBe('/places/arnaia/beaches');
    expect(resolveInternal('/places/dionysiou')).toBe('/mount-athos/monasteries/dionysiou');
    expect(resolveInternal('/places/dionysiou/activities')).toBe('/mount-athos/monasteries/dionysiou');
    expect(resolveInternal('/guide/april')).toBe('/guide/best-time-to-visit');
    expect(resolveInternal('/guide/kassandra-sithonia-athos')).toBe('/guide/kassandra-vs-sithonia');
    expect(resolveInternal('/guide/first-time-halkidiki')).toBe('/blog/symvouli-first-time-halkidiki');
    expect(resolveInternal('/guide/halkidiki-without-car')).toBe('/blog/getting-around-halkidiki');
    expect(resolveInternal('/beaches/siviri-beach-kassandra')).toBe('/places/siviri/beaches');
  });
});

describe('automatic internal links', () => {
  it('matches whole names in any case, accent and Greek case form, never inside a word', async () => {
    const { autoLink, fold, greekForms } = await import('@/lib/content/autolink-core');
    const items = [
      { path: '/places/nikiti', forms: greekForms(fold('Νικήτη')) },
      { path: '/places/neos-marmaras', forms: greekForms(fold('Νέος Μαρμαράς')) },
      { path: '/areas/kassandra', forms: greekForms(fold('Κασσάνδρα')) },
      { path: '/places/sarti', forms: greekForms(fold('Σάρτη')) },
    ];
    const html = '<p>Από τη ΝΙΚΗΤΗ ως τον Νέο Μαρμαρά, και τις παραλίες της Κασσανδρας. Σαρτηνοί ψαράδες.</p>';
    const out = autoLink(html, items, 'el', '/beaches/x');
    expect(out).toContain('<a href="/places/nikiti">ΝΙΚΗΤΗ</a>');
    expect(out).toContain('<a href="/places/neos-marmaras">Νέο Μαρμαρά</a>');
    expect(out).toContain('<a href="/areas/kassandra">Κασσανδρας</a>');
    expect(out).not.toContain('/places/sarti'); // "Σαρτηνοί" is another word
  });
  it('links each place once, skips headings, existing links and the page itself', async () => {
    const { autoLink, fold, greekForms } = await import('@/lib/content/autolink-core');
    const items = [
      { path: '/places/nikiti', forms: greekForms(fold('Νικήτη')) },
      { path: '/places/sarti', forms: greekForms(fold('Σάρτη')) },
      { path: '/areas/sithonia', forms: greekForms(fold('Σιθωνία')) },
    ];
    const html = '<h2>Νικήτη</h2><p>Η Νικήτη και πάλι η Νικήτη. <a href="/places/sarti">Σάρτη</a> και Σάρτη. Η Σιθωνία.</p>';
    const out = autoLink(html, items, 'el', '/areas/sithonia');
    expect(out).toContain('<h2>Νικήτη</h2>');
    expect(out.match(/href="\/places\/nikiti"/g)).toHaveLength(1);
    expect(out.match(/href="\/places\/sarti"/g)).toHaveLength(1);
    expect(out).not.toContain('href="/areas/sithonia"');
  });
});

describe('automatic internal links: proper nouns only', () => {
  it('does not link a lower-case common word that happens to be a place name', async () => {
    const { autoLink, fold, greekForms } = await import('@/lib/content/autolink-core');
    const items = [{ path: '/beaches/galini', forms: greekForms(fold('Γαλήνη')) }];
    expect(autoLink('<p>Η θάλασσα έχει γαλήνη.</p>', items, 'el', '/x')).not.toContain('<a ');
    expect(autoLink('<p>Η Γαλήνη είναι ήσυχη.</p>', items, 'el', '/x')).toContain('<a href="/beaches/galini">Γαλήνη</a>');
  });
});

describe('alphabet checks', () => {
  it('detects text in the wrong alphabet and converts Serbian Cyrillic to Latin', async () => {
    const { writtenFor, serbianLatin } = await import('@/lib/i18n/script');
    expect(writtenFor('1st Bedroom offers a double bed and a window', 'el')).toBe(false);
    expect(writtenFor('Το Sea Star Lux είναι δίπλα στη θάλασσα', 'el')).toBe(true);
    expect(writtenFor('Be-villas Σουίτα με ιδιωτική πισίνα', 'en')).toBe(false);
    expect(writtenFor('Отдых в доме у моря', 'ru')).toBe(true);
    expect(serbianLatin('Од Београда до Халкидикија — 600 км, ~6 сати')).toBe('Od Beograda do Halkidikija — 600 km, ~6 sati');
    expect(serbianLatin('Љубљана и Његош')).toBe('Ljubljana i Njegoš');
    expect(serbianLatin('Гранична Полиция (BG)')).toBe('Granična Полиция (BG)'); // Bulgarian word left as is
  });

  it('marks the language of visitor text only when the letters make it certain', async () => {
    const { textLang } = await import('@/lib/i18n/script');
    expect(textLang('Υπέροχο κατάλυμα, καθαρό και ήσυχο')).toBe('el');
    expect(textLang('Отлично место, мы вернёмся')).toBe('ru');
    expect(textLang('Страхотно място, ще се върнем отново')).toBe('bg');
    expect(textLang('Odličan smeštaj, vraćamo se')).toBe('sr');
    expect(textLang('Cazare foarte curată, recomandăm')).toBe('ro');
    expect(textLang('Sehr schöne Unterkunft')).toBe('de');
    expect(textLang('Great place, very clean')).toBeUndefined();
  });
});
