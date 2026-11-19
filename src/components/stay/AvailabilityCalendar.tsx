import { htmlLang, type Locale } from '@/i18n/config';
import { adminDb, publicDb } from '@/lib/supabase/clients';

/**
 * Owner-maintained availability (listing_availability), rendered on the
 * server for the next three months. Booked/blocked days are struck through.
 * Days imported from Airbnb / Booking.com iCal feeds live in the same table;
 * when the listing has feeds we also say when they were last synced.
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
  labels: { free: string; busy: string; updated: string };
}) {
  const start = new Date();
  start.setUTCDate(1);
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 3, 0));
  const { data } = await publicDb()
    .from('listing_availability')
    .select('date, status')
    .eq('listing_id', listingId)
    .gte('date', start.toISOString().slice(0, 10))
    .lte('date', end.toISOString().slice(0, 10));
  // Days before today (Greek calendar) can no longer be booked: shown greyed, not as free.
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
  const busy = new Set((data ?? []).filter((d) => d.status !== 'available').map((d) => d.date as string));

  // Feed URLs are private (RLS, no policies), so read only the sync time with the service role.
  const { data: feed } = await adminDb()
    .from('listing_ical_feeds')
    .select('last_synced_at')
    .eq('listing_id', listingId)
    .eq('last_status', 'ok')
    .order('last_synced_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  const syncedAt = feed?.last_synced_at as string | undefined;

  const lang = htmlLang[locale];
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(lang, { weekday: 'narrow' }).format(new Date(Date.UTC(2024, 0, 1 + i))),
  );
  const months = [0, 1, 2].map((offset) => {
    const first = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + offset, 1));
    const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    const lead = (first.getUTCDay() + 6) % 7; // Monday first
    return {
      label: new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(first),
      cells: [
        ...Array.from({ length: lead }, () => null),
        ...Array.from({ length: days }, (_, d) => {
          const iso = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), d + 1)).toISOString().slice(0, 10);
          return { day: d + 1, busy: busy.has(iso), past: iso < today };
        }),
      ],
    };
  });

  return (
    <section aria-labelledby="availability" className="mt-14">
      <h2 id="availability" className="font-display text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <div key={m.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-center text-sm font-semibold capitalize text-slate-800">{m.label}</p>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {weekdays.map((w, i) => (
                <span key={i} className="pb-1 font-medium text-slate-400">{w}</span>
              ))}
              {m.cells.map((c, i) =>
                c ? (
                  <span
                    key={i}
                    className={`rounded-md py-1.5 ${c.past ? 'text-slate-300' : c.busy ? 'bg-slate-100 text-slate-400 line-through' : 'bg-emerald-50 font-medium text-emerald-800'}`}
                  >
                    {c.day}
                  </span>
                ) : (
                  <span key={i} />
                ),
              )}
            </div>
          </div>
        ))}
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
