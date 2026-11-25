import { describe, it, expect } from 'vitest';
import { classifySource, deviceFromUA, isBot, normalizePath, pageKind, PRIVATE_PATH, athensDay } from '@/lib/traffic';

describe('normalizePath', () => {
  it('splits the language prefix and strips query, hash, trailing slash', () => {
    expect(normalizePath('/en/listings/Amira-House/?x=1#top')).toEqual({ path: '/listings/amira-house', lang: 'en' });
    expect(normalizePath('/')).toEqual({ path: '/', lang: 'el' });
    expect(normalizePath('/de')).toEqual({ path: '/', lang: 'de' });
    expect(normalizePath('/beaches/%CE%BA')).toEqual({ path: '/beaches/κ', lang: 'el' });
  });
});

describe('classifySource', () => {
  const own = 'chalkidikihub.gr';
  it('names search engines, social, AI assistants', () => {
    expect(classifySource('https://www.google.gr/', own)).toBe('google');
    expect(classifySource('https://www.bing.com/search?q=x', own)).toBe('bing');
    expect(classifySource('https://l.facebook.com/l.php', own)).toBe('facebook');
    expect(classifySource('https://chatgpt.com/', own)).toBe('chatgpt');
    expect(classifySource('https://gemini.google.com/app', own)).toBe('gemini');
  });
  it('own site is internal, empty is direct, others are their host', () => {
    expect(classifySource('https://chalkidikihub.gr/beaches', own)).toBe('internal');
    expect(classifySource('https://www.chalkidikihub.gr/', own)).toBe('internal');
    expect(classifySource('', own)).toBe('direct');
    expect(classifySource('https://www.tripadvisor.com/x', own)).toBe('tripadvisor.com');
  });
  it('utm_source wins', () => {
    expect(classifySource('https://www.google.com/', own, 'Newsletter')).toBe('newsletter');
    expect(classifySource('', own, 'ig')).toBe('instagram');
  });
});

describe('device, bots, privacy', () => {
  it('device classes', () => {
    expect(deviceFromUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148')).toBe('mobile');
    expect(deviceFromUA('Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 Safari/537.36')).toBe('tablet');
    expect(deviceFromUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0')).toBe('desktop');
  });
  it('bots are dropped, real browsers are not', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true);
    expect(isBot('Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/120')).toBe(true);
    expect(isBot('')).toBe(true);
    expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36')).toBe(false);
  });
  it('private sections are never counted', () => {
    expect(PRIVATE_PATH.test('/admin/traffic')).toBe(true);
    expect(PRIVATE_PATH.test('/en/dashboard/billing')).toBe(true);
    expect(PRIVATE_PATH.test('/listings/x')).toBe(false);
    expect(PRIVATE_PATH.test('/beaches/requests-cove')).toBe(false);
  });
});

describe('misc', () => {
  it('page kinds', () => {
    expect(pageKind('/')).toBe('home');
    expect(pageKind('/listings/x')).toBe('listings');
    expect(pageKind('/beaches/karydi')).toBe('beaches');
    expect(pageKind('/terms')).toBe('other');
  });
  it('Athens day rolls over at Greek midnight', () => {
    expect(athensDay(new Date('2026-07-01T21:30:00Z'))).toBe('2026-07-02');
    expect(athensDay(new Date('2026-12-31T21:59:00Z'))).toBe('2026-12-31');
  });
});
