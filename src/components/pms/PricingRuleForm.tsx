'use client';

import { useMemo, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Save, Trash2, Loader2, AlertCircle, CheckCircle2,
  Tag, Sun, Calendar, Moon, Clock, Settings2, Sparkles,
  Percent, Euro, ArrowUp, ArrowDown, Equal, X as XIcon,
} from 'lucide-react';

export type RuleType = 'seasonal' | 'weekend' | 'los_discount' | 'last_minute' | 'custom';
export type RuleOperation = 'override' | 'add' | 'subtract' | 'multiply';

export interface PricingRuleData {
  id?: string;
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

export interface Listing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  price_per_night: number | null;
}

export const EMPTY_RULE: PricingRuleData = {
  listing_id: '',
  name: '',
  rule_type: 'seasonal',
  start_date: null,
  end_date: null,
  weekdays: null,
  min_nights: null,
  days_before: null,
  amount: 0,
  is_percentage: true,
  operation: 'add',
  priority: 100,
  active: true,
};

export function PricingRuleForm({
  mode,
  initial,
  listings,
  el,
  onDelete,
}: {
  mode: 'create' | 'edit';
  initial: PricingRuleData;
  listings: Listing[];
  el: boolean;
  onDelete?: () => Promise<void>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<PricingRuleData>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const t = {
    basicsTitle: el ? 'Βασικά στοιχεία' : 'Basics',
    name: el ? 'Όνομα κανόνα' : 'Rule name',
    namePlaceholder: el ? 'π.χ. Peak Ιουλ-Αυγ, Weekend premium' : 'e.g. Peak Jul-Aug, Weekend premium',
    listing: el ? 'Κατάλυμα' : 'Listing',
    chooseListing: el ? '— Διάλεξε κατάλυμα —' : '— Pick a listing —',
    priority: el ? 'Προτεραιότητα' : 'Priority',
    priorityHint: el ? 'Υψηλότερο νούμερο = υπερισχύει. Default 100.' : 'Higher number wins. Default 100.',

    typeTitle: el ? 'Τύπος κανόνα' : 'Rule type',
    seasonal: el ? 'Εποχιακός' : 'Seasonal',
    seasonalDesc: el ? 'Ισχύει σε συγκεκριμένο εύρος ημερομηνιών' : 'Applies to a specific date range',
    weekend: el ? 'Weekend' : 'Weekend',
    weekendDesc: el ? 'Ισχύει σε συγκεκριμένες μέρες εβδομάδας' : 'Applies on specific weekdays',
    los: el ? 'Long Stay' : 'Long stay',
    losDesc: el ? 'Ενεργοποιείται αν διαμονή ≥ N νύχτες' : 'Triggers when stay ≥ N nights',
    lastMinute: el ? 'Last-minute' : 'Last-minute',
    lastMinuteDesc: el ? 'Ενεργοποιείται αν απομένουν ≤ N μέρες' : 'Triggers when ≤ N days to check-in',
    custom: 'Custom',
    customDesc: el ? 'Χειροκίνητα — όλα προαιρετικά' : 'Manual — all fields optional',

    conditionTitle: el ? 'Συνθήκη' : 'Condition',
    startDate: el ? 'Από ημερομηνία' : 'Start date',
    endDate: el ? 'Έως ημερομηνία' : 'End date',
    weekdays: el ? 'Μέρες εβδομάδας' : 'Weekdays',
    weekdaysHint: el ? 'Πάτα για να επιλέξεις/αποεπιλέξεις' : 'Tap to toggle',
    minNights: el ? 'Ελάχιστες νύχτες' : 'Minimum nights',
    daysBefore: el ? 'Μέρες πριν το check-in' : 'Days before check-in',

    adjustTitle: el ? 'Προσαρμογή τιμής' : 'Price adjustment',
    operation: el ? 'Τι κάνει αυτός ο κανόνας' : 'How this rule changes price',
    opOverride: el ? 'Νέα τιμή' : 'Set price',
    opOverrideDesc: el ? 'Αντικαθιστά τη βασική τιμή' : 'Replaces base price',
    opAdd: el ? 'Προσθέτει' : 'Add',
    opAddDesc: el ? 'Ανεβάζει την τιμή (premium)' : 'Raises price (premium)',
    opSubtract: el ? 'Αφαιρεί' : 'Subtract',
    opSubtractDesc: el ? 'Κατεβάζει την τιμή (discount)' : 'Lowers price (discount)',
    opMultiply: el ? 'Πολλαπλασιάζει' : 'Multiply',
    opMultiplyDesc: el ? 'Εφαρμόζει πολλαπλασιαστή (x1.4 κτλ)' : 'Applies multiplier (x1.4 etc)',

    unit: el ? 'Μονάδα' : 'Unit',
    percent: el ? 'Ποσοστό (%)' : 'Percentage (%)',
    absolute: el ? 'Απόλυτο €' : 'Absolute €',
    amount: el ? 'Ποσό' : 'Amount',

    activeLabel: el ? 'Ενεργός κανόνας' : 'Rule active',
    activeHint: el ? 'Αν OFF, ο κανόνας δεν εφαρμόζεται μέχρι να τον ενεργοποιήσεις.' : 'If OFF, rule is paused until re-enabled.',

    previewTitle: el ? 'Προεπισκόπηση' : 'Preview',
    previewBase: el ? 'Βασική τιμή' : 'Base price',
    previewResult: el ? 'Τελική τιμή' : 'Final price',
    previewNoBase: el ? 'Όρισε base price στο listing για preview' : 'Set a base price on the listing to see a preview',

    save: mode === 'create' ? (el ? 'Δημιουργία' : 'Create') : (el ? 'Αποθήκευση' : 'Save'),
    saving: el ? 'Αποθηκεύεται…' : 'Saving…',
    saved: el ? 'Αποθηκεύτηκε' : 'Saved',
    deleteAction: el ? 'Διαγραφή' : 'Delete',
    deleting: el ? 'Διαγράφεται…' : 'Deleting…',
    deleteConfirm: el ? 'Σίγουρα; Ο κανόνας θα διαγραφεί οριστικά.' : 'Are you sure? The rule will be permanently deleted.',
    errorListing: el ? 'Διάλεξε κατάλυμα' : 'Pick a listing',
    errorName: el ? 'Δώσε όνομα στον κανόνα' : 'Give the rule a name',
  };

  const weekdayLabels = el
    ? ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const ruleTypes: Array<{
    value: RuleType; label: string; desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { value: 'seasonal',    label: t.seasonal,    desc: t.seasonalDesc,    icon: Sun },
    { value: 'weekend',     label: t.weekend,     desc: t.weekendDesc,     icon: Calendar },
    { value: 'los_discount',label: t.los,         desc: t.losDesc,         icon: Moon },
    { value: 'last_minute', label: t.lastMinute,  desc: t.lastMinuteDesc,  icon: Clock },
    { value: 'custom',      label: t.custom,      desc: t.customDesc,      icon: Settings2 },
  ];

  const operations: Array<{
    value: RuleOperation; label: string; desc: string;
    icon: React.ComponentType<{ className?: string }>; color: string;
  }> = [
    { value: 'override',  label: t.opOverride,  desc: t.opOverrideDesc,  icon: Equal,    color: 'sky' },
    { value: 'add',       label: t.opAdd,       desc: t.opAddDesc,       icon: ArrowUp,  color: 'emerald' },
    { value: 'subtract',  label: t.opSubtract,  desc: t.opSubtractDesc,  icon: ArrowDown,color: 'rose' },
    { value: 'multiply',  label: t.opMultiply,  desc: t.opMultiplyDesc,  icon: XIcon,    color: 'amber' },
  ];

  const selectedListing = listings.find(l => l.id === form.listing_id);
  const basePrice = Number(selectedListing?.price_per_night || 0);

  const previewPrice = useMemo(() => {
    if (!basePrice) return null;
    const amt = Number(form.amount || 0);
    const unitVal = form.is_percentage ? (basePrice * amt) / 100 : amt;
    switch (form.operation) {
      case 'override': return form.is_percentage ? basePrice * (amt / 100) : amt;
      case 'add':      return basePrice + unitVal;
      case 'subtract': return Math.max(0, basePrice - unitVal);
      case 'multiply': return basePrice * (form.is_percentage ? amt / 100 : amt);
      default: return basePrice;
    }
  }, [basePrice, form.amount, form.is_percentage, form.operation]);

  function update<K extends keyof PricingRuleData>(key: K, value: PricingRuleData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setJustSaved(false);
    setError(null);
  }

  function toggleWeekday(day: number) {
    const cur = form.weekdays || [];
    const next = cur.includes(day) ? cur.filter(d => d !== day) : [...cur, day].sort();
    update('weekdays', next.length ? next : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setJustSaved(false);

    if (!form.listing_id) { setError(t.errorListing); return; }
    if (!form.name.trim()) { setError(t.errorName); return; }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Not signed in'); return; }

      const payload: any = {
        owner_id: user.id,
        listing_id: form.listing_id,
        name: form.name.trim(),
        rule_type: form.rule_type,
        start_date: form.rule_type === 'seasonal' || form.rule_type === 'custom' ? form.start_date : null,
        end_date:   form.rule_type === 'seasonal' || form.rule_type === 'custom' ? form.end_date   : null,
        weekdays:   form.rule_type === 'weekend'  || form.rule_type === 'custom' ? form.weekdays   : null,
        min_nights: form.rule_type === 'los_discount' || form.rule_type === 'custom' ? form.min_nights : null,
        days_before:form.rule_type === 'last_minute'  || form.rule_type === 'custom' ? form.days_before : null,
        amount: Number(form.amount),
        is_percentage: !!form.is_percentage,
        operation: form.operation,
        priority: Number(form.priority) || 100,
        active: !!form.active,
        updated_at: new Date().toISOString(),
      };

      if (mode === 'create') {
        const { data, error } = await supabase
          .from('pms_pricing_rules')
          .insert(payload)
          .select('id')
          .single();
        if (error) { setError(error.message); return; }
        router.push(`/dashboard/pms/pricing/${data.id}`);
      } else {
        const { error } = await supabase
          .from('pms_pricing_rules')
          .update(payload)
          .eq('id', form.id!);
        if (error) { setError(error.message); return; }
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 4000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    if (!confirm(t.deleteConfirm)) return;
    setDeleting(true);
    try { await onDelete(); } finally { setDeleting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-28 md:pb-6">
      {/* BASICS */}
      <Section icon={Tag} color="violet" title={t.basicsTitle}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Field label={t.name}>
              <input type="text" required value={form.name}
                onChange={e => update('name', e.target.value)}
                className="rule-input" placeholder={t.namePlaceholder} />
            </Field>
          </div>
          <Field label={t.priority} hint={t.priorityHint}>
            <input type="number" min="0" max="1000" value={form.priority}
              onChange={e => update('priority', Number(e.target.value) || 100)}
              className="rule-input" />
          </Field>
        </div>
        <Field label={t.listing}>
          <select required value={form.listing_id}
            onChange={e => update('listing_id', e.target.value)}
            className="rule-input">
            <option value="">{t.chooseListing}</option>
            {listings.map(l => (
              <option key={l.id} value={l.id}>
                {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
                {l.price_per_night ? ` — €${Number(l.price_per_night).toFixed(0)}/${el ? 'νύχτα' : 'night'}` : ''}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      {/* TYPE */}
      <Section icon={Sparkles} color="sky" title={t.typeTitle}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ruleTypes.map(rt => {
            const Icon = rt.icon;
            const selected = form.rule_type === rt.value;
            return (
              <label key={rt.value}
                className={`cursor-pointer rounded-xl border-2 p-3 transition ${
                  selected ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                <input type="radio" name="rule_type"
                  checked={selected}
                  onChange={() => update('rule_type', rt.value)}
                  className="sr-only" />
                <div className="flex items-start gap-2">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                    selected ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{rt.label}</div>
                    <div className="text-xs text-slate-600 mt-0.5 leading-snug">{rt.desc}</div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </Section>

      {/* CONDITION (dynamic) */}
      <Section icon={Calendar} color="amber" title={t.conditionTitle}>
        {(form.rule_type === 'seasonal' || form.rule_type === 'custom') && (
          <div className="grid grid-cols-2 gap-3">
            <Field label={t.startDate}>
              <input type="date" value={form.start_date || ''}
                onChange={e => update('start_date', e.target.value || null)}
                className="rule-input" />
            </Field>
            <Field label={t.endDate}>
              <input type="date" value={form.end_date || ''}
                onChange={e => update('end_date', e.target.value || null)}
                className="rule-input" min={form.start_date || undefined} />
            </Field>
          </div>
        )}

        {(form.rule_type === 'weekend' || form.rule_type === 'custom') && (
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.weekdays}</div>
            <div className="flex flex-wrap gap-1.5">
              {weekdayLabels.map((label, i) => {
                const selected = (form.weekdays || []).includes(i);
                return (
                  <button type="button" key={i}
                    onClick={() => toggleWeekday(i)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                      selected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-slate-500 mt-1">{t.weekdaysHint}</div>
          </div>
        )}

        {(form.rule_type === 'los_discount' || form.rule_type === 'custom') && (
          <Field label={t.minNights}>
            <input type="number" min="1" max="365" value={form.min_nights ?? ''}
              onChange={e => update('min_nights', e.target.value ? Number(e.target.value) : null)}
              className="rule-input" placeholder="7" />
          </Field>
        )}

        {(form.rule_type === 'last_minute' || form.rule_type === 'custom') && (
          <Field label={t.daysBefore}>
            <input type="number" min="0" max="365" value={form.days_before ?? ''}
              onChange={e => update('days_before', e.target.value ? Number(e.target.value) : null)}
              className="rule-input" placeholder="7" />
          </Field>
        )}
      </Section>

      {/* ADJUSTMENT */}
      <Section icon={Percent} color="emerald" title={t.adjustTitle}>
        <div>
          <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.operation}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {operations.map(op => {
              const Icon = op.icon;
              const selected = form.operation === op.value;
              const colorClass =
                op.color === 'sky' ? (selected ? 'border-sky-500 bg-sky-50' : '')
                : op.color === 'emerald' ? (selected ? 'border-emerald-500 bg-emerald-50' : '')
                : op.color === 'rose' ? (selected ? 'border-rose-500 bg-rose-50' : '')
                : (selected ? 'border-amber-500 bg-amber-50' : '');
              return (
                <label key={op.value}
                  className={`cursor-pointer rounded-xl border-2 p-2 transition ${
                    selected ? colorClass : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                  <input type="radio" name="operation"
                    checked={selected}
                    onChange={() => update('operation', op.value)}
                    className="sr-only" />
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span className="text-xs font-semibold text-slate-900 truncate">{op.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5 leading-tight">{op.desc}</div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.unit}</div>
            <div className="flex gap-1.5">
              <button type="button"
                onClick={() => update('is_percentage', true)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  form.is_percentage ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                <Percent className="w-3.5 h-3.5" /> {t.percent}
              </button>
              <button type="button"
                onClick={() => update('is_percentage', false)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  !form.is_percentage ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                <Euro className="w-3.5 h-3.5" /> {t.absolute}
              </button>
            </div>
          </div>
          <Field label={t.amount}>
            <div className="relative">
              <input type="number" step="0.01" min="0" value={form.amount}
                onChange={e => update('amount', Number(e.target.value) || 0)}
                className="rule-input pr-10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 pointer-events-none">
                {form.is_percentage ? '%' : '€'}
              </span>
            </div>
          </Field>
        </div>

        {/* Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{t.previewTitle}</div>
          {basePrice > 0 && previewPrice != null ? (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm text-slate-600">
                {t.previewBase}: <strong className="text-slate-900">€{basePrice.toFixed(2)}</strong>
              </div>
              <div className="text-sm text-slate-400">→</div>
              <div className={`text-lg font-extrabold ${
                previewPrice > basePrice ? 'text-emerald-700' :
                previewPrice < basePrice ? 'text-rose-700' : 'text-slate-900'
              }`}>
                €{previewPrice.toFixed(2)}
                {previewPrice !== basePrice && (
                  <span className="text-xs font-semibold ml-1.5 text-slate-500">
                    ({previewPrice > basePrice ? '+' : ''}{(((previewPrice - basePrice) / basePrice) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">{t.previewNoBase}</div>
          )}
        </div>

        {/* Active toggle */}
        <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
          <button type="button" onClick={() => update('active', !form.active)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              form.active ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
            role="switch" aria-checked={form.active}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              form.active ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-800">{t.activeLabel}</div>
            <div className="text-xs text-slate-500 mt-0.5">{t.activeHint}</div>
          </div>
        </div>
      </Section>

      {/* SAVE BAR */}
      <div className="fixed md:static bottom-0 left-0 right-0 z-30 bg-white/95 md:bg-transparent backdrop-blur md:backdrop-blur-0 border-t md:border-0 border-slate-200 p-3 md:p-0 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {justSaved && (
            <div className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> {t.saved}
            </div>
          )}
          {error && (
            <div className="inline-flex items-center gap-2 text-xs text-rose-700 font-mono">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onDelete && mode === 'edit' && (
            <button type="button" onClick={handleDelete} disabled={deleting || saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold rounded-xl transition-colors disabled:opacity-50">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? t.deleting : t.deleteAction}
            </button>
          )}
          <button type="submit" disabled={saving || deleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-sm transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.rule-input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid rgb(203 213 225);
          border-radius: 0.75rem;
          background: white;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.rule-input:focus) {
          outline: none;
          border-color: rgb(217 119 6);
          box-shadow: 0 0 0 3px rgb(245 158 11 / 0.2);
        }
      `}</style>
    </form>
  );
}

const SECTION_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  violet:  { bg: 'bg-violet-100',  text: 'text-violet-700',  ring: 'ring-violet-200' },
  sky:     { bg: 'bg-sky-100',     text: 'text-sky-700',     ring: 'ring-sky-200' },
  amber:   { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
};

function Section({
  icon: Icon, color, title, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: keyof typeof SECTION_COLORS;
  title: string;
  children: React.ReactNode;
}) {
  const c = SECTION_COLORS[color];
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${c.bg} ${c.text} ring-4 ${c.ring}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}
