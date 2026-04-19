'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, AlertCircle, PlusCircle, Zap } from 'lucide-react';
import { TaskForm, EMPTY_TASK, type TaskFormData, type Listing } from '@/components/pms/TaskForm';

export default function NewTaskPage() {
  const locale = useLocale();
  const el = locale === 'el';
  const search = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [initial, setInitial] = useState<TaskFormData>(EMPTY_TASK);

  const t = {
    back: el ? 'Πίσω στις εργασίες' : 'Back to tasks',
    title: el ? 'Νέα εργασία' : 'New task',
    sub: el
      ? 'Καθαρισμός, συντήρηση, check-in — ανάθεσε σε συνεργάτη και όρισε κόστος.'
      : 'Cleaning, maintenance, check-in — assign to a vendor and set cost.',
    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    noListings: el
      ? 'Δεν έχεις ακόμη καταλύματα. Φτιάξε πρώτα ένα listing.'
      : "You don't have any listings yet. Create a listing first.",
    toListings: el ? 'Στα καταλύματά μου' : 'Go to my listings',
  };

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setLoadError(authErr?.message || 'Not signed in'); return; }

        const { data, error } = await supabase
          .from('listings')
          .select('id, slug, title_el, title_en')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        if (error) { setLoadError(error.message); return; }
        setListings(data || []);

        const listingQ = search?.get('listing_id') || '';
        const bookingQ = search?.get('booking_id') || '';
        const schedQ = search?.get('scheduled_at') || '';

        const chosen = listingQ || (data && data[0]?.id) || '';
        const defaultSched = schedQ || defaultTomorrowAt10();

        setInitial({
          ...EMPTY_TASK,
          listing_id: chosen,
          booking_id: bookingQ || null,
          scheduled_at: defaultSched,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [search]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms/tasks" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
            <PlusCircle className="w-6 h-6" />
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
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-sm">
            {t.toListings}
          </Link>
        </div>
      ) : (
        <TaskForm
          mode="create"
          initial={initial}
          listings={listings}
          el={el}
        />
      )}
    </div>
  );
}

function defaultTomorrowAt10(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}
