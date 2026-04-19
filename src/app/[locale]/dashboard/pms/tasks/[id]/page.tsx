'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, AlertCircle, Edit3, Zap } from 'lucide-react';
import { TaskForm, type TaskFormData, type Listing } from '@/components/pms/TaskForm';

export default function TaskDetailPage() {
  const locale = useLocale();
  const el = locale === 'el';
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const taskId = params?.id;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [initial, setInitial] = useState<TaskFormData | null>(null);

  const t = {
    back: el ? 'Πίσω στις εργασίες' : 'Back to tasks',
    title: el ? 'Επεξεργασία εργασίας' : 'Edit task',
    sub: el ? 'Άλλαξε στοιχεία, κατάσταση, ή διέγραψε.' : 'Update details, status, or delete.',
    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    notFound: el ? 'Δεν βρέθηκε η εργασία.' : 'Task not found.',
  };

  useEffect(() => {
    if (!taskId) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setLoadError(authErr?.message || 'Not signed in'); return; }

        const [lRes, tRes] = await Promise.all([
          supabase.from('listings')
            .select('id, slug, title_el, title_en')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('pms_tasks')
            .select('*')
            .eq('id', taskId)
            .eq('owner_id', user.id)
            .maybeSingle(),
        ]);

        if (lRes.error) { setLoadError(lRes.error.message); return; }
        if (tRes.error) { setLoadError(tRes.error.message); return; }
        setListings(lRes.data || []);
        if (!tRes.data) { setLoadError(t.notFound); return; }
        const r = tRes.data;
        setInitial({
          id: r.id,
          listing_id: r.listing_id,
          booking_id: r.booking_id,
          task_type: r.task_type,
          title: r.title,
          description: r.description,
          vendor_id: r.vendor_id ?? null,
          assignee_name: r.assignee_name,
          assignee_phone: r.assignee_phone,
          assignee_email: r.assignee_email,
          scheduled_at: r.scheduled_at,
          completed_at: r.completed_at,
          status: r.status,
          cost: r.cost != null ? Number(r.cost) : null,
          notes: r.notes,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId, t.notFound]);

  async function handleDelete() {
    if (!taskId) return;
    const supabase = createClient();
    const { error } = await supabase.from('pms_tasks').delete().eq('id', taskId);
    if (error) { alert(error.message); return; }
    router.push('/dashboard/pms/tasks');
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms/tasks" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-rose-500 via-rose-600 to-pink-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
            <p className="text-white/85 text-sm leading-relaxed">{t.sub}</p>
          </div>
        </div>
      </header>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.loadError}: <span className="font-mono text-xs">{loadError}</span></span>
        </div>
      )}

      {initial && (
        <TaskForm
          mode="edit"
          initial={initial}
          listings={listings}
          el={el}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
