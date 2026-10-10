#!/usr/bin/env node
/**
 * Copies the editorial rewrites (src/content/rewrites/<table>-<n>.json) into the
 * database, so the live v3 site and any other reader see the same text v4
 * already serves through its overlay. ROW_FIXES (names, coordinates) stay in
 * src/content/rewrites/index.ts and are not written here.
 *
 *   node scripts/apply-rewrites.mjs            # dry run: prints what would change
 *   node scripts/apply-rewrites.mjs --apply    # writes (needs explicit approval)
 *
 * Only description_<locale> (content_<locale> for blog_articles) is written;
 * nothing else on the row is touched. A JSON backup of every overwritten value
 * is saved to audit/rewrite-backup-<timestamp>.json before any write.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}
const APPLY = process.argv.includes('--apply');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const dir = path.join(ROOT, 'src/content/rewrites');
const byTable = {};
for (const file of fs.readdirSync(dir).filter((f) => /^[a-z_]+-\d+\.json$/.test(f))) {
  const table = file.replace(/-\d+\.json$/, '');
  Object.assign((byTable[table] ??= {}), JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
}

const backup = [];
const ops = [];
let changes = 0;
for (const [table, rows] of Object.entries(byTable)) {
  const field = table === 'blog_articles' ? 'content' : 'description';
  const slugs = Object.keys(rows);
  const cols = ['slug', ...new Set(Object.values(rows).flatMap((r) => Object.keys(r).map((l) => `${field}_${l}`)))];
  const { data, error } = await db.from(table).select(cols.join(',')).in('slug', slugs);
  if (error) throw new Error(`${table}: ${error.message}`);
  const current = Object.fromEntries(data.map((r) => [r.slug, r]));
  for (const [slug, rw] of Object.entries(rows)) {
    if (!current[slug]) { console.log(`  ! ${table}/${slug}: not in database, skipped`); continue; }
    const patch = {};
    for (const [l, text] of Object.entries(rw)) {
      if (text && current[slug][`${field}_${l}`] !== text) patch[`${field}_${l}`] = text;
    }
    const keys = Object.keys(patch);
    if (!keys.length) continue;
    changes += keys.length;
    backup.push({ table, slug, before: Object.fromEntries(keys.map((k) => [k, current[slug][k]])) });
    ops.push({ table, slug, patch });
    console.log(`${APPLY ? 'write' : 'would write'} ${table}/${slug}: ${keys.map((k) => k.replace(`${field}_`, '')).join(',')}`);
  }
}

if (APPLY && ops.length) {
  // Backup first, then write.
  const out = path.join(ROOT, `audit/rewrite-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(out, JSON.stringify(backup, null, 1));
  console.log(`backup: ${path.relative(ROOT, out)}`);
  for (const { table, slug, patch } of ops) {
    const { error: e } = await db.from(table).update(patch).eq('slug', slug);
    if (e) throw new Error(`${table}/${slug}: ${e.message}`);
  }
}
console.log(`${changes} field(s) ${APPLY ? 'written' : 'would change'}${APPLY ? '' : ' — dry run, nothing written (use --apply after approval)'}`);
