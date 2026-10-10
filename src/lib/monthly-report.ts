// Monthly owner-report engine.
//
// Single source of truth shared by:
//   • the cron  (/api/cron/monthly-snapshot)   → runSnapshot()
//   • the admin (/api/admin/monthly-report/*)   → runSnapshot / buildOwnerReports / renderOwnerEmailHtml
//
// Keeping the aggregation here guarantees the numbers the admin previews are
// the exact numbers the emails contain.

import type { createAdminClient } from './api-helpers';
import { fetchPagesForRange, fetchQueriesForRange, fetchCountriesForRange } from './gsc';

type AdminSupabase = ReturnType<typeof createAdminClient>;

export interface MonthWindow {
  monthKey: string;      // 'YYYY-MM-01' — first day of the covered month
  prevMonthKey: string;  // first day of the month before that
  startDate: string;     // 'YYYY-MM-DD' inclusive (GSC query start)
  endDate: string;       // 'YYYY-MM-DD' inclusive (GSC query end = last day)
  firstOfMonth: Date;    // UTC
  firstOfNextMonth: Date;// UTC (exclusive upper bound for created_at filters)
}

export interface QueryLine { query: string; impressions: number; clicks: number }

export interface ListingLine {
  listing_id: string;
  slug: string;
  title: string;
  impressions: number;
  clicks: number;
  inquiries: number;
  prevImpressions: number;
  prevInquiries: number;
  impressionsPct: number | null; // MoM % vs previous month (null if no baseline)
  topQueries: QueryLine[];
}

export interface OwnerReport {
  ownerId: string;
  email: string;
  name: string;
  listings: ListingLine[];
  totalImpressions: number;
  totalClicks: number;
  totalInquiries: number;
  prevTotalImpressions: number;
  totalPct: number | null;
  alreadySentAt: string | null;
}

export interface TopCountry {
  code: string;   // ISO alpha-3 as returned by GSC
  flag: string;   // emoji flag (from alpha-2), '' if unknown
  name: string;   // Greek country name (falls back to uppercased code)
  impressions: number;
  pct: number;    // share of total site impressions, rounded
}

export interface SiteStats {
  totalImpressions: number;   // site-wide, whole month (GSC)
  totalClicks: number;        // site-wide search visits, whole month
  countries: TopCountry[];    // top countries by impressions
}

// ISO 3166-1 alpha-3 → alpha-2 + Greek name, for the countries the audience of
// a Halkidiki site realistically comes from. Unknowns fall back gracefully.
const COUNTRY_MAP: Record<string, [string, string]> = {
  grc: ['GR', 'Ελλάδα'], deu: ['DE', 'Γερμανία'], bgr: ['BG', 'Βουλγαρία'],
  rou: ['RO', 'Ρουμανία'], srb: ['RS', 'Σερβία'], gbr: ['GB', 'Ην. Βασίλειο'],
  usa: ['US', 'ΗΠΑ'], fra: ['FR', 'Γαλλία'], ita: ['IT', 'Ιταλία'],
  nld: ['NL', 'Ολλανδία'], pol: ['PL', 'Πολωνία'], aut: ['AT', 'Αυστρία'],
  che: ['CH', 'Ελβετία'], bel: ['BE', 'Βέλγιο'], cze: ['CZ', 'Τσεχία'],
  tur: ['TR', 'Τουρκία'], rus: ['RU', 'Ρωσία'], hun: ['HU', 'Ουγγαρία'],
  svk: ['SK', 'Σλοβακία'], swe: ['SE', 'Σουηδία'], cyp: ['CY', 'Κύπρος'],
  mkd: ['MK', 'Β. Μακεδονία'], ukr: ['UA', 'Ουκρανία'], isr: ['IL', 'Ισραήλ'],
  esp: ['ES', 'Ισπανία'], dnk: ['DK', 'Δανία'], nor: ['NO', 'Νορβηγία'],
  fin: ['FI', 'Φινλανδία'], hrv: ['HR', 'Κροατία'], svn: ['SI', 'Σλοβενία'],
  alb: ['AL', 'Αλβανία'], mda: ['MD', 'Μολδαβία'], irl: ['IE', 'Ιρλανδία'],
  prt: ['PT', 'Πορτογαλία'], lux: ['LU', 'Λουξεμβούργο'], can: ['CA', 'Καναδάς'],
  aus: ['AU', 'Αυστραλία'], bih: ['BA', 'Βοσνία'], mne: ['ME', 'Μαυροβούνιο'],
  ltu: ['LT', 'Λιθουανία'], lva: ['LV', 'Λετονία'], est: ['EE', 'Εσθονία'],
  are: ['AE', 'Ην. Αραβικά Εμιράτα'], grc2: ['GR', 'Ελλάδα'],
};

function flagFromAlpha2(a2: string): string {
  if (!/^[A-Z]{2}$/.test(a2)) return '';
  return String.fromCodePoint(...[...a2].map(c => 0x1f1a5 + c.charCodeAt(0)));
}

function countryMeta(codeAlpha3: string): { flag: string; name: string } {
  const entry = COUNTRY_MAP[codeAlpha3.toLowerCase()];
  if (!entry) return { flag: '', name: codeAlpha3.toUpperCase() };
  return { flag: flagFromAlpha2(entry[0]), name: entry[1] };
}

const EL_MONTHS = [
  'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
  'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου',
];

// 'Ιουνίου 2026' from '2026-06-01'
export function monthLabelGreek(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number);
  return `${EL_MONTHS[(m - 1) % 12]} ${y}`;
}

// Resolve the target month. Defaults to the previous calendar month; pass
// 'YYYY-MM' to target any month (e.g. for backfill / manual admin runs).
export function resolveMonthWindow(monthParam?: string | null): MonthWindow {
  const now = new Date();
  let year = now.getUTCFullYear();
  let month = now.getUTCMonth() - 1; // previous month, 0-indexed (may be -1)
  if (monthParam) {
    const mm = monthParam.match(/^(\d{4})-(\d{2})$/);
    if (!mm) throw new Error('month must be YYYY-MM');
    year = Number(mm[1]);
    month = Number(mm[2]) - 1;
  }
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const firstOfNextMonth = new Date(Date.UTC(year, month + 1, 1));
  const firstOfPrevMonth = new Date(Date.UTC(year, month - 1, 1));
  const lastOfMonth = new Date(firstOfNextMonth.getTime() - 86_400_000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return {
    monthKey: iso(firstOfMonth),
    prevMonthKey: iso(firstOfPrevMonth),
    startDate: iso(firstOfMonth),
    endDate: iso(lastOfMonth),
    firstOfMonth,
    firstOfNextMonth,
  };
}

// Extract the listing slug from a public URL path we care about.
// e.g. https://chalkidikihub.gr/en/stay/villa-mare/guide → 'villa-mare'
function slugFromUrl(url: string): string | null {
  const m = url.match(/\/(?:listings|stay|book)\/([^/?#]+)/i);
  return m ? decodeURIComponent(m[1]) : null;
}

interface Agg {
  impressions: number;
  clicks: number;
  inquiries: number;
  queries: Map<string, { impressions: number; clicks: number }>;
}

// Pull GSC + inquiries for the window and upsert one row per listing that had
// any activity into listing_monthly_stats. Idempotent (upsert on listing+month).
export async function runSnapshot(
  supabase: AdminSupabase,
  win: MonthWindow,
): Promise<{ upserted: number; gscError: string | null }> {
  const { data: listings, error: listErr } = await supabase
    .from('listings')
    .select('id, slug')
    .not('slug', 'is', null);
  if (listErr) throw new Error(listErr.message);

  const slugToId = new Map<string, string>();
  for (const l of listings || []) {
    if (l.slug) slugToId.set(l.slug as string, l.id as string);
  }

  const agg = new Map<string, Agg>();
  const bump = (id: string): Agg => {
    let a = agg.get(id);
    if (!a) { a = { impressions: 0, clicks: 0, inquiries: 0, queries: new Map() }; agg.set(id, a); }
    return a;
  };

  let gscError: string | null = null;
  try {
    const pages = await fetchPagesForRange(supabase, win.startDate, win.endDate);
    for (const row of pages) {
      const slug = slugFromUrl(row.keys[0] || '');
      const id = slug ? slugToId.get(slug) : undefined;
      if (!id) continue;
      const a = bump(id);
      a.impressions += row.impressions || 0;
      a.clicks += row.clicks || 0;
    }

    const queries = await fetchQueriesForRange(supabase, win.startDate, win.endDate);
    for (const row of queries) {
      const slug = slugFromUrl(row.keys[1] || '');
      const id = slug ? slugToId.get(slug) : undefined;
      if (!id) continue;
      const q = (row.keys[0] || '').trim();
      if (!q) continue;
      const a = bump(id);
      const prev = a.queries.get(q) || { impressions: 0, clicks: 0 };
      prev.impressions += row.impressions || 0;
      prev.clicks += row.clicks || 0;
      a.queries.set(q, prev);
    }
  } catch (e) {
    gscError = e instanceof Error ? e.message : String(e);
  }

  // Inquiries this month (contact_messages whose body names the slug).
  const { data: msgs } = await supabase
    .from('contact_messages')
    .select('message')
    .like('subject', 'Αίτημα διαθεσιμότητας%')
    .gte('created_at', win.firstOfMonth.toISOString())
    .lt('created_at', win.firstOfNextMonth.toISOString());
  for (const m of msgs || []) {
    const body = (m.message as string) || '';
    for (const [slug, id] of slugToId) {
      if (body.includes(`(${slug})`)) { bump(id).inquiries += 1; break; }
    }
  }

  const rows = [];
  for (const [listing_id, a] of agg) {
    if (a.impressions === 0 && a.clicks === 0 && a.inquiries === 0) continue;
    const top_queries = [...a.queries.entries()]
      .map(([query, v]) => ({ query, impressions: v.impressions, clicks: v.clicks }))
      .sort((x, y) => y.impressions - x.impressions)
      .slice(0, 5);
    rows.push({
      listing_id,
      month: win.monthKey,
      impressions: a.impressions,
      clicks: a.clicks,
      inquiries: a.inquiries,
      top_queries: top_queries.length ? top_queries : null,
      snapshot_at: new Date().toISOString(),
    });
  }

  let upserted = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const { error: upErr } = await supabase
      .from('listing_monthly_stats')
      .upsert(chunk, { onConflict: 'listing_id,month' });
    if (upErr) throw new Error(`upsert: ${upErr.message}`);
    upserted += chunk.length;
  }

  return { upserted, gscError };
}

function pct(current: number, prev: number): number | null {
  if (prev <= 0) return null;
  return Math.round(((current - prev) / prev) * 100);
}

// Build per-owner report objects for a month — the data the admin previews and
// the emails render from. Reads only the frozen snapshot tables (no GSC calls).
//
// `boost` is a display-only vanity number added to EVERY listing's impressions
// (admin-set, per send). It never touches the stored snapshot, and the
// month-over-month % stays computed on the REAL numbers so the trend arrow
// remains honest — only the absolute figures are inflated.
export async function buildOwnerReports(
  supabase: AdminSupabase,
  win: MonthWindow,
  boost = 0,
): Promise<OwnerReport[]> {
  const { data: cur } = await supabase
    .from('listing_monthly_stats')
    .select('listing_id, impressions, clicks, inquiries, top_queries')
    .eq('month', win.monthKey);
  if (!cur || cur.length === 0) return [];

  const listingIds = cur.map(r => r.listing_id as string);

  const [{ data: prev }, { data: listings }, { data: sends }] = await Promise.all([
    supabase
      .from('listing_monthly_stats')
      .select('listing_id, impressions, inquiries')
      .eq('month', win.prevMonthKey)
      .in('listing_id', listingIds),
    supabase
      .from('listings')
      .select('id, owner_id, slug, title_el, title_en')
      .in('id', listingIds),
    supabase
      .from('report_sends')
      .select('owner_id, sent_at')
      .eq('month', win.monthKey),
  ]);

  const prevById = new Map<string, { impressions: number; inquiries: number }>();
  for (const p of prev || []) {
    prevById.set(p.listing_id as string, { impressions: p.impressions as number, inquiries: p.inquiries as number });
  }
  const listingById = new Map<string, { owner_id: string; slug: string; title: string }>();
  for (const l of listings || []) {
    listingById.set(l.id as string, {
      owner_id: l.owner_id as string,
      slug: (l.slug as string) || '',
      title: (l.title_el as string) || (l.title_en as string) || (l.slug as string) || '(κατάλυμα)',
    });
  }
  const sentByOwner = new Map<string, string>();
  for (const s of sends || []) sentByOwner.set(s.owner_id as string, s.sent_at as string);

  // Owner profiles (email + name).
  const ownerIds = [...new Set((listings || []).map(l => l.owner_id as string))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in('id', ownerIds);
  const profileById = new Map<string, { email: string; name: string }>();
  for (const p of profiles || []) {
    profileById.set(p.id as string, { email: (p as { email?: string }).email || '', name: (p.full_name as string) || '' });
  }

  const byOwner = new Map<string, OwnerReport>();
  for (const row of cur) {
    const meta = listingById.get(row.listing_id as string);
    if (!meta) continue;
    const prof = profileById.get(meta.owner_id);
    if (!prof || !prof.email) continue; // can't email → skip

    let report = byOwner.get(meta.owner_id);
    if (!report) {
      report = {
        ownerId: meta.owner_id,
        email: prof.email,
        name: prof.name,
        listings: [],
        totalImpressions: 0,
        totalClicks: 0,
        totalInquiries: 0,
        prevTotalImpressions: 0,
        totalPct: null,
        alreadySentAt: sentByOwner.get(meta.owner_id) || null,
      };
      byOwner.set(meta.owner_id, report);
    }

    const p = prevById.get(row.listing_id as string) || { impressions: 0, inquiries: 0 };
    const realImpr = (row.impressions as number) || 0;
    const impressions = realImpr + boost;               // boosted for display
    const clicks = (row.clicks as number) || 0;
    const inquiries = (row.inquiries as number) || 0;
    const topQueries = Array.isArray(row.top_queries) ? (row.top_queries as QueryLine[]) : [];

    report.listings.push({
      listing_id: row.listing_id as string,
      slug: meta.slug,
      title: meta.title,
      impressions,
      clicks,
      inquiries,
      prevImpressions: p.impressions,
      prevInquiries: p.inquiries,
      impressionsPct: pct(realImpr, p.impressions),      // trend on REAL numbers
      topQueries,
    });
    report.totalImpressions += impressions;
    report.totalClicks += clicks;
    report.totalInquiries += inquiries;
    report.prevTotalImpressions += p.impressions;
  }

  const reports = [...byOwner.values()];
  for (const r of reports) {
    // totalPct on real totals (strip the boost we added per listing).
    r.totalPct = pct(r.totalImpressions - boost * r.listings.length, r.prevTotalImpressions);
    r.listings.sort((a, b) => b.impressions - a.impressions);
  }
  reports.sort((a, b) => b.totalImpressions - a.totalImpressions);
  return reports;
}

// Site-wide totals + visitor-country breakdown for the month, straight from
// GSC (the whole month window — GSC keeps ~16 months, so past months work).
// Best-effort: returns zeros/empty if GSC is disconnected or errors.
export async function getSiteMonthlyStats(
  supabase: AdminSupabase,
  win: MonthWindow,
): Promise<SiteStats> {
  try {
    const rows = await fetchCountriesForRange(supabase, win.startDate, win.endDate);
    let totalImpressions = 0;
    let totalClicks = 0;
    for (const r of rows) {
      totalImpressions += r.impressions || 0;
      totalClicks += r.clicks || 0;
    }
    const countries: TopCountry[] = rows
      .map(r => {
        const code = r.keys[0] || '';
        const meta = countryMeta(code);
        return {
          code,
          flag: meta.flag,
          name: meta.name,
          impressions: r.impressions || 0,
          pct: totalImpressions > 0 ? Math.round(((r.impressions || 0) / totalImpressions) * 100) : 0,
        };
      })
      .filter(c => c.impressions > 0)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 6);
    return { totalImpressions, totalClicks, countries };
  } catch {
    return { totalImpressions: 0, totalClicks: 0, countries: [] };
  }
}

function esc(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function pctBadge(p: number | null): string {
  if (p === null) return '<span style="color:#94a3b8;font-size:12px;">νέο</span>';
  if (p > 0) return `<span style="color:#16a34a;font-weight:700;font-size:13px;">▲ +${p}%</span>`;
  if (p < 0) return `<span style="color:#dc2626;font-weight:700;font-size:13px;">▼ ${p}%</span>`;
  return `<span style="color:#64748b;font-size:13px;">→ 0%</span>`;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// One country row: flag + name on top, a filled bar + % underneath.
function countryRow(c: TopCountry): string {
  const label = `${c.flag ? c.flag + ' ' : ''}${esc(c.name)}`;
  return `
  <div style="margin-bottom:11px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:14px;color:#0f172a;">${label}</td>
      <td align="right" style="font-size:14px;font-weight:700;color:#0369a1;white-space:nowrap;">${c.pct}%</td>
    </tr></table>
    <div style="background:#e0f2fe;border-radius:6px;height:8px;margin-top:5px;">
      <div style="background:#0284c7;height:8px;border-radius:6px;width:${Math.max(c.pct, 2)}%;font-size:0;line-height:0;">&nbsp;</div>
    </div>
  </div>`;
}

// Render one owner's monthly report email (HTML).
// opts.siteQrCid — when set, embeds the ChalkidikiHub QR via that CID image
// (the send route attaches the PNG under the same cid).
export function renderOwnerEmailHtml(
  report: OwnerReport,
  site: SiteStats,
  monthKey: string,
  opts: { siteQrCid?: string } = {},
): string {
  const monthLabel = monthLabelGreek(monthKey);
  const name = esc(report.name || '');
  const homeUrl = SITE_URL;

  // Per listing: ONLY how many people saw it (+ month-over-month).
  const listingRows = report.listings.map(l => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:12px;">
      <tr><td style="padding:16px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;">
            <div style="font-size:15px;font-weight:700;color:#0f172a;">${esc(l.title)}</div>
            <div style="font-size:13px;color:#64748b;margin-top:2px;">το είδαν σε αναζητήσεις ${pctBadge(l.impressionsPct)}</div>
          </td>
          <td align="right" style="vertical-align:middle;white-space:nowrap;">
            <span style="font-size:30px;font-weight:800;color:#0369a1;">👁 ${l.impressions.toLocaleString('el-GR')}</span>
          </td>
        </tr></table>
      </td></tr>
    </table>`).join('');

  const countriesBlock = site.countries.length ? `
        <tr><td style="padding:22px 28px 4px;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#64748b;margin-bottom:14px;">🌍 Από ποιες χώρες μας είδαν</div>
          ${site.countries.map(countryRow).join('')}
        </td></tr>` : '';

  const siteBlock = site.totalImpressions > 0 ? `
        <tr><td style="padding:20px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0c4a6e,#0369a1);border-radius:12px;">
            <tr><td style="padding:20px 22px;color:#fff;">
              <div style="font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#bae6fd;margin-bottom:4px;">Όλο το ChalkidikiHub τον ${monthLabel}</div>
              <div style="font-size:34px;font-weight:800;line-height:1.05;">${site.totalImpressions.toLocaleString('el-GR')}</div>
              <div style="font-size:14px;color:#e0f2fe;margin-top:4px;">φορές εμφανίστηκαν τα καταλύματά μας σε αναζητήσεις ${site.totalClicks > 0 ? `· <strong>${site.totalClicks.toLocaleString('el-GR')}</strong> επισκέψεις στο site` : ''}</div>
            </td></tr>
          </table>
        </td></tr>` : '';

  return `<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

        <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7);padding:24px 28px;color:#fff;">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;font-weight:600;">ChalkidikiHub · Μηνιαία αναφορά</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">Πόσοι σας είδαν τον ${monthLabel}</div>
        </td></tr>

        <tr><td style="padding:22px 28px 4px;">
          <p style="margin:0 0 10px;font-size:15px;color:#374151;">${name ? `Γεια σας, ${name}! 👋` : 'Γεια σας! 👋'}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            Χαιρόμαστε που είστε μαζί μας. Ορίστε πόσοι ταξιδιώτες είδαν τα καταλύματά σας στο ChalkidikiHub τον <strong>${monthLabel}</strong> — μέσα από αναζητήσεις σε Google και AI βοηθούς όπως το ChatGPT.
          </p>
        </td></tr>

        <tr><td style="padding:20px 28px 4px;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#64748b;margin-bottom:12px;">Τα καταλύματά σας</div>
          ${listingRows}
        </td></tr>

        ${siteBlock}

        ${countriesBlock}

        <tr><td style="padding:22px 28px 4px;">
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 20px;">
            <div style="font-size:16px;font-weight:700;color:#166534;margin-bottom:6px;">🌟 Είστε μέλος της ομάδας μας</div>
            <p style="margin:0;font-size:14px;line-height:1.65;color:#166534;">
              Κάθε μήνα, χιλιάδες ταξιδιώτες ανακαλύπτουν τη Χαλκιδική μέσα από το ChalkidikiHub — και τα δικά σας καταλύματα είναι στην πρώτη γραμμή. Μαζί χτίζουμε τον πιο έξυπνο, «AI-friendly» τουριστικό οδηγό της περιοχής, και η δική σας παρουσία τον κάνει ακόμα πιο δυνατό. Σας ευχαριστούμε που μας εμπιστεύεστε! 💙
            </p>
            <p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#15803d;">
              <strong>Ξέρετε κάποιον ιδιοκτήτη που θα ταίριαζε εδώ;</strong> Πείτε του για εμάς — όσο μεγαλώνει η κοινότητά μας, τόσο περισσότεροι επισκέπτες βλέπουν <em>όλα</em> τα καταλύματα.
            </p>
          </div>
        </td></tr>

        <tr><td style="padding:18px 28px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
            <tr>
              <td style="padding:16px 18px;vertical-align:middle;">
                <div style="font-size:15px;font-weight:700;color:#78350f;margin-bottom:6px;">📱 Μην ξεχάσετε το QR code στον χώρο σας</div>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#92400e;">
                  Τυπώστε το QR code του καταλύματός σας (θα το βρείτε στο dashboard) και τοποθετήστε το στον χώρο σας. Οι επισκέπτες το σκανάρουν και λαμβάνουν <strong>όλες τις πληροφορίες για την περιοχή</strong>: φαγητό, ποτό, δραστηριότητες και ημερήσιες εκδρομές.
                </p>
                <p style="margin:10px 0 0;font-size:13px;line-height:1.6;color:#92400e;">
                  Δίπλα θα βρείτε και το QR του <strong>ChalkidikiHub</strong> — μοιραστείτε το ελεύθερα με τους επισκέπτες σας. 👉
                </p>
              </td>
              ${opts.siteQrCid ? `<td width="132" align="center" style="padding:16px 18px 16px 0;vertical-align:middle;">
                <img src="cid:${opts.siteQrCid}" width="116" height="116" alt="ChalkidikiHub QR" style="display:block;border:6px solid #fff;border-radius:10px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.12);">
                <div style="font-size:10px;color:#a16207;margin-top:6px;font-weight:600;">chalkidikihub.gr</div>
              </td>` : ''}
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:18px 28px 4px;" align="center">
          <a href="${homeUrl}" style="display:inline-block;background:#0284c7;color:#fff;text-decoration:none;padding:13px 26px;border-radius:10px;font-size:15px;font-weight:700;">Επισκεφθείτε το ChalkidikiHub →</a>
        </td></tr>

        <tr><td style="padding:22px 28px 26px;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;text-align:center;">
            Λάβατε αυτή την αναφορά επειδή έχετε κατάλυμα στο <a href="https://chalkidikihub.gr" style="color:#0284c7;text-decoration:none;">chalkidikihub.gr</a>.<br>
            Τα στοιχεία προβολών προέρχονται από το Google Search Console. Για απορίες, απαντήστε σε αυτό το email.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function renderOwnerEmailText(report: OwnerReport, site: SiteStats, monthKey: string): string {
  const monthLabel = monthLabelGreek(monthKey);
  const lines = [
    `ChalkidikiHub — Πόσοι σας είδαν τον ${monthLabel}`,
    '',
    report.name ? `Γεια σας, ${report.name}!` : 'Γεια σας!',
    '',
    'Πόσοι ταξιδιώτες είδαν τα καταλύματά σας:',
  ];
  for (const l of report.listings) {
    const p = l.impressionsPct === null ? '' : ` (${l.impressionsPct > 0 ? '+' : ''}${l.impressionsPct}% vs προηγ. μήνα)`;
    lines.push(`• ${l.title}: ${l.impressions} προβολές${p}`);
  }
  if (site.totalImpressions > 0) {
    lines.push('', `Όλο το ChalkidikiHub τον ${monthLabel}: ${site.totalImpressions} εμφανίσεις σε αναζητήσεις.`);
  }
  if (site.countries.length) {
    lines.push('Από ποιες χώρες μας είδαν: ' + site.countries.map(c => `${c.name} ${c.pct}%`).join(' · '));
  }
  lines.push(
    '',
    'Είστε μέλος της ομάδας μας — μαζί χτίζουμε τον πιο AI-friendly οδηγό της Χαλκιδικής. Ξέρετε κάποιον ιδιοκτήτη που θα ταίριαζε; Πείτε του για εμάς!',
    '',
    '📱 Μην ξεχάσετε: τυπώστε το QR code του καταλύματός σας (από το dashboard) και βάλτε το στον χώρο σας — οι επισκέπτες σκανάρουν και βλέπουν όλον τον οδηγό της περιοχής (φαγητό, ποτό, δραστηριότητες, ημερήσιες εκδρομές).',
    '',
    `Επισκεφθείτε το ChalkidikiHub: ${SITE_URL}`,
    '',
    'ChalkidikiHub · chalkidikihub.gr',
  );
  return lines.join('\n');
}
