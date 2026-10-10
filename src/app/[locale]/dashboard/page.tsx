'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  Home, UtensilsCrossed, Landmark, FileText, ArrowUpRight,
  MousePointer, Phone, Mail, ExternalLink, Calendar, Building,
  CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Plus, MessageCircle,
  BarChart3, Sparkles, Check, CheckCheck, RotateCcw, Archive, Inbox,
} from 'lucide-react';

type Inquiry = { id: string; name: string; email: string; subject: string; message: string; created_at: string; read_at: string | null };

export default function DashboardPage() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [salesStats, setSalesStats] = useState({ total: 0, published: 0 });
  const [submissionCount, setSubmissionCount] = useState(0);
  const [clickStats, setClickStats] = useState<Record<string, number>>({});
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesOpen, setInquiriesOpen] = useState(true);
  const [inquiryTab, setInquiryTab] = useState<'pending' | 'history'>('pending');
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');

      const { data } = await supabase.from('listings').select('status, slug, title_el').eq('owner_id', user.id);
      if (data) {
        setStats({
          total: data.length,
          published: data.filter((l) => l.status === 'published').length,
          draft: data.filter((l) => l.status === 'draft').length,
        });
      }

      const { data: salesData } = await supabase.from('sales').select('status').eq('owner_id', user.id);
      if (salesData) {
        setSalesStats({
          total: salesData.length,
          published: salesData.filter((s) => s.status === 'published').length,
        });
      }

      const { count } = await supabase.from('user_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      setSubmissionCount(count || 0);

      const listingSlugs = data?.map(l => l.slug) || [];
      if (listingSlugs.length > 0) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
        const { data: logs } = await supabase
          .from('activity_logs')
          .select('details')
          .eq('message', 'Booking click')
          .gte('created_at', thirtyDaysAgo);

        const counts: Record<string, number> = {};
        logs?.forEach(log => {
          const d = log.details as { listing_slug?: string; type?: string };
          if (d.listing_slug && listingSlugs.includes(d.listing_slug) && d.type) {
            counts[d.type] = (counts[d.type] || 0) + 1;
          }
        });
        setClickStats(counts);

        try {
          // Slugs are derived server-side from the authenticated owner.
          const res = await fetch('/api/inquiry');
          if (res.ok) {
            const inqData = await res.json();
            if (Array.isArray(inqData)) setInquiries(inqData);
          }
        } catch {}
      }
    });
  }, []);

  const pending = inquiries.filter(i => !i.read_at);
  const history = inquiries.filter(i => i.read_at);

  // Optimistically flip read state locally, then persist. On failure, refetch.
  async function setRead(ids: string[], read: boolean) {
    if (ids.length === 0) return;
    setBusyIds(prev => { const n = new Set(prev); ids.forEach(id => n.add(id)); return n; });
    const stamp = new Date().toISOString();
    setInquiries(prev => prev.map(i => ids.includes(i.id) ? { ...i, read_at: read ? stamp : null } : i));
    try {
      const res = await fetch('/api/inquiry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, read }),
      });
      if (!res.ok) throw new Error('failed');
    } catch {
      // Revert on error.
      setInquiries(prev => prev.map(i => ids.includes(i.id) ? { ...i, read_at: read ? null : i.read_at } : i));
    } finally {
      setBusyIds(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n; });
    }
  }

  const totalClicks = Object.values(clickStats).reduce((s, v) => s + v, 0);
  const listingsPct = stats.total > 0 ? (stats.published / stats.total) * 100 : 0;
  const salesPct = salesStats.total > 0 ? (salesStats.published / salesStats.total) * 100 : 0;
  const hasActions = pending.length > 0 || stats.draft > 0;

  const L = {
    hello:      locale === 'el' ? `Γεια σου, ${userName}!` : `Hello, ${userName}!`,
    subtitle:   locale === 'el' ? 'Ο πίνακας ελέγχου σου στο ChalkidikiHub' : 'Your ChalkidikiHub control center',
    kicker:     locale === 'el' ? 'Πίνακας ελέγχου' : 'Dashboard',
    listings:   t('myListings'),
    sales:      locale === 'el' ? 'Πωλήσεις' : 'Sales',
    inquiries:  locale === 'el' ? 'Αιτήματα' : 'Inquiries',
    submissions:locale === 'el' ? 'Προτάσεις' : 'Submissions',
    actionTitle:locale === 'el' ? 'Χρειάζονται την προσοχή σου' : 'Needs your attention',
    clicks30:   locale === 'el' ? 'Κλικ τελευταίων 30 ημερών' : 'Clicks last 30 days',
    inquiryList:locale === 'el' ? 'Αιτήματα διαθεσιμότητας' : 'Availability inquiries',
    quickCreate:locale === 'el' ? 'Τι θέλεις να δημιουργήσεις;' : 'What would you like to create?',
    newListing: locale === 'el' ? 'Νέο κατάλυμα' : 'New listing',
    newListingDesc: locale === 'el' ? 'Ενοικιαζόμενο δωμάτιο ή κατοικία' : 'Rental room or accommodation',
    newSale:    locale === 'el' ? 'Νέα πώληση' : 'New sale',
    newSaleDesc: locale === 'el' ? 'Κατοικία, γη, επαγγελματικό' : 'House, land, commercial',
    suggest:    locale === 'el' ? 'Πρότεινε περιεχόμενο' : 'Suggest content',
    suggestDesc:locale === 'el' ? 'Βοήθησε την κοινότητα με νέα μέρη & άρθρα' : 'Help the community with new places & articles',
    restaurant: locale === 'el' ? 'Εστιατόριο' : 'Restaurant',
    activity:   locale === 'el' ? 'Δραστηριότητα' : 'Activity',
    article:    locale === 'el' ? 'Άρθρο' : 'Article',
    draftBadge: locale === 'el' ? 'πρόχειρα καταλύματα — δημοσίευσέ τα!' : 'draft listings — publish them!',
    inquiryBadge: locale === 'el' ? 'αιτήματα διαθεσιμότητας' : 'availability inquiries',
    allClean:   locale === 'el' ? 'Όλα καθαρά — δεν υπάρχουν εκκρεμότητες' : 'All clean — nothing pending',
    newTag:     locale === 'el' ? 'Νέο' : 'New',
    viewAll:    locale === 'el' ? 'Δες όλα' : 'View all',
    tabPending: locale === 'el' ? 'Εκκρεμή' : 'Pending',
    tabHistory: locale === 'el' ? 'Ιστορικό' : 'History',
    clearOne:   locale === 'el' ? 'Το είδα' : 'Mark seen',
    clearAll:   locale === 'el' ? 'Εκκαθάριση όλων' : 'Clear all',
    restore:    locale === 'el' ? 'Επαναφορά' : 'Restore',
    noPending:  locale === 'el' ? 'Δεν υπάρχουν εκκρεμή αιτήματα' : 'No pending inquiries',
    noHistory:  locale === 'el' ? 'Δεν υπάρχει ιστορικό ακόμα' : 'No history yet',
    seenTag:    locale === 'el' ? 'Είδατε' : 'Seen',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600 mb-1">
          {L.kicker}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">{L.hello}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {new Date().toLocaleDateString(locale === 'el' ? 'el-GR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      {/* Action Required (only if any) */}
      {hasActions ? (
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-white border border-amber-100 rounded-2xl p-5">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl" aria-hidden />
          <div className="relative flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">{L.actionTitle}</h2>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pending.length > 0 && (
              <button onClick={() => { setInquiriesOpen(true); setInquiryTab('pending'); document.getElementById('inquiries')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="group text-left flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600">
                  <Calendar className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500">{L.inquiryBadge}</div>
                  <div className="text-lg font-semibold text-slate-900 tabular-nums">{pending.length}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>
            )}
            {stats.draft > 0 && (
              <Link href="/dashboard/listings"
                className="group flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500">{L.draftBadge}</div>
                  <div className="text-lg font-semibold text-slate-900 tabular-nums">{stats.draft}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            )}
          </div>
        </section>
      ) : (
        <section className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 rounded-2xl">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-700">
            <CheckCircle className="w-4 h-4" />
          </span>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">{L.allClean}</div>
            <div className="text-xs text-slate-500">{L.subtitle}</div>
          </div>
        </section>
      )}

      {/* Stat cards */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Home} iconColor="text-emerald-600 bg-emerald-50"
            label={L.listings} value={stats.published.toString()}
            suffix={` / ${stats.total}`} progress={listingsPct} progressColor="bg-emerald-500"
          />
          <StatCard
            icon={Building} iconColor="text-blue-600 bg-blue-50"
            label={L.sales} value={salesStats.published.toString()}
            suffix={` / ${salesStats.total}`} progress={salesPct} progressColor="bg-blue-500"
          />
          <StatCard
            icon={MessageCircle} iconColor="text-amber-600 bg-amber-50"
            label={L.inquiries} value={pending.length.toString()}
            caption={locale === 'el' ? 'νέα αιτήματα' : 'new inquiries'}
          />
          <StatCard
            icon={FileText} iconColor="text-violet-600 bg-violet-50"
            label={L.submissions} value={submissionCount.toString()}
            caption={locale === 'el' ? 'συνολικά' : 'total'}
          />
        </div>
      </section>

      {/* Click stats — minimalist pills */}
      {totalClicks > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">{L.clicks30}</h3>
            </div>
            <span className="text-xs text-slate-500">
              <span className="text-base font-semibold text-slate-900 tabular-nums">{totalClicks}</span> {locale === 'el' ? 'σύνολο' : 'total'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { key: 'booking.com', label: 'Booking',                     icon: ExternalLink, tint: 'from-blue-500/10 to-blue-600/5 text-blue-700 border-blue-200' },
              { key: 'airbnb',      label: 'Airbnb',                      icon: ExternalLink, tint: 'from-rose-500/10 to-rose-600/5 text-rose-700 border-rose-200' },
              { key: 'website',     label: 'Website',                     icon: ExternalLink, tint: 'from-slate-500/10 to-slate-600/5 text-slate-700 border-slate-200' },
              { key: 'phone',       label: locale === 'el' ? 'Τηλ.' : 'Phone', icon: Phone,  tint: 'from-emerald-500/10 to-emerald-600/5 text-emerald-700 border-emerald-200' },
              { key: 'email',       label: 'Email',                       icon: Mail,         tint: 'from-violet-500/10 to-violet-600/5 text-violet-700 border-violet-200' },
            ].filter(s => clickStats[s.key]).map(s => {
              const Icon = s.icon;
              return (
                <div key={s.key} className={`bg-gradient-to-br ${s.tint} border rounded-xl p-3`}>
                  <Icon className="w-3.5 h-3.5 opacity-60 mb-1.5" />
                  <div className="text-xl font-semibold tabular-nums">{clickStats[s.key]}</div>
                  <div className="text-[10px] font-medium opacity-80">{s.label}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Inquiries — pending / history tabs */}
      {inquiries.length > 0 && (
        <section id="inquiries" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <button onClick={() => setInquiriesOpen(!inquiriesOpen)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">{L.inquiryList}</h3>
              {pending.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold tabular-nums bg-amber-100 text-amber-700">
                  {pending.length}
                </span>
              )}
            </div>
            {inquiriesOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {inquiriesOpen && (
            <div className="border-t border-slate-100">
              {/* Tabs */}
              <div className="flex items-center gap-1 px-4 pt-3">
                {([['pending', L.tabPending, pending.length], ['history', L.tabHistory, history.length]] as const).map(([key, label, n]) => (
                  <button key={key} onClick={() => setInquiryTab(key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      inquiryTab === key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                    }`}>
                    {key === 'pending' ? <Inbox className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                    {label}
                    <span className={`tabular-nums ${inquiryTab === key ? 'text-white/70' : 'text-slate-400'}`}>{n}</span>
                  </button>
                ))}
                {inquiryTab === 'pending' && pending.length > 0 && (
                  <button onClick={() => setRead(pending.map(p => p.id), true)}
                    className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors">
                    <CheckCheck className="w-3.5 h-3.5" /> {L.clearAll}
                  </button>
                )}
              </div>

              {/* List */}
              <div className="divide-y divide-slate-50 mt-2">
                {(inquiryTab === 'pending' ? pending : history).map((inq) => {
                  const seen = !!inq.read_at;
                  const busy = busyIds.has(inq.id);
                  return (
                    <div key={inq.id} className={`px-5 py-4 transition-colors ${seen ? 'bg-slate-50/40' : 'hover:bg-slate-50/50'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg font-semibold text-xs shrink-0 ${seen ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-700'}`}>
                          {(inq.name?.[0] || '?').toUpperCase()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-900">{inq.name}</span>
                            {seen ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-slate-200/70 text-slate-500">
                                <Check className="w-2.5 h-2.5" /> {L.seenTag}
                              </span>
                            ) : (
                              <span className="inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-700">
                                {L.newTag}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 tabular-nums ml-auto">
                              {new Date(inq.created_at).toLocaleDateString(locale === 'el' ? 'el' : 'en', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {inq.subject.replace('Αίτημα διαθεσιμότητας: ', '')}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs">
                            <a href={`mailto:${inq.email}`} className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {inq.email}
                            </a>
                          </div>
                          {inq.message && (
                            <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic">"{inq.message}"</p>
                          )}
                          <div className="mt-2.5">
                            {seen ? (
                              <button onClick={() => setRead([inq.id], false)} disabled={busy}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500 border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors">
                                <RotateCcw className="w-3 h-3" /> {L.restore}
                              </button>
                            ) : (
                              <button onClick={() => setRead([inq.id], true)} disabled={busy}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-50 disabled:opacity-50 transition-colors">
                                <Check className="w-3 h-3" /> {L.clearOne}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {inquiryTab === 'pending' && pending.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">{L.noPending}</p>
                  </div>
                )}
                {inquiryTab === 'history' && history.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <Archive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">{L.noHistory}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Primary CTAs */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900">{L.quickCreate}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* New listing — premium dark card */}
          <Link href="/dashboard/listings/new"
            className="group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl text-white bg-gradient-to-br from-slate-900 to-slate-800 hover:shadow-lg hover:scale-[1.01] transition-all shadow-sm">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" aria-hidden />
            <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm shrink-0">
              <Home className="w-5 h-5" />
            </span>
            <div className="relative flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-tight">{L.newListing}</p>
              <p className="text-xs text-white/60 mt-0.5">{L.newListingDesc}</p>
            </div>
            <ArrowUpRight className="relative w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </Link>

          {/* New sale — minimalist emerald card */}
          <Link href="/dashboard/sales/new"
            className="group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl text-slate-900 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-emerald-100 text-emerald-600 shrink-0">
              <Building className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-tight">{L.newSale}</p>
              <p className="text-xs text-slate-500 mt-0.5">{L.newSaleDesc}</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </Link>
        </div>
      </section>

      {/* Community contributions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{L.suggest}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{L.suggestDesc}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <SuggestChip href="/dashboard/suggest-restaurant" icon={UtensilsCrossed} label={L.restaurant} />
          <SuggestChip href="/dashboard/suggest-activity"   icon={Landmark}        label={L.activity} />
          <SuggestChip href="/dashboard/suggest-blog"       icon={FileText}        label={L.article} />
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, label, value, suffix, caption, progress, progressColor }: {
  icon: typeof Home; iconColor: string;
  label: string; value: string;
  suffix?: string; caption?: string;
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
      {progress !== undefined && (
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${progressColor} rounded-full transition-all`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function SuggestChip({ href, icon: Icon, label }: { href: string; icon: typeof Home; label: string }) {
  return (
    <Link href={href}
      className="group flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-sm transition-all text-center">
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700">{label}</span>
    </Link>
  );
}
