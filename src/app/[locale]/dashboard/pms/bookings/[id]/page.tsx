'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, AlertCircle, Edit3, Zap } from 'lucide-react';
import { BookingForm, type BookingFormData, type Listing } from '@/components/pms/BookingForm';

export default function BookingDetailPage() {
  const locale = useLocale();
  const el = locale === 'el';
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookingId = params?.id;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [initial, setInitial] = useState<BookingFormData | null>(null);

  const t = {
    back: el ? 'Πίσω στις κρατήσεις' : 'Back to bookings',
    title: el ? 'Επεξεργασία κράτησης' : 'Edit booking',
    sub: el
      ? 'Άλλαξε στοιχεία, άλλαξε status, ή διέγραψε την κράτηση.'
      : 'Update details, change status, or delete the booking.',
    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    notFound: el ? 'Δεν βρέθηκε η κράτηση.' : 'Booking not found.',
  };

  useEffect(() => {
    if (!bookingId) return;
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
            .select('*')
            .eq('id', bookingId)
            .eq('owner_id', user.id)
            .maybeSingle(),
        ]);

        if (lRes.error) { setLoadError(lRes.error.message); return; }
        if (bRes.error) { setLoadError(bRes.error.message); return; }

        setListings(lRes.data || []);
        if (!bRes.data) { setLoadError(t.notFound); return; }

        const b = bRes.data;
        setInitial({
          id: b.id,
          listing_id: b.listing_id,
          status: b.status,
          source: b.source,
          guest_name: b.guest_name,
          guest_email: b.guest_email,
          guest_phone: b.guest_phone,
          guest_country: b.guest_country,
          num_guests: b.num_guests ?? 1,
          num_adults: b.num_adults ?? 1,
          num_children: b.num_children ?? 0,
          check_in: b.check_in,
          check_out: b.check_out,
          currency: b.currency || 'EUR',
          nightly_rate: b.nightly_rate != null ? Number(b.nightly_rate) : null,
          cleaning_fee: b.cleaning_fee != null ? Number(b.cleaning_fee) : null,
          taxes: b.taxes != null ? Number(b.taxes) : null,
          total_amount: b.total_amount != null ? Number(b.total_amount) : null,
          payment_status: b.payment_status || 'unpaid',
          notes: b.notes,
          block_reason: b.block_reason,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId, t.notFound]);

  async function handleDelete() {
    if (!bookingId) return;
    const supabase = createClient();
    const { error } = await supabase.from('pms_bookings').delete().eq('id', bookingId);
    if (error) { alert(error.message); return; }
    router.push('/dashboard/pms/bookings');
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms/bookings" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
            <p className="text-white/80 text-sm leading-relaxed">{t.sub}</p>
          </div>
        </div>
      </header>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.loadError}: <span className="font-mono text-xs">{loadError}</span></span>
        </div>
      )}

      {initial && (
        <BookingForm
          mode="edit"
          initial={initial}
          listings={listings}
          el={el}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
