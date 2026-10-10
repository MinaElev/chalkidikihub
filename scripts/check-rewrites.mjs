#!/usr/bin/env node
/** Read-only. Word counts per locale for every rewrite; flags any under the venue minimum (MIN_WORDS.venue). */
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve('src/content/rewrites');
const MIN = Number(process.argv[2] || 55);
const LOCALES = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'];
// Same counting as lib/seo/quality.ts wordCount.
const wc = (s) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
let bad = 0, total = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const [slug, rw] of Object.entries(data)) {
    total++;
    const counts = LOCALES.map((l) => [l, rw[l] ? wc(rw[l]) : 0]);
    const low = counts.filter(([, n]) => n < MIN);
    if (low.length) { bad++; console.log(`${f} ${slug}: ${counts.map(([l, n]) => `${l}=${n}`).join(' ')}`); }
  }
}
console.log(`${total} rewrites, ${bad} with a locale under ${MIN} words`);
