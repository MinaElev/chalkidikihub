'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ClipboardList, ArrowLeft, Plus, Search, Loader2, AlertCircle,
  CalendarDays, Users, Home, Euro, Zap, Filter, User, Mail, Phone,
  TrendingUp, LogIn, LogOut, Globe, Ban, Clock, CheckCircle2,
} from 'lucide-react';

interface Listing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

interface Booking {
  id: string;
  listing_id: string;
  status: 'inquiry' | 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'blocked';
  source: 'direct' | 'airbnb' | 'booking' | 'vrbo' | 'manual' | 'blocked' | 'other';
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  guest_country: string | null;
  num_guests: number | null;
  check_in: string;
  check_out: string;
  currency: string | null;
  total_amount: number | null;
  payment_status: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded' | 'na' | null;
  block_reason: string | null;
  created_at: string;
}

const STATUS_META: Record<Booking['status'], { el: string; en: string; pillClass: string; icon: typeof Clock }> = {
  inquiry:      { el: 'Ερώτημα',     en: 'Inquiry',     pillClass: 'bg-slate-100 text-slate-700',   icon: Clock },
  pending:      { el: 'Εκκρεμεί',    en: 'Pending',     pillClass: 'bg-amber-100 text-amber-800',   icon: Clock },
  confirmed:    { el: 'Επιβεβαιωμένη', en: 'Confirmed', pillClass: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  checked_in:   { el: 'Έχει φτάσει', en: 'Checked-in',  pillClass: 'bg-sky-100 text-sky-800',       icon: LogIn },
  checked_out:  { el: 'Έφυγε',       en: 'Checked-out', pillClass: 'bg-slate-200 text-slate-700',   icon: LogOut },
  cancelled:    { el: 'Ακυρώθηκε',   en: 'Cancelled',   pillClass: 'bg-rose-100 text-rose-800',     icon: Ban },
  blocked:      { el: 'Blocked',     en: 'Blocked',     pillClass: 'bg-slate-300 text-slate-800',   icon: Ban },
};

const SOURCE_META: Record<Booking['source'], { label: string; color: string }> = {
  direct:   { label: 'Direct',       color: 'bg-emerald-500' },
  airbnb:   { label: 'Airbnb',       color: 'bg-rose-500' },
  booking:  { label: 'Booking.com',  color: 'bg-blue-600' },
  vrbo:     { label: 'VRBO',         color: 'bg-amber-500' },
  manual:   { label: 'Manual',       color: 'bg-slate-500' },
  blocked:  { label: 'Block',        color: 'bg-slate-700' },
  other:    { label: 'Other',        color: 'bg-violet-500' },
};

export default function PmsBookingsPage() {
  const locale = useLocale();
  const el = locale === 'el';

  const t = {
    back: el ? 'Πίσω στο Command Center' : 'Back to Command Center',
    pageTitle: el ? 'Κρατήσεις' : 'Bookings',
    pageSub: el
      ? 'Όλες οι κρατήσεις σε ένα μέρος — direct, channels, manual. 0% προμήθεια.'
      : 'Every reservation in one place — direct, channels, manual. 0% commission.',
    newBooking: el ? 'Νέα κράτηση' : 'New booking',

    statsUpcoming: el ? 'Έρχονται' : 'Upcoming',
    statsUpcomingSub: el ? 'check-in στις επόμενες 7 μέρες' : 'check-in in next 7 days',
    statsCheckedIn: el ? 'Τώρα στο κατάλυμα' : 'Currently staying',
    statsCheckedInSub: el ? 'ενεργοί guests' : 'active guests',
    statsRevenue: el ? 'Έσοδα μήνα' : 'Month revenue',
    statsRevenueSub: el ? 'confirmed + in-stay' : 'confirmed + in-stay',
    statsTotal: el ? 'Σύνολο' : 'Total',
    statsTotalSub: el ? 'όλες οι κρατήσεις' : 'all bookings',

    filterAll: el ? 'Όλα' : 'All',
    filterListing: el ? 'Κατάλυμα' : 'Listing',
    filterListingAll: el ? 'Όλα τα καταλύματα' : 'All listings',
    filterSearch: el ? 'Όνομα, email ή τηλέφωνο…' : 'Name, email or phone…',

    empty: el ? 'Δεν υπάρχουν κρατήσεις' : 'No bookings yet',
    emptySub: el
      ? 'Οι κρατήσεις από το booking engine σου θα εμφανιστούν εδώ. Μέχρι τότε, μπορείς να προσθέσεις manual κρατήσεις (τηλέφωνο, email, walk-in).'
      : "Bookings from your booking engine will show up here. Until then, you can add manual bookings (phone, email, walk-in).",
    emptyFiltered: el ? 'Καμία κράτηση με αυτά τα φίλτρα.' : 'No bookings match these filters.',
    clearFilters: el ? 'Καθάρισμα φίλτρων' : 'Clear filters',

    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    nights: el ? 'νύχτες' : 'nights',
    night: el ? 'νύχτα' : 'night',
    guests: el ? 'άτομα' : 'guests',
    guest: el ? 'άτομο' : 'guest',
    unknownGuest: el ? 'Χωρίς όνομα' : 'No name',
    untitledListing: el ? 'Άτιτλο' : 'Untitled',

    paymentUnpaid: el ? 'Απλήρωτο' : 'Unpaid',
    paymentDeposit: el ? 'Προκαταβολή' : 'Deposit',
    paymentFull: el ? 'Εξοφλημένο' : 'Paid',
    paymentRefunded: el ? 'Επιστροφή' : 'Refunded',
  };

  const statusOptions: Array<{ key: 'all' | Booking['status']; label: string }> = [
    { key: 'all',         label: t.filterAll },
    { key: 'inquiry',     label: STATUS_META.inquiry[el ? 'el' : 'en'] },
    { key: 'pending',     label: STATUS_META.pending[el ? 'el' : 'en'] },
    { key: 'confirmed',   label: STATUS_META.confirmed[el ? 'el' : 'en'] },
    { key: 'checked_in',  label: STATUS_META.checked_in[el ? 'el' : 'en'] },
    { key: 'checked_out', label: STATUS_META.checked_out[el ? 'el' : 'en'] },
    { key: 'cancelled',   label: STATUS_META.cancelled[el ? 'el' : 'en'] },
  ];

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all');
  const [listingFilter, setListingFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) {
          setLoadError(authErr?.message || 'Not signed in');
          return;
        }

        const [lRes, bRes] = await Promise.all([
          supabase.from('listings')
            .select('id, slug, title_el, title_en')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('pms_bookings')
            .select('*')
            .eq('owner_id', user.id)
            .order('check_in', { ascending: false })
            .limit(500),
        ]);

        if (lRes.error) { setLoadError(lRes.error.message); return; }
        if (bRes.error) { setLoadError(bRes.error.message); return; }

        setListings(lRes.data || []);
        setBookings(bRes.data || []);
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
    const q = search.trim().toLowerCase();
    return bookings.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (listingFilter !== 'all' && b.listing_id !== listingFilter) return false;
      if (q) {
        const hay = `${b.guest_name || ''} ${b.guest_email || ''} ${b.guest_phone || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, listingFilter, search]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in7 = new Date(today);
    in7.setDate(in7.getDate() + 7);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let upcoming = 0;
    let checkedIn = 0;
    let revenue = 0;
    let active = 0;

    for (const b of bookings) {
      if (b.status === 'cancelled' || b.status === 'blocked') continue;
      active++;
      const ci = new Date(b.check_in);
      const co = new Date(b.check_out);
      ci.setHours(0, 0, 0, 0);
      co.setHours(0, 0, 0, 0);

      if (b.status === 'checked_in' || (b.status === 'confirmed' && ci <= today && co > today)) {
        checkedIn++;
      }
      if (ci >= today && ci <= in7 && (b.status === 'confirmed' || b.status === 'pending')) {
        upcoming++;
      }
      if (ci <= monthEnd && co >= monthStart && (b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'checked_out')) {
        revenue += Number(b.total_amount || 0);
      }
    }
    return { upcoming, checkedIn, revenue, total: active };
  }, [bookings]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  }

  const hasFilters = statusFilter !== 'all' || listingFilter !== 'all' || search.trim();

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                <Zap className="w-3 h-3" fill="currentColor" /> PMS
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.pageTitle}</h1>
              <p className="text-white/80 text-sm leading-relaxed max-w-xl">{t.pageSub}</p>
            </div>
          </div>
          <Link
            href="/dashboard/pms/bookings/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl shadow-lg shadow-black/10 transition-colors"
          >
            <Plus className="w-4 h-4" /> {t.newBooking}
          </Link>
        </div>
      </header>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.loadError}: <span className="font-mono text-xs">{loadError}</span></span>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={CalendarDays} color="sky"
          label={t.statsUpcoming} value={String(stats.upcoming)} sub={t.statsUpcomingSub}
        />
        <StatCard
          icon={LogIn} color="emerald"
          label={t.statsCheckedIn} value={String(stats.checkedIn)} sub={t.statsCheckedInSub}
        />
        <StatCard
          icon={TrendingUp} color="amber"
          label={t.statsRevenue} value={`€${Math.round(stats.revenue).toLocaleString('el-GR')}`} sub={t.statsRevenueSub}
        />
        <StatCard
          icon={ClipboardList} color="violet"
          label={t.statsTotal} value={String(stats.total)} sub={t.statsTotalSub}
        />
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold">{el ? 'Φίλτρα' : 'Filters'}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map(opt => (
            <button key={opt.key}
              onClick={() => setStatusFilter(opt.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                statusFilter === opt.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <label className="relative block">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={listingFilter}
              onChange={e => setListingFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white appearance-none cursor-pointer focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
              <option value="all">{t.filterListingAll}</option>
              {listings.map(l => (
                <option key={l.id} value={l.id}>
                  {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
                </option>
              ))}
            </select>
          </label>
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.filterSearch}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </div>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 mb-3">
            <ClipboardList className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {hasFilters ? t.emptyFiltered : t.empty}
          </h3>
          {!hasFilters && <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">{t.emptySub}</p>}
          {hasFilters ? (
            <button
              onClick={() => { setStatusFilter('all'); setListingFilter('all'); setSearch(''); }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              {t.clearFilters}
            </button>
          ) : (
            <Link
              href="/dashboard/pms/bookings/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm">
              <Plus className="w-4 h-4" /> {t.newBooking}
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(b => {
            const listing = listingMap.get(b.listing_id);
            const listingTitle = listing ? ((el ? listing.title_el : listing.title_en) || listing.title_el || listing.title_en || listing.slug) : t.untitledListing;
            const statusMeta = STATUS_META[b.status];
            const StatusIcon = statusMeta.icon;
            const ci = new Date(b.check_in);
            const co = new Date(b.check_out);
            const nights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86400000));
            const sourceMeta = SOURCE_META[b.source] || SOURCE_META.other;
            const paymentLabel =
              b.payment_status === 'fully_paid' ? t.paymentFull
              : b.payment_status === 'deposit_paid' ? t.paymentDeposit
              : b.payment_status === 'refunded' ? t.paymentRefunded
              : b.payment_status === 'na' ? null
              : t.paymentUnpaid;
            const paymentPillClass =
              b.payment_status === 'fully_paid' ? 'bg-emerald-100 text-emerald-800'
              : b.payment_status === 'deposit_paid' ? 'bg-amber-100 text-amber-800'
              : b.payment_status === 'refunded' ? 'bg-slate-200 text-slate-700'
              : 'bg-rose-50 text-rose-700';

            return (
              <Link
                key={b.id}
                href={`/dashboard/pms/bookings/${b.id}`}
                className="block bg-white border border-slate-200 rounded-2xl p-4 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex flex-col items-center justify-center min-w-[60px] bg-slate-50 rounded-xl px-3 py-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {ci.toLocaleDateString(el ? 'el-GR' : 'en-US', { month: 'short' })}
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 leading-none">
                      {ci.getDate()}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      → {co.getDate()} {co.getMonth() !== ci.getMonth() && co.toLocaleDateString(el ? 'el-GR' : 'en-US', { month: 'short' })}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusMeta.pillClass}`}>
                        <StatusIcon className="w-3 h-3" /> {statusMeta[el ? 'el' : 'en']}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                        <span className={`w-1.5 h-1.5 rounded-full ${sourceMeta.color}`} /> {sourceMeta.label}
                      </span>
                      {paymentLabel && (
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${paymentPillClass}`}>
                          {paymentLabel}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {b.status === 'blocked' ? (b.block_reason || (el ? 'Μπλοκαρισμένες μέρες' : 'Blocked dates')) : (b.guest_name || t.unknownGuest)}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Home className="w-3 h-3" /> {listingTitle}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {nights} {nights === 1 ? t.night : t.nights}
                      </span>
                      {b.num_guests && b.num_guests > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3" /> {b.num_guests} {b.num_guests === 1 ? t.guest : t.guests}
                        </span>
                      )}
                      {b.guest_country && (
                        <span className="inline-flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {b.guest_country}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {b.total_amount && Number(b.total_amount) > 0 ? (
                      <>
                        <div className="text-lg font-extrabold text-slate-900 leading-none">
                          €{Number(b.total_amount).toLocaleString('el-GR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{b.currency || 'EUR'}</div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400">—</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const STAT_COLOR: Record<string, { bg: string; text: string; ring: string }> = {
  sky:     { bg: 'bg-sky-100',     text: 'text-sky-700',     ring: 'ring-sky-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  amber:   { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-200' },
  violet:  { bg: 'bg-violet-100',  text: 'text-violet-700',  ring: 'ring-violet-200' },
};

function StatCard({
  icon: Icon, color, label, value, sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: keyof typeof STAT_COLOR;
  label: string; value: string; sub: string;
}) {
  const c = STAT_COLOR[color];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${c.bg} ${c.text} ring-2 ${c.ring}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">{label}</div>
      </div>
      <div className="text-2xl font-extrabold text-slate-900 leading-none">{value}</div>
      <div className="text-[11px] text-slate-500 mt-1 truncate">{sub}</div>
    </div>
  );
}
