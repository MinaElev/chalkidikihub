'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, List, Eye, BarChart3, Home, UtensilsCrossed, Landmark, FileText, ClipboardList, ArrowRight, QrCode, X, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('nav');
  const tSub = useTranslations('submissions');
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from('listings').select('status').eq('owner_id', user.id);
      if (data) {
        setStats({
          total: data.length,
          published: data.filter((l) => l.status === 'published').length,
          draft: data.filter((l) => l.status === 'draft').length,
        });
      }
      const { count } = await supabase.from('user_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      setSubmissionCount(count || 0);
    });
  }, []);

  const quickActions = [
    {
      href: '/dashboard/listings/new',
      icon: Home,
      label: 'Καταχώρησε το κατάλυμά σου',
      description: 'Πρόσθεσε νέο ενοικιαζόμενο δωμάτιο ή κατάλυμα',
      color: 'bg-primary-600 hover:bg-primary-700',
      iconBg: 'bg-primary-500',
    },
    {
      href: '/dashboard/suggest-restaurant',
      icon: UtensilsCrossed,
      label: 'Πρόσθεσε Φαγητό & Ποτό',
      description: 'Εστιατόριο, μπαρ, καφετέρια, beach bar κλπ',
      color: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-500',
    },
    {
      href: '/dashboard/suggest-activity',
      icon: Landmark,
      label: 'Πρόσθεσε δραστηριότητα',
      description: 'Πρότεινε αξιοθέατο ή δραστηριότητα',
      color: 'bg-amber-600 hover:bg-amber-700',
      iconBg: 'bg-amber-500',
    },
    {
      href: '/dashboard/suggest-blog',
      icon: FileText,
      label: 'Πρότεινε άρθρο',
      description: 'Γράψε ένα άρθρο για τη Χαλκιδική',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      iconBg: 'bg-indigo-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('dashboard')}</h1>

      {/* New feature announcement */}
      <NewFeatureBanner />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
              <List className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">{t('myListings')}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.published}</div>
              <div className="text-xs text-gray-500">Published</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.draft}</div>
              <div className="text-xs text-gray-500">Draft</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{submissionCount}</div>
              <div className="text-xs text-gray-500">Προτάσεις</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions — prominent cards */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Τι θέλεις να κάνεις;</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}
            className={`group flex items-center gap-4 p-4 rounded-2xl text-white transition-all ${action.color}`}>
            <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-white/70 mt-0.5">{action.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        ))}
      </div>

      {/* Secondary actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/listings"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm">
          <List className="w-4 h-4" />{t('myListings')}
        </Link>
        <Link href="/dashboard/submissions"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm">
          <ClipboardList className="w-4 h-4" />{tSub('mySubmissions')}
        </Link>
        <Link href="/dashboard/profile"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm">
          {t('profile')}
        </Link>
      </div>
    </div>
  );
}

function NewFeatureBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDismissed(localStorage.getItem('chub_qr_banner_dismissed') === '1');
    }
  }, []);

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem('chub_qr_banner_dismissed', '1');
  }

  if (dismissed) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl overflow-hidden">
      {/* Compact bar */}
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <QrCode className="w-5 h-5 text-white shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
          <p className="text-sm font-semibold text-white truncate">QR Guest Guide — Δημιουργήστε QR code για τους πελάτες σας!</p>
        </div>
        <span className="text-white/60 text-xs shrink-0">{expanded ? '▲' : '▼'}</span>
        <button onClick={(e) => { e.stopPropagation(); handleDismiss(); }} className="p-1 rounded hover:bg-white/20 shrink-0">
          <X className="w-3.5 h-3.5 text-white/60" />
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 text-white">
          <p className="text-sm text-white/80 mb-3">
            Ο πελάτης σκανάρει το QR στο δωμάτιο και βλέπει παραλίες, εστιατόρια και δραστηριότητες κοντά του.
          </p>
          <div className="space-y-1.5 text-sm text-white/70 mb-4">
            <p><span className="font-bold text-white">1.</span> Πηγαίνετε στα <strong className="text-white">Καταλύματά μου</strong></p>
            <p><span className="font-bold text-white">2.</span> Πατήστε το μωβ <strong className="text-white">QR εικονίδιο</strong></p>
            <p><span className="font-bold text-white">3.</span> <strong className="text-white">Κατεβάστε ή τυπώστε</strong> το QR</p>
            <p><span className="font-bold text-white">4.</span> Τοποθετήστε στο <strong className="text-white">δωμάτιο ή reception</strong></p>
          </div>
          <Link href="/dashboard/listings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            <QrCode className="w-4 h-4" />
            Δημιουργήστε το QR σας
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
