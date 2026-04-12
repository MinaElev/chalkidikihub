import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') || 'Chalkidiki Hub';
  const subtitle = searchParams.get('subtitle') || '';
  const type = searchParams.get('type') || 'default'; // default, beach, restaurant, listing, blog, area

  // Color schemes per type
  const themes: Record<string, { bg: string; accent: string; icon: string }> = {
    default:    { bg: '#0891B2', accent: '#fbbf24', icon: '🌊' },
    beach:      { bg: '#0284C7', accent: '#38BDF8', icon: '🏖️' },
    restaurant: { bg: '#B91C1C', accent: '#FCA5A5', icon: '🍽️' },
    listing:    { bg: '#7C3AED', accent: '#C4B5FD', icon: '🏠' },
    blog:       { bg: '#059669', accent: '#6EE7B7', icon: '📝' },
    area:       { bg: '#0E7490', accent: '#67E8F9', icon: '📍' },
    activity:   { bg: '#D97706', accent: '#FDE68A', icon: '🏛️' },
    sales:      { bg: '#065F46', accent: '#A7F3D0', icon: '🏗️' },
  };

  const theme = themes[type] || themes.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200',
          height: '630',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bg}DD 50%, ${theme.bg}BB 100%)`,
          padding: '60px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `${theme.accent}22`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '200px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: `${theme.accent}15`,
            display: 'flex',
          }}
        />

        {/* Top bar - Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {/* Sun & Sea icon */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#0E7490',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            🌊
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>
              Chalkidiki
            </span>
            <span style={{ fontSize: '28px', fontWeight: 700, color: theme.accent }}>
              Hub
            </span>
          </div>
        </div>

        {/* Type icon */}
        {type !== 'default' && (
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              display: 'flex',
            }}
          >
            {theme.icon}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? '48px' : '56px',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.15,
            maxWidth: '900px',
            marginBottom: '16px',
            display: 'flex',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '750px',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            right: '80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
            }}
          >
            chalkidikihub.gr
          </div>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                padding: '4px 12px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                display: 'flex',
              }}
            >
              Halkidiki, Greece
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
