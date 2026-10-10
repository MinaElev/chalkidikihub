'use client';

import { useLocale } from 'next-intl';
import { useSearchParams, useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';

/**
 * Stripe Checkout cancel landing. The booking was created but payment
 * was aborted — it still exists in pms_bookings as status=inquiry /
 * confirmed with payment_status=unpaid. Owner will see it and can
 * follow up manually.
 */
export default function StripeCancelledPage() {
  const locale = useLocale();
  const el = locale === 'el';
  const params = useParams<{ slug: string }>();
  const sp = useSearchParams();
  const slug = params?.slug || '';
  const bookingId = sp?.get('booking');

  const t = {
    title: el ? 'Η πληρωμή ακυρώθηκε' : 'Payment cancelled',
    sub: el
      ? 'Η κράτηση έχει δημιουργηθεί αλλά είναι unpaid. Ο ιδιοκτήτης θα επικοινωνήσει για να κανονιστεί η πληρωμή.'
      : 'The booking has been created but is unpaid. The host will reach out to arrange payment.',
    tryAgain: el ? 'Ξαναδοκίμασε τώρα' : 'Try paying again',
    backTo: el ? 'Επιστροφή στο κατάλυμα' : 'Back to listing',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 p-6">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-5">{t.sub}</p>
        <div className="flex flex-col gap-2">
          {bookingId && (
            <button type="button"
              onClick={async () => {
                const res = await fetch('/api/pms/public/checkout', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ booking_id: bookingId }),
                });
                const j = await res.json();
                if (j.url) window.location.href = j.url;
              }}
              className="w-full inline-flex items-center justify-center px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-2xl">
              {t.tryAgain}
            </button>
          )}
          <Link href={`/stay/${slug}`}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-2xl">
            <ArrowLeft className="w-4 h-4" /> {t.backTo}
          </Link>
        </div>
      </div>
    </div>
  );
}
