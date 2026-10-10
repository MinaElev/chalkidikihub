'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Loader2, Check, X, Ban, Calendar as CalendarIcon, Save, Trash2, Eye, EyeOff, Info } from 'lucide-react';

interface AvailabilityRow {
  id: string;
  date: string; // YYYY-MM-DD
  status: 'blocked' | 'booked';
  note?: string | null;
}

type CellStatus = 'available' | 'blocked' | 'booked';

export default function ListingAvailabilityPage() {
  const { id } = useParams();
  const listingId = id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState<{ title_el: string; title_en: string; slug: string; show_calendar: boolean } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState(false);
  const [rows, setRows] = useState<AvailabilityRow[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Map<string, CellStatus>>(new Map());
  const [toolMode, setToolMode] = useState<CellStatus>('blocked');
  const [anchorMonth, setAnchorMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [success, setSuccess] = useState(false);

  // Load
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const [{ data: listingData }, { data: availData }] = await Promise.all([
        supabase.from('listings').select('title_el, title_en, slug, show_calendar').eq('id', listingId).single(),
        supabase.from('listing_availability').select('*').eq('listing_id', listingId),
      ]);
      if (listingData) {
        setListing(listingData);
        setShowCalendar(Boolean(listingData.show_calendar));
      }
      if (availData) setRows(availData as AvailabilityRow[]);
      setLoading(false);
    })();
  }, [listingId]);

  // Quick lookup: YYYY-MM-DD -> status (accounting for pending changes)
  const statusByDate = useMemo(() => {
    const m = new Map<string, CellStatus>();
    rows.forEach(r => m.set(r.date, r.status));
    pendingChanges.forEach((v, k) => {
      if (v === 'available') m.delete(k);
      else m.set(k, v);
    });
    return m;
  }, [rows, pendingChanges]);

  function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  function toggleDate(dateStr: string) {
    const current = statusByDate.get(dateStr) || 'available';
    let next: CellStatus;
    if (toolMode === 'available') {
      next = 'available';
    } else if (toolMode === current) {
      // Same tool as current state → revert to available
      next = 'available';
    } else {
      next = toolMode;
    }
    setPendingChanges(prev => {
      const copy = new Map(prev);
      copy.set(dateStr, next);
      return copy;
    });
  }

  async function saveChanges() {
    if (pendingChanges.size === 0) return;
    setSaving(true);
    const supabase = createClient();

    const toUpsert: { listing_id: string; date: string; status: string }[] = [];
    const toDelete: string[] = [];
    pendingChanges.forEach((status, date) => {
      if (status === 'available') toDelete.push(date);
      else toUpsert.push({ listing_id: listingId, date, status });
    });

    try {
      if (toUpsert.length > 0) {
        const { error } = await supabase
          .from('listing_availability')
          .upsert(toUpsert, { onConflict: 'listing_id,date' });
        if (error) throw error;
      }
      if (toDelete.length > 0) {
        const { error } = await supabase
          .from('listing_availability')
          .delete()
          .eq('listing_id', listingId)
          .in('date', toDelete);
        if (error) throw error;
      }

      // Reload from DB
      const { data } = await supabase.from('listing_availability').select('*').eq('listing_id', listingId);
      if (data) setRows(data as AvailabilityRow[]);
      setPendingChanges(new Map());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      alert('Αποτυχία αποθήκευσης: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function discardChanges() {
    setPendingChanges(new Map());
  }

  async function toggleShowCalendar() {
    const next = !showCalendar;
    setTogglingVisibility(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('listings')
      .update({ show_calendar: next })
      .eq('id', listingId);
    if (error) {
      alert('Σφάλμα: ' + error.message);
    } else {
      setShowCalendar(next);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
    setTogglingVisibility(false);
  }

  async function clearAllBlocks() {
    if (!confirm('Να διαγραφούν ΟΛΕΣ οι μη διαθέσιμες μέρες;')) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('listing_availability').delete().eq('listing_id', listingId);
    if (error) alert('Σφάλμα: ' + error.message);
    else {
      setRows([]);
      setPendingChanges(new Map());
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const months = [0, 1, 2].map(offset => {
    const d = new Date(anchorMonth);
    d.setMonth(d.getMonth() + offset);
    return d;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/listings/${listingId}/edit`}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary-600" />
            Ημερολόγιο Διαθεσιμότητας
          </h1>
          {listing && (
            <p className="text-sm text-gray-600">{listing.title_el || listing.title_en}</p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <h2 className="font-semibold text-blue-900">Πώς λειτουργεί</h2>
        </div>
        <ol className="text-sm text-blue-900/90 space-y-1.5 list-decimal list-inside ml-1">
          <li>
            <strong>Επίλεξε εργαλείο</strong> από την μπάρα παρακάτω: <em>Μπλοκαρισμένη</em> (πορτοκαλί — μη διαθέσιμη για άλλους λόγους) ή <em>Κρατημένη</em> (κόκκινη — υπάρχει κράτηση). Με το εργαλείο <em>Διαθέσιμη</em> καθαρίζεις μια μέρα.
          </li>
          <li>
            <strong>Κάνε κλικ στις μέρες</strong> στο ημερολόγιο για να τις σημειώσεις. Μπορείς να αλλάξεις πολλές μέρες χωρίς αποθήκευση — οι αλλαγές κρατούνται προσωρινά.
          </li>
          <li>
            Πάτησε <strong>Αποθήκευση</strong> στο κάτω μέρος της σελίδας για να καταχωρηθούν στη βάση. Με <strong>Ακύρωση</strong> αναιρείς τις μη αποθηκευμένες αλλαγές.
          </li>
          <li>
            Όταν είσαι έτοιμος, <strong>ενεργοποίησε τη δημόσια εμφάνιση</strong> από το παρακάτω switch (ΝΑΙ/ΟΧΙ). Μόνο τότε θα φαίνεται το ημερολόγιο διαθεσιμότητας στη δημόσια σελίδα του καταλύματός σου. Στο κοινό εμφανίζονται μόνο οι μη διαθέσιμες μέρες (με κόκκινο) — οι λόγοι (μπλοκαρισμένη/κρατημένη) δεν είναι ορατοί στους επισκέπτες.
          </li>
          <li>
            <strong>Default είναι ΟΧΙ</strong> — δηλαδή κανείς εκτός από εσένα δεν βλέπει το ημερολόγιο, μέχρι να το ενεργοποιήσεις.
          </li>
        </ol>
      </div>

      {/* Public visibility toggle */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            {showCalendar ? (
              <Eye className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-gray-900">Δημόσια εμφάνιση ημερολογίου</p>
              <p className="text-sm text-gray-600 mt-0.5">
                {showCalendar
                  ? 'Το ημερολόγιο είναι ορατό στη σελίδα του καταλύματος.'
                  : 'Το ημερολόγιο είναι κρυφό. Μόνο εσύ το βλέπεις.'}
              </p>
              {listing?.slug && showCalendar && (
                <a
                  href={`/listings/${listing.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline mt-1 inline-block"
                >
                  Δες πώς εμφανίζεται στο κοινό →
                </a>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={toggleShowCalendar}
            disabled={togglingVisibility}
            aria-pressed={showCalendar}
            className={`relative inline-flex items-center gap-2 px-1 py-1 rounded-full transition-colors disabled:opacity-50 ${
              showCalendar ? 'bg-green-500' : 'bg-gray-300'
            }`}
            style={{ width: '88px', height: '36px' }}
          >
            <span
              className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow transition-transform ${
                showCalendar ? 'translate-x-[52px]' : 'translate-x-0'
              }`}
            />
            <span className={`absolute text-xs font-bold ${showCalendar ? 'left-3 text-white' : 'right-3 text-gray-600'}`}>
              {showCalendar ? 'ΝΑΙ' : 'ΟΧΙ'}
            </span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-3">Εργαλείο: κάνε κλικ σε μία μέρα για να την αλλάξεις</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setToolMode('blocked')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              toolMode === 'blocked'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Ban className="w-4 h-4" />
            Μπλοκαρισμένη
          </button>
          <button
            type="button"
            onClick={() => setToolMode('booked')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              toolMode === 'booked'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <X className="w-4 h-4" />
            Κρατημένη
          </button>
          <button
            type="button"
            onClick={() => setToolMode('available')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
              toolMode === 'available'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Check className="w-4 h-4" />
            Διαθέσιμη
          </button>

          <div className="ml-auto flex items-center gap-2">
            {pendingChanges.size > 0 && (
              <span className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
                {pendingChanges.size} αλλαγές χωρίς αποθήκευση
              </span>
            )}
            <button
              type="button"
              onClick={clearAllBlocks}
              disabled={saving || rows.length === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              Καθαρισμός όλων
            </button>
          </div>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => {
            const d = new Date(anchorMonth);
            d.setMonth(d.getMonth() - 1);
            setAnchorMonth(d);
          }}
          className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-medium"
        >
          ← Προηγούμενος
        </button>
        <button
          type="button"
          onClick={() => {
            const d = new Date();
            d.setDate(1);
            setAnchorMonth(d);
          }}
          className="px-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-xl"
        >
          Σήμερα
        </button>
        <button
          type="button"
          onClick={() => {
            const d = new Date(anchorMonth);
            d.setMonth(d.getMonth() + 1);
            setAnchorMonth(d);
          }}
          className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-medium"
        >
          Επόμενος →
        </button>
      </div>

      {/* 3-month grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {months.map(m => (
          <MonthGrid
            key={`${m.getFullYear()}-${m.getMonth()}`}
            month={m}
            statusByDate={statusByDate}
            onToggle={toggleDate}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white border border-gray-300 rounded"></div>
          Διαθέσιμη
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-200 border border-orange-400 rounded"></div>
          Μπλοκαρισμένη
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-200 border border-red-400 rounded"></div>
          Κρατημένη
        </div>
      </div>

      {/* Sticky save bar */}
      {pendingChanges.size > 0 && (
        <div className="sticky bottom-4 mt-6 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
          <button
            type="button"
            onClick={discardChanges}
            disabled={saving}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            Ακύρωση
          </button>
          <button
            type="button"
            onClick={saveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Αποθήκευση {pendingChanges.size} αλλαγών
          </button>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <Check className="w-5 h-5" /> Αποθηκεύτηκε!
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Month grid component
// ─────────────────────────────────────────────────────────────────────────

function MonthGrid({
  month,
  statusByDate,
  onToggle,
  formatDate,
}: {
  month: Date;
  statusByDate: Map<string, CellStatus>;
  onToggle: (dateStr: string) => void;
  formatDate: (d: Date) => string;
}) {
  const year = month.getFullYear();
  const monthIdx = month.getMonth();
  const firstDay = new Date(year, monthIdx, 1);
  const lastDay = new Date(year, monthIdx + 1, 0);

  // Monday = 0, Sunday = 6
  const startOffset = (firstDay.getDay() + 6) % 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];
  const dayNames = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'];

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, monthIdx, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
      <h3 className="text-center font-semibold text-gray-900 mb-2">
        {monthNames[monthIdx]} {year}
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(dn => (
          <div key={dn} className="text-center text-[10px] font-medium text-gray-500 py-1">
            {dn}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />;
          const dateStr = formatDate(cell);
          const status = statusByDate.get(dateStr) || 'available';
          const isPast = cell < today;
          const isToday = cell.getTime() === today.getTime();

          let bg = 'bg-white hover:bg-gray-50 border-gray-200';
          if (status === 'blocked') bg = 'bg-orange-200 hover:bg-orange-300 border-orange-400';
          if (status === 'booked') bg = 'bg-red-200 hover:bg-red-300 border-red-400';

          return (
            <button
              key={i}
              type="button"
              onClick={() => !isPast && onToggle(dateStr)}
              disabled={isPast}
              className={`aspect-square flex items-center justify-center text-sm rounded border transition-colors ${bg} ${
                isPast ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              } ${isToday ? 'ring-2 ring-primary-500 font-bold' : ''}`}
            >
              {cell.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
