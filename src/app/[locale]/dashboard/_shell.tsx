'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard, Home, List, User, LogOut, UtensilsCrossed, Landmark, FileText,
  ClipboardList, Menu, X, Building, Plus, PlusCircle, Bell, Zap, MailWarning,
  BookOpen, ChevronDown, CheckCircle2, Circle, Lightbulb, CreditCard,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const MORE_OPEN_KEY = 'chub_dash_more_open';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [unresponded, setUnresponded] = useState(0);
  const [emailUnverified, setEmailUnverified] = useState(false);
  const [onboarding, setOnboarding] = useState({ email: false, listing: false, photos: false, contact: false });
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tSales = useTranslations('sales');
  const tSub = useTranslations('submissions');
  const locale = useLocale();
  const el = locale === 'el';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MORE_OPEN_KEY);
      if (saved != null) setMoreOpen(saved === '1');
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/auth/login'); return; }
      const uid = data.user.id;
      setUser(data.user);

      // Email verification status (existing users grandfathered as verified)
      const { data: profile } = await supabase
        .from('profiles').select('email_verified_at').eq('id', uid).single();
      const emailVerified = !(profile && !profile.email_verified_at);
      setEmailUnverified(!emailVerified);

      // Listings (for onboarding: has listing / has contact / has photos)
      const { data: listings } = await supabase
        .from('listings').select('id, contact_phone, contact_email').eq('owner_id', uid);
      const hasListing = (listings?.length || 0) > 0;
      const hasContact = listings?.some((l) => l.contact_phone || l.contact_email) || false;
      let hasPhotos = false;
      if (hasListing) {
        const ids = listings!.map((l) => l.id);
        const { count } = await supabase
          .from('listing_images').select('id', { count: 'exact', head: true }).in('listing_id', ids);
        hasPhotos = (count || 0) > 0;
      }
      setOnboarding({ email: emailVerified, listing: hasListing, photos: hasPhotos, contact: hasContact });

      // Pending community submissions (badge on "More")
      const { count: subCount } = await supabase
        .from('user_submissions').select('*', { count: 'exact', head: true })
        .eq('user_id', uid).eq('status', 'pending');
      setPendingCount(subCount || 0);

      // Availability requests still active that this owner hasn't answered yet.
      const { data: recips } = await supabase
        .from('availability_request_recipients').select('request_id')
        .eq('owner_id', uid).eq('send_status', 'sent');
      const reqIds = [...new Set((recips || []).map((r) => r.request_id))];
      if (reqIds.length) {
        const { data: activeReqs } = await supabase
          .from('availability_requests').select('id').in('id', reqIds).eq('status', 'active');
        const activeIds = (activeReqs || []).map((r) => r.id);
        if (activeIds.length) {
          const { data: myResp } = await supabase
            .from('availability_responses').select('request_id')
            .eq('owner_id', uid).in('request_id', activeIds);
          const answered = new Set((myResp || []).map((r) => r.request_id));
          setUnresponded(activeIds.filter((id) => !answered.has(id)).length);
        }
      }

      setLoading(false);
    });
  }, [router]);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  function toggleMore() {
    setMoreOpen((o) => {
      const next = !o;
      try { localStorage.setItem(MORE_OPEN_KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-slate-200"></div>
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin absolute inset-0"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  const mainItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/dashboard/listings', icon: List, label: t('myListings') },
    { href: '/dashboard/broadcast-settings', icon: Bell, label: el ? 'Αιτήματα επισκεπτών' : 'Guest requests', badge: unresponded, tone: 'red' as const },
    { href: '/dashboard/last-minute', icon: Zap, label: el ? 'Last-minute' : 'Last-minute' },
  ];
  const moreItems = [
    { href: '/dashboard/sales', icon: Building, label: tSales('mySales') },
    { href: '/dashboard/sales/new', icon: Plus, label: tSales('newSale') },
    { href: '/dashboard/suggest-restaurant', icon: UtensilsCrossed, label: tSub('suggestRestaurant') },
    { href: '/dashboard/suggest-activity', icon: Landmark, label: tSub('suggestActivity') },
    { href: '/dashboard/suggest-blog', icon: FileText, label: tSub('suggestBlog') },
    { href: '/dashboard/submissions', icon: ClipboardList, label: tSub('mySubmissions'), badge: pendingCount, tone: 'amber' as const },
  ];

  const steps = [
    { done: onboarding.email, href: '/auth/verify', label: el ? 'Επιβεβαίωση email' : 'Verify email' },
    { done: onboarding.listing, href: '/dashboard/listings/new', label: el ? 'Πρώτο κατάλυμα' : 'First listing' },
    { done: onboarding.photos, href: '/dashboard/listings', label: el ? 'Ανέβασε φωτογραφίες' : 'Add photos' },
    { done: onboarding.contact, href: '/dashboard/listings', label: el ? 'Στοιχεία επικοινωνίας' : 'Contact details' },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const onboardingComplete = doneCount === steps.length;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Owner';
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  function NavItem({ href, icon: Icon, label, badge, tone }: {
    href: string; icon: React.ElementType; label: string; badge?: number; tone?: 'red' | 'amber' | 'sky';
  }) {
    const active = isActive(href);
    const toneCls = tone === 'red' ? 'bg-rose-500 text-white' : tone === 'sky' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700';
    return (
      <Link href={href}
        className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}>
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-emerald-400" />}
        <Icon className={`w-4 h-4 ${active ? 'text-emerald-300' : ''}`} />
        <span className="flex-1">{label}</span>
        {badge != null && badge > 0 && (
          <span className={`min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[10px] font-semibold tabular-nums ${
            active ? 'bg-emerald-500 text-white' : toneCls
          }`}>{badge}</span>
        )}
      </Link>
    );
  }

  function NavContent() {
    return (
      <>
        <div className="mb-4 pb-4 border-b border-slate-100 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-sm shrink-0">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 truncate">{displayName}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
        </div>

        {/* Primary action */}
        <Link href="/dashboard/listings/new"
          className="mb-4 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold shadow-sm transition-all">
          <PlusCircle className="w-4 h-4" /> {el ? 'Νέα Καταχώρηση' : 'Add Listing'}
        </Link>

        {/* Onboarding checklist — disappears once complete */}
        {!onboardingComplete && (
          <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-800">{el ? 'Ξεκίνα εδώ' : 'Get started'}</span>
              <span className="text-[11px] font-semibold text-emerald-700 tabular-nums">{doneCount}/{steps.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-emerald-100 overflow-hidden mb-2.5">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.round((doneCount / steps.length) * 100)}%` }} />
            </div>
            <ul className="space-y-1.5">
              {steps.map((s) => (
                <li key={s.label}>
                  {s.done ? (
                    <span className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-slate-400 line-through">{s.label}</span>
                    </span>
                  ) : (
                    <Link href={s.href} className="flex items-center gap-2 text-xs text-slate-600 hover:text-emerald-700">
                      <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span>{s.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main */}
        <nav className="space-y-0.5">
          {mainItems.map((it) => <NavItem key={it.href} {...it} />)}
        </nav>

        {/* More (collapsible) */}
        <div className="mt-4">
          <button onClick={toggleMore}
            className="w-full flex items-center justify-between px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 hover:text-slate-600">
            <span className="flex items-center gap-2">
              {el ? 'Επιπλέον' : 'More'}
              {!moreOpen && pendingCount > 0 && (
                <span className="min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full bg-amber-100 text-amber-700 text-[9px] font-semibold tabular-nums">{pendingCount}</span>
              )}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
          </button>
          {moreOpen && (
            <nav className="space-y-0.5">
              {moreItems.map((it) => <NavItem key={it.href} {...it} />)}
            </nav>
          )}
        </div>

        <hr className="my-4 border-slate-100" />

        {/* Account */}
        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{el ? 'Λογαριασμός' : 'Account'}</p>
        <div className="space-y-0.5">
          <NavItem href="/dashboard/profile" icon={User} label={t('profile')} />
          <NavItem href="/dashboard/billing" icon={CreditCard} label={el ? 'Χρέωση' : 'Billing'} />
          <Link href="/for-owners/guide" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <BookOpen className="w-4 h-4" />{el ? 'Οδηγός & Βοήθεια' : 'Guide & Help'}
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <Home className="w-4 h-4" />{el ? 'Ιστότοπος' : 'View site'}
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50">
            <LogOut className="w-4 h-4" />{t('logout')}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-semibold shrink-0">
              {initials}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{displayName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unresponded > 0 && (
              <span className="min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-semibold tabular-nums">{unresponded}</span>
            )}
            <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg hover:bg-slate-100">
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-semibold shrink-0">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{displayName}</div>
                    <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                  </div>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-4">
                <NavContent />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden md:block md:w-64 shrink-0">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto shadow-sm">
              <NavContent />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {emailUnverified && (
              <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                <MailWarning className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm text-amber-800">
                  {el
                    ? 'Το email σας δεν έχει επιβεβαιωθεί. Τα καταλύματά σας δεν θα δημοσιευτούν μέχρι να το επιβεβαιώσετε.'
                    : 'Your email is not verified yet. Your listings will not be published until you verify it.'}
                </div>
                <Link href="/auth/verify"
                  className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors">
                  {el ? 'Επιβεβαίωση' : 'Verify now'}
                </Link>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
