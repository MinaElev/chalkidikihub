'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users, List, FileText, Waves, UtensilsCrossed, Landmark,
  ClipboardList, MessageSquare, QrCode, Building, Star, ChevronRight,
  CheckCircle, Globe, Sparkles, ArrowUpRight, TrendingUp, Plus,
  Activity, Link2, Search, Languages, ShieldAlert, Circle,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface ActionItem {
  type: string;
  label: string;
  count: number;
  href: string;
  icon: typeof Users;
}

interface LogEntry {
  id: string;
  message: string;
  severity: string;
  type: string;
  created_at: string;
}

const CONTENT_TABLES = ['beaches', 'restaurants', 'activities', 'blog_articles', 'sales', 'villages'] as const;
const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
const LANG_FLAGS: Record<string, string> = { el: '🇬🇷', en: '🇬🇧', de: '🇩🇪', bg: '🇧🇬', ru: '🇷🇺', ro: '🇷🇴', sr: '🇷🇸' };
const LANG_NAMES: Record<string, string> = { el: 'Ελληνικά', en: 'English', de: 'Deutsch', bg: 'Български', ru: 'Русский', ro: 'Română', sr: 'Srpski' };

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [metrics, setMetrics] = useState({ content: 0, listingsPublished: 0, listingsTotal: 0, salesPublished: 0, salesTotal: 0, users: 0, newUsers: 0 });
  const [seoHealth, setSeoHealth] = useState({ perfect: 0, issues: 0, critical: 0, total: 0 });
  const [translationCoverage, setTranslationCoverage] = useState<Record<string, { filled: number; total: number }>>({});
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'admin'>('all');
  const [qrStats, setQrStats] = useState<Array<{ slug: string; title: string; views: number }>>([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const supabase = createClient();

    // Actions
    const [subRes, msgRes, revBeach, revRest, revAct, draftSales] = await Promise.all([
      supabase.from('user_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('contact_messages').select('subject').eq('read', false),
      supabase.from('beach_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('restaurant_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('activity_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('sales').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    ]);
    const unreadMsgs = (msgRes.data || []).filter(m => !m.subject?.startsWith('Αίτημα διαθεσιμότητας')).length;
    const pendingReviews = (revBeach.count || 0) + (revRest.count || 0) + (revAct.count || 0);

    const actionItems: ActionItem[] = [];
    if (pendingReviews > 0) actionItems.push({ type: 'reviews', label: 'Pending reviews', count: pendingReviews, href: '/admin/reviews', icon: Star });
    if ((subRes.count || 0) > 0) actionItems.push({ type: 'submissions', label: 'Pending submissions', count: subRes.count || 0, href: '/admin/submissions', icon: ClipboardList });
    if (unreadMsgs > 0) actionItems.push({ type: 'messages', label: 'Unread messages', count: unreadMsgs, href: '/admin/messages', icon: MessageSquare });
    if ((draftSales.count || 0) > 0) actionItems.push({ type: 'sales', label: 'Draft sales', count: draftSales.count || 0, href: '/admin/sales', icon: Building });
    setActions(actionItems);

    // Metrics
    const [userRes, listingRes, beachRes, restRes, actRes, artRes, salesRes] = await Promise.all([
      supabase.from('profiles').select('created_at'),
      supabase.from('listings').select('status'),
      supabase.from('beaches').select('*', { count: 'exact', head: true }),
      supabase.from('restaurants').select('*', { count: 'exact', head: true }),
      supabase.from('activities').select('*', { count: 'exact', head: true }),
      supabase.from('blog_articles').select('*', { count: 'exact', head: true }),
      supabase.from('sales').select('status'),
    ]);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const newUsers = (userRes.data || []).filter(u => u.created_at > weekAgo).length;
    const listings = listingRes.data || [];
    const sales = salesRes.data || [];
    setMetrics({
      content: (beachRes.count || 0) + (restRes.count || 0) + (actRes.count || 0) + (artRes.count || 0),
      listingsPublished: listings.filter(l => l.status === 'published').length,
      listingsTotal: listings.length,
      salesPublished: sales.filter(s => s.status === 'published').length,
      salesTotal: sales.length,
      users: userRes.data?.length || 0,
      newUsers,
    });

    // SEO Health
    const seoData = { perfect: 0, issues: 0, critical: 0, total: 0 };
    for (const table of CONTENT_TABLES) {
      const cols = (table === 'sales' || table === 'blog_articles')
        ? 'meta_title_el,meta_title_en,meta_description_el,meta_description_en,title_en,title_de,title_bg,title_ru,title_ro'
        : `meta_title_el,meta_title_en,meta_description_el,meta_description_en,name_en,name_de,name_bg,name_ru,name_ro`;
      const { data: rows } = await supabase.from(table).select(cols).limit(500);
      if (rows) {
        (rows as unknown as Record<string, unknown>[]).forEach((row) => {
          const fields = Object.values(row).filter(v => typeof v === 'string');
          const filled = fields.filter(v => (v as string).length > 0).length;
          const score = fields.length > 0 ? filled / fields.length : 0;
          seoData.total++;
          if (score >= 1) seoData.perfect++;
          else if (score < 0.4) seoData.critical++;
          else seoData.issues++;
        });
      }
    }
    setSeoHealth(seoData);

    // Translation Coverage
    const coverage: Record<string, { filled: number; total: number }> = {};
    LANGS.forEach(l => { coverage[l] = { filled: 0, total: 0 }; });
    const transTables = [
      { table: 'beaches', prefix: 'name' },
      { table: 'restaurants', prefix: 'name' },
      { table: 'activities', prefix: 'name' },
      { table: 'blog_articles', prefix: 'title' },
      { table: 'sales', prefix: 'title' },
      { table: 'villages', prefix: 'name' },
    ];
    for (const { table, prefix } of transTables) {
      const cols = LANGS.map(l => `${prefix}_${l}`).join(',');
      const { data: rows } = await supabase.from(table).select(cols).limit(500);
      if (rows) {
        (rows as unknown as Record<string, unknown>[]).forEach((row) => {
          LANGS.forEach(l => {
            coverage[l].total++;
            if (row[`${prefix}_${l}`] && (row[`${prefix}_${l}`] as string).length > 0) coverage[l].filled++;
          });
        });
      }
    }
    setTranslationCoverage(coverage);

    // Activity
    const { data: logs } = await supabase
      .from('activity_logs')
      .select('id, message, severity, type, created_at')
      .order('created_at', { ascending: false })
      .limit(15);
    setRecentLogs(logs || []);

    // QR stats
    const { data: allListings } = await supabase.from('listings').select('slug, title_el').eq('status', 'published').limit(100);
    const { data: qrLogs } = await supabase.from('activity_logs').select('details').eq('message', 'Guest page viewed').limit(500);
    const slugCounts = new Map<string, number>();
    if (qrLogs) {
      qrLogs.forEach(log => {
        const slug = (log.details as { slug?: string })?.slug;
        if (slug) slugCounts.set(slug, (slugCounts.get(slug) || 0) + 1);
      });
    }
    if (allListings) {
      setQrStats(allListings.map(l => ({ slug: l.slug, title: l.title_el || l.slug, views: slugCounts.get(l.slug) || 0 })).sort((a, b) => b.views - a.views).slice(0, 5));
    }

    setLoading(false);
  }

  const filteredLogs = recentLogs.filter(log => {
    if (logFilter === 'error') return log.severity === 'error' || log.severity === 'warning';
    if (logFilter === 'admin') return log.type === 'admin';
    return true;
  });

  if (loading) {
    // CLS fix: render a skeleton that matches the loaded layout's first
    // viewport — header + action band + 4 metric cards. The previous centered
    // 60vh spinner caused a ~2000px content swap on data arrival, registering
    // CLS ≈ 0.95 on Vercel Speed Insights. Now the swap is in-place and the
    // viewport content barely moves.
    return (
      <div className="space-y-8 animate-pulse">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-44 bg-slate-200 rounded" />
            <div className="h-8 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-56 bg-slate-200 rounded" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-10 w-32 bg-slate-200 rounded-xl" />
            <div className="h-10 w-32 bg-slate-100 rounded-xl" />
            <div className="h-10 w-32 bg-slate-100 rounded-xl" />
          </div>
        </header>
        <div className="h-20 bg-gradient-to-r from-amber-50 to-white border border-amber-100 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white border border-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-64 bg-white border border-slate-200 rounded-2xl lg:col-span-2" />
          <div className="h-64 bg-white border border-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const listingsPct = metrics.listingsTotal > 0 ? (metrics.listingsPublished / metrics.listingsTotal) * 100 : 0;
  const salesPct = metrics.salesTotal > 0 ? (metrics.salesPublished / metrics.salesTotal) * 100 : 0;
  const seoScore = seoHealth.total > 0 ? Math.round((seoHealth.perfect / seoHealth.total) * 100) : 0;
  const totalQrScans = qrStats.reduce((s, q) => s + q.views, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600 mb-1">
            ChalkidikiHub · Control center
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString('el-GR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Primary action group */}
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/blog" className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transition-all">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            AI Article
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <Link href="/admin/brand-sites" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 text-sm font-medium rounded-xl transition-all">
            <Building className="w-4 h-4" />
            Brand sites
          </Link>
          <Link href="/admin/seo" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 text-sm font-medium rounded-xl transition-all">
            <Search className="w-4 h-4" />
            SEO audit
          </Link>
        </div>
      </header>

      {/* Action Required (only if any) */}
      {actions.length > 0 ? (
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-white border border-amber-100 rounded-2xl p-5">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl" aria-hidden />
          <div className="relative flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">Action required</h2>
            <span className="text-xs text-slate-500">· {actions.reduce((s, a) => s + a.count, 0)} items</span>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {actions.map((a) => (
              <Link key={a.type} href={a.href}
                className="group flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                  <a.icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500">{a.label}</div>
                  <div className="text-lg font-semibold text-slate-900 tabular-nums">{a.count}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 rounded-2xl">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-700">
            <CheckCircle className="w-4 h-4" />
          </span>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">Όλα καθαρά</div>
            <div className="text-xs text-slate-500">Δεν υπάρχουν εκκρεμότητες αυτή τη στιγμή</div>
          </div>
        </section>
      )}

      {/* Key metrics */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            icon={Waves}
            iconColor="text-sky-600 bg-sky-50"
            label="Content"
            value={metrics.content.toLocaleString()}
            caption="Beaches · Restaurants · Activities · Blog"
          />
          <MetricCard
            icon={List}
            iconColor="text-emerald-600 bg-emerald-50"
            label="Listings"
            value={metrics.listingsPublished.toLocaleString()}
            suffix={` / ${metrics.listingsTotal}`}
            progress={listingsPct}
            progressColor="bg-emerald-500"
          />
          <MetricCard
            icon={Building}
            iconColor="text-blue-600 bg-blue-50"
            label="Sales"
            value={metrics.salesPublished.toLocaleString()}
            suffix={` / ${metrics.salesTotal}`}
            progress={salesPct}
            progressColor="bg-blue-500"
          />
          <MetricCard
            icon={Users}
            iconColor="text-violet-600 bg-violet-50"
            label="Users"
            value={metrics.users.toLocaleString()}
            delta={metrics.newUsers > 0 ? `+${metrics.newUsers} this week` : undefined}
          />
        </div>
      </section>

      {/* Two-column: SEO Health + Translation Coverage */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SEO Health */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900">SEO health</h3>
              </div>
              <p className="text-xs text-slate-500">{seoHealth.total} pages scanned</p>
            </div>
            <Link href="/admin/seo" className="text-xs font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-4xl font-semibold tabular-nums text-slate-900 tracking-tight">{seoScore}%</span>
            <span className="text-xs text-slate-500">perfect pages</span>
          </div>

          {seoHealth.total > 0 && (
            <>
              <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 mb-3">
                <div className="bg-emerald-500" style={{ width: `${(seoHealth.perfect / seoHealth.total) * 100}%` }} />
                <div className="bg-amber-400" style={{ width: `${(seoHealth.issues / seoHealth.total) * 100}%` }} />
                <div className="bg-rose-500" style={{ width: `${(seoHealth.critical / seoHealth.total) * 100}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <HealthChip dotColor="bg-emerald-500" label="Perfect" count={seoHealth.perfect} />
                <HealthChip dotColor="bg-amber-400"   label="Issues"  count={seoHealth.issues} />
                <HealthChip dotColor="bg-rose-500"    label="Critical" count={seoHealth.critical} />
              </div>
            </>
          )}
        </div>

        {/* Translation Coverage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Languages className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900">Translation coverage</h3>
              </div>
              <p className="text-xs text-slate-500">Across 7 languages · 6 content types</p>
            </div>
            <Link href="/admin/translations" className="text-xs font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {LANGS.map(lang => {
              const data = translationCoverage[lang];
              if (!data || data.total === 0) return null;
              const pct = Math.round((data.filled / data.total) * 100);
              const color = pct >= 90 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-rose-500';
              const textColor = pct >= 90 ? 'text-emerald-700' : pct >= 60 ? 'text-amber-700' : 'text-rose-700';
              return (
                <div key={lang} className="flex items-center gap-3">
                  <span className="text-sm w-4">{LANG_FLAGS[lang]}</span>
                  <span className="text-xs font-medium text-slate-600 w-20">{LANG_NAMES[lang]}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-xs font-semibold tabular-nums w-10 text-right ${textColor}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick create row */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Quick create</h3>
          <span className="text-xs text-slate-500">Add new content</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <CreateChip href="/admin/beaches/new"      label="Beach"      icon={Waves}          />
          <CreateChip href="/admin/restaurants/new"  label="Restaurant" icon={UtensilsCrossed}/>
          <CreateChip href="/admin/activities/new"   label="Activity"   icon={Landmark}       />
          <CreateChip href="/admin/blog/new"         label="Blog post"  icon={FileText}       />
          <CreateChip href="/admin/broken-links"     label="Broken links" icon={Link2} ghost />
          <CreateChip href="/admin/translations"     label="Translations" icon={Globe} ghost  />
        </div>
      </section>

      {/* Two column: Activity + QR */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              {(['all', 'error', 'admin'] as const).map(f => (
                <button key={f} onClick={() => setLogFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    logFilter === f
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  {f === 'all' ? 'All' : f === 'error' ? 'Errors' : 'Admin'}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {filteredLogs.length > 0 ? filteredLogs.slice(0, 8).map((log) => {
              const sevStyle = log.severity === 'error'
                ? 'bg-rose-500'
                : log.severity === 'warning'
                  ? 'bg-amber-400'
                  : 'bg-slate-300';
              return (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                  <span className={`w-1.5 h-1.5 rounded-full ${sevStyle} shrink-0`} />
                  {log.type && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 shrink-0">
                      {log.type}
                    </span>
                  )}
                  <span className="text-sm text-slate-700 flex-1 truncate">{log.message}</span>
                  <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                    {new Date(log.created_at).toLocaleString('el', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            }) : (
              <div className="px-5 py-12 text-center text-sm text-slate-400">No logs found</div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <Link href="/admin/logs" className="text-xs font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
              View all logs <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* QR Stats */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">Guest QR scans</h3>
            </div>
            <p className="text-xs text-slate-500">
              <span className="text-lg font-semibold text-slate-900 tabular-nums">{totalQrScans}</span>
              <span className="text-slate-400 ml-1">total scans</span>
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {qrStats.length > 0 ? qrStats.map((q) => (
              <div key={q.slug} className="flex items-center gap-3 px-5 py-2.5">
                <Circle className={`w-1.5 h-1.5 shrink-0 ${q.views > 0 ? 'fill-emerald-500 text-emerald-500' : 'fill-slate-200 text-slate-200'}`} />
                <span className="text-xs text-slate-700 flex-1 truncate">{q.title}</span>
                <span className={`text-xs font-semibold tabular-nums ${q.views > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                  {q.views}
                </span>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-xs text-slate-400">No scans yet</div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <Link href="/admin/logs" className="text-xs font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
              View all activity <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────

function MetricCard({ icon: Icon, iconColor, label, value, suffix, caption, delta, progress, progressColor }: {
  icon: typeof Users; iconColor: string; label: string; value: string;
  suffix?: string; caption?: string; delta?: string;
  progress?: number; progressColor?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-3xl font-semibold tabular-nums text-slate-900 tracking-tight">{value}</span>
        {suffix && <span className="text-base font-medium text-slate-400 tabular-nums">{suffix}</span>}
      </div>
      {caption && <p className="text-[11px] text-slate-400 mt-1.5">{caption}</p>}
      {delta && (
        <p className="text-[11px] text-emerald-600 font-medium mt-1.5 inline-flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {delta}
        </p>
      )}
      {progress !== undefined && (
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${progressColor} rounded-full transition-all`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function HealthChip({ dotColor, label, count }: { dotColor: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <span className="ml-auto text-xs font-semibold tabular-nums text-slate-900">{count}</span>
    </div>
  );
}

function CreateChip({ href, label, icon: Icon, ghost }: { href: string; label: string; icon: typeof Users; ghost?: boolean }) {
  const style = ghost
    ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50';
  return (
    <Link href={href} className={`inline-flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-medium transition-all ${style}`}>
      {ghost ? <Icon className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      {label}
    </Link>
  );
}
