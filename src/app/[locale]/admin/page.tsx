'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users, List, FileText, Waves, UtensilsCrossed, Landmark, AlertTriangle,
  ClipboardList, MessageSquare, QrCode, Building, Star, ChevronDown, ChevronUp,
  CheckCircle, Globe,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface ActionItem {
  type: string;
  label: string;
  count: number;
  href: string;
  icon: typeof Users;
  color: string;
}

interface LogEntry {
  id: string;
  message: string;
  severity: string;
  type: string;
  created_at: string;
}

const CONTENT_TABLES = ['beaches', 'restaurants', 'activities', 'blog_articles', 'sales', 'villages'] as const;
const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;
const LANG_FLAGS: Record<string, string> = { el: '🇬🇷', en: '🇬🇧', de: '🇩🇪', bg: '🇧🇬', ru: '🇷🇺', ro: '🇷🇴' };

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [metrics, setMetrics] = useState({ content: 0, listingsPublished: 0, listingsTotal: 0, salesPublished: 0, salesTotal: 0, users: 0, newUsers: 0 });
  const [seoHealth, setSeoHealth] = useState({ perfect: 0, issues: 0, critical: 0, total: 0 });
  const [translationCoverage, setTranslationCoverage] = useState<Record<string, { filled: number; total: number }>>({});
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'admin'>('all');
  const [qrStats, setQrStats] = useState<Array<{ slug: string; title: string; views: number }>>([]);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const supabase = createClient();

    // --- Action Required ---
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
    if (pendingReviews > 0) actionItems.push({ type: 'reviews', label: 'Pending Reviews', count: pendingReviews, href: '/admin/reviews', icon: Star, color: 'amber' });
    if ((subRes.count || 0) > 0) actionItems.push({ type: 'submissions', label: 'Pending Submissions', count: subRes.count || 0, href: '/admin/submissions', icon: ClipboardList, color: 'amber' });
    if (unreadMsgs > 0) actionItems.push({ type: 'messages', label: 'Unread Messages', count: unreadMsgs, href: '/admin/messages', icon: MessageSquare, color: 'blue' });
    if ((draftSales.count || 0) > 0) actionItems.push({ type: 'sales', label: 'Draft Sales', count: draftSales.count || 0, href: '/admin/sales', icon: Building, color: 'orange' });
    setActions(actionItems);

    // --- Key Metrics ---
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

    // --- SEO Health ---
    const seoData = { perfect: 0, issues: 0, critical: 0, total: 0 };
    for (const table of CONTENT_TABLES) {
      const titleField = table === 'blog_articles' ? 'title_el' : 'name_el';
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

    // --- Translation Coverage ---
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

    // --- Recent Activity ---
    const { data: logs } = await supabase
      .from('activity_logs')
      .select('id, message, severity, type, created_at')
      .order('created_at', { ascending: false })
      .limit(15);
    setRecentLogs(logs || []);

    // --- QR Stats ---
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
      setQrStats(allListings.map(l => ({ slug: l.slug, title: l.title_el || l.slug, views: slugCounts.get(l.slug) || 0 })).sort((a, b) => b.views - a.views));
    }

    setLoading(false);
  }

  const filteredLogs = recentLogs.filter(log => {
    if (logFilter === 'error') return log.severity === 'error' || log.severity === 'warning';
    if (logFilter === 'admin') return log.type === 'admin';
    return true;
  });

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Row 1: Action Required */}
      {actions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {actions.map((a) => {
            const colors: Record<string, string> = {
              amber: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
              blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
              orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
            };
            const textColors: Record<string, string> = {
              amber: 'text-amber-700',
              blue: 'text-blue-700',
              orange: 'text-orange-700',
            };
            const badgeColors: Record<string, string> = {
              amber: 'bg-amber-200 text-amber-800',
              blue: 'bg-blue-200 text-blue-800',
              orange: 'bg-orange-200 text-orange-800',
            };
            return (
              <Link key={a.type} href={a.href}
                className={`flex items-center gap-3 p-4 border rounded-xl transition-colors ${colors[a.color]}`}>
                <a.icon className={`w-5 h-5 ${textColors[a.color]}`} />
                <span className={`flex-1 font-semibold text-sm ${textColors[a.color]}`}>{a.label}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColors[a.color]}`}>{a.count}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">Όλα καθαρά — δεν υπάρχουν εκκρεμότητες</span>
        </div>
      )}

      {/* Row 2: Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><Waves className="w-4 h-4 text-cyan-600" /></div>
            <span className="text-xs font-medium text-gray-500 uppercase">Περιεχόμενο</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.content}</div>
          <p className="text-xs text-gray-400 mt-1">Beaches + Restaurants + Activities + Blog</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><List className="w-4 h-4 text-purple-600" /></div>
            <span className="text-xs font-medium text-gray-500 uppercase">Καταλύματα</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.listingsPublished}<span className="text-lg text-gray-400">/{metrics.listingsTotal}</span></div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${metrics.listingsTotal > 0 ? (metrics.listingsPublished / metrics.listingsTotal) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><Building className="w-4 h-4 text-emerald-600" /></div>
            <span className="text-xs font-medium text-gray-500 uppercase">Πωλήσεις</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.salesPublished}<span className="text-lg text-gray-400">/{metrics.salesTotal}</span></div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${metrics.salesTotal > 0 ? (metrics.salesPublished / metrics.salesTotal) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-4 h-4 text-blue-600" /></div>
            <span className="text-xs font-medium text-gray-500 uppercase">Χρήστες</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.users}</div>
          {metrics.newUsers > 0 && <p className="text-xs text-green-600 mt-1">+{metrics.newUsers} τελευταία εβδομάδα</p>}
        </div>
      </div>

      {/* Row 3: Content Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* SEO Score */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">SEO Health</h3>
            <Link href="/admin/seo" className="text-xs text-red-600 hover:underline">Details →</Link>
          </div>
          {seoHealth.total > 0 ? (
            <>
              <div className="flex gap-3 mb-3">
                <div className="flex-1 text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-700">{seoHealth.perfect}</div>
                  <div className="text-[10px] text-green-600 font-medium">Perfect</div>
                </div>
                <div className="flex-1 text-center p-2 bg-amber-50 rounded-lg">
                  <div className="text-xl font-bold text-amber-700">{seoHealth.issues}</div>
                  <div className="text-[10px] text-amber-600 font-medium">Issues</div>
                </div>
                <div className="flex-1 text-center p-2 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-700">{seoHealth.critical}</div>
                  <div className="text-[10px] text-red-600 font-medium">Critical</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
                <div className="bg-green-500 h-2" style={{ width: `${(seoHealth.perfect / seoHealth.total) * 100}%` }} />
                <div className="bg-amber-400 h-2" style={{ width: `${(seoHealth.issues / seoHealth.total) * 100}%` }} />
                <div className="bg-red-500 h-2" style={{ width: `${(seoHealth.critical / seoHealth.total) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-2">{seoHealth.total} pages scanned</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Loading...</p>
          )}
        </div>

        {/* Translation Coverage */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2"><Globe className="w-4 h-4" /> Translation Coverage</h3>
            <Link href="/admin/translations" className="text-xs text-red-600 hover:underline">Details →</Link>
          </div>
          <div className="space-y-2">
            {LANGS.map(lang => {
              const data = translationCoverage[lang];
              if (!data || data.total === 0) return null;
              const pct = Math.round((data.filled / data.total) * 100);
              return (
                <div key={lang} className="flex items-center gap-2">
                  <span className="text-sm w-6">{LANG_FLAGS[lang]}</span>
                  <span className="text-xs font-medium text-gray-600 w-6 uppercase">{lang}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${pct >= 90 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right ${pct >= 90 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">Recent Activity</h3>
          <div className="flex gap-1">
            {(['all', 'error', 'admin'] as const).map(f => (
              <button key={f} onClick={() => setLogFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${logFilter === f ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                {f === 'all' ? 'All' : f === 'error' ? 'Errors' : 'Admin'}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredLogs.length > 0 ? filteredLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="flex items-center gap-3 px-5 py-2.5">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                log.severity === 'error' ? 'bg-red-100 text-red-700' :
                log.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-500'
              }`}>{log.severity}</span>
              {log.type && (
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-medium shrink-0">{log.type}</span>
              )}
              <span className="text-sm text-gray-700 flex-1 truncate">{log.message}</span>
              <span className="text-[11px] text-gray-400 shrink-0">{new Date(log.created_at).toLocaleString('el', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )) : (
            <div className="px-5 py-6 text-center text-sm text-gray-400">No logs found</div>
          )}
        </div>
        <div className="px-5 py-2 border-t border-gray-100 text-right">
          <Link href="/admin/logs" className="text-xs text-red-600 hover:underline">View all logs →</Link>
        </div>
      </div>

      {/* Row 5: QR Stats (collapsible) */}
      {qrStats.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl">
          <button onClick={() => setQrOpen(!qrOpen)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors rounded-xl">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-900 text-sm">QR Guest Guide</span>
              <span className="text-xs text-gray-400">({qrStats.reduce((s, q) => s + q.views, 0)} scans)</span>
            </div>
            {qrOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {qrOpen && (
            <div className="border-t border-gray-100 divide-y divide-gray-50">
              {qrStats.map((q) => (
                <div key={q.slug} className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-sm text-gray-700 truncate">{q.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${q.views > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>{q.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
