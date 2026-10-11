// Sentence-level patches to rewrite overlay files. Usage: node scripts/_patch.mjs <table> <patches.json>
// patches.json: [{ slug, l, from, to }]  — text taken from overlay if present, else DB; `from` must occur exactly once.
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
for (const line of fs.readFileSync('C:/Users/mnc/ReWrite/.env.local', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(line.trim()); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const [table, file] = process.argv.slice(2);
const field = table === 'blog_articles' ? 'content' : 'description';
const ovPath = `C:/Users/mnc/ReWrite/src/content/rewrites/${table}-1.json`;
const ov = JSON.parse(fs.readFileSync(ovPath, 'utf8'));
const patches = JSON.parse(fs.readFileSync(file, 'utf8'));
const slugs = [...new Set(patches.map((p) => p.slug))];
const { data } = await db.from(table).select(['slug', ...['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'].map((l) => `${field}_${l}`)].join(',')).in('slug', slugs);
const dbBy = Object.fromEntries(data.map((r) => [r.slug, r]));
let n = 0;
for (const { slug, l, from, to, re } of patches) {
  const cur = ov[slug]?.[l] ?? dbBy[slug]?.[`${field}_${l}`];
  if (!cur) throw new Error(`no text ${slug}/${l}`);
  if (re) {
    const rx = new RegExp(re, 'u');
    if (!rx.test(cur)) throw new Error(`${slug}/${l}: /${re}/ not found`);
    (ov[slug] ??= {})[l] = cur.replace(rx, to);
  } else {
    const count = cur.split(from).length - 1;
    if (count !== 1) throw new Error(`${slug}/${l}: "${from.slice(0, 60)}" found ${count}x`);
    (ov[slug] ??= {})[l] = cur.replace(from, to);
  }
  n++;
}
fs.writeFileSync(ovPath, JSON.stringify(ov, null, 2) + '\n');
console.log(`${n} patch(es) applied to ${table}-1.json`);
