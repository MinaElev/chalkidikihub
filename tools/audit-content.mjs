// One-off content quality audit for /guide, /faq, /best, /places.
// Loads each data file by stripping TS syntax → eval → counts visible words
// per slug per locale. Run: node tools/audit-content.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function stripHtml(s) {
  if (!s) return '';
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(s) {
  if (!s) return 0;
  return stripHtml(s).split(/\s+/).filter(Boolean).length;
}

function loadDataArray(filePath, arrayName) {
  const text = fs.readFileSync(filePath, 'utf8');
  // Find: `export const ARRAY_NAME ... = [ ... ];`  → slice out the literal.
  const re = new RegExp(`export\\s+const\\s+${arrayName}\\b[^=]*=\\s*\\[`);
  const m = text.match(re);
  if (!m) throw new Error(`array ${arrayName} not found in ${filePath}`);
  // Scan from the `[` to its matching `]` (counts brackets, ignoring strings).
  let i = m.index + m[0].length - 1; // position of `[`
  let depth = 0, end = -1;
  let inStr = false, q = '';
  while (i < text.length) {
    const c = text[i];
    if (inStr) {
      if (c === '\\') { i += 2; continue; }
      if (c === q) { inStr = false; }
    } else {
      if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; }
      else if (c === '[') depth++;
      else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
    }
    i++;
  }
  if (end < 0) throw new Error(`unterminated array`);
  const literal = text.slice(m.index + m[0].length - 1, end + 1);
  // Eval just the literal — pure JS, no TS types inside object values.
  return Function(`"use strict"; return ${literal};`)();
}

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];
const THRESHOLDS = { thin: 150, ok: 300 }; // words

function bucket(wordCount) {
  if (wordCount < THRESHOLDS.thin) return 'thin';
  if (wordCount < THRESHOLDS.ok) return 'ok';
  return 'good';
}

const results = []; // { route, slug, locale, words, bucket }

// ── /guide ──────────────────────────────────────────────
{
  const guides = loadDataArray(
    path.join(ROOT, 'src/app/[locale]/guide/[slug]/guide-data.ts'),
    'GUIDES',
  );
  for (const g of guides) {
    for (const locale of LOCALES) {
      const html = g.content?.[locale] || '';
      const w = words(html);
      results.push({ route: '/guide', slug: g.slug, locale, words: w, bucket: bucket(w) });
    }
  }
}

// ── /faq ────────────────────────────────────────────────
{
  const faqs = loadDataArray(
    path.join(ROOT, 'src/app/[locale]/faq/[slug]/faq-data.ts'),
    'FAQ_PAGES',
  );
  for (const page of faqs) {
    for (const locale of LOCALES) {
      // FAQ word count = sum of (question + answer) for all entries
      let total = 0;
      for (const entry of (page.faqs || [])) {
        total += words(entry.question?.[locale]);
        total += words(entry.answer?.[locale]);
      }
      results.push({ route: '/faq', slug: page.slug, locale, words: total, bucket: bucket(total) });
    }
  }
}

// ── /best — no inline content (relies on dynamic list from API).
// Skip — quality is governed by upstream beaches/restaurants/activities content.

// ── /places — content is in DB (villages.description_<locale>). Skipped in
// this script; needs a separate query. Run from /admin/seo-health for live check.

// ── Output ──────────────────────────────────────────────
const thin = results.filter((r) => r.bucket === 'thin').sort((a, b) => a.words - b.words);
const ok = results.filter((r) => r.bucket === 'ok').sort((a, b) => a.words - b.words);
const good = results.filter((r) => r.bucket === 'good');

const summary = {};
for (const r of results) {
  const key = `${r.route} ${r.locale}`;
  summary[key] = summary[key] || { thin: 0, ok: 0, good: 0, total: 0 };
  summary[key][r.bucket]++;
  summary[key].total++;
}

console.log('\n=== SUMMARY (per route × locale) ===');
console.log('route/locale            thin   ok  good  total');
for (const key of Object.keys(summary).sort()) {
  const s = summary[key];
  console.log(
    `${key.padEnd(22)} ${String(s.thin).padStart(4)}  ${String(s.ok).padStart(3)}  ${String(s.good).padStart(4)}  ${String(s.total).padStart(5)}`,
  );
}

console.log(`\n=== THIN ENTRIES (<${THRESHOLDS.thin} words) — ${thin.length} total ===\n`);
for (const r of thin) {
  console.log(`${String(r.words).padStart(4)} words  ${r.route}/${r.slug.padEnd(35)} [${r.locale}]`);
}

console.log(`\n=== OK ENTRIES (${THRESHOLDS.thin}-${THRESHOLDS.ok - 1} words) — ${ok.length} total ===\n`);
for (const r of ok.slice(0, 30)) {
  console.log(`${String(r.words).padStart(4)} words  ${r.route}/${r.slug.padEnd(35)} [${r.locale}]`);
}
if (ok.length > 30) console.log(`... ${ok.length - 30} more`);

console.log(`\n=== STATS ===`);
console.log(`Total entries: ${results.length}`);
console.log(`Thin (<${THRESHOLDS.thin}):  ${thin.length}  (${((thin.length / results.length) * 100).toFixed(1)}%)`);
console.log(`OK (${THRESHOLDS.thin}-${THRESHOLDS.ok - 1}): ${ok.length}  (${((ok.length / results.length) * 100).toFixed(1)}%)`);
console.log(`Good (≥${THRESHOLDS.ok}):  ${good.length}  (${((good.length / results.length) * 100).toFixed(1)}%)`);
