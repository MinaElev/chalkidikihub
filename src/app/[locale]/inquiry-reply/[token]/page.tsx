import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { adminDb } from '@/lib/supabase/clients';
import { Container } from '@/components/ui/Layout';
import { InquiryReplyForm } from './_client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Απάντηση σε αίτημα διαθεσιμότητας',
  robots: { index: false, follow: false },
};

const fmt = new Intl.DateTimeFormat('el-GR', { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'UTC' });
const day = (iso: string | null) => (iso ? fmt.format(new Date(iso)) : '-');

/**
 * Where the owner lands from "Available" / "Not available" in a request email.
 * Owner-facing, so Greek only. Opening it changes nothing (mail scanners open
 * links too); the answer is sent by the button on the page.
 */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; token: string }>;
  searchParams: Promise<{ a?: string }>;
}) {
  const { locale, token } = await params;
  const { a } = await searchParams;
  setRequestLocale(locale);

  const db = adminDb();
  const { data: row } =
    token.length >= 20
      ? await db
          .from('listing_inquiries')
          .select('listing_id, guest_name, check_in, check_out, guests, message, locale, reply_status, replied_at')
          .eq('reply_token', token)
          .maybeSingle()
      : { data: null };
  const { data: listing } = row ? await db.from('listings').select('title_el, slug').eq('id', row.listing_id).maybeSingle() : { data: null };

  const nights = row?.check_in && row?.check_out ? Math.round((Date.parse(row.check_out) - Date.parse(row.check_in)) / 86_400_000) : null;

  return (
    <Container>
      <div className="mx-auto max-w-xl py-10">
        {!row ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
            Ο σύνδεσμος δεν ισχύει. Αν πιστεύετε ότι πρόκειται για λάθος, απαντήστε απευθείας στο email του επισκέπτη.
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-slate-900">Απάντηση στον επισκέπτη</h1>
            <p className="mt-1 text-slate-600">{listing?.title_el || listing?.slug}</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
              <div><dt className="text-slate-500">Επισκέπτης</dt><dd className="font-semibold text-slate-900">{row.guest_name}</dd></div>
              <div><dt className="text-slate-500">Άτομα</dt><dd className="font-semibold text-slate-900">{row.guests ?? '-'}</dd></div>
              <div><dt className="text-slate-500">Άφιξη</dt><dd className="font-semibold text-slate-900">{day(row.check_in)}</dd></div>
              <div><dt className="text-slate-500">Αναχώρηση</dt><dd className="font-semibold text-slate-900">{day(row.check_out)}{nights ? ` · ${nights} βράδια` : ''}</dd></div>
              <div className="col-span-2"><dt className="text-slate-500">Γλώσσα επισκέπτη</dt><dd className="font-semibold text-slate-900">{String(row.locale).toUpperCase()} — η απάντηση θα του σταλεί σε αυτή τη γλώσσα</dd></div>
              {row.message && <div className="col-span-2"><dt className="text-slate-500">Μήνυμα</dt><dd className="whitespace-pre-line text-slate-800">{row.message}</dd></div>}
            </dl>
            <div className="mt-6">
              <InquiryReplyForm
                token={token}
                initial={a === 'unavailable' ? 'unavailable' : 'available'}
                answered={row.reply_status ? { status: row.reply_status, at: row.replied_at ? day(row.replied_at) : '' } : null}
                nights={nights}
              />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
