import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import QRCode from 'qrcode';

export const runtime = 'nodejs';

interface Preset {
  width: number;
  height: number;
  // Where the text block sits: center | bottom
  align: 'center' | 'bottom';
  // Font-size scales
  titleSize: number;
  taglineSize: number;
  metaSize: number;
  footerSize: number;
}

const PRESETS: Record<string, Preset> = {
  'ig-square':   { width: 1080, height: 1080, align: 'center', titleSize: 74, taglineSize: 34, metaSize: 28, footerSize: 22 },
  'ig-story':    { width: 1080, height: 1920, align: 'bottom', titleSize: 82, taglineSize: 38, metaSize: 32, footerSize: 26 },
  'fb-post':     { width: 1200, height: 630,  align: 'center', titleSize: 64, taglineSize: 30, metaSize: 24, footerSize: 20 },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// ─────────────────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ format: string }> },
) {
  const { format } = await params;
  const preset = PRESETS[format];
  if (!preset) {
    return new Response('Unknown format', { status: 400 });
  }

  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const supabase = createApiClient();
  const { data: listing, error } = await supabase
    .from('listings')
    .select('title_el, title_en, tagline_el, tagline_en, location_name, guests_max, bedrooms, bathrooms, slug, listing_images(image_url, is_cover, sort_order)')
    .eq('slug', slug)
    .single();

  if (error || !listing) {
    return new Response('Listing not found', { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const l = listing as any;
  const title: string = l.title_el || l.title_en || 'Listing';
  const tagline: string = l.tagline_el || l.tagline_en || '';
  const location: string = l.location_name || 'Chalkidiki';
  const guests: number = l.guests_max || 0;
  const bedrooms: number = l.bedrooms || 0;
  const bathrooms: number = l.bathrooms || 0;

  // Cover image url
  const images: Array<{ image_url: string; is_cover: boolean; sort_order: number }> = l.listing_images || [];
  const cover = images.find(i => i.is_cover) || images.sort((a, b) => a.sort_order - b.sort_order)[0];
  const coverUrl = cover?.image_url || '';

  // Generate QR code → data URL pointing to /stay/[slug]
  const stayUrl = `${SITE_URL}/stay/${slug}`;
  const qrDataUrl = await QRCode.toDataURL(stayUrl, {
    width: 240,
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f172a', light: '#ffffff00' }, // slate-900 on transparent
  });

  const { width, height, align, titleSize, taglineSize, metaSize, footerSize } = preset;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#0f172a',
          overflow: 'hidden',
        }}
      >
        {/* Cover image fills the frame */}
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={coverUrl}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Gradient overlay for readability */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            background: align === 'center'
              ? 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.55) 50%, rgba(15,23,42,0.85) 100%)'
              : 'linear-gradient(180deg, rgba(15,23,42,0.10) 0%, rgba(15,23,42,0.35) 45%, rgba(15,23,42,0.90) 100%)',
          }}
        />

        {/* Top-right brand chip */}
        <div
          style={{
            position: 'absolute',
            top: width === 1200 ? 30 : 40,
            right: width === 1200 ? 30 : 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 999,
            padding: '8px 16px',
            color: 'white',
            fontSize: footerSize,
            fontWeight: 600,
            letterSpacing: 0.3,
          }}
        >
          <span style={{ fontSize: footerSize + 4 }}>🏖️</span>
          ChalkidikiHub
        </div>

        {/* Content block — positioned based on preset */}
        <div
          style={{
            position: 'absolute',
            left: 0, right: 0,
            ...(align === 'center'
              ? { top: 0, bottom: 0, justifyContent: 'center' }
              : { bottom: 0, top: 'auto', justifyContent: 'flex-end' }
            ),
            display: 'flex',
            flexDirection: 'column',
            padding: `${width === 1200 ? 60 : 80}px`,
            color: 'white',
          }}
        >
          {/* Location pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              alignSelf: 'flex-start',
              background: 'rgba(16,185,129,0.25)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: metaSize - 4,
              fontWeight: 600,
              color: '#a7f3d0',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            📍 {location}
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.0,
              marginBottom: 16,
              textShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {title}
          </div>

          {/* Tagline */}
          {tagline && (
            <div
              style={{
                display: 'flex',
                fontSize: taglineSize,
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: -0.5,
                lineHeight: 1.3,
                marginBottom: 28,
                maxWidth: width * 0.85,
              }}
            >
              {tagline}
            </div>
          )}

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              fontSize: metaSize,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.95)',
              marginBottom: align === 'bottom' ? 32 : 0,
            }}
          >
            {guests > 0 && <span>👥 {guests}</span>}
            {bedrooms > 0 && <span>🛏 {bedrooms}</span>}
            {bathrooms > 0 && <span>🛁 {bathrooms}</span>}
          </div>
        </div>

        {/* QR code (bottom-right corner for all formats) */}
        {qrDataUrl && (
          <div
            style={{
              position: 'absolute',
              right: width === 1200 ? 30 : 40,
              bottom: width === 1200 ? 30 : 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.95)',
                padding: 12,
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img
                src={qrDataUrl}
                width={width === 1200 ? 110 : 140}
                height={width === 1200 ? 110 : 140}
              />
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: footerSize - 4,
                color: 'white',
                fontWeight: 500,
                opacity: 0.85,
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
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
}
