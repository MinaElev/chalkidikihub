/**
 * Client-side image compression and resizing
 * Runs in the browser before uploading to Supabase
 * Settings can be configured in Admin → Settings
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg';
}

const DEFAULTS: CompressOptions = {
  maxWidth: 1200,
  maxHeight: 800,
  quality: 0.72,
  format: 'webp',
};

// Cache settings so we don't fetch on every compress
let cachedSettings: CompressOptions | null = null;

async function getSettingsFromDB(): Promise<CompressOptions> {
  if (cachedSettings) return cachedSettings;
  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['image_quality', 'image_max_width', 'image_max_height']);

    if (data && data.length > 0) {
      const map: Record<string, string> = {};
      data.forEach((r) => { map[r.key] = r.value; });

      cachedSettings = {
        quality: map.image_quality ? Number(map.image_quality) / 100 : DEFAULTS.quality,
        maxWidth: map.image_max_width ? Number(map.image_max_width) : DEFAULTS.maxWidth,
        maxHeight: map.image_max_height ? Number(map.image_max_height) : DEFAULTS.maxHeight,
        format: DEFAULTS.format,
      };
      return cachedSettings;
    }
  } catch {}
  return DEFAULTS;
}

export async function compressImage(file: File, options?: CompressOptions): Promise<{ blob: Blob; width: number; height: number }> {
  const dbSettings = await getSettingsFromDB();
  const opts = { ...DEFAULTS, ...dbSettings, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > opts.maxWidth! || height > opts.maxHeight!) {
        const ratioW = opts.maxWidth! / width;
        const ratioH = opts.maxHeight! / height;
        const ratio = Math.min(ratioW, ratioH);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Draw on canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      // Use better quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      const mimeType = opts.format === 'webp' ? 'image/webp' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, width, height });
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        mimeType,
        opts.quality
      );
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
