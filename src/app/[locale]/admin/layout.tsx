'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard, Users, List, MapPin, Waves, UtensilsCrossed,
  Landmark, Zap, FileText, Settings, Home, LogOut, Loader2, Shield,
  ScrollText, Menu, X, Image, BarChart3, MessageSquare, ClipboardList,
} from 'lucide-react';

const navSections = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/users', icon: Users, label: 'Users' },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/listings', icon: List, label: 'Listings' },
      { href: '/admin/areas', icon: MapPin, label: 'Areas' },
      { href: '/admin/beaches', icon: Waves, label: 'Beaches' },
      { href: '/admin/restaurants', icon: UtensilsCrossed, label: 'Restaurants' },
      { href: '/admin/activities', icon: Landmark, label: 'Activities' },
      { href: '/admin/blog', icon: FileText, label: 'Blog' },
    ],
  },
  {
    title: 'Community',
    items: [
      { href: '/admin/submissions', icon: ClipboardList, label: 'Submissions' },
      { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { href: '/admin/images', icon: Image, label: 'Images' },
      { href: '/admin/seo', icon: BarChart3, label: 'SEO' },
      { href: '/admin/tools', icon: Zap, label: 'Tools' },
      { href: '/admin/logs', icon: ScrollText, label: 'Logs' },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role !== 'superadmin') { router.push('/dashboard'); return; }
      setRole(data.role);
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
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  if (role !== 'superadmin') return null;

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  function NavContent() {
    return (
      <>
        <div className="mb-4 pb-4 border-b border-red-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          <span className="font-bold text-red-600">Super Admin</span>
        </div>

        <nav className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{section.title}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
                      }`}>
                      <item.icon className="w-4 h-4" />{item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <hr className="my-4" />

        <div className="space-y-0.5">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
            <Home className="w-4 h-4" />Owner Dashboard
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
            <Home className="w-4 h-4" />View Site
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between mb-4 bg-white border border-red-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          <span className="font-bold text-red-600 text-sm">Admin</span>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg hover:bg-red-50">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-600">Super Admin</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <nav className="space-y-5">
                {navSections.map((section) => (
                  <div key={section.title}>
                    <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{section.title}</p>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link key={item.href} href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              active
                                ? 'bg-red-600 text-white'
                                : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
                            }`}>
                            <item.icon className="w-5 h-5" />{item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <hr className="my-4" />

              <div className="space-y-0.5">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <Home className="w-5 h-5" />Owner Dashboard
                </Link>
                <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <Home className="w-5 h-5" />View Site
                </Link>
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="w-5 h-5" />Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block md:w-64 shrink-0">
          <div className="bg-white border border-red-200 rounded-2xl p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <NavContent />
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
