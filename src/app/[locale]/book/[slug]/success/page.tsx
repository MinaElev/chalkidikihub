'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Stripe Checkout success landing. We don't wait for the webhook here —
 * instead we just redirect to /confirmed?id=<booking>. The webhook
 * (separate endpoint) is authoritative for payment_status; the
 * confirmed page will show whatever state the DB is in.
 */
export default function StripeSuccessPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const bookingId = sp?.get('booking');
  const slug = params?.slug;

  useEffect(() => {
    if (!bookingId || !slug) return;
    const timer = setTimeout(() => {
      router.push(`/book/${slug}/confirmed?id=${bookingId}`);
    }, 1200);
    return () => clearTimeout(timer);
  }, [bookingId, slug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-rose-50 p-6">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center max-w-sm">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
        <div className="text-slate-800 font-semibold">Finalizing…</div>
      </div>
    </div>
  );
}
