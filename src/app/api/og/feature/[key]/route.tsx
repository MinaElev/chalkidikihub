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

const W = 1080;
const H = 1080;

// ─────────────────────────────────────────────────────────────
// Shared building blocks
// ─────────────────────────────────────────────────────────────

type Accent = 'emerald' | 'violet' | 'sky' | 'rose' | 'amber' | 'indigo' | 'teal' | 'pink' | 'orange' | 'lime';

const PALETTE: Record<Accent, { bg: string; fg: string; bgSolid: string; strong: string; glow: string }> = {
  emerald: { bg: 'rgba(16,185,129,0.25)', fg: '#a7f3d0', bgSolid: '#10b981', strong: '#34d399', glow: 'rgba(16,185,129,0.4)' },
  violet:  { bg: 'rgba(139,92,246,0.25)', fg: '#ddd6fe', bgSolid: '#8b5cf6', strong: '#c4b5fd', glow: 'rgba(139,92,246,0.4)' },
  sky:     { bg: 'rgba(14,165,233,0.25)', fg: '#bae6fd', bgSolid: '#0ea5e9', strong: '#38bdf8', glow: 'rgba(14,165,233,0.4)' },
  rose:    { bg: 'rgba(244,63,94,0.25)',  fg: '#fecdd3', bgSolid: '#f43f5e', strong: '#fb7185', glow: 'rgba(244,63,94,0.4)' },
  amber:   { bg: 'rgba(245,158,11,0.3)',  fg: '#fde68a', bgSolid: '#f59e0b', strong: '#fcd34d', glow: 'rgba(245,158,11,0.4)' },
  indigo:  { bg: 'rgba(99,102,241,0.25)', fg: '#c7d2fe', bgSolid: '#6366f1', strong: '#a5b4fc', glow: 'rgba(99,102,241,0.4)' },
  teal:    { bg: 'rgba(20,184,166,0.25)', fg: '#99f6e4', bgSolid: '#14b8a6', strong: '#5eead4', glow: 'rgba(20,184,166,0.4)' },
  pink:    { bg: 'rgba(236,72,153,0.25)', fg: '#fbcfe8', bgSolid: '#ec4899', strong: '#f9a8d4', glow: 'rgba(236,72,153,0.4)' },
  orange:  { bg: 'rgba(249,115,22,0.25)', fg: '#fed7aa', bgSolid: '#f97316', strong: '#fb923c', glow: 'rgba(249,115,22,0.4)' },
  lime:    { bg: 'rgba(132,204,22,0.25)', fg: '#d9f99d', bgSolid: '#84cc16', strong: '#bef264', glow: 'rgba(132,204,22,0.4)' },
};

function BrandChip({ accent = 'emerald', label = 'ChalkidikiHub · Για ιδιοκτήτες' }: { accent?: Accent; label?: string }) {
  const c = PALETTE[accent];
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      backgroundColor: c.bg, color: c.fg,
      borderRadius: 9999, padding: '10px 22px',
      fontSize: 22, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>{label}</div>
  );
}

function Footer({ tagline = 'Δωρεάν. Χωρίς όρους.' }: { tagline?: string }) {
  return (
    <div style={{
      position: 'absolute', bottom: 48, left: 60, right: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontSize: 28, fontWeight: 700, color: '#a7f3d0',
    }}>
      <div style={{ display: 'flex', color: 'rgba(255,255,255,0.5)', fontSize: 22 }}>{tagline}</div>
      <div style={{ display: 'flex' }}>chalkidikihub.gr →</div>
    </div>
  );
}

function Glow({ accent, pos = 'tr' }: { accent: Accent; pos?: 'tr' | 'tl' | 'br' | 'bl' }) {
  const posStyle =
    pos === 'tr' ? { top: -140, right: -140 } :
    pos === 'tl' ? { top: -140, left: -140 } :
    pos === 'br' ? { bottom: -140, right: -140 } :
                   { bottom: -140, left: -140 };
  return (
    <div style={{
      display: 'flex', position: 'absolute',
      ...posStyle,
      width: 420, height: 420, borderRadius: 9999,
      backgroundImage: `radial-gradient(circle, ${PALETTE[accent].glow}, transparent 70%)`,
    }} />
  );
}

function Canvas({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: W, height: H, position: 'relative',
      display: 'flex', flexDirection: 'column',
      backgroundImage: bg, color: 'white', padding: '60px',
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. OWNERS — pain point posts
// ─────────────────────────────────────────────────────────────

function FreeSignup() {
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #064e3b 100%)">
      <Glow accent="emerald" />
      <div style={{ display: 'flex', marginBottom: 32 }}><BrandChip /></div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 44 }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: '#34d399', marginBottom: 10 }}>#1 · Δωρεάν εγγραφή</div>
        <div style={{ fontSize: 102, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>2 λεπτά.</div>
        <div style={{ fontSize: 102, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#34d399' }}>Καμία</div>
        <div style={{ fontSize: 102, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#34d399' }}>πιστωτική.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[['1','Δίνεις email + κωδικό'],['2','Ανεβάζεις φωτογραφίες & πληροφορίες'],['3','Τέλος. Είσαι live.']].map(([n,t]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 9999, backgroundColor: '#10b981', color: 'white', fontSize: 30, fontWeight: 800 }}>{n}</div>
            <div style={{ display: 'flex', fontSize: 32, fontWeight: 600 }}>{t}</div>
          </div>
        ))}
      </div>
      <Footer />
    </Canvas>
  );
}

function PersonalSite() {
  return (
    <Canvas bg="linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)">
      <Glow accent="violet" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="violet" /></div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#c4b5fd', marginBottom: 10 }}>#2 · Προσωπικό site</div>
      <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', marginBottom: 20 }}>Δικό σου brand.</div>
      <div style={{ fontSize: 30, lineHeight: 1.35, color: 'rgba(255,255,255,0.85)', marginBottom: 28, maxWidth: 920 }}>
        Cover, ιστορία, γκαλερί, χάρτης, amenities, FAQs, κανόνες, emergency numbers — σε 6 γλώσσες.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: 780, height: 400, backgroundColor: 'white', borderRadius: 18, overflow: 'hidden', alignSelf: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#f1f5f9', padding: '14px 18px' }}>
          {['#ef4444','#f59e0b','#10b981'].map(c => <div key={c} style={{ display: 'flex', width: 14, height: 14, borderRadius: 9999, backgroundColor: c }} />)}
          <div style={{ display: 'flex', flex: 1, marginLeft: 14, backgroundColor: 'white', borderRadius: 8, padding: '6px 14px', fontSize: 16, color: '#64748b' }}>chalkidikihub.gr/listings/…</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: 24, color: '#0f172a' }}>
          <div style={{ display: 'flex', height: 150, backgroundImage: 'linear-gradient(135deg, #8b5cf6, #0ea5e9)', borderRadius: 12, marginBottom: 16 }} />
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Το κατάλυμά σου</div>
          <div style={{ fontSize: 16, color: '#64748b', marginBottom: 14 }}>Σιθωνία, Χαλκιδική</div>
          <div style={{ display: 'flex', gap: 8 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ display: 'flex', height: 48, width: 100, backgroundColor: '#e2e8f0', borderRadius: 8 }} />)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
        {['ΕΛ','EN','DE','BG','RU','RO'].map(l => (
          <div key={l} style={{ display: 'flex', backgroundColor: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 10, padding: '10px 18px', fontSize: 24, fontWeight: 700, color: '#ddd6fe' }}>{l}</div>
        ))}
      </div>
      <Footer />
    </Canvas>
  );
}

function QrCode() {
  return (
    <Canvas bg="linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)">
      <Glow accent="sky" pos="tl" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="sky" /></div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#7dd3fc', marginBottom: 10 }}>#3 · QR για επισκέπτες</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>Ο guest ρωτάει.</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#38bdf8', marginBottom: 28 }}>Το QR απαντάει.</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 320, height: 320, backgroundColor: 'white', borderRadius: 18, padding: 20, boxShadow: '0 30px 70px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: 3 }}>
            {Array.from({ length: 12 }).map((_, row) => (
              <div key={row} style={{ display: 'flex', flex: 1, gap: 3 }}>
                {Array.from({ length: 12 }).map((_, col) => {
                  const filled = ((row * 3 + col * 7 + row * col) % 3) !== 0;
                  const corner = (row < 3 && col < 3) || (row < 3 && col > 8) || (row > 8 && col < 3);
                  return <div key={col} style={{ display: 'flex', flex: 1, backgroundColor: corner ? '#0f172a' : (filled ? '#0f172a' : 'transparent'), borderRadius: 2 }} />;
                })}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {['📶 Wi-Fi password','🚨 Emergency numbers','🏖️ Κοντινές παραλίες','🍽️ Εστιατόρια','🏛️ Αξιοθέατα'].map(t => (
            <div key={t} style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.92)', fontWeight: 600 }}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30, fontSize: 26, fontWeight: 700, color: '#bae6fd' }}>Μηδέν ερωτήσεις στο 11 το βράδυ 😴</div>
      <Footer />
    </Canvas>
  );
}

function SocialKit() {
  return (
    <Canvas bg="linear-gradient(135deg, #4c0519 0%, #0f172a 100%)">
      <Glow accent="rose" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="rose" /></div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#fda4af', marginBottom: 10 }}>#4 · Social Media Kit</div>
      <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>1 κλικ.</div>
      <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#fb7185', marginBottom: 20 }}>3 graphics.</div>
      <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.85)', marginBottom: 36, lineHeight: 1.35, maxWidth: 920 }}>
        IG Square, IG Story, FB/X Card — έτοιμα με τη φωτογραφία σου & QR.
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 260, height: 260, backgroundImage: 'linear-gradient(160deg, #f59e0b, #ef4444, #ec4899)', borderRadius: 14, padding: 18, boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', fontSize: 13, fontWeight: 700, color: 'white', opacity: 0.85 }}>IG SQUARE</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 800, color: 'white' }}>Το κατάλυμά σου</div>
          <div style={{ display: 'flex', marginTop: 12, width: 50, height: 50, backgroundColor: 'white', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: 200, height: 360, backgroundImage: 'linear-gradient(180deg, #0ea5e9, #1e1b4b)', borderRadius: 14, padding: 18, boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: 'white', opacity: 0.85 }}>IG STORY</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 800, color: 'white' }}>Book now</div>
          <div style={{ display: 'flex', marginTop: 10, width: 46, height: 46, backgroundColor: 'white', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: 380, height: 210, backgroundImage: 'linear-gradient(135deg, #10b981, #0f172a)', borderRadius: 14, padding: 18, boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', fontSize: 13, fontWeight: 700, color: 'white', opacity: 0.85 }}>FB / X CARD</div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 800, color: 'white' }}>Share anywhere</div>
          <div style={{ display: 'flex', marginTop: 10, width: 46, height: 46, backgroundColor: 'white', borderRadius: 8 }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, fontSize: 26, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
        Αντί για <span style={{ fontWeight: 800, color: '#fda4af', margin: '0 10px' }}>2-3 ώρες</span> στο Canva.
      </div>
      <Footer />
    </Canvas>
  );
}

function Analytics() {
  const bars = [4, 8, 6, 12, 10, 16, 14, 22, 18, 26, 24, 32, 28, 36, 40];
  const maxBar = Math.max(...bars);
  return (
    <Canvas bg="linear-gradient(135deg, #78350f 0%, #0f172a 100%)">
      <Glow accent="amber" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="amber" /></div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#fcd34d', marginBottom: 10 }}>#5 · Στατιστικά προβολών</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em' }}>Ξέρεις.</div>
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#fcd34d', marginBottom: 24 }}>Δεν μαντεύεις.</div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 32 }}>
        <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Τελευταίες 30 ημέρες</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', fontSize: 70, fontWeight: 800, letterSpacing: '-0.02em' }}>2.847</div>
          <div style={{ display: 'flex', fontSize: 24, color: '#34d399', fontWeight: 700 }}>↗ +34%</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 170 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ display: 'flex', flex: 1, height: `${(h / maxBar) * 100}%`, backgroundImage: 'linear-gradient(180deg, #fcd34d, #f59e0b)', borderRadius: 6 }} />
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
    </Canvas>
  );
}

function ZeroCommission() {
  return (
    <Canvas bg="linear-gradient(135deg, #312e81 0%, #0f172a 100%)">
      <Glow accent="indigo" pos="tl" />
      <Glow accent="emerald" pos="br" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <div style={{ display: 'flex', marginBottom: 40 }}><BrandChip accent="indigo" /></div>
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: '#a5b4fc', marginBottom: 8 }}>#6 · Προμήθεια σε κάθε κράτηση</div>
        <div style={{ display: 'flex', fontSize: 420, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.05em', backgroundImage: 'linear-gradient(135deg, #34d399, #6366f1)', backgroundClip: 'text', color: 'transparent' }}>0%</div>
        <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginTop: 10 }}>Καμία προμήθεια. Ποτέ.</div>
        <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.65)', marginTop: 14, maxWidth: 900, lineHeight: 1.4, textAlign: 'center' }}>Οι επισκέπτες σε καλούν απευθείας. Όλη η κράτηση μένει σε εσένα.</div>
      </div>
      <Footer />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. OWNERS — extra pain points
// ─────────────────────────────────────────────────────────────

function AskAgain() {
  return (
    <Canvas bg="linear-gradient(135deg, #422006 0%, #0f172a 100%)">
      <Glow accent="orange" pos="tl" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="orange" /></div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        <div style={{ display: 'flex', fontSize: 32, color: '#fed7aa', marginBottom: 14 }}>«Πώς θα έρθω;»</div>
        <div style={{ display: 'flex', fontSize: 32, color: '#fed7aa', marginBottom: 14 }}>«Ποιο είναι το Wi-Fi;»</div>
        <div style={{ display: 'flex', fontSize: 32, color: '#fed7aa', marginBottom: 40 }}>«Πού θα φάμε;»</div>
        <div style={{ display: 'flex', fontSize: 260, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: '#fb923c' }}>47×</div>
        <div style={{ display: 'flex', fontSize: 42, fontWeight: 700, marginTop: 10 }}>φέτος το εξήγησες.</div>
        <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.7)', marginTop: 16, lineHeight: 1.35, maxWidth: 900 }}>
          Με το <span style={{ color: '#fb923c', fontWeight: 800, margin: '0 8px' }}>δωρεάν QR</span> του ChalkidikiHub — μηδέν φορές.
        </div>
      </div>
      <Footer />
    </Canvas>
  );
}

function CanvaVsUs() {
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)">
      <Glow accent="emerald" pos="br" />
      <div style={{ display: 'flex', marginBottom: 32 }}><BrandChip /></div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.05, marginBottom: 6 }}>Κάνεις τα ίδια.</div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.05, color: '#34d399', marginBottom: 40 }}>Γλιτώνεις €144/χρόνο.</div>
      <div style={{ display: 'flex', gap: 20, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Canva Pro</div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, lineHeight: 1, color: '#f87171' }}>€12</div>
          <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>/ μήνα</div>
          {['Templates','DIY graphics','Manual export','Δίχως QR','Δίχως analytics'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
              <span style={{ display: 'flex', width: 22, height: 22, borderRadius: 9999, backgroundColor: '#7f1d1d', color: '#fca5a5', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>×</span>
              {t}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundImage: 'linear-gradient(160deg, rgba(16,185,129,0.18), rgba(16,185,129,0.04))', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#a7f3d0', marginBottom: 8 }}>ChalkidikiHub</div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, lineHeight: 1, color: '#34d399' }}>€0</div>
          <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>για πάντα</div>
          {['Auto από τα στοιχεία σου','3 formats ready','1-click ZIP','QR κάθε graphic','Analytics μέσα'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, color: 'white', marginBottom: 8 }}>
              <span style={{ display: 'flex', width: 22, height: 22, borderRadius: 9999, backgroundColor: '#10b981', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>✓</span>
              {t}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Canvas>
  );
}

function CommissionCalc() {
  return (
    <Canvas bg="linear-gradient(135deg, #450a0a 0%, #0f172a 100%)">
      <Glow accent="rose" pos="tr" />
      <div style={{ display: 'flex', marginBottom: 32 }}><BrandChip accent="rose" /></div>
      <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, lineHeight: 1.05, marginBottom: 36 }}>
        Πόσα χάνεις σε προμήθειες;
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: 32, gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>Μέση τιμή/βράδυ</div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 800 }}>€100</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>Βράδια / σεζόν</div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 800 }}>60</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>Πλατφόρμα προμήθεια</div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, color: '#fb7185' }}>15%</div>
        </div>
        <div style={{ display: 'flex', height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 700 }}>Χάνεις</div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, color: '#f43f5e' }}>€900</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 30 }}>
        <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.7)' }}>Με ChalkidikiHub;</div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, color: '#34d399' }}>€0 — όλα δικά σου.</div>
      </div>
      <Footer />
    </Canvas>
  );
}

function ThreeMinuteSite() {
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #065f46 100%)">
      <Glow accent="teal" pos="br" />
      <div style={{ display: 'flex', marginBottom: 32 }}><BrandChip accent="teal" /></div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>Φτιάξε το site σου</div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 800, lineHeight: 1.05, color: '#5eead4', marginBottom: 40 }}>πριν πιεις τον καφέ σου.</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 520, height: 520, borderRadius: 9999, border: '12px solid rgba(94,234,212,0.3)', justifyContent: 'center', backgroundColor: 'rgba(20,184,166,0.08)' }}>
          <div style={{ display: 'flex', fontSize: 180, fontWeight: 800, lineHeight: 1, color: '#5eead4', letterSpacing: '-0.05em' }}>3:24</div>
          <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>min : sec</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 28, color: 'rgba(255,255,255,0.85)', marginTop: 16 }}>☕ Πιο γρήγορο από ένα espresso.</div>
      <Footer />
    </Canvas>
  );
}

function SixLanguages() {
  const quotes = [
    { flag: '🇬🇧', txt: '"Everything was clear."', lang: 'English' },
    { flag: '🇩🇪', txt: '"Alles war perfekt."', lang: 'Deutsch' },
    { flag: '🇧🇬', txt: '"Всичко беше ясно."', lang: 'Български' },
    { flag: '🇷🇺', txt: '"Всё было понятно."', lang: 'Русский' },
    { flag: '🇷🇴', txt: '"Totul a fost clar."', lang: 'Română' },
    { flag: '🇬🇷', txt: '"Όλα καθαρά."', lang: 'Ελληνικά' },
  ];
  return (
    <Canvas bg="linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)">
      <Glow accent="sky" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="sky" /></div>
      <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>Μιλάμε τη γλώσσα</div>
      <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, lineHeight: 1.05, color: '#38bdf8', marginBottom: 34 }}>του guest σου.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, flex: 1 }}>
        {quotes.map(q => (
          <div key={q.lang} style={{ display: 'flex', flexDirection: 'column', width: 460, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 700, color: '#bae6fd', marginBottom: 8 }}>
              <span style={{ display: 'flex', fontSize: 32 }}>{q.flag}</span>{q.lang}
            </div>
            <div style={{ display: 'flex', fontSize: 26, color: 'white', fontWeight: 600 }}>{q.txt}</div>
          </div>
        ))}
      </div>
      <Footer />
    </Canvas>
  );
}

function SeasonCountdown() {
  return (
    <Canvas bg="linear-gradient(135deg, #7c2d12 0%, #0f172a 100%)">
      <Glow accent="orange" pos="tr" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="orange" /></div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', fontSize: 36, color: '#fed7aa', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Countdown</div>
        <div style={{ display: 'flex', fontSize: 340, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.05em', backgroundImage: 'linear-gradient(135deg, #fb923c, #f43f5e)', backgroundClip: 'text', color: 'transparent' }}>57</div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 800, marginTop: 8 }}>μέρες μέχρι</div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 800, color: '#fb923c' }}>την πρώτη κράτηση.</div>
        <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.75)', marginTop: 24, lineHeight: 1.4, maxWidth: 900, textAlign: 'center' }}>
          Ανέβασε το κατάλυμά σου σήμερα στο ChalkidikiHub. Έτοιμο για τη σεζόν 2026.
        </div>
      </div>
      <Footer />
    </Canvas>
  );
}

function AirbnbVsUs() {
  const rows = [
    ['Προμήθεια', '~15%', '€0'],
    ['Επικοινωνία', 'Μέσα από platform', 'Απευθείας'],
    ['QR για επισκέπτες', 'Όχι', 'Ναι'],
    ['Social Media Kit', 'Όχι', 'Ναι'],
    ['6 γλώσσες', 'Αυτόματο', 'Auto + editable'],
    ['Δικό σου site', 'Όχι', 'Ναι'],
  ];
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)">
      <Glow accent="emerald" pos="br" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip /></div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>Γιατί να μην είσαι</div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 800, lineHeight: 1.05, marginBottom: 36 }}>μόνο στα big players;</div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.5)', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', flex: 2 }}>Feature</div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>Τα γνωστά</div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', color: '#34d399', fontWeight: 700 }}>ChalkidikiHub</div>
        </div>
        {rows.map(([k, a, b], i) => (
          <div key={i} style={{ display: 'flex', fontSize: 22, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', flex: 2, color: 'rgba(255,255,255,0.85)' }}>{k}</div>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>{a}</div>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', color: '#34d399', fontWeight: 700 }}>{b}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>Είσαι και στα δύο. Κερδίζεις διπλά.</div>
      <Footer />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. TRAVELERS — demand-side
// ─────────────────────────────────────────────────────────────

function ThreeLegs() {
  const legs = [
    { name: 'Κασσάνδρα', tag: 'Party · Beach · Nightlife', color: '#fb923c', bg: 'linear-gradient(180deg, #ea580c, #7c2d12)' },
    { name: 'Σιθωνία',   tag: 'Wild · Untouched · Cove', color: '#34d399', bg: 'linear-gradient(180deg, #059669, #064e3b)' },
    { name: 'Άθως',      tag: 'Spiritual · Ancient · Deep', color: '#a78bfa', bg: 'linear-gradient(180deg, #7c3aed, #1e1b4b)' },
  ];
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)">
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="teal" label="ChalkidikiHub · Discover" /></div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>3 πόδια.</div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.05, marginBottom: 40, color: '#5eead4' }}>3 διαφορετικοί κόσμοι.</div>
      <div style={{ display: 'flex', gap: 18, flex: 1 }}>
        {legs.map(leg => (
          <div key={leg.name} style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundImage: leg.bg, borderRadius: 18, padding: 22, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Halkidiki</div>
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, lineHeight: 1.05, marginTop: 4 }}>{leg.name}</div>
            </div>
            <div style={{ display: 'flex', fontSize: 22, color: leg.color, fontWeight: 700 }}>{leg.tag}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28, fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>Ποιο είναι το δικό σου;</div>
      <Footer tagline="Discover Halkidiki" />
    </Canvas>
  );
}

function SunsetSpots() {
  const spots = [
    { n: '1', name: 'Nikiti Waterfront', where: 'Σιθωνία' },
    { n: '2', name: 'Kassandra Tip (Possidi)', where: 'Κασσάνδρα' },
    { n: '3', name: 'Κούφος', where: 'Σιθωνία' },
    { n: '4', name: 'Σάρτη — Kavourotripes', where: 'Σιθωνία' },
    { n: '5', name: 'Πευκοχώρι beach', where: 'Κασσάνδρα' },
  ];
  return (
    <Canvas bg="linear-gradient(160deg, #7c2d12 0%, #f97316 40%, #be123c 100%)">
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="orange" label="ChalkidikiHub · Sunsets" /></div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 6 }}>5 ηλιοβασιλέματα</div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 36, color: '#fef3c7' }}>που αξίζουν το ταξίδι.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {spots.map(s => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 20, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 9999, backgroundColor: '#fef3c7', color: '#7c2d12', fontSize: 28, fontWeight: 800 }}>{s.n}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 800 }}>{s.name}</div>
              <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.8)' }}>{s.where}</div>
            </div>
          </div>
        ))}
      </div>
      <Footer tagline="📍 chalkidikihub.gr" />
    </Canvas>
  );
}

function HiddenVillages() {
  const villages = ['Παρθενώνας', 'Άγιος Νικόλαος', 'Νικήτη Παλιά', 'Αρναία', 'Παλαιοχώρι', 'Ολυμπιάδα'];
  return (
    <Canvas bg="linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)">
      <Glow accent="indigo" pos="tl" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="indigo" label="ChalkidikiHub · Off the path" /></div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>Χωριά που οι</div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 40, color: '#a5b4fc' }}>τουρίστες δεν βρίσκουν.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, flex: 1 }}>
        {villages.map(v => (
          <div key={v} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: 300, height: 200, backgroundImage: 'linear-gradient(160deg, rgba(99,102,241,0.2), rgba(15,23,42,0.8))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 800 }}>{v}</div>
            <div style={{ display: 'flex', fontSize: 18, color: '#a5b4fc' }}>🌿 Παραδοσιακό</div>
          </div>
        ))}
      </div>
      <Footer tagline="🌿 chalkidikihub.gr/villages" />
    </Canvas>
  );
}

function DidYouKnow() {
  return (
    <Canvas bg="linear-gradient(135deg, #831843 0%, #0f172a 100%)">
      <Glow accent="pink" pos="tr" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="pink" label="Did you know?" /></div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', fontSize: 34, color: '#fbcfe8', marginBottom: 16, fontWeight: 700 }}>Η Χαλκιδική έχει</div>
        <div style={{ display: 'flex', fontSize: 220, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: '#f472b6' }}>550+</div>
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, marginTop: 10 }}>χιλιόμετρα ακτογραμμής.</div>
        <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.7)', marginTop: 24, lineHeight: 1.4, maxWidth: 900 }}>
          Περισσότερα από κάθε άλλη περιοχή της Βόρειας Ελλάδας. Κάθε παραλία έχει τη δική της προσωπικότητα.
        </div>
      </div>
      <Footer tagline="🏖️ Discover them all" />
    </Canvas>
  );
}

function MountAthos() {
  return (
    <Canvas bg="linear-gradient(180deg, #1e1b4b 0%, #3b0764 50%, #0f172a 100%)">
      <Glow accent="violet" pos="br" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="violet" label="Mount Athos · Άγιον Όρος" /></div>
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>20 μοναστήρια.</div>
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 800, lineHeight: 1.05, marginBottom: 10, color: '#c4b5fd' }}>1.000+ χρόνια.</div>
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 800, lineHeight: 1.05, marginBottom: 36 }}>1 UNESCO τόπος.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 1 }}>
        {['Μ. Λαύρα','Βατοπέδι','Ιβήρων','Χιλανδάρι','Διονυσίου','Κουτλουμούσι','Παντοκράτορος','Ξηροποτάμου','Ζωγράφου','Δοχειαρίου','Καρακάλλου','Φιλοθέου','Σίμωνος Πέτρα','Αγ. Παύλος','Σταυρονικήτα','Ξενοφώντος','Γρηγορίου','Εσφιγμένου','Παντελεήμονος','Κωνσταμονίτου'].map(m => (
            <div key={m} style={{ display: 'flex', backgroundColor: 'rgba(139,92,246,0.15)', border: '1px solid rgba(196,181,253,0.3)', borderRadius: 10, padding: '10px 16px', fontSize: 19, fontWeight: 600, color: '#ddd6fe' }}>{m}</div>
        ))}
      </div>
      <Footer tagline="⛪ Πλήρης οδηγός στο chalkidikihub.gr/mount-athos" />
    </Canvas>
  );
}

function BestTime() {
  const months = [
    { m: 'Ιαν', h: 3, lbl: 'Ήσυχα' }, { m: 'Φεβ', h: 4, lbl: 'Ήσυχα' },
    { m: 'Μαρ', h: 6, lbl: 'Άνοιξη' }, { m: 'Απρ', h: 9, lbl: 'Άνοιξη' },
    { m: 'Μαϊ', h: 14, lbl: 'Ζεστά' }, { m: 'Ιουν', h: 20, lbl: 'Peak' },
    { m: 'Ιουλ', h: 28, lbl: 'Peak' }, { m: 'Αυγ', h: 30, lbl: 'Peak' },
    { m: 'Σεπ', h: 22, lbl: 'Ιδανικό' }, { m: 'Οκτ', h: 12, lbl: 'Ιδανικό' },
    { m: 'Νοε', h: 5, lbl: 'Ήσυχα' }, { m: 'Δεκ', h: 4, lbl: 'Ήσυχα' },
  ];
  const maxH = 30;
  return (
    <Canvas bg="linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)">
      <Glow accent="sky" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="sky" label="When to visit" /></div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>Πότε να έρθεις;</div>
      <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.75)', marginBottom: 30 }}>Crowd level · μήνας προς μήνα</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 460, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        {months.map(mo => {
          const isPeak = mo.h > 24;
          return (
            <div key={mo.m} style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{mo.lbl}</div>
              <div style={{ display: 'flex', width: '80%', height: `${(mo.h / maxH) * 380}px`, backgroundImage: isPeak ? 'linear-gradient(180deg, #f87171, #dc2626)' : 'linear-gradient(180deg, #38bdf8, #0369a1)', borderRadius: 6 }} />
              <div style={{ display: 'flex', fontSize: 18, fontWeight: 700, color: 'white', marginTop: 8 }}>{mo.m}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 20, fontSize: 20, color: 'rgba(255,255,255,0.7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ display: 'flex', width: 14, height: 14, backgroundColor: '#38bdf8', borderRadius: 3 }} />Quiet / Shoulder</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ display: 'flex', width: 14, height: 14, backgroundColor: '#dc2626', borderRadius: 3 }} />Peak season</div>
      </div>
      <Footer tagline="📅 Πλήρης guide online" />
    </Canvas>
  );
}

function Activities() {
  const acts = [
    { e: '🤿', name: 'Scuba diving', where: 'Σιθωνία · Αμμουλιανή' },
    { e: '⛵', name: 'Boat trips', where: 'Από 6 λιμάνια' },
    { e: '🥾', name: 'Hiking', where: 'Mount Itamos · Cholomontas' },
    { e: '🏍️', name: 'ATV & buggy', where: 'Off-road trails' },
    { e: '🏄', name: 'Windsurf · SUP', where: 'Πευκοχώρι · Σάρτη' },
    { e: '🍷', name: 'Wine tours', where: 'Παραγωγοί της περιοχής' },
  ];
  return (
    <Canvas bg="linear-gradient(135deg, #064e3b 0%, #0f172a 100%)">
      <Glow accent="lime" pos="tr" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="lime" label="Activities" /></div>
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>Όχι μόνο παραλία.</div>
      <div style={{ display: 'flex', fontSize: 62, fontWeight: 800, lineHeight: 1.05, marginBottom: 36, color: '#bef264' }}>Αυτή είναι Χαλκιδική.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, flex: 1 }}>
        {acts.map(a => (
          <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 18, width: 460, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(190,242,100,0.25)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', fontSize: 50 }}>{a.e}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 800 }}>{a.name}</div>
              <div style={{ display: 'flex', fontSize: 18, color: '#bef264' }}>{a.where}</div>
            </div>
          </div>
        ))}
      </div>
      <Footer tagline="🎯 chalkidikihub.gr/activities" />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. SOCIAL PROOF
// ─────────────────────────────────────────────────────────────

function ByTheNumbers() {
  const stats = [
    { n: '350+', l: 'Beaches indexed' },
    { n: '200+', l: 'Εστιατόρια' },
    { n: '150+', l: 'Activities' },
    { n: '20',   l: 'Μοναστήρια Άθω' },
    { n: '6',    l: 'Γλώσσες' },
    { n: '∞',    l: 'Listings · δωρεάν' },
  ];
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)">
      <Glow accent="emerald" pos="tr" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="emerald" label="By the numbers" /></div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>Η Χαλκιδική.</div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 40, color: '#34d399' }}>Σε ένα μέρος.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, flex: 1 }}>
        {stats.map(s => (
          <div key={s.l} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 300, height: 220, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', backgroundImage: 'linear-gradient(135deg, #34d399, #14b8a6)', backgroundClip: 'text', color: 'transparent' }}>{s.n}</div>
            <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginTop: 6 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <Footer />
    </Canvas>
  );
}

function NewFeature() {
  return (
    <Canvas bg="linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)">
      <Glow accent="violet" pos="tr" />
      <Glow accent="pink" pos="bl" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="pink" label="NEW · καινούργιο" /></div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', fontSize: 50, fontWeight: 700, color: '#f9a8d4', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Just shipped</div>
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', marginTop: 10 }}>Social Media</div>
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', color: '#f9a8d4' }}>Kit.</div>
        <div style={{ display: 'flex', fontSize: 32, color: 'rgba(255,255,255,0.8)', marginTop: 30, maxWidth: 900, lineHeight: 1.4 }}>
          3 έτοιμα graphics + QR + caption — με 1 κλικ. Δωρεάν για κάθε listing.
        </div>
      </div>
      <Footer tagline="🎉 /dashboard/listings" />
    </Canvas>
  );
}

function Milestone() {
  return (
    <Canvas bg="linear-gradient(135deg, #164e63 0%, #0f172a 100%)">
      <Glow accent="teal" pos="tl" />
      <Glow accent="emerald" pos="br" />
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', marginBottom: 40 }}><BrandChip accent="teal" label="🎉 Milestone" /></div>
        <div style={{ display: 'flex', fontSize: 32, color: '#99f6e4', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Αυτόν τον μήνα</div>
        <div style={{ display: 'flex', fontSize: 240, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', backgroundImage: 'linear-gradient(135deg, #5eead4, #14b8a6)', backgroundClip: 'text', color: 'transparent' }}>10K</div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 800, marginTop: 10 }}>ταξιδιώτες</div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 800, color: '#5eead4' }}>ανακάλυψαν τη Χαλκιδική.</div>
        <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.6)', marginTop: 24 }}>Ευχαριστούμε που είστε μαζί μας 🙏</div>
      </div>
      <Footer tagline="Thank you ❤️" />
    </Canvas>
  );
}

function Testimonial() {
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)">
      <Glow accent="emerald" pos="tl" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip label="Από έναν ιδιοκτήτη" /></div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', fontSize: 200, fontWeight: 800, color: '#34d399', lineHeight: 0.7 }}>"</div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 700, lineHeight: 1.25, marginTop: -30, maxWidth: 920 }}>
          Σε 5 λεπτά είχα site, QR, graphics. Ο πρώτος guest με κάλεσε απευθείας.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 70, height: 70, borderRadius: 9999, backgroundImage: 'linear-gradient(135deg, #10b981, #14b8a6)', fontSize: 32, fontWeight: 800 }}>Γ</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>Γιώργος Π.</div>
            <div style={{ display: 'flex', fontSize: 20, color: '#34d399' }}>Owner · Σιθωνία</div>
          </div>
        </div>
      </div>
      <Footer tagline="Μπες κι εσύ στο ChalkidikiHub" />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. EDUCATIONAL
// ─────────────────────────────────────────────────────────────

function PhotoTips() {
  const tips = [
    { n: '1', t: 'Πρωί φως · όχι μεσημέρι', desc: '8-10πμ ή 5-7μμ' },
    { n: '2', t: 'Δωμάτια καθαρά & αραιά', desc: 'Χωρίς σκορπισμένα' },
    { n: '3', t: 'Cover με θέα', desc: 'Πρώτη εικόνα = κλικ' },
    { n: '4', t: 'Λεπτομέρειες που "πουλάνε"', desc: 'Bar, μπαλκόνι, BBQ' },
    { n: '5', t: 'Ένα βίντεο 10s', desc: 'Τριπλασιάζει engagement' },
  ];
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)">
      <Glow accent="amber" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="amber" label="Educational · Tips" /></div>
      <div style={{ display: 'flex', fontSize: 58, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>5 λάθη στις φωτογραφίες</div>
      <div style={{ display: 'flex', fontSize: 58, fontWeight: 800, lineHeight: 1.05, marginBottom: 34, color: '#fcd34d' }}>του καταλύματός σου.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {tips.map(t => (
          <div key={t.n} style={{ display: 'flex', alignItems: 'center', gap: 22, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 12, backgroundColor: '#f59e0b', color: '#0f172a', fontSize: 28, fontWeight: 800 }}>{t.n}</div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 800 }}>{t.t}</div>
              <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.65)' }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <Footer tagline="💡 Save this post" />
    </Canvas>
  );
}

function LegalAMA() {
  const items = [
    { ok: true,  t: 'ΑΜΑ (Αριθμός Μητρώου Ακινήτου)' },
    { ok: true,  t: 'ΑΦΜ + Ε2 στη ΔΟΥ' },
    { ok: true,  t: 'Δήλωση βραχυχρόνιας μίσθωσης' },
    { ok: true,  t: 'Πυρασφάλεια (εξοπλισμός)' },
    { ok: true,  t: 'Απαραίτητα στοιχεία στο listing' },
    { ok: false, t: 'Άδεια ΕΟΤ (προαιρετικό · όχι για βραχυχρόνια)' },
  ];
  return (
    <Canvas bg="linear-gradient(135deg, #0f172a 0%, #7f1d1d 100%)">
      <Glow accent="rose" pos="br" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="rose" label="Legal checklist" /></div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 10 }}>Τι χρειάζεσαι</div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 34, color: '#fb7185' }}>νόμιμα για AirBnB/βραχυχρόνια.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 9999, backgroundColor: it.ok ? '#10b981' : 'rgba(148,163,184,0.3)', color: 'white', fontSize: 22, fontWeight: 800 }}>{it.ok ? '✓' : '—'}</div>
            <div style={{ display: 'flex', fontSize: 26, color: it.ok ? 'white' : 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{it.t}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14, fontSize: 18, color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
        * Μη νομική συμβουλή. Επιβεβαίωσε με λογιστή.
      </div>
      <Footer tagline="📋 Save for later" />
    </Canvas>
  );
}

function EnDescription() {
  return (
    <Canvas bg="linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)">
      <Glow accent="sky" pos="tr" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="sky" label="Data-driven tip" /></div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', fontSize: 44, color: 'rgba(255,255,255,0.75)', fontWeight: 700, marginBottom: 10 }}>Η αγγλική περιγραφή</div>
        <div style={{ display: 'flex', fontSize: 44, color: 'rgba(255,255,255,0.75)', fontWeight: 700, marginBottom: 40 }}>φέρνει</div>
        <div style={{ display: 'flex', fontSize: 360, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.05em', backgroundImage: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', backgroundClip: 'text', color: 'transparent' }}>3×</div>
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, marginTop: 10 }}>περισσότερες προβολές.</div>
        <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.7)', marginTop: 20, lineHeight: 1.4, maxWidth: 900 }}>
          70% των τουριστών στη Χαλκιδική ψάχνουν στα αγγλικά. Η δωρεάν AI μετάφραση του ChalkidikiHub το κάνει για σένα.
        </div>
      </div>
      <Footer />
    </Canvas>
  );
}

function CommonQuestions() {
  const qs = [
    '«Τι ώρα είναι το check-in;»',
    '«Υπάρχει parking;»',
    '«Πώς θα έρθω;»',
    '«Ποιο είναι το Wi-Fi;»',
    '«Έχει κλιματιστικό;»',
    '«Πού θα φάμε κοντά;»',
    '«Μπορούμε με κατοικίδιο;»',
  ];
  return (
    <Canvas bg="linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)">
      <Glow accent="violet" pos="tl" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="violet" label="Τα 7 που ρωτάνε όλοι" /></div>
      <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, lineHeight: 1.05, marginBottom: 8 }}>Οι ερωτήσεις που</div>
      <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, lineHeight: 1.05, marginBottom: 30, color: '#c4b5fd' }}>απαντάς ξανά & ξανά.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {qs.map((q, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,181,253,0.2)', borderRadius: 12, padding: '14px 20px' }}>
            <div style={{ display: 'flex', fontSize: 28 }}>💬</div>
            <div style={{ display: 'flex', fontSize: 26, color: 'white' }}>{q}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, fontSize: 26, fontWeight: 700, color: '#c4b5fd' }}>
        → Γι&apos; αυτό το ChalkidikiHub έχει FAQs feature. Δωρεάν.
      </div>
      <Footer />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. ENGAGEMENT
// ─────────────────────────────────────────────────────────────

function WhichBeach() {
  return (
    <Canvas bg="linear-gradient(180deg, #0f172a 0%, #1e293b 100%)">
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="teal" label="A · B" /></div>
      <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.05, marginBottom: 34 }}>Ποια θα διάλεγες;</div>
      <div style={{ display: 'flex', gap: 18, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundImage: 'linear-gradient(180deg, #0ea5e9, #0369a1)', borderRadius: 18, padding: 28, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 70, height: 70, borderRadius: 9999, backgroundColor: 'white', color: '#0369a1', fontSize: 36, fontWeight: 800 }}>A</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 800, lineHeight: 1.05 }}>Οργανωμένη</div>
            <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>🏖️ Ομπρέλες · Beach bar · Volley</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundImage: 'linear-gradient(180deg, #059669, #064e3b)', borderRadius: 18, padding: 28, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 70, height: 70, borderRadius: 9999, backgroundColor: 'white', color: '#065f46', fontSize: 36, fontWeight: 800 }}>B</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 800, lineHeight: 1.05 }}>Άγρια</div>
            <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>🌿 Ερημική · Βότσαλα · Πεύκα</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, fontSize: 26, color: 'rgba(255,255,255,0.7)' }}>Σχολίασε A ή B 👇</div>
      <Footer tagline="Poll · Comment below" />
    </Canvas>
  );
}

function TagFriend() {
  return (
    <Canvas bg="linear-gradient(180deg, #164e63 0%, #0f172a 100%)">
      <Glow accent="teal" pos="tr" />
      <Glow accent="sky" pos="bl" />
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="teal" label="Καλοκαίρι mood" /></div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 160 }}>🏖️</div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.1, textAlign: 'center', marginTop: 30, maxWidth: 900 }}>
          Tag κάποιον που
        </div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.1, textAlign: 'center', color: '#5eead4' }}>
          χρωστάς διακοπές.
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.75)', marginTop: 30, textAlign: 'center', maxWidth: 900, lineHeight: 1.4 }}>
          Χαλκιδική · 550+ χλμ ακτογραμμής. Κάπου εδώ είναι το δικό σας μέρος.
        </div>
      </div>
      <Footer tagline="📍 chalkidikihub.gr" />
    </Canvas>
  );
}

function GuessBeach() {
  return (
    <Canvas bg="linear-gradient(160deg, #0c4a6e 0%, #164e63 50%, #0f172a 100%)">
      <div style={{ display: 'flex', marginBottom: 24 }}><BrandChip accent="sky" label="Guess the beach" /></div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', fontSize: 140, fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.03em' }}>Ποια</div>
        <div style={{ display: 'flex', fontSize: 140, fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.03em', color: '#38bdf8' }}>παραλία</div>
        <div style={{ display: 'flex', fontSize: 140, fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.03em' }}>είναι;</div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40, gap: 10 }}>
          {['🔸 Βότσαλα · όχι άμμος', '🔸 Τυρκουάζ νερά', '🔸 Μέσα σε πευκόδασος', '🔸 10 λεπτά από Νικήτη'].map(c => (
            <div key={c} style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.85)' }}>{c}</div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>👇 Πες μας στα σχόλια!</div>
      <Footer tagline="Swipe for answer" />
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────

const RENDERERS: Record<string, () => React.ReactElement> = {
  // Owners — core features (6)
  'free-signup':     FreeSignup,
  'personal-site':   PersonalSite,
  'qr-code':         QrCode,
  'social-kit':      SocialKit,
  'analytics':       Analytics,
  'zero-commission': ZeroCommission,
  // Owners — extra (7)
  'ask-again':        AskAgain,
  'canva-vs-us':      CanvaVsUs,
  'commission-calc':  CommissionCalc,
  'three-minute-site': ThreeMinuteSite,
  'six-languages':    SixLanguages,
  'season-countdown': SeasonCountdown,
  'airbnb-vs-us':     AirbnbVsUs,
  // Travelers (7)
  'three-legs':       ThreeLegs,
  'sunset-spots':     SunsetSpots,
  'hidden-villages':  HiddenVillages,
  'did-you-know':     DidYouKnow,
  'mount-athos':      MountAthos,
  'best-time':        BestTime,
  'activities':       Activities,
  // Social proof (4)
  'by-the-numbers':   ByTheNumbers,
  'new-feature':      NewFeature,
  'milestone':        Milestone,
  'testimonial':      Testimonial,
  // Educational (4)
  'photo-tips':       PhotoTips,
  'legal-ama':        LegalAMA,
  'en-description':   EnDescription,
  'common-questions': CommonQuestions,
  // Engagement (3)
  'which-beach':      WhichBeach,
  'tag-friend':       TagFriend,
  'guess-beach':      GuessBeach,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  if (key === '_list') {
    return Response.json({ keys: Object.keys(RENDERERS), count: Object.keys(RENDERERS).length });
  }

  const Renderer = RENDERERS[key];
  if (!Renderer) {
    return new Response(`Unknown feature key: ${key}. Valid: ${Object.keys(RENDERERS).join(', ')}`, { status: 400 });
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
