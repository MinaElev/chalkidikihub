import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';

// GET /api/admin/storage-audit
//
// Walks every storage bucket and reports total bytes, file count, count of
// "fat" files (>500KB — i.e. legacy oversized images that bypassed the
// client-side compressor), and the top 30 largest files per bucket.
// Used to diagnose Supabase egress overages from large legacy originals.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BUCKETS = ['listing-images', 'content-images', 'submission-images', 'sale-images'] as const;
const FAT_THRESHOLD = 500 * 1024; // 500KB — anything above this predates aggressive compression
const PAGE_SIZE = 1000;

interface FileRow {
  bucket: string;
  path: string;
  size: number;
  updated_at: string | null;
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
      // Folders have null id and no metadata; recurse into them.
      if (item.id === null) {
        await listFolder(supabase, bucket, path, out);
      } else {
        const size = (item.metadata as { size?: number } | null)?.size ?? 0;
        out.push({ bucket, path, size, updated_at: item.updated_at ?? null });
      }
    }

    if (data.length < PAGE_SIZE) return;
    offset += PAGE_SIZE;
  }
}

export async function GET() {
  const supabase = createAdminClient();
  const all: FileRow[] = [];
  const errors: Array<{ bucket: string; error: string }> = [];

  // First — list all actual buckets so we know what exists
  const { data: bucketList, error: bucketsErr } = await supabase.storage.listBuckets();
  const actualBuckets = (bucketList || []).map((b) => b.name);

  const targets = actualBuckets.length > 0 ? actualBuckets : [...BUCKETS];

  for (const bucket of targets) {
    try {
      const before = all.length;
      await listFolder(supabase, bucket, '', all);
      if (all.length === before) {
        errors.push({ bucket, error: 'no files returned (empty or list blocked)' });
      }
    } catch (e) {
      errors.push({ bucket, error: (e as Error).message });
    }
  }

  const perBucket: Record<string, { files: number; bytes: number; fatFiles: number; fatBytes: number }> = {};
  for (const f of all) {
    const b = (perBucket[f.bucket] ||= { files: 0, bytes: 0, fatFiles: 0, fatBytes: 0 });
    b.files++;
    b.bytes += f.size;
    if (f.size > FAT_THRESHOLD) {
      b.fatFiles++;
      b.fatBytes += f.size;
    }
  }

  const top = [...all].sort((a, b) => b.size - a.size).slice(0, 30);

  // Enrich listing-images paths with listing slug/title (path = "<listing-id>/<...>")
  const listingIds = new Set<string>();
  for (const f of top) {
    if (f.bucket === 'listing-images') {
      const id = f.path.split('/')[0];
      if (id) listingIds.add(id);
    }
  }
  let listingMap: Record<string, { slug: string; title: string }> = {};
  if (listingIds.size > 0) {
    const { data: rows } = await supabase
      .from('listings')
      .select('id, slug, title_el')
      .in('id', Array.from(listingIds));
    listingMap = Object.fromEntries(
      (rows || []).map((r) => [r.id as string, { slug: r.slug as string, title: r.title_el as string }]),
    );
  }
  const topEnriched = top.map((f) => {
    if (f.bucket !== 'listing-images') return f;
    const id = f.path.split('/')[0];
    return { ...f, listing: listingMap[id] || null };
  });

  const totals = Object.values(perBucket).reduce(
    (acc, b) => ({
      files: acc.files + b.files,
      bytes: acc.bytes + b.bytes,
      fatFiles: acc.fatFiles + b.fatFiles,
      fatBytes: acc.fatBytes + b.fatBytes,
    }),
    { files: 0, bytes: 0, fatFiles: 0, fatBytes: 0 },
  );

  return NextResponse.json({
    totals,
    perBucket,
    fatThresholdKB: FAT_THRESHOLD / 1024,
    top: topEnriched,
    debug: {
      actualBuckets,
      bucketsListError: bucketsErr?.message ?? null,
      errors,
    },
  });
}
