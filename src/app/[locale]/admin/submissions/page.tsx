'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { UserSubmission } from '@/types';
import { Shield, Check, X, ChevronDown, ChevronUp, Loader2, UtensilsCrossed, Landmark, FileText, MapPin, Image } from 'lucide-react';

const typeIcons: Record<string, typeof UtensilsCrossed> = {
  restaurant: UtensilsCrossed, activity: Landmark, blog: FileText,
};
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminSubmissionsPage() {
  const t = useTranslations('submissions');
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      let query = supabase.from('user_submissions').select('*').order('created_at', { ascending: false });
      if (filterType) query = query.eq('type', filterType);
      if (filterStatus) query = query.eq('status', filterStatus);
      const { data } = await query;

      if (data) {
        // Join user names from profiles
        const userIds = [...new Set(data.map((s) => s.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);
        const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || []);
        setSubmissions(data.map((s) => ({ ...s, user_name: profileMap.get(s.user_id) || 'Unknown' })) as UserSubmission[]);
      }
      setLoading(false);
    }
    load();
  }, [filterType, filterStatus]);

  const [actionError, setActionError] = useState('');

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionLoading(id);
    setActionError('');
    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, admin_notes: rejectNotes[id] || '' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissions((prev) =>
          prev.map((s) => s.id === id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected', admin_notes: rejectNotes[id] || null } : s)
        );
      } else {
        setActionError(data.error || `Failed to ${action}`);
      }
    } catch (err) {
      setActionError(`Network error: ${(err as Error).message}`);
    }
    setActionLoading(null);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('moderationTitle')}</h1>
      </div>

      {actionError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{actionError}</div>}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">{t('allTypes')}</option>
          <option value="restaurant">{t('restaurant')}</option>
          <option value="activity">{t('activity')}</option>
          <option value="blog">{t('blog')}</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">{t('allStatuses')}</option>
          <option value="pending">{t('pending')}</option>
          <option value="approved">{t('approved')}</option>
          <option value="rejected">{t('rejected')}</option>
        </select>
        <span className="text-sm text-gray-500">{submissions.length} submissions</span>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16"><p className="text-lg text-gray-500">{t('noPending')}</p></div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => {
            const Icon = typeIcons[sub.type] || FileText;
            const isExpanded = expanded === sub.id;
            const extra = (sub.extra_data || {}) as Record<string, string>;

            return (
              <div key={sub.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Header */}
                <button onClick={() => setExpanded(isExpanded ? null : sub.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 truncate">{sub.title_el}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>{t(sub.status)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t('submittedBy')}: {sub.user_name || 'Unknown'} | {new Date(sub.created_at).toLocaleDateString('el')}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium">{t('titleEl')}</p>
                        <p className="text-gray-900">{sub.title_el}</p>
                      </div>
                      {sub.title_en && (
                        <div>
                          <p className="text-gray-500 font-medium">{t('titleEn')}</p>
                          <p className="text-gray-900">{sub.title_en}</p>
                        </div>
                      )}
                    </div>

                    {sub.description_el && (
                      <div className="text-sm">
                        <p className="text-gray-500 font-medium">{t('descriptionEl')}</p>
                        <p className="text-gray-700 whitespace-pre-line mt-1">{sub.description_el}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 text-sm">
                      {sub.area && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" /> {sub.area} {sub.location_name && `- ${sub.location_name}`}
                        </div>
                      )}
                      {sub.category && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{sub.category}</span>
                      )}
                      {extra.phone && <span className="text-gray-600">Tel: {extra.phone}</span>}
                      {extra.hours && <span className="text-gray-600">{extra.hours}</span>}
                      {extra.price_range && <span className="text-gray-600">{extra.price_range}</span>}
                      {extra.duration && <span className="text-gray-600">{extra.duration}</span>}
                    </div>

                    {sub.image_url && (
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4 text-gray-400" />
                        <a href={sub.image_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">View image</a>
                      </div>
                    )}

                    {/* Actions */}
                    {sub.status === 'pending' && (
                      <div className="border-t border-gray-100 pt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('rejectReason')}</label>
                          <input value={rejectNotes[sub.id] || ''}
                            onChange={(e) => setRejectNotes({ ...rejectNotes, [sub.id]: e.target.value })}
                            placeholder="Optional notes..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleAction(sub.id, 'approve')} disabled={actionLoading === sub.id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                            {actionLoading === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {t('approve')}
                          </button>
                          <button onClick={() => handleAction(sub.id, 'reject')} disabled={actionLoading === sub.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                            {actionLoading === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            {t('reject')}
                          </button>
                        </div>
                      </div>
                    )}

                    {sub.admin_notes && (
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="font-medium text-gray-700">{t('adminNotes')}:</p>
                        <p className="text-gray-600">{sub.admin_notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
