import fs from 'node:fs';
import path from 'node:path';
import { createJiti } from 'jiti';
import { createClient } from '@supabase/supabase-js';
for (const line of fs.readFileSync('C:/Users/mnc/ReWrite/.env.local', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(line.trim()); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, ''); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const jiti = createJiti(import.meta.url, { alias: { '@': path.resolve('src') } });
const { PLACE_NAMES } = await jiti.import(path.resolve('src/lib/content/place-names.ts'));
const L = ['el', 'en', 'de', 'ro', 'bg', 'sr', 'ru'];
const { data } = await db.from('villages').select(['slug', ...L.map((l) => `name_${l}`)].join(','));
const APPLY = process.argv.includes('--apply');
const backup = []; let n = 0;
for (const r of data) {
  const pn = PLACE_NAMES[r.slug]; if (!pn) { console.log('  no canonical name for', r.slug); continue; }
  const patch = Object.fromEntries(L.filter((l) => r[`name_${l}`] !== pn[l]).map((l) => [`name_${l}`, pn[l]]));
  if (!Object.keys(patch).length) continue;
  n++; backup.push({ slug: r.slug, before: Object.fromEntries(Object.keys(patch).map((k) => [k, r[k]])) });
  console.log(r.slug, Object.entries(patch).map(([k, v]) => `${k.slice(5)}: ${r[k]} → ${v}`).join('; '));
  if (APPLY) { const { error } = await db.from('villages').update(patch).eq('slug', r.slug); if (error) throw error; }
}
if (APPLY) fs.writeFileSync(`audit/names-backup-${Date.now()}.json`, JSON.stringify(backup, null, 1));
console.log(n, 'villages', APPLY ? 'updated' : 'would change');
