import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
for (const line of fs.readFileSync('C:/Users/mnc/ReWrite/.env.local', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(line.trim()); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const [slug, re, langs = 'el,en,de,ro,bg,sr,ru'] = process.argv.slice(2);
const L = langs.split(',');
const { data: [r] } = await db.from('blog_articles').select(L.map((l) => `content_${l}`).join(',')).eq('slug', slug);
const rx = new RegExp(re, 'i');
for (const l of L) { for (const s of (r[`content_${l}`] || '').split(/(?<=[.!?])\s+|<\/p>|<p>|<li>|<\/li>/)) if (rx.test(s)) console.log(l, '::', JSON.stringify(s.trim())); }
