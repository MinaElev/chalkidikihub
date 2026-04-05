'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserSubmission } from '@/types';
import { ClipboardList, Trash2, Loader2, UtensilsCrossed, Landmark, FileText, MessageSquare } from 'lucide-react';

const typeIcons: Record<string, typeof UtensilsCrossed> = {
  restaurant: UtensilsCrossed,
  activity: Landmark,
  blog: FileText,
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function SubmissionsPage() {
  const t = useTranslations('submissions');
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submissions')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setSubmissions(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch('/api/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'delete' }),
    });
    if (res.ok) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('mySubmissions')}</h1>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">{t('noSubmissions')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const Icon = typeIcons[sub.type] || FileText;
            return (
              <div key={sub.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <Icon className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">{sub.title_el || sub.title_en}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>
                          {t(sub.status)}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {t(sub.type)}
                        </span>
                      </div>
                      {sub.area && <p className="text-sm text-gray-500 mt-1">{sub.area} {sub.location_name ? `- ${sub.location_name}` : ''}</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(sub.created_at).toLocaleDateString('el')}</p>

                      {sub.status === 'rejected' && sub.admin_notes && (
                        <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-red-700">{t('adminNotes')}:</p>
                            <p className="text-sm text-red-600">{sub.admin_notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {sub.status === 'pending' && (
                    <button onClick={() => handleDelete(sub.id)}
                      className="text-gray-400 hover:text-red-500 shrink-0" title={t('deleteSubmission')}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
