'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, AlertCircle, PlusCircle, Zap } from 'lucide-react';
import { PricingRuleForm, EMPTY_RULE, type PricingRuleData, type Listing } from '@/components/pms/PricingRuleForm';

export default function NewPricingRulePage() {
  const locale = useLocale();
  const el = locale === 'el';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [initial, setInitial] = useState<PricingRuleData>(EMPTY_RULE);

  const t = {
    back: el ? 'Πίσω στους κανόνες' : 'Back to rules',
    title: el ? 'Νέος κανόνας τιμολόγησης' : 'New pricing rule',
    sub: el
      ? 'Seasonal premium, Σ/Κ rate, LOS discount — σε κάτω από ένα λεπτό.'
      : 'Seasonal premium, weekend rate, LOS discount — in under a minute.',
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
          .select('id, slug, title_el, title_en, price_per_night')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        if (error) { setLoadError(error.message); return; }
        setListings(data || []);
        setInitial({ ...EMPTY_RULE, listing_id: (data && data[0]?.id) || '' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms/pricing" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700">
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
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-sm">
            {t.toListings}
          </Link>
        </div>
      ) : (
        <PricingRuleForm
          mode="create"
          initial={initial}
          listings={listings}
          el={el}
        />
      )}
    </div>
  );
}
