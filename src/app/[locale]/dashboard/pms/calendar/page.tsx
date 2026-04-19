'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  CalendarDays, Zap, ArrowLeft, Plus, RefreshCw, Trash2,
  Copy, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight,
  Loader2, X, Link2, Ban, ExternalLink, Info,
} from 'lucide-react';

interface Listing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  is_active: boolean;
  owner_id?: string;
  owner_email?: string | null;
}

interface Feed {
  id: string;
  listing_id: string;
  source: 'airbnb' | 'booking' | 'vrbo' | 'custom';
  label: string;
  import_url: string;
  active: boolean;
  last_synced_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
  events_imported: number | null;
}

interface Booking {
  id: string;
  listing_id: string;
  status: string;
  source: string;
  check_in: string;
  check_out: string;
  guest_name: string | null;
  block_reason: string | null;
  notes: string | null;
}

const SOURCE_COLORS: Record<string, { bg: string; border: string; dot: string; label: string }> = {
  airbnb:  { bg: 'bg-rose-100',    border: 'border-rose-400',    dot: 'bg-rose-500',    label: 'Airbnb' },
  booking: { bg: 'bg-blue-100',    border: 'border-blue-400',    dot: 'bg-blue-500',    label: 'Booking.com' },
  vrbo:    { bg: 'bg-amber-100',   border: 'border-amber-400',   dot: 'bg-amber-500',   label: 'VRBO' },
  direct:  { bg: 'bg-emerald-100', border: 'border-emerald-400', dot: 'bg-emerald-500', label: 'Direct' },
  manual:  { bg: 'bg-violet-100',  border: 'border-violet-400',  dot: 'bg-violet-500',  label: 'Manual' },
  blocked: { bg: 'bg-slate-200',   border: 'border-slate-400',   dot: 'bg-slate-600',   label: 'Blocked' },
  custom:  { bg: 'bg-teal-100',    border: 'border-teal-400',    dot: 'bg-teal-500',    label: 'Custom' },
  other:   { bg: 'bg-slate-100',   border: 'border-slate-300',   dot: 'bg-slate-400',   label: 'Other' },
};

const SITE_URL = 'https://chalkidikihub.gr';

type T = {
  back: string; pageTitle: string; pageSub: string;
  propertyLabel: string; monthToday: string;
  feeds: string; noFeedsTitle: string; noFeedsSub: string; addFeed: string;
  addFeedModalTitle: string; source: string; label: string; labelHint: string;
  importUrl: string; importUrlHint: string; cancel: string; save: string;
  syncNow: string; remove: string; lastSync: string; never: string;
  okStatus: string; errorStatus: string; pending: string;
  exportUrl: string; exportUrlHint: string; copy: string; copied: string;
  blockModalTitle: string; blockReason: string; blockReasonHint: string;
  blockFrom: string; blockTo: string; blockSave: string; unblock: string;
  eventDetailTitle: string; confirmRemoveFeed: string; confirmUnblock: string;
  selectListing: string; noListings: string; legend: string;
  viewLive: string; properties: string;
};

export default function PmsCalendarPage() {
  const locale = useLocale();
  const t: T = {
    el: {
      back: 'Command Center',
      pageTitle: 'Ημερολόγιο & iCal Sync',
      pageSub: 'Συγχρονισμός με Airbnb, Booking, VRBO · Manual blocks · Export URL',
      propertyLabel: 'Κατάλυμα',
      monthToday: 'Σήμερα',
      feeds: 'iCal Feeds',
      noFeedsTitle: 'Κανένα iCal feed ακόμα',
      noFeedsSub: 'Πρόσθεσε το Airbnb / Booking URL για να blockάρονται αυτόματα οι πιασμένες μέρες.',
      addFeed: 'Πρόσθεσε iCal',
      addFeedModalTitle: 'Πρόσθεσε iCal feed',
      source: 'Πηγή',
      label: 'Ετικέτα',
      labelHint: 'π.χ. "Amira House — Airbnb"',
      importUrl: 'iCal URL (.ics)',
      importUrlHint: 'Βρες το στο Airbnb → Calendar → Sync/Export · ή στο Booking extranet → Rates & Availability → Calendar sync',
      cancel: 'Άκυρο',
      save: 'Αποθήκευση',
      syncNow: 'Sync τώρα',
      remove: 'Αφαίρεση',
      lastSync: 'Τελευταίος συγχρονισμός',
      never: 'ποτέ',
      okStatus: 'OK',
      errorStatus: 'Σφάλμα',
      pending: 'Εκκρεμεί',
      exportUrl: 'Export URL',
      exportUrlHint: 'Κάνε paste αυτό στο Airbnb / Booking για να δουν τις κρατήσεις σου από το ChalkidikiHub.',
      copy: 'Copy',
      copied: 'Αντιγράφηκε!',
      blockModalTitle: 'Block ημερομηνιών',
      blockReason: 'Λόγος (προαιρετικά)',
      blockReasonHint: 'π.χ. "Συντήρηση", "Προσωπική χρήση", "Κλειστό σεζόν"',
      blockFrom: 'Από',
      blockTo: 'Μέχρι',
      blockSave: 'Block',
      unblock: 'Unblock',
      eventDetailTitle: 'Λεπτομέρειες',
      confirmRemoveFeed: 'Σίγουρα; Οι κρατήσεις από αυτό το feed θα ακυρωθούν.',
      confirmUnblock: 'Να ξεμπλοκαριστεί αυτή η περίοδος;',
      selectListing: 'Διάλεξε κατάλυμα...',
      noListings: 'Δεν έχεις listings ακόμα.',
      legend: 'Υπόμνημα',
      viewLive: 'Δες live',
      properties: 'καταλύματα',
    },
    en: {
      back: 'Command Center',
      pageTitle: 'Calendar & iCal Sync',
      pageSub: 'Sync with Airbnb, Booking, VRBO · Manual blocks · Export URL',
      propertyLabel: 'Property',
      monthToday: 'Today',
      feeds: 'iCal Feeds',
      noFeedsTitle: 'No iCal feeds yet',
      noFeedsSub: 'Add your Airbnb / Booking URL so booked dates are blocked automatically.',
      addFeed: 'Add iCal',
      addFeedModalTitle: 'Add iCal feed',
      source: 'Source',
      label: 'Label',
      labelHint: 'e.g. "Amira House — Airbnb"',
      importUrl: 'iCal URL (.ics)',
      importUrlHint: 'Find it in Airbnb → Calendar → Sync/Export · or Booking extranet → Rates & Availability → Calendar sync',
      cancel: 'Cancel',
      save: 'Save',
      syncNow: 'Sync now',
      remove: 'Remove',
      lastSync: 'Last sync',
      never: 'never',
      okStatus: 'OK',
      errorStatus: 'Error',
      pending: 'Pending',
      exportUrl: 'Export URL',
      exportUrlHint: 'Paste this into Airbnb / Booking so they see your ChalkidikiHub bookings.',
      copy: 'Copy',
      copied: 'Copied!',
      blockModalTitle: 'Block date range',
      blockReason: 'Reason (optional)',
      blockReasonHint: 'e.g. "Maintenance", "Personal use", "Off-season"',
      blockFrom: 'From',
      blockTo: 'To',
      blockSave: 'Block',
      unblock: 'Unblock',
      eventDetailTitle: 'Details',
      confirmRemoveFeed: 'Remove this feed? The bookings from it will be cancelled.',
      confirmUnblock: 'Unblock this period?',
      selectListing: 'Select property...',
      noListings: 'No listings yet.',
      legend: 'Legend',
      viewLive: 'View live',
      properties: 'properties',
    },
  }[locale === 'el' ? 'el' : 'en'];

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      const admin = profile?.role === 'admin';
      setIsAdminUser(admin);

      let q = supabase
        .from('listings')
        .select('id, slug, title_el, title_en, is_active, owner_id')
        .order('created_at', { ascending: false });
      if (!admin) q = q.eq('owner_id', user.id);
      const { data } = await q;
      setListings((data || []) as Listing[]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  }

  if (listings.length === 0) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-violet-700">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </Link>
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
          {t.noListings}
        </div>
      </div>
    );
  }

  const monthLabel = currentMonth.toLocaleDateString(locale === 'el' ? 'el-GR' : 'en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-violet-700">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      {/* HERO */}
      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-sky-600 via-cyan-600 to-blue-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.pageTitle}</h1>
            <p className="text-white/85 text-sm leading-relaxed">{t.pageSub}</p>
          </div>
        </div>
      </header>

      {isAdminUser && (
        <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-violet-500/20 flex items-start gap-3">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 shrink-0">
            <Zap className="w-5 h-5" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold mb-0.5">
              {locale === 'el' ? 'Admin mode · βλέπεις ΟΛΑ τα καταλύματα' : 'Admin mode · you see ALL listings'}
            </div>
            <div className="text-xs text-white/85 leading-relaxed">
              {locale === 'el'
                ? 'Ό,τι προσθέτεις/συγχρονίζεις αποδίδεται στον πραγματικό owner του καταλύματος. Για support & testing.'
                : 'Everything you add/sync is attributed to the real property owner. For support & testing.'}
            </div>
          </div>
        </div>
      )}

      {/* SHARED MONTH NAV + LEGEND */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm sticky top-2 z-20 backdrop-blur-sm bg-white/95">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600" aria-label="previous month">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base md:text-lg font-bold text-slate-900 capitalize min-w-[140px] md:min-w-[160px] text-center">{monthLabel}</h2>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600" aria-label="next month">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => {
              const d = new Date();
              setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
            }} className="ml-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-300">
              {t.monthToday}
            </button>
          </div>
          <div className="text-xs text-slate-500 tabular-nums">
            <span className="font-semibold text-slate-700">{listings.length}</span> {t.properties}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 pt-3 border-t border-slate-100">
          {Object.entries(SOURCE_COLORS).filter(([k]) => !['other'].includes(k)).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className={`inline-block w-2.5 h-2.5 rounded-sm ${v.dot}`} /> {v.label}
            </div>
          ))}
        </div>
      </div>

      {/* STACKED SECTIONS — one per listing */}
      <div className="space-y-8">
        {listings.map(listing => (
          <ListingCalendarSection
            key={listing.id}
            listing={listing}
            currentMonth={currentMonth}
            locale={locale}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Listing section — feeds + export + calendar for ONE listing
// ─────────────────────────────────────────────────────────────

function ListingCalendarSection({ listing, currentMonth, locale, t }: {
  listing: Listing;
  currentMonth: Date;
  locale: string;
  t: T;
}) {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [exportToken, setExportToken] = useState<string>('');
  const [syncingFeedId, setSyncingFeedId] = useState<string | null>(null);

  const [showAddFeed, setShowAddFeed] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockFrom, setBlockFrom] = useState<string>('');
  const [blockTo, setBlockTo] = useState<string>('');
  const [blockReason, setBlockReason] = useState('');
  const [copied, setCopied] = useState(false);
  const [eventDetail, setEventDetail] = useState<Booking | null>(null);

  useEffect(() => {
    refreshFeeds();
    fetch(`/api/pms/ical/export-url?listing_id=${listing.id}`)
      .then(r => r.json())
      .then(d => setExportToken(d.token || ''))
      .catch(() => setExportToken(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id]);

  useEffect(() => {
    refreshBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth.getTime(), listing.id]);

  async function refreshFeeds() {
    const res = await fetch(`/api/pms/ical/feeds?listing_id=${listing.id}`);
    if (res.ok) setFeeds(await res.json());
  }

  async function refreshBookings() {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const monthEnd   = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 1);
    const from = monthStart.toISOString().slice(0, 10);
    const to   = monthEnd.toISOString().slice(0, 10);
    const res = await fetch(`/api/pms/bookings?listing_id=${listing.id}&from=${from}&to=${to}&status=confirmed,pending,checked_in,blocked`);
    if (res.ok) setBookings(await res.json());
  }

  async function handleAddFeed(source: string, label: string, url: string) {
    const res = await fetch('/api/pms/ical/feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listing.id, source, label, import_url: url }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'error' }));
      alert('Error: ' + err.error);
      return;
    }
    const feed = await res.json();
    setShowAddFeed(false);
    await refreshFeeds();
    await handleSyncFeed(feed.id);
  }

  async function handleSyncFeed(feedId: string) {
    setSyncingFeedId(feedId);
    try {
      const res = await fetch('/api/pms/ical/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedId }),
      });
      const result = await res.json();
      await refreshFeeds();
      await refreshBookings();
      if (!result.ok) alert((locale === 'el' ? 'Σφάλμα sync: ' : 'Sync error: ') + (result.error || 'unknown'));
    } finally {
      setSyncingFeedId(null);
    }
  }

  async function handleRemoveFeed(feedId: string) {
    if (!confirm(t.confirmRemoveFeed)) return;
    await fetch(`/api/pms/ical/feeds/${feedId}`, { method: 'DELETE' });
    await refreshFeeds();
    await refreshBookings();
  }

  async function handleBlockSave() {
    if (!blockFrom || !blockTo) return;
    const res = await fetch('/api/pms/bookings/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listing.id, check_in: blockFrom, check_out: blockTo, block_reason: blockReason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'error' }));
      alert('Error: ' + err.error);
      return;
    }
    setShowBlockModal(false);
    setBlockReason('');
    await refreshBookings();
  }

  async function handleUnblock(bookingId: string) {
    if (!confirm(t.confirmUnblock)) return;
    await fetch(`/api/pms/bookings/block?id=${bookingId}`, { method: 'DELETE' });
    setEventDetail(null);
    await refreshBookings();
  }

  const exportUrl = exportToken
    ? `${SITE_URL}/api/pms/ical/export/${listing.id}/${exportToken}.ics`
    : '';

  function copyExport() {
    navigator.clipboard.writeText(exportUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const calendarDays = useMemo(() => buildMonth(currentMonth), [currentMonth]);
  const listingTitle = listing.title_el || listing.title_en || listing.slug;

  return (
    <section className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-4 md:p-5 shadow-sm">
      {/* Section header */}
      <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">{t.propertyLabel}</div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">{listingTitle}</h2>
        </div>
        <Link href={`/listings/${listing.slug}`} target="_blank"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sky-700 shrink-0 mt-1">
          <ExternalLink className="w-3.5 h-3.5" /> {t.viewLive}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
        {/* LEFT: feeds + export */}
        <aside className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-sky-500" /> {t.feeds}
                {feeds.length > 0 && <span className="text-xs font-normal text-slate-400">({feeds.length})</span>}
              </h3>
              <button
                onClick={() => setShowAddFeed(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5" /> {t.addFeed}
              </button>
            </div>

            {feeds.length === 0 ? (
              <div className="text-center py-4 px-2">
                <p className="text-xs font-medium text-slate-700">{t.noFeedsTitle}</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{t.noFeedsSub}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {feeds.map(f => <FeedCard key={f.id} feed={f} syncingId={syncingFeedId} onSync={handleSyncFeed} onRemove={handleRemoveFeed} t={t} />)}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 border-2 border-violet-200 rounded-2xl p-3.5">
            <h3 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-violet-500" /> {t.exportUrl}
            </h3>
            <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">{t.exportUrlHint}</p>
            {exportUrl ? (
              <div className="flex items-stretch gap-1.5">
                <input
                  readOnly
                  value={exportUrl}
                  onClick={e => (e.target as HTMLInputElement).select()}
                  className="flex-1 min-w-0 text-[11px] font-mono text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-2"
                />
                <button
                  onClick={copyExport}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg inline-flex items-center gap-1 transition-colors ${
                    copied ? 'bg-emerald-500 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'
                  }`}
                >
                  {copied ? <><CheckCircle2 className="w-3.5 h-3.5" /> {t.copied}</> : <><Copy className="w-3.5 h-3.5" /> {t.copy}</>}
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic"><Loader2 className="inline w-3 h-3 mr-1 animate-spin" /> generating…</div>
            )}
          </div>
        </aside>

        {/* RIGHT: calendar */}
        <main className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
          <div className="flex items-center justify-end mb-3">
            <button
              onClick={() => {
                setBlockFrom(new Date().toISOString().slice(0, 10));
                const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
                setBlockTo(tomorrow.toISOString().slice(0, 10));
                setShowBlockModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              <Ban className="w-3.5 h-3.5" /> {t.blockSave}
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1.5">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
              <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(day => {
              const iso = toIso(day.date);
              const events = bookings.filter(b => iso >= b.check_in && iso < b.check_out);
              const isToday = iso === toIso(new Date());
              return (
                <div
                  key={iso}
                  className={`relative min-h-[72px] md:min-h-[84px] rounded-lg p-1.5 flex flex-col transition-colors ${
                    !day.inMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white border border-slate-100 hover:border-slate-300'
                  } ${isToday ? 'ring-2 ring-sky-400 ring-offset-1' : ''}`}
                >
                  <div className={`text-xs font-semibold ${day.inMonth ? (isToday ? 'text-sky-700' : 'text-slate-800') : 'text-slate-300'}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5 mt-1 overflow-hidden">
                    {events.slice(0, 3).map(ev => {
                      const c = SOURCE_COLORS[ev.source] || SOURCE_COLORS.other;
                      const isStart = ev.check_in === iso;
                      const isEnd = ev.check_out === nextDay(iso);
                      return (
                        <button
                          key={ev.id}
                          onClick={() => setEventDetail(ev)}
                          className={`text-[10px] font-medium text-left px-1.5 py-0.5 truncate border-l-2 ${c.bg} ${c.border} hover:brightness-95 ${
                            isStart ? 'rounded-l' : ''
                          } ${isEnd ? 'rounded-r' : ''}`}
                          title={ev.guest_name || ev.block_reason || c.label}
                        >
                          {isStart ? (ev.guest_name || ev.block_reason || c.label).slice(0, 14) : '·'}
                        </button>
                      );
                    })}
                    {events.length > 3 && (
                      <div className="text-[9px] text-slate-400 px-1">+{events.length - 3}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* MODALS */}
      {showAddFeed && (
        <AddFeedModal
          t={t}
          onCancel={() => setShowAddFeed(false)}
          onSubmit={handleAddFeed}
        />
      )}

      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ban className="w-5 h-5 text-slate-500" /> {t.blockModalTitle}
              </h3>
              <button onClick={() => setShowBlockModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="mb-4 text-xs text-slate-500">
              {t.propertyLabel}: <span className="font-semibold text-slate-800">{listingTitle}</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-semibold text-slate-600 mb-1">{t.blockFrom}</span>
                  <input type="date" value={blockFrom} onChange={e => setBlockFrom(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold text-slate-600 mb-1">{t.blockTo}</span>
                  <input type="date" value={blockTo} onChange={e => setBlockTo(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
                </label>
              </div>
              <label className="block">
                <span className="block text-xs font-semibold text-slate-600 mb-1">{t.blockReason}</span>
                <input type="text" value={blockReason} onChange={e => setBlockReason(e.target.value)}
                  placeholder={t.blockReasonHint}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setShowBlockModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">{t.cancel}</button>
                <button onClick={handleBlockSave} className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg">{t.blockSave}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {eventDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEventDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${(SOURCE_COLORS[eventDetail.source] || SOURCE_COLORS.other).dot}`} />
                {(SOURCE_COLORS[eventDetail.source] || SOURCE_COLORS.other).label}
              </h3>
              <button onClick={() => setEventDetail(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{t.propertyLabel}</dt>
                <dd className="text-slate-900 font-medium truncate max-w-[240px]">{listingTitle}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Check-in</dt>
                <dd className="font-mono text-slate-900">{eventDetail.check_in}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Check-out</dt>
                <dd className="font-mono text-slate-900">{eventDetail.check_out}</dd>
              </div>
              {eventDetail.guest_name && (
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Guest</dt>
                  <dd className="text-slate-900 font-medium truncate max-w-[240px]">{eventDetail.guest_name}</dd>
                </div>
              )}
              {eventDetail.block_reason && (
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{t.blockReason}</dt>
                  <dd className="text-slate-900">{eventDetail.block_reason}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Status</dt>
                <dd className="text-slate-900 capitalize">{eventDetail.status}</dd>
              </div>
            </dl>
            {eventDetail.status === 'blocked' && (
              <button
                onClick={() => handleUnblock(eventDetail.id)}
                className="mt-5 w-full px-4 py-2.5 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg"
              >
                {t.unblock}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function FeedCard({ feed, syncingId, onSync, onRemove, t }: {
  feed: Feed;
  syncingId: string | null;
  onSync: (id: string) => void;
  onRemove: (id: string) => void;
  t: { syncNow: string; remove: string; lastSync: string; never: string; okStatus: string; errorStatus: string; pending: string };
}) {
  const c = SOURCE_COLORS[feed.source] || SOURCE_COLORS.other;
  const syncing = syncingId === feed.id;
  const statusIcon =
    feed.last_sync_status === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> :
    feed.last_sync_status === 'error' ? <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> :
    <Clock className="w-3.5 h-3.5 text-slate-400" />;

  const lastSyncRel = feed.last_synced_at ? relativeTime(feed.last_synced_at) : t.never;

  return (
    <div className={`p-3 rounded-xl border ${c.border} ${c.bg} border-opacity-60`}>
      <div className="flex items-start gap-2 mb-2">
        <div className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0 mt-1.5`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-900 truncate">{feed.label}</div>
          <div className="text-[11px] text-slate-600 font-mono truncate">{(() => { try { return new URL(feed.import_url).hostname; } catch { return feed.import_url; } })()}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-2">
        {statusIcon}
        <span>{t.lastSync}: <span className="font-medium text-slate-800">{lastSyncRel}</span></span>
        {feed.events_imported ? <span className="text-slate-400">· {feed.events_imported}</span> : null}
      </div>
      {feed.last_sync_error && (
        <div className="text-[10px] text-rose-700 mb-2 truncate" title={feed.last_sync_error}>{feed.last_sync_error}</div>
      )}
      <div className="flex gap-1.5">
        <button
          onClick={() => onSync(feed.id)}
          disabled={syncing}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} /> {t.syncNow}
        </button>
        <button
          onClick={() => onRemove(feed.id)}
          className="inline-flex items-center justify-center px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-md text-rose-600"
          title={t.remove}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function AddFeedModal({ t, onCancel, onSubmit }: {
  t: {
    addFeedModalTitle: string;
    source: string;
    label: string;
    labelHint: string;
    importUrl: string;
    importUrlHint: string;
    cancel: string;
    save: string;
  };
  onCancel: () => void;
  onSubmit: (source: string, label: string, url: string) => void;
}) {
  const [source, setSource] = useState('airbnb');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-sky-500" /> {t.addFeedModalTitle}
          </h3>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">{t.source}</span>
            <select value={source} onChange={e => setSource(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
              <option value="airbnb">Airbnb</option>
              <option value="booking">Booking.com</option>
              <option value="vrbo">VRBO</option>
              <option value="custom">Custom (iCal)</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">{t.label}</span>
            <input type="text" value={label} onChange={e => setLabel(e.target.value)}
              placeholder={t.labelHint}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">{t.importUrl}</span>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://www.airbnb.com/calendar/ical/12345.ics?s=…"
              className="w-full text-sm font-mono border border-slate-200 rounded-lg px-3 py-2" />
            <span className="block text-xs text-slate-500 mt-1 flex items-start gap-1 leading-relaxed">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {t.importUrlHint}
            </span>
          </label>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">{t.cancel}</button>
            <button
              onClick={async () => {
                if (!label || !url) return;
                setSubmitting(true);
                try { await onSubmit(source, label, url); } finally { setSubmitting(false); }
              }}
              disabled={!label || !url || submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg disabled:opacity-60 inline-flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function buildMonth(firstOfMonth: Date) {
  const year = firstOfMonth.getFullYear();
  const month = firstOfMonth.getMonth();
  const first = new Date(year, month, 1);
  const firstDow = (first.getDay() + 6) % 7;
  const days: { date: Date; inMonth: boolean }[] = [];
  for (let i = firstDow; i > 0; i--) {
    days.push({ date: new Date(year, month, 1 - i), inMonth: false });
  }
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    days.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date;
    const next = new Date(last); next.setDate(last.getDate() + 1);
    days.push({ date: next, inMonth: false });
  }
  return days;
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function nextDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const nd = new Date(y, m - 1, d);
  nd.setDate(nd.getDate() + 1);
  return toIso(nd);
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = (now - then) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
