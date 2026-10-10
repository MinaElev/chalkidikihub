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
