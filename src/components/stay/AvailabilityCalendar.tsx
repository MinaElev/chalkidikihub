import { htmlLang, type Locale } from '@/i18n/config';
import { publicDb } from '@/lib/supabase/clients';

/**
 * Owner-maintained availability (listing_availability), rendered on the
 * server for the next three months. Booked/blocked days are struck through.
 */
export async function AvailabilityCalendar({ listingId, locale, title }: { listingId: string; locale: Locale; title: string }) {
  const start = new Date();
  start.setUTCDate(1);
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 3, 0));
  const { data } = await publicDb()
    .from('listing_availability')
    .select('date, status')
    .eq('listing_id', listingId)
    .gte('date', start.toISOString().slice(0, 10))
    .lte('date', end.toISOString().slice(0, 10));
  const busy = new Set((data ?? []).filter((d) => d.status !== 'available').map((d) => d.date as string));

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
          return { day: d + 1, busy: busy.has(iso) };
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
                    className={`rounded-md py-1.5 ${c.busy ? 'bg-slate-100 text-slate-400 line-through' : 'bg-emerald-50 font-medium text-emerald-800'}`}
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
    </section>
  );
}
