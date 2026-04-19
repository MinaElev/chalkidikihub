'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, AlertCircle, PenSquare, Zap } from 'lucide-react';
import { MessageComposer } from '@/components/pms/MessageComposer';

interface ListingLite {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

interface BookingLite {
  id: string;
  listing_id: string;
  check_in: string;
  check_out: string;
  guest_name: string | null;
  guest_email: string | null;
}

export default function NewMessagePage() {
  const locale = useLocale();
  const el = locale === 'el';
  const search = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingLite[]>([]);
  const [bookings, setBookings] = useState<BookingLite[]>([]);

  const [listingId, setListingId] = useState<string>('');
  const [bookingId, setBookingId] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');

  const t = {
    back: el ? 'Πίσω στο inbox' : 'Back to inbox',
    title: el ? 'Νέο μήνυμα' : 'New message',
    sub: el
      ? 'Ξεκίνα νέα συνομιλία με guest — είτε δέσε τη σε κράτηση είτε κράτα την ανεξάρτητη.'
      : 'Start a new conversation with a guest — tied to a booking or standalone.',
    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    pickListing: el ? 'Κατάλυμα' : 'Listing',
    chooseListing: el ? '— Διάλεξε κατάλυμα —' : '— Pick a listing —',
    pickBooking: el ? 'Κράτηση (προαιρετικό)' : 'Booking (optional)',
    noBooking: el ? '— Χωρίς κράτηση —' : '— No booking —',
    guestName: el ? 'Όνομα guest' : 'Guest name',
    guestEmail: el ? 'Email guest' : 'Guest email',
    hint: el ? 'Αν επιλέξεις κράτηση, τα στοιχεία του guest γεμίζουν αυτόματα.' : 'If you pick a booking, guest details auto-fill.',
    noListings: el ? 'Δεν έχεις καταλύματα ακόμη.' : "You don't have any listings yet.",
    toListings: el ? 'Στα καταλύματά μου' : 'Go to my listings',
  };

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setLoadError(authErr?.message || 'Not signed in'); return; }

        const [lRes, bRes] = await Promise.all([
          supabase.from('listings')
            .select('id, slug, title_el, title_en')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('pms_bookings')
            .select('id, listing_id, check_in, check_out, guest_name, guest_email')
            .eq('owner_id', user.id)
            .order('check_in', { ascending: false })
            .limit(100),
        ]);

        if (lRes.error) { setLoadError(lRes.error.message); return; }
        if (bRes.error) { setLoadError(bRes.error.message); return; }

        const listingsData = lRes.data || [];
        const bookingsData = (bRes.data || []) as BookingLite[];
        setListings(listingsData);
        setBookings(bookingsData);

        const qListing = search?.get('listing_id') || '';
        const qBooking = search?.get('booking_id') || '';

        const chosenListing = qListing || listingsData[0]?.id || '';
        setListingId(chosenListing);

        if (qBooking) {
          const b = bookingsData.find(x => x.id === qBooking);
          if (b) {
            setBookingId(b.id);
            setListingId(b.listing_id);
            setGuestName(b.guest_name || '');
            setGuestEmail(b.guest_email || '');
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [search]);

  function handleBookingChange(id: string) {
    setBookingId(id);
    if (!id) return;
    const b = bookings.find(x => x.id === id);
    if (b) {
      setListingId(b.listing_id);
      if (!guestName) setGuestName(b.guest_name || '');
      if (!guestEmail) setGuestEmail(b.guest_email || '');
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  }

  const bookingsForListing = bookings.filter(b => !listingId || b.listing_id === listingId);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms/messages" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
            <PenSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
            <p className="text-white/85 text-sm leading-relaxed">{t.sub}</p>
          </div>
        </div>
      </header>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.loadError}: <span className="font-mono text-xs">{loadError}</span></span>
        </div>
      )}

      {listings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
          <p className="text-sm text-slate-600 mb-4">{t.noListings}</p>
          <Link href="/dashboard/listings"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-sm">
            {t.toListings}
          </Link>
        </div>
      ) : (
        <>
          <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.pickListing}</div>
                <select value={listingId} onChange={e => { setListingId(e.target.value); setBookingId(''); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
                  <option value="">{t.chooseListing}</option>
                  {listings.map(l => (
                    <option key={l.id} value={l.id}>
                      {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.pickBooking}</div>
                <select value={bookingId} onChange={e => handleBookingChange(e.target.value)}
                  disabled={!listingId}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 disabled:bg-slate-50">
                  <option value="">{t.noBooking}</option>
                  {bookingsForListing.map(b => (
                    <option key={b.id} value={b.id}>
                      {new Date(b.check_in).toLocaleDateString(el ? 'el-GR' : 'en-US', { day: '2-digit', month: 'short' })} → {new Date(b.check_out).toLocaleDateString(el ? 'el-GR' : 'en-US', { day: '2-digit', month: 'short' })} · {b.guest_name || b.guest_email || '—'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.guestName}</div>
                <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.guestEmail}</div>
                <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" />
              </div>
            </div>
            <p className="text-xs text-slate-500">{t.hint}</p>
          </section>

          {listingId && (
            <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
              <MessageComposer
                context={{
                  listing_id: listingId,
                  booking_id: bookingId || null,
                  guest_name: guestName || null,
                  guest_email: guestEmail || null,
                  direction: 'outbound',
                }}
                el={el}
                onSent={() => router.push('/dashboard/pms/messages')}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
