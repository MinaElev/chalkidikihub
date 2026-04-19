'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Users, Plus, Loader2, AlertCircle, Search, ArrowLeft, Zap,
  Sparkles, Hammer, Shirt, Leaf, Camera, User, Building2,
  Phone, Mail, Euro, Pencil, Trash2, Power, PowerOff, Save, X,
} from 'lucide-react';

type VendorRole =
  | 'cleaner' | 'maintenance' | 'property_manager' | 'linen' | 'gardener' | 'photographer' | 'other';

interface Vendor {
  id: string;
  owner_id: string;
  name: string;
  role: VendorRole;
  phone: string | null;
  email: string | null;
  default_hourly_rate: number | null;
  default_flat_rate: number | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  task_count?: number;
}

const ROLE_META: Record<VendorRole, { icon: React.ComponentType<{ className?: string }>; el: string; en: string; chipCls: string }> = {
  cleaner:          { icon: Sparkles, el: 'Καθαρίστ.', en: 'Cleaner',           chipCls: 'bg-rose-100 text-rose-700' },
  maintenance:      { icon: Hammer,   el: 'Συντήρηση', en: 'Maintenance',       chipCls: 'bg-amber-100 text-amber-700' },
  property_manager: { icon: Building2,el: 'Property Mgr', en: 'Property Mgr',   chipCls: 'bg-indigo-100 text-indigo-700' },
  linen:            { icon: Shirt,    el: 'Κλινοσκεπάσ.', en: 'Linen',          chipCls: 'bg-violet-100 text-violet-700' },
  gardener:         { icon: Leaf,     el: 'Κηπουρός',  en: 'Gardener',          chipCls: 'bg-emerald-100 text-emerald-700' },
  photographer:     { icon: Camera,   el: 'Φωτογράφος',en: 'Photographer',      chipCls: 'bg-sky-100 text-sky-700' },
  other:            { icon: User,     el: 'Άλλο',      en: 'Other',             chipCls: 'bg-slate-100 text-slate-700' },
};

const ROLES: VendorRole[] = ['cleaner','maintenance','property_manager','linen','gardener','photographer','other'];

const EMPTY_VENDOR: Omit<Vendor, 'id' | 'owner_id' | 'created_at'> = {
  name: '',
  role: 'cleaner',
  phone: null,
  email: null,
  default_hourly_rate: null,
  default_flat_rate: null,
  notes: null,
  active: true,
};

export default function PmsVendorsPage() {
  const locale = useLocale();
  const el = locale === 'el';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState<VendorRole | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [showNew, setShowNew] = useState(false);

  const t = {
    back: el ? 'Πίσω στο PMS' : 'Back to PMS',
    title: el ? 'Συνεργάτες' : 'Vendors',
    sub: el
      ? 'Η λίστα σου με καθαριστές, τεχνικούς, property managers. Μια φορά τους καταχωρείς, τους επιλέγεις σε κάθε task.'
      : 'Your list of cleaners, handymen, property managers. Save once, pick them in every task.',
    newVendor: el ? 'Νέος συνεργάτης' : 'New vendor',
    search: el ? 'Αναζήτηση (όνομα, email, τηλ)…' : 'Search (name, email, phone)…',
    allRoles: el ? 'Όλοι οι ρόλοι' : 'All roles',
    showInactive: el ? 'Εμφάνιση ανενεργών' : 'Show inactive',
    noVendors: el ? 'Δεν υπάρχουν συνεργάτες ακόμα.' : 'No vendors yet.',
    addFirst: el ? 'Πρόσθεσε τον πρώτο σου' : 'Add your first',
    activate: el ? 'Ενεργοποίηση' : 'Activate',
    deactivate: el ? 'Απενεργοποίηση' : 'Deactivate',
    edit: el ? 'Επεξεργασία' : 'Edit',
    remove: el ? 'Διαγραφή' : 'Delete',
    confirmRemove: el ? 'Σίγουρα; Ο συνεργάτης θα διαγραφεί. Τα υπάρχοντα tasks δεν επηρεάζονται.' : 'Delete this vendor? Existing tasks are unaffected.',
    taskCount: el ? 'tasks' : 'tasks',
    active: el ? 'Ενεργός' : 'Active',
    inactive: el ? 'Ανενεργός' : 'Inactive',
    vendors: el ? 'συνεργάτες' : 'vendors',
    errLoad: el ? 'Σφάλμα φόρτωσης' : 'Load error',

    // Modal
    nameLabel: el ? 'Όνομα' : 'Name',
    namePlaceholder: el ? 'π.χ. Μαρία / ΑΒΓ Cleaning' : 'e.g. Maria / ABC Cleaning',
    roleLabel: el ? 'Ρόλος' : 'Role',
    phoneLabel: el ? 'Τηλέφωνο' : 'Phone',
    emailLabel: 'Email',
    hourlyLabel: el ? 'Ωριαία (€/h)' : 'Hourly (€/h)',
    flatLabel: el ? 'Σταθερό ανά εργασία (€)' : 'Flat per task (€)',
    notesLabel: el ? 'Σημειώσεις' : 'Notes',
    notesHint: el ? 'Π.χ. "προτιμά μεσημεριανές ώρες", "έχει τα κλειδιά του ακινήτου"' : 'e.g. "prefers afternoons", "has property keys"',
    save: el ? 'Αποθήκευση' : 'Save',
    saving: el ? 'Αποθηκεύεται…' : 'Saving…',
    cancel: el ? 'Άκυρο' : 'Cancel',
    modalTitleEdit: el ? 'Επεξεργασία συνεργάτη' : 'Edit vendor',
    modalTitleNew: el ? 'Νέος συνεργάτης' : 'New vendor',
  };

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) { setError(authErr?.message || 'Not signed in'); return; }
      const [vRes, tCountRes] = await Promise.all([
        supabase
          .from('pms_vendors')
          .select('*')
          .eq('owner_id', user.id)
          .order('active', { ascending: false })
          .order('name', { ascending: true }),
        supabase
          .from('pms_tasks')
          .select('vendor_id')
          .eq('owner_id', user.id)
          .not('vendor_id', 'is', null),
      ]);
      if (vRes.error) { setError(vRes.error.message); return; }
      const counts = new Map<string, number>();
      for (const row of tCountRes.data || []) {
        if (!row.vendor_id) continue;
        counts.set(row.vendor_id, (counts.get(row.vendor_id) || 0) + 1);
      }
      setVendors((vRes.data || []).map(v => ({
        ...v,
        default_hourly_rate: v.default_hourly_rate != null ? Number(v.default_hourly_rate) : null,
        default_flat_rate: v.default_flat_rate != null ? Number(v.default_flat_rate) : null,
        task_count: counts.get(v.id) || 0,
      })) as Vendor[]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return vendors.filter(v => {
      if (!showInactive && !v.active) return false;
      if (roleFilter !== 'all' && v.role !== roleFilter) return false;
      if (!ql) return true;
      return (
        v.name.toLowerCase().includes(ql) ||
        (v.email || '').toLowerCase().includes(ql) ||
        (v.phone || '').toLowerCase().includes(ql) ||
        (v.notes || '').toLowerCase().includes(ql)
      );
    });
  }, [vendors, q, roleFilter, showInactive]);

  async function toggleActive(v: Vendor) {
    const supabase = createClient();
    await supabase.from('pms_vendors').update({ active: !v.active }).eq('id', v.id);
    setVendors(prev => prev.map(x => x.id === v.id ? { ...x, active: !v.active } : x));
  }

  async function remove(v: Vendor) {
    if (!confirm(t.confirmRemove)) return;
    const supabase = createClient();
    await supabase.from('pms_vendors').delete().eq('id', v.id);
    setVendors(prev => prev.filter(x => x.id !== v.id));
  }

  const activeCount = vendors.filter(v => v.active).length;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                <Zap className="w-3 h-3" fill="currentColor" /> PMS
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
              <p className="text-white/85 text-sm leading-relaxed max-w-2xl">{t.sub}</p>
            </div>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-orange-700 font-semibold rounded-xl shadow-sm hover:bg-amber-50"
          >
            <Plus className="w-4 h-4" /> {t.newVendor}
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.errLoad}: <span className="font-mono text-xs">{error}</span></span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t.search}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as VendorRole | 'all')}
            className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <option value="all">{t.allRoles}</option>
            {ROLES.map(r => (
              <option key={r} value={r}>{el ? ROLE_META[r].el : ROLE_META[r].en}</option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} />
            {t.showInactive}
          </label>
          <div className="text-xs text-slate-500 ml-auto tabular-nums">
            <span className="font-bold text-slate-700">{activeCount}</span> / {vendors.length} {t.vendors}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
          <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 mb-3">{vendors.length === 0 ? t.noVendors : (el ? 'Δεν ταιριάζει κανένας.' : 'No matches.')}</p>
          {vendors.length === 0 && (
            <button onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800">
              <Plus className="w-4 h-4" /> {t.addFirst}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(v => {
            const meta = ROLE_META[v.role];
            const Icon = meta.icon;
            return (
              <div key={v.id} className={`bg-white border rounded-2xl p-4 shadow-sm transition ${v.active ? 'border-slate-200' : 'border-slate-200 opacity-60'}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${meta.chipCls} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 truncate">{v.name}</h3>
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${meta.chipCls}`}>
                          {el ? meta.el : meta.en}
                        </span>
                        {!v.active && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                            {t.inactive}
                          </span>
                        )}
                      </div>
                      {v.task_count! > 0 && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {v.task_count} {t.taskCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  {v.phone && (
                    <a href={`tel:${v.phone}`} className="flex items-center gap-2 text-xs text-slate-700 hover:text-orange-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {v.phone}
                    </a>
                  )}
                  {v.email && (
                    <a href={`mailto:${v.email}`} className="flex items-center gap-2 text-xs text-slate-700 hover:text-orange-700 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate">{v.email}</span>
                    </a>
                  )}
                  {(v.default_hourly_rate != null || v.default_flat_rate != null) && (
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <Euro className="w-3.5 h-3.5 text-slate-400" />
                      {v.default_hourly_rate != null && (
                        <span className="font-mono">€{v.default_hourly_rate.toFixed(2)}/h</span>
                      )}
                      {v.default_flat_rate != null && (
                        <span className="font-mono">€{v.default_flat_rate.toFixed(2)} {el ? 'flat' : 'flat'}</span>
                      )}
                    </div>
                  )}
                  {v.notes && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-100">{v.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  <button onClick={() => setEditing(v)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
                    <Pencil className="w-3.5 h-3.5" /> {t.edit}
                  </button>
                  <button onClick={() => toggleActive(v)}
                    title={v.active ? t.deactivate : t.activate}
                    className="inline-flex items-center justify-center px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                    {v.active ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => remove(v)}
                    title={t.remove}
                    className="inline-flex items-center justify-center px-2.5 py-1.5 bg-slate-50 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-md">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(editing || showNew) && (
        <VendorModal
          el={el}
          t={t}
          initial={editing ?? { id: '', owner_id: '', created_at: '', ...EMPTY_VENDOR } as Vendor}
          isEdit={!!editing}
          onClose={() => { setEditing(null); setShowNew(false); }}
          onSaved={() => { setEditing(null); setShowNew(false); load(); }}
        />
      )}
    </div>
  );
}

function VendorModal({
  el, t, initial, isEdit, onClose, onSaved,
}: {
  el: boolean;
  t: {
    modalTitleEdit: string; modalTitleNew: string;
    nameLabel: string; namePlaceholder: string; roleLabel: string;
    phoneLabel: string; emailLabel: string; hourlyLabel: string;
    flatLabel: string; notesLabel: string; notesHint: string;
    save: string; saving: string; cancel: string;
  };
  initial: Vendor;
  isEdit: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: initial.name,
    role: initial.role,
    phone: initial.phone,
    email: initial.email,
    default_hourly_rate: initial.default_hourly_rate,
    default_flat_rate: initial.default_flat_rate,
    notes: initial.notes,
    active: initial.active,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    setErr(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setErr('Not signed in'); return; }
      const payload = {
        ...(isEdit ? { id: initial.id } : {}),
        owner_id: user.id,
        name: form.name.trim(),
        role: form.role,
        phone: form.phone || null,
        email: form.email || null,
        default_hourly_rate: form.default_hourly_rate,
        default_flat_rate: form.default_flat_rate,
        notes: form.notes || null,
        active: form.active,
      };
      const { error } = isEdit
        ? await supabase.from('pms_vendors').update(payload).eq('id', initial.id)
        : await supabase.from('pms_vendors').insert(payload);
      if (error) { setErr(error.message); return; }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 my-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            {isEdit ? t.modalTitleEdit : t.modalTitleNew}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">{t.nameLabel}</span>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder={t.namePlaceholder} autoFocus
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">{t.roleLabel}</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
              {ROLES.map(r => {
                const m = ROLE_META[r];
                const Icon = m.icon;
                return (
                  <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-[11px] font-semibold transition ${
                      form.role === r
                        ? `${m.chipCls} border-current`
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {el ? m.el : m.en}
                  </button>
                );
              })}
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">{t.phoneLabel}</span>
              <input type="tel" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value || null })}
                placeholder="+30 69..."
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">{t.emailLabel}</span>
              <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value || null })}
                placeholder="name@example.com"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">{t.hourlyLabel}</span>
              <input type="number" step="0.5" min="0"
                value={form.default_hourly_rate ?? ''}
                onChange={e => setForm({ ...form, default_hourly_rate: e.target.value ? Number(e.target.value) : null })}
                placeholder="15"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">{t.flatLabel}</span>
              <input type="number" step="0.5" min="0"
                value={form.default_flat_rate ?? ''}
                onChange={e => setForm({ ...form, default_flat_rate: e.target.value ? Number(e.target.value) : null })}
                placeholder="40"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">{t.notesLabel}</span>
            <textarea rows={2} value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value || null })}
              placeholder={t.notesHint}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2" />
          </label>

          {err && (
            <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2 font-mono">
              {err}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
              {t.cancel}
            </button>
            <button type="button" onClick={save} disabled={saving || !form.name.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? t.saving : t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
