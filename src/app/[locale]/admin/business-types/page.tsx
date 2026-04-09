'use client';

import { useEffect, useState } from 'react';
import { Tag, Plus, Save, Trash2, Loader2, Edit, X, Sparkles } from 'lucide-react';

interface BusinessType {
  id: string;
  slug: string;
  name_el: string;
  name_en: string;
  name_de: string;
  name_bg: string;
  name_ru: string;
  name_ro: string;
  sort_order: number;
}

const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;
const LANG_LABELS: Record<string, string> = { el: '🇬🇷 EL', en: '🇬🇧 EN', de: '🇩🇪 DE', bg: '🇧🇬 BG', ru: '🇷🇺 RU', ro: '🇷🇴 RO' };

export default function BusinessTypesPage() {
  const [types, setTypes] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [translating, setTranslating] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => { loadTypes(); }, []);

  async function loadTypes() {
    const res = await fetch('/api/business-types');
    const data = await res.json();
    if (Array.isArray(data)) setTypes(data);
    setLoading(false);
  }

  function startEdit(t: BusinessType) {
    setEditing(t.id);
    setAdding(false);
    setForm({
      slug: t.slug, sort_order: String(t.sort_order),
      ...Object.fromEntries(LANGS.map(l => [`name_${l}`, (t as any)[`name_${l}`] || ''])),
    });
  }

  function startAdd() {
    setEditing(null);
    setAdding(true);
    setForm({ slug: '', sort_order: String(types.length + 1), ...Object.fromEntries(LANGS.map(l => [`name_${l}`, ''])) });
  }

  async function handleSave() {
    if (!form.slug || !form.name_el) { setError('Slug και Ελληνικό όνομα είναι υποχρεωτικά'); return; }
    setSaving(true); setError('');

    const body: Record<string, unknown> = {
      slug: form.slug,
      sort_order: Number(form.sort_order) || 0,
      ...Object.fromEntries(LANGS.map(l => [`name_${l}`, form[`name_${l}`] || ''])),
    };

    if (editing) {
      const res = await fetch('/api/business-types', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing, ...body }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); }
    } else {
      const res = await fetch('/api/business-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); }
    }

    setSaving(false);
    setEditing(null);
    setAdding(false);
    loadTypes();
  }

  async function handleTranslate() {
    const nameEl = form.name_el?.trim();
    if (!nameEl) return;
    setTranslating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full_auto',
          title: nameEl,
          description: nameEl,
          category: 'business type',
          location: 'Halkidiki',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({
          ...prev,
          name_en: data.translations?.title_en || prev.name_en,
          name_de: data.translations?.title_de || prev.name_de,
          name_bg: data.translations?.title_bg || prev.name_bg,
          name_ru: data.translations?.title_ru || prev.name_ru,
          name_ro: data.translations?.title_ro || prev.name_ro,
        }));
      }
    } catch {}
    setTranslating(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Διαγραφή "${name}"; Αν χρησιμοποιείται σε εστιατόρια, θα παραμείνει στα δεδομένα αλλά δεν θα εμφανίζεται ως επιλογή.`)) return;
    await fetch('/api/business-types', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadTypes();
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Είδη Μαγαζιών ({types.length})</h1>
        </div>
        <button onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Νέο Είδος
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {/* Add/Edit form */}
      {(adding || editing) && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{editing ? 'Επεξεργασία' : 'Νέο Είδος Μαγαζιού'}</h2>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Slug *</label>
              <input type="text" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="beach-bar" disabled={!!editing}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Σειρά</label>
              <input type="number" value={form.sort_order || ''} onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <button type="button" onClick={handleTranslate} disabled={translating || !form.name_el?.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-all">
              {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {translating ? 'Μετάφραση...' : 'AI Μετάφραση σε 5 γλώσσες'}
            </button>
            <p className="text-xs text-gray-400">Γράψε το ελληνικό όνομα και πάτα AI</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {LANGS.map(lang => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{LANG_LABELS[lang]} {lang === 'el' ? '*' : ''}</label>
                <input type="text" value={form[`name_${lang}`] || ''} onChange={(e) => setForm({ ...form, [`name_${lang}`]: e.target.value })}
                  placeholder={lang === 'el' ? 'π.χ. Σουβλατζίδικο' : ''}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 ${form[`name_${lang}`] ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>

          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editing ? 'Αποθήκευση' : 'Δημιουργία'}
          </button>
        </div>
      )}

      {/* Types list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">#</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">🇬🇷 Ελληνικά</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">🇬🇧 English</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Γλώσσες</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {types.map(t => {
              const filledLangs = LANGS.filter(l => (t as any)[`name_${l}`]).length;
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-400">{t.sort_order}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{t.slug}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.name_el}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.name_en}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${filledLangs >= 6 ? 'text-green-600' : filledLangs >= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                      {filledLangs}/6
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => startEdit(t)} className="p-1.5 hover:bg-blue-50 rounded text-blue-500"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t.id, t.name_el)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
