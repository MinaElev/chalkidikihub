'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Save, Trash2, Loader2, AlertCircle, CheckCircle2,
  Zap, Pencil, Bot, Calendar, MessageSquare, Home, LogIn, LogOut, Star, XCircle,
  Globe, Clock,
} from 'lucide-react';

export type TemplateTrigger =
  | 'manual' | 'on_inquiry' | 'on_book'
  | '3days_before' | '1day_before'
  | 'on_checkin' | 'on_checkout'
  | '7days_after' | 'on_cancel';

export interface LocalesMap {
  [locale: string]: string;
}

export interface TemplateFormData {
  id?: string;
  name: string;
  trigger: TemplateTrigger;
  subject_locales: LocalesMap;
  body_locales: LocalesMap;
  active: boolean;
  listing_ids: string[] | null;
}

export interface Listing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

export const EMPTY_TEMPLATE: TemplateFormData = {
  name: '',
  trigger: 'manual',
  subject_locales: { el: '', en: '' },
  body_locales: { el: '', en: '' },
  active: true,
  listing_ids: null,
};

const TRIGGERS: Array<{
  value: TemplateTrigger;
  icon: React.ComponentType<{ className?: string }>;
  el: { title: string; desc: string };
  en: { title: string; desc: string };
}> = [
  { value: 'manual',        icon: Pencil,       el: { title: 'Χειροκίνητο', desc: 'Στέλνεται μόνο όταν το επιλέξεις από το thread' }, en: { title: 'Manual', desc: 'Sent only when you pick it from a thread' } },
  { value: 'on_inquiry',    icon: MessageSquare,el: { title: 'Νέο ερώτημα', desc: 'Όταν ο guest στέλνει πρώτο μήνυμα' },                en: { title: 'On inquiry', desc: 'When guest sends their first message' } },
  { value: 'on_book',       icon: Calendar,     el: { title: 'Επιβεβαίωση κράτησης', desc: 'Όταν confirmάρεται κράτηση' },              en: { title: 'On booking', desc: 'When a booking gets confirmed' } },
  { value: '3days_before',  icon: Clock,        el: { title: '3 μέρες πριν', desc: '3 ημέρες πριν το check-in (check-in info)' },      en: { title: '3 days before', desc: '3 days before check-in (prep info)' } },
  { value: '1day_before',   icon: Clock,        el: { title: '1 μέρα πριν', desc: 'Τελική υπενθύμιση + οδηγίες άφιξης' },              en: { title: '1 day before', desc: 'Final reminder + arrival instructions' } },
  { value: 'on_checkin',    icon: LogIn,        el: { title: 'Check-in', desc: 'Welcome μήνυμα την ημέρα άφιξης' },                     en: { title: 'On check-in', desc: 'Welcome message on arrival day' } },
  { value: 'on_checkout',   icon: LogOut,       el: { title: 'Check-out', desc: 'Ευχαριστήριο την ημέρα αναχώρησης' },                  en: { title: 'On check-out', desc: 'Thank-you on departure day' } },
  { value: '7days_after',   icon: Star,         el: { title: '7 μέρες μετά', desc: 'Review request μετά την αναχώρηση' },               en: { title: '7 days after', desc: 'Review request after departure' } },
  { value: 'on_cancel',     icon: XCircle,      el: { title: 'Ακύρωση', desc: 'Όταν ακυρώνεται κράτηση' },                              en: { title: 'On cancel', desc: 'When a booking is cancelled' } },
];

const LOCALES: Array<{ code: string; flag: string; label: string }> = [
  { code: 'el', flag: '🇬🇷', label: 'Ελληνικά' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
];

const VARIABLES = [
  '{{guest_name}}', '{{listing_name}}', '{{check_in}}', '{{check_out}}',
  '{{nights}}', '{{total}}', '{{owner_name}}', '{{owner_phone}}',
];

export function TemplateForm({
  mode, initial, listings, el, onDelete,
}: {
  mode: 'create' | 'edit';
  initial: TemplateFormData;
  listings: Listing[];
  el: boolean;
  onDelete?: () => Promise<void>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<TemplateFormData>(initial);
  const [activeLocale, setActiveLocale] = useState<string>('el');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const t = {
    basicsTitle: el ? 'Βασικά' : 'Basics',
    name: el ? 'Όνομα template' : 'Template name',
    namePlaceholder: el ? 'π.χ. Welcome message' : 'e.g. Welcome message',
    triggerTitle: el ? 'Πότε στέλνεται' : 'When to send',
    contentTitle: el ? 'Περιεχόμενο' : 'Content',
    subject: el ? 'Θέμα (subject)' : 'Subject',
    subjectPlaceholder: el ? 'π.χ. Καλώς ήρθες στο {{listing_name}}!' : 'e.g. Welcome to {{listing_name}}!',
    body: el ? 'Μήνυμα' : 'Body',
    bodyPlaceholder: el ? 'Γεια σου {{guest_name}}, ευχαριστούμε που επέλεξες το {{listing_name}}…' : 'Hi {{guest_name}}, thanks for choosing {{listing_name}}…',
    variables: el ? 'Διαθέσιμες μεταβλητές' : 'Available variables',
    variablesHint: el ? 'Πάτα για αντιγραφή στο clipboard' : 'Tap to copy to clipboard',
    scopeTitle: el ? 'Σε ποια καταλύματα' : 'Which listings',
    scopeAll: el ? 'Όλα τα καταλύματα' : 'All listings',
    scopeSpecific: el ? 'Επιλεγμένα καταλύματα' : 'Specific listings',
    activeTitle: el ? 'Κατάσταση' : 'Status',
    activeLabel: el ? 'Ενεργό (θα στέλνεται όταν συμβεί το trigger)' : 'Active (will send when trigger fires)',
    inactive: el ? 'Σε παύση' : 'Paused',
    save: mode === 'create' ? (el ? 'Δημιουργία' : 'Create') : (el ? 'Αποθήκευση' : 'Save'),
    saving: el ? 'Αποθηκεύεται…' : 'Saving…',
    saved: el ? 'Αποθηκεύτηκε' : 'Saved',
    deleteAction: el ? 'Διαγραφή' : 'Delete',
    deleting: el ? 'Διαγράφεται…' : 'Deleting…',
    deleteConfirm: el ? 'Σίγουρα; Το template θα διαγραφεί οριστικά.' : 'Are you sure? The template will be permanently deleted.',
    errorName: el ? 'Δώσε όνομα στο template' : 'Give the template a name',
    errorBody: el ? 'Γράψε body τουλάχιστον σε μία γλώσσα' : 'Write body in at least one language',
    copied: el ? 'Αντιγράφηκε!' : 'Copied!',
  };

  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  function update<K extends keyof TemplateFormData>(key: K, value: TemplateFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setJustSaved(false);
    setError(null);
  }

  function setLocaleValue(field: 'subject_locales' | 'body_locales', code: string, value: string) {
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], [code]: value },
    }));
    setJustSaved(false);
    setError(null);
  }

  function toggleListing(id: string) {
    const current = form.listing_ids || [];
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    update('listing_ids', next.length === 0 ? null : next);
  }

  function setScope(mode: 'all' | 'specific') {
    update('listing_ids', mode === 'all' ? null : []);
  }

  async function copyVar(v: string) {
    try {
      await navigator.clipboard.writeText(v);
      setCopiedVar(v);
      setTimeout(() => setCopiedVar(null), 1500);
    } catch { /* ignore */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setJustSaved(false);

    if (!form.name.trim()) { setError(t.errorName); return; }
    const bodyHasContent = Object.values(form.body_locales).some(v => v && v.trim());
    if (!bodyHasContent) { setError(t.errorBody); return; }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Not signed in'); return; }

      const cleanLocales = (m: LocalesMap) => {
        const out: LocalesMap = {};
        for (const [k, v] of Object.entries(m)) {
          if (v && v.trim()) out[k] = v.trim();
        }
        return out;
      };

      const payload = {
        owner_id: user.id,
        name: form.name.trim(),
        trigger: form.trigger,
        subject_locales: cleanLocales(form.subject_locales),
        body_locales: cleanLocales(form.body_locales),
        active: form.active,
        listing_ids: form.listing_ids,
        updated_at: new Date().toISOString(),
      };

      if (mode === 'create') {
        const { data, error } = await supabase
          .from('pms_message_templates')
          .insert(payload)
          .select('id')
          .single();
        if (error) { setError(error.message); return; }
        router.push(`/dashboard/pms/automations/${data.id}`);
      } else {
        const { error } = await supabase
          .from('pms_message_templates')
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

  const scopeMode = form.listing_ids === null ? 'all' : 'specific';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-28 md:pb-6">
      {/* BASICS */}
      <Section icon={Bot} color="fuchsia" title={t.basicsTitle}>
        <Field label={t.name}>
          <input type="text" required value={form.name}
            onChange={e => update('name', e.target.value)}
            className="template-input" placeholder={t.namePlaceholder} />
        </Field>
        <div>
          <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.activeTitle}</div>
          <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition">
            <input type="checkbox" checked={form.active}
              onChange={e => update('active', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-400" />
            <span className="text-sm text-slate-800">
              {form.active ? t.activeLabel : t.inactive}
            </span>
          </label>
        </div>
      </Section>

      {/* TRIGGER */}
      <Section icon={Zap} color="amber" title={t.triggerTitle}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TRIGGERS.map(tr => {
            const Icon = tr.icon;
            const selected = form.trigger === tr.value;
            const meta = el ? tr.el : tr.en;
            return (
              <label key={tr.value}
                className={`cursor-pointer rounded-xl border-2 p-3 transition ${
                  selected ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                <input type="radio" name="trigger" checked={selected}
                  onChange={() => update('trigger', tr.value)} className="sr-only" />
                <div className="flex items-start gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${selected ? 'text-amber-700' : 'text-slate-600'}`} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{meta.title}</div>
                    <div className="text-[11px] text-slate-600 leading-snug">{meta.desc}</div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </Section>

      {/* CONTENT */}
      <Section icon={Globe} color="sky" title={t.contentTitle}>
        <div className="flex flex-wrap gap-1.5">
          {LOCALES.map(loc => {
            const filled = !!(form.body_locales[loc.code]?.trim() || form.subject_locales[loc.code]?.trim());
            const active = activeLocale === loc.code;
            return (
              <button type="button" key={loc.code}
                onClick={() => setActiveLocale(loc.code)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                  active ? 'bg-sky-600 text-white shadow-sm'
                  : filled ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}>
                <span>{loc.flag}</span> {loc.label}
                {filled && <CheckCircle2 className={`w-3 h-3 ${active ? 'text-white' : 'text-sky-600'}`} />}
              </button>
            );
          })}
        </div>

        <Field label={t.subject}>
          <input type="text" value={form.subject_locales[activeLocale] || ''}
            onChange={e => setLocaleValue('subject_locales', activeLocale, e.target.value)}
            className="template-input" placeholder={t.subjectPlaceholder} />
        </Field>
        <Field label={t.body}>
          <textarea rows={7} value={form.body_locales[activeLocale] || ''}
            onChange={e => setLocaleValue('body_locales', activeLocale, e.target.value)}
            className="template-input font-mono text-[13px]" placeholder={t.bodyPlaceholder} />
        </Field>

        <div>
          <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.variables} <span className="text-slate-500 font-normal">· {t.variablesHint}</span></div>
          <div className="flex flex-wrap gap-1.5">
            {VARIABLES.map(v => (
              <button type="button" key={v}
                onClick={() => copyVar(v)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono transition ${
                  copiedVar === v ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                {copiedVar === v ? `✓ ${t.copied}` : v}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* SCOPE */}
      <Section icon={Home} color="emerald" title={t.scopeTitle}>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => setScope('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-xl transition ${
              scopeMode === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}>
            {t.scopeAll}
          </button>
          <button type="button" onClick={() => setScope('specific')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-xl transition ${
              scopeMode === 'specific' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}>
            {t.scopeSpecific}
          </button>
        </div>
        {scopeMode === 'specific' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {listings.map(l => {
              const selected = (form.listing_ids || []).includes(l.id);
              return (
                <label key={l.id}
                  className={`cursor-pointer rounded-xl border px-3 py-2 flex items-center gap-2 transition ${
                    selected ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                  <input type="checkbox" checked={selected}
                    onChange={() => toggleListing(l.id)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400" />
                  <span className="text-sm text-slate-800 truncate">
                    {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
                  </span>
                </label>
              );
            })}
          </div>
        )}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-sm transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.template-input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid rgb(203 213 225);
          border-radius: 0.75rem;
          background: white;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.template-input:focus) {
          outline: none;
          border-color: rgb(192 38 211);
          box-shadow: 0 0 0 3px rgb(217 70 239 / 0.2);
        }
      `}</style>
    </form>
  );
}

export const TRIGGER_META: Record<TemplateTrigger, { icon: React.ComponentType<{ className?: string }>; el: string; en: string }> = {
  manual:        { icon: Pencil,        el: 'Χειροκίνητο',     en: 'Manual' },
  on_inquiry:    { icon: MessageSquare, el: 'Νέο ερώτημα',     en: 'On inquiry' },
  on_book:       { icon: Calendar,      el: 'Επιβεβαίωση',     en: 'On booking' },
  '3days_before':{ icon: Clock,         el: '3 μέρες πριν',    en: '3 days before' },
  '1day_before': { icon: Clock,         el: '1 μέρα πριν',     en: '1 day before' },
  on_checkin:    { icon: LogIn,         el: 'Check-in',        en: 'On check-in' },
  on_checkout:   { icon: LogOut,        el: 'Check-out',       en: 'On check-out' },
  '7days_after': { icon: Star,          el: '7 μέρες μετά',    en: '7 days after' },
  on_cancel:     { icon: XCircle,       el: 'Ακύρωση',         en: 'On cancel' },
};

const SECTION_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', ring: 'ring-fuchsia-200' },
  amber:   { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-200' },
  sky:     { bg: 'bg-sky-100',     text: 'text-sky-700',     ring: 'ring-sky-200' },
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
