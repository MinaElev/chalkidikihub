import { describe, expect, it } from 'vitest';
import { assessQuality, wordCount } from '@/lib/seo/quality';
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
    expect(find('/beaches/area/sithonia')?.destination).toBe('/areas/sithonia');
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
});
