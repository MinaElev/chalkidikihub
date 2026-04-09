'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  List, Eye, Home, UtensilsCrossed, Landmark, FileText, ArrowRight,
  MousePointer, Phone, Mail, ExternalLink, Calendar, Building,
  CheckCircle, AlertTriangle, ChevronDown, ChevronUp,
} from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [salesStats, setSalesStats] = useState({ total: 0, published: 0 });
  const [submissionCount, setSubmissionCount] = useState(0);
  const [clickStats, setClickStats] = useState<Record<string, number>>({});
  const [inquiries, setInquiries] = useState<Array<{ id: string; name: string; email: string; subject: string; message: string; created_at: string }>>([]);
  const [inquiriesOpen, setInquiriesOpen] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');

      // Listings stats
      const { data } = await supabase.from('listings').select('status, slug, title_el').eq('owner_id', user.id);
      if (data) {
        setStats({
          total: data.length,
          published: data.filter((l) => l.status === 'published').length,
          draft: data.filter((l) => l.status === 'draft').length,
        });
      }

      // Sales stats
      const { data: salesData } = await supabase.from('sales').select('status').eq('owner_id', user.id);
      if (salesData) {
        setSalesStats({
          total: salesData.length,
          published: salesData.filter((s) => s.status === 'published').length,
        });
      }

      // Submissions
      const { count } = await supabase.from('user_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      setSubmissionCount(count || 0);

      // Click stats (last 30 days)
      const listingSlugs = data?.map(l => l.slug) || [];
      if (listingSlugs.length > 0) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
        const { data: logs } = await supabase
          .from('activity_logs')
          .select('details')
          .eq('message', 'Booking click')
          .gte('created_at', thirtyDaysAgo);

        const counts: Record<string, number> = {};
        logs?.forEach(log => {
          const d = log.details as { listing_slug?: string; type?: string };
          if (d.listing_slug && listingSlugs.includes(d.listing_slug) && d.type) {
            counts[d.type] = (counts[d.type] || 0) + 1;
          }
        });
        setClickStats(counts);

        // Inquiries
        try {
          const res = await fetch(`/api/inquiry?slugs=${listingSlugs.join(',')}`);
          if (res.ok) {
            const inqData = await res.json();
            if (Array.isArray(inqData)) setInquiries(inqData);
          }
        } catch {}
      }
    });
  }, []);

  const totalClicks = Object.values(clickStats).reduce((s, v) => s + v, 0);

  return (
    <div>
      {/* Welcome */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {locale === 'el' ? `Γεια σου, ${userName}!` : `Hello, ${userName}!`}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {locale === 'el' ? 'Ο πίνακας ελέγχου σου στο ChalkidikiHub' : 'Your ChalkidikiHub dashboard'}
      </p>

      {/* Row 1: Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center"><Home className="w-4 h-4 text-primary-600" /></div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">{t('myListings')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.published}<span className="text-base text-gray-400">/{stats.total}</span></div>
          {stats.total > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5">
              <div className="bg-primary-500 h-1 rounded-full" style={{ width: `${(stats.published / stats.total) * 100}%` }} />
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><Building className="w-4 h-4 text-emerald-600" /></div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">{locale === 'el' ? 'Πωλήσεις' : 'Sales'}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{salesStats.published}<span className="text-base text-gray-400">/{salesStats.total}</span></div>
          {salesStats.total > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5">
              <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${(salesStats.published / salesStats.total) * 100}%` }} />
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><Calendar className="w-4 h-4 text-amber-600" /></div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">{locale === 'el' ? 'Αιτήματα' : 'Inquiries'}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{inquiries.length}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-purple-600" /></div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">{locale === 'el' ? 'Προτάσεις' : 'Submissions'}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{submissionCount}</div>
        </div>
      </div>

      {/* Row 2: Action Required */}
      {(inquiries.length > 0 || stats.draft > 0) && (
        <div className="space-y-2 mb-6">
          {inquiries.length > 0 && (
            <Link href="#inquiries" onClick={(e) => { e.preventDefault(); setInquiriesOpen(true); document.getElementById('inquiries')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors">
              <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-sm font-medium text-amber-800 flex-1">
                {inquiries.length} {locale === 'el' ? 'αιτήματα διαθεσιμότητας' : 'availability inquiries'}
              </span>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full text-xs font-bold">{inquiries.length}</span>
            </Link>
          )}
          {stats.draft > 0 && (
            <Link href="/dashboard/listings"
              className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <AlertTriangle className="w-5 h-5 text-gray-500 shrink-0" />
              <span className="text-sm font-medium text-gray-700 flex-1">
                {stats.draft} {locale === 'el' ? 'πρόχειρα καταλύματα — δημοσίευσέ τα!' : 'draft listings — publish them!'}
              </span>
            </Link>
          )}
        </div>
      )}

      {/* Row 3: Click Stats */}
      {totalClicks > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-gray-400" />
            {locale === 'el' ? 'Κλικ τελευταίων 30 ημερών' : 'Clicks last 30 days'}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { key: 'booking.com', label: 'Booking', icon: ExternalLink, color: 'bg-[#003580] text-white' },
              { key: 'airbnb', label: 'Airbnb', icon: ExternalLink, color: 'bg-[#FF5A5F] text-white' },
              { key: 'website', label: 'Website', icon: ExternalLink, color: 'bg-gray-800 text-white' },
              { key: 'phone', label: locale === 'el' ? 'Τηλ.' : 'Phone', icon: Phone, color: 'bg-green-600 text-white' },
              { key: 'email', label: 'Email', icon: Mail, color: 'bg-primary-600 text-white' },
            ].filter(s => clickStats[s.key]).map(s => (
              <div key={s.key} className={`${s.color} rounded-xl p-2.5 text-center`}>
                <div className="text-xl font-bold">{clickStats[s.key]}</div>
                <div className="text-[10px] opacity-80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 4: Inquiries */}
      {inquiries.length > 0 && (
        <div id="inquiries" className="bg-white border border-gray-200 rounded-xl mb-6">
          <button onClick={() => setInquiriesOpen(!inquiriesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors">
            <span className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              {locale === 'el' ? 'Αιτήματα Διαθεσιμότητας' : 'Availability Inquiries'} ({inquiries.length})
            </span>
            {inquiriesOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {inquiriesOpen && (
            <div className="border-t border-gray-100 divide-y divide-gray-50">
              {inquiries.slice(0, 5).map((inq) => (
                <div key={inq.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{inq.subject.replace('Αίτημα διαθεσιμότητας: ', '')}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{inq.name}</span>
                        <a href={`mailto:${inq.email}`} className="text-primary-600 hover:underline">{inq.email}</a>
                        <span>{new Date(inq.created_at).toLocaleDateString('el')}</span>
                      </div>
                      {inq.message && <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{inq.message}</p>}
                    </div>
                    <span className="shrink-0 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">{locale === 'el' ? 'Νέο' : 'New'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Row 5: Quick Actions */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {locale === 'el' ? 'Τι θέλεις να κάνεις;' : 'What would you like to do?'}
      </h2>

      {/* Primary CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Link href="/dashboard/listings/new"
          className="group flex items-center gap-4 p-4 rounded-2xl text-white transition-all bg-primary-600 hover:bg-primary-700">
          <div className="w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{locale === 'el' ? 'Νέο Κατάλυμα' : 'New Listing'}</p>
            <p className="text-xs text-white/70">{locale === 'el' ? 'Ενοικιαζόμενο δωμάτιο ή κατοικία' : 'Rental room or accommodation'}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
        </Link>

        <Link href="/dashboard/sales/new"
          className="group flex items-center gap-4 p-4 rounded-2xl text-white transition-all bg-emerald-600 hover:bg-emerald-700">
          <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{locale === 'el' ? 'Νέα Πώληση' : 'New Sale'}</p>
            <p className="text-xs text-white/70">{locale === 'el' ? 'Κατοικία, γη, επαγγελματικό' : 'House, land, commercial'}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
        </Link>
      </div>

      {/* Secondary CTAs */}
      <div className="grid grid-cols-3 gap-2">
        <Link href="/dashboard/suggest-restaurant"
          className="flex flex-col items-center gap-1.5 p-3 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors text-center">
          <UtensilsCrossed className="w-5 h-5 text-red-500" />
          <span className="text-[11px] font-medium text-gray-700">{locale === 'el' ? 'Εστιατόριο' : 'Restaurant'}</span>
        </Link>
        <Link href="/dashboard/suggest-activity"
          className="flex flex-col items-center gap-1.5 p-3 bg-white border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-colors text-center">
          <Landmark className="w-5 h-5 text-amber-500" />
          <span className="text-[11px] font-medium text-gray-700">{locale === 'el' ? 'Δραστηριότητα' : 'Activity'}</span>
        </Link>
        <Link href="/dashboard/suggest-blog"
          className="flex flex-col items-center gap-1.5 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center">
          <FileText className="w-5 h-5 text-indigo-500" />
          <span className="text-[11px] font-medium text-gray-700">{locale === 'el' ? 'Άρθρο' : 'Article'}</span>
        </Link>
      </div>
    </div>
  );
}
