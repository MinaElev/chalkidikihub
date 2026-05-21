import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';

// POST /api/admin/storage-relabel
//
// One-shot maintenance: re-uploads every storage object in place so its
// Cache-Control header gets the long TTL we now set on fresh uploads
// (cacheControl: '31536000'). Supabase's JS SDK has no "patch metadata
// only" call, so we download + re-upload with upsert. Egress cost is the
// download leg only (~210MB across all buckets at current sizes).
//
// Body (all optional):
//   { maxFiles: 50, dryRun: false, buckets: ['listing-images', ...] }
//
// Idempotent (re-uploads with identical bytes). Re-run until
// remainingAfterBatch = 0.

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const ALL_BUCKETS = ['listing-images', 'content-images', 'submission-images', 'sale-images'] as const;
const PAGE_SIZE = 1000;
const TARGET_CACHE_CONTROL = '31536000'; // 1 year
const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  avif: 'image/avif',
};

interface FileRow {
  bucket: string;
  path: string;
  size: number;
  cacheControl: string | null;
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
        const meta = (item.metadata as { size?: number; cacheControl?: string } | null) ?? null;
        out.push({
          bucket,
          path,
          size: meta?.size ?? 0,
          cacheControl: meta?.cacheControl ?? null,
        });
      }
    }
    if (data.length < PAGE_SIZE) return;
    offset += PAGE_SIZE;
  }
}

function inferContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return CONTENT_TYPE_BY_EXT[ext] ?? 'application/octet-stream';
}

function alreadyLongCached(cc: string | null): boolean {
  if (!cc) return false;
  // Supabase stores it like "max-age=31536000" — extract digits and compare.
  const m = cc.match(/(\d+)/);
  if (!m) return false;
  return Number(m[1]) >= 86400 * 30; // anything >= 30 days is "long enough"
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const maxFiles = Number(body.maxFiles ?? 50);
  const dryRun = Boolean(body.dryRun);
  const targetBuckets: readonly string[] = Array.isArray(body.buckets) && body.buckets.length > 0
    ? body.buckets
    : ALL_BUCKETS;

  const supabase = createAdminClient();
  const all: FileRow[] = [];

  for (const bucket of targetBuckets) {
    try { await listFolder(supabase, bucket, '', all); } catch {}
  }

  const candidates = all.filter((f) => !alreadyLongCached(f.cacheControl));
  const batch = candidates.slice(0, maxFiles);
  const remainingAfterBatch = Math.max(0, candidates.length - maxFiles);

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      totalFiles: all.length,
      totalCandidates: candidates.length,
      wouldProcess: batch.map((f) => ({
        bucket: f.bucket,
        path: f.path,
        sizeKB: Math.round(f.size / 1024),
        currentCacheControl: f.cacheControl,
      })),
    });
  }

  const results: Array<{ bucket: string; path: string; ok: boolean; error?: string }> = [];
  let bytesDownloaded = 0;

  for (const f of batch) {
    try {
      const { data: blob, error: dlErr } = await supabase.storage.from(f.bucket).download(f.path);
      if (dlErr || !blob) {
        results.push({ bucket: f.bucket, path: f.path, ok: false, error: dlErr?.message ?? 'download failed' });
        continue;
      }
      bytesDownloaded += f.size;
      const buf = Buffer.from(await blob.arrayBuffer());
      const contentType = blob.type || inferContentType(f.path);

      const { error: upErr } = await supabase.storage
        .from(f.bucket)
        .upload(f.path, buf, { cacheControl: TARGET_CACHE_CONTROL, contentType, upsert: true });
      if (upErr) {
        results.push({ bucket: f.bucket, path: f.path, ok: false, error: upErr.message });
        continue;
      }
      results.push({ bucket: f.bucket, path: f.path, ok: true });
    } catch (e) {
      results.push({ bucket: f.bucket, path: f.path, ok: false, error: (e as Error).message });
    }
  }

  const okCount = results.filter((r) => r.ok).length;
  return NextResponse.json({
    processed: results.length,
    succeeded: okCount,
    failed: results.length - okCount,
    totalCandidates: candidates.length,
    remainingAfterBatch,
    bytesDownloadedMB: +(bytesDownloaded / 1024 / 1024).toFixed(2),
    targetCacheControl: TARGET_CACHE_CONTROL,
    results,
  });
}
