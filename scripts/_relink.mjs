// Points internal links at merged blog articles straight to their new target.
// Writes changed article bodies into src/content/rewrites/blog_articles-1.json.
import fs from 'node:fs';
import path from 'node:path';
import { createJiti } from 'jiti';
import { createClient } from '@supabase/supabase-js';
for (const line of fs.readFileSync('C:/Users/mnc/ReWrite/.env.local', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(line.trim()); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const jiti = createJiti(import.meta.url, { alias: { '@': path.resolve('src') } });
const { BLOG_TO_PLACE, BLOG_MERGES } = await jiti.import(path.resolve('src/lib/seo/redirects.ts'));
const target = { ...Object.fromEntries(Object.entries(BLOG_TO_PLACE).map(([a, v]) => [a, `/places/${v}`])), ...BLOG_MERGES,
  'odigos-gia-afytos': '/places/afytos', 'odigos-gia-sikia': '/places/sikia', 'odigos-gia-pyrgadikia-mainland': '/places/pyrgadikia' };
const L = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'];
const ovPath = 'src/content/rewrites/blog_articles-1.json';
const ov = fs.existsSync(ovPath) ? JSON.parse(fs.readFileSync(ovPath, 'utf8')) : {};
const { data } = await db.from('blog_articles').select(['slug', ...L.map((l) => `content_${l}`)].join(','));
let changed = 0, links = 0;
for (const r of data) {
  if (target[r.slug]) continue; // the article itself is redirected
  for (const l of L) {
    const cur = ov[r.slug]?.[l] ?? r[`content_${l}`];
    if (!cur) continue;
    const next = cur.replace(/(href=["'(]|\]\()((?:\/(?:en|de|ro|bg|sr|ru))?)\/blog\/([a-z0-9-]+)(?=["')#?])/g, (m, pre, loc, slug) => {
      if (!target[slug]) return m;
      links++; return `${pre}${loc}${target[slug]}`;
    });
    if (next !== cur) { (ov[r.slug] ??= {})[l] = next; changed++; }
  }
}
fs.writeFileSync(ovPath, JSON.stringify(ov, null, 2) + '\n');
console.log(`${links} link(s) in ${changed} article body/ies updated`);
