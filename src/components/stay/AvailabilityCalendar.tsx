import { CalendarCheck } from 'lucide-react';
import { htmlLang, type Locale } from '@/i18n/config';
import { adminDb, publicDb } from '@/lib/supabase/clients';
import { AvailabilityMonths } from './AvailabilityMonths';

/** How far ahead visitors can browse (Airbnb / Booking.com export about a year). */
const MONTHS = 12;
const SOURCE_NAMES: Record<string, string> = { airbnb: 'Airbnb', booking: 'Booking.com' };
const syncedWithinADay = (iso?: string) => Boolean(iso && Date.now() - Date.parse(iso) < 86_400_000);

/**
 * Owner-maintained availability (listing_availability), loaded on the server
 * for the next twelve months and browsed month by month in the browser.
 * Booked/blocked days are struck through. Days imported from Airbnb /
 * Booking.com iCal feeds live in the same table; when the listing has a
 * working feed the box is highlighted as "live" and says when it last synced.
 */
export async function AvailabilityCalendar({
  listingId,
  locale,
  title,
  labels,
}: {
  listingId: string;
  locale: Locale;
  title: string;
  labels: {
    free: string; busy: string; updated: string; live: string; syncedWith: string; prev: string; next: string;
    checkoutOnly: string; checkinOnly: string;
  };
}) {
  const start = new Date();
  start.setUTCDate(1);
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + MONTHS, 0));
  const { data } = await publicDb()
    .from('listing_availability')
    .select('date, status')
    .eq('listing_id', listingId)
    .gte('date', start.toISOString().slice(0, 10))
    .lte('date', end.toISOString().slice(0, 10))
    .limit(1000);
  // Days before today (Greek calendar) can no longer be booked: shown greyed, not as free.
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
  const busy = (data ?? []).filter((d) => d.status !== 'available').map((d) => d.date as string);

  // Feed URLs are private (RLS, no policies), so read only the sync time and source with the service role.
  const { data: feeds } = await adminDb()
    .from('listing_ical_feeds')
    .select('source, last_synced_at')
    .eq('listing_id', listingId)
    .eq('last_status', 'ok')
    .order('last_synced_at', { ascending: false });
  const syncedAt = feeds?.[0]?.last_synced_at as string | undefined;
  // Same rule as the badge on /listings: a feed synced within the last day.
  const live = syncedWithinADay(syncedAt);
  const sources = [...new Set((feeds ?? []).map((f) => SOURCE_NAMES[f.source as string] ?? String(f.source)))].join(' / ');

  const lang = htmlLang[locale];
  return (
    <section
      id="availability"
      aria-labelledby="availability-title"
      className={`scroll-mt-24 rounded-3xl p-5 sm:p-6 ${live ? 'border-2 border-emerald-200 bg-emerald-50/40' : 'border border-slate-200 bg-sand-50'}`}
    >
      <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 id="availability-title" className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
          <CalendarCheck className="size-6 text-emerald-600" aria-hidden />
          {title}
        </h2>
        {live && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-200">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {labels.live}
          </span>
        )}
      </div>
      {live && sources && <p className="text-sm text-slate-600">{labels.syncedWith.replace('{source}', sources)}</p>}

      <div className="mt-4">
        <AvailabilityMonths
          busy={busy}
          today={today}
          firstMonth={start.toISOString().slice(0, 7)}
          monthCount={MONTHS}
          lang={lang}
          labels={{ prev: labels.prev, next: labels.next, checkoutOnly: labels.checkoutOnly, checkinOnly: labels.checkinOnly }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-emerald-50 ring-1 ring-emerald-200" aria-hidden="true" />
          {labels.free}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-slate-100 ring-1 ring-slate-200" aria-hidden="true" />
          {labels.busy}
        </span>
        {/* Same diagonal split as the changeover days in AvailabilityMonths. */}
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded ring-1 ring-slate-200" style={{ backgroundImage: 'linear-gradient(135deg, #d1fae5 50%, #e2e8f0 50%)' }} aria-hidden="true" />
          {labels.checkoutOnly}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded ring-1 ring-slate-200" style={{ backgroundImage: 'linear-gradient(135deg, #e2e8f0 50%, #d1fae5 50%)' }} aria-hidden="true" />
          {labels.checkinOnly}
        </span>
        {syncedAt && (
          <span className="text-slate-500">
            {labels.updated.replace(
              '{date}',
              new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Athens' }).format(new Date(syncedAt)),
            )}
          </span>
        )}
      </div>
    </section>
  );
}
