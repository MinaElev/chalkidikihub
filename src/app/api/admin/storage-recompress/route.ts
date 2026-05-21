import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createAdminClient } from '@/lib/api-helpers';

// POST /api/admin/storage-recompress
//
// Server-side re-compression of legacy oversized images in Supabase Storage.
// Walks every bucket, picks the largest files above `minSizeKB`, downloads
// each, re-encodes with sharp (resize → WebP), and overwrites in place.
//
// Body (all optional):
//   { minSizeKB: 500, maxFiles: 20, dryRun: false, maxWidth: 1600, quality: 70 }
//
// Idempotent: re-running keeps shrinking files that are still above the
// threshold. The file path is preserved (so listing_images.image_url stays
// valid); only the byte content and Content-Type change.

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const BUCKETS = ['listing-images', 'content-images', 'submission-images', 'sale-images'] as const;
const PAGE_SIZE = 1000;

interface FileRow {
  bucket: string;
  path: string;
  size: number;
}

async function listFolder(
  supabase: ReturnType<typeof createAdminClient>,
  bucket: string,
  prefix: string,
  out: FileRow[],
): Promise<void> {
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: PAGE_SIZE, offset, sortBy: { column: 'name', order: 'asc' } });
    if (error || !data) return;
    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        await listFolder(supabase, bucket, path, out);
      } else {
        const size = (item.metadata as { size?: number } | null)?.size ?? 0;
        out.push({ bucket, path, size });
      }
    }
    if (data.length < PAGE_SIZE) return;
    offset += PAGE_SIZE;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const minSizeKB = Number(body.minSizeKB ?? 500);
  const maxFiles = Number(body.maxFiles ?? 20);
  const dryRun = Boolean(body.dryRun);
  const maxWidth = Number(body.maxWidth ?? 1600);
  const quality = Number(body.quality ?? 70);

  const minBytes = minSizeKB * 1024;
  const supabase = createAdminClient();

  // Find all fat files across all buckets, sorted largest first
  const all: FileRow[] = [];
  for (const bucket of BUCKETS) {
    try { await listFolder(supabase, bucket, '', all); } catch {}
  }
  const candidates = all.filter((f) => f.size > minBytes).sort((a, b) => b.size - a.size);
  const remainingAfterBatch = Math.max(0, candidates.length - maxFiles);
  const batch = candidates.slice(0, maxFiles);

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      totalCandidates: candidates.length,
      wouldProcess: batch.map((f) => ({ bucket: f.bucket, path: f.path, sizeKB: Math.round(f.size / 1024) })),
    });
  }

  const results: Array<{
    bucket: string;
    path: string;
    beforeKB: number;
    afterKB?: number;
    savedKB?: number;
    error?: string;
  }> = [];

  let totalBefore = 0;
  let totalAfter = 0;

  for (const f of batch) {
    totalBefore += f.size;
    try {
      const { data: blob, error: dlErr } = await supabase.storage.from(f.bucket).download(f.path);
      if (dlErr || !blob) {
        results.push({ bucket: f.bucket, path: f.path, beforeKB: Math.round(f.size / 1024), error: dlErr?.message || 'download failed' });
        continue;
      }
      const inputBuf = Buffer.from(await blob.arrayBuffer());

      const output = await sharp(inputBuf, { failOn: 'none' })
        .rotate() // honor EXIF
        .resize({ width: maxWidth, height: maxWidth, fit: 'inside', withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toBuffer();

      // Don't replace if we somehow made it bigger (defensive)
      if (output.byteLength >= f.size) {
        results.push({
          bucket: f.bucket,
          path: f.path,
          beforeKB: Math.round(f.size / 1024),
          afterKB: Math.round(output.byteLength / 1024),
          error: 'skipped — recompression did not shrink',
        });
        totalAfter += f.size;
        continue;
      }

      const { error: upErr } = await supabase.storage
        .from(f.bucket)
        .upload(f.path, output, { contentType: 'image/webp', upsert: true });
      if (upErr) {
        results.push({ bucket: f.bucket, path: f.path, beforeKB: Math.round(f.size / 1024), error: upErr.message });
        totalAfter += f.size;
        continue;
      }

      totalAfter += output.byteLength;
      results.push({
        bucket: f.bucket,
        path: f.path,
        beforeKB: Math.round(f.size / 1024),
        afterKB: Math.round(output.byteLength / 1024),
        savedKB: Math.round((f.size - output.byteLength) / 1024),
      });
    } catch (e) {
      results.push({ bucket: f.bucket, path: f.path, beforeKB: Math.round(f.size / 1024), error: (e as Error).message });
    }
  }

  return NextResponse.json({
    processed: results.length,
    totalCandidates: candidates.length,
    remainingAfterBatch,
    totalBeforeMB: +(totalBefore / 1024 / 1024).toFixed(2),
    totalAfterMB: +(totalAfter / 1024 / 1024).toFixed(2),
    savedMB: +((totalBefore - totalAfter) / 1024 / 1024).toFixed(2),
    results,
  });
}
