import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Same font loader pattern as /api/social-kit: jsDelivr ships TTFs we can
// pass directly to Satori, covering both Latin and Greek.
async function loadFontSubset(weight: 400 | 700 | 800, subset: 'latin' | 'greek'): Promise<ArrayBuffer | null> {
  try {
    const url = `https://cdn.jsdelivr.net/fontsource/fonts/noto-sans@latest/${subset}-${weight}-normal.ttf`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET() {
  const [latin400, latin700, latin800, greek400, greek700, greek800] = await Promise.all([
    loadFontSubset(400, 'latin'),
    loadFontSubset(700, 'latin'),
    loadFontSubset(800, 'latin'),
    loadFontSubset(400, 'greek'),
    loadFontSubset(700, 'greek'),
    loadFontSubset(800, 'greek'),
  ]);

  const fonts = [
    latin400 && { name: 'Noto Sans', data: latin400, weight: 400 as const, style: 'normal' as const },
    latin700 && { name: 'Noto Sans', data: latin700, weight: 700 as const, style: 'normal' as const },
    latin800 && { name: 'Noto Sans', data: latin800, weight: 800 as const, style: 'normal' as const },
    greek400 && { name: 'Noto Sans', data: greek400, weight: 400 as const, style: 'normal' as const },
    greek700 && { name: 'Noto Sans', data: greek700, weight: 700 as const, style: 'normal' as const },
    greek800 && { name: 'Noto Sans', data: greek800, weight: 800 as const, style: 'normal' as const },
  ].filter(Boolean) as Array<{ name: string; data: ArrayBuffer; weight: 400 | 700 | 800; style: 'normal' }>;

  const features: Array<{ emoji: string; title: string; body: string }> = [
    { emoji: '📝', title: 'Δωρεάν εγγραφή',     body: 'Σε 2 λεπτά, χωρίς πιστωτική' },
    { emoji: '🌐', title: 'Προσωπικό site',     body: 'Σε 7 γλώσσες, δικό σου' },
    { emoji: '📱', title: 'QR για επισκέπτες', body: 'Οδηγίες χωρίς ερωτήσεις' },
    { emoji: '🎨', title: 'Social Media Kit',   body: 'Έτοιμα graphics με 1 κλικ' },
    { emoji: '📊', title: 'Στατιστικά',         body: 'Ξέρεις — δεν μαντεύεις' },
    { emoji: '💬', title: 'Μηδέν προμήθεια',    body: 'Απευθείας επαφή με guests' },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #064e3b 55%, #0f172a 100%)',
          color: 'white',
          padding: '56px 64px',
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: -120, right: -120,
          width: 380, height: 380, borderRadius: 9999,
          display: 'flex',
          backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.35), transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -140, left: -120,
          width: 360, height: 360, borderRadius: 9999,
          display: 'flex',
          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)',
        }} />

        {/* Brand chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(16,185,129,0.25)',
            color: '#a7f3d0',
            borderRadius: 9999,
            padding: '6px 16px',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            ChalkidikiHub · Για ιδιοκτήτες
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Όλα όσα χρειάζεσαι.
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#34d399' }}>
            Εντελώς δωρεάν.
          </div>
        </div>

        {/* Subheadline */}
        <div style={{
          display: 'flex',
          fontSize: 24,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: 24,
          maxWidth: 900,
          lineHeight: 1.35,
        }}>
          Ανέβασε το κατάλυμά σου στη Χαλκιδική και πάρε: site, QR, graphics, στατιστικά.
          Χωρίς προμήθεια. Ποτέ.
        </div>

        {/* Features grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxWidth: 1080 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 14,
              padding: '12px 16px',
              width: 340,
            }}>
              <div style={{ display: 'flex', fontSize: 30 }}>{f.emoji}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{f.title}</div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer URL */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          right: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 22,
          fontWeight: 700,
          color: '#a7f3d0',
        }}>
          chalkidikihub.gr →
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length > 0 ? fonts : undefined,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    },
  );
}
