import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
for (const line of fs.readFileSync('C:/Users/mnc/ReWrite/.env.local', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(line.trim()); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const [table, slug, re] = process.argv.slice(2);
const L = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'];
const { data: [r] } = await db.from(table).select(L.map((l) => `description_${l}`).join(',')).eq('slug', slug);
const rx = new RegExp(re, 'i');
for (const l of L) { const t = r[`description_${l}`]; for (const s of t.split(/(?<=[.!?])\s+|<\/p>|<p>/)) if (rx.test(s)) console.log(l, '::', JSON.stringify(s)); }
