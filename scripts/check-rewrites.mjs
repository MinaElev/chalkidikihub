#!/usr/bin/env node
/** Read-only. Word counts per locale for every rewrite; flags any under its quality-gate minimum. */
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve('src/content/rewrites');
// Same minimums as lib/seo/quality.ts: venue (restaurants) 55, detail pages 120.
const MIN_FOR = { restaurants: 55 };
const minFor = (file) => MIN_FOR[file.replace(/-\d+\.json$/, '')] ?? 120;
const LOCALES = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'];
// Same counting as lib/seo/quality.ts wordCount.
const wc = (s) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
let bad = 0, total = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const [slug, rw] of Object.entries(data)) {
    total++;
    // Partial rewrites (e.g. translations of a few locales) are checked only where present.
    const counts = LOCALES.filter((l) => rw[l]).map((l) => [l, wc(rw[l])]);
    const MIN = minFor(f);
    const low = counts.filter(([, n]) => n < MIN);
    if (low.length) { bad++; console.log(`${f} ${slug}: ${counts.map(([l, n]) => `${l}=${n}`).join(' ')}`); }
  }
}
console.log(`${total} rewrites, ${bad} with a locale under the minimum`);
