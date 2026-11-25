'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Loader2, ArrowUpRight, ArrowDownRight, Info, Search, Database } from 'lucide-react';
import { pageKind } from '@/lib/traffic';

/**
 * Admin → Επισκεψιμότητα: our own cookieless counter (see /api/t). Unlike
 * Google Analytics it includes visitors who declined cookies, because nothing
 * stored identifies anyone. Daily totals only: no individual journeys.
 */

type Totals = { views: number; entries: number; seconds: number; timed: number; engaged: number };
type PageRow = { path: string; views: number; entries: number; seconds: number; timed: number; engaged: number };
type Report = {
  totals: Totals;
  daily: { day: string; views: number; entries: number }[];
  pages: PageRow[];
  sources: { source: string; views: number; entries: number }[];
  campaigns: { source: string; campaign: string; views: number; entries: number }[];
  devices: { device: string; views: number; entries: number }[];
  langs: { lang: string; views: number; entries: number }[];
  events: { path: string; event: string; hits: number }[];
};
type Payload = { setup: boolean; error?: string; from: string; to: string; report: Report; previous: Report | null; titles: Record<string, string> };

const DAY = 86400000;
const athensToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
const shift = (iso: string, days: number) => new Date(Date.parse(iso) + days * DAY).toISOString().slice(0, 10);

const RANGES = [
  { id: 'today', label: 'Σήμερα' },
  { id: 'yesterday', label: 'Χθες' },
  { id: '7', label: '7 ημέρες' },
  { id: '30', label: '30 ημέρες' },
  { id: '90', label: '90 ημέρες' },
  { id: 'year', label: 'Φέτος' },
] as const;

function rangeFor(id: string): { from: string; to: string } {
  const t = athensToday();
  if (id === 'today') return { from: t, to: t };
  if (id === 'yesterday') { const y = shift(t, -1); return { from: y, to: y }; }
  if (id === 'year') return { from: `${t.slice(0, 4)}-01-01`, to: t };
  return { from: shift(t, -(Number(id) - 1)), to: t };
}

const SOURCE_LABEL: Record<string, string> = {
  google: 'Google', bing: 'Bing', duckduckgo: 'DuckDuckGo', yahoo: 'Yahoo', yandex: 'Yandex', ecosia: 'Ecosia',
  facebook: 'Facebook', instagram: 'Instagram', x: 'X (Twitter)', linkedin: 'LinkedIn', tiktok: 'TikTok',
  youtube: 'YouTube', pinterest: 'Pinterest', chatgpt: 'ChatGPT', perplexity: 'Perplexity', gemini: 'Gemini',
  copilot: 'Copilot', claude: 'Claude', email: 'Email', direct: 'Απευθείας',
};
const SOURCE_GROUP: Record<string, string> = {
  google: 'search', bing: 'search', duckduckgo: 'search', yahoo: 'search', yandex: 'search', ecosia: 'search',
  facebook: 'social', instagram: 'social', x: 'social', linkedin: 'social', tiktok: 'social', youtube: 'social', pinterest: 'social',
  chatgpt: 'ai', perplexity: 'ai', gemini: 'ai', copilot: 'ai', claude: 'ai', direct: 'direct', email: 'email',
};
const GROUP_LABEL: Record<string, string> = {
  search: 'Μηχανές αναζήτησης', social: 'Social media', ai: 'Βοηθοί AI (ChatGPT κ.ά.)', direct: 'Απευθείας', email: 'Email', other: 'Άλλα sites',
};
const KIND_LABEL: Record<string, string> = {
  home: 'Αρχική', listings: 'Καταλύματα', beaches: 'Παραλίες', places: 'Χωριά & περιοχές', food: 'Φαγητό',
  activities: 'Δραστηριότητες', articles: 'Άρθρα', guides: 'Οδηγοί', events: 'Εκδηλώσεις', ev: 'Φόρτιση EV',
  search: 'Αναζήτηση', map: 'Χάρτης', availability: 'Αίτημα διαθεσιμότητας', owners: 'Για ιδιοκτήτες', sales: 'Πωλήσεις', other: 'Άλλες σελίδες',
};
const EVENT_LABEL: Record<string, string> = {
  call: 'Κλήσεις', email: 'Email', whatsapp: 'WhatsApp', inquiry: 'Φόρμα επικοινωνίας', inquiry_calendar: '↳ με ημερομηνίες από το ημερολόγιο', inquiry_similar: 'Αιτήματα σε παρόμοια καταλύματα', availability_request: 'Αιτήματα διαθεσιμότητας',
  booking_link: 'Booking / Airbnb', website: 'Website ιδιοκτήτη', directions: 'Οδηγίες χάρτη', outbound: 'Άλλοι εξωτερικοί σύνδεσμοι',
};
/** Actions that mean "a guest reached out" (outbound links are not counted as contacts). */
const CONTACT = new Set(['call', 'email', 'whatsapp', 'inquiry', 'inquiry_similar', 'availability_request', 'booking_link', 'website', 'directions']);
const DEVICE_LABEL: Record<string, string> = { mobile: 'Κινητό', tablet: 'Tablet', desktop: 'Υπολογιστής' };
const LANG_LABEL: Record<string, string> = { el: 'Ελληνικά', en: 'Αγγλικά', de: 'Γερμανικά', ro: 'Ρουμανικά', sr: 'Σερβικά', bg: 'Βουλγαρικά', ru: 'Ρωσικά' };

const nf = new Intl.NumberFormat('el-GR');
const fmt = (n: number) => nf.format(Math.round(n));
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : '—');
function dur(sec: number) {
  if (!(sec > 0)) return '—';
  const total = Math.round(sec);
  const m = Math.floor(total / 60), s = total % 60;
  return m ? `${m}′ ${String(s).padStart(2, '0')}″` : `${s}″`;
}
const fmtDay = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('el-GR', { day: 'numeric', month: 'short' });

export default function TrafficPage() {
  const [rangeId, setRangeId] = useState<string>('30');
  const [custom, setCustom] = useState(() => rangeFor('30'));
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const range = rangeId === 'custom' ? custom : rangeFor(rangeId);

  useEffect(() => {
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the spinner while the new range loads
    setLoading(true);
    fetch(`/api/admin/traffic?from=${range.from}&to=${range.to}`)
      .then((r) => r.json())
      .then((j: Payload) => { if (alive) { setData(j); setError(j.error && j.setup ? j.error : ''); } })
      .catch((e) => { if (alive) setError(String(e)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [range.from, range.to]);

  return (
    <div className="max-w-6xl">
      <div className="flex items-start gap-3 mb-5">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-sky-600 text-white shrink-0"><BarChart3 className="w-5 h-5" /></span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Επισκεψιμότητα</h1>
          <p className="text-sm text-slate-500">Όλοι οι επισκέπτες, και όσοι δεν αποδέχτηκαν cookies. Μετράμε σελίδες, όχι ανθρώπους: χωρίς cookies, χωρίς IP.</p>
        </div>
      </div>

      {/* Range */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {RANGES.map((r) => (
          <button key={r.id} type="button" onClick={() => setRangeId(r.id)} aria-pressed={rangeId === r.id}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${rangeId === r.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}>
            {r.label}
          </button>
        ))}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-sm ${rangeId === 'custom' ? 'border-slate-900' : 'border-slate-200'} bg-white`}>
          <input type="date" value={range.from} max={range.to} onChange={(e) => { setCustom({ ...range, from: e.target.value }); setRangeId('custom'); }} className="text-sm outline-none" aria-label="Από" />
          <span className="text-slate-400">–</span>
          <input type="date" value={range.to} min={range.from} onChange={(e) => { setCustom({ ...range, to: e.target.value }); setRangeId('custom'); }} className="text-sm outline-none" aria-label="Έως" />
        </div>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{error}</div>}

      {data && !data.setup ? <SetupNotice /> : data?.report ? <Dashboard data={data} /> : !loading && !error ? null : (
        <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      )}
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      <div className="flex items-center gap-2 font-semibold mb-1"><Database className="w-4 h-4" />Χρειάζεται μία ρύθμιση στη βάση</div>
      <p>Ο πίνακας της μέτρησης δεν υπάρχει ακόμα. Ανοίξτε το Supabase → SQL Editor, επικολλήστε το περιεχόμενο του αρχείου <code className="bg-amber-100 px-1 rounded">scripts/sql/analytics.sql</code> και πατήστε Run. Η μέτρηση ξεκινά αμέσως μετά.</p>
    </div>
  );
}

function Dashboard({ data }: { data: Payload }) {
  const { report: r, previous: p, titles } = data;
  const contacts = (rep: Report | null) => (rep?.events || []).filter((e) => CONTACT.has(e.event)).reduce((n, e) => n + e.hits, 0);
  const cur = { ...r.totals, contacts: contacts(r) };
  const prev = p ? { ...p.totals, contacts: contacts(p) } : null;

  const nameOf = (path: string) => {
    const m = path.match(/^\/(?:listings|stay)\/([^/]+)$/);
    if (m && titles[m[1]]) return titles[m[1]];
    if (path === '/') return 'Αρχική σελίδα';
    return path;
  };

  if (cur.views === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Δεν υπάρχουν ακόμα μετρήσεις για αυτή την περίοδο. Η μέτρηση ξεκινά από τη μέρα που ενεργοποιήθηκε.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Headline numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kpi label="Προβολές σελίδων" value={fmt(cur.views)} now={cur.views} before={prev?.views} />
        <Kpi label="Επισκέψεις" hint="Αφίξεις στο site από έξω (Google, social, απευθείας…)" value={fmt(cur.entries)} now={cur.entries} before={prev?.entries} />
        <Kpi label="Σελίδες ανά επίσκεψη" value={cur.entries ? (cur.views / cur.entries).toFixed(1).replace('.', ',') : '—'}
          now={cur.entries ? cur.views / cur.entries : 0} before={prev?.entries ? prev.views / prev.entries : undefined} />
        <Kpi label="Μέσος χρόνος σε σελίδα" hint={`${pct(cur.engaged, cur.timed)} έμειναν πάνω από 10″`} value={dur(cur.timed ? cur.seconds / cur.timed : 0)}
          now={cur.timed ? cur.seconds / cur.timed : 0} before={prev?.timed ? prev.seconds / prev.timed : undefined} />
        <Kpi label="Επαφές" hint="Κλήσεις, email, φόρμες, Booking/Airbnb, website, οδηγίες" value={fmt(cur.contacts)} now={cur.contacts} before={prev?.contacts} />
      </div>
      {prev && <p className="text-xs text-slate-400 -mt-2">Τα ποσοστά συγκρίνουν με την αμέσως προηγούμενη περίοδο ίδιας διάρκειας ({fmtDay(data.from)} – {fmtDay(data.to)} έναντι {fmtDay(shift(data.from, -((Date.parse(data.to) - Date.parse(data.from)) / DAY + 1)))} – {fmtDay(shift(data.from, -1))}).</p>}

      <Card title="Προβολές ανά ημέρα" subtitle="Περάστε τον δείκτη πάνω από μια μέρα για λεπτομέρειες.">
        <DailyChart from={data.from} to={data.to} daily={r.daily} />
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Sources sources={r.sources} total={cur.entries} />
        <Card title="Τι διαβάζουν" subtitle="Προβολές ανά είδος σελίδας">
          <BarList rows={groupBy(r.pages, (x) => pageKind(x.path), (x) => x.views).map(([k, v]) => ({ label: KIND_LABEL[k] || k, value: v }))} total={cur.views} />
        </Card>
      </div>

      <Listings pages={r.pages} events={r.events} titles={titles} />

      <Pages pages={r.pages} nameOf={nameOf} />

      <div className="grid lg:grid-cols-3 gap-5">
        <Card title="Ενέργειες επαφής" subtitle="Σε όλο το site">
          <BarList rows={groupBy(r.events, (e) => e.event, (e) => e.hits).map(([k, v]) => ({ label: EVENT_LABEL[k] || k, value: v }))} total={0} emptyText="Καμία ενέργεια ακόμα." />
        </Card>
        <Card title="Συσκευές" subtitle="Επισκέψεις">
          <BarList rows={r.devices.map((d) => ({ label: DEVICE_LABEL[d.device] || d.device, value: d.entries }))} total={cur.entries} />
        </Card>
        <Card title="Γλώσσα σελίδας" subtitle="Επισκέψεις ανά γλώσσα του site">
          <BarList rows={r.langs.map((d) => ({ label: LANG_LABEL[d.lang] || d.lang, value: d.entries }))} total={cur.entries} />
        </Card>
      </div>

      {r.campaigns.length > 0 && (
        <Card title="Καμπάνιες (utm)" subtitle="Σύνδεσμοι με utm_campaign, π.χ. από newsletter ή διαφήμιση">
          <Table head={['Καμπάνια', 'Πηγή', 'Επισκέψεις', 'Προβολές']}
            rows={r.campaigns.map((c) => [c.campaign, SOURCE_LABEL[c.source] || c.source, fmt(c.entries), fmt(c.views)])} />
        </Card>
      )}

      <p className="flex items-start gap-1.5 text-xs text-slate-400 pt-2">
        <Info className="w-3.5 h-3.5 mt-px shrink-0" />
        <span>Τα νούμερα θα είναι μεγαλύτερα από του Google Analytics, γιατί εδώ μετρούν και όσοι δεν αποδέχτηκαν cookies. Δεν μετρώνται bots, σελίδες του admin και του πίνακα ιδιοκτήτη, ούτε οι browsers όπου έχετε μπει ως admin. Επειδή δεν κρατάμε στοιχεία επισκεπτών, δεν υπάρχουν «μοναδικοί επισκέπτες»· οι «Επισκέψεις» είναι οι αφίξεις από έξω.</span>
      </p>
    </div>
  );
}

function groupBy<T>(rows: T[], key: (r: T) => string, val: (r: T) => number): [string, number][] {
  const m = new Map<string, number>();
  for (const r of rows) m.set(key(r), (m.get(key(r)) || 0) + val(r));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Kpi({ label, value, hint, now, before }: { label: string; value: string; hint?: string; now: number; before?: number }) {
  const change = before && before > 0 ? (now - before) / before : null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{value}</div>
      <div className="mt-0.5 flex items-center gap-1 text-xs min-h-4">
        {change != null && Math.abs(change) >= 0.005 && (
          <span className={`inline-flex items-center font-semibold ${change > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {change > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(Math.round(change * 100))}%
          </span>
        )}
        {hint && <span className="text-slate-400 truncate" title={hint}>{hint}</span>}
      </div>
    </div>
  );
}

function Card({ title, subtitle, children, right }: { title: string; subtitle?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

/** Horizontal bars: label, value, share. One hue; the number is always printed. */
function BarList({ rows, total, emptyText = 'Δεν υπάρχουν δεδομένα.' }: { rows: { label: string; value: number }[]; total: number; emptyText?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length || max <= 0) return <p className="text-sm text-slate-400">{emptyText}</p>;
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-slate-700 truncate">{r.label}</span>
            <span className="tabular-nums text-slate-900 font-medium shrink-0">
              {fmt(r.value)}{total > 0 && <span className="text-slate-400 font-normal ml-1.5">{pct(r.value, total)}</span>}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-sky-600" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DailyChart({ from, to, daily }: { from: string; to: string; daily: { day: string; views: number; entries: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  // Every day in the range, zeros included, so gaps show as gaps.
  const days = useMemo(() => {
    const byDay = new Map(daily.map((d) => [d.day, d]));
    const out: { day: string; views: number; entries: number }[] = [];
    for (let d = from; d <= to; d = shift(d, 1)) out.push(byDay.get(d) || { day: d, views: 0, entries: 0 });
    return out;
  }, [from, to, daily]);
  const W = 900, H = 220, L = 44, B = 24, T = 8;
  const max = Math.max(1, ...days.map((d) => d.views));
  const nice = (() => { const p = Math.pow(10, Math.floor(Math.log10(max))); return Math.ceil(max / p) * p; })();
  const n = days.length;
  const slot = (W - L) / n;
  const bw = Math.max(2, Math.min(28, slot - 2));
  const y = (v: number) => T + (H - T - B) * (1 - v / nice);
  const ticks = [0, nice / 2, nice];
  const labelEvery = Math.ceil(n / 10);
  const h = hover != null ? days[hover] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Προβολές σελίδων ανά ημέρα" onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#94a3b8">{fmt(t)}</text>
          </g>
        ))}
        {days.map((d, i) => {
          const x = L + i * slot + (slot - bw) / 2;
          const top = y(d.views);
          const hgt = Math.max(0, H - B - top);
          return (
            <g key={d.day} onMouseEnter={() => setHover(i)}>
              <rect x={L + i * slot} y={T} width={slot} height={H - T - B} fill="transparent" />
              {hgt > 0 && (
                <path d={`M${x},${H - B} v${-(hgt - Math.min(4, hgt))} q0,${-Math.min(4, hgt)} ${Math.min(4, bw / 2)},${-Math.min(4, hgt)} h${bw - 2 * Math.min(4, bw / 2)} q${Math.min(4, bw / 2)},0 ${Math.min(4, bw / 2)},${Math.min(4, hgt)} v${hgt - Math.min(4, hgt)} z`}
                  fill={hover === i ? '#075985' : '#0284c7'} />
              )}
              {i % labelEvery === 0 && <text x={L + i * slot + slot / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="#94a3b8">{fmtDay(d.day)}</text>}
            </g>
          );
        })}
      </svg>
      {h && hover != null && (
        <div className="pointer-events-none absolute top-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md"
          style={{ left: `${Math.min(80, Math.max(0, ((L + hover * slot) / W) * 100))}%` }}>
          <div className="font-semibold text-slate-900">{new Date(h.day + 'T12:00:00Z').toLocaleDateString('el-GR', { weekday: 'short', day: 'numeric', month: 'long' })}</div>
          <div className="text-slate-600 mt-0.5">Προβολές <strong className="text-slate-900 tabular-nums">{fmt(h.views)}</strong></div>
          <div className="text-slate-600">Επισκέψεις <strong className="text-slate-900 tabular-nums">{fmt(h.entries)}</strong></div>
        </div>
      )}
    </div>
  );
}

function Sources({ sources, total }: { sources: Report['sources']; total: number }) {
  const [detail, setDetail] = useState(false);
  const outside = sources.filter((s) => s.source !== 'internal' && s.entries > 0);
  const groups = groupBy(outside, (s) => SOURCE_GROUP[s.source] || 'other', (s) => s.entries);
  return (
    <Card title="Από πού ήρθαν" subtitle="Επισκέψεις ανά πηγή"
      right={<button type="button" onClick={() => setDetail(!detail)} className="text-xs font-medium text-sky-700 hover:underline">{detail ? 'Ανά κατηγορία' : 'Αναλυτικά'}</button>}>
      <BarList total={total}
        rows={detail
          ? outside.map((s) => ({ label: SOURCE_LABEL[s.source] || s.source, value: s.entries }))
          : groups.map(([g, v]) => ({ label: GROUP_LABEL[g], value: v }))} />
    </Card>
  );
}

function Listings({ pages, events, titles }: { pages: PageRow[]; events: Report['events']; titles: Record<string, string> }) {
  const slugOf = (path: string) => path.match(/^\/(?:listings|stay)\/([^/]+)$/)?.[1];
  const rows = useMemo(() => {
    const m = new Map<string, { slug: string; views: number; entries: number; seconds: number; timed: number; ev: Record<string, number> }>();
    const get = (slug: string) => {
      let r = m.get(slug);
      if (!r) { r = { slug, views: 0, entries: 0, seconds: 0, timed: 0, ev: {} }; m.set(slug, r); }
      return r;
    };
    for (const p of pages) { const s = slugOf(p.path); if (s) { const r = get(s); r.views += p.views; r.entries += p.entries; r.seconds += p.seconds; r.timed += p.timed; } }
    for (const e of events) { const s = slugOf(e.path); if (s) { const r = get(s); r.ev[e.event] = (r.ev[e.event] || 0) + e.hits; } }
    return [...m.values()].sort((a, b) => b.views - a.views);
  }, [pages, events]);
  const [all, setAll] = useState(false);
  if (!rows.length) return null;
  const shown = all ? rows : rows.slice(0, 15);
  const contacts = (ev: Record<string, number>) => Object.entries(ev).filter(([k]) => CONTACT.has(k)).reduce((n, [, v]) => n + v, 0);
  return (
    <Card title="Καταλύματα" subtitle="Πόσοι είδαν κάθε κατάλυμα και πόσοι επικοινώνησαν">
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3 font-medium">Κατάλυμα</th>
              <th className="py-2 px-2 font-medium text-right">Προβολές</th>
              <th className="py-2 px-2 font-medium text-right" title="Επισκέψεις που ξεκίνησαν σε αυτή τη σελίδα">Είσοδοι</th>
              <th className="py-2 px-2 font-medium text-right">Μέσος χρόνος</th>
              <th className="py-2 px-2 font-medium text-right">Επαφές</th>
              <th className="py-2 pl-2 font-medium">Ανάλυση επαφών</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const c = contacts(r.ev);
              return (
                <tr key={r.slug} className="border-b border-slate-50 last:border-0 align-top">
                  <td className="py-2 pr-3 text-slate-900 max-w-[16rem] truncate" title={r.slug}>{titles[r.slug] || r.slug}</td>
                  <td className="py-2 px-2 text-right tabular-nums">{fmt(r.views)}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-slate-600">{fmt(r.entries)}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-slate-600">{dur(r.timed ? r.seconds / r.timed : 0)}</td>
                  <td className="py-2 px-2 text-right tabular-nums font-semibold">{c ? <>{fmt(c)} <span className="text-xs font-normal text-slate-400">{pct(c, r.views)}</span></> : '—'}</td>
                  <td className="py-2 pl-2 text-xs text-slate-500">
                    {Object.entries(r.ev).filter(([k]) => CONTACT.has(k)).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${EVENT_LABEL[k] || k} ${v}`).join(' · ') || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length > 15 && (
        <button type="button" onClick={() => setAll(!all)} className="mt-3 text-xs font-medium text-sky-700 hover:underline">
          {all ? 'Λιγότερα' : `Όλα τα καταλύματα (${rows.length})`}
        </button>
      )}
    </Card>
  );
}

type SortKey = 'views' | 'entries' | 'time' | 'engaged';
function Pages({ pages, nameOf }: { pages: PageRow[]; nameOf: (p: string) => string }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('views');
  const [limit, setLimit] = useState(25);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const val = (p: PageRow) => sort === 'views' ? p.views : sort === 'entries' ? p.entries : sort === 'time' ? (p.timed ? p.seconds / p.timed : 0) : (p.timed ? p.engaged / p.timed : 0);
    return pages
      .filter((p) => !needle || p.path.includes(needle) || nameOf(p.path).toLowerCase().includes(needle))
      .sort((a, b) => val(b) - val(a));
  }, [pages, q, sort, nameOf]);
  const th = (k: SortKey, label: string, title?: string) => (
    <th className="py-2 px-2 font-medium text-right">
      <button type="button" onClick={() => setSort(k)} title={title} className={`hover:text-slate-900 ${sort === k ? 'text-slate-900 underline underline-offset-4' : ''}`}>{label}</button>
    </th>
  );
  return (
    <Card title="Όλες οι σελίδες" subtitle="Πατήστε σε μια στήλη για ταξινόμηση"
      right={
        <label className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Αναζήτηση σελίδας…" className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-48" />
        </label>
      }>
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3 font-medium">Σελίδα</th>
              {th('views', 'Προβολές')}
              {th('entries', 'Είσοδοι', 'Επισκέψεις που ξεκίνησαν σε αυτή τη σελίδα')}
              {th('time', 'Μέσος χρόνος')}
              {th('engaged', '>10″', 'Ποσοστό που έμειναν πάνω από 10 δευτερόλεπτα')}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, limit).map((p) => (
              <tr key={p.path} className="border-b border-slate-50 last:border-0">
                <td className="py-2 pr-3 max-w-[22rem]">
                  <div className="text-slate-900 truncate" title={nameOf(p.path)}>{nameOf(p.path)}</div>
                  <div className="text-[11px] text-slate-400 truncate">{KIND_LABEL[pageKind(p.path)]} · {p.path}</div>
                </td>
                <td className="py-2 px-2 text-right tabular-nums">{fmt(p.views)}</td>
                <td className="py-2 px-2 text-right tabular-nums text-slate-600">{fmt(p.entries)}</td>
                <td className="py-2 px-2 text-right tabular-nums text-slate-600">{dur(p.timed ? p.seconds / p.timed : 0)}</td>
                <td className="py-2 px-2 text-right tabular-nums text-slate-600">{pct(p.engaged, p.timed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > limit && (
        <button type="button" onClick={() => setLimit(limit + 50)} className="mt-3 text-xs font-medium text-sky-700 hover:underline">
          Περισσότερες ({rows.length - limit} ακόμα)
        </button>
      )}
    </Card>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-slate-500 border-b border-slate-100">{head.map((h, i) => <th key={h} className={`py-2 font-medium ${i ? 'text-right px-2' : 'pr-3'}`}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-slate-50 last:border-0">{r.map((c, j) => <td key={j} className={`py-2 ${j ? 'text-right px-2 tabular-nums' : 'pr-3'}`}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
