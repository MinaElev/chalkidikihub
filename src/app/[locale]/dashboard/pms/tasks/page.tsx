'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Wrench, Plus, Loader2, AlertCircle, Search, ArrowLeft, Zap,
  Clock, Play, CheckCheck, Ban, SkipForward,
  Sparkles, Hammer, Eye, Shirt, LogIn, LogOut, Settings2,
  CalendarDays, Euro, AlertTriangle,
} from 'lucide-react';
import type { TaskType, TaskStatus } from '@/components/pms/TaskForm';

interface TaskRow {
  id: string;
  listing_id: string;
  booking_id: string | null;
  task_type: TaskType;
  title: string;
  assignee_name: string | null;
  scheduled_at: string;
  completed_at: string | null;
  status: TaskStatus;
  cost: number | null;
  listings?: { slug: string; title_el: string | null; title_en: string | null } | null;
}

interface ListingLite {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

const TYPE_META: Record<TaskType, { icon: React.ComponentType<{ className?: string }>; el: string; en: string; chipCls: string }> = {
  cleaning:    { icon: Sparkles,   el: 'Καθαρισμός',    en: 'Cleaning',    chipCls: 'bg-rose-100 text-rose-700' },
  maintenance: { icon: Hammer,     el: 'Συντήρηση',     en: 'Maintenance', chipCls: 'bg-amber-100 text-amber-700' },
  inspection:  { icon: Eye,        el: 'Επιθεώρηση',    en: 'Inspection',  chipCls: 'bg-sky-100 text-sky-700' },
  linen:       { icon: Shirt,      el: 'Κλινοσκεπάσματα',en: 'Linen',      chipCls: 'bg-violet-100 text-violet-700' },
  checkin:     { icon: LogIn,      el: 'Υποδοχή',        en: 'Check-in',   chipCls: 'bg-emerald-100 text-emerald-700' },
  checkout:    { icon: LogOut,     el: 'Αναχώρηση',     en: 'Check-out',   chipCls: 'bg-slate-100 text-slate-700' },
  custom:      { icon: Settings2,  el: 'Άλλο',           en: 'Custom',     chipCls: 'bg-slate-100 text-slate-700' },
};

const STATUS_META: Record<TaskStatus, { icon: React.ComponentType<{ className?: string }>; el: string; en: string; cls: string }> = {
  pending:     { icon: Clock,       el: 'Εκκρεμεί',    en: 'Pending',     cls: 'bg-amber-100 text-amber-800 ring-amber-200' },
  in_progress: { icon: Play,        el: 'Σε εξέλιξη',  en: 'In progress', cls: 'bg-sky-100 text-sky-800 ring-sky-200' },
  completed:   { icon: CheckCheck,  el: 'Ολοκληρωμένη',en: 'Completed',   cls: 'bg-emerald-100 text-emerald-800 ring-emerald-200' },
  cancelled:   { icon: Ban,         el: 'Ακυρώθηκε',   en: 'Cancelled',   cls: 'bg-rose-100 text-rose-800 ring-rose-200' },
  skipped:     { icon: SkipForward, el: 'Παραλείφθηκε',en: 'Skipped',     cls: 'bg-slate-100 text-slate-700 ring-slate-200' },
};

export default function PmsTasksPage() {
  const locale = useLocale();
  const el = locale === 'el';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<TaskRow[]>([]);
  const [listings, setListings] = useState<ListingLite[]>([]);

  const [q, setQ] = useState('');
  const [listingFilter, setListingFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const t = {
    back: el ? 'Πίσω στο PMS' : 'Back to PMS',
    title: el ? 'Καθαριότητα & Εργασίες' : 'Cleaning & Tasks',
    sub: el
      ? 'Προγραμμάτισε καθαρισμούς, συντήρηση, check-in/out. Ανάθεσε σε συνεργάτες, παρακολούθησε κόστος.'
      : 'Schedule cleanings, maintenance, check-in/out. Assign to vendors, track cost.',
    newTask: el ? 'Νέα εργασία' : 'New task',
    search: el ? 'Αναζήτηση (τίτλος, συνεργάτης, listing)…' : 'Search (title, assignee, listing)…',
    allListings: el ? 'Όλα τα καταλύματα' : 'All listings',
    allTypes: el ? 'Όλοι οι τύποι' : 'All types',
    allStatuses: el ? 'Όλες οι καταστάσεις' : 'All statuses',
    noTasks: el ? 'Δεν υπάρχουν εργασίες που να ταιριάζουν.' : 'No tasks match.',
    todayLabel: el ? 'Σήμερα' : 'Today',
    pendingLabel: el ? 'Εκκρεμούν' : 'Pending',
    overdueLabel: el ? 'Καθυστερημένες' : 'Overdue',
    monthSpendLabel: el ? 'Κόστος μήνα' : 'Month spend',
    errLoad: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    overdueChip: el ? 'Καθυστερημένο' : 'Overdue',
    noAssignee: el ? 'Χωρίς ανάθεση' : 'Unassigned',
  };

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setError(authErr?.message || 'Not signed in'); return; }

        const [lRes, tRes] = await Promise.all([
          supabase.from('listings')
            .select('id, slug, title_el, title_en')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('pms_tasks')
            .select('id, listing_id, booking_id, task_type, title, assignee_name, scheduled_at, completed_at, status, cost, listings!inner(slug, title_el, title_en)')
            .eq('owner_id', user.id)
            .order('scheduled_at', { ascending: false })
            .limit(500),
        ]);

        if (lRes.error) { setError(lRes.error.message); return; }
        if (tRes.error) { setError(tRes.error.message); return; }
        setListings(lRes.data || []);
        const tasks = ((tRes.data || []) as unknown) as TaskRow[];
        setRows(tasks);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    const needle = q.trim().toLowerCase();
    return rows.filter(r => {
      if (listingFilter !== 'all' && r.listing_id !== listingFilter) return false;
      if (typeFilter !== 'all' && r.task_type !== typeFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (needle) {
        const hay = [
          r.title,
          r.assignee_name,
          r.listings?.title_el,
          r.listings?.title_en,
          r.listings?.slug,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    }).map(r => ({ ...r, overdue: r.status === 'pending' && new Date(r.scheduled_at) < now }));
  }, [rows, q, listingFilter, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let today = 0, pending = 0, overdue = 0, monthSpend = 0;
    for (const r of rows) {
      const sched = new Date(r.scheduled_at).getTime();
      if (sched >= startOfDay && sched < endOfDay) today++;
      if (r.status === 'pending') pending++;
      if (r.status === 'pending' && sched < now.getTime()) overdue++;
      if (r.status === 'completed' && r.completed_at) {
        const done = new Date(r.completed_at).getTime();
        if (done >= startOfMonth && r.cost) monthSpend += Number(r.cost);
      }
    }
    return { today, pending, overdue, monthSpend };
  }, [rows]);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-pink-300/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                <Zap className="w-3 h-3" fill="currentColor" /> PMS
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
              <p className="text-white/85 text-sm leading-relaxed max-w-xl">{t.sub}</p>
            </div>
          </div>
          <Link href="/dashboard/pms/tasks/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 font-semibold rounded-xl shadow-sm shrink-0">
            <Plus className="w-4 h-4" /> {t.newTask}
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={CalendarDays} color="sky" label={t.todayLabel} value={String(stats.today)} />
        <StatCard icon={Clock} color="amber" label={t.pendingLabel} value={String(stats.pending)} />
        <StatCard icon={AlertTriangle} color="rose" label={t.overdueLabel} value={String(stats.overdue)} />
        <StatCard icon={Euro} color="emerald" label={t.monthSpendLabel} value={`€${stats.monthSpend.toFixed(0)}`} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 space-y-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search" value={q} onChange={e => setQ(e.target.value)}
            placeholder={t.search}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm transition"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <select value={listingFilter} onChange={e => setListingFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
            <option value="all">{t.allListings}</option>
            {listings.map(l => (
              <option key={l.id} value={l.id}>
                {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
              </option>
            ))}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as TaskType | 'all')}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
            <option value="all">{t.allTypes}</option>
            {(Object.keys(TYPE_META) as TaskType[]).map(k => (
              <option key={k} value={k}>{el ? TYPE_META[k].el : TYPE_META[k].en}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
            <option value="all">{t.allStatuses}</option>
            {(Object.keys(STATUS_META) as TaskStatus[]).map(k => (
              <option key={k} value={k}>{el ? STATUS_META[k].el : STATUS_META[k].en}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.errLoad}: <span className="font-mono text-xs">{error}</span></span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-sm text-slate-500">
          {t.noTasks}
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map(r => {
            const type = TYPE_META[r.task_type];
            const status = STATUS_META[r.status];
            const TypeIcon = type.icon;
            const StatusIcon = status.icon;
            const d = new Date(r.scheduled_at);
            const day = d.toLocaleDateString(el ? 'el-GR' : 'en-US', { day: '2-digit' });
            const mon = d.toLocaleDateString(el ? 'el-GR' : 'en-US', { month: 'short' });
            const time = d.toLocaleTimeString(el ? 'el-GR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
            const listingName = (el ? r.listings?.title_el : r.listings?.title_en) || r.listings?.title_el || r.listings?.title_en || r.listings?.slug || '';
            return (
              <li key={r.id}>
                <Link href={`/dashboard/pms/tasks/${r.id}`}
                  className="group block bg-white border border-slate-200 hover:border-rose-300 hover:shadow-md rounded-2xl p-3 md:p-4 transition">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`shrink-0 w-14 text-center rounded-xl py-2 ${r.overdue ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-slate-50'}`}>
                      <div className={`text-[10px] font-semibold uppercase tracking-wide ${r.overdue ? 'text-rose-600' : 'text-slate-500'}`}>{mon}</div>
                      <div className={`text-xl font-bold leading-none ${r.overdue ? 'text-rose-700' : 'text-slate-900'}`}>{day}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{time}</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${type.chipCls}`}>
                          <TypeIcon className="w-3 h-3" /> {el ? type.el : type.en}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ring-1 ${status.cls}`}>
                          <StatusIcon className="w-3 h-3" /> {el ? status.el : status.en}
                        </span>
                        {r.overdue && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                            <AlertTriangle className="w-3 h-3" /> {t.overdueChip}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-rose-700 transition">{r.title}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {listingName}
                        {r.assignee_name ? <> · <span className="text-slate-700">{r.assignee_name}</span></> : <> · <span className="italic">{t.noAssignee}</span></>}
                      </div>
                    </div>

                    {r.cost != null && (
                      <div className="shrink-0 text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">€</div>
                        <div className="text-sm font-bold text-slate-900">{Number(r.cost).toFixed(0)}</div>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  color: 'sky' | 'amber' | 'rose' | 'emerald';
  label: string; value: string;
}) {
  const cls =
    color === 'sky' ? 'bg-sky-100 text-sky-700 ring-sky-200'
    : color === 'amber' ? 'bg-amber-100 text-amber-700 ring-amber-200'
    : color === 'rose' ? 'bg-rose-100 text-rose-700 ring-rose-200'
    : 'bg-emerald-100 text-emerald-700 ring-emerald-200';
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ring-4 ${cls}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="text-lg font-bold text-slate-900 leading-tight">{value}</div>
        </div>
      </div>
    </div>
  );
}
