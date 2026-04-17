import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

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

// ─────────────────────────────────────────────────────────────
// Shared building blocks
// ─────────────────────────────────────────────────────────────

function BrandChip({ accent = 'emerald' }: { accent?: 'emerald' | 'violet' | 'sky' | 'rose' | 'amber' | 'indigo' }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    emerald: { bg: 'rgba(16,185,129,0.25)', fg: '#a7f3d0' },
    violet:  { bg: 'rgba(139,92,246,0.25)', fg: '#ddd6fe' },
    sky:     { bg: 'rgba(14,165,233,0.25)', fg: '#bae6fd' },
    rose:    { bg: 'rgba(244,63,94,0.25)',  fg: '#fecdd3' },
    amber:   { bg: 'rgba(245,158,11,0.3)',  fg: '#fde68a' },
    indigo:  { bg: 'rgba(99,102,241,0.25)', fg: '#c7d2fe' },
  };
  const c = colors[accent];
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: c.bg,
      color: c.fg,
      borderRadius: 9999,
      padding: '6px 16px',
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}>
      ChalkidikiHub · Για ιδιοκτήτες
    </div>
  );
}

function Footer() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 32,
      right: 64,
      display: 'flex',
      alignItems: 'center',
      fontSize: 22,
      fontWeight: 700,
      color: '#a7f3d0',
    }}>
      chalkidikihub.gr →
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Per-feature renderers
// ─────────────────────────────────────────────────────────────

function FreeSignup() {
  return (
    <div style={{
      width: '1200px', height: '630px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
      color: 'white', padding: '56px 64px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -100, right: -100, width: 320, height: 320, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip /></div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 28 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: '#34d399' }}>#1 · Δωρεάν εγγραφή</div>
        <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>2 λεπτά.</div>
        <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#34d399' }}>Καμία πιστωτική.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 900 }}>
        {[
          { n: '1', t: 'Δίνεις email + κωδικό' },
          { n: '2', t: 'Ανεβάζεις φωτογραφίες & πληροφορίες' },
          { n: '3', t: 'Τέλος. Το κατάλυμά σου είναι live.' },
        ].map((s) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 9999,
              backgroundColor: '#10b981', color: 'white',
              fontSize: 22, fontWeight: 800,
            }}>{s.n}</div>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{s.t}</div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

function PersonalSite() {
  return (
    <div style={{
      width: '1200px', height: '630px',
      display: 'flex',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
      color: 'white', padding: '56px 64px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)' }} />

      {/* Left column: text */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 620 }}>
        <div style={{ display: 'flex', marginBottom: 20 }}><BrandChip accent="violet" /></div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#c4b5fd', marginBottom: 6 }}>#2 · Προσωπικό site</div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 18 }}>
          Δικό σου brand.
        </div>
        <div style={{ fontSize: 26, lineHeight: 1.4, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
          Cover, ιστορία, γκαλερί, χάρτης, amenities, FAQs, κανόνες, emergency numbers.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['ΕΛ', 'EN', 'DE', 'BG', 'RU', 'RO'].map((l) => (
            <div key={l} style={{
              display: 'flex',
              backgroundColor: 'rgba(139,92,246,0.2)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 20, fontWeight: 700,
              color: '#ddd6fe',
            }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Right column: browser mockup */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        width: 420, height: 470,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 20,
        marginLeft: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          backgroundColor: '#f1f5f9', padding: '10px 14px',
        }}>
          <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 9999, backgroundColor: '#ef4444' }} />
          <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 9999, backgroundColor: '#f59e0b' }} />
          <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 9999, backgroundColor: '#10b981' }} />
          <div style={{
            display: 'flex', flex: 1, marginLeft: 10,
            backgroundColor: 'white', borderRadius: 6,
            padding: '4px 10px', fontSize: 13, color: '#64748b',
          }}>chalkidikihub.gr/listings/…</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: 20, color: '#0f172a' }}>
          <div style={{ display: 'flex', height: 140, backgroundImage: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', borderRadius: 10, marginBottom: 14 }} />
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Το κατάλυμά σου</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Σιθωνία, Χαλκιδική</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ display: 'flex', height: 42, width: 80, backgroundColor: '#e2e8f0', borderRadius: 6 }} />)}
          </div>
          <div style={{ display: 'flex', height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, marginBottom: 6 }} />
          <div style={{ display: 'flex', height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, width: '80%', marginBottom: 6 }} />
          <div style={{ display: 'flex', height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, width: '60%' }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

function QrCode() {
  return (
    <div style={{
      width: '1200px', height: '630px',
      display: 'flex',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)',
      color: 'white', padding: '56px 64px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -120, left: -120, width: 360, height: 360, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.35), transparent 70%)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 680 }}>
        <div style={{ display: 'flex', marginBottom: 20 }}><BrandChip accent="sky" /></div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#7dd3fc', marginBottom: 6 }}>#3 · QR για επισκέπτες</div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Ο guest ρωτάει.
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#38bdf8', marginBottom: 22 }}>
          Το QR απαντάει.
        </div>
        <div style={{ fontSize: 24, lineHeight: 1.4, color: 'rgba(255,255,255,0.85)' }}>
          Τύπωσέ το, βάλε το στο ψυγείο. Οι επισκέπτες βρίσκουν:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          {['📶 Wi-Fi password', '🚨 Emergency numbers', '🏖️ Κοντινές παραλίες', '🍽️ Εστιατόρια', '🏛️ Αξιοθέατα'].map((t) => (
            <div key={t} style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.9)' }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Mock QR */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginLeft: 20, marginTop: 40,
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: 300, height: 300,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 18,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Fake QR grid */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: 2 }}>
            {Array.from({ length: 12 }).map((_, row) => (
              <div key={row} style={{ display: 'flex', flex: 1, gap: 2 }}>
                {Array.from({ length: 12 }).map((_, col) => {
                  const filled = ((row * 3 + col * 7 + row * col) % 3) !== 0;
                  const corner = (row < 3 && col < 3) || (row < 3 && col > 8) || (row > 8 && col < 3);
                  return (
                    <div key={col} style={{
                      display: 'flex',
                      flex: 1,
                      backgroundColor: corner ? '#0f172a' : (filled ? '#0f172a' : 'transparent'),
                      borderRadius: 2,
                    }} />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 14, fontSize: 18, fontWeight: 700, color: '#bae6fd' }}>
          Scan για πληροφορίες
        </div>
      </div>

      <Footer />
    </div>
  );
}

function SocialKit() {
  return (
    <div style={{
      width: '1200px', height: '630px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #4c0519 0%, #0f172a 100%)',
      color: 'white', padding: '56px 64px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(244,63,94,0.4), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 16 }}><BrandChip accent="rose" /></div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#fda4af', marginBottom: 6 }}>#4 · Social Media Kit</div>
      <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 10 }}>
        1 κλικ → 3 graphics.
      </div>
      <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
        IG Square, IG Story, FB/X Card — έτοιμα με τη φωτογραφία σου & QR.
      </div>

      {/* 3 mockup cards */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        {/* IG Square */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: 240, height: 240,
          backgroundImage: 'linear-gradient(160deg, #f59e0b, #ef4444, #ec4899)',
          borderRadius: 12, padding: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: 'white', opacity: 0.8 }}>IG SQUARE</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Το κατάλυμά σου</div>
          <div style={{ display: 'flex', marginTop: 10, width: 44, height: 44, backgroundColor: 'white', borderRadius: 6 }} />
        </div>
        {/* IG Story */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: 180, height: 320,
          backgroundImage: 'linear-gradient(180deg, #0ea5e9, #1e1b4b)',
          borderRadius: 12, padding: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', fontSize: 11, fontWeight: 700, color: 'white', opacity: 0.8 }}>IG STORY</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Book now</div>
          <div style={{ display: 'flex', marginTop: 8, width: 40, height: 40, backgroundColor: 'white', borderRadius: 6 }} />
        </div>
        {/* FB Card */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: 380, height: 200,
          backgroundImage: 'linear-gradient(135deg, #10b981, #0f172a)',
          borderRadius: 12, padding: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: 'white', opacity: 0.8 }}>FB / X CARD</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Share anywhere</div>
          <div style={{ display: 'flex', marginTop: 8, width: 40, height: 40, backgroundColor: 'white', borderRadius: 6 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fda4af' }}>Αντί για</div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>2-3 ώρες</div>
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)' }}>στο Canva</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Analytics() {
  // Pre-computed sparkline points
  const bars = [4, 8, 6, 12, 10, 16, 14, 22, 18, 26, 24, 32, 28, 36, 40];
  const maxBar = Math.max(...bars);

  return (
    <div style={{
      width: '1200px', height: '630px',
      display: 'flex',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #78350f 0%, #0f172a 100%)',
      color: 'white', padding: '56px 64px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 640 }}>
        <div style={{ display: 'flex', marginBottom: 20 }}><BrandChip accent="amber" /></div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#fcd34d', marginBottom: 6 }}>#5 · Στατιστικά προβολών</div>
        <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Ξέρεις. Δεν μαντεύεις.
        </div>
        <div style={{ fontSize: 24, lineHeight: 1.4, color: 'rgba(255,255,255,0.85)' }}>
          Πόσοι είδαν το κατάλυμά σου, από πού, ποιες μέρες, ποιες γλώσσες.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16, fontSize: 22, color: 'rgba(255,255,255,0.9)' }}>
          <div style={{ display: 'flex' }}>📈 Τάση τελευταίων 30 ημερών</div>
          <div style={{ display: 'flex' }}>🌍 Χώρες επισκεπτών</div>
          <div style={{ display: 'flex' }}>🔗 Από πού ήρθαν</div>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        width: 420, height: 380,
        backgroundColor: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: 24,
        marginTop: 40, marginLeft: 20,
      }}>
        <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Τελευταίες 30 ημέρες</div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 800, color: 'white' }}>2.847</div>
        <div style={{ display: 'flex', fontSize: 16, color: '#34d399', marginBottom: 20 }}>↗ +34% vs προηγούμενες</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              display: 'flex',
              flex: 1,
              height: `${(h / maxBar) * 100}%`,
              backgroundImage: 'linear-gradient(180deg, #fcd34d, #f59e0b)',
              borderRadius: 4,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          <div>προ 30 ημερών</div>
          <div>σήμερα</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ZeroCommission() {
  return (
    <div style={{
      width: '1200px', height: '630px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #312e81 0%, #0f172a 100%)',
      color: 'white', padding: '56px 64px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -140, left: -140, width: 400, height: 400, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)' }} />
      <div style={{ display: 'flex', position: 'absolute', bottom: -140, right: -140, width: 400, height: 400, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 32 }}><BrandChip accent="indigo" /></div>

      <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#a5b4fc', marginBottom: 8 }}>#6 · Προμήθεια σε κάθε κράτηση</div>
      <div style={{
        display: 'flex',
        fontSize: 280,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.05em',
        backgroundImage: 'linear-gradient(135deg, #34d399, #6366f1)',
        backgroundClip: 'text',
        color: 'transparent',
      }}>
        0%
      </div>
      <div style={{ display: 'flex', fontSize: 32, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginTop: 8, textAlign: 'center' }}>
        Καμία προμήθεια. Ποτέ.
      </div>
      <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.65)', marginTop: 8, textAlign: 'center', maxWidth: 800 }}>
        Οι επισκέπτες σε καλούν απευθείας. Όλη η κράτηση μένει σε εσένα.
      </div>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────

const RENDERERS: Record<string, () => React.ReactElement> = {
  'free-signup':     FreeSignup,
  'personal-site':   PersonalSite,
  'qr-code':         QrCode,
  'social-kit':      SocialKit,
  'analytics':       Analytics,
  'zero-commission': ZeroCommission,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const Renderer = RENDERERS[key];
  if (!Renderer) {
    return new Response(`Unknown feature key: ${key}. Valid keys: ${Object.keys(RENDERERS).join(', ')}`, { status: 400 });
  }

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

  return new ImageResponse(Renderer(), {
    width: 1200,
    height: 630,
    fonts: fonts.length > 0 ? fonts : undefined,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
