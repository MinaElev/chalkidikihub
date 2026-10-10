'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard, Users, List, MapPin, Waves, UtensilsCrossed,
  Landmark, Wrench, FileText, Settings, Home, LogOut, Shield,
  ScrollText, Menu, X, Image, BarChart3, MessageSquare, ClipboardList, Mail,
  Sparkles, Star, Building, Tag, Languages, ShieldCheck, Church, Link2, QrCode,
  Wand2, Bell, Zap, AtSign, Layers, Search, ChevronDown, Ticket, Wallet,
} from 'lucide-react';

type Item = { href: string; icon: React.ElementType; label: string; kw?: string };
type Section = { id: string; title: string; defaultOpen: boolean; items: Item[] };

const SECTIONS_KEY = 'chub_admin_sections';

const SECTIONS: Section[] = [
  { id: 'places', title: 'Places', defaultOpen: false, items: [
    { href: '/admin/beaches', icon: Waves, label: 'Beaches', kw: 'παραλίες' },
    { href: '/admin/restaurants', icon: UtensilsCrossed, label: 'Restaurants', kw: 'εστιατόρια φαγητό' },
    { href: '/admin/activities', icon: Landmark, label: 'Activities', kw: 'δραστηριότητες' },
    { href: '/admin/areas', icon: MapPin, label: 'Areas', kw: 'περιοχές πόδια' },
    { href: '/admin/villages', icon: MapPin, label: 'Villages', kw: 'χωριά' },
    { href: '/admin/monasteries', icon: Church, label: 'Monasteries', kw: 'μοναστήρια άθως' },
  ]},
  { id: 'properties', title: 'Properties', defaultOpen: true, items: [
    { href: '/admin/listings', icon: List, label: 'Listings', kw: 'καταλύματα' },
    { href: '/admin/hosts', icon: Users, label: 'Host Pages', kw: 'ιδιοκτήτες' },
    { href: '/admin/brand-sites', icon: Wand2, label: 'Brand Sites' },
    { href: '/admin/sales', icon: Building, label: 'Sales', kw: 'πωλήσεις ακίνητα' },
    { href: '/admin/business-types', icon: Tag, label: 'Business Types' },
    { href: '/admin/discounts', icon: Ticket, label: 'Discount Codes', kw: 'εκπτώσεις κωδικοί coupons billing χρέωση καταχώρηση' },
    { href: '/admin/billing', icon: Wallet, label: 'Billing', kw: 'χρεώσεις πληρωμές έσοδα revenue refund λήξεις' },
  ]},
  { id: 'moderation', title: 'Moderation', defaultOpen: true, items: [
    { href: '/admin/reviews', icon: Star, label: 'Reviews', kw: 'κριτικές αξιολογήσεις' },
    { href: '/admin/submissions', icon: ClipboardList, label: 'Submissions', kw: 'υποβολές' },
    { href: '/admin/messages', icon: MessageSquare, label: 'Messages', kw: 'μηνύματα επικοινωνία' },
    { href: '/admin/availability-requests', icon: Bell, label: 'Availability Requests', kw: 'αιτήματα διαθεσιμότητας' },
    { href: '/admin/guest-emails', icon: AtSign, label: 'Emails Επισκεπτών', kw: 'guest emails newsletter' },
    { href: '/admin/last-minute', icon: Zap, label: 'Last-Minute Deals', kw: 'προσφορές' },
    { href: '/admin/email', icon: Mail, label: 'Mass Email', kw: 'μαζικό email newsletter' },
    { href: '/admin/announce-reviews', icon: Star, label: 'Ανακοίνωση Κριτικών', kw: 'reviews announce' },
    { href: '/admin/qr-email', icon: QrCode, label: 'QR Email' },
  ]},
  { id: 'seo', title: 'SEO & Analytics', defaultOpen: false, items: [
    { href: '/admin/seo', icon: BarChart3, label: 'SEO Dashboard', kw: 'seo analytics' },
    { href: '/admin/seo-audit', icon: BarChart3, label: 'SEO Audit', kw: 'seo' },
    { href: '/admin/seo-health', icon: BarChart3, label: 'SEO Health (live HTML)', kw: 'seo' },
    { href: '/admin/seo-gsc', icon: BarChart3, label: 'Search Console', kw: 'seo gsc google search console index' },
    { href: '/admin/seo-coverage', icon: Layers, label: 'Indexing Coverage', kw: 'seo gsc index coverage indexing' },
    { href: '/admin/social-kit-stats', icon: BarChart3, label: 'Social Kit Stats', kw: 'social analytics' },
    { href: '/admin/tools', icon: Wrench, label: 'SEO Tools', kw: 'seo tools' },
    { href: '/admin/broken-links', icon: Link2, label: 'Broken Links', kw: 'seo 404 links' },
  ]},
  { id: 'editorial', title: 'Editorial', defaultOpen: false, items: [
    { href: '/admin/blog', icon: FileText, label: 'Blog', kw: 'άρθρα' },
    { href: '/admin/translations', icon: Languages, label: 'Translations', kw: 'μεταφράσεις γλώσσες' },
    { href: '/admin/quality', icon: ShieldCheck, label: 'Quality Check', kw: 'ποιότητα' },
    { href: '/admin/monthly-report', icon: Mail, label: 'Monthly Owner Report', kw: 'report email' },
  ]},
  { id: 'data', title: 'Data & Media', defaultOpen: false, items: [
    { href: '/admin/google-import', icon: MapPin, label: 'Google Import', kw: 'import' },
    { href: '/admin/ai-import', icon: Sparkles, label: 'AI Import', kw: 'import openai' },
    { href: '/admin/images', icon: Image, label: 'Images', kw: 'εικόνες φωτογραφίες media' },
  ]},
  { id: 'system', title: 'System', defaultOpen: false, items: [
    { href: '/admin/users', icon: Users, label: 'Users', kw: 'χρήστες' },
    { href: '/admin/logs', icon: ScrollText, label: 'Logs', kw: 'activity' },
    { href: '/admin/settings', icon: Settings, label: 'Settings', kw: 'ρυθμίσεις' },
  ]},
];

// Which badge counts surface in the "needs attention" strip.
const ATTENTION: { href: string; label: string; icon: React.ElementType }[] = [
  { href: '/admin/reviews', label: 'Κριτικές', icon: Star },
  { href: '/admin/submissions', label: 'Υποβολές', icon: ClipboardList },
  { href: '/admin/messages', label: 'Μηνύματα', icon: MessageSquare },
  { href: '/admin/availability-requests', label: 'Αιτήματα', icon: Bell },
  { href: '/admin/last-minute', label: 'Last-minute', icon: Zap },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.id, s.defaultOpen]))
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SECTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        setOpen((cur) => ({ ...cur, ...parsed }));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role !== 'superadmin') { router.push('/dashboard'); return; }
      setRole(data.role);
      const todayStr = new Date().toISOString().slice(0, 10);
      const [subRes, msgRes, revBeach, revRest, revAct, availRes, lmdRes] = await Promise.all([
        supabase.from('user_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_messages').select('subject').eq('read', false),
        supabase.from('beach_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('restaurant_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('activity_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('availability_requests').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('last_minute_deals').select('*', { count: 'exact', head: true }).eq('status', 'active').gte('end_date', todayStr),
      ]);
      const unreadMsgs = (msgRes.data || []).filter(m => !m.subject?.startsWith('Αίτημα διαθεσιμότητας')).length;
      const pendingReviews = (revBeach.count || 0) + (revRest.count || 0) + (revAct.count || 0);
      setBadges({
        '/admin/submissions': subRes.count || 0,
        '/admin/messages': unreadMsgs || 0,
        '/admin/reviews': pendingReviews,
        '/admin/availability-requests': availRes.count || 0,
        '/admin/last-minute': lmdRes.count || 0,
      });
      setLoading(false);
    });
  }, [router]);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  function toggleSection(id: string) {
    setOpen((cur) => {
      const next = { ...cur, [id]: !cur[id] };
      try { localStorage.setItem(SECTIONS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  const searching = query.trim().length > 0;
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() =>
    SECTIONS.map((s) => ({
      ...s,
      items: searching ? s.items.filter((i) => (i.label + ' ' + (i.kw || '')).toLowerCase().includes(q)) : s.items,
    })).filter((s) => s.items.length > 0),
    [q, searching]);

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

  function NavItem({ item }: { item: Item }) {
    const active = isActive(item.href);
    return (
      <Link href={item.href}
        className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
  }

  function NavContent() {
    const attention = ATTENTION.filter((a) => (badges[a.href] || 0) > 0);
    return (
      <>
        <div className="mb-4 pb-4 border-b border-slate-100 flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
            <Shield className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Super admin</div>
            <div className="text-xs text-slate-500">Control center</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Αναζήτηση σελίδας…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none" />
        </div>

        {/* Needs attention */}
        {!searching && attention.length > 0 && (
          <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50/60 p-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 mb-2 px-1">Χρειάζονται προσοχή</div>
            <div className="flex flex-wrap gap-1.5">
              {attention.map((a) => (
                <Link key={a.href} href={a.href}
                  className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-medium text-slate-700 hover:border-amber-400">
                  <a.icon className="w-3.5 h-3.5 text-amber-600" />{a.label}
                  <span className="min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold tabular-nums">{badges[a.href]}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard */}
        {!searching && <div className="mb-4"><NavItem item={{ href: '/admin', icon: LayoutDashboard, label: 'Dashboard' }} /></div>}

        {/* Sections */}
        <nav className="space-y-2">
          {filtered.map((section) => {
            const isOpen = searching || open[section.id];
            return (
              <div key={section.id}>
                <button onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-1 mb-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 hover:text-slate-600">
                  <span>{section.title}</span>
                  {!searching && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                </button>
                {isOpen && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => <NavItem key={item.href} item={item} />)}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <p className="px-3 py-4 text-sm text-slate-400 text-center">Καμία σελίδα.</p>}
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

        {/* Mobile drawer */}
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

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
