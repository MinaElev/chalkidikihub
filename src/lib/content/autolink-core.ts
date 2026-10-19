import type { Locale } from '@/i18n/config';
import { localePath } from '@/lib/seo/site';

export type Linkable = { forms: string[]; path: string };

const MAX_LINKS = 10;

/**
 * Lower case, no accents: "Κασσάνδρα", "ΚΑΣΣΑΝΔΡΑ" and "Κασσανδρα" compare
 * equal. Works one UTF-16 unit at a time and always returns one unit per
 * unit, so a position in the normalised text is the same position in the
 * original and the original spelling is what ends up inside the link.
 */
export function fold(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const f = c.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    out += f.length === 1 ? f : c;
  }
  return out.replace(/ς/g, 'σ');
}

/**
 * Greek case forms of a place name, so "της Νικήτης", "του Νέου Μαρμαρά" and
 * "της Κασσάνδρας" link like "Νικήτη". The endings are generated per word
 * on the folded name; a form that is not real Greek simply never occurs in
 * a text, so a wrong guess can cost a link but never makes one up.
 */
export function greekForms(folded: string): string[] {
  const words = folded.split(' ');
  const genitive = (w: string) => {
    if (w.endsWith('οσ')) return w.slice(0, -2) + 'ου';      // Νέος → Νέου, Άγιος → Αγίου
    if (w.endsWith('ασ')) return w.slice(0, -1);              // Μαρμαράς → Μαρμαρά
    if (w.endsWith('ησ')) return w.slice(0, -1);              // Παλιούρης → Παλιούρη
    if (w.endsWith('α') || w.endsWith('η')) return w + 'σ';   // Κασσάνδρα → Κασσάνδρας, Νικήτη → Νικήτης
    if (w.endsWith('ο')) return w.slice(0, -1) + 'ου';        // Λουτρό → Λουτρού
    if (w.endsWith('ι')) return w + 'ου';                     // Καρύδι → Καρυδιού, Πευκοχώρι → Πευκοχωρίου
    return w;
  };
  const accusative = (w: string) => (w.endsWith('οσ') ? w.slice(0, -1) : w.endsWith('ασ') || w.endsWith('ησ') ? w.slice(0, -1) : w);
  return [...new Set([folded, words.map(genitive).join(' '), words.map(accusative).join(' ')])];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Links the first mention of each known place in rendered HTML. It runs on
 * the server, so search engines see the links (v3 added them in the browser,
 * pointing at /el/... URLs that redirect).
 *
 * Matching is by whole name, never part of a word: one regular expression
 * holds every name form (longest first, so "Νέα Μουδανιά" wins over
 * "Μουδανιά"), with letter boundaries on both sides, and runs once over each
 * text segment. Accents and letter case may differ, but the match must begin
 * with a capital letter, as a proper noun does. Text inside links and headings is left alone, the page never
 * links to itself, places the text already links to are skipped, and at most
 * ten links are added so the copy stays readable.
 */
export function autoLink(html: string, items: Linkable[], locale: Locale, selfPath: string): string {
  if (!html || !items.length) return html;
  const already = new Set([...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]));
  const self = localePath(locale, selfPath);
  const pathOf = new Map<string, string>();
  for (const i of items) for (const f of i.forms) pathOf.set(f, localePath(locale, i.path));
  const forms = [...pathOf.keys()].sort((a, b) => b.length - a.length).map(escape);
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:${forms.join('|')})(?![\\p{L}\\p{N}])`, 'gu');
  const used = new Set<string>();
  let added = 0;
  let skipDepth = 0;
  return html
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (part.startsWith('<')) {
        if (/^<(a|h[1-6])[\s>]/i.test(part)) skipDepth++;
        else if (/^<\/(a|h[1-6])>/i.test(part)) skipDepth = Math.max(0, skipDepth - 1);
        return part;
      }
      if (skipDepth || added >= MAX_LINKS) return part;
      const folded = fold(part);
      let out = '';
      let last = 0;
      for (const m of folded.matchAll(re)) {
        // Place names are proper nouns: the text must start the match with a
        // capital ("Γαλήνη" the beach, not "γαλήνη" the calm sea).
        const first = part[m.index!];
        if (first === first.toLowerCase()) continue;
        const href = pathOf.get(m[0]);
        if (!href || href === self || already.has(href) || used.has(href) || added >= MAX_LINKS) continue;
        const start = m.index!;
        const end = start + m[0].length;
        out += part.slice(last, start) + `<a href="${href}">${part.slice(start, end)}</a>`;
        last = end;
        used.add(href);
        added++;
      }
      return out + part.slice(last);
    })
    .join('');
}

