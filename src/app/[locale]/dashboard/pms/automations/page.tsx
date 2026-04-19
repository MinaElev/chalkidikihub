'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Sparkles, Plus, Loader2, AlertCircle, Search, ArrowLeft, Zap,
  Bot, Globe, CheckCircle2, Pause, Home,
} from 'lucide-react';
import { TRIGGER_META, type TemplateTrigger, type LocalesMap } from '@/components/pms/TemplateForm';

interface TemplateRow {
  id: string;
  name: string;
  trigger: TemplateTrigger;
  subject_locales: LocalesMap;
  body_locales: LocalesMap;
  active: boolean;
  listing_ids: string[] | null;
  updated_at: string;
}

interface ListingLite {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

export default function PmsAutomationsPage() {
  const locale = useLocale();
  const el = locale === 'el';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<TemplateRow[]>([]);
  const [listings, setListings] = useState<ListingLite[]>([]);

  const [q, setQ] = useState('');
  const [triggerFilter, setTriggerFilter] = useState<TemplateTrigger | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'paused'>('all');

  const t = {
    back: el ? 'Πίσω στο PMS' : 'Back to PMS',
    title: el ? 'Αυτοματισμοί Μηνυμάτων' : 'Message Automations',
    sub: el
      ? 'Templates ανά trigger (welcome, reminder, review request) σε 6 γλώσσες. Ενεργοποιείς ή κάνεις παύση με ένα click.'
      : 'Templates by trigger (welcome, reminder, review request) in 6 languages. Toggle on/off with one click.',
    newTemplate: el ? 'Νέο template' : 'New template',
    search: el ? 'Αναζήτηση (όνομα, content)…' : 'Search (name, content)…',
    allTriggers: el ? 'Όλα τα triggers' : 'All triggers',
    allStatuses: el ? 'Ενεργά & Paused' : 'Active & Paused',
    onlyActive: el ? 'Ενεργά' : 'Active only',
    onlyPaused: el ? 'Paused' : 'Paused only',
    templatesLabel: el ? 'Templates' : 'Templates',
    activeLabel: el ? 'Ενεργά' : 'Active',
    languagesLabel: el ? 'Γλώσσες' : 'Languages',
    emptyTitle: el ? 'Χωρίς templates ακόμη' : 'No templates yet',
    emptyBody: el ? 'Δημιούργησε το πρώτο σου template για να αυτοματοποιήσεις επικοινωνία με guests.' : 'Create your first template to automate guest communication.',
    noMatch: el ? 'Δεν υπάρχουν templates που να ταιριάζουν.' : 'No templates match.',
    errLoad: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    allListings: el ? 'Όλα τα καταλύματα' : 'All listings',
    listings: el ? 'καταλύματα' : 'listings',
    active: el ? 'Ενεργό' : 'Active',
    paused: el ? 'Σε παύση' : 'Paused',
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
          supabase.from('pms_message_templates')
            .select('id, name, trigger, subject_locales, body_locales, active, listing_ids, updated_at')
            .eq('owner_id', user.id)
            .order('updated_at', { ascending: false }),
        ]);

        if (lRes.error) { setError(lRes.error.message); return; }
        if (tRes.error) { setError(tRes.error.message); return; }
        setListings(lRes.data || []);
        setRows((tRes.data || []) as TemplateRow[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(r => {
      if (triggerFilter !== 'all' && r.trigger !== triggerFilter) return false;
      if (activeFilter === 'active' && !r.active) return false;
      if (activeFilter === 'paused' && r.active) return false;
      if (needle) {
        const hay = [
          r.name,
          ...Object.values(r.subject_locales || {}),
          ...Object.values(r.body_locales || {}),
        ].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, q, triggerFilter, activeFilter]);

  const stats = useMemo(() => {
    const activeCount = rows.filter(r => r.active).length;
    const allLocales = new Set<string>();
    for (const r of rows) {
      for (const k of Object.keys(r.body_locales || {})) {
        if (r.body_locales[k]?.trim()) allLocales.add(k);
      }
    }
    return { total: rows.length, active: activeCount, languages: allLocales.size };
  }, [rows]);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-fuchsia-500 via-fuchsia-600 to-pink-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-pink-300/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                <Zap className="w-3 h-3" fill="currentColor" /> PMS
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
              <p className="text-white/85 text-sm leading-relaxed max-w-xl">{t.sub}</p>
            </div>
          </div>
          <Link href="/dashboard/pms/automations/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-fuchsia-700 hover:bg-fuchsia-50 font-semibold rounded-xl shadow-sm shrink-0">
            <Plus className="w-4 h-4" /> {t.newTemplate}
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Bot} color="fuchsia" label={t.templatesLabel} value={String(stats.total)} />
        <StatCard icon={CheckCircle2} color="emerald" label={t.activeLabel} value={String(stats.active)} />
        <StatCard icon={Globe} color="sky" label={t.languagesLabel} value={String(stats.languages)} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 space-y-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search" value={q} onChange={e => setQ(e.target.value)}
            placeholder={t.search}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200 outline-none text-sm transition"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select value={triggerFilter} onChange={e => setTriggerFilter(e.target.value as TemplateTrigger | 'all')}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
            <option value="all">{t.allTriggers}</option>
            {(Object.keys(TRIGGER_META) as TemplateTrigger[]).map(k => (
              <option key={k} value={k}>{el ? TRIGGER_META[k].el : TRIGGER_META[k].en}</option>
            ))}
          </select>
          <select value={activeFilter} onChange={e => setActiveFilter(e.target.value as 'all' | 'active' | 'paused')}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
            <option value="all">{t.allStatuses}</option>
            <option value="active">{t.onlyActive}</option>
            <option value="paused">{t.onlyPaused}</option>
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
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
          <Sparkles className="w-12 h-12 text-fuchsia-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">{t.emptyTitle}</h3>
          <p className="text-sm text-slate-500 mb-4">{t.emptyBody}</p>
          <Link href="/dashboard/pms/automations/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold rounded-xl shadow-sm">
            <Plus className="w-4 h-4" /> {t.newTemplate}
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-sm text-slate-500">
          {t.noMatch}
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map(r => {
            const meta = TRIGGER_META[r.trigger];
            const TriggerIcon = meta.icon;
            const localesFilled = Object.entries(r.body_locales || {})
              .filter(([, v]) => v && v.trim())
              .map(([k]) => k);
            const scopeLabel = r.listing_ids === null
              ? t.allListings
              : r.listing_ids.length === 1
                ? listingName(listings, r.listing_ids[0], el)
                : `${r.listing_ids.length} ${t.listings}`;
            const firstBody = localesFilled[0] ? (r.body_locales[localesFilled[0]] || '').slice(0, 120) : '';

            return (
              <li key={r.id}>
                <Link href={`/dashboard/pms/automations/${r.id}`}
                  className={`group block bg-white border ${r.active ? 'border-slate-200' : 'border-slate-200 opacity-75'} hover:border-fuchsia-400 hover:shadow-md rounded-2xl p-3 md:p-4 transition`}>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-700 ring-4 ring-fuchsia-200 flex items-center justify-center">
                      <TriggerIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-slate-900 truncate">{r.name}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          <TriggerIcon className="w-3 h-3" /> {el ? meta.el : meta.en}
                        </span>
                        {r.active ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" /> {t.active}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            <Pause className="w-3 h-3" /> {t.paused}
                          </span>
                        )}
                      </div>
                      {firstBody && (
                        <div className="text-xs text-slate-600 truncate mb-1">{firstBody}{firstBody.length >= 120 ? '…' : ''}</div>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {localesFilled.length > 0 ? localesFilled.map(l => l.toUpperCase()).join(' · ') : '—'}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          {scopeLabel}
                        </span>
                      </div>
                    </div>
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

function listingName(listings: ListingLite[], id: string, el: boolean): string {
  const l = listings.find(x => x.id === id);
  if (!l) return id.slice(0, 8);
  return (el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug;
}

function StatCard({ icon: Icon, color, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  color: 'fuchsia' | 'emerald' | 'sky';
  label: string; value: string;
}) {
  const cls =
    color === 'fuchsia' ? 'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200'
    : color === 'emerald' ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
    : 'bg-sky-100 text-sky-700 ring-sky-200';
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
