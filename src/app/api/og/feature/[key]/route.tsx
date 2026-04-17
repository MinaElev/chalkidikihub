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

// 1080×1080 square — Instagram feed post.
const W = 1080;
const H = 1080;

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
      padding: '10px 22px',
      fontSize: 22,
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
      bottom: 48,
      left: 60,
      right: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 28,
      fontWeight: 700,
      color: '#a7f3d0',
    }}>
      <div style={{ display: 'flex', color: 'rgba(255,255,255,0.5)', fontSize: 22 }}>Δωρεάν. Χωρίς όρους.</div>
      <div style={{ display: 'flex' }}>chalkidikihub.gr →</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Per-feature renderers (1080×1080)
// ─────────────────────────────────────────────────────────────

function FreeSignup() {
  return (
    <div style={{
      width: W, height: H,
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
      color: 'white', padding: '60px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -140, right: -140, width: 420, height: 420, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 32 }}><BrandChip /></div>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 44 }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: '#34d399', marginBottom: 10 }}>#1 · Δωρεάν εγγραφή</div>
        <div style={{ fontSize: 102, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>2 λεπτά.</div>
        <div style={{ fontSize: 102, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#34d399' }}>Καμία</div>
        <div style={{ fontSize: 102, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#34d399' }}>πιστωτική.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { n: '1', t: 'Δίνεις email + κωδικό' },
          { n: '2', t: 'Ανεβάζεις φωτογραφίες & πληροφορίες' },
          { n: '3', t: 'Τέλος. Είσαι live.' },
        ].map((s) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 60, height: 60, borderRadius: 9999,
              backgroundColor: '#10b981', color: 'white',
              fontSize: 30, fontWeight: 800,
            }}>{s.n}</div>
            <div style={{ display: 'flex', fontSize: 32, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{s.t}</div>
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
      width: W, height: H,
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
      color: 'white', padding: '60px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -140, right: -140, width: 420, height: 420, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="violet" /></div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#c4b5fd', marginBottom: 10 }}>#2 · Προσωπικό site</div>
      <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', marginBottom: 20 }}>
        Δικό σου brand.
      </div>
      <div style={{ fontSize: 30, lineHeight: 1.35, color: 'rgba(255,255,255,0.85)', marginBottom: 28, maxWidth: 920 }}>
        Cover, ιστορία, γκαλερί, χάρτης, amenities, FAQs, κανόνες, emergency numbers — σε 6 γλώσσες.
      </div>

      {/* Browser mockup centered */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        width: 780, height: 400,
        backgroundColor: 'white',
        borderRadius: 18,
        overflow: 'hidden',
        alignSelf: 'center',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          backgroundColor: '#f1f5f9', padding: '14px 18px',
        }}>
          <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 9999, backgroundColor: '#ef4444' }} />
          <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 9999, backgroundColor: '#f59e0b' }} />
          <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 9999, backgroundColor: '#10b981' }} />
          <div style={{
            display: 'flex', flex: 1, marginLeft: 14,
            backgroundColor: 'white', borderRadius: 8,
            padding: '6px 14px', fontSize: 16, color: '#64748b',
          }}>chalkidikihub.gr/listings/…</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: 24, color: '#0f172a' }}>
          <div style={{ display: 'flex', height: 150, backgroundImage: 'linear-gradient(135deg, #8b5cf6, #0ea5e9)', borderRadius: 12, marginBottom: 16 }} />
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Το κατάλυμά σου</div>
          <div style={{ fontSize: 16, color: '#64748b', marginBottom: 14 }}>Σιθωνία, Χαλκιδική</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[0,1,2,3,4].map(i => <div key={i} style={{ display: 'flex', height: 48, width: 100, backgroundColor: '#e2e8f0', borderRadius: 8 }} />)}
          </div>
        </div>
      </div>

      {/* Language pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
        {['ΕΛ', 'EN', 'DE', 'BG', 'RU', 'RO'].map((l) => (
          <div key={l} style={{
            display: 'flex',
            backgroundColor: 'rgba(139,92,246,0.2)',
            border: '1px solid rgba(139,92,246,0.4)',
            borderRadius: 10,
            padding: '10px 18px',
            fontSize: 24, fontWeight: 700,
            color: '#ddd6fe',
          }}>{l}</div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

function QrCode() {
  return (
    <div style={{
      width: W, height: H,
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)',
      color: 'white', padding: '60px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -140, left: -140, width: 420, height: 420, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.4), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="sky" /></div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#7dd3fc', marginBottom: 10 }}>#3 · QR για επισκέπτες</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>Ο guest ρωτάει.</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#38bdf8', marginBottom: 28 }}>
        Το QR απαντάει.
      </div>

      {/* QR centered with list around */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, justifyContent: 'center', marginTop: 10 }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: 320, height: 320,
          backgroundColor: 'white',
          borderRadius: 18,
          padding: 20,
          boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: 3 }}>
            {Array.from({ length: 12 }).map((_, row) => (
              <div key={row} style={{ display: 'flex', flex: 1, gap: 3 }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {['📶 Wi-Fi password', '🚨 Emergency numbers', '🏖️ Κοντινές παραλίες', '🍽️ Εστιατόρια', '🏛️ Αξιοθέατα'].map((t) => (
            <div key={t} style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.92)', fontWeight: 600 }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30, fontSize: 26, fontWeight: 700, color: '#bae6fd' }}>
        Μηδέν ερωτήσεις στο 11 το βράδυ 😴
      </div>

      <Footer />
    </div>
  );
}

function SocialKit() {
  return (
    <div style={{
      width: W, height: H,
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #4c0519 0%, #0f172a 100%)',
      color: 'white', padding: '60px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -140, right: -140, width: 420, height: 420, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(244,63,94,0.4), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="rose" /></div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#fda4af', marginBottom: 10 }}>#4 · Social Media Kit</div>
      <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>
        1 κλικ.
      </div>
      <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#fb7185', marginBottom: 20 }}>
        3 graphics.
      </div>
      <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.85)', marginBottom: 36, lineHeight: 1.35, maxWidth: 920 }}>
        IG Square, IG Story, FB/X Card — έτοιμα με τη φωτογραφία σου & QR.
      </div>

      {/* 3 mockup cards row */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* IG Square */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: 260, height: 260,
          backgroundImage: 'linear-gradient(160deg, #f59e0b, #ef4444, #ec4899)',
          borderRadius: 14, padding: 18,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', fontSize: 13, fontWeight: 700, color: 'white', opacity: 0.85 }}>IG SQUARE</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Το κατάλυμά σου</div>
          <div style={{ display: 'flex', marginTop: 12, width: 50, height: 50, backgroundColor: 'white', borderRadius: 8 }} />
        </div>
        {/* IG Story */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: 200, height: 360,
          backgroundImage: 'linear-gradient(180deg, #0ea5e9, #1e1b4b)',
          borderRadius: 14, padding: 18,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: 'white', opacity: 0.85 }}>IG STORY</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Book now</div>
          <div style={{ display: 'flex', marginTop: 10, width: 46, height: 46, backgroundColor: 'white', borderRadius: 8 }} />
        </div>
        {/* FB Card */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          width: 380, height: 210,
          backgroundImage: 'linear-gradient(135deg, #10b981, #0f172a)',
          borderRadius: 14, padding: 18,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', fontSize: 13, fontWeight: 700, color: 'white', opacity: 0.85 }}>FB / X CARD</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Share anywhere</div>
          <div style={{ display: 'flex', marginTop: 10, width: 46, height: 46, backgroundColor: 'white', borderRadius: 8 }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, fontSize: 26, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
        Αντί για <span style={{ fontWeight: 800, color: '#fda4af', margin: '0 10px' }}>2-3 ώρες</span> στο Canva.
      </div>

      <Footer />
    </div>
  );
}

function Analytics() {
  const bars = [4, 8, 6, 12, 10, 16, 14, 22, 18, 26, 24, 32, 28, 36, 40];
  const maxBar = Math.max(...bars);

  return (
    <div style={{
      width: W, height: H,
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #78350f 0%, #0f172a 100%)',
      color: 'white', padding: '60px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -140, right: -140, width: 420, height: 420, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="amber" /></div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#fcd34d', marginBottom: 10 }}>#5 · Στατιστικά προβολών</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>Ξέρεις.</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#fcd34d', marginBottom: 24 }}>
        Δεν μαντεύεις.
      </div>

      {/* Dashboard mockup */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 20,
        padding: 32,
      }}>
        <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Τελευταίες 30 ημέρες</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', fontSize: 70, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>2.847</div>
          <div style={{ display: 'flex', fontSize: 24, color: '#34d399', fontWeight: 700 }}>↗ +34%</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 170 }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              display: 'flex',
              flex: 1,
              height: `${(h / maxBar) * 100}%`,
              backgroundImage: 'linear-gradient(180deg, #fcd34d, #f59e0b)',
              borderRadius: 6,
            }} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 30, fontSize: 22, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
        <div style={{ display: 'flex' }}>🌍 Χώρες</div>
        <div style={{ display: 'flex' }}>🔗 Πηγές</div>
        <div style={{ display: 'flex' }}>📅 Μέρες</div>
        <div style={{ display: 'flex' }}>🌐 Γλώσσες</div>
      </div>

      <Footer />
    </div>
  );
}

function ZeroCommission() {
  return (
    <div style={{
      width: W, height: H,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      backgroundImage: 'linear-gradient(135deg, #312e81 0%, #0f172a 100%)',
      color: 'white', padding: '60px',
    }}>
      <div style={{ display: 'flex', position: 'absolute', top: -160, left: -160, width: 460, height: 460, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)' }} />
      <div style={{ display: 'flex', position: 'absolute', bottom: -160, right: -160, width: 460, height: 460, borderRadius: 9999, backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.35), transparent 70%)' }} />

      <div style={{ display: 'flex', marginBottom: 40 }}><BrandChip accent="indigo" /></div>

      <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: '#a5b4fc', marginBottom: 8 }}>#6 · Προμήθεια σε κάθε κράτηση</div>
      <div style={{
        display: 'flex',
        fontSize: 420,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.05em',
        backgroundImage: 'linear-gradient(135deg, #34d399, #6366f1)',
        backgroundClip: 'text',
        color: 'transparent',
      }}>
        0%
      </div>
      <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginTop: 10 }}>
        Καμία προμήθεια. Ποτέ.
      </div>
      <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.65)', marginTop: 14, maxWidth: 900, lineHeight: 1.4 }}>
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
    width: W,
    height: H,
    fonts: fonts.length > 0 ? fonts : undefined,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
