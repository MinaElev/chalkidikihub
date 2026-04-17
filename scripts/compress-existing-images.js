#!/usr/bin/env node
/**
 * Retroactively compress existing images in Supabase Storage.
 *
 * Scans listing_images and sale_images tables, downloads each referenced
 * file from Storage, compresses it with sharp (same strategy as the
 * browser client: resize to 1600x1200 max, WebP, iterative quality
 * reduction until ≤ target KB), and re-uploads in place.
 *
 * USAGE:
 *   # Dry-run (report only, no changes)
 *   node scripts/compress-existing-images.js --dry-run
 *
 *   # Actually compress
 *   node scripts/compress-existing-images.js
 *
 *   # Only one table
 *   node scripts/compress-existing-images.js --table=listing_images
 *   node scripts/compress-existing-images.js --table=sale_images
 *
 *   # Tune target size (default 200)
 *   node scripts/compress-existing-images.js --target-kb=150
 *
 *   # Skip files smaller than threshold (default 220 KB)
 *   node scripts/compress-existing-images.js --skip-below-kb=220
 *
 *   # Limit how many images to process (handy for testing)
 *   node scripts/compress-existing-images.js --limit=10
 *
 * REQUIRES:
 *   Env var SUPABASE_SERVICE_ROLE_KEY set in .env.local or shell.
 *   (Get it from Supabase Dashboard → Project Settings → API → service_role key)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ─── Load .env.local ──────────────────────────────────────────────────────
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    });
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing env vars.');
  console.error('   SUPABASE_URL:       ', SUPABASE_URL ? 'ok' : 'MISSING');
  console.error('   SERVICE_ROLE_KEY:   ', SERVICE_KEY ? 'ok' : 'MISSING');
  console.error('');
  console.error('   Add SUPABASE_SERVICE_ROLE_KEY to .env.local');
  console.error('   (Supabase Dashboard → Project Settings → API → service_role key)');
  process.exit(1);
}

// ─── Parse args ───────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    if (!a.startsWith('--')) return [a, true];
    const [k, v] = a.slice(2).split('=');
    return [k, v === undefined ? true : v];
  })
);

const DRY_RUN = args['dry-run'] === true;
const TABLE_FILTER = args.table; // undefined = all
const TARGET_KB = Number(args['target-kb'] || 200);
const SKIP_BELOW_KB = Number(args['skip-below-kb'] || 220);
const LIMIT = args.limit ? Number(args.limit) : null;

const TARGET_BYTES = TARGET_KB * 1024;
const SKIP_BELOW_BYTES = SKIP_BELOW_KB * 1024;

// ─── Sources to scan ──────────────────────────────────────────────────────
// Bucket is parsed from the URL at runtime — no need to hardcode here.
const SOURCES = [
  { table: 'listing_images' },
  { table: 'sale_images' },
].filter(s => !TABLE_FILTER || s.table === TABLE_FILTER);

if (SOURCES.length === 0) {
  console.error(`❌ Unknown --table: ${TABLE_FILTER}`);
  process.exit(1);
}

// ─── Supabase REST helpers (no SDK import to keep deps minimal) ──────────
function supaHeaders() {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  };
}

async function fetchJson(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { ...supaHeaders(), 'Content-Type': 'application/json', ...init.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}

async function selectAll(table) {
  // Pagination — Supabase REST max 1000 rows per request
  const rows = [];
  let from = 0;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=id,image_url&image_url=not.is.null`;
    const res = await fetch(url, {
      headers: { ...supaHeaders(), Range: `${from}-${from + 999}`, Prefer: 'count=exact' },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const chunk = await res.json();
    rows.push(...chunk);
    if (chunk.length < 1000) break;
    from += 1000;
  }
  return rows;
}

async function updateUrl(table, id, newUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...supaHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: newUrl }),
  });
  if (!res.ok) throw new Error(`PATCH ${table}:${id} → ${res.status}: ${await res.text()}`);
}

// ─── Storage helpers ─────────────────────────────────────────────────────
function parseStorageUrl(url) {
  // Accept any of:
  //   /storage/v1/object/public/BUCKET/PATH
  //   /storage/v1/render/image/public/BUCKET/PATH?query
  //   /storage/v1/object/sign/BUCKET/PATH?token=...
  // Returns { bucket, path } or null if it isn't a Supabase Storage URL.
  if (!url || !url.startsWith(SUPABASE_URL)) return null;

  const patterns = [
    /\/storage\/v1\/object\/public\/([^/]+)\/(.+?)(?:\?|$)/,
    /\/storage\/v1\/render\/image\/public\/([^/]+)\/(.+?)(?:\?|$)/,
    /\/storage\/v1\/object\/sign\/([^/]+)\/(.+?)(?:\?|$)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return { bucket: m[1], path: decodeURIComponent(m[2]) };
  }
  return null;
}

async function downloadStorage(bucket, path) {
  const url = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${bucket}/${path}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadStorage(bucket, path, buffer, contentType) {
  const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...supaHeaders(),
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: buffer,
  });
  if (!res.ok) throw new Error(`upload ${bucket}/${path}: ${res.status}: ${await res.text()}`);
}

function publicUrl(bucket, path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

// ─── Compression using sharp ─────────────────────────────────────────────
async function compressBuffer(input) {
  // Strategy: resize to fit 1600×1200, encode WebP starting at quality 62,
  // step down by 7 until we're ≤ TARGET_BYTES or quality ≤ 40.
  let quality = 62;
  const minQuality = 40;
  let out;

  while (true) {
    out = await sharp(input, { failOn: 'none' })
      .rotate() // respect EXIF orientation
      .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer();
    if (out.length <= TARGET_BYTES || quality <= minQuality) break;
    quality = Math.max(minQuality, quality - 7);
  }

  return out;
}

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Main ─────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n🗜️  Retroactive image compressor');
  console.log('   Dry run:   ', DRY_RUN ? 'YES (no changes)' : 'NO (writing)');
  console.log('   Target:    ', `${TARGET_KB} KB`);
  console.log('   Skip below:', `${SKIP_BELOW_KB} KB`);
  console.log('   Sources:   ', SOURCES.map(s => s.table).join(', '));
  if (LIMIT) console.log('   Limit:     ', LIMIT);
  console.log('');

  let grandTotal = 0, grandProcessed = 0, grandSkipped = 0, grandErrors = 0;
  let grandBytesBefore = 0, grandBytesAfter = 0;

  for (const src of SOURCES) {
    console.log(`\n── ${src.table} ────────────────────────────────────`);
    const rows = await selectAll(src.table);
    console.log(`   Found ${rows.length} rows`);

    let count = 0;
    const toProcess = LIMIT ? rows.slice(0, LIMIT) : rows;

    for (const row of toProcess) {
      count++;
      grandTotal++;
      const progress = `[${count}/${toProcess.length}]`;

      const parsed = parseStorageUrl(row.image_url);
      if (!parsed) {
        console.log(`${progress} ⏭️  non-Storage URL, skipping: ${row.image_url.slice(0, 80)}…`);
        grandSkipped++;
        continue;
      }
      const { bucket, path: storagePath } = parsed;

      try {
        const before = await downloadStorage(bucket, storagePath);
        grandBytesBefore += before.length;

        if (before.length <= SKIP_BELOW_BYTES) {
          console.log(`${progress} ✓ already small (${fmtBytes(before.length)}): ${bucket}/${storagePath}`);
          grandSkipped++;
          grandBytesAfter += before.length;
          continue;
        }

        const after = await compressBuffer(before);

        // If compression didn't help, keep the original
        if (after.length >= before.length) {
          console.log(`${progress} ⚠ no gain (${fmtBytes(before.length)} → ${fmtBytes(after.length)}): ${bucket}/${storagePath}`);
          grandSkipped++;
          grandBytesAfter += before.length;
          continue;
        }

        const savedPct = ((1 - after.length / before.length) * 100).toFixed(0);
        console.log(`${progress} 🗜 ${fmtBytes(before.length)} → ${fmtBytes(after.length)}  (-${savedPct}%)  ${bucket}/${storagePath}`);

        if (!DRY_RUN) {
          // Overwrite in place so the existing public URL keeps working.
          // Content-Type is set to image/webp regardless of the file
          // extension — browsers sniff the bytes anyway.
          await uploadStorage(bucket, storagePath, after, 'image/webp');
        }

        grandBytesAfter += after.length;
        grandProcessed++;
      } catch (err) {
        console.log(`${progress} ❌ ${bucket}/${storagePath}: ${err.message}`);
        grandErrors++;
      }
    }
  }

  // ─── Summary ───────────────────────────────────────────────────────────
  const saved = grandBytesBefore - grandBytesAfter;
  const savedPct = grandBytesBefore ? ((saved / grandBytesBefore) * 100).toFixed(1) : '0';

  console.log('\n═══ Summary ═══');
  console.log(`  Total rows scanned: ${grandTotal}`);
  console.log(`  Compressed:         ${grandProcessed}`);
  console.log(`  Skipped:            ${grandSkipped}  (external / already small / no gain)`);
  console.log(`  Errors:             ${grandErrors}`);
  console.log(`  Before:             ${fmtBytes(grandBytesBefore)}`);
  console.log(`  After:              ${fmtBytes(grandBytesAfter)}`);
  console.log(`  💾 Saved:           ${fmtBytes(saved)}  (-${savedPct}%)`);
  console.log(DRY_RUN ? '\n  (dry-run — nothing was written)' : '\n  ✅ Done!');
})().catch(err => {
  console.error('\n💥 Fatal:', err);
  process.exit(1);
});
