'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Save, Trash2, Loader2, AlertCircle, CheckCircle2,
  User, Mail, Phone, Globe, Users as UsersIcon,
  CalendarDays, Home, Euro, FileText, Radio, CreditCard,
  LogIn, LogOut, CheckCircle, XCircle, Ban,
} from 'lucide-react';

export type BookingStatus = 'inquiry' | 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'blocked';
export type BookingSource = 'direct' | 'airbnb' | 'booking' | 'vrbo' | 'manual' | 'blocked' | 'other';
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded' | 'na';

export interface BookingFormData {
  id?: string;
  listing_id: string;
  status: BookingStatus;
  source: BookingSource;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  guest_country: string | null;
  num_guests: number;
  num_adults: number;
  num_children: number;
  check_in: string;
  check_out: string;
  currency: string;
  nightly_rate: number | null;
  cleaning_fee: number | null;
  taxes: number | null;
  total_amount: number | null;
  payment_status: PaymentStatus;
  notes: string | null;
  block_reason: string | null;
}

export interface Listing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

export const EMPTY_BOOKING: BookingFormData = {
  listing_id: '',
  status: 'pending',
  source: 'direct',
  guest_name: null,
  guest_email: null,
  guest_phone: null,
  guest_country: null,
  num_guests: 2,
  num_adults: 2,
  num_children: 0,
  check_in: '',
  check_out: '',
  currency: 'EUR',
  nightly_rate: null,
  cleaning_fee: null,
  taxes: null,
  total_amount: null,
  payment_status: 'unpaid',
  notes: null,
  block_reason: null,
};

export function BookingForm({
  mode,
  initial,
  listings,
  el,
  onDelete,
}: {
  mode: 'create' | 'edit';
  initial: BookingFormData;
  listings: Listing[];
  el: boolean;
  onDelete?: () => Promise<void>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BookingFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const t = {
    guestSection: el ? 'Στοιχεία επισκέπτη' : 'Guest details',
    guestName: el ? 'Όνομα επισκέπτη' : 'Guest name',
    guestEmail: 'Email',
    guestPhone: el ? 'Τηλέφωνο' : 'Phone',
    guestCountry: el ? 'Χώρα' : 'Country',
    numAdults: el ? 'Ενήλικες' : 'Adults',
    numChildren: el ? 'Παιδιά' : 'Children',

    datesSection: el ? 'Διαμονή' : 'Stay',
    listing: el ? 'Κατάλυμα' : 'Listing',
    chooseListing: el ? '— Διάλεξε κατάλυμα —' : '— Pick a listing —',
    checkin: el ? 'Check-in' : 'Check-in',
    checkout: el ? 'Check-out' : 'Check-out',
    nights: el ? 'νύχτες' : 'nights',

    statusSection: el ? 'Κατάσταση & πηγή' : 'Status & source',
    status: el ? 'Status κράτησης' : 'Booking status',
    source: el ? 'Πηγή' : 'Source',

    moneySection: el ? 'Οικονομικά' : 'Financials',
    nightlyRate: el ? 'Τιμή/νύχτα (€)' : 'Nightly rate (€)',
    cleaningFee: el ? 'Χρέωση καθαριότητας (€)' : 'Cleaning fee (€)',
    taxes: el ? 'Φόροι (€)' : 'Taxes (€)',
    totalAmount: el ? 'Σύνολο (€)' : 'Total (€)',
    totalAuto: el ? 'Αυτόματο από τιμή × νύχτες + καθαριότητα + φόροι' : 'Auto from rate × nights + cleaning + taxes',
    currency: el ? 'Νόμισμα' : 'Currency',
    payment: el ? 'Κατάσταση πληρωμής' : 'Payment status',

    notesSection: el ? 'Σημειώσεις' : 'Notes',
    notesLabel: el ? 'Ιδιωτικές σημειώσεις (μόνο εσύ τις βλέπεις)' : 'Private notes (owner only)',
    notesPlaceholder: el ? 'π.χ. «έρχεται με σκύλο», «ζήτησε late check-in»…' : "e.g. 'coming with dog', 'asked for late check-in'…",

    blockSection: el ? 'Μπλοκαρισμένες μέρες' : 'Blocked dates',
    blockReason: el ? 'Αιτία μπλοκαρίσματος' : 'Block reason',
    blockReasonPlaceholder: el ? 'π.χ. Συντήρηση, Προσωπική χρήση, Καθαριότητα' : 'e.g. Maintenance, Personal use, Cleaning',

    save: mode === 'create' ? (el ? 'Δημιουργία' : 'Create') : (el ? 'Αποθήκευση' : 'Save'),
    saving: el ? 'Αποθηκεύεται…' : 'Saving…',
    saved: el ? 'Αποθηκεύτηκε' : 'Saved',
    deleteAction: el ? 'Διαγραφή' : 'Delete',
    deleting: el ? 'Διαγράφεται…' : 'Deleting…',
    deleteConfirm: el ? 'Σίγουρα; Η κράτηση θα διαγραφεί οριστικά.' : 'Are you sure? The booking will be permanently deleted.',
    errorListing: el ? 'Διάλεξε κατάλυμα' : 'Pick a listing',
    errorDates: el ? 'Το check-out πρέπει να είναι μετά το check-in' : 'Check-out must be after check-in',
  };

  const statusOptions: Array<{ value: BookingStatus; label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = [
    { value: 'inquiry',     label: el ? 'Ερώτημα'       : 'Inquiry',     icon: Radio,        color: 'text-slate-700' },
    { value: 'pending',     label: el ? 'Εκκρεμεί'      : 'Pending',     icon: Radio,        color: 'text-amber-700' },
    { value: 'confirmed',   label: el ? 'Επιβεβαιωμένη' : 'Confirmed',   icon: CheckCircle,  color: 'text-emerald-700' },
    { value: 'checked_in',  label: el ? 'Έχει φτάσει'   : 'Checked-in',  icon: LogIn,        color: 'text-sky-700' },
    { value: 'checked_out', label: el ? 'Έφυγε'         : 'Checked-out', icon: LogOut,       color: 'text-slate-700' },
    { value: 'cancelled',   label: el ? 'Ακυρώθηκε'     : 'Cancelled',   icon: XCircle,      color: 'text-rose-700' },
    { value: 'blocked',     label: el ? 'Blocked'       : 'Blocked',     icon: Ban,          color: 'text-slate-800' },
  ];

  const sourceOptions: Array<{ value: BookingSource; label: string }> = [
    { value: 'direct',   label: 'Direct' },
    { value: 'airbnb',   label: 'Airbnb' },
    { value: 'booking',  label: 'Booking.com' },
    { value: 'vrbo',     label: 'VRBO' },
    { value: 'manual',   label: el ? 'Manual (τηλέφωνο/email)' : 'Manual (phone/email)' },
    { value: 'blocked',  label: el ? 'Μπλοκάρισμα owner' : 'Owner block' },
    { value: 'other',    label: el ? 'Άλλο' : 'Other' },
  ];

  const nights = useMemo(() => {
    if (!form.check_in || !form.check_out) return 0;
    const ci = new Date(form.check_in);
    const co = new Date(form.check_out);
    return Math.max(0, Math.round((co.getTime() - ci.getTime()) / 86400000));
  }, [form.check_in, form.check_out]);

  const autoTotal = useMemo(() => {
    const rate = Number(form.nightly_rate || 0);
    const cleaning = Number(form.cleaning_fee || 0);
    const tax = Number(form.taxes || 0);
    if (nights > 0 && rate > 0) return rate * nights + cleaning + tax;
    return null;
  }, [form.nightly_rate, form.cleaning_fee, form.taxes, nights]);

  useEffect(() => {
    setForm(prev => ({ ...prev, num_guests: (prev.num_adults || 0) + (prev.num_children || 0) }));
  }, [form.num_adults, form.num_children]);

  function update<K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setJustSaved(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setJustSaved(false);

    if (!form.listing_id) { setError(t.errorListing); return; }
    if (form.check_in && form.check_out && form.check_in >= form.check_out) {
      setError(t.errorDates); return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Not signed in'); return; }

      const payload = {
        ...form,
        owner_id: user.id,
        total_amount: form.total_amount ?? autoTotal,
        updated_at: new Date().toISOString(),
      };

      if (mode === 'create') {
        const { data, error } = await supabase
          .from('pms_bookings')
          .insert(payload)
          .select('id')
          .single();
        if (error) { setError(error.message); return; }
        router.push(`/dashboard/pms/bookings/${data.id}`);
      } else {
        const { error } = await supabase
          .from('pms_bookings')
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
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  }

  const isBlock = form.status === 'blocked' || form.source === 'blocked';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-28 md:pb-6">
      {/* STAY */}
      <Section icon={CalendarDays} color="sky" title={t.datesSection}>
        <Field label={t.listing}>
          <select
            value={form.listing_id}
            onChange={e => update('listing_id', e.target.value)}
            className="booking-input" required>
            <option value="">{t.chooseListing}</option>
            {listings.map(l => (
              <option key={l.id} value={l.id}>
                {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.checkin}>
            <input type="date" value={form.check_in}
              onChange={e => update('check_in', e.target.value)}
              className="booking-input" required />
          </Field>
          <Field label={t.checkout}>
            <input type="date" value={form.check_out}
              onChange={e => update('check_out', e.target.value)}
              className="booking-input" required min={form.check_in || undefined} />
          </Field>
        </div>
        {nights > 0 && (
          <div className="text-xs text-slate-600 bg-sky-50 border border-sky-100 rounded-lg px-3 py-1.5 inline-block">
            <strong>{nights}</strong> {t.nights}
          </div>
        )}
      </Section>

      {!isBlock && (
        <>
          {/* GUEST */}
          <Section icon={User} color="violet" title={t.guestSection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label={t.guestName}>
                <input type="text" value={form.guest_name || ''}
                  onChange={e => update('guest_name', e.target.value || null)}
                  className="booking-input" />
              </Field>
              <Field label={t.guestEmail}>
                <input type="email" value={form.guest_email || ''}
                  onChange={e => update('guest_email', e.target.value || null)}
                  className="booking-input" placeholder="guest@example.com" />
              </Field>
              <Field label={t.guestPhone}>
                <input type="tel" value={form.guest_phone || ''}
                  onChange={e => update('guest_phone', e.target.value || null)}
                  className="booking-input" placeholder="+30 69..." />
              </Field>
              <Field label={t.guestCountry}>
                <input type="text" value={form.guest_country || ''}
                  onChange={e => update('guest_country', e.target.value || null)}
                  className="booking-input" placeholder="GR" maxLength={40} />
              </Field>
              <Field label={t.numAdults}>
                <input type="number" min="0" max="30" value={form.num_adults}
                  onChange={e => update('num_adults', Math.max(0, Number(e.target.value) || 0))}
                  className="booking-input" />
              </Field>
              <Field label={t.numChildren}>
                <input type="number" min="0" max="30" value={form.num_children}
                  onChange={e => update('num_children', Math.max(0, Number(e.target.value) || 0))}
                  className="booking-input" />
              </Field>
            </div>
          </Section>
        </>
      )}

      {/* STATUS & SOURCE */}
      <Section icon={Radio} color="amber" title={t.statusSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label={t.status}>
            <select value={form.status}
              onChange={e => update('status', e.target.value as BookingStatus)}
              className="booking-input">
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label={t.source}>
            <select value={form.source}
              onChange={e => update('source', e.target.value as BookingSource)}
              className="booking-input">
              {sourceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {isBlock ? (
        <Section icon={Ban} color="slate" title={t.blockSection}>
          <Field label={t.blockReason}>
            <input type="text" value={form.block_reason || ''}
              onChange={e => update('block_reason', e.target.value || null)}
              className="booking-input" placeholder={t.blockReasonPlaceholder} />
          </Field>
        </Section>
      ) : (
        <Section icon={Euro} color="emerald" title={t.moneySection}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label={t.nightlyRate}>
              <input type="number" step="0.01" min="0" value={form.nightly_rate ?? ''}
                onChange={e => update('nightly_rate', e.target.value ? Number(e.target.value) : null)}
                className="booking-input" placeholder="0.00" />
            </Field>
            <Field label={t.cleaningFee}>
              <input type="number" step="0.01" min="0" value={form.cleaning_fee ?? ''}
                onChange={e => update('cleaning_fee', e.target.value ? Number(e.target.value) : null)}
                className="booking-input" placeholder="0.00" />
            </Field>
            <Field label={t.taxes}>
              <input type="number" step="0.01" min="0" value={form.taxes ?? ''}
                onChange={e => update('taxes', e.target.value ? Number(e.target.value) : null)}
                className="booking-input" placeholder="0.00" />
            </Field>
            <Field label={t.currency}>
              <select value={form.currency}
                onChange={e => update('currency', e.target.value)}
                className="booking-input">
                <option value="EUR">EUR €</option>
                <option value="USD">USD $</option>
                <option value="GBP">GBP £</option>
              </select>
            </Field>
          </div>
          <Field label={t.totalAmount} hint={autoTotal !== null ? `${t.totalAuto}: €${autoTotal.toFixed(2)}` : undefined}>
            <input type="number" step="0.01" min="0"
              value={form.total_amount ?? ''}
              onChange={e => update('total_amount', e.target.value ? Number(e.target.value) : null)}
              className="booking-input"
              placeholder={autoTotal !== null ? autoTotal.toFixed(2) : '0.00'} />
          </Field>
          <Field label={t.payment}>
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'unpaid' as PaymentStatus,       label: el ? 'Απλήρωτο'    : 'Unpaid' },
                { value: 'deposit_paid' as PaymentStatus, label: el ? 'Προκαταβολή' : 'Deposit paid' },
                { value: 'fully_paid' as PaymentStatus,   label: el ? 'Εξοφλημένο'  : 'Fully paid' },
                { value: 'refunded' as PaymentStatus,     label: el ? 'Επιστροφή'   : 'Refunded' },
                { value: 'na' as PaymentStatus,           label: 'N/A' },
              ]).map(opt => (
                <button type="button" key={opt.value}
                  onClick={() => update('payment_status', opt.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                    form.payment_status === opt.value
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
        </Section>
      )}

      {/* NOTES */}
      <Section icon={FileText} color="rose" title={t.notesSection}>
        <Field label={t.notesLabel}>
          <textarea rows={3} value={form.notes || ''}
            onChange={e => update('notes', e.target.value || null)}
            className="booking-input" placeholder={t.notesPlaceholder} />
        </Field>
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-sm transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.booking-input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid rgb(203 213 225);
          border-radius: 0.75rem;
          background: white;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.booking-input:focus) {
          outline: none;
          border-color: rgb(5 150 105);
          box-shadow: 0 0 0 3px rgb(16 185 129 / 0.2);
        }
      `}</style>
    </form>
  );
}

const SECTION_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  sky:     { bg: 'bg-sky-100',     text: 'text-sky-700',     ring: 'ring-sky-200' },
  violet:  { bg: 'bg-violet-100',  text: 'text-violet-700',  ring: 'ring-violet-200' },
  amber:   { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  rose:    { bg: 'bg-rose-100',    text: 'text-rose-700',    ring: 'ring-rose-200' },
  slate:   { bg: 'bg-slate-100',   text: 'text-slate-700',   ring: 'ring-slate-200' },
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
