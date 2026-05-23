'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, ArrowRight, Globe, Share2, Search, ExternalLink, X } from 'lucide-react';

const DISMISS_KEY = 'hostPagePromoBanner.dismissed';

type State =
  | { kind: 'loading' }
  | { kind: 'hidden' }
  | { kind: 'promo'; publishedCount: number }
  | { kind: 'enabled'; slug: string };

const COPY: Record<string, Record<string, string>> = {
  el: {
    eyebrow: 'Νέο για ιδιοκτήτες με 2+ καταλύματα',
    title: 'Φτιάξε τη δική σου σελίδα φιλοξενίας',
    subtitle: 'Μία σελίδα που συγκεντρώνει όλα τα καταλύματά σου — με δικό σου URL, bio, λογότυπο και contact. Μοιράσου ένα link και προβάλλεις ολόκληρο το χαρτοφυλάκιό σου.',
    benefit1Title: 'Ένα link για όλα',
    benefit1Body: 'chalkidikihub.gr/host/{όνομα}',
    benefit2Title: 'Brand & SEO boost',
    benefit2Body: 'Schema.org Person markup + sitemap',
    benefit3Title: 'AI discoverability',
    benefit3Body: 'Το ChatGPT/Gemini σε προτείνει ως host',
    cta: 'Φτιάξε τη σελίδα σου',
    dismiss: 'Αργότερα',
    enabledTitle: 'Η δημόσια σελίδα σου είναι ενεργή',
    enabledBody: 'Όλα τα καταλύματά σου είναι online σε μία σελίδα.',
    viewPage: 'Δες τη σελίδα',
    editPage: 'Επεξεργασία',
  },
  en: {
    eyebrow: 'New for owners with 2+ properties',
    title: 'Create your own host page',
    subtitle: 'One page that bundles all your properties — with your own URL, bio, logo and contact. Share a single link to showcase your full portfolio.',
    benefit1Title: 'One link to rule them all',
    benefit1Body: 'chalkidikihub.gr/host/{your-name}',
    benefit2Title: 'Brand & SEO boost',
    benefit2Body: 'Schema.org Person markup + sitemap',
    benefit3Title: 'AI discoverability',
    benefit3Body: 'ChatGPT/Gemini recommend you as a host',
    cta: 'Set up my host page',
    dismiss: 'Maybe later',
    enabledTitle: 'Your public host page is live',
    enabledBody: 'All your properties live together on one page.',
    viewPage: 'View page',
    editPage: 'Edit',
  },
};

export function HostPagePromoBanner() {
  const locale = useLocale();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setState({ kind: 'hidden' }); return; }

      // Count published listings owned by this user
      const { count } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'published');

      if (!count || count < 2) { setState({ kind: 'hidden' }); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('public_slug, public_page_enabled')
        .eq('id', user.id)
        .single();

      if (profile?.public_page_enabled && profile.public_slug) {
        setState({ kind: 'enabled', slug: profile.public_slug });
        return;
      }

      // Show the promo unless the user dismissed it this session
      const dismissed = typeof window !== 'undefined' && sessionStorage.getItem(DISMISS_KEY) === '1';
      if (dismissed) { setState({ kind: 'hidden' }); return; }

      setState({ kind: 'promo', publishedCount: count });
    })();
  }, []);

  if (state.kind === 'loading' || state.kind === 'hidden') return null;

  const t = COPY[locale] || COPY.en;

  // Already enabled — small confirmation card
  if (state.kind === 'enabled') {
    return (
      <div className="mb-5 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 ring-1 ring-emerald-100">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-emerald-900 text-sm">{t.enabledTitle}</p>
          <p className="text-xs text-emerald-700/80 mt-0.5">{t.enabledBody}</p>
        </div>
        <a
          href={`/${locale}/host/${state.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition"
        >
          {t.viewPage} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition"
        >
          {t.editPage}
        </Link>
      </div>
    );
  }

  // Promo banner
  function dismiss() {
    if (typeof window !== 'undefined') sessionStorage.setItem(DISMISS_KEY, '1');
    setState({ kind: 'hidden' });
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-700 text-white shadow-xl ring-1 ring-white/10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-amber-300/20 blur-3xl" />

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative px-6 sm:px-8 py-7 sm:py-9">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {t.eyebrow}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
          {t.title}
        </h2>
        <p className="text-white/85 max-w-2xl text-sm sm:text-base leading-relaxed mb-6">
          {t.subtitle}
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
            <Share2 className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t.benefit1Title}</p>
              <p className="text-xs text-white/70 mt-0.5 font-mono truncate">{t.benefit1Body}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
            <Search className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t.benefit2Title}</p>
              <p className="text-xs text-white/70 mt-0.5">{t.benefit2Body}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
            <Globe className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t.benefit3Title}</p>
              <p className="text-xs text-white/70 mt-0.5">{t.benefit3Body}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-primary-700 font-semibold text-sm hover:bg-amber-50 transition shadow-lg shadow-black/10"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={dismiss}
            className="text-sm text-white/70 hover:text-white transition"
          >
            {t.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
