#!/usr/bin/env node
/**
 * Read-only. Builds a fact sheet per entity (structured data + real distances
 * + the current Greek text with its audit flags) for the editorial rewrite.
 *
 *   node scripts/fact-sheets.mjs restaurants > /tmp/restaurants.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const table = process.argv[2] || 'restaurants';

const km = (a, b) => {
  const r = Math.PI / 180, R = 6371;
  const dLat = (b.latitude - a.latitude) * r, dLng = (b.longitude - a.longitude) * r;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * r) * Math.cos(b.latitude * r) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)) * 10) / 10;
};
const ok = (p) => p.latitude != null && !(p.latitude === 0 && p.longitude === 0);

const [{ data: rows }, { data: villages }, { data: beaches }] = await Promise.all([
  db.from(table).select('*').order('slug'),
  db.from('villages').select('slug, name_el, name_en, area, latitude, longitude'),
  db.from('beaches').select('slug, name_el, name_en, latitude, longitude, features'),
]);

const audit = fs.existsSync(path.join(ROOT, 'audit/content-audit.csv'))
  ? fs.readFileSync(path.join(ROOT, 'audit/content-audit.csv'), 'utf8').split('\n').filter((l) => l.startsWith(table + ',') && l.includes(',el,'))
  : [];

const out = rows.map((r) => {
  const near = (list, n) => (ok(r) ? list.filter(ok).map((x) => ({ slug: x.slug, el: x.name_el, en: x.name_en, km: km(r, x) })).sort((a, b) => a.km - b.km).slice(0, n) : []);
  const keep = ['slug', 'area', 'cuisine', 'price_level', 'hours', 'phone', 'has_sea_view', 'has_live_music', 'accepts_reservations', 'rating', 'reviews_count', 'features', 'category', 'duration', 'price_range', 'founded', 'nation', 'rank', 'population'];
  const facts = Object.fromEntries(keep.filter((k) => k in r && r[k] !== null && r[k] !== '').map((k) => [k, r[k]]));
  return {
    ...facts,
    name_el: r.name_el,
    name_en: r.name_en,
    village: near(villages.filter((v) => v.slug !== 'pyrgadikia-mainland'), 1)[0] ?? null,
    nearest_beaches: table === 'beaches' ? near(beaches.filter((b) => b.slug !== r.slug), 3) : near(beaches, 3),
    audit: (audit.find((l) => l.split(',')[1] === r.slug) ?? '').split(',').slice(4).join(',').replace(/"/g, ''),
    current_el: (r.description_el || '').replace(/\s+/g, ' ').trim(),
  };
});
console.log(JSON.stringify(out, null, 1));
