'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Zap, CalendarDays, ClipboardList, Inbox, DollarSign, Sparkles,
  Wrench, TrendingUp, Settings, ArrowRight, Building2, Loader2,
  CheckCircle2, Circle, AlertCircle, Users, Power, PowerOff,
} from 'lucide-react';

interface ListingRow {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  location_name: string | null;
  is_active: boolean;
  is_closed: boolean;
}

interface PmsStats {
  bookingsTotal: number;
  bookingsUpcoming: number;
  messagesUnread: number;
  tasksPending: number;
  icalFeeds: number;
  hasStripe: boolean;
  hasSettings: boolean;
}

interface OwnerSettingsRow {
  stripe_onboarded?: boolean | null;
  afm?: string | null;
  ama_number?: string | null;
  pms_enabled?: boolean | null;
}

const MODULES = [
  { href: '/dashboard/pms/calendar',    icon: CalendarDays,  key: 'calendar',    accent: 'sky' },
  { href: '/dashboard/pms/bookings',    icon: ClipboardList, key: 'bookings',    accent: 'emerald' },
  { href: '/dashboard/pms/messages',    icon: Inbox,         key: 'messages',    accent: 'violet' },
  { href: '/dashboard/pms/pricing',     icon: DollarSign,    key: 'pricing',     accent: 'amber' },
  { href: '/dashboard/pms/automations', icon: Sparkles,      key: 'automations', accent: 'fuchsia' },
  { href: '/dashboard/pms/tasks',       icon: Wrench,        key: 'tasks',       accent: 'rose' },
  { href: '/dashboard/pms/vendors',     icon: Users,         key: 'vendors',     accent: 'amber' },
  { href: '/dashboard/pms/finance',     icon: TrendingUp,    key: 'finance',     accent: 'teal' },
  { href: '/dashboard/pms/settings',    icon: Settings,      key: 'settings',    accent: 'slate' },
] as const;

const MODULE_LABELS: Record<string, Record<string, { title: string; desc: string }>> = {
  calendar: {
    el: { title: 'Ημερολόγιο & iCal Sync',   desc: 'Συγχρονισμός με Airbnb/Booking, manual blocks' },
    en: { title: 'Calendar & iCal Sync',      desc: 'Sync with Airbnb/Booking, manual blocks' },
  },
  bookings: {
    el: { title: 'Κρατήσεις',                 desc: 'Direct + συγχρονισμένες, πληρωμές' },
    en: { title: 'Bookings',                  desc: 'Direct + synced reservations, payments' },
  },
  messages: {
    el: { title: 'Ενοποιημένα Μηνύματα',      desc: 'Inbox από όλα τα κανάλια σε ένα UI' },
    en: { title: 'Unified Messages',          desc: 'All-channel inbox in one place' },
  },
  pricing: {
    el: { title: 'Κανόνες Τιμολόγησης',       desc: 'Εποχιακές, Σ/Κ, εκπτώσεις, last-minute' },
    en: { title: 'Pricing Rules',             desc: 'Seasonal, weekend, discounts, last-minute' },
  },
  automations: {
    el: { title: 'Αυτοματισμοί',              desc: 'Templates + triggers σε 6 γλώσσες' },
    en: { title: 'Automations',               desc: 'Templates + triggers in 6 languages' },
  },
  tasks: {
    el: { title: 'Καθαριότητα & Εργασίες',    desc: 'Scheduling, συνεργάτες, ιστορικό' },
    en: { title: 'Cleaning & Tasks',          desc: 'Scheduling, vendors, history' },
  },
  vendors: {
    el: { title: 'Συνεργάτες',                desc: 'Καθαριστές, τεχνικοί, property mgrs' },
    en: { title: 'Vendors',                   desc: 'Cleaners, handymen, property mgrs' },
  },
  finance: {
    el: { title: 'Οικονομικά',                desc: 'Έσοδα, ΑΜΑ, ΦΠΑ, αναφορές' },
    en: { title: 'Finance',                   desc: 'Revenue, taxes, reports' },
  },
  settings: {
    el: { title: 'Ρυθμίσεις PMS',             desc: 'Πολιτικές κράτησης, Stripe, tax info' },
    en: { title: 'PMS Settings',              desc: 'Booking policies, Stripe, tax info' },
  },
};

const ACCENT_CLASSES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  sky:     { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     icon: 'text-sky-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-600' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  icon: 'text-violet-600' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: 'text-amber-600' },
  fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200', icon: 'text-fuchsia-600' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    icon: 'text-rose-600' },
  teal:    { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    icon: 'text-teal-600' },
  slate:   { bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200',   icon: 'text-slate-600' },
};

export default function PMSCommandCenterPage() {
  const locale = useLocale();
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [stats, setStats] = useState<PmsStats>({
    bookingsTotal: 0, bookingsUpcoming: 0, messagesUnread: 0,
    tasksPending: 0, icalFeeds: 0, hasStripe: false, hasSettings: false,
  });
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [pmsEnabled, setPmsEnabled] = useState(true);
  const [togglingPms, setTogglingPms] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setOwnerId(user.id);

      // Detect admin role — admins see platform-wide stats
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      const admin = profile?.role === 'admin';
      setIsAdminUser(admin);

      // Build queries — RLS still enforces owner scope for non-admins,
      // but for admins we skip the .eq('owner_id', …) filter so the
      // aggregate counts reflect every owner.
      // (Generic helper caused "type instantiation is excessively deep"
      //  with Supabase's inferred types — inline ternaries are simpler.)
      const listingsQ = admin
        ? supabase.from('listings').select('id, slug, title_el, title_en, location_name, is_active, is_closed').order('created_at', { ascending: false }).limit(100)
        : supabase.from('listings').select('id, slug, title_el, title_en, location_name, is_active, is_closed').eq('owner_id', user.id).order('created_at', { ascending: false });

      const bookingsQ = admin
        ? supabase.from('pms_bookings').select('id, check_in', { count: 'exact' })
        : supabase.from('pms_bookings').select('id, check_in', { count: 'exact' }).eq('owner_id', user.id);

      const messagesQ = admin
        ? supabase.from('pms_messages').select('id', { count: 'exact', head: true }).eq('direction', 'inbound').is('read_at', null)
        : supabase.from('pms_messages').select('id', { count: 'exact', head: true }).eq('direction', 'inbound').is('read_at', null).eq('owner_id', user.id);

      const tasksQ = admin
        ? supabase.from('pms_tasks').select('id', { count: 'exact', head: true }).eq('status', 'pending')
        : supabase.from('pms_tasks').select('id', { count: 'exact', head: true }).eq('status', 'pending').eq('owner_id', user.id);

      const feedsQ = admin
        ? supabase.from('pms_ical_feeds').select('id', { count: 'exact', head: true }).eq('active', true)
        : supabase.from('pms_ical_feeds').select('id', { count: 'exact', head: true }).eq('active', true).eq('owner_id', user.id);

      const [listingsRes, bookingsRes, messagesRes, tasksRes, feedsRes, settingsRes] = await Promise.all([
        listingsQ,
        bookingsQ,
        messagesQ,
        tasksQ,
        feedsQ,
        // Admin doesn't have personal owner_settings — skip the per-user lookup
        admin
          ? Promise.resolve({ data: null })
          : supabase.from('pms_owner_settings').select('stripe_onboarded, afm, ama_number, pms_enabled').eq('owner_id', user.id).maybeSingle(),
      ]);

      const today = new Date().toISOString().slice(0, 10);
      const upcoming = (bookingsRes.data || []).filter(b => (b as { check_in: string }).check_in >= today).length;

      const settings = settingsRes.data as OwnerSettingsRow | null;
      setListings((listingsRes.data || []) as ListingRow[]);
      setStats({
        bookingsTotal:    bookingsRes.count || 0,
        bookingsUpcoming: upcoming,
        messagesUnread:   messagesRes.count || 0,
        tasksPending:     tasksRes.count || 0,
        icalFeeds:        feedsRes.count || 0,
        hasStripe:        !!settings?.stripe_onboarded,
        hasSettings:      !!(settings?.afm || settings?.ama_number),
      });
      // pms_enabled defaults to true (new column; row may pre-date migration 039)
      setPmsEnabled(settings?.pms_enabled !== false);
      setLoading(false);
    })();
  }, []);

  async function togglePms() {
    if (!ownerId || togglingPms) return;
    const next = !pmsEnabled;
    // Confirm the destructive direction (turning OFF) — going back ON is harmless.
    if (!next) {
      const msg = locale === 'el'
        ? 'Σίγουρα; Θα σταματήσουν ΟΛΕΣ οι νέες κρατήσεις από τη δημόσια σελίδα μέχρι να το ενεργοποιήσεις ξανά.'
        : 'Are you sure? ALL new bookings from the public booking page will stop until you re-enable.';
      if (!window.confirm(msg)) return;
    }
    setTogglingPms(true);
    const supabase = createClient();
    // upsert so it works even if the row doesn't exist yet for this owner.
    const { error } = await supabase
      .from('pms_owner_settings')
      .upsert({ owner_id: ownerId, pms_enabled: next }, { onConflict: 'owner_id' });
    if (error) {
      alert((locale === 'el' ? 'Σφάλμα: ' : 'Error: ') + error.message);
    } else {
      setPmsEnabled(next);
    }
    setTogglingPms(false);
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  }

  const setupSteps = [
    { done: stats.hasSettings, label: locale === 'el' ? 'Φορολογικά στοιχεία (ΑΜΑ, ΑΦΜ)' : 'Tax info (ΑΜΑ, AFM)', href: '/dashboard/pms/settings' },
    { done: stats.hasStripe,   label: locale === 'el' ? 'Σύνδεση Stripe για πληρωμές' : 'Connect Stripe for payments', href: '/dashboard/pms/settings' },
    { done: stats.icalFeeds > 0, label: locale === 'el' ? 'iCal sync με Airbnb/Booking' : 'iCal sync with Airbnb/Booking', href: '/dashboard/pms/calendar' },
    { done: false, label: locale === 'el' ? 'Template καλωσορίσματος' : 'Welcome message template', href: '/dashboard/pms/automations' },
    { done: false, label: locale === 'el' ? 'Κανόνες τιμολόγησης σεζόν' : 'Seasonal pricing rules', href: '/dashboard/pms/pricing' },
  ];
  const completedSteps = setupSteps.filter(s => s.done).length;

  return (
    <div className="space-y-7">
      {/* ADMIN BANNER */}
      {isAdminUser && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-4 text-white shadow-lg shadow-orange-500/20 flex items-start gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 shrink-0">
            <Zap className="w-5 h-5" fill="currentColor" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold">
              {locale === 'el' ? 'Admin mode · platform-wide view' : 'Admin mode · platform-wide view'}
            </div>
            <div className="text-xs text-white/90 leading-relaxed mt-0.5">
              {locale === 'el'
                ? 'Βλέπεις συγκεντρωτικά στατιστικά από όλα τα καταλύματα του ChalkidikiHub. Όταν ενεργείς σε κάποιο module, η ενέργεια αποδίδεται στον πραγματικό owner.'
                : 'You see aggregate stats across every ChalkidikiHub property. When you act inside a module, the action is attributed to the real owner.'}
            </div>
          </div>
        </div>
      )}

      {/* PMS KILL SWITCH — owners only (admins don't have personal settings) */}
      {!isAdminUser && (
        <div
          className={`rounded-2xl p-5 border-2 shadow-sm transition-colors ${
            pmsEnabled
              ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200'
              : 'bg-gradient-to-br from-rose-50 to-white border-rose-300 ring-2 ring-rose-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${
                pmsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {pmsEnabled ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-bold text-slate-900">
                  {locale === 'el' ? 'Κατάσταση PMS' : 'PMS status'}
                </h2>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    pmsEnabled ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                  }`}
                >
                  {pmsEnabled
                    ? (locale === 'el' ? 'Ενεργό' : 'On')
                    : (locale === 'el' ? 'Ανενεργό' : 'Off')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pmsEnabled
                  ? (locale === 'el'
                      ? 'Όλα τα καταλύματά σου δέχονται νέες κρατήσεις από τη δημόσια σελίδα.'
                      : 'All your properties accept new bookings from the public booking page.')
                  : (locale === 'el'
                      ? 'ΟΛΕΣ οι νέες κρατήσεις είναι μπλοκαρισμένες. Το ιστορικό και τα υπόλοιπα εργαλεία PMS παραμένουν διαθέσιμα.'
                      : 'ALL new bookings are blocked. Your PMS history and tools remain accessible.')}
              </p>
            </div>
            <button
              type="button"
              onClick={togglePms}
              disabled={togglingPms}
              aria-pressed={pmsEnabled}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 ${
                pmsEnabled
                  ? 'bg-white text-rose-700 border-2 border-rose-300 hover:bg-rose-50'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {togglingPms ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : pmsEnabled ? (
                <PowerOff className="w-4 h-4" />
              ) : (
                <Power className="w-4 h-4" />
              )}
              {pmsEnabled
                ? (locale === 'el' ? 'Απενεργοποίηση' : 'Turn off')
                : (locale === 'el' ? 'Ενεργοποίηση' : 'Turn on')}
            </button>
          </div>
        </div>
      )}

      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700 rounded-3xl p-8 md:p-10 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
            <Zap className="w-3.5 h-3.5" fill="currentColor" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase">PMS · Beta</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {locale === 'el' ? 'Command Center' : 'Command Center'}
          </h1>
          <p className="text-white/85 text-sm md:text-base max-w-2xl leading-relaxed">
            {locale === 'el'
              ? 'Διαχειρίσου όλα τα καταλύματά σου από ένα σημείο. Ημερολόγια, κρατήσεις, μηνύματα, τιμολόγηση, καθαριότητα — όλα μαζί.'
              : 'Run every property from one place. Calendars, bookings, messages, pricing, cleaning — all in one.'}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-white/70">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20">€</span>
            {locale === 'el'
              ? '0% προμήθεια · Smoobu/Hostaway χρεώνουν €20-50/μήνα'
              : '0% commission · Smoobu/Hostaway charge €20-50/month'}
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={ClipboardList} label={locale === 'el' ? 'Επόμενες κρατήσεις' : 'Upcoming bookings'} value={stats.bookingsUpcoming} />
        <StatCard icon={Inbox}         label={locale === 'el' ? 'Αδιάβαστα μηνύματα' : 'Unread messages'}   value={stats.messagesUnread} accent="violet" />
        <StatCard icon={Wrench}        label={locale === 'el' ? 'Εργασίες pending' : 'Pending tasks'}       value={stats.tasksPending}   accent="rose" />
        <StatCard icon={CalendarDays}  label={locale === 'el' ? 'Ενεργά iCal feeds' : 'Active iCal feeds'}   value={stats.icalFeeds}      accent="sky" />
      </div>

      {/* SETUP CHECKLIST — owners only; admins don't have personal settings */}
      {!isAdminUser && <section className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              {locale === 'el' ? 'Βήματα ρύθμισης PMS' : 'PMS setup steps'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {locale === 'el'
                ? `${completedSteps}/${setupSteps.length} ολοκληρωμένα — κάθε βήμα ξεκλειδώνει και νέες δυνατότητες`
                : `${completedSteps}/${setupSteps.length} completed — each step unlocks more capability`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {setupSteps.map((s, i) => (
              <span key={i} className={`h-1.5 w-6 rounded-full ${s.done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {setupSteps.map((step, i) => (
            <Link
              key={i}
              href={step.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors ${
                step.done
                  ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50'
                  : 'bg-white border-slate-200 hover:border-violet-300 hover:bg-violet-50/40'
              }`}
            >
              {step.done
                ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                : <Circle className="w-5 h-5 text-slate-300 shrink-0" />
              }
              <span className={`flex-1 text-sm ${step.done ? 'text-slate-600 line-through' : 'text-slate-800 font-medium'}`}>
                {step.label}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </Link>
          ))}
        </div>
      </section>}

      {/* MODULES GRID */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">
          {locale === 'el' ? 'Λειτουργικά modules' : 'Modules'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {MODULES.map(m => {
            const labels = MODULE_LABELS[m.key][locale] || MODULE_LABELS[m.key].en;
            const a = ACCENT_CLASSES[m.accent];
            return (
              <Link
                key={m.key}
                href={m.href}
                className={`group p-4 rounded-2xl border-2 ${a.border} ${a.bg} hover:shadow-lg hover:-translate-y-0.5 transition-all`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 ${a.icon} mb-3`}>
                  <m.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{labels.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{labels.desc}</p>
                <div className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${a.text} group-hover:gap-2 transition-all`}>
                  {locale === 'el' ? 'Άνοιγμα' : 'Open'}
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* LISTINGS MINI-LIST */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            {isAdminUser
              ? (locale === 'el' ? 'Όλα τα καταλύματα' : 'All properties')
              : (locale === 'el' ? 'Τα καταλύματά σου' : 'Your properties')}
            <span className="text-xs font-normal text-slate-400">({listings.length})</span>
          </h2>
          <Link href="/dashboard/listings" className="text-xs font-semibold text-violet-700 hover:text-violet-800 inline-flex items-center gap-1">
            {locale === 'el' ? 'Όλα' : 'See all'} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-500">
            {locale === 'el' ? 'Κανένα κατάλυμα ακόμα — πρόσθεσε το πρώτο σου για να ενεργοποιηθεί το PMS.' : 'No properties yet — add your first to activate the PMS.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {listings.slice(0, 6).map(l => {
              const title = l.title_el || l.title_en || l.slug;
              return (
                <div key={l.id} className="py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{title}</div>
                    <div className="text-xs text-slate-500 truncate">{l.location_name || '—'}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {l.is_closed && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold"><AlertCircle className="w-3 h-3" />{locale === 'el' ? 'Κλειστό' : 'Closed'}</span>}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${l.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {l.is_active ? (locale === 'el' ? 'Ενεργό' : 'Active') : (locale === 'el' ? 'Draft' : 'Draft')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, accent = 'emerald',
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number | string;
  accent?: 'emerald' | 'violet' | 'rose' | 'sky';
}) {
  const accents: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    violet:  'bg-violet-50  text-violet-600',
    rose:    'bg-rose-50    text-rose-600',
    sky:     'bg-sky-50     text-sky-600',
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${accents[accent]} mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
