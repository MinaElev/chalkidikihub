/**
 * Migrate external image URLs into Supabase storage for a listing.
 *
 * Why this exists:
 *   /api/import-listing successfully extracts photo URLs from Booking/Airbnb
 *   pages, but those URLs are CDN-signed and expire (and worse: get blocked
 *   when fetched from outside the original referrer context). Without this
 *   migration, the import feature silently dropped images — owners had to
 *   re-upload everything by hand, undoing the value of one-click import.
 *
 * Flow:
 *   1. Caller passes `listingId` + `imageUrls[]`.
 *   2. For each URL we fetch the bytes with a real browser User-Agent
 *      (Booking/Airbnb CDNs block default Node UAs).
 *   3. Upload to bucket `listing-images` at path `listings/<id>/imported-<ts>-<i>.jpg`.
 *   4. Insert a `listing_images` row pointing at the public URL.
 *
 * Auth: requireSuperAdmin — destructive write to storage + DB.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const MAX_IMAGES = 15;
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per image — Booking/Airbnb originals are typically 200-600 KB

function inferContentType(url: string, headerType: string | null): string {
  if (headerType && headerType.startsWith('image/')) return headerType;
  const lower = url.toLowerCase();
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
}

function extFromContentType(ct: string): string {
  if (ct === 'image/webp') return 'webp';
  if (ct === 'image/png') return 'png';
  if (ct === 'image/gif') return 'gif';
  return 'jpg';
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  let body: { listingId?: string; imageUrls?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { listingId, imageUrls } = body;
  if (!listingId || typeof listingId !== 'string') {
    return NextResponse.json({ error: 'listingId is required' }, { status: 400 });
  }
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return NextResponse.json({ error: 'imageUrls[] is required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Sanity: confirm the listing exists before we start writing to its bucket folder.
  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('id')
    .eq('id', listingId)
    .single();
  if (listingErr || !listing) {
    return NextResponse.json({ error: `Listing ${listingId} not found` }, { status: 404 });
  }

  // Existing image count → preserve sort_order monotonicity, mark cover if listing has none yet.
  const { data: existing } = await supabase
    .from('listing_images')
    .select('id, sort_order')
    .eq('listing_id', listingId);
  const startSortOrder = (existing || []).reduce((max, img) => Math.max(max, img.sort_order ?? 0), -1) + 1;
  const noImagesYet = !existing || existing.length === 0;

  const urlsToProcess = imageUrls.slice(0, MAX_IMAGES);
  const ts = Date.now();
  const results = await Promise.allSettled(
    urlsToProcess.map(async (sourceUrl, idx) => {
      // Skip obviously invalid entries — AI sometimes hallucinates a non-URL.
      if (!sourceUrl || typeof sourceUrl !== 'string' || !/^https?:\/\//i.test(sourceUrl)) {
        throw new Error(`Skip non-URL at index ${idx}`);
      }

      // 1. Fetch with browser UA.
      const fetchRes = await fetch(sourceUrl, {
        headers: {
          'User-Agent': BROWSER_UA,
          // Some CDNs (Booking) check the referer. Empty referer often passes;
          // a wrong one is more likely to be blocked than no referer at all.
          'Accept': 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
        },
        // Don't follow forever — image CDN redirects are typically 1-2 hops.
        redirect: 'follow',
      });

      if (!fetchRes.ok) {
        throw new Error(`Fetch ${sourceUrl} failed: HTTP ${fetchRes.status}`);
      }

      const contentLength = Number(fetchRes.headers.get('content-length') || '0');
      if (contentLength > MAX_BYTES) {
        throw new Error(`Image at ${sourceUrl} exceeds ${MAX_BYTES}-byte limit`);
      }

      const arrayBuffer = await fetchRes.arrayBuffer();
      if (arrayBuffer.byteLength > MAX_BYTES) {
        throw new Error(`Image at ${sourceUrl} exceeds ${MAX_BYTES}-byte limit (post-download)`);
      }

      const contentType = inferContentType(sourceUrl, fetchRes.headers.get('content-type'));
      const ext = extFromContentType(contentType);
      const path = `listings/${listingId}/imported-${ts}-${idx}.${ext}`;

      // 2. Upload to listing-images bucket.
      const { error: upErr } = await supabase.storage
        .from('listing-images')
        .upload(path, arrayBuffer, {
          cacheControl: '31536000',
          contentType,
          upsert: false,
        });
      if (upErr) throw new Error(`Upload ${path} failed: ${upErr.message}`);

      const { data: pub } = supabase.storage.from('listing-images').getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      // 3. Insert listing_images row.
      const { data: inserted, error: insertErr } = await supabase
        .from('listing_images')
        .insert({
          listing_id: listingId,
          image_url: publicUrl,
          sort_order: startSortOrder + idx,
          is_cover: noImagesYet && idx === 0,
        })
        .select()
        .single();
      if (insertErr) throw new Error(`DB insert failed for ${path}: ${insertErr.message}`);

      return { sourceUrl, publicUrl, id: inserted.id };
    }),
  );

  const migrated = results
    .filter((r): r is PromiseFulfilledResult<{ sourceUrl: string; publicUrl: string; id: string }> => r.status === 'fulfilled')
    .map(r => r.value);
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => (r.reason instanceof Error ? r.reason.message : String(r.reason)));

  return NextResponse.json({
    migrated: migrated.length,
    images: migrated,
    errors,
    skipped: Math.max(0, imageUrls.length - urlsToProcess.length),
  });
}
