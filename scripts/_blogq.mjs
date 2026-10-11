import fs from 'node:fs';
import path from 'node:path';
import { createJiti } from 'jiti';
import { createClient } from '@supabase/supabase-js';
for (const line of fs.readFileSync('C:/Users/mnc/ReWrite/.env.local', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(line.trim()); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const jiti = createJiti(import.meta.url, { alias: { '@': path.resolve('src') } });
const { BLOG_TO_PLACE, BLOG_MERGES } = await jiti.import(path.resolve('src/lib/seo/redirects.ts'));
const L = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'];
const { data } = await db.from('blog_articles').select(['slug', 'published_at', ...L.map((l) => `content_${l}`)].join(','));
const h = (t) => ((t || '').match(/<h2|^## /gm) || []).length;
const w = (t) => (t || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
let rows = data.filter((r) => !BLOG_TO_PLACE[r.slug] && !BLOG_MERGES[r.slug] && r.published_at);
console.log('remaining published', rows.length);
const out = [];
for (const r of rows) {
  const en = h(r.content_en);
  const diff = ['de', 'ro', 'bg', 'sr', 'ru'].filter((l) => Math.abs(h(r[`content_${l}`]) - en) > 1);
  out.push(`${r.slug.padEnd(48)} h2 el:${h(r.content_el)} en:${en} ${['de','ro','bg','sr','ru'].map((l)=>l+':'+h(r[`content_${l}`])).join(' ')} | w ${L.map((l)=>w(r[`content_${l}`])).join('/')} ${diff.length ? 'STRUCT≠ ' + diff.join(',') : ''}`);
}
console.log(out.join('\n'));
