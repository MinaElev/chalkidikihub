'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Settings, ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle,
  Receipt, CalendarClock, XCircle, CreditCard, Bell, Zap, Info, Sparkles,
  Home, ChevronRight, Pin, ExternalLink, Unlink,
} from 'lucide-react';

interface OwnerSettings {
  instant_book: boolean;
  min_nights_default: number;
  max_nights_default: number | null;
  advance_notice_hours: number;
  preparation_days: number;
  checkin_time: string;
  checkout_time: string;
  cancellation_policy: 'flexible' | 'moderate' | 'strict' | 'custom';
  cancellation_policy_text: string | null;
  stripe_account_id: string | null;
  stripe_onboarded: boolean;
  deposit_percentage: number;
  balance_due_days_before: number;
  afm: string | null;
  ama_number: string | null;
  vat_rate: number;
  tourist_tax_enabled: boolean;
  tourist_tax_rate: number | null;
  reply_to_email: string | null;
  notification_phone: string | null;
  sms_notifications: boolean;
  auto_cleaning_enabled: boolean;
  cleaning_default_assignee_name: string | null;
  cleaning_default_assignee_phone: string | null;
  cleaning_default_assignee_email: string | null;
  cleaning_default_cost: number | null;
  cleaning_lead_days: number;
  notify_new_inquiry: boolean;
  notify_new_booking: boolean;
  notify_overdue_tasks: boolean;
  notify_check_in_today: boolean;
  notify_check_out_today: boolean;
}

const DEFAULTS: OwnerSettings = {
  instant_book: false,
  min_nights_default: 1,
  max_nights_default: null,
  advance_notice_hours: 24,
  preparation_days: 0,
  checkin_time: '15:00',
  checkout_time: '11:00',
  cancellation_policy: 'moderate',
  cancellation_policy_text: null,
  stripe_account_id: null,
  stripe_onboarded: false,
  deposit_percentage: 20,
  balance_due_days_before: 14,
  afm: null,
  ama_number: null,
  vat_rate: 13.0,
  tourist_tax_enabled: false,
  tourist_tax_rate: null,
  reply_to_email: null,
  notification_phone: null,
  sms_notifications: false,
  auto_cleaning_enabled: false,
  cleaning_default_assignee_name: null,
  cleaning_default_assignee_phone: null,
  cleaning_default_assignee_email: null,
  cleaning_default_cost: null,
  cleaning_lead_days: 0,
  notify_new_inquiry: true,
  notify_new_booking: true,
  notify_overdue_tasks: true,
  notify_check_in_today: false,
  notify_check_out_today: false,
};

export default function PmsSettingsPage() {
  const locale = useLocale();
  const el = locale === 'el';

  const t = {
    back: el ? 'Πίσω στο Command Center' : 'Back to Command Center',
    pageTitle: el ? 'Ρυθμίσεις PMS' : 'PMS Settings',
    pageSub: el
      ? 'Φορολογικά στοιχεία, πολιτικές κράτησης, cancellation, Stripe & ειδοποιήσεις — όλα σε ένα μέρος.'
      : 'Tax info, booking policies, cancellation, Stripe & notifications — all in one place.',

    taxTitle: el ? 'Φορολογικά στοιχεία' : 'Tax identity',
    taxSub: el
      ? 'Τα ΑΦΜ/ΑΜΑ περιλαμβάνονται αυτόματα στα emails επιβεβαίωσης για νόμιμη τιμολόγηση.'
      : 'AFM/AMA are auto-included in confirmation emails for compliant Greek invoicing.',
    afm: 'ΑΦΜ',
    afmHint: el ? 'Αριθμός Φορολογικού Μητρώου (9 ψηφία)' : 'Greek tax ID (9 digits)',
    ama: el ? 'ΑΜΑ (Αριθμός Μητρώου Ακινήτου)' : 'AMA (Property Registry Number)',
    amaHint: el ? 'Από το μητρώο βραχυχρόνιας μίσθωσης ΑΑΔΕ' : 'From the AADE short-term rental registry',
    vat: el ? 'Συντελεστής ΦΠΑ (%)' : 'VAT rate (%)',
    vatHint: el ? 'Στην Ελλάδα ο τουριστικός ΦΠΑ είναι 13%.' : 'Greek tourism VAT is 13%.',
    touristTaxEnabled: el ? 'Ενεργή χρέωση τουριστικού φόρου' : 'Charge tourist tax',
    touristTaxHint: el
      ? 'Αν ενεργοποιηθεί, θα προστίθεται στο σύνολο του guest.'
      : 'If enabled, added to the guest total.',
    touristTaxRate: el ? 'Ποσοστό/ποσό ανά διανυκτέρευση (€)' : 'Amount per night (€)',

    bookingTitle: el ? 'Πολιτικές κράτησης' : 'Booking policies',
    bookingSub: el
      ? 'Defaults για όλα τα καταλύματα — μπορείς αργότερα να κάνεις overrides per-listing.'
      : 'Defaults for all listings — you can override per-listing later.',
    instantBook: el ? 'Instant Book ενεργό' : 'Instant Book enabled',
    instantBookHint: el
      ? 'Αν OFF, κάθε κράτηση περνά από έγκριση πριν επιβεβαιωθεί.'
      : 'If OFF, every booking needs approval before confirmation.',
    minNights: el ? 'Ελάχιστες διανυκτερεύσεις' : 'Minimum nights',
    maxNights: el ? 'Μέγιστες διανυκτερεύσεις' : 'Maximum nights',
    maxNightsHint: el ? 'Άφησε κενό για χωρίς όριο.' : 'Leave blank for no limit.',
    advanceNotice: el ? 'Προειδοποίηση πριν το check-in (ώρες)' : 'Advance notice before check-in (hours)',
    preparationDays: el ? 'Μέρες προετοιμασίας μεταξύ κρατήσεων' : 'Preparation days between bookings',
    preparationHint: el
      ? 'Buffer για καθαριότητα/συντήρηση. 0 = back-to-back επιτρεπτά.'
      : 'Buffer for cleaning/maintenance. 0 = back-to-back allowed.',
    checkinTime: el ? 'Ώρα check-in' : 'Check-in time',
    checkoutTime: el ? 'Ώρα check-out' : 'Check-out time',

    cancelTitle: el ? 'Πολιτική ακύρωσης' : 'Cancellation policy',
    cancelSub: el
      ? 'Εμφανίζεται στο public listing και στα emails επιβεβαίωσης.'
      : 'Shown on the public listing and in confirmation emails.',
    flexible: el ? 'Ευέλικτη' : 'Flexible',
    flexibleDesc: el ? 'Πλήρης επιστροφή αν ακυρώσει έως 24h πριν.' : 'Full refund if cancelled up to 24h before.',
    moderate: el ? 'Μέτρια' : 'Moderate',
    moderateDesc: el ? 'Πλήρης επιστροφή αν ακυρώσει έως 7 ημέρες πριν.' : 'Full refund if cancelled up to 7 days before.',
    strict: el ? 'Αυστηρή' : 'Strict',
    strictDesc: el ? 'Χωρίς επιστροφή μετά την κράτηση.' : 'No refund after booking.',
    custom: el ? 'Δική σου' : 'Custom',
    customDesc: el ? 'Περιγράφεις παρακάτω.' : 'Describe below.',
    customText: el ? 'Πολιτική με δικά σου λόγια' : 'Your own wording',

    paymentsTitle: el ? 'Πληρωμές' : 'Payments',
    paymentsSub: el
      ? 'Stripe Connect για direct bookings με 0% προμήθεια.'
      : 'Stripe Connect for direct bookings with 0% commission.',
    stripeStatus: el ? 'Κατάσταση Stripe' : 'Stripe status',
    stripeConnected: el ? '✅ Συνδεδεμένο' : '✅ Connected',
    stripeNotConnected: el ? '⏸ Δεν έχει συνδεθεί ακόμα' : '⏸ Not connected yet',
    stripeIntro: el
      ? 'Σύνδεσε τον Stripe λογαριασμό σου και οι direct κρατήσεις χρεώνουν προκαταβολή αυτόματα — τα χρήματα πάνε κατευθείαν σε σένα, 0% προμήθεια.'
      : 'Connect your Stripe account so direct bookings auto-charge the deposit — funds land straight in your account, 0% commission.',
    stripeConnectBtn: el ? 'Σύνδεση με Stripe' : 'Connect with Stripe',
    stripeDisconnectBtn: el ? 'Αποσύνδεση' : 'Disconnect',
    stripeDisconnectConfirm: el ? 'Σίγουρα θες να αποσυνδέσεις το Stripe;' : 'Really disconnect Stripe?',
    stripeConnectedOk: el ? 'Ο λογαριασμός Stripe συνδέθηκε επιτυχώς.' : 'Stripe account connected successfully.',
    stripeConnectedErr: el ? 'Αποτυχία σύνδεσης Stripe.' : 'Stripe connection failed.',
    stripeConnectedMismatch: el ? 'Το state δεν ταίριαξε — δοκίμασε ξανά.' : 'State mismatch — please try again.',
    stripeDisconnected: el ? 'Το Stripe αποσυνδέθηκε.' : 'Stripe disconnected.',
    deposit: el ? 'Ποσοστό προκαταβολής (%)' : 'Deposit percentage (%)',
    depositHint: el
      ? 'Όταν κλείνει ο guest, χρεώνεται αυτό το %. Το υπόλοιπο πριν το check-in.'
      : 'Charged when guest books. Balance before check-in.',
    balanceDays: el ? 'Balance — ημέρες πριν το check-in' : 'Balance — days before check-in',

    autoCleanTitle: el ? 'Αυτόματος προγραμματισμός καθαρισμού' : 'Auto-schedule cleaning',
    autoCleanSub: el
      ? 'Όταν έρχεται check-out, δημιουργείται αυτόματα pending task καθαρισμού. Δεν θα φτιαχτεί task αν έχει ήδη μία κρατηθεί manually.'
      : 'When a check-out approaches, a pending cleaning task is auto-created. Skipped if one already exists manually.',
    autoCleanEnabled: el ? 'Ενεργός αυτόματος καθαρισμός' : 'Auto-cleaning enabled',
    autoCleanEnabledHint: el
      ? 'Hourly cron σκανάρει κρατήσεις με check-out τις επόμενες 14 ημέρες και φτιάχνει τις tasks.'
      : 'Hourly cron scans bookings with check-out in the next 14 days and creates the tasks.',
    autoCleanAssigneeName: el ? 'Προεπιλεγμένος συνεργάτης' : 'Default assignee name',
    autoCleanAssigneePhone: el ? 'Τηλέφωνο συνεργάτη' : 'Assignee phone',
    autoCleanAssigneeEmail: el ? 'Email συνεργάτη' : 'Assignee email',
    autoCleanCost: el ? 'Προεπιλεγμένο κόστος (€)' : 'Default cost (€)',
    autoCleanLead: el ? 'Ημέρες πριν το check-out' : 'Days before check-out',
    autoCleanLeadHint: el
      ? '0 = την ίδια μέρα με το check-out (στην ώρα check-out). 1 = την προηγούμενη κλπ.'
      : '0 = same day as check-out (at check-out time). 1 = one day earlier, etc.',

    notifTitle: el ? 'Ειδοποιήσεις' : 'Notifications',
    notifSub: el
      ? 'Πού να σε βρίσκουν οι guests & πού να σου έρχονται alerts.'
      : 'Where guests reach you and where alerts come in.',
    replyEmail: el ? 'Reply-to email για guests' : 'Reply-to email for guests',
    replyEmailHint: el
      ? 'Αν κενό, χρησιμοποιείται το email του account.'
      : 'If blank, uses the account email.',
    notifPhone: el ? 'Τηλέφωνο ειδοποιήσεων' : 'Notification phone',
    notifPhoneHint: 'π.χ. +30 69...',
    smsEnabled: el ? 'SMS ειδοποιήσεις' : 'SMS notifications',
    smsHint: el
      ? 'Για νέες κρατήσεις & urgent μηνύματα. (Έρχεται)'
      : 'For new bookings & urgent messages. (Coming)',

    emailAlertsTitle: el ? 'Email alerts' : 'Email alerts',
    emailAlertsSub: el
      ? 'Hourly cron στέλνει email όταν συμβεί κάτι. Πηγαίνουν στο reply-to email παραπάνω — αν κενό, στο email του λογαριασμού.'
      : 'Hourly cron emails you when things happen. Sent to the reply-to email above — if blank, to the account email.',
    alertNewInquiry: el ? 'Νέο αίτημα κράτησης' : 'New inquiry arrived',
    alertNewInquiryHint: el
      ? 'Email όταν guest στείλει αίτημα (status = inquiry).'
      : 'Email when a guest submits an inquiry (status = inquiry).',
    alertNewBooking: el ? 'Νέα κράτηση επιβεβαιωμένη' : 'New booking confirmed',
    alertNewBookingHint: el
      ? 'Email όταν κράτηση γίνεται confirmed ή pending.'
      : 'Email when a booking becomes confirmed or pending.',
    alertOverdue: el ? 'Εκπρόθεσμη εργασία' : 'Overdue task',
    alertOverdueHint: el
      ? 'Email όταν task έχει περάσει το scheduled_at (ξαναστέλνει μία φορά την ημέρα).'
      : 'Email when a task passes its scheduled_at (re-sends once per day).',
    alertCheckIn: el ? 'Check-in σήμερα' : 'Check-in today',
    alertCheckInHint: el
      ? 'Υπενθύμιση κάθε πρωί για τα σημερινά arrivals.'
      : 'Morning reminder for today\'s arrivals.',
    alertCheckOut: el ? 'Check-out σήμερα' : 'Check-out today',
    alertCheckOutHint: el
      ? 'Υπενθύμιση για καθαρισμό/damage check μετά τον guest.'
      : 'Reminder for cleaning/damage check after guest leaves.',

    save: el ? 'Αποθήκευση' : 'Save',
    saving: el ? 'Αποθηκεύεται…' : 'Saving…',
    saved: el ? 'Οι ρυθμίσεις αποθηκεύτηκαν' : 'Settings saved',
    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    required: el ? 'Υποχρεωτικό' : 'Required',
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<OwnerSettings>(DEFAULTS);
  const [listings, setListings] = useState<Array<{
    id: string; slug: string; title_el: string | null; title_en: string | null; overrideCount: number;
  }>>([]);
  const [stripeDisconnecting, setStripeDisconnecting] = useState(false);

  const sp = useSearchParams();
  const stripeFlag = sp?.get('stripe');
  const stripeNotice = stripeFlag === 'connected' ? { kind: 'ok' as const, text: t.stripeConnectedOk }
    : stripeFlag === 'state_mismatch' ? { kind: 'err' as const, text: t.stripeConnectedMismatch }
    : stripeFlag === 'disconnected' ? { kind: 'ok' as const, text: t.stripeDisconnected }
    : stripeFlag && stripeFlag !== 'connected' ? { kind: 'err' as const, text: `${t.stripeConnectedErr} (${stripeFlag})` }
    : null;

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) {
          setLoadError(authErr?.message || 'Not signed in');
          return;
        }
        const [{ data, error }, { data: lst }, { data: overrideRows }] = await Promise.all([
          supabase
            .from('pms_owner_settings')
            .select('*')
            .eq('owner_id', user.id)
            .maybeSingle(),
          supabase
            .from('listings')
            .select('id, slug, title_el, title_en')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('pms_listing_settings')
            .select('listing_id, instant_book, min_nights, max_nights, advance_notice_hours, preparation_days, checkin_time, checkout_time, cancellation_policy, deposit_percentage, balance_due_days_before, cleaning_default_cost, cleaning_lead_days')
            .eq('owner_id', user.id),
        ]);
        if (error) {
          setLoadError(error.message);
          return;
        }
        const overrideCountById = new Map<string, number>();
        for (const row of overrideRows || []) {
          let n = 0;
          for (const [k, v] of Object.entries(row)) {
            if (k === 'listing_id') continue;
            if (v !== null && v !== undefined) n++;
          }
          overrideCountById.set(row.listing_id, n);
        }
        setListings((lst || []).map(l => ({
          id: l.id,
          slug: l.slug,
          title_el: l.title_el,
          title_en: l.title_en,
          overrideCount: overrideCountById.get(l.id) || 0,
        })));
        if (data) {
          setForm({
            instant_book: !!data.instant_book,
            min_nights_default: data.min_nights_default ?? 1,
            max_nights_default: data.max_nights_default,
            advance_notice_hours: data.advance_notice_hours ?? 24,
            preparation_days: data.preparation_days ?? 0,
            checkin_time: data.checkin_time || '15:00',
            checkout_time: data.checkout_time || '11:00',
            cancellation_policy: (data.cancellation_policy || 'moderate') as OwnerSettings['cancellation_policy'],
            cancellation_policy_text: data.cancellation_policy_text,
            stripe_account_id: data.stripe_account_id,
            stripe_onboarded: !!data.stripe_onboarded,
            deposit_percentage: data.deposit_percentage ?? 20,
            balance_due_days_before: data.balance_due_days_before ?? 14,
            afm: data.afm,
            ama_number: data.ama_number,
            vat_rate: Number(data.vat_rate ?? 13),
            tourist_tax_enabled: !!data.tourist_tax_enabled,
            tourist_tax_rate: data.tourist_tax_rate != null ? Number(data.tourist_tax_rate) : null,
            reply_to_email: data.reply_to_email,
            notification_phone: data.notification_phone,
            sms_notifications: !!data.sms_notifications,
            auto_cleaning_enabled: !!data.auto_cleaning_enabled,
            cleaning_default_assignee_name: data.cleaning_default_assignee_name,
            cleaning_default_assignee_phone: data.cleaning_default_assignee_phone,
            cleaning_default_assignee_email: data.cleaning_default_assignee_email,
            cleaning_default_cost: data.cleaning_default_cost != null ? Number(data.cleaning_default_cost) : null,
            cleaning_lead_days: data.cleaning_lead_days ?? 0,
            notify_new_inquiry: data.notify_new_inquiry !== false,
            notify_new_booking: data.notify_new_booking !== false,
            notify_overdue_tasks: data.notify_overdue_tasks !== false,
            notify_check_in_today: !!data.notify_check_in_today,
            notify_check_out_today: !!data.notify_check_out_today,
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function update<K extends keyof OwnerSettings>(key: K, value: OwnerSettings[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setJustSaved(false);
    setSaveError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setJustSaved(false);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSaveError('Not signed in');
        return;
      }
      const payload = {
        owner_id: user.id,
        ...form,
        cancellation_policy_text: form.cancellation_policy === 'custom' ? form.cancellation_policy_text : null,
        tourist_tax_rate: form.tourist_tax_enabled ? form.tourist_tax_rate : null,
      };
      const { error } = await supabase
        .from('pms_owner_settings')
        .upsert(payload, { onConflict: 'owner_id' });
      if (error) {
        setSaveError(error.message);
        return;
      }
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 4000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-slate-600" /></div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-28 md:pb-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.pageTitle}</h1>
            <p className="text-white/80 text-sm leading-relaxed">{t.pageSub}</p>
          </div>
        </div>
      </header>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.loadError}: <span className="font-mono text-xs">{loadError}</span></span>
        </div>
      )}

      {/* TAX */}
      <Section icon={Receipt} color="amber" title={t.taxTitle} sub={t.taxSub}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t.afm} hint={t.afmHint}>
            <input type="text" inputMode="numeric" maxLength={9}
              value={form.afm || ''}
              onChange={e => update('afm', e.target.value || null)}
              className="input" placeholder="123456789" />
          </Field>
          <Field label={t.ama} hint={t.amaHint}>
            <input type="text"
              value={form.ama_number || ''}
              onChange={e => update('ama_number', e.target.value || null)}
              className="input" placeholder="00000000000" />
          </Field>
          <Field label={t.vat} hint={t.vatHint}>
            <input type="number" step="0.5" min="0" max="30"
              value={form.vat_rate}
              onChange={e => update('vat_rate', Number(e.target.value))}
              className="input" />
          </Field>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <Toggle
            checked={form.tourist_tax_enabled}
            onChange={v => update('tourist_tax_enabled', v)}
            label={t.touristTaxEnabled}
            hint={t.touristTaxHint}
          />
          {form.tourist_tax_enabled && (
            <div className="mt-3 max-w-xs">
              <Field label={t.touristTaxRate}>
                <input type="number" step="0.5" min="0"
                  value={form.tourist_tax_rate ?? ''}
                  onChange={e => update('tourist_tax_rate', e.target.value ? Number(e.target.value) : null)}
                  className="input" placeholder="1.50" />
              </Field>
            </div>
          )}
        </div>
      </Section>

      {/* BOOKING POLICIES */}
      <Section icon={CalendarClock} color="sky" title={t.bookingTitle} sub={t.bookingSub}>
        <Toggle
          checked={form.instant_book}
          onChange={v => update('instant_book', v)}
          label={t.instantBook}
          hint={t.instantBookHint}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <Field label={t.checkinTime}>
            <input type="time" value={form.checkin_time}
              onChange={e => update('checkin_time', e.target.value)}
              className="input" />
          </Field>
          <Field label={t.checkoutTime}>
            <input type="time" value={form.checkout_time}
              onChange={e => update('checkout_time', e.target.value)}
              className="input" />
          </Field>
          <Field label={t.minNights}>
            <input type="number" min="1" max="365"
              value={form.min_nights_default}
              onChange={e => update('min_nights_default', Math.max(1, Number(e.target.value) || 1))}
              className="input" />
          </Field>
          <Field label={t.maxNights} hint={t.maxNightsHint}>
            <input type="number" min="1" max="365"
              value={form.max_nights_default ?? ''}
              onChange={e => update('max_nights_default', e.target.value ? Number(e.target.value) : null)}
              className="input" placeholder="—" />
          </Field>
          <Field label={t.advanceNotice}>
            <input type="number" min="0" max="720"
              value={form.advance_notice_hours}
              onChange={e => update('advance_notice_hours', Math.max(0, Number(e.target.value) || 0))}
              className="input" />
          </Field>
          <Field label={t.preparationDays} hint={t.preparationHint}>
            <input type="number" min="0" max="30"
              value={form.preparation_days}
              onChange={e => update('preparation_days', Math.max(0, Number(e.target.value) || 0))}
              className="input" />
          </Field>
        </div>
      </Section>

      {/* CANCELLATION */}
      <Section icon={XCircle} color="rose" title={t.cancelTitle} sub={t.cancelSub}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {([
            { key: 'flexible', label: t.flexible, desc: t.flexibleDesc },
            { key: 'moderate', label: t.moderate, desc: t.moderateDesc },
            { key: 'strict',   label: t.strict,   desc: t.strictDesc },
            { key: 'custom',   label: t.custom,   desc: t.customDesc },
          ] as const).map(opt => (
            <label key={opt.key}
              className={`cursor-pointer rounded-xl border-2 p-3 transition ${
                form.cancellation_policy === opt.key
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
              <div className="flex items-start gap-2">
                <input type="radio" name="cancellation_policy"
                  checked={form.cancellation_policy === opt.key}
                  onChange={() => update('cancellation_policy', opt.key)}
                  className="mt-0.5 accent-rose-600" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{opt.label}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{opt.desc}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
        {form.cancellation_policy === 'custom' && (
          <div className="pt-2">
            <Field label={t.customText}>
              <textarea rows={3}
                value={form.cancellation_policy_text || ''}
                onChange={e => update('cancellation_policy_text', e.target.value || null)}
                className="input" />
            </Field>
          </div>
        )}
      </Section>

      {/* PAYMENTS */}
      <Section icon={CreditCard} color="emerald" title={t.paymentsTitle} sub={t.paymentsSub}>
        {stripeNotice && (
          <div className={`rounded-xl p-3 text-sm flex items-start gap-2 ${
            stripeNotice.kind === 'ok'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {stripeNotice.kind === 'ok'
              ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
            <span>{stripeNotice.text}</span>
          </div>
        )}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="text-sm font-semibold text-slate-700">{t.stripeStatus}</div>
            <div className={`text-sm font-medium ${form.stripe_onboarded ? 'text-emerald-700' : 'text-slate-500'}`}>
              {form.stripe_onboarded ? t.stripeConnected : t.stripeNotConnected}
            </div>
          </div>
          <div className="text-xs text-slate-600 flex items-start gap-2 mb-3">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{t.stripeIntro}</span>
          </div>
          {form.stripe_onboarded ? (
            <button type="button"
              disabled={stripeDisconnecting}
              onClick={async () => {
                if (!confirm(t.stripeDisconnectConfirm)) return;
                setStripeDisconnecting(true);
                try {
                  const res = await fetch('/api/stripe/connect/disconnect', { method: 'POST' });
                  if (res.ok) {
                    window.location.href = `/${locale}/dashboard/pms/settings?stripe=disconnected`;
                  } else {
                    setStripeDisconnecting(false);
                  }
                } catch {
                  setStripeDisconnecting(false);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-rose-400 hover:text-rose-700 text-slate-700 text-sm font-semibold rounded-xl transition">
              {stripeDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink className="w-4 h-4" />}
              {t.stripeDisconnectBtn}
            </button>
          ) : (
            <a href="/api/stripe/connect/start"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#635bff] hover:bg-[#534ae0] text-white text-sm font-semibold rounded-xl shadow-sm transition">
              <ExternalLink className="w-4 h-4" />
              {t.stripeConnectBtn}
            </a>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <Field label={t.deposit} hint={t.depositHint}>
            <input type="number" min="0" max="100"
              value={form.deposit_percentage}
              onChange={e => update('deposit_percentage', Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
              className="input" />
          </Field>
          <Field label={t.balanceDays}>
            <input type="number" min="0" max="90"
              value={form.balance_due_days_before}
              onChange={e => update('balance_due_days_before', Math.max(0, Number(e.target.value) || 0))}
              className="input" />
          </Field>
        </div>
      </Section>

      {/* AUTO CLEANING */}
      <Section icon={Sparkles} color="fuchsia" title={t.autoCleanTitle} sub={t.autoCleanSub}>
        <Toggle
          checked={form.auto_cleaning_enabled}
          onChange={v => update('auto_cleaning_enabled', v)}
          label={t.autoCleanEnabled}
          hint={t.autoCleanEnabledHint}
        />
        {form.auto_cleaning_enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <Field label={t.autoCleanAssigneeName}>
              <input type="text"
                value={form.cleaning_default_assignee_name || ''}
                onChange={e => update('cleaning_default_assignee_name', e.target.value || null)}
                className="input" placeholder={el ? 'π.χ. Μαρία' : 'e.g. Maria'} />
            </Field>
            <Field label={t.autoCleanAssigneePhone}>
              <input type="tel"
                value={form.cleaning_default_assignee_phone || ''}
                onChange={e => update('cleaning_default_assignee_phone', e.target.value || null)}
                className="input" placeholder="+30 69..." />
            </Field>
            <Field label={t.autoCleanAssigneeEmail}>
              <input type="email"
                value={form.cleaning_default_assignee_email || ''}
                onChange={e => update('cleaning_default_assignee_email', e.target.value || null)}
                className="input" placeholder="cleaner@example.com" />
            </Field>
            <Field label={t.autoCleanCost}>
              <input type="number" step="0.5" min="0"
                value={form.cleaning_default_cost ?? ''}
                onChange={e => update('cleaning_default_cost', e.target.value ? Number(e.target.value) : null)}
                className="input" placeholder="40" />
            </Field>
            <Field label={t.autoCleanLead} hint={t.autoCleanLeadHint}>
              <input type="number" min="0" max="7"
                value={form.cleaning_lead_days}
                onChange={e => update('cleaning_lead_days', Math.max(0, Math.min(7, Number(e.target.value) || 0)))}
                className="input" />
            </Field>
          </div>
        )}
      </Section>

      {/* NOTIFICATIONS */}
      <Section icon={Bell} color="violet" title={t.notifTitle} sub={t.notifSub}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t.replyEmail} hint={t.replyEmailHint}>
            <input type="email"
              value={form.reply_to_email || ''}
              onChange={e => update('reply_to_email', e.target.value || null)}
              className="input" placeholder="you@example.gr" />
          </Field>
          <Field label={t.notifPhone} hint={t.notifPhoneHint}>
            <input type="tel"
              value={form.notification_phone || ''}
              onChange={e => update('notification_phone', e.target.value || null)}
              className="input" placeholder="+30 69..." />
          </Field>
        </div>
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="text-sm font-semibold text-slate-800">{t.emailAlertsTitle}</div>
          <p className="text-xs text-slate-500 -mt-1">{t.emailAlertsSub}</p>
          <Toggle
            checked={form.notify_new_inquiry}
            onChange={v => update('notify_new_inquiry', v)}
            label={t.alertNewInquiry}
            hint={t.alertNewInquiryHint}
          />
          <Toggle
            checked={form.notify_new_booking}
            onChange={v => update('notify_new_booking', v)}
            label={t.alertNewBooking}
            hint={t.alertNewBookingHint}
          />
          <Toggle
            checked={form.notify_overdue_tasks}
            onChange={v => update('notify_overdue_tasks', v)}
            label={t.alertOverdue}
            hint={t.alertOverdueHint}
          />
          <Toggle
            checked={form.notify_check_in_today}
            onChange={v => update('notify_check_in_today', v)}
            label={t.alertCheckIn}
            hint={t.alertCheckInHint}
          />
          <Toggle
            checked={form.notify_check_out_today}
            onChange={v => update('notify_check_out_today', v)}
            label={t.alertCheckOut}
            hint={t.alertCheckOutHint}
          />
        </div>
        <div className="pt-2 border-t border-slate-100">
          <Toggle
            checked={form.sms_notifications}
            onChange={v => update('sms_notifications', v)}
            label={t.smsEnabled}
            hint={t.smsHint}
          />
        </div>
      </Section>

      {/* PER-LISTING OVERRIDES */}
      <Section icon={Home} color="indigo" title={el ? 'Overrides ανά κατάλυμα' : 'Per-listing overrides'} sub={el
        ? 'Τα πιο πάνω είναι global defaults. Κάθε κατάλυμα μπορεί να έχει δικές του τιμές για ώρες, νύχτες, cancellation, deposit, καθάρισμα.'
        : 'The above are global defaults. Each listing can have its own times, nights, cancellation, deposit, cleaning values.'}>
        {listings.length === 0 ? (
          <div className="text-sm text-slate-500 italic">
            {el ? 'Δεν έχεις listings ακόμα.' : 'No listings yet.'}
          </div>
        ) : (
          <div className="space-y-2">
            {listings.map(l => {
              const title = l.title_el || l.title_en || l.slug;
              return (
                <Link key={l.id} href={`/dashboard/pms/settings/listings/${l.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 inline-flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{l.slug}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {l.overrideCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold">
                        <Pin className="w-3 h-3" /> {l.overrideCount} {el ? 'overrides' : 'overrides'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        {el ? 'κληρονομεί defaults' : 'inherits defaults'}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      {/* SAVE BAR */}
      <div className="fixed md:static bottom-0 left-0 right-0 z-30 bg-white/95 md:bg-transparent backdrop-blur md:backdrop-blur-0 border-t md:border-0 border-slate-200 p-3 md:p-0 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {justSaved && (
            <div className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> {t.saved}
            </div>
          )}
          {saveError && (
            <div className="inline-flex items-center gap-2 text-sm text-rose-700 font-mono text-xs">
              <AlertCircle className="w-4 h-4" /> {saveError}
            </div>
          )}
        </div>
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
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.input:focus) {
          outline: none;
          border-color: rgb(71 85 105);
          box-shadow: 0 0 0 3px rgb(148 163 184 / 0.2);
        }
      `}</style>
    </form>
  );
}

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  amber:   { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-200' },
  sky:     { bg: 'bg-sky-100',     text: 'text-sky-700',     ring: 'ring-sky-200' },
  rose:    { bg: 'bg-rose-100',    text: 'text-rose-700',    ring: 'ring-rose-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  violet:  { bg: 'bg-violet-100',  text: 'text-violet-700',  ring: 'ring-violet-200' },
  fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', ring: 'ring-fuchsia-200' },
  indigo:  { bg: 'bg-indigo-100',  text: 'text-indigo-700',  ring: 'ring-indigo-200' },
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

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

function Toggle({
  checked, onChange, label, hint,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3">
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
        role="switch" aria-checked={checked}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {hint && <div className="text-xs text-slate-500 mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}
