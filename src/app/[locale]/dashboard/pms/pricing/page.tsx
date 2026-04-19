'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  DollarSign, ArrowLeft, Plus, Loader2, AlertCircle, Filter,
  Sun, Calendar as CalIcon, Moon, Clock, Settings2, Zap,
  Home, Equal, ArrowUp, ArrowDown, X as XIcon, Percent, Euro,
  CheckCircle2, PauseCircle, Edit3, Tag,
} from 'lucide-react';

interface Listing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  price_per_night: number | null;
}

type RuleType = 'seasonal' | 'weekend' | 'los_discount' | 'last_minute' | 'custom';
type RuleOperation = 'override' | 'add' | 'subtract' | 'multiply';

interface PricingRule {
  id: string;
  listing_id: string;
  name: string;
  rule_type: RuleType;
  start_date: string | null;
  end_date: string | null;
  weekdays: number[] | null;
  min_nights: number | null;
  days_before: number | null;
  amount: number;
  is_percentage: boolean;
  operation: RuleOperation;
  priority: number;
  active: boolean;
}

const TYPE_META: Record<RuleType, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  seasonal:     { icon: Sun,        color: 'amber' },
  weekend:      { icon: CalIcon,    color: 'sky' },
  los_discount: { icon: Moon,       color: 'violet' },
  last_minute:  { icon: Clock,      color: 'rose' },
  custom:       { icon: Settings2,  color: 'slate' },
};

export default function PmsPricingPage() {
  const locale = useLocale();
  const el = locale === 'el';

  const t = {
    back: el ? 'Πίσω στο Command Center' : 'Back to Command Center',
    title: el ? 'Κανόνες Τιμολόγησης' : 'Pricing Rules',
    sub: el
      ? 'Seasonal premiums, Σ/Κ rates, long-stay discounts, last-minute offers — όλα configurable χωρίς προμήθεια.'
      : 'Seasonal premiums, weekend rates, long-stay discounts, last-minute offers — all configurable, no commission.',
    newRule: el ? 'Νέος κανόνας' : 'New rule',
    filterListing: el ? 'Όλα τα καταλύματα' : 'All listings',
    filterActive: el ? 'Όλοι' : 'All',
    filterOnlyActive: el ? 'Μόνο ενεργοί' : 'Active only',
    filterOnlyInactive: el ? 'Μόνο σε παύση' : 'Paused only',
    empty: el ? 'Δεν υπάρχουν ακόμα κανόνες' : 'No pricing rules yet',
    emptySub: el
      ? 'Φτιάξε τον πρώτο κανόνα σε 30 δευτερόλεπτα — peak season premium, Σ/Κ rates, ή long-stay discount.'
      : 'Create your first rule in 30 seconds — peak season premium, weekend rates, or long-stay discount.',
    emptyFiltered: el ? 'Κανένας κανόνας με αυτά τα φίλτρα.' : 'No rules match these filters.',

    typeSeasonal: el ? 'Εποχιακός' : 'Seasonal',
    typeWeekend: el ? 'Weekend' : 'Weekend',
    typeLos: el ? 'Long Stay' : 'Long stay',
    typeLastMinute: el ? 'Last-minute' : 'Last-minute',
    typeCustom: 'Custom',

    active: el ? 'Ενεργός' : 'Active',
    paused: el ? 'Παύση' : 'Paused',
    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    priority: el ? 'Προτεραιότητα' : 'Priority',
    totalRules: el ? 'κανόνες' : 'rules',
    totalRuleSingular: el ? 'κανόνας' : 'rule',
    noListings: el ? 'Δεν έχεις ακόμη καταλύματα.' : "You don't have any listings yet.",
    toListings: el ? 'Στα καταλύματά μου' : 'Go to my listings',
  };

  const typeLabel = (rt: RuleType) => ({
    seasonal: t.typeSeasonal, weekend: t.typeWeekend,
    los_discount: t.typeLos, last_minute: t.typeLastMinute, custom: t.typeCustom,
  }[rt]);

  const weekdayLabels = el ? ['Κυ','Δε','Τρ','Τε','Πε','Πα','Σα'] : ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [listingFilter, setListingFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setLoadError(authErr?.message || 'Not signed in'); return; }

        const [lRes, rRes] = await Promise.all([
          supabase.from('listings')
            .select('id, slug, title_el, title_en, price_per_night')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('pms_pricing_rules')
            .select('*')
            .eq('owner_id', user.id)
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false }),
        ]);

        if (lRes.error) { setLoadError(lRes.error.message); return; }
        if (rRes.error) { setLoadError(rRes.error.message); return; }
        setListings(lRes.data || []);
        setRules(rRes.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const listingMap = useMemo(() => {
    const m = new Map<string, Listing>();
    for (const l of listings) m.set(l.id, l);
    return m;
  }, [listings]);

  const filtered = useMemo(() => {
    return rules.filter(r => {
      if (listingFilter !== 'all' && r.listing_id !== listingFilter) return false;
      if (activeFilter === 'active' && !r.active) return false;
      if (activeFilter === 'inactive' && r.active) return false;
      return true;
    });
  }, [rules, listingFilter, activeFilter]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>;
  }

  const hasFilters = listingFilter !== 'all' || activeFilter !== 'all';

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                <Zap className="w-3 h-3" fill="currentColor" /> PMS
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
              <p className="text-white/85 text-sm leading-relaxed max-w-xl">{t.sub}</p>
            </div>
          </div>
          {listings.length > 0 && (
            <Link href="/dashboard/pms/pricing/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-amber-700 hover:bg-amber-50 font-semibold rounded-xl shadow-lg shadow-black/10 transition-colors">
              <Plus className="w-4 h-4" /> {t.newRule}
            </Link>
          )}
        </div>
      </header>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.loadError}: <span className="font-mono text-xs">{loadError}</span></span>
        </div>
      )}

      {listings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
          <p className="text-sm text-slate-600 mb-4">{t.noListings}</p>
          <Link href="/dashboard/listings"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-sm">
            {t.toListings}
          </Link>
        </div>
      ) : (
        <>
          {/* FILTERS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-slate-700">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold">{el ? 'Φίλτρα' : 'Filters'}</span>
              </div>
              <span className="text-xs text-slate-500">
                {filtered.length} {filtered.length === 1 ? t.totalRuleSingular : t.totalRules}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="relative block">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select value={listingFilter}
                  onChange={e => setListingFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white appearance-none cursor-pointer focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200">
                  <option value="all">{t.filterListing}</option>
                  {listings.map(l => (
                    <option key={l.id} value={l.id}>
                      {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-1.5">
                {([
                  { key: 'all' as const, label: t.filterActive },
                  { key: 'active' as const, label: t.filterOnlyActive },
                  { key: 'inactive' as const, label: t.filterOnlyInactive },
                ]).map(opt => (
                  <button key={opt.key}
                    onClick={() => setActiveFilter(opt.key)}
                    className={`flex-1 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                      activeFilter === opt.key
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LIST */}
          {filtered.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mb-3">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {hasFilters ? t.emptyFiltered : t.empty}
              </h3>
              {!hasFilters && <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">{t.emptySub}</p>}
              <Link href="/dashboard/pms/pricing/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-sm">
                <Plus className="w-4 h-4" /> {t.newRule}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(r => {
                const listing = listingMap.get(r.listing_id);
                const listingTitle = listing ? ((el ? listing.title_el : listing.title_en) || listing.title_el || listing.title_en || listing.slug) : '—';
                const typeMeta = TYPE_META[r.rule_type];
                const TypeIcon = typeMeta.icon;

                const opSymbol =
                  r.operation === 'override' ? '=' :
                  r.operation === 'add' ? '+' :
                  r.operation === 'subtract' ? '-' : '×';
                const unit = r.is_percentage ? '%' : '€';

                const condition = describeCondition(r, el, weekdayLabels);

                return (
                  <Link key={r.id} href={`/dashboard/pms/pricing/${r.id}`}
                    className={`block bg-white border rounded-2xl p-4 hover:shadow-md transition-all ${
                      r.active ? 'border-slate-200 hover:border-amber-300' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}>
                    <div className="flex items-start gap-3 flex-wrap">
                      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${
                        typeMeta.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                        typeMeta.color === 'sky' ? 'bg-sky-100 text-sky-700' :
                        typeMeta.color === 'violet' ? 'bg-violet-100 text-violet-700' :
                        typeMeta.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            <TypeIcon className="w-3 h-3" /> {typeLabel(r.rule_type)}
                          </span>
                          {r.active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> {t.active}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                              <PauseCircle className="w-3 h-3" /> {t.paused}
                            </span>
                          )}
                          {r.priority !== 100 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                              <Tag className="w-3 h-3" /> {t.priority}: {r.priority}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-slate-900 truncate">{r.name}</div>
                        <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-3 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Home className="w-3 h-3" /> {listingTitle}
                          </span>
                          {condition && <span>• {condition}</span>}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`text-lg font-extrabold leading-none ${
                          r.operation === 'add' ? 'text-emerald-700' :
                          r.operation === 'subtract' ? 'text-rose-700' :
                          r.operation === 'multiply' ? 'text-amber-700' : 'text-sky-700'
                        }`}>
                          {opSymbol}{Number(r.amount).toFixed(r.is_percentage ? 0 : 2)}{unit}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">
                          {r.operation === 'override' ? (el ? 'Νέα τιμή' : 'Set') :
                           r.operation === 'add' ? (el ? 'Προσθέτει' : 'Adds') :
                           r.operation === 'subtract' ? (el ? 'Αφαιρεί' : 'Removes') : (el ? 'Πολλ/ζει' : 'Multiplies')}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function describeCondition(r: PricingRule, el: boolean, weekdayLabels: string[]): string {
  const parts: string[] = [];
  if (r.start_date || r.end_date) {
    const s = r.start_date ? new Date(r.start_date).toLocaleDateString(el ? 'el-GR' : 'en-US', { day: 'numeric', month: 'short' }) : '…';
    const e = r.end_date ? new Date(r.end_date).toLocaleDateString(el ? 'el-GR' : 'en-US', { day: 'numeric', month: 'short' }) : '…';
    parts.push(`${s} → ${e}`);
  }
  if (r.weekdays && r.weekdays.length > 0) {
    parts.push(r.weekdays.map(d => weekdayLabels[d]).join(', '));
  }
  if (r.min_nights) {
    parts.push(el ? `≥${r.min_nights} νύχτες` : `≥${r.min_nights} nights`);
  }
  if (r.days_before != null) {
    parts.push(el ? `≤${r.days_before} μέρες πριν` : `≤${r.days_before} days before`);
  }
  return parts.join(' · ');
}
