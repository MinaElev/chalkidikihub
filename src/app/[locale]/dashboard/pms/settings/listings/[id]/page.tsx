'use client';

import { useEffect, useState, use } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Settings, ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle,
  CalendarClock, XCircle, CreditCard, Zap, Sparkles, ExternalLink,
} from 'lucide-react';

interface OwnerDefaults {
  instant_book: boolean;
  min_nights_default: number;
  max_nights_default: number | null;
  advance_notice_hours: number;
  preparation_days: number;
  checkin_time: string;
  checkout_time: string;
  cancellation_policy: 'flexible' | 'moderate' | 'strict' | 'custom';
  cancellation_policy_text: string | null;
  deposit_percentage: number;
  balance_due_days_before: number;
  cleaning_default_cost: number | null;
  cleaning_lead_days: number;
}

interface ListingRow {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  owner_id: string;
}

interface Overrides {
  instant_book: boolean | null;
  min_nights: number | null;
  max_nights: number | null;
  advance_notice_hours: number | null;
  preparation_days: number | null;
  checkin_time: string | null;
  checkout_time: string | null;
  cancellation_policy: 'flexible' | 'moderate' | 'strict' | 'custom' | null;
  cancellation_policy_text: string | null;
  deposit_percentage: number | null;
  balance_due_days_before: number | null;
  cleaning_default_cost: number | null;
  cleaning_lead_days: number | null;
}

const OWNER_FALLBACK: OwnerDefaults = {
  instant_book: false,
  min_nights_default: 1,
  max_nights_default: null,
  advance_notice_hours: 24,
  preparation_days: 0,
  checkin_time: '15:00',
  checkout_time: '11:00',
  cancellation_policy: 'moderate',
  cancellation_policy_text: null,
  deposit_percentage: 20,
  balance_due_days_before: 14,
  cleaning_default_cost: null,
  cleaning_lead_days: 0,
};

const EMPTY_OVERRIDES: Overrides = {
  instant_book: null,
  min_nights: null,
  max_nights: null,
  advance_notice_hours: null,
  preparation_days: null,
  checkin_time: null,
  checkout_time: null,
  cancellation_policy: null,
  cancellation_policy_text: null,
  deposit_percentage: null,
  balance_due_days_before: null,
  cleaning_default_cost: null,
  cleaning_lead_days: null,
};

export default function PmsListingSettingsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id: listingId } = use(params);
  const locale = useLocale();
  const el = locale === 'el';

  const t = {
    back: el ? 'Πίσω στις ρυθμίσεις' : 'Back to settings',
    pageTitle: el ? 'Overrides καταλύματος' : 'Listing overrides',
    pageSub: el
      ? 'Ορισμένα defaults δεν ταιριάζουν σε κάθε κατάλυμα. Εδώ κάνεις overrides ανά ακίνητο — κενό = κληρονομεί από τα γενικά.'
      : 'Some defaults don\'t fit every listing. Override them per property here — blank = inherit from global settings.',
    viewLive: el ? 'Δες live' : 'View live',
    override: el ? 'Override' : 'Override',
    inherit: el ? 'Κληρονομεί' : 'Inherits',
    inheritFrom: el ? 'Κληρονομεί από defaults' : 'Inheriting from defaults',
    effective: el ? 'Effective τιμή' : 'Effective value',
    bookingTitle: el ? 'Πολιτικές κράτησης' : 'Booking policies',
    bookingSub: el ? 'Ώρες, νύχτες, buffer — per listing.' : 'Times, nights, buffer — per listing.',
    instantBook: el ? 'Instant Book ενεργό' : 'Instant Book enabled',
    minNights: el ? 'Ελάχιστες διανυκτερεύσεις' : 'Minimum nights',
    maxNights: el ? 'Μέγιστες διανυκτερεύσεις' : 'Maximum nights',
    advanceNotice: el ? 'Προειδοποίηση πριν check-in (ώρες)' : 'Advance notice (hours)',
    preparationDays: el ? 'Μέρες προετοιμασίας' : 'Preparation days',
    checkinTime: el ? 'Ώρα check-in' : 'Check-in time',
    checkoutTime: el ? 'Ώρα check-out' : 'Check-out time',

    cancelTitle: el ? 'Πολιτική ακύρωσης' : 'Cancellation policy',
    cancelSub: el ? 'Αν διαφέρει από το default για αυτό το ακίνητο.' : 'If different from the default for this property.',
    flexible: el ? 'Ευέλικτη' : 'Flexible',
    moderate: el ? 'Μέτρια' : 'Moderate',
    strict: el ? 'Αυστηρή' : 'Strict',
    custom: el ? 'Δική σου' : 'Custom',
    customText: el ? 'Πολιτική με δικά σου λόγια' : 'Your own wording',

    paymentsTitle: el ? 'Πληρωμές' : 'Payments',
    paymentsSub: el ? 'Deposit & balance timing για αυτό το ακίνητο.' : 'Deposit & balance timing for this property.',
    deposit: el ? 'Ποσοστό προκαταβολής (%)' : 'Deposit percentage (%)',
    balanceDays: el ? 'Balance — ημέρες πριν check-in' : 'Balance — days before check-in',

    cleaningTitle: el ? 'Αυτόματος καθαρισμός' : 'Auto-cleaning',
    cleaningSub: el ? 'Κόστος/lead days για το auto-scheduled task.' : 'Cost / lead days for the auto-scheduled task.',
    cleaningCost: el ? 'Κόστος (€)' : 'Cost (€)',
    cleaningLead: el ? 'Μέρες πριν check-out' : 'Days before check-out',

    save: el ? 'Αποθήκευση' : 'Save',
    saving: el ? 'Αποθηκεύεται…' : 'Saving…',
    saved: el ? 'Αποθηκεύτηκε' : 'Saved',
    reset: el ? 'Reset σε defaults' : 'Reset to defaults',
    resetConfirm: el
      ? 'Να αφαιρεθούν όλα τα overrides και να επανέλθει το κατάλυμα στα γενικά defaults;'
      : 'Remove all overrides and revert to global defaults?',
    notFound: el ? 'Δεν βρέθηκε' : 'Not found',
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [listing, setListing] = useState<ListingRow | null>(null);
  const [ownerDefaults, setOwnerDefaults] = useState<OwnerDefaults>(OWNER_FALLBACK);
  const [overrides, setOverrides] = useState<Overrides>(EMPTY_OVERRIDES);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) {
          setLoadError(authErr?.message || 'Not signed in');
          return;
        }

        const [{ data: lst, error: lstErr }, { data: owner }, { data: ov }] = await Promise.all([
          supabase.from('listings')
            .select('id, slug, title_el, title_en, owner_id')
            .eq('id', listingId)
            .maybeSingle(),
          supabase.from('pms_owner_settings').select('*').eq('owner_id', user.id).maybeSingle(),
          supabase.from('pms_listing_settings').select('*').eq('listing_id', listingId).maybeSingle(),
        ]);

        if (lstErr || !lst) {
          setLoadError(lstErr?.message || t.notFound);
          return;
        }
        setListing(lst as ListingRow);

        if (owner) {
          setOwnerDefaults({
            instant_book: !!owner.instant_book,
            min_nights_default: owner.min_nights_default ?? 1,
            max_nights_default: owner.max_nights_default,
            advance_notice_hours: owner.advance_notice_hours ?? 24,
            preparation_days: owner.preparation_days ?? 0,
            checkin_time: owner.checkin_time || '15:00',
            checkout_time: owner.checkout_time || '11:00',
            cancellation_policy: (owner.cancellation_policy || 'moderate') as OwnerDefaults['cancellation_policy'],
            cancellation_policy_text: owner.cancellation_policy_text,
            deposit_percentage: owner.deposit_percentage ?? 20,
            balance_due_days_before: owner.balance_due_days_before ?? 14,
            cleaning_default_cost: owner.cleaning_default_cost != null ? Number(owner.cleaning_default_cost) : null,
            cleaning_lead_days: owner.cleaning_lead_days ?? 0,
          });
        }

        if (ov) {
          setOverrides({
            instant_book: ov.instant_book,
            min_nights: ov.min_nights,
            max_nights: ov.max_nights,
            advance_notice_hours: ov.advance_notice_hours,
            preparation_days: ov.preparation_days,
            checkin_time: ov.checkin_time,
            checkout_time: ov.checkout_time,
            cancellation_policy: ov.cancellation_policy as Overrides['cancellation_policy'],
            cancellation_policy_text: ov.cancellation_policy_text,
            deposit_percentage: ov.deposit_percentage,
            balance_due_days_before: ov.balance_due_days_before,
            cleaning_default_cost: ov.cleaning_default_cost != null ? Number(ov.cleaning_default_cost) : null,
            cleaning_lead_days: ov.cleaning_lead_days,
          });
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  function setOverride<K extends keyof Overrides>(key: K, value: Overrides[K]) {
    setOverrides(prev => ({ ...prev, [key]: value }));
    setJustSaved(false);
    setSaveError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!listing) return;
    setSaving(true);
    setSaveError(null);
    setJustSaved(false);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSaveError('Not signed in'); return; }

      const payload = {
        listing_id: listing.id,
        owner_id: user.id,
        ...overrides,
        cancellation_policy_text: overrides.cancellation_policy === 'custom' ? overrides.cancellation_policy_text : null,
      };
      const { error } = await supabase
        .from('pms_listing_settings')
        .upsert(payload, { onConflict: 'listing_id' });
      if (error) { setSaveError(error.message); return; }
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 4000);
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!listing) return;
    if (!confirm(t.resetConfirm)) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('pms_listing_settings')
        .delete()
        .eq('listing_id', listing.id);
      if (error) { setSaveError(error.message); return; }
      setOverrides(EMPTY_OVERRIDES);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 4000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-slate-600" /></div>;
  }

  if (!listing) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/pms/settings" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </Link>
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-sm text-rose-700">
          {loadError || t.notFound}
        </div>
      </div>
    );
  }

  const listingTitle = listing.title_el || listing.title_en || listing.slug;

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-28 md:pb-6">
      <Link href="/dashboard/pms/settings" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS · OVERRIDES
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.pageTitle}</h1>
            <div className="text-white/90 text-sm truncate font-medium">{listingTitle}</div>
            <p className="text-white/75 text-xs mt-1 leading-relaxed">{t.pageSub}</p>
            <Link href={`/listings/${listing.slug}`} target="_blank"
              className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white mt-3">
              <ExternalLink className="w-3.5 h-3.5" /> {t.viewLive}
            </Link>
          </div>
        </div>
      </header>

      {/* BOOKING */}
      <Section icon={CalendarClock} color="sky" title={t.bookingTitle} sub={t.bookingSub}>
        <OverrideToggle
          label={t.instantBook}
          isOverride={overrides.instant_book !== null}
          fallback={ownerDefaults.instant_book ? (el ? 'ON' : 'ON') : (el ? 'OFF' : 'OFF')}
          onToggle={enabled => setOverride('instant_book', enabled ? !ownerDefaults.instant_book : null)}
          t={t}
        >
          <BoolSwitch
            value={overrides.instant_book ?? ownerDefaults.instant_book}
            onChange={v => setOverride('instant_book', v)}
          />
        </OverrideToggle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OverrideField
            label={t.minNights}
            isOverride={overrides.min_nights !== null}
            fallback={String(ownerDefaults.min_nights_default)}
            onToggle={enabled => setOverride('min_nights', enabled ? ownerDefaults.min_nights_default : null)}
            t={t}
          >
            <input type="number" min="1" max="365"
              value={overrides.min_nights ?? ''}
              onChange={e => setOverride('min_nights', e.target.value ? Math.max(1, Number(e.target.value)) : null)}
              className="input" />
          </OverrideField>

          <OverrideField
            label={t.maxNights}
            isOverride={overrides.max_nights !== null}
            fallback={ownerDefaults.max_nights_default != null ? String(ownerDefaults.max_nights_default) : '—'}
            onToggle={enabled => setOverride('max_nights', enabled ? (ownerDefaults.max_nights_default ?? 30) : null)}
            t={t}
          >
            <input type="number" min="1" max="365"
              value={overrides.max_nights ?? ''}
              onChange={e => setOverride('max_nights', e.target.value ? Number(e.target.value) : null)}
              className="input" />
          </OverrideField>

          <OverrideField
            label={t.advanceNotice}
            isOverride={overrides.advance_notice_hours !== null}
            fallback={`${ownerDefaults.advance_notice_hours}h`}
            onToggle={enabled => setOverride('advance_notice_hours', enabled ? ownerDefaults.advance_notice_hours : null)}
            t={t}
          >
            <input type="number" min="0" max="720"
              value={overrides.advance_notice_hours ?? ''}
              onChange={e => setOverride('advance_notice_hours', e.target.value ? Math.max(0, Number(e.target.value)) : null)}
              className="input" />
          </OverrideField>

          <OverrideField
            label={t.preparationDays}
            isOverride={overrides.preparation_days !== null}
            fallback={`${ownerDefaults.preparation_days}d`}
            onToggle={enabled => setOverride('preparation_days', enabled ? ownerDefaults.preparation_days : null)}
            t={t}
          >
            <input type="number" min="0" max="30"
              value={overrides.preparation_days ?? ''}
              onChange={e => setOverride('preparation_days', e.target.value ? Math.max(0, Number(e.target.value)) : null)}
              className="input" />
          </OverrideField>

          <OverrideField
            label={t.checkinTime}
            isOverride={overrides.checkin_time !== null}
            fallback={ownerDefaults.checkin_time}
            onToggle={enabled => setOverride('checkin_time', enabled ? ownerDefaults.checkin_time : null)}
            t={t}
          >
            <input type="time"
              value={overrides.checkin_time ?? ''}
              onChange={e => setOverride('checkin_time', e.target.value || null)}
              className="input" />
          </OverrideField>

          <OverrideField
            label={t.checkoutTime}
            isOverride={overrides.checkout_time !== null}
            fallback={ownerDefaults.checkout_time}
            onToggle={enabled => setOverride('checkout_time', enabled ? ownerDefaults.checkout_time : null)}
            t={t}
          >
            <input type="time"
              value={overrides.checkout_time ?? ''}
              onChange={e => setOverride('checkout_time', e.target.value || null)}
              className="input" />
          </OverrideField>
        </div>
      </Section>

      {/* CANCELLATION */}
      <Section icon={XCircle} color="rose" title={t.cancelTitle} sub={t.cancelSub}>
        <OverrideToggle
          label={t.cancelTitle}
          isOverride={overrides.cancellation_policy !== null}
          fallback={ownerDefaults.cancellation_policy}
          onToggle={enabled => setOverride('cancellation_policy', enabled ? ownerDefaults.cancellation_policy : null)}
          t={t}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['flexible','moderate','strict','custom'] as const).map(opt => (
              <button key={opt} type="button"
                onClick={() => setOverride('cancellation_policy', opt)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 ${
                  overrides.cancellation_policy === opt
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {(t as unknown as Record<string, string>)[opt]}
              </button>
            ))}
          </div>
          {overrides.cancellation_policy === 'custom' && (
            <div className="pt-3">
              <label className="block">
                <span className="block text-xs font-semibold text-slate-700 mb-1.5">{t.customText}</span>
                <textarea rows={3}
                  value={overrides.cancellation_policy_text ?? ''}
                  onChange={e => setOverride('cancellation_policy_text', e.target.value || null)}
                  className="input" />
              </label>
            </div>
          )}
        </OverrideToggle>
      </Section>

      {/* PAYMENTS */}
      <Section icon={CreditCard} color="emerald" title={t.paymentsTitle} sub={t.paymentsSub}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OverrideField
            label={t.deposit}
            isOverride={overrides.deposit_percentage !== null}
            fallback={`${ownerDefaults.deposit_percentage}%`}
            onToggle={enabled => setOverride('deposit_percentage', enabled ? ownerDefaults.deposit_percentage : null)}
            t={t}
          >
            <input type="number" min="0" max="100"
              value={overrides.deposit_percentage ?? ''}
              onChange={e => setOverride('deposit_percentage', e.target.value ? Math.min(100, Math.max(0, Number(e.target.value))) : null)}
              className="input" />
          </OverrideField>

          <OverrideField
            label={t.balanceDays}
            isOverride={overrides.balance_due_days_before !== null}
            fallback={`${ownerDefaults.balance_due_days_before}d`}
            onToggle={enabled => setOverride('balance_due_days_before', enabled ? ownerDefaults.balance_due_days_before : null)}
            t={t}
          >
            <input type="number" min="0" max="90"
              value={overrides.balance_due_days_before ?? ''}
              onChange={e => setOverride('balance_due_days_before', e.target.value ? Math.max(0, Number(e.target.value)) : null)}
              className="input" />
          </OverrideField>
        </div>
      </Section>

      {/* CLEANING */}
      <Section icon={Sparkles} color="fuchsia" title={t.cleaningTitle} sub={t.cleaningSub}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OverrideField
            label={t.cleaningCost}
            isOverride={overrides.cleaning_default_cost !== null}
            fallback={ownerDefaults.cleaning_default_cost != null ? `€${ownerDefaults.cleaning_default_cost}` : '—'}
            onToggle={enabled => setOverride('cleaning_default_cost', enabled ? (ownerDefaults.cleaning_default_cost ?? 0) : null)}
            t={t}
          >
            <input type="number" step="0.5" min="0"
              value={overrides.cleaning_default_cost ?? ''}
              onChange={e => setOverride('cleaning_default_cost', e.target.value ? Number(e.target.value) : null)}
              className="input" />
          </OverrideField>

          <OverrideField
            label={t.cleaningLead}
            isOverride={overrides.cleaning_lead_days !== null}
            fallback={`${ownerDefaults.cleaning_lead_days}d`}
            onToggle={enabled => setOverride('cleaning_lead_days', enabled ? ownerDefaults.cleaning_lead_days : null)}
            t={t}
          >
            <input type="number" min="0" max="7"
              value={overrides.cleaning_lead_days ?? ''}
              onChange={e => setOverride('cleaning_lead_days', e.target.value ? Math.max(0, Math.min(7, Number(e.target.value))) : null)}
              className="input" />
          </OverrideField>
        </div>
      </Section>

      {/* SAVE BAR */}
      <div className="fixed md:static bottom-0 left-0 right-0 z-30 bg-white/95 md:bg-transparent backdrop-blur md:backdrop-blur-0 border-t md:border-0 border-slate-200 p-3 md:p-0 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 flex items-center gap-3">
          {justSaved && (
            <div className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> {t.saved}
            </div>
          )}
          {saveError && (
            <div className="inline-flex items-center gap-2 text-xs text-rose-700 font-mono">
              <AlertCircle className="w-4 h-4" /> {saveError}
            </div>
          )}
        </div>
        <button type="button" onClick={handleReset} disabled={saving}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 underline">
          {t.reset}
        </button>
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-sm transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? t.saving : t.save}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid rgb(203 213 225);
          border-radius: 0.75rem;
          background: white;
          font-size: 0.875rem;
          color: rgb(15 23 42);
        }
        :global(.input:focus) {
          outline: none;
          border-color: rgb(71 85 105);
          box-shadow: 0 0 0 3px rgb(148 163 184 / 0.2);
        }
        :global(.input:disabled) {
          background: rgb(248 250 252);
          color: rgb(148 163 184);
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  sky:     { bg: 'bg-sky-100',     text: 'text-sky-700',     ring: 'ring-sky-200' },
  rose:    { bg: 'bg-rose-100',    text: 'text-rose-700',    ring: 'ring-rose-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', ring: 'ring-fuchsia-200' },
};

function Section({
  icon: Icon, color, title, sub, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: keyof typeof COLOR_MAP;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  const c = COLOR_MAP[color];
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${c.bg} ${c.text} ring-4 ${c.ring} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">{sub}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function OverrideField({
  label, isOverride, fallback, onToggle, children, t,
}: {
  label: string;
  isOverride: boolean;
  fallback: string;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
  t: { override: string; inherit: string; inheritFrom: string };
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <button type="button" onClick={() => onToggle(!isOverride)}
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition ${
            isOverride
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}>
          {isOverride ? t.override : t.inherit}
        </button>
      </div>
      <div className={isOverride ? '' : 'opacity-60'}>
        {!isOverride ? (
          <div className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 flex items-center justify-between">
            <span className="font-mono">{fallback}</span>
            <span className="text-[10px] text-slate-400 italic">{t.inheritFrom}</span>
          </div>
        ) : children}
      </div>
    </label>
  );
}

function OverrideToggle({
  label, isOverride, fallback, onToggle, children, t,
}: {
  label: string;
  isOverride: boolean;
  fallback: string;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
  t: { override: string; inherit: string; inheritFrom: string };
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        <button type="button" onClick={() => onToggle(!isOverride)}
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition ${
            isOverride
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}>
          {isOverride ? t.override : t.inherit}
        </button>
      </div>
      {isOverride ? (
        <div>{children}</div>
      ) : (
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="font-mono bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 uppercase">{fallback}</span>
          <span className="italic">{t.inheritFrom}</span>
        </div>
      )}
    </div>
  );
}

function BoolSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        value ? 'bg-emerald-500' : 'bg-slate-300'
      }`}
      role="switch" aria-checked={value}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        value ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );
}
