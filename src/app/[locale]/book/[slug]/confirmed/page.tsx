'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import {
  CheckCircle2, Clock, CalendarDays, Users, Home, Mail, Phone,
  AlertCircle, Loader2, Sparkles,
} from 'lucide-react';

type Data = {
  booking: {
    id: string;
    status: string;
    guest_name: string;
    guest_email: string;
    check_in: string;
    check_out: string;
    num_guests: number;
    total_amount: number | null;
    currency: string;
    payment_status: string;
    created_at: string;
  };
  listing: {
    slug: string;
    title_el: string | null;
    title_en: string | null;
    area: string | null;
    contact_phone: string | null;
    contact_email: string | null;
  } | null;
} | null;

export default function ConfirmedPage() {
  const locale = useLocale();
  const el = locale === 'el';
  const sp = useSearchParams();
  const id = sp?.get('id');

  const [data, setData] = useState<Data>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setError('missing_id'); setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch(`/api/pms/public/booking/${id}`);
        const json = await res.json();
        if (!res.ok) { setError(json.error || 'error'); return; }
        setData(json);
      } catch {
        setError('network');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const t = {
    confirmedTitle: el ? 'Εστάλη!' : 'Sent!',
    inquiryTitle: el ? 'Εστάλη — περιμένει έγκριση' : 'Sent — awaiting approval',
    confirmedSub: el
      ? 'Η κράτησή σου επιβεβαιώθηκε. Στάλθηκε email με όλες τις λεπτομέρειες.'
      : 'Your booking is confirmed. A confirmation email has been sent.',
    inquirySub: el
      ? 'Ο ιδιοκτήτης θα σου απαντήσει σε 24 ώρες.'
      : 'The host will reply within 24 hours.',
    dates: el ? 'Ημερομηνίες' : 'Dates',
    guests: el ? 'Άτομα' : 'Guests',
    total: el ? 'Σύνολο' : 'Total',
    listing: el ? 'Κατάλυμα' : 'Listing',
    contact: el ? 'Επικοινωνία με τον ιδιοκτήτη' : 'Contact the host',
    bookingId: el ? 'ID κράτησης' : 'Booking ID',
    backToListing: el ? 'Επιστροφή στο κατάλυμα' : 'Back to listing',
    loading: el ? 'Φόρτωση…' : 'Loading…',
    notFound: el ? 'Δεν βρέθηκε η κράτηση' : 'Booking not found',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md bg-white border border-rose-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <div className="text-slate-800 font-semibold mb-1">{t.notFound}</div>
          <div className="text-xs text-slate-500 font-mono">{error}</div>
        </div>
      </div>
    );
  }

  const { booking, listing } = data;
  const isConfirmed = booking.status === 'confirmed';
  const title = listing ? (el ? (listing.title_el || listing.title_en) : (listing.title_en || listing.title_el)) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isConfirmed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {isConfirmed ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isConfirmed ? t.confirmedTitle : t.inquiryTitle}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {isConfirmed ? t.confirmedSub : t.inquirySub}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-[0.15em]">
            <Sparkles className="w-3 h-3" /> 0% OTA
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
          <Row icon={Home} label={t.listing} value={title || '—'} />
          <Row icon={CalendarDays} label={t.dates}
            value={`${booking.check_in} → ${booking.check_out}`} />
          <Row icon={Users} label={t.guests} value={String(booking.num_guests)} />
          {booking.total_amount != null && (
            <Row icon={Sparkles} label={t.total}
              value={`${Number(booking.total_amount).toFixed(0)} ${booking.currency}`}
              valueClassName="text-fuchsia-700 font-bold text-lg" />
          )}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            {t.bookingId}: <span className="font-mono text-slate-700">{booking.id}</span>
          </div>
        </div>

        {listing && (listing.contact_phone || listing.contact_email) && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-2">{t.contact}</div>
            <div className="flex flex-wrap gap-2">
              {listing.contact_phone && (
                <a href={`tel:${listing.contact_phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100">
                  <Phone className="w-3.5 h-3.5" /> {listing.contact_phone}
                </a>
              )}
              {listing.contact_email && (
                <a href={`mailto:${listing.contact_email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-medium hover:bg-sky-100">
                  <Mail className="w-3.5 h-3.5" /> {listing.contact_email}
                </a>
              )}
            </div>
          </div>
        )}

        {listing?.slug && (
          <Link href={`/stay/${listing.slug}`}
            className="inline-flex items-center justify-center w-full px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-sm">
            {t.backToListing}
          </Link>
        )}
      </div>
    </div>
  );
}

function Row({
  icon: Icon, label, value, valueClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-50 text-slate-500 inline-flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
        <div className={`text-sm text-slate-900 ${valueClassName || ''}`}>{value}</div>
      </div>
    </div>
  );
}
