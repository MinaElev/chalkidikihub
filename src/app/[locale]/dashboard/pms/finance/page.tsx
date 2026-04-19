'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  TrendingUp, Loader2, AlertCircle, ArrowLeft, Zap,
  Euro, BedDouble, Percent, CalendarRange, Building2, TrendingDown,
} from 'lucide-react';

type Source = 'direct' | 'airbnb' | 'booking' | 'vrbo' | 'manual' | 'blocked' | 'other';
type PaymentStatus = 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded' | 'na';

interface BookingRow {
  id: string;
  listing_id: string;
  status: string;
  source: Source;
  check_in: string;
  check_out: string;
  nightly_rate: number | null;
  cleaning_fee: number | null;
  taxes: number | null;
  total_amount: number | null;
  payment_status: PaymentStatus;
  guest_name: string | null;
  currency: string | null;
}

interface ListingLite {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  price_per_night: number | null;
}

const SOURCE_CLS: Record<Source, string> = {
  direct:  'bg-emerald-100 text-emerald-700',
  airbnb:  'bg-rose-100 text-rose-700',
  booking: 'bg-indigo-100 text-indigo-700',
  vrbo:    'bg-amber-100 text-amber-700',
  manual:  'bg-slate-100 text-slate-700',
  blocked: 'bg-slate-200 text-slate-600',
  other:   'bg-slate-100 text-slate-700',
};

export default function PmsFinancePage() {
  const locale = useLocale();
  const el = locale === 'el';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [listings, setListings] = useState<ListingLite[]>([]);

  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [listingFilter, setListingFilter] = useState<string>('all');

  const t = {
    back: el ? 'Πίσω στο PMS' : 'Back to PMS',
    title: el ? 'Οικονομικά' : 'Finance',
    sub: el
      ? 'Έσοδα, μέση τιμή νύχτας (ADR), πληρότητα (Occupancy) — ανά κατάλυμα, ανά μήνα, ανά source.'
      : 'Revenue, Average Daily Rate (ADR), Occupancy — per listing, per month, per source.',
    year: el ? 'Έτος' : 'Year',
    allListings: el ? 'Όλα τα καταλύματα' : 'All listings',
    revenue: el ? 'Έσοδα' : 'Revenue',
    adr: el ? 'Μέση τιμή / νύχτα' : 'ADR (€/night)',
    occupancy: el ? 'Πληρότητα' : 'Occupancy',
    nights: el ? 'Νύχτες' : 'Nights booked',
    bookingsLabel: el ? 'Κρατήσεις' : 'Bookings',
    unpaid: el ? 'Ανείσπρακτα' : 'Unpaid',
    monthly: el ? 'Έσοδα ανά μήνα' : 'Revenue by month',
    perListing: el ? 'Ανά κατάλυμα' : 'Per listing',
    perSource: el ? 'Ανά κανάλι' : 'Per channel',
    emptyTitle: el ? 'Χωρίς δεδομένα' : 'No data yet',
    emptyBody: el ? 'Δημιούργησε την πρώτη σου κράτηση για να ξεκινήσεις να βλέπεις νούμερα εδώ.' : 'Add your first booking to start seeing numbers here.',
    toBookings: el ? 'Στις κρατήσεις' : 'Go to bookings',
    errLoad: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    noBookingsInYear: el ? 'Χωρίς κρατήσεις για αυτό το έτος.' : 'No bookings for this year.',
    vsLastYear: el ? 'vs πέρυσι' : 'vs last year',
    months: el
      ? ['Ιαν','Φεβ','Μαρ','Απρ','Μαι','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ']
      : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    sourceNames: {
      direct:  el ? 'Direct' : 'Direct',
      airbnb:  'Airbnb',
      booking: 'Booking.com',
      vrbo:    'VRBO',
      manual:  el ? 'Χειροκίνητη' : 'Manual',
      blocked: el ? 'Μπλοκαρισμένο' : 'Blocked',
      other:   el ? 'Άλλο' : 'Other',
    } as Record<Source, string>,
  };

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setError(authErr?.message || 'Not signed in'); return; }

        const [lRes, bRes] = await Promise.all([
          supabase.from('listings')
            .select('id, slug, title_el, title_en, price_per_night')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('pms_bookings')
            .select('id, listing_id, status, source, check_in, check_out, nightly_rate, cleaning_fee, taxes, total_amount, payment_status, guest_name, currency')
            .eq('owner_id', user.id)
            .not('status', 'eq', 'cancelled')
            .not('source', 'eq', 'blocked')
            .order('check_in', { ascending: false })
            .limit(2000),
        ]);

        if (lRes.error) { setError(lRes.error.message); return; }
        if (bRes.error) { setError(bRes.error.message); return; }
        setListings(lRes.data || []);
        setRows(((bRes.data || []) as unknown) as BookingRow[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(now.getFullYear());
    for (const b of rows) {
      years.add(new Date(b.check_in).getFullYear());
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [rows, now]);

  const filteredByListing = useMemo(() => {
    return listingFilter === 'all' ? rows : rows.filter(r => r.listing_id === listingFilter);
  }, [rows, listingFilter]);

  const yearMetrics = useMemo(
    () => computeYearMetrics(filteredByListing, year, listings, listingFilter),
    [filteredByListing, year, listings, listingFilter]
  );
  const prevYearMetrics = useMemo(
    () => computeYearMetrics(filteredByListing, year - 1, listings, listingFilter),
    [filteredByListing, year, listings, listingFilter]
  );

  const perListing = useMemo(() => {
    const byListing = new Map<string, { revenue: number; nights: number; bookings: number }>();
    for (const b of filteredByListing) {
      const { nightsInYear, revenueInYear } = clipToYear(b, year);
      if (nightsInYear <= 0) continue;
      const cur = byListing.get(b.listing_id) || { revenue: 0, nights: 0, bookings: 0 };
      cur.revenue += revenueInYear;
      cur.nights += nightsInYear;
      cur.bookings += 1;
      byListing.set(b.listing_id, cur);
    }
    return Array.from(byListing.entries())
      .map(([id, m]) => ({ id, ...m }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredByListing, year]);

  const perSource = useMemo(() => {
    const bySource = new Map<Source, { revenue: number; bookings: number }>();
    for (const b of filteredByListing) {
      const { nightsInYear, revenueInYear } = clipToYear(b, year);
      if (nightsInYear <= 0) continue;
      const cur = bySource.get(b.source) || { revenue: 0, bookings: 0 };
      cur.revenue += revenueInYear;
      cur.bookings += 1;
      bySource.set(b.source, cur);
    }
    return Array.from(bySource.entries())
      .map(([src, m]) => ({ source: src, ...m }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredByListing, year]);

  const monthlyMax = Math.max(1, ...yearMetrics.monthly.map(m => m.revenue));
  const perSourceTotal = Math.max(1, perSource.reduce((s, x) => s + x.revenue, 0));

  const revDelta = prevYearMetrics.revenue > 0
    ? ((yearMetrics.revenue - prevYearMetrics.revenue) / prevYearMetrics.revenue) * 100
    : null;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
            <p className="text-white/85 text-sm leading-relaxed max-w-xl">{t.sub}</p>
          </div>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.year}</div>
            <select value={year} onChange={e => setYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1.5">{el ? 'Κατάλυμα' : 'Listing'}</div>
            <select value={listingFilter} onChange={e => setListingFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
              <option value="all">{t.allListings}</option>
              {listings.map(l => (
                <option key={l.id} value={l.id}>
                  {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.errLoad}: <span className="font-mono text-xs">{error}</span></span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
          <TrendingUp className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">{t.emptyTitle}</h3>
          <p className="text-sm text-slate-500 mb-4">{t.emptyBody}</p>
          <Link href="/dashboard/pms/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm">
            {t.toBookings}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard icon={Euro} color="emerald"
              label={t.revenue}
              value={`€${formatNumber(yearMetrics.revenue)}`}
              delta={revDelta}
              deltaLabel={t.vsLastYear}
            />
            <KpiCard icon={TrendingUp} color="sky"
              label={t.adr}
              value={`€${yearMetrics.adr.toFixed(0)}`}
            />
            <KpiCard icon={Percent} color="amber"
              label={t.occupancy}
              value={`${yearMetrics.occupancy.toFixed(1)}%`}
            />
            <KpiCard icon={BedDouble} color="violet"
              label={t.nights}
              value={String(yearMetrics.nights)}
              secondary={`${yearMetrics.bookingsCount} ${t.bookingsLabel.toLowerCase()}`}
            />
          </div>

          {yearMetrics.unpaid > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100 text-amber-700 ring-4 ring-amber-200 shrink-0">
                <CalendarRange className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-amber-900">{t.unpaid}: €{formatNumber(yearMetrics.unpaid)}</div>
                <div className="text-xs text-amber-800">{el ? 'Άθροισμα από bookings με payment_status ≠ fully_paid (που δεν είναι ακυρωμένα).' : 'Sum from bookings where payment_status ≠ fully_paid (non-cancelled).'}</div>
              </div>
            </div>
          )}

          <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-3">{t.monthly} · {year}</h2>
            {yearMetrics.revenue === 0 ? (
              <div className="text-sm text-slate-500 py-6 text-center">{t.noBookingsInYear}</div>
            ) : (
              <div className="space-y-2">
                {yearMetrics.monthly.map((m, idx) => {
                  const pct = monthlyMax > 0 ? (m.revenue / monthlyMax) * 100 : 0;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 text-xs font-semibold text-slate-600 shrink-0">{t.months[idx]}</div>
                      <div className="flex-1 h-7 bg-slate-100 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <div className="w-20 text-right text-xs font-semibold text-slate-800 shrink-0 tabular-nums">€{formatNumber(m.revenue)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" /> {t.perListing}
              </h2>
              {perListing.length === 0 ? (
                <div className="text-sm text-slate-500 py-6 text-center">{t.noBookingsInYear}</div>
              ) : (
                <ul className="space-y-2">
                  {perListing.map(row => {
                    const l = listings.find(x => x.id === row.id);
                    const name = l ? ((el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug) : row.id.slice(0, 8);
                    const adr = row.nights > 0 ? row.revenue / row.nights : 0;
                    const pct = yearMetrics.revenue > 0 ? (row.revenue / yearMetrics.revenue) * 100 : 0;
                    return (
                      <li key={row.id} className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-sm font-semibold text-slate-900 truncate">{name}</span>
                          <span className="text-sm font-bold text-emerald-700 tabular-nums shrink-0">€{formatNumber(row.revenue)}</span>
                        </div>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden mb-1.5">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span>{row.bookings} {t.bookingsLabel.toLowerCase()}</span>
                          <span>·</span>
                          <span>{row.nights} {el ? 'νύχτες' : 'nights'}</span>
                          <span>·</span>
                          <span>ADR €{adr.toFixed(0)}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> {t.perSource}
              </h2>
              {perSource.length === 0 ? (
                <div className="text-sm text-slate-500 py-6 text-center">{t.noBookingsInYear}</div>
              ) : (
                <ul className="space-y-2">
                  {perSource.map(row => {
                    const pct = (row.revenue / perSourceTotal) * 100;
                    return (
                      <li key={row.source} className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${SOURCE_CLS[row.source]}`}>
                            {t.sourceNames[row.source]}
                          </span>
                          <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">€{formatNumber(row.revenue)}</span>
                        </div>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden mb-1.5">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span>{row.bookings} {t.bookingsLabel.toLowerCase()}</span>
                          <span className="font-semibold tabular-nums">{pct.toFixed(1)}%</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function computeYearMetrics(
  bookings: BookingRow[],
  year: number,
  listings: ListingLite[],
  listingFilter: string,
): {
  revenue: number;
  adr: number;
  occupancy: number;
  nights: number;
  bookingsCount: number;
  unpaid: number;
  monthly: Array<{ month: number; revenue: number; nights: number }>;
} {
  const monthly: Array<{ month: number; revenue: number; nights: number }> =
    Array.from({ length: 12 }, (_, i) => ({ month: i, revenue: 0, nights: 0 }));
  let revenue = 0;
  let nights = 0;
  let unpaid = 0;
  const touchedBookings = new Set<string>();

  for (const b of bookings) {
    const ci = new Date(b.check_in);
    const co = new Date(b.check_out);
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year + 1, 0, 1);

    if (co <= yearStart || ci >= yearEnd) continue;

    const bookingNights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86_400_000));
    const nightly = computeNightlyEquivalent(b, bookingNights);

    const startDay = new Date(Math.max(ci.getTime(), yearStart.getTime()));
    const endDay = new Date(Math.min(co.getTime(), yearEnd.getTime()));

    for (let d = new Date(startDay); d < endDay; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() !== year) continue;
      const m = d.getMonth();
      monthly[m].revenue += nightly;
      monthly[m].nights += 1;
    }

    const clip = clipToYear(b, year);
    revenue += clip.revenueInYear;
    nights += clip.nightsInYear;
    touchedBookings.add(b.id);

    if (b.payment_status !== 'fully_paid' && b.payment_status !== 'refunded' && b.payment_status !== 'na') {
      unpaid += clip.revenueInYear;
    }
  }

  const adr = nights > 0 ? revenue / nights : 0;

  const selectedListings = listingFilter === 'all' ? listings : listings.filter(l => l.id === listingFilter);
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);
  const today = new Date();
  const effectiveEnd = today < yearEnd ? today : yearEnd;
  const availableDays = Math.max(0, Math.round((effectiveEnd.getTime() - yearStart.getTime()) / 86_400_000));
  const availableNights = availableDays * Math.max(1, selectedListings.length);
  const occupancy = availableNights > 0 ? (Math.min(nights, availableNights) / availableNights) * 100 : 0;

  return {
    revenue,
    adr,
    occupancy,
    nights,
    bookingsCount: touchedBookings.size,
    unpaid,
    monthly,
  };
}

function clipToYear(b: BookingRow, year: number): { nightsInYear: number; revenueInYear: number } {
  const ci = new Date(b.check_in);
  const co = new Date(b.check_out);
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);
  if (co <= yearStart || ci >= yearEnd) return { nightsInYear: 0, revenueInYear: 0 };

  const bookingNights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86_400_000));
  const clippedStart = new Date(Math.max(ci.getTime(), yearStart.getTime()));
  const clippedEnd = new Date(Math.min(co.getTime(), yearEnd.getTime()));
  const clippedNights = Math.max(0, Math.round((clippedEnd.getTime() - clippedStart.getTime()) / 86_400_000));

  const nightly = computeNightlyEquivalent(b, bookingNights);
  return { nightsInYear: clippedNights, revenueInYear: clippedNights * nightly };
}

function computeNightlyEquivalent(b: BookingRow, totalNights: number): number {
  const total = b.total_amount != null ? Number(b.total_amount) : null;
  if (total != null && total > 0 && totalNights > 0) {
    return total / totalNights;
  }
  const rate = b.nightly_rate != null ? Number(b.nightly_rate) : 0;
  return rate;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString('de-DE', { maximumFractionDigits: 0 });
}

function KpiCard({
  icon: Icon, color, label, value, delta, deltaLabel, secondary,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'sky' | 'amber' | 'violet';
  label: string;
  value: string;
  delta?: number | null;
  deltaLabel?: string;
  secondary?: string;
}) {
  const cls =
    color === 'emerald' ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
    : color === 'sky' ? 'bg-sky-100 text-sky-700 ring-sky-200'
    : color === 'amber' ? 'bg-amber-100 text-amber-700 ring-amber-200'
    : 'bg-violet-100 text-violet-700 ring-violet-200';
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
      <div className="flex items-start gap-2.5">
        <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ring-4 ${cls} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="text-xl font-bold text-slate-900 leading-tight tabular-nums">{value}</div>
          {delta != null && deltaLabel && (
            <div className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% <span className="text-slate-500 font-normal ml-0.5">{deltaLabel}</span>
            </div>
          )}
          {secondary && (
            <div className="text-[11px] text-slate-500">{secondary}</div>
          )}
        </div>
      </div>
    </div>
  );
}
