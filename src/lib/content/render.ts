import type { Locale } from '@/i18n/config';
import { localePath } from '@/lib/seo/site';

/**
 * Turns stored long-form text into safe HTML. The database holds three
 * formats side by side (HTML from the editor, markdown from v3's AI tools,
 * and plain text typed by owners), so we normalise all of them:
 *
 *   plain/markdown → HTML  →  allow-list sanitiser  →  locale-aware links
 *
 * The sanitiser is deliberately strict: only structural tags survive, every
 * attribute except href/src/alt/title is dropped, and javascript: URLs die.
 */

const ALLOWED = new Set([
  'p', 'br', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a',
  'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption', 'hr',
]);
const VOID = new Set(['br', 'img', 'hr']);

const escapeHtml = (s: string) =>
  s.replace(/&(?![a-z]+;|#\d+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function safeUrl(url: string): string | null {
  const u = url.trim();
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(u)) return u;
  return null;
}

/** Internal links stored as "/beaches/x" or "/en/beaches/x" → the current locale's path. */
function relocalise(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const stripped = href.replace(/^\/(en|de|ro|bg|sr|ru|el)(?=\/|$)/, '') || '/';
  return localePath(locale, stripped);
}

function sanitize(html: string, locale: Locale): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|form|svg|math)[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, rawTag: string, rawAttrs: string) => {
      const tag = rawTag.toLowerCase();
      const closing = full.startsWith('</');
      if (!ALLOWED.has(tag)) return '';
      if (closing) return VOID.has(tag) ? '' : `</${tag === 'b' ? 'strong' : tag === 'i' ? 'em' : tag}>`;
      const attrs: string[] = [];
      const re = /([a-z-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(rawAttrs))) {
        const name = m[1].toLowerCase();
        const value = m[3] ?? m[4] ?? m[5] ?? '';
        if (tag === 'a' && name === 'href') {
          const url = safeUrl(value);
          if (url) attrs.push(`href="${escapeAttr(relocalise(url, locale))}"`);
          if (url && /^https?:/i.test(url)) attrs.push('rel="noopener nofollow"', 'target="_blank"');
        } else if (tag === 'img' && (name === 'src' || name === 'alt')) {
          const v = name === 'src' ? safeUrl(value) : value;
          if (v != null) attrs.push(`${name}="${escapeAttr(v)}"`);
        } else if (name === 'title' || (name === 'colspan' && /^\d+$/.test(value))) {
          attrs.push(`${name}="${escapeAttr(value)}"`);
        }
      }
      if (tag === 'img') attrs.push('loading="lazy"', 'decoding="async"');
      const out = tag === 'b' ? 'strong' : tag === 'i' ? 'em' : tag;
      return `<${out}${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
    });
}

function inlineMarkdown(s: string): string {
  return escapeHtml(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
}

function markdownToHtml(text: string): string {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let para: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) out.push(`<p>${para.map(inlineMarkdown).join('<br>')}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.type}>${list.items.map((i) => `<li>${inlineMarkdown(i)}</li>`).join('')}</${list.type}>`);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushPara();
      flushList();
      // Body headings start at h2 — the page owns the only h1.
      const level = Math.min(Math.max(heading[1].length, 2), 4);
      out.push(`<h${level}>${inlineMarkdown(heading[2].replace(/\*\*/g, ''))}</h${level}>`);
      continue;
    }
    const bullet = /^(?:[-*•]|\d+[.)])\s+(.*)$/.exec(line);
    if (bullet) {
      flushPara();
      const type = /^\d/.test(line) ? 'ol' : 'ul';
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return out.join('\n');
}

const looksLikeHtml = (s: string) => /<(p|h[2-4]|ul|ol|div|br)\b/i.test(s);

/** Safe HTML for any stored long text. */
export function renderRichText(text: string | null | undefined, locale: Locale): string {
  if (!text?.trim()) return '';
  const html = looksLikeHtml(text) ? text.replace(/<h1(\s[^>]*)?>/gi, '<h2>').replace(/<\/h1>/gi, '</h2>') : markdownToHtml(text);
  return sanitize(html.replace(/<\/?div[^>]*>/gi, ''), locale);
}

/** Plain-text excerpt (for meta descriptions, cards). */
export function plainText(text: string | null | undefined, max = 160): string {
  if (!text) return '';
  const plain = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`]+/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  const sentence = cut.lastIndexOf('. ');
  return sentence > max * 0.55 ? cut.slice(0, sentence + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Extracts h2 headings for an on-page table of contents and adds ids. */
export function withHeadingIds(html: string): { html: string; toc: Array<{ id: string; text: string }> } {
  const toc: Array<{ id: string; text: string }> = [];
  const used = new Set<string>();
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id =
      text
        .toLowerCase()
        .normalize('NFKD')
        .replace(/\p{M}+/gu, '')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60) || `section-${toc.length + 1}`;
    while (used.has(id)) id += '-2';
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}
