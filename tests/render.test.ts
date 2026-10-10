import { describe, expect, it } from 'vitest';
import { plainText, renderRichText, withHeadingIds } from '@/lib/content/render';

describe('renderRichText — sanitiser', () => {
  it('drops scripts, event handlers and javascript: URLs', () => {
    const out = renderRichText(
      '<p onclick="x()">Hi<script>alert(1)</script> <a href="javascript:alert(1)">bad</a> <img src=x onerror=alert(1)></p>',
      'el',
    );
    expect(out).not.toMatch(/script|onclick|onerror|javascript:/i);
    expect(out).toContain('<p>Hi');
  });

  it('keeps allowed structure and demotes h1 to h2', () => {
    const out = renderRichText('<h1>T</h1><p><strong>a</strong> <b>b</b></p><div><ul><li>x</li></ul></div>', 'el');
    expect(out).toBe('<h2>T</h2><p><strong>a</strong> <strong>b</strong></p><ul><li>x</li></ul>');
  });

  it('relocalises internal links and marks external ones', () => {
    const out = renderRichText('<p><a href="/en/beaches/sani">Sani</a> <a href="https://x.com">x</a></p>', 'de');
    expect(out).toContain('href="/de/beaches/sani"');
    expect(out).toContain('rel="noopener nofollow"');
    expect(renderRichText('<p><a href="/en/beaches/sani">S</a></p>', 'el')).toContain('href="/beaches/sani"');
  });
});

describe('renderRichText — markdown and plain text', () => {
  it('converts markdown headings, bold and lists', () => {
    const out = renderRichText('## Title\n\nSome **bold** text.\n\n- one\n- two', 'en');
    expect(out).toBe('<h2>Title</h2>\n<p>Some <strong>bold</strong> text.</p>\n<ul><li>one</li><li>two</li></ul>');
  });

  it('turns blank-line separated text into paragraphs and escapes HTML', () => {
    expect(renderRichText('a < b\n\nsecond', 'en')).toBe('<p>a &lt; b</p>\n<p>second</p>');
  });
});

describe('helpers', () => {
  it('plainText strips markup and cuts on a word/sentence boundary', () => {
    expect(plainText('<p>Hello <b>world</b></p>')).toBe('Hello world');
    const long = 'Word '.repeat(60);
    expect(plainText(long, 40).length).toBeLessThanOrEqual(41);
  });

  it('withHeadingIds builds a unique table of contents', () => {
    const { html, toc } = withHeadingIds('<h2>Παραλίες</h2><h2>Παραλίες</h2>');
    expect(toc.map((t) => t.id)).toEqual(['παραλιες', 'παραλιες-2']);
    expect(html).toContain('id="παραλιες-2"');
  });
});

import { brandName, greekToLatin } from '@/lib/content/translit';

describe('brand names', () => {
  it('transliterates Greek business names instead of translating them', () => {
    expect(brandName('Τζίτζικας', 'en')).toBe('Tzitzikas');
    expect(brandName('Το Ελληνικόν', 'de')).toBe('To Ellinikon');
    expect(brandName('5 Βηματα στην Αμμο', 'ru')).toBe('5 Vimata stin Ammo');
    expect(brandName('Mr Coffee Polygyros', 'de')).toBe('Mr Coffee Polygyros');
    expect(brandName('Τζίτζικας', 'el')).toBe('Τζίτζικας');
  });
  it('handles ευ/αυ and ου', () => {
    expect(greekToLatin('Ευαγγελία')).toBe('Evangelia');
    expect(greekToLatin('Βουρβουρού')).toBe('Vourvourou');
    expect(greekToLatin('Ναύπακτος')).toBe('Nafpaktos');
  });
});
