'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import { AIHelper } from '@/components/admin/AIHelper';
import { ImageUpload } from '@/components/admin/ImageUpload';

const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
const LANG_LABELS: Record<string, string> = { el: 'EL 🇬🇷', en: 'EN 🇬🇧', de: 'DE 🇩🇪', bg: 'BG 🇧🇬', ru: 'RU 🇷🇺', ro: 'RO 🇷🇴', sr: 'SR 🇷🇸' };
const NATIONS = [{ v: 'el', l: 'Ελληνική' }, { v: 'rs', l: 'Σερβική' }, { v: 'bg', l: 'Βουλγαρική' }, { v: 'ru', l: 'Ρωσική' }];

export default function AdminEditMonasteryPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('monasteries').select('*').eq('id', id).single();
      if (data) {
        const f: Record<string, unknown> = {
          slug: data.slug || '', rank: data.rank || 0, founded: data.founded || 0,
          nation: data.nation || 'el', latitude: data.latitude || 0, longitude: data.longitude || 0,
          image_url: data.image_url || '', image_alt: data.image_alt || '',
        };
        for (const lang of LANGS) {
          f[`name_${lang}`] = data[`name_${lang}`] || '';
          f[`description_${lang}`] = data[`description_${lang}`] || '';
          f[`highlights_${lang}`] = data[`highlights_${lang}`] || '';
          f[`meta_title_${lang}`] = data[`meta_title_${lang}`] || '';
          f[`meta_description_${lang}`] = data[`meta_description_${lang}`] || '';
        }
        setForm(f);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function update(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleAiGenerate() {
    const name = (form.name_el as string || '').trim();
    if (!name) { setError('Συμπλήρωσε το Name EL'); return; }
    setGenerating(true); setError('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'monastery_generate', monastery_name: name, founded: form.founded, nation: form.nation }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      if (data.description_el) update('description_el', data.description_el);
      if (data.highlights_el) update('highlights_el', data.highlights_el);
      setSuccess('AI generated description + highlights!');
    } catch (err) { setError((err as Error).message); }
    setGenerating(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    const supabase = createClient();
    const { error: err } = await supabase.from('monasteries').update({
      ...form,
      rank: Number(form.rank), founded: Number(form.founded),
      latitude: Number(form.latitude), longitude: Number(form.longitude),
    }).eq('id', id);
    if (err) { setError(err.message); setSaving(false); return; }
    setSuccess('Saved!'); setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/monasteries" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Monastery</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* AI Auto-Complete (translations + SEO) */}
        <AIHelper titleEl={form.name_el as string} descriptionEl={form.description_el as string}
          category="monastery" location={`${form.name_el}, Άγιο Όρος`}
          onComplete={(data) => {
            setForm(prev => ({
              ...prev,
              name_en: data.translations.title_en, name_de: data.translations.title_de,
              name_bg: data.translations.title_bg, name_ru: data.translations.title_ru, name_ro: data.translations.title_ro,
              description_en: data.translations.description_en, description_de: data.translations.description_de,
              description_bg: data.translations.description_bg, description_ru: data.translations.description_ru, description_ro: data.translations.description_ro,
              meta_title_el: data.seo.meta_title_el, meta_title_en: data.seo.meta_title_en,
              meta_title_de: data.seo.meta_title_de, meta_title_bg: data.seo.meta_title_bg,
              meta_title_ru: data.seo.meta_title_ru, meta_title_ro: data.seo.meta_title_ro,
              meta_description_el: data.seo.meta_description_el, meta_description_en: data.seo.meta_description_en,
              meta_description_de: data.seo.meta_description_de, meta_description_bg: data.seo.meta_description_bg,
              meta_description_ru: data.seo.meta_description_ru, meta_description_ro: data.seo.meta_description_ro,
              image_alt: data.seo.image_alt,
            }));
          }} />

        {/* AI Generate Description */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
          <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-900">🤖 AI Generate — Βήμα 1</p>
            <p className="text-xs text-purple-600">Γράφει <strong>περιγραφή EL</strong> + <strong>highlights</strong> βάσει ονόματος μονής. Μετά πατήστε AI Auto-Complete (Βήμα 2) για μεταφράσεις + SEO.</p>
          </div>
          <button type="button" onClick={handleAiGenerate} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 shrink-0">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'AI Description'}
          </button>
        </div>

        {/* Basic fields */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={form.slug as string} onChange={e => update('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
            <input type="number" value={form.rank as number} onChange={e => update('rank', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
            <input type="number" value={form.founded as number} onChange={e => update('founded', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Nation</label>
            <select value={form.nation as string} onChange={e => update('nation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm">
              {NATIONS.map(n => <option key={n.v} value={n.v}>{n.l}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <ImageUpload currentUrl={form.image_url as string} onUpload={url => update('image_url', url)} folder="monasteries" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input type="number" step="0.0001" value={form.latitude as number} onChange={e => update('latitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="number" step="0.0001" value={form.longitude as number} onChange={e => update('longitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" /></div>
        </div>

        {/* Names 6 langs */}
        <div className="border-t border-gray-200 pt-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Name (6 languages)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LANGS.map(lang => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{LANG_LABELS[lang]}</label>
                <input type="text" value={(form[`name_${lang}`] as string) || ''} onChange={e => update(`name_${lang}`, e.target.value)}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${(form[`name_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description (6 languages)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LANGS.map(lang => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{LANG_LABELS[lang]}</label>
                <textarea rows={3} value={(form[`description_${lang}`] as string) || ''} onChange={e => update(`description_${lang}`, e.target.value)}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${(form[`description_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights (6 languages)</h3>
          <p className="text-xs text-gray-500 mb-2">Separate with | (e.g. "Library|Icon|Frescoes")</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LANGS.map(lang => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{LANG_LABELS[lang]}</label>
                <input type="text" value={(form[`highlights_${lang}`] as string) || ''} onChange={e => update(`highlights_${lang}`, e.target.value)}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${(form[`highlights_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="border-t border-gray-200 pt-5">
          <h3 className="text-lg font-semibold text-red-600 mb-3">SEO Meta Tags</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {LANGS.map(lang => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Title ({LANG_LABELS[lang]}) <span className="text-gray-400">({((form[`meta_title_${lang}`] as string) || '').length}/60)</span></label>
                <input type="text" value={(form[`meta_title_${lang}`] as string) || ''} onChange={e => update(`meta_title_${lang}`, e.target.value)}
                  maxLength={70} className={`w-full px-3 py-1.5 border rounded-lg text-xs ${(form[`meta_title_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {LANGS.map(lang => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Desc ({LANG_LABELS[lang]}) <span className="text-gray-400">({((form[`meta_description_${lang}`] as string) || '').length}/155)</span></label>
                <textarea rows={2} value={(form[`meta_description_${lang}`] as string) || ''} onChange={e => update(`meta_description_${lang}`, e.target.value)}
                  maxLength={170} className={`w-full px-3 py-1.5 border rounded-lg text-xs ${(form[`meta_description_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt</label>
            <input type="text" value={(form.image_alt as string) || ''} onChange={e => update('image_alt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm max-w-md" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-sm font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Monastery
          </button>
        </div>
      </form>
    </div>
  );
}
