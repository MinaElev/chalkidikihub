import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

// Edge runtime matches the working /api/og route; qrcode lib replaced with
// an external image fetch so no Node-only Buffer/canvas APIs are needed.
export const runtime = 'edge';

interface Preset {
  width: number;
  height: number;
  align: 'center' | 'bottom';
  titleSize: number;
  taglineSize: number;
  metaSize: number;
  footerSize: number;
  qrSize: number;
}

const PRESETS: Record<string, Preset> = {
  'ig-square': { width: 1080, height: 1080, align: 'center', titleSize: 72, taglineSize: 34, metaSize: 30, footerSize: 22, qrSize: 140 },
  'ig-story':  { width: 1080, height: 1920, align: 'bottom', titleSize: 84, taglineSize: 38, metaSize: 34, footerSize: 26, qrSize: 160 },
  'fb-post':   { width: 1200, height: 630,  align: 'center', titleSize: 60, taglineSize: 28, metaSize: 24, footerSize: 20, qrSize: 110 },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

async function fetchAsBase64(url: string, timeoutMs = 8000): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, { headers: { Accept: 'image/*' }, signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    // Guard against huge payloads
    if (buf.byteLength > 4 * 1024 * 1024) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    // Simple byte-by-byte base64 encode (edge-compatible, no Buffer,
    // avoids Array.from / apply which choke on some TypedArray
    // polyfills and surface as 'd is not iterable' in Satori logs).
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const b64 = btoa(binary);
    return `data:${contentType};base64,${b64}`;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ format: string }> },
) {
  try {
    const { format } = await params;
    const preset = PRESETS[format];
    if (!preset) return new Response(`Unknown format: ${format}`, { status: 400 });

    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug) return new Response('Missing slug', { status: 400 });

    const supabase = createApiClient();
    const { data: listing, error } = await supabase
      .from('listings')
      .select('title_el, title_en, tagline_el, tagline_en, location_name, guests_max, bedrooms, bathrooms, slug, listing_images(image_url, is_cover, sort_order)')
      .eq('slug', slug)
      .single();

    if (error || !listing) {
      return new Response(`Listing not found (slug=${slug}): ${error?.message || 'no data'}`, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const l = listing as any;
    const title: string = (l.title_el || l.title_en || 'Listing').slice(0, 80);
    const tagline: string = (l.tagline_el || l.tagline_en || '').slice(0, 160);
    const location: string = (l.location_name || 'Chalkidiki').slice(0, 60);
    const guests: number = Number(l.guests_max) || 0;
    const bedrooms: number = Number(l.bedrooms) || 0;
    const bathrooms: number = Number(l.bathrooms) || 0;

    const images: Array<{ image_url: string; is_cover: boolean; sort_order: number }> = l.listing_images || [];
    const sorted = [...images].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const cover = sorted.find(i => i.is_cover) || sorted[0];
    const coverUrl = cover?.image_url || '';

    // Fetch cover + QR in parallel (both as base64 data URLs)
    const stayUrl = `${SITE_URL}/stay/${slug}`;
    const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(stayUrl)}&color=0F172A&bgcolor=FFFFFF&format=png`;

    const [coverDataUrl, qrDataUrl] = await Promise.all([
      coverUrl ? fetchAsBase64(coverUrl) : Promise.resolve(null),
      fetchAsBase64(qrServiceUrl, 5000),
    ]);

    const { width, height, align, titleSize, taglineSize, metaSize, footerSize, qrSize } = preset;
    const padding = width === 1200 ? 50 : 70;

    const metaParts: string[] = [];
    if (guests > 0) metaParts.push(`${guests} guests`);
    if (bedrooms > 0) metaParts.push(`${bedrooms} beds`);
    if (bathrooms > 0) metaParts.push(`${bathrooms} baths`);
    const metaLine = metaParts.join(' · ');

    return new ImageResponse(
      (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#0f172a',
          }}
        >
          {/* Cover image (base64) */}
          {coverDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img
              src={coverDataUrl}
              width={width}
              height={height}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${width}px`,
                height: `${height}px`,
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: `${width}px`, height: `${height}px`,
                display: 'flex',
                backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
              }}
            />
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${width}px`,
              height: `${height}px`,
              display: 'flex',
              backgroundImage: align === 'center'
                ? 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.55) 50%, rgba(15,23,42,0.88) 100%)'
                : 'linear-gradient(180deg, rgba(15,23,42,0.10) 0%, rgba(15,23,42,0.40) 50%, rgba(15,23,42,0.92) 100%)',
            }}
          />

          {/* Top-right brand chip */}
          <div
            style={{
              position: 'absolute',
              top: `${Math.round(padding / 2)}px`,
              right: `${Math.round(padding / 2)}px`,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '999px',
              padding: '10px 18px',
              color: 'white',
              fontSize: `${footerSize}px`,
              fontWeight: 700,
            }}
          >
            ChalkidikiHub
          </div>

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              left: `${padding}px`,
              right: `${padding}px`,
              ...(align === 'bottom'
                ? { bottom: `${padding}px` }
                : { top: `${Math.round(height / 2)}px`, transform: 'translateY(-50%)' }
              ),
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
            }}
          >
            {/* Location pill */}
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(16,185,129,0.3)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: `${metaSize - 6}px`,
                fontWeight: 700,
                color: '#a7f3d0',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {location}
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                fontSize: `${titleSize}px`,
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: '14px',
                maxWidth: `${width - padding * 2 - qrSize - 40}px`,
              }}
            >
              {title}
            </div>

            {/* Tagline */}
            {tagline && (
              <div
                style={{
                  display: 'flex',
                  fontSize: `${taglineSize}px`,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.3,
                  marginBottom: '24px',
                  maxWidth: `${width - padding * 2 - qrSize - 40}px`,
                }}
              >
                {tagline}
              </div>
            )}

            {/* Meta */}
            {metaLine && (
              <div
                style={{
                  display: 'flex',
                  fontSize: `${metaSize}px`,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.95)',
                }}
              >
                {metaLine}
              </div>
            )}
          </div>

          {/* QR */}
          {qrDataUrl && (
            <div
              style={{
                position: 'absolute',
                right: `${Math.round(padding / 2)}px`,
                bottom: `${Math.round(padding / 2)}px`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '12px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img
                  src={qrDataUrl}
                  width={qrSize}
                  height={qrSize}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: '8px',
                  fontSize: `${footerSize - 4}px`,
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                chalkidikihub.gr
              </div>
            </div>
          )}
        </div>
      ),
      {
        width,
        height,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600',
        },
      },
    );
  } catch (err) {
    console.error('[social-kit] error:', err);
    const msg = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
    return new Response(`Social kit generation failed:\n${msg}`, { status: 500 });
  }
}
