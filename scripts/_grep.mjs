import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
for (const line of fs.readFileSync('C:/Users/mnc/ReWrite/.env.local', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(line.trim()); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const re = new RegExp(process.argv[2], 'gi');
for (const [t, f] of [['villages', 'description'], ['beaches', 'description'], ['restaurants', 'description'], ['activities', 'description'], ['blog_articles', 'content'], ['listings', 'description']]) {
  const cols = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'].map((l) => `${f}_${l}`);
  const { data } = await db.from(t).select(['slug', ...cols].join(','));
  for (const r of data) for (const c of cols) { const m = (r[c] || '').match(re); if (m) console.log(t, r.slug, c.slice(-2), m.length, '|', (r[c].match(new RegExp('.{0,50}' + process.argv[2] + '.{0,40}', 'i')) || [''])[0].replace(/\n/g, ' ')); }
}
