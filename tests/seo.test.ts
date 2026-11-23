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

  it('sends Greek-named activity URLs to the Latin slug, in every locale', async () => {
    const { greekActivityRedirect } = await import('@/lib/seo/redirects');
    const greek = encodeURIComponent('μουσείο-μικρασιατικού-πολιτισμού');
    expect(greekActivityRedirect(`/en/activities/${greek}`)).toBe('/en/activities/mouseio-mikrasiatikoy-politismoy');
    expect(greekActivityRedirect(`/activities/${greek}`)).toBe('/activities/mouseio-mikrasiatikoy-politismoy');
    // Follows later redirects in one hop (this activity moved to its beach page).
    expect(greekActivityRedirect(`/activities/${encodeURIComponent('παραλία-τορώνη')}`)).toBe('/beaches/toroni-beach-sithonia');
    expect(greekActivityRedirect('/activities/mouseio-mikrasiatikoy-politismoy')).toBeNull();
    expect(greekActivityRedirect(`/activities/${encodeURIComponent('άγνωστο')}`)).toBeNull();
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

describe('documented beach facts (audit/sources/BEACH-DATA-AUDIT.md)', () => {
  it('cites only beaches on the official lists, with well-formed profile ids', async () => {
    const { BLUE_FLAG_2026, BEACH_PROFILES, BLUE_FLAG_YEAR } = await import('@/content/beach-facts');
    expect(BLUE_FLAG_YEAR).toBe('2026');
    // 35 awarded beaches, registered under both their database and public slugs.
    expect(BLUE_FLAG_2026.has('paralia-vergias-kassandra') && BLUE_FLAG_2026.has('paralia-vergias-mainland')).toBe(true);
    expect(BLUE_FLAG_2026.size).toBeGreaterThanOrEqual(35);
    for (const p of Object.values(BEACH_PROFILES)) expect(p.profile).toMatch(/^ELBW1090\d{8}$/);
    // Facilities are deliberately absent: the 2015 profiles may be out of date.
    for (const p of Object.values(BEACH_PROFILES)) expect(Object.keys(p).every((k) => ['profile', 'coast', 'shallow', 'depth5m', 'lengthM'].includes(k))).toBe(true);
  });

  it('has every new beach-list message in all 7 locales, and no leftover tag-based claims', async () => {
    const { locales } = await import('@/i18n/config');
    const keys = ['beachesIntro', 'faqNearestA', 'beachesBlueFlag', 'officialTitle', 'officialIntro', 'officialProfile', 'officialSources',
      'factBlueFlag', 'factSand', 'factSandFine', 'factSandCoarse', 'factShallow', 'factNormalDepth', 'factDepth5m', 'factLength',
      'faqBlueFlagQ', 'faqBlueFlagA', 'faqShallowQ', 'faqShallowA'];
    for (const l of locales) {
      const places = (await import(`../messages/v4/${l}.json`)).default.places;
      for (const k of keys) expect(places[k], `${l}.${k}`).toBeTruthy();
      for (const k of ['beachesMix', 'faqSandyQ', 'faqOrganizedQ', 'faqQuietQ']) expect(places[k], `${l}.${k}`).toBeUndefined();
      expect(places.faqNearestA).not.toContain('{minutes}');
    }
  });
});

describe('beach page states physical facts only from official sources', () => {
  it('has the new beach messages in all 7 locales and none of the tag-based ones', async () => {
    const { locales } = await import('@/i18n/config');
    const keys = ['faqWhereA', 'shoreSand', 'shoreSandFine', 'shoreSandCoarse', 'faqShoreOfficialA', 'faqShallowQ', 'faqShallowYesA',
      'faqShallowNoA', 'faqDepthA', 'faqBlueFlagOfficialA', 'blueFlagLabel', 'blueFlagValue', 'officialLabel', 'officialProfile',
      'factShallow', 'factNormalDepth', 'factDepth5m', 'factLength'];
    for (const l of locales) {
      const beach = (await import(`../messages/v4/${l}.json`)).default.beach;
      for (const k of keys) expect(beach[k], `${l}.${k}`).toBeTruthy();
      for (const k of ['faqSandyA', 'faqPebbleA', 'faqMixedShoreA', 'faqKidsQ', 'faqKidsA', 'faqBlueFlagA']) expect(beach[k], `${l}.${k}`).toBeUndefined();
      expect(beach.faqWhereA).not.toContain('{minutes}');
      // No unsourced tips repeated on every beach.
      expect(beach.faqParkingA).not.toMatch(/10:30/);
    }
  });
});

describe('village facts come from the ELSTAT 2021 census (audit/sources/elstat)', () => {
  it('lists census figures with Chalkidiki settlement codes, not the table estimates', async () => {
    const { VILLAGE_FACTS, MUNICIPALITY_NAMES, CENSUS_YEAR } = await import('@/content/village-facts');
    expect(CENSUS_YEAR).toBe('2021');
    expect(Object.keys(VILLAGE_FACTS).length).toBe(77);
    // 13 = Π.Ε. Χαλκιδικής in the ELSTAT geographic code.
    for (const f of Object.values(VILLAGE_FACTS)) expect(f.elstat).toMatch(/^13\d{8}$/);
    expect(VILLAGE_FACTS.polygyros.population).toBe(6488);
    expect(VILLAGE_FACTS['nea-moudania'].population).toBe(10042);
    // No certain census match: left out rather than guessed.
    for (const s of ['gerakini', 'planitsi', 'palaiokastro']) expect(VILLAGE_FACTS[s]).toBeUndefined();
    for (const m of Object.values(MUNICIPALITY_NAMES)) expect(Object.keys(m).length).toBe(7);
  });

  it('has the village facts messages in all 7 locales', async () => {
    const { locales } = await import('@/i18n/config');
    const keys = ['factMunicipality', 'factMunicipalityValue', 'factPopulation', 'factPopulationValue', 'factBlueFlagNear',
      'factBlueFlagNearValue', 'faqPopulationQ', 'faqPopulationA', 'faqMunicipalityQ', 'faqMunicipalityA'];
    for (const l of locales) {
      const places = (await import(`../messages/v4/${l}.json`)).default.places;
      for (const k of keys) expect(places[k], `${l}.${k}`).toBeTruthy();
    }
  });
});

describe('every beach surface uses the documented features', () => {
  it('replaces physical tags with official facts, keeps facility tags', async () => {
    const { documentedFeatures } = await import('@/lib/content/beach-documented');
    // Komitsa: tagged pebble + shallowWater; the Ministry profile says sand, normal depth.
    const k = documentedFeatures('komitsa-athos', ['pebble', 'shallowWater', 'parking', 'blue-flag']);
    expect(k).toContain('sandy');
    expect(k).toContain('blue-flag');
    expect(k).toContain('parking');
    expect(k).not.toContain('pebble');
    expect(k).not.toContain('shallowWater');
    // No profile, not on the Blue Flag list: physical tags dropped.
    expect(documentedFeatures('karidi-sithonia', ['sandy', 'blue-flag', 'free'])).toEqual(['free']);
    // Public slug of a renamed beach resolves too.
    expect(documentedFeatures('paralia-vergias-mainland', [])).toContain('blue-flag');
  });

  it('retires pages built only on unreliable tags and merges the Hanioti duplicate', async () => {
    const { resolveInternal, KEPT_FEATURES, MERGED_BEACHES } = await import('@/lib/seo/redirects');
    expect(KEPT_FEATURES).not.toContain('pebble');
    expect(resolveInternal('/beaches/feature/pebble')).toBe('/beaches');
    expect(resolveInternal('/best/snorkeling-spots')).toBe('/activities/sithonia-snorkeling-sithonia');
    expect(MERGED_BEACHES['paralia-chanioti-kassandra']).toBe('hanioti-kassandra');
    expect(resolveInternal('/beaches/paralia-chanioti-sithonia')).toBe('/beaches/hanioti-kassandra');
    // The grouped village-guide rule still sends each guide to its village.
    expect(resolveInternal('/blog/odigos-gia-siviri')).toBe('/places/siviri');
    expect(resolveInternal('/blog/odigos-gia-pyrgadikia-mainland')).toBe('/places/pyrgadikia');
  });
});

describe('accessibility comes only from the SEATRAC list', () => {
  it('maps the six Chalkidiki SEATRAC pages and drops the untraced tag', async () => {
    const { SEATRAC_BEACHES } = await import('@/content/beach-facts');
    const { SEATRAC_VILLAGES } = await import('@/content/village-facts');
    const { documentedFeatures } = await import('@/lib/content/beach-documented');
    expect(Object.keys(SEATRAC_VILLAGES).length).toBe(6);
    expect(SEATRAC_BEACHES['pefkochori-beach-kassandra']).toBe('kassandra-pefkohori');
    expect(documentedFeatures('pefkochori-beach-sithonia', [])).toContain('accessible');
    // A beach tagged "accessible" without a SEATRAC page is not called accessible.
    expect(documentedFeatures('nea-moudania-mainland', ['accessible', 'parking'])).toEqual(['blue-flag', 'parking']);
  });
});

describe('lifeguard facts come from the Sithonia study 16/2025 (ΑΔΑ ΨΠ6ΡΩ1Φ-ΚΗΟ)', () => {
  it('lists the eight matched busy beaches and the messages exist', async () => {
    const { LIFEGUARD_REQUIRED } = await import('@/content/beach-facts');
    for (const s of ['sarti-sithonia', 'toroni-beach-sithonia', 'armenistis-beach-sithonia', 'trani-ammouda-beach-sithonia'])
      expect(LIFEGUARD_REQUIRED.has(s)).toBe(true);
    expect(LIFEGUARD_REQUIRED.has('kalamitsi-nudist-beach-sithonia')).toBe(false);
    const { locales } = await import('@/i18n/config');
    for (const l of locales) {
      const beach = (await import(`../messages/v4/${l}.json`)).default.beach;
      for (const k of ['lifeguardLabel', 'lifeguardValue', 'faqLifeguardQ', 'faqLifeguardA']) expect(beach[k], `${l}.${k}`).toBeTruthy();
    }
  });
});

describe('phase 2: restaurants, activities and stays carry only checked facts', () => {
  it('uses official admission and hours for activities', async () => {
    const { ACTIVITY_FACTS, formatSeasons } = await import('@/content/activity-facts');
    expect(ACTIVITY_FACTS['ancient-olynthos'].price).toEqual({ full: 10, reduced: 5 });
    expect(ACTIVITY_FACTS['fisheries-museum'].price).toBeNull();
    const t = (k: string, v: Record<string, string>) => `${k}:${Object.values(v).join('/')}`;
    expect(formatSeasons(ACTIVITY_FACTS['ancient-olynthos'].hours, 'en', t)).toBe('HoursClosedOn:08:30–15:30/Tuesday');
    expect(formatSeasons(ACTIVITY_FACTS['petralona-cave'].hours, 'en', t)).toMatch(/^April–August: hoursDaily:08:00–20:00 · November–March: /);
  });

  it('calls a beach the nearest only when no mapped beach is clearly closer', async () => {
    const { isNearestBeach } = await import('@/lib/content/beach-coverage');
    // Sykia village: our table lacks Sykia beach, OSM has it much closer than 4 km.
    expect(isNearestBeach({ latitude: 40.0397, longitude: 23.9437 }, 4.2)).toBe(false);
    expect(isNearestBeach({ latitude: null, longitude: null }, 1)).toBe(false);
  });

  it('holds back distances for restaurants whose position is in doubt', async () => {
    const { COORDS_IN_DOUBT } = await import('@/content/restaurant-checks');
    // All six wrong positions were corrected in the database on 2026-11-23.
    expect(COORDS_IN_DOUBT.size).toBe(0);
    const { locales } = await import('@/i18n/config');
    for (const l of locales) {
      const m = (await import(`../messages/v4/${l}.json`)).default;
      for (const k of ['locationFacts', 'locationBeach', 'faqNearestBeachQ', 'faqNearestBeachA']) expect(m.food[k], `${l}.food.${k}`).toBeTruthy();
      for (const k of ['officialPrice', 'openingHours', 'faqOfficialHoursA']) expect(m.activity[k], `${l}.activity.${k}`).toBeTruthy();
      for (const k of ['areaTitle', 'areaVillage', 'areaCensus', 'areaBeach']) expect(m.stay[k], `${l}.stay.${k}`).toBeTruthy();
    }
  });
});

describe('retired restaurant rows', () => {
  it('redirects Meliton, which is a hotel, not a restaurant', async () => {
    const { resolveInternal, REMOVED_RESTAURANTS } = await import('@/lib/seo/redirects');
    expect(REMOVED_RESTAURANTS['meliton-porto-carras']).toBeTruthy();
    expect(resolveInternal('/restaurants/meliton-porto-carras')).toBe('/places/neos-marmaras/restaurants');
  });
});
