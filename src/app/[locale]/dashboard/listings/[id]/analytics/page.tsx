'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Loader2, Info, Eye, MousePointerClick, MessageCircle,
  TrendingUp, QrCode, Phone, Mail, ExternalLink, Globe,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────
// Seeded deterministic generators
// ─────────────────────────────────────────────────────────────────────
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  // Mulberry32 — fast, deterministic, decent distribution
  let a = seed || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─────────────────────────────────────────────────────────────────────
// Data model — all numbers derived from listing id
// ─────────────────────────────────────────────────────────────────────
function generateAnalytics(listingId: string, ageDays: number) {
  const rng = makeRng(hashSeed(listingId));

  // "Base popularity" roughly 0.3–1.6, influences all volumes
  const baseScale = 0.3 + rng() * 1.3;

  // Daily views over the last 30 days. Growing trend + weekend bump +
  // small-medium noise. Floor scales with listing age (older = more views).
  const today = new Date();
  const floor = Math.max(2, Math.min(40, 5 + ageDays * 0.15)) * baseScale;
  const daily: { date: Date; views: number; clicks: number; inquiries: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay(); // 0=Sun 6=Sat
    const weekend = dow === 0 || dow === 6 ? 1.45 : 1;
    const growth = 1 + ((29 - i) / 29) * 0.35; // +35% over the month
    const noise = 0.75 + rng() * 0.5;
    const views = Math.round(floor * weekend * growth * noise);
    const ctr = 0.03 + rng() * 0.04;              // 3–7% clicks / view
    const inqRate = 0.08 + rng() * 0.07;          // 8–15% inquiries / click
    const clicks = Math.max(0, Math.round(views * ctr));
    const inquiries = Math.max(0, Math.round(clicks * inqRate));
    daily.push({ date: d, views, clicks, inquiries });
  }

  const totalViews = daily.reduce((a, b) => a + b.views, 0);
  const totalClicks = daily.reduce((a, b) => a + b.clicks, 0);
  const totalInq = daily.reduce((a, b) => a + b.inquiries, 0);

  // Deltas vs previous (synthesised) period
  const viewsDelta = 0.05 + rng() * 0.25;
  const clicksDelta = 0.03 + rng() * 0.18;
  const inqDelta = 0.08 + rng() * 0.40;

  // Country distribution — tourism mix reasonable for Halkidiki
  const countryShares = [
    { code: 'GR', flag: '🇬🇷', name: 'Greece',   weight: 35 + rng() * 25 },
    { code: 'BG', flag: '🇧🇬', name: 'Bulgaria', weight: 15 + rng() * 15 },
    { code: 'DE', flag: '🇩🇪', name: 'Germany',  weight:  8 + rng() * 10 },
    { code: 'RO', flag: '🇷🇴', name: 'Romania',  weight:  6 + rng() * 10 },
    { code: 'RS', flag: '🇷🇸', name: 'Serbia',   weight:  4 + rng() * 8 },
    { code: 'RU', flag: '🇷🇺', name: 'Russia',   weight:  3 + rng() * 6 },
    { code: 'XX', flag: '🌍', name: 'Other',     weight:  2 + rng() * 5 },
  ];
  const countryTotal = countryShares.reduce((a, b) => a + b.weight, 0);
  const countries = countryShares.map(c => ({ ...c, pct: (c.weight / countryTotal) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  // Traffic sources
  const sourceShares = [
    { name: 'Google Search', weight: 40 + rng() * 20 },
    { name: 'Direct',        weight: 15 + rng() * 10 },
    { name: 'QR scan',       weight: 10 + rng() * 15 },
    { name: 'Internal link', weight:  5 + rng() * 10 },
    { name: 'Social media',  weight:  3 + rng() * 8 },
    { name: 'Booking.com',   weight:  2 + rng() * 5 },
  ];
  const sourceTotal = sourceShares.reduce((a, b) => a + b.weight, 0);
  const sources = sourceShares.map(s => ({ ...s, pct: (s.weight / sourceTotal) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  // Clicks by action
  const actions = [
    { key: 'whatsapp', label: 'WhatsApp',          icon: MessageCircle, count: Math.round(totalClicks * (0.28 + rng() * 0.1)) },
    { key: 'phone',    label: 'Κλήση',              icon: Phone,         count: Math.round(totalClicks * (0.18 + rng() * 0.08)) },
    { key: 'email',    label: 'Email',              icon: Mail,          count: Math.round(totalClicks * (0.08 + rng() * 0.06)) },
    { key: 'qr',       label: 'QR scan',            icon: QrCode,        count: Math.round(totalClicks * (0.15 + rng() * 0.12)) },
    { key: 'website',  label: 'External website',   icon: ExternalLink,  count: Math.round(totalClicks * (0.04 + rng() * 0.05)) },
  ].sort((a, b) => b.count - a.count);

  // Locale breakdown — mirrors countries loosely
  const locales = [
    { code: 'el', label: 'Ελληνικά',  pct: countries.find(c => c.code === 'GR')?.pct || 40 },
    { code: 'en', label: 'English',   pct: 15 + rng() * 10 },
    { code: 'bg', label: 'Български', pct: countries.find(c => c.code === 'BG')?.pct || 15 },
    { code: 'de', label: 'Deutsch',   pct: countries.find(c => c.code === 'DE')?.pct || 10 },
    { code: 'ro', label: 'Română',    pct: countries.find(c => c.code === 'RO')?.pct || 8 },
    { code: 'ru', label: 'Русский',   pct: countries.find(c => c.code === 'RU')?.pct || 4 },
    { code: 'sr', label: 'Srpski',    pct: countries.find(c => c.code === 'RS')?.pct || 4 },
  ];
  const localesTotal = locales.reduce((a, b) => a + b.pct, 0);
  const localesNormalised = locales.map(l => ({ ...l, pct: (l.pct / localesTotal) * 100 }))
    .sort((a, b) => b.pct - a.pct);

  return {
    daily, totalViews, totalClicks, totalInq,
    viewsDelta, clicksDelta, inqDelta,
    countries, sources, actions, locales: localesNormalised,
  };
}

// ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const listingId = id;
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<{ slug: string; title: string; created_at: string } | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('listings').select('slug, title_el, title_en, created_at').eq('id', listingId).single();
      if (data) {
        setListing({
          slug: data.slug,
          title: data.title_el || data.title_en || '',
          created_at: data.created_at,
        });
      }
      setLoading(false);
    })();
  }, [listingId]);

  const stats = useMemo(() => {
    if (!listing) return null;
    const created = new Date(listing.created_at);
    const ageDays = Math.max(1, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)));
    return generateAnalytics(listingId, ageDays);
  }, [listing, listingId]);

  if (loading || !listing || !stats) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  const cvr = stats.totalViews > 0 ? (stats.totalInq / stats.totalViews) * 100 : 0;

  return (
    <div>
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-4">
        <ArrowLeft className="w-4 h-4" />Πίσω στα καταλύματα
      </Link>

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary-600" />
          Analytics
        </h1>
        <p className="text-sm text-gray-600 mt-0.5">{listing.title}</p>
      </div>

      {/* DEMO banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 mb-5 flex gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-700 shrink-0">
          <Info className="w-5 h-5" />
        </span>
        <div className="text-sm text-amber-900 leading-relaxed">
          <strong>Demo data</strong> — Τα νούμερα είναι προσομοίωση με βάση την ηλικία του καταλύματος.
          Μόλις οι πραγματικοί επισκέπτες αρχίσουν να σκανάρουν το <strong>QR code</strong> σου
          ή να μπαίνουν στη σελίδα σου, θα δεις εδώ αληθινά δεδομένα. Τα charts και οι διαστάσεις
          λειτουργούν σαν προεπισκόπηση για το τι θα βλέπεις όταν αποκτήσεις κίνηση.
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<Eye className="w-5 h-5" />}             label="Views"      value={stats.totalViews.toLocaleString()}   delta={stats.viewsDelta}  color="text-sky-700 bg-sky-50" />
        <StatCard icon={<MousePointerClick className="w-5 h-5" />} label="Clicks"    value={stats.totalClicks.toLocaleString()}  delta={stats.clicksDelta} color="text-primary-700 bg-primary-50" />
        <StatCard icon={<MessageCircle className="w-5 h-5" />}   label="Inquiries"  value={stats.totalInq.toLocaleString()}     delta={stats.inqDelta}    color="text-green-700 bg-green-50" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />}      label="Conv. rate" value={`${cvr.toFixed(1)}%`}                delta={0.004}              color="text-violet-700 bg-violet-50" />
      </div>

      {/* Line chart — views over time */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Views — τελευταίες 30 μέρες</h2>
        <Sparkline daily={stats.daily} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Countries */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" /> Χώρες προέλευσης
          </h2>
          <BarList items={stats.countries.map(c => ({ label: `${c.flag} ${c.name}`, pct: c.pct }))} color="bg-sky-500" />
        </section>

        {/* Sources */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Πηγές επισκεψιμότητας</h2>
          <BarList items={stats.sources.map(s => ({ label: s.name, pct: s.pct }))} color="bg-primary-500" />
        </section>

        {/* Languages */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Γλώσσες</h2>
          <BarList items={stats.locales.map(l => ({ label: l.label, pct: l.pct }))} color="bg-emerald-500" />
        </section>

        {/* Actions */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Κλικ ανά ενέργεια</h2>
          <ul className="space-y-2">
            {stats.actions.map(a => {
              const Icon = a.icon;
              return (
                <li key={a.key} className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 text-sm text-gray-800">{a.label}</span>
                  <span className="text-sm font-semibold tabular-nums text-gray-900">{a.count}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <p className="text-[11px] text-gray-400 italic text-center">
        * Demo data — για να πάρεις πραγματικά, φτιάξε QR code και μοιράσου τη σελίδα του καταλύματος.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Small visual primitives
// ─────────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, delta, color }: {
  icon: React.ReactNode; label: string; value: string; delta: number; color: string;
}) {
  const positive = delta >= 0;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${color}`}>{icon}</span>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 tabular-nums">{value}</span>
      </div>
      <div className={`mt-1 text-[11px] font-medium ${positive ? 'text-green-700' : 'text-red-700'}`}>
        {positive ? '↑' : '↓'} {Math.abs(delta * 100).toFixed(1)}% vs προηγ. περίοδο
      </div>
    </div>
  );
}

function BarList({ items, color }: { items: { label: string; pct: number }[]; color: string }) {
  const max = Math.max(...items.map(i => i.pct), 1);
  return (
    <ul className="space-y-2">
      {items.slice(0, 7).map((it, idx) => (
        <li key={idx}>
          <div className="flex items-center justify-between text-xs text-gray-700 mb-0.5">
            <span className="truncate">{it.label}</span>
            <span className="tabular-nums text-gray-500">{it.pct.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full`}
              style={{ width: `${(it.pct / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Sparkline({ daily }: { daily: { date: Date; views: number }[] }) {
  const W = 800;
  const H = 140;
  const padX = 20;
  const padY = 14;
  const max = Math.max(...daily.map(d => d.views), 1);
  const stepX = (W - padX * 2) / Math.max(1, daily.length - 1);
  const pts = daily.map((d, i) => ({
    x: padX + i * stepX,
    y: H - padY - (d.views / max) * (H - padY * 2),
    views: d.views,
    date: d.date,
  }));

  const pathD = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H - padY} L ${pts[0].x} ${H - padY} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgb(14 165 233)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(14 165 233)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Gridlines */}
      {[0, 0.5, 1].map(ratio => (
        <line key={ratio}
          x1={padX} x2={W - padX}
          y1={padY + ratio * (H - padY * 2)}
          y2={padY + ratio * (H - padY * 2)}
          stroke="#f3f4f6" strokeWidth="1" />
      ))}
      <path d={areaD} fill="url(#area-grad)" />
      <path d={pathD} fill="none" stroke="rgb(14 165 233)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* End dot */}
      {pts.length > 0 && (
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3.5" fill="rgb(14 165 233)" />
      )}
      {/* X axis labels (sparse: first, middle, last) */}
      {[0, Math.floor(daily.length / 2), daily.length - 1].map(i => (
        <text key={i} x={pts[i].x} y={H - 1} fontSize="10" fill="#9ca3af" textAnchor="middle">
          {daily[i].date.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit' })}
        </text>
      ))}
    </svg>
  );
}
