'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Calendar, Loader2, Eye, EyeOff, ChevronRight } from 'lucide-react';

interface DbListing {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  area: string;
  price_per_night: number;
  status: string;
  show_calendar: boolean;
  blocked_count?: number;
}

export default function MyCalendarsPage() {
  const locale = useLocale();
  const [listings, setListings] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [missingColumn, setMissingColumn] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setErrorMsg(null);
    setMissingColumn(false);
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setErrorMsg(authError?.message || 'Not signed in');
      setLoading(false);
      return;
    }

    // First try WITH show_calendar (expected after migration 025)
    let listingsData: DbListing[] | null = null;
    const { data, error } = await supabase
      .from('listings')
      .select('id, slug, title_el, title_en, area, price_per_night, status, show_calendar')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      // Likely the column does not exist yet — migration 025 not applied
      if (error.message?.toLowerCase().includes('show_calendar') || error.code === '42703') {
        setMissingColumn(true);
        // Fall back to fetching without that column so the user still sees listings
        const fallback = await supabase
          .from('listings')
          .select('id, slug, title_el, title_en, area, price_per_night, status')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        listingsData = (fallback.data || []).map(l => ({ ...l, show_calendar: false })) as DbListing[];
      } else {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
    } else {
      listingsData = data as DbListing[];
    }

    if (!listingsData) {
      setListings([]);
      setLoading(false);
      return;
    }

    // Fetch blocked/booked counts per listing (future dates)
    const today = new Date().toISOString().slice(0, 10);
    const ids = listingsData.map(l => l.id);
    if (ids.length > 0) {
      const { data: availData } = await supabase
        .from('listing_availability')
        .select('listing_id')
        .in('listing_id', ids)
        .gte('date', today);

      const counts = new Map<string, number>();
      (availData || []).forEach((r: { listing_id: string }) => {
        counts.set(r.listing_id, (counts.get(r.listing_id) || 0) + 1);
      });

      setListings(listingsData.map(l => ({ ...l, blocked_count: counts.get(l.id) || 0 })));
    } else {
      setListings(listingsData);
    }
    setLoading(false);
  }

  async function toggleShowCalendar(listingId: string, current: boolean) {
    setTogglingId(listingId);
    const supabase = createClient();
    const { error } = await supabase
      .from('listings')
      .update({ show_calendar: !current })
      .eq('id', listingId);

    if (error) {
      alert('Σφάλμα: ' + error.message);
    } else {
      setListings(prev =>
        prev.map(l => (l.id === listingId ? { ...l, show_calendar: !current } : l))
      );
    }
    setTogglingId(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const title = locale === 'el' ? 'Ημερολόγια' : 'Calendars';
  const intro = locale === 'el'
    ? 'Διαχειρίσου τη διαθεσιμότητα για κάθε κατάλυμα. Το toggle «Ορατό / Κρυφό» ελέγχει μόνο την εμφάνιση στη σελίδα του listing — στην προσωπική σελίδα του καταλύματος (/stay) εμφανίζεται πάντα.'
    : 'Manage availability for each listing. The Visible/Hidden toggle only affects the listing page — the calendar always appears on the property\'s personal page (/stay).';
  const emptyTxt = locale === 'el' ? 'Δεν έχεις καταχωρημένα καταλύματα ακόμα.' : 'You have no listings yet.';
  const addTxt = locale === 'el' ? 'Πρόσθεσε το πρώτο σου' : 'Add your first one';
  const visibleTxt = locale === 'el' ? 'Ορατό δημόσια' : 'Visible publicly';
  const hiddenTxt = locale === 'el' ? 'Κρυφό' : 'Hidden';
  const manageTxt = locale === 'el' ? 'Διαχείριση ημερολογίου' : 'Manage calendar';
  const blockedLabel = (n: number) => locale === 'el'
    ? `${n} δεσμευμένες μέρες`
    : `${n} blocked days`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="w-7 h-7 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <p className="text-sm text-gray-600 mb-6">{intro}</p>

      {errorMsg && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <strong>Σφάλμα:</strong> {errorMsg}
        </div>
      )}

      {missingColumn && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <p className="font-semibold mb-1">⚠️ Χρειάζεται να τρέξεις το migration 025</p>
          <p className="mb-2">Η στήλη <code className="bg-amber-100 px-1 rounded">show_calendar</code> δεν υπάρχει ακόμα στον πίνακα <code className="bg-amber-100 px-1 rounded">listings</code>. Το toggle δημόσιας εμφάνισης θα ενεργοποιηθεί μόλις τρέξεις το παρακάτω SQL στο Supabase:</p>
          <pre className="bg-amber-100 p-3 rounded text-xs overflow-x-auto">
ALTER TABLE listings{'\n'}  ADD COLUMN IF NOT EXISTS show_calendar boolean NOT NULL DEFAULT false;
          </pre>
        </div>
      )}

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <p className="text-gray-500 mb-4">{emptyTxt}</p>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl"
          >
            {addTxt}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => {
            const listingTitle = locale === 'el' ? listing.title_el : listing.title_en || listing.title_el;
            const isToggling = togglingId === listing.id;
            return (
              <div
                key={listing.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Title + info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{listingTitle}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                      <span className="capitalize">{listing.area}</span>
                      <span>€{listing.price_per_night}/night</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          listing.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {listing.status}
                      </span>
                      {(listing.blocked_count || 0) > 0 && (
                        <span className="text-orange-600 font-medium">
                          • {blockedLabel(listing.blocked_count || 0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle show_calendar */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleShowCalendar(listing.id, listing.show_calendar)}
                      disabled={isToggling || missingColumn}
                      title={missingColumn ? 'Τρέξε πρώτα το migration 025' : undefined}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        listing.show_calendar
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isToggling ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : listing.show_calendar ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                      <span>{listing.show_calendar ? visibleTxt : hiddenTxt}</span>
                    </button>

                    {/* Manage calendar button */}
                    <Link
                      href={`/dashboard/listings/${listing.id}/availability`}
                      className="flex items-center gap-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      {manageTxt}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
