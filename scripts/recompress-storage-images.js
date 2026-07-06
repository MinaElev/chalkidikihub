// Re-encode oversized / PNG images in the Supabase `content-images` bucket to
// WebP, overwriting each object IN PLACE (same key) so no image_url in the
// database ever changes — zero risk of broken references across the dozen
// tables that store image URLs.
//
// Why this exists: next/image optimization is disabled (unoptimized:true), so
// whatever is stored is served byte-for-byte to visitors. Two sources bypassed
// the WebP compressor and left heavy files behind:
//   • DALL-E AI images  → raw 1.5-3 MB PNG
//   • beach photos       → raw ~1080px Unsplash JPEG
// This script fixes the ones already uploaded. (The upload paths themselves are
// fixed in ai-image/route.ts + the two assign-beach-*.js scripts.)
//
// Strategy: download each image, re-encode to WebP (max 1600px, q72). Only
// overwrite when it saves at least MIN_SAVING; already-lean WebP files are left
// untouched. The .png/.jpg extension stays (cosmetic) — browsers render by the
// Content-Type header, which we set to image/webp.
//
// Usage:
//   node scripts/recompress-storage-images.js                 # dry-run report
//   node scripts/recompress-storage-images.js --commit        # apply
//   node scripts/recompress-storage-images.js --commit --limit 50
//   node scripts/recompress-storage-images.js --prefix beaches # one folder only

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const p = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const BUCKET = 'content-images';
const DRY = !process.argv.includes('--commit');
const MAX_W = 1600;
const MAX_H = 1600;
const QUALITY = 72;
const MIN_SAVING = 0.10; // skip unless we shave at least 10% off

const LIMIT = (() => {
  const i = process.argv.indexOf('--limit');
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : Infinity;
})();
const PREFIX = (() => {
  const i = process.argv.indexOf('--prefix');
  return i >= 0 ? process.argv[i + 1].replace(/\/$/, '') : '';
})();

const supabase = createClient(SUPABASE_URL, KEY, { auth: { persistSession: false } });

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const isImagePath = (p) => /\.(png|jpe?g|webp)$/i.test(p);

// Recursively list every object under a prefix. Folder entries come back with
// id === null and must be descended into.
async function listAll(prefix) {
  const out = [];
  let offset = 0;
  const pageSize = 100;
  for (;;) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit: pageSize, offset, sortBy: { column: 'name', order: 'asc' } });
    if (error) throw new Error(`list ${prefix}: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const entry of data) {
      const full = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) {
        out.push(...(await listAll(full)));
      } else {
        out.push({ path: full, size: entry.metadata?.size ?? null });
      }
    }
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return out;
}

async function main() {
  console.log(`${DRY ? '[DRY-RUN] ' : ''}Scanning bucket "${BUCKET}"${PREFIX ? ` under "${PREFIX}/"` : ''}...`);
  const files = (await listAll(PREFIX)).filter((f) => isImagePath(f.path));
  console.log(`Found ${files.length} image objects.\n`);

  let processed = 0, skipped = 0, failed = 0;
  let totalBefore = 0, totalAfter = 0;

  for (const f of files) {
    if (processed >= LIMIT) break;
    try {
      const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(f.path);
      if (dlErr || !blob) { console.warn(`  ✗ download ${f.path}: ${dlErr?.message || 'no data'}`); failed++; continue; }
      const input = Buffer.from(await blob.arrayBuffer());

      const meta = await sharp(input).metadata();
      let pipeline = sharp(input).rotate();
      if ((meta.width || 0) > MAX_W || (meta.height || 0) > MAX_H) {
        pipeline = pipeline.resize({ width: MAX_W, height: MAX_H, fit: 'inside', withoutEnlargement: true });
      }
      const output = await pipeline.webp({ quality: QUALITY }).toBuffer();

      const before = input.length, after = output.length;
      if (after >= before * (1 - MIN_SAVING)) {
        skipped++;
        continue; // already lean enough
      }

      const pct = Math.round((1 - after / before) * 100);
      console.log(`  ${DRY ? '•' : '✓'} ${f.path.padEnd(50)} ${kb(before)} → ${kb(after)}  -${pct}%`);
      processed++; totalBefore += before; totalAfter += after;

      if (!DRY) {
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(f.path, output, { contentType: 'image/webp', cacheControl: '31536000', upsert: true });
        if (upErr) { console.warn(`    ✗ upload ${f.path}: ${upErr.message}`); failed++; processed--; totalBefore -= before; totalAfter -= after; }
      }
    } catch (e) {
      console.warn(`  ✗ ${f.path}: ${e.message}`);
      failed++;
    }
  }

  console.log('\n──────────────────────────────────────────');
  console.log(`${DRY ? 'Would re-encode' : 'Re-encoded'}: ${processed}`);
  console.log(`Left untouched (already lean): ${skipped}`);
  console.log(`Failed: ${failed}`);
  if (processed > 0) {
    console.log(`Payload: ${kb(totalBefore)} → ${kb(totalAfter)}  (saved ${kb(totalBefore - totalAfter)}, -${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
  }
  if (DRY) console.log('\nDry-run only. Re-run with --commit to apply.');
}

main().catch((e) => { console.error(e); process.exit(1); });
