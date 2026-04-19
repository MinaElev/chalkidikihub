'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Save, Trash2, Loader2, AlertCircle, CheckCircle2,
  Wrench, ClipboardCheck, User, Euro, FileText,
  Sparkles, Hammer, Eye, Shirt, LogIn, LogOut, Settings2,
  Clock, Play, CheckCheck, Ban, SkipForward,
} from 'lucide-react';

export type TaskType = 'cleaning' | 'maintenance' | 'inspection' | 'linen' | 'checkin' | 'checkout' | 'custom';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'skipped';

export interface TaskFormData {
  id?: string;
  listing_id: string;
  booking_id: string | null;
  task_type: TaskType;
  title: string;
  description: string | null;
  assignee_name: string | null;
  assignee_phone: string | null;
  assignee_email: string | null;
  scheduled_at: string;
  completed_at: string | null;
  status: TaskStatus;
  cost: number | null;
  notes: string | null;
}

export interface Listing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

export const EMPTY_TASK: TaskFormData = {
  listing_id: '',
  booking_id: null,
  task_type: 'cleaning',
  title: '',
  description: null,
  assignee_name: null,
  assignee_phone: null,
  assignee_email: null,
  scheduled_at: '',
  completed_at: null,
  status: 'pending',
  cost: null,
  notes: null,
};

export function TaskForm({
  mode, initial, listings, el, onDelete,
}: {
  mode: 'create' | 'edit';
  initial: TaskFormData;
  listings: Listing[];
  el: boolean;
  onDelete?: () => Promise<void>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<TaskFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const t = {
    whatTitle: el ? 'Τι πρέπει να γίνει' : 'What needs doing',
    taskType: el ? 'Τύπος εργασίας' : 'Task type',
    title: el ? 'Τίτλος' : 'Title',
    titlePlaceholder: el ? 'π.χ. Καθαρισμός μετά check-out' : 'e.g. Cleaning after check-out',
    description: el ? 'Περιγραφή' : 'Description',
    descPlaceholder: el ? 'Οδηγίες, λίστα ελέγχου, ειδικές σημειώσεις…' : 'Instructions, checklist, special notes…',
    listing: el ? 'Κατάλυμα' : 'Listing',
    chooseListing: el ? '— Διάλεξε κατάλυμα —' : '— Pick a listing —',

    whenTitle: el ? 'Πότε' : 'When',
    scheduled: el ? 'Προγραμματισμένη ώρα' : 'Scheduled time',
    status: 'Status',
    completedAt: el ? 'Ολοκληρώθηκε' : 'Completed at',

    whoTitle: el ? 'Ποιος το αναλαμβάνει' : 'Who handles this',
    assigneeName: el ? 'Όνομα συνεργάτη' : 'Assignee name',
    assigneePhone: el ? 'Τηλέφωνο' : 'Phone',
    assigneeEmail: 'Email',

    moneyTitle: el ? 'Κόστος & σημειώσεις' : 'Cost & notes',
    cost: el ? 'Κόστος (€)' : 'Cost (€)',
    notesLabel: el ? 'Εσωτερικές σημειώσεις' : 'Internal notes',
    notesPlaceholder: el ? 'π.χ. "έφερε δικά της εργαλεία", "χρέωσε extra για 2 μπάνια"' : 'e.g. "brought own tools", "charged extra for 2 bathrooms"',

    save: mode === 'create' ? (el ? 'Δημιουργία' : 'Create') : (el ? 'Αποθήκευση' : 'Save'),
    saving: el ? 'Αποθηκεύεται…' : 'Saving…',
    saved: el ? 'Αποθηκεύτηκε' : 'Saved',
    deleteAction: el ? 'Διαγραφή' : 'Delete',
    deleting: el ? 'Διαγράφεται…' : 'Deleting…',
    deleteConfirm: el ? 'Σίγουρα; Η εργασία θα διαγραφεί οριστικά.' : 'Are you sure? The task will be permanently deleted.',
    errorListing: el ? 'Διάλεξε κατάλυμα' : 'Pick a listing',
    errorTitle: el ? 'Δώσε τίτλο στην εργασία' : 'Give the task a title',
    errorScheduled: el ? 'Όρισε ώρα προγραμματισμού' : 'Set a scheduled time',
  };

  const taskTypes: Array<{ value: TaskType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { value: 'cleaning',    label: el ? 'Καθαρισμός'   : 'Cleaning',    icon: Sparkles },
    { value: 'maintenance', label: el ? 'Συντήρηση'    : 'Maintenance', icon: Hammer },
    { value: 'inspection',  label: el ? 'Επιθεώρηση'   : 'Inspection',  icon: Eye },
    { value: 'linen',       label: el ? 'Κλινοσκεπάσματα': 'Linen',     icon: Shirt },
    { value: 'checkin',     label: el ? 'Υποδοχή'       : 'Check-in',   icon: LogIn },
    { value: 'checkout',    label: el ? 'Αναχώρηση'    : 'Check-out',   icon: LogOut },
    { value: 'custom',      label: 'Custom',                            icon: Settings2 },
  ];

  const statusOptions: Array<{ value: TaskStatus; label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = [
    { value: 'pending',     label: el ? 'Εκκρεμεί'      : 'Pending',     icon: Clock,       color: 'amber' },
    { value: 'in_progress', label: el ? 'Σε εξέλιξη'    : 'In progress', icon: Play,        color: 'sky' },
    { value: 'completed',   label: el ? 'Ολοκληρωμένη'  : 'Completed',   icon: CheckCheck,  color: 'emerald' },
    { value: 'cancelled',   label: el ? 'Ακυρώθηκε'     : 'Cancelled',   icon: Ban,         color: 'rose' },
    { value: 'skipped',     label: el ? 'Παραλείφθηκε'  : 'Skipped',     icon: SkipForward, color: 'slate' },
  ];

  function update<K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setJustSaved(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setJustSaved(false);

    if (!form.listing_id) { setError(t.errorListing); return; }
    if (!form.title.trim()) { setError(t.errorTitle); return; }
    if (!form.scheduled_at) { setError(t.errorScheduled); return; }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Not signed in'); return; }

      const payload: any = {
        owner_id: user.id,
        listing_id: form.listing_id,
        booking_id: form.booking_id,
        task_type: form.task_type,
        title: form.title.trim(),
        description: form.description,
        assignee_name: form.assignee_name,
        assignee_phone: form.assignee_phone,
        assignee_email: form.assignee_email,
        scheduled_at: form.scheduled_at,
        completed_at: form.status === 'completed'
          ? (form.completed_at || new Date().toISOString())
          : null,
        status: form.status,
        cost: form.cost,
        notes: form.notes,
        updated_at: new Date().toISOString(),
      };

      if (mode === 'create') {
        const { data, error } = await supabase
          .from('pms_tasks')
          .insert(payload)
          .select('id')
          .single();
        if (error) { setError(error.message); return; }
        router.push(`/dashboard/pms/tasks/${data.id}`);
      } else {
        const { error } = await supabase
          .from('pms_tasks')
          .update(payload)
          .eq('id', form.id!);
        if (error) { setError(error.message); return; }
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 4000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    if (!confirm(t.deleteConfirm)) return;
    setDeleting(true);
    try { await onDelete(); } finally { setDeleting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-28 md:pb-6">
      {/* WHAT */}
      <Section icon={ClipboardCheck} color="rose" title={t.whatTitle}>
        <div>
          <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.taskType}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {taskTypes.map(tt => {
              const Icon = tt.icon;
              const selected = form.task_type === tt.value;
              return (
                <label key={tt.value}
                  className={`cursor-pointer rounded-xl border-2 px-2 py-2 transition ${
                    selected ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                  <input type="radio" name="task_type" checked={selected}
                    onChange={() => update('task_type', tt.value)} className="sr-only" />
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span className="text-xs font-semibold text-slate-900 truncate">{tt.label}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
        <Field label={t.title}>
          <input type="text" required value={form.title}
            onChange={e => update('title', e.target.value)}
            className="task-input" placeholder={t.titlePlaceholder} />
        </Field>
        <Field label={t.listing}>
          <select required value={form.listing_id}
            onChange={e => update('listing_id', e.target.value)}
            className="task-input">
            <option value="">{t.chooseListing}</option>
            {listings.map(l => (
              <option key={l.id} value={l.id}>
                {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.description}>
          <textarea rows={2} value={form.description || ''}
            onChange={e => update('description', e.target.value || null)}
            className="task-input" placeholder={t.descPlaceholder} />
        </Field>
      </Section>

      {/* WHEN */}
      <Section icon={Clock} color="sky" title={t.whenTitle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label={t.scheduled}>
            <input type="datetime-local" required
              value={toLocalInput(form.scheduled_at)}
              onChange={e => update('scheduled_at', fromLocalInput(e.target.value))}
              className="task-input" />
          </Field>
          {form.status === 'completed' && (
            <Field label={t.completedAt}>
              <input type="datetime-local"
                value={toLocalInput(form.completed_at)}
                onChange={e => update('completed_at', e.target.value ? fromLocalInput(e.target.value) : null)}
                className="task-input" />
            </Field>
          )}
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.status}</div>
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map(s => {
              const Icon = s.icon;
              const selected = form.status === s.value;
              const activeCls =
                s.color === 'amber' ? 'bg-amber-600 text-white'
                : s.color === 'sky' ? 'bg-sky-600 text-white'
                : s.color === 'emerald' ? 'bg-emerald-600 text-white'
                : s.color === 'rose' ? 'bg-rose-600 text-white'
                : 'bg-slate-600 text-white';
              return (
                <button type="button" key={s.value}
                  onClick={() => update('status', s.value)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                    selected ? activeCls + ' shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}>
                  <Icon className="w-3 h-3" /> {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* WHO */}
      <Section icon={User} color="violet" title={t.whoTitle}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label={t.assigneeName}>
            <input type="text" value={form.assignee_name || ''}
              onChange={e => update('assignee_name', e.target.value || null)}
              className="task-input" />
          </Field>
          <Field label={t.assigneePhone}>
            <input type="tel" value={form.assignee_phone || ''}
              onChange={e => update('assignee_phone', e.target.value || null)}
              className="task-input" placeholder="+30 69..." />
          </Field>
          <Field label={t.assigneeEmail}>
            <input type="email" value={form.assignee_email || ''}
              onChange={e => update('assignee_email', e.target.value || null)}
              className="task-input" />
          </Field>
        </div>
      </Section>

      {/* MONEY */}
      <Section icon={Euro} color="emerald" title={t.moneyTitle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label={t.cost}>
            <input type="number" step="0.01" min="0" value={form.cost ?? ''}
              onChange={e => update('cost', e.target.value ? Number(e.target.value) : null)}
              className="task-input" placeholder="0.00" />
          </Field>
        </div>
        <Field label={t.notesLabel}>
          <textarea rows={2} value={form.notes || ''}
            onChange={e => update('notes', e.target.value || null)}
            className="task-input" placeholder={t.notesPlaceholder} />
        </Field>
      </Section>

      <div className="fixed md:static bottom-0 left-0 right-0 z-30 bg-white/95 md:bg-transparent backdrop-blur md:backdrop-blur-0 border-t md:border-0 border-slate-200 p-3 md:p-0 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {justSaved && (
            <div className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> {t.saved}
            </div>
          )}
          {error && (
            <div className="inline-flex items-center gap-2 text-xs text-rose-700 font-mono">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onDelete && mode === 'edit' && (
            <button type="button" onClick={handleDelete} disabled={deleting || saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold rounded-xl transition-colors disabled:opacity-50">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? t.deleting : t.deleteAction}
            </button>
          )}
          <button type="submit" disabled={saving || deleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-sm transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.task-input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid rgb(203 213 225);
          border-radius: 0.75rem;
          background: white;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.task-input:focus) {
          outline: none;
          border-color: rgb(225 29 72);
          box-shadow: 0 0 0 3px rgb(244 63 94 / 0.2);
        }
      `}</style>
    </form>
  );
}

function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(val: string): string {
  if (!val) return '';
  return new Date(val).toISOString();
}

const SECTION_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  rose:    { bg: 'bg-rose-100',    text: 'text-rose-700',    ring: 'ring-rose-200' },
  sky:     { bg: 'bg-sky-100',     text: 'text-sky-700',     ring: 'ring-sky-200' },
  violet:  { bg: 'bg-violet-100',  text: 'text-violet-700',  ring: 'ring-violet-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
};

function Section({ icon: Icon, color, title, children }: {
  icon: React.ComponentType<{ className?: string }>; color: keyof typeof SECTION_COLORS;
  title: string; children: React.ReactNode;
}) {
  const c = SECTION_COLORS[color];
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${c.bg} ${c.text} ring-4 ${c.ring}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
