#!/usr/bin/env node
/**
 * Writes ROW_FIXES (src/content/rewrites/index.ts: corrected names,
 * coordinates, monastery highlights) into the database.
 *
 *   node scripts/apply-row-fixes.mjs            # dry run
 *   node scripts/apply-row-fixes.mjs --apply    # writes; backup to audit/ first
 */
import fs from 'node:fs';
import path from 'node:path';
import { createJiti } from 'jiti';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}
const APPLY = process.argv.includes('--apply');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } });
const { ROW_FIXES } = await jiti.import(path.join(ROOT, 'src/content/rewrites/index.ts'));

const backup = [];
const ops = [];
for (const [table, rows] of Object.entries(ROW_FIXES)) {
  const cols = ['slug', ...new Set(Object.values(rows).flatMap((r) => Object.keys(r)))];
  const { data, error } = await db.from(table).select(cols.join(',')).in('slug', Object.keys(rows));
  if (error) throw new Error(`${table}: ${error.message}`);
  const current = Object.fromEntries(data.map((r) => [r.slug, r]));
  for (const [slug, fix] of Object.entries(rows)) {
    if (!current[slug]) { console.log(`  ! ${table}/${slug}: not in database, skipped`); continue; }
    const patch = Object.fromEntries(Object.entries(fix).filter(([k, v]) => current[slug][k] !== v));
    if (!Object.keys(patch).length) continue;
    backup.push({ table, slug, before: Object.fromEntries(Object.keys(patch).map((k) => [k, current[slug][k]])) });
    ops.push({ table, slug, patch });
    console.log(`${APPLY ? 'write' : 'would write'} ${table}/${slug}: ${Object.entries(patch).map(([k, v]) => `${k}=${String(v).slice(0, 40)}`).join('; ')}`);
  }
}
if (APPLY && ops.length) {
  const out = path.join(ROOT, `audit/rowfix-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(out, JSON.stringify(backup, null, 1));
  console.log(`backup: ${path.relative(ROOT, out)}`);
  for (const { table, slug, patch } of ops) {
    const { error } = await db.from(table).update(patch).eq('slug', slug);
    if (error) throw new Error(`${table}/${slug}: ${error.message}`);
  }
}
console.log(`${ops.length} row(s) ${APPLY ? 'written' : 'would change'}`);
