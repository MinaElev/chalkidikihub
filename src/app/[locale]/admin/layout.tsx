'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard, Users, List, MapPin, Waves, UtensilsCrossed,
  Landmark, Wrench, FileText, Settings, Home, LogOut, Loader2, Shield,
  ScrollText, Menu, X, Image, BarChart3, MessageSquare, ClipboardList, Mail,
  Sparkles, Star, Building, Tag, Languages, ShieldCheck, Church, Link2, QrCode, Wand2,
} from 'lucide-react';

const navSections = [
  {
    title: 'Home',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    title: 'Places',
    items: [
      { href: '/admin/beaches', icon: Waves, label: 'Beaches' },
      { href: '/admin/restaurants', icon: UtensilsCrossed, label: 'Restaurants' },
      { href: '/admin/activities', icon: Landmark, label: 'Activities' },
      { href: '/admin/areas', icon: MapPin, label: 'Areas' },
      { href: '/admin/villages', icon: MapPin, label: 'Villages' },
      { href: '/admin/monasteries', icon: Church, label: 'Monasteries' },
    ],
  },
  {
    title: 'Properties',
    items: [
      { href: '/admin/listings', icon: List, label: 'Listings' },
      { href: '/admin/brand-sites', icon: Wand2, label: 'Brand Sites' },
      { href: '/admin/sales', icon: Building, label: 'Sales' },
      { href: '/admin/business-types', icon: Tag, label: 'Business Types' },
    ],
  },
  {
    title: 'Editorial',
    items: [
      { href: '/admin/blog', icon: FileText, label: 'Blog' },
      { href: '/admin/seo', icon: BarChart3, label: 'SEO Dashboard' },
      { href: '/admin/social-kit-stats', icon: BarChart3, label: 'Social Kit Stats' },
      { href: '/admin/seo-audit', icon: BarChart3, label: 'SEO Audit' },
      { href: '/admin/seo-health', icon: BarChart3, label: 'SEO Health (live HTML)' },
      { href: '/admin/translations', icon: Languages, label: 'Translations' },
      { href: '/admin/quality', icon: ShieldCheck, label: 'Quality Check' },
    ],
  },
  {
    title: 'Moderation',
    items: [
      { href: '/admin/reviews', icon: Star, label: 'Reviews' },
      { href: '/admin/submissions', icon: ClipboardList, label: 'Submissions' },
      { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
      { href: '/admin/email', icon: Mail, label: 'Mass Email' },
      { href: '/admin/qr-email', icon: QrCode, label: 'QR Email' },
    ],
  },
  {
    title: 'Data & Media',
    items: [
      { href: '/admin/google-import', icon: MapPin, label: 'Google Import' },
      { href: '/admin/ai-import', icon: Sparkles, label: 'AI Import' },
      { href: '/admin/images', icon: Image, label: 'Images' },
      { href: '/admin/tools', icon: Wrench, label: 'SEO Tools' },
      { href: '/admin/broken-links', icon: Link2, label: 'Broken Links' },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/users', icon: Users, label: 'Users' },
      { href: '/admin/logs', icon: ScrollText, label: 'Logs' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role !== 'superadmin') { router.push('/dashboard'); return; }
      setRole(data.role);
      // Fetch badge counts
      const [subRes, msgRes, revBeach, revRest, revAct] = await Promise.all([
        supabase.from('user_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_messages').select('subject').eq('read', false),
        supabase.from('beach_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('restaurant_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('activity_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      const unreadMsgs = (msgRes.data || []).filter(m => !m.subject?.startsWith('Αίτημα διαθεσιμότητας')).length;
      const pendingReviews = (revBeach.count || 0) + (revRest.count || 0) + (revAct.count || 0);
      setBadges({
        '/admin/submissions': subRes.count || 0,
        '/admin/messages': unreadMsgs || 0,
        '/admin/reviews': pendingReviews,
      });
      setLoading(false);
    });
  }, [router]);

  // Close drawer on navigation
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

  if (role !== 'superadmin') return null;

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  function NavContent() {
    return (
      <>
        <div className="mb-5 pb-4 border-b border-slate-100 flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
            <Shield className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Super admin</div>
            <div className="text-xs text-slate-500">Control center</div>
          </div>
        </div>

        <nav className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{section.title}</p>
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
                      {badges[item.href] > 0 && (
                        <span className={`min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[10px] font-semibold tabular-nums ${
                          active ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                        }`}>{badges[item.href]}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <hr className="my-4 border-slate-100" />

        <div className="space-y-0.5">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <Home className="w-4 h-4" />Owner dashboard
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <Home className="w-4 h-4" />View site
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50">
            <LogOut className="w-4 h-4" />Sign out
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 leading-none">Super admin</div>
              <div className="text-xs text-slate-500 leading-tight">Control center</div>
            </div>
          </div>
          <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Mobile drawer overlay */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <Shield className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 leading-none">Super admin</div>
                    <div className="text-xs text-slate-500 leading-tight">Control center</div>
                  </div>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-4">
                <nav className="space-y-5">
                  {navSections.map((section) => (
                    <div key={section.title}>
                      <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{section.title}</p>
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const active = isActive(item.href);
                          return (
                            <Link key={item.href} href={item.href}
                              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                active
                                  ? 'bg-slate-900 text-white shadow-sm'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}>
                              {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-emerald-400" />}
                              <item.icon className={`w-5 h-5 ${active ? 'text-emerald-300' : ''}`} />
                              <span className="flex-1">{item.label}</span>
                              {badges[item.href] > 0 && (
                                <span className={`min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[10px] font-semibold tabular-nums ${
                                  active ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                                }`}>{badges[item.href]}</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>

                <hr className="my-4 border-slate-100" />

                <div className="space-y-0.5">
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                    <Home className="w-5 h-5" />Owner dashboard
                  </Link>
                  <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                    <Home className="w-5 h-5" />View site
                  </Link>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50">
                    <LogOut className="w-5 h-5" />Sign out
                  </button>
                </div>
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

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
