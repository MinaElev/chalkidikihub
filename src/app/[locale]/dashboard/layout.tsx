'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LayoutDashboard, Home, List, User, LogOut, Loader2, UtensilsCrossed, Landmark, FileText, ClipboardList, Menu, X, Building, Plus, PlusCircle, CalendarDays, Inbox, DollarSign, Sparkles as SparklesIcon, Wrench, Settings as SettingsIcon, TrendingUp, Zap } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tSales = useTranslations('sales');
  const tSub = useTranslations('submissions');
  const locale = useLocale();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/auth/login');
      } else {
        setUser(data.user);
        // Fetch pending submission count
        const { count } = await supabase
          .from('user_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', data.user.id)
          .eq('status', 'pending');
        setPendingCount(count || 0);
      }
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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
    // /dashboard/pms (Command Center) should only light up on exact match —
    // its sub-pages (calendar, bookings, …) each have their own nav item.
    if (href === '/dashboard/pms') return pathname === '/dashboard/pms';
    // Everything under /dashboard/listings — including /brand, /availability,
    // /qr, /edit, /new — lights up "Τα καταλύματά μου".
    return pathname.startsWith(href);
  }

  const navSections = [
    {
      title: '',
      items: [
        { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
        { href: '/dashboard/profile', icon: User, label: t('profile') },
      ],
    },
    {
      title: t('myListings'),
      items: [
        { href: '/dashboard/listings', icon: List, label: t('myListings') },
        { href: '/dashboard/listings/new', icon: PlusCircle, label: locale === 'el' ? 'Νέο Κατάλυμα' : 'Add Listing' },
      ],
    },
    {
      title: tSales('mySales'),
      items: [
        { href: '/dashboard/sales', icon: Building, label: tSales('mySales') },
        { href: '/dashboard/sales/new', icon: Plus, label: tSales('newSale') },
      ],
    },
    {
      title: locale === 'el' ? 'Κοινότητα' : 'Community',
      items: [
        { href: '/dashboard/suggest-restaurant', icon: UtensilsCrossed, label: tSub('suggestRestaurant') },
        { href: '/dashboard/suggest-activity', icon: Landmark, label: tSub('suggestActivity') },
        { href: '/dashboard/suggest-blog', icon: FileText, label: tSub('suggestBlog') },
        { href: '/dashboard/submissions', icon: ClipboardList, label: tSub('mySubmissions') },
      ],
    },
  ];

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Owner';
  const initials = displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  function NavContent() {
    return (
      <>
        <div className="mb-5 pb-4 border-b border-slate-100 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-sm shrink-0">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 truncate">{displayName}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
        </div>

        <nav className="space-y-5">
          {navSections.map((section, i) => (
            <div key={i}>
              {i > 0 && <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{section.title}</p>}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href}
                      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}>
                      {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-emerald-400" />}
                      <item.icon className={`w-4 h-4 ${active ? 'text-emerald-300' : ''}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.href === '/dashboard/submissions' && pendingCount > 0 && (
                        <span className={`min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[10px] font-semibold tabular-nums ${
                          active ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                        }`}>{pendingCount}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ═══ PMS SECTION — premium / distinct ═════════════════════════ */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="relative overflow-hidden rounded-2xl p-3.5 mb-2.5 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 shadow-lg shadow-violet-500/20">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />
            <div className="relative flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-wide">PMS</span>
                  <span className="px-1.5 py-px rounded-full bg-white/20 text-[9px] font-bold text-white uppercase tracking-wider">Beta</span>
                </div>
                <div className="text-[10px] text-white/80 leading-tight mt-px">
                  {locale === 'el' ? 'Διαχείριση καταλυμάτων' : 'Property management'}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-0.5">
            {[
              { href: '/dashboard/pms',              icon: LayoutDashboard, label: locale === 'el' ? 'Command Center' : 'Command Center' },
              { href: '/dashboard/pms/calendar',     icon: CalendarDays,    label: locale === 'el' ? 'Ημερολόγιο & Sync' : 'Calendar & Sync' },
              { href: '/dashboard/pms/bookings',     icon: ClipboardList,   label: locale === 'el' ? 'Κρατήσεις' : 'Bookings' },
              { href: '/dashboard/pms/messages',     icon: Inbox,           label: locale === 'el' ? 'Μηνύματα' : 'Messages' },
              { href: '/dashboard/pms/pricing',      icon: DollarSign,      label: locale === 'el' ? 'Τιμολόγηση' : 'Pricing' },
              { href: '/dashboard/pms/automations',  icon: SparklesIcon,    label: locale === 'el' ? 'Αυτοματισμοί' : 'Automations' },
              { href: '/dashboard/pms/tasks',        icon: Wrench,          label: locale === 'el' ? 'Καθαριότητα' : 'Tasks' },
              { href: '/dashboard/pms/finance',      icon: TrendingUp,      label: locale === 'el' ? 'Οικονομικά' : 'Finance' },
              { href: '/dashboard/pms/settings',     icon: SettingsIcon,    label: locale === 'el' ? 'Ρυθμίσεις' : 'Settings' },
            ].map(item => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'
                  }`}>
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-fuchsia-300" />}
                  <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-violet-500'}`} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
        {/* ═══ /PMS SECTION ══════════════════════════════════════════════ */}

        <hr className="my-4 border-slate-100" />

        <div className="space-y-0.5">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <Home className="w-4 h-4" />{t('home')}
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
          <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
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
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 sticky top-24 shadow-sm">
              <NavContent />
            </div>
          </aside>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
