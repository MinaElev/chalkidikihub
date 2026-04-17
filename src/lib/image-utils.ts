/**
 * Client-side image compression and resizing.
 * Runs in the browser before uploading to Supabase.
 *
 * Strategy (aggressive mode):
 *   1. Downscale to fit within maxWidth × maxHeight.
 *   2. Encode to WebP at the starting quality.
 *   3. If the result is still larger than `targetMaxBytes`, re-encode with
 *      a lower quality in a loop until it fits or we hit `minQuality`.
 *
 * Settings can be configured in Admin → Settings. Any admin override
 * wins over these defaults.
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg';
  /** Try to keep each file under this many bytes (iterative). */
  targetMaxBytes?: number;
  /** Don't reduce quality below this floor. */
  minQuality?: number;
}

const DEFAULTS: Required<CompressOptions> = {
  maxWidth: 1600,
  maxHeight: 1200,
  quality: 0.62,
  format: 'webp',
  targetMaxBytes: 200 * 1024, // 200 KB target
  minQuality: 0.40,
};

// Cache settings so we don't fetch on every compress
let cachedSettings: Partial<CompressOptions> | null = null;

async function getSettingsFromDB(): Promise<Partial<CompressOptions>> {
  if (cachedSettings) return cachedSettings;
  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['image_quality', 'image_max_width', 'image_max_height', 'image_target_kb']);

    if (data && data.length > 0) {
      const map: Record<string, string> = {};
      data.forEach((r) => { map[r.key] = r.value; });

      cachedSettings = {
        quality: map.image_quality ? Number(map.image_quality) / 100 : undefined,
        maxWidth: map.image_max_width ? Number(map.image_max_width) : undefined,
        maxHeight: map.image_max_height ? Number(map.image_max_height) : undefined,
        targetMaxBytes: map.image_target_kb ? Number(map.image_target_kb) * 1024 : undefined,
        format: 'webp',
      };
      return cachedSettings;
    }
  } catch {}
  return {};
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, mime, quality);
  });
}

export async function compressImage(
  file: File,
  options?: CompressOptions,
): Promise<{ blob: Blob; width: number; height: number; originalSize: number; compressedSize: number }> {
  const dbSettings = await getSettingsFromDB();
  // Only override DEFAULTS with *defined* values
  const merged: Required<CompressOptions> = {
    ...DEFAULTS,
    ...Object.fromEntries(Object.entries(dbSettings).filter(([, v]) => v !== undefined)),
    ...Object.fromEntries(Object.entries(options || {}).filter(([, v]) => v !== undefined)),
  } as Required<CompressOptions>;

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Downscale maintaining aspect ratio
      if (width > merged.maxWidth || height > merged.maxHeight) {
        const ratio = Math.min(merged.maxWidth / width, merged.maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = merged.format === 'webp' ? 'image/webp' : 'image/jpeg';

      try {
        // Iterative quality reduction until we hit the target size
        let quality = merged.quality;
        let blob = await canvasToBlob(canvas, mimeType, quality);

        // Step down quality by 0.07 each pass, but never below minQuality
        while (blob.size > merged.targetMaxBytes && quality > merged.minQuality) {
          quality = Math.max(merged.minQuality, quality - 0.07);
          blob = await canvasToBlob(canvas, mimeType, quality);
        }

        // If the original was already smaller than what we produced, keep the original
        // (rare, but protects against upsizing very small files).
        if (originalSize < blob.size && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
          resolve({
            blob: file,
            width,
            height,
            originalSize,
            compressedSize: originalSize,
          });
          return;
        }

        resolve({
          blob,
          width,
          height,
          originalSize,
          compressedSize: blob.size,
        });
      } catch (err) {
        reject(err as Error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

// Clear cache (call after settings change)
export function clearImageSettingsCache() {
  cachedSettings = null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
