'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, AlertCircle, PlusCircle, Zap } from 'lucide-react';
import { TemplateForm, EMPTY_TEMPLATE, type TemplateFormData, type Listing } from '@/components/pms/TemplateForm';

export default function NewTemplatePage() {
  const locale = useLocale();
  const el = locale === 'el';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [initial] = useState<TemplateFormData>(EMPTY_TEMPLATE);

  const t = {
    back: el ? 'Πίσω στους αυτοματισμούς' : 'Back to automations',
    title: el ? 'Νέο template μηνύματος' : 'New message template',
    sub: el
      ? 'Ορίζεις trigger + content σε όσες γλώσσες θες. Ενεργοποιείς/παύεις ανά πάσα στιγμή.'
      : 'Set trigger + content in any language. Toggle on/off any time.',
    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
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
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms/automations" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-fuchsia-500 via-fuchsia-600 to-pink-700">
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

      <TemplateForm
        mode="create"
        initial={initial}
        listings={listings}
        el={el}
      />
    </div>
  );
}
