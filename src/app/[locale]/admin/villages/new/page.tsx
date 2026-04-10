'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import { AIHelper } from '@/components/admin/AIHelper';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LocationPicker } from '@/components/ui/LocationPicker';

const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];
const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
const LANG_LABELS: Record<string, string> = { el: 'EL 🇬🇷', en: 'EN 🇬🇧', de: 'DE 🇩🇪', bg: 'BG 🇧🇬', ru: 'RU 🇷🇺', ro: 'RO 🇷🇴', sr: 'SR 🇷🇸' };

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[άα]/g, 'a').replace(/[έε]/g, 'e').replace(/[ήη]/g, 'i').replace(/[ίι]/g, 'i')
    .replace(/[όο]/g, 'o').replace(/[ύυ]/g, 'y').replace(/[ώω]/g, 'o').replace(/[ς]/g, 's')
    .replace(/[σ]/g, 's').replace(/[δ]/g, 'd').replace(/[φ]/g, 'f').replace(/[γ]/g, 'g')
    .replace(/[ξ]/g, 'x').replace(/[κ]/g, 'k').replace(/[λ]/g, 'l').replace(/[μ]/g, 'm')
    .replace(/[ν]/g, 'n').replace(/[π]/g, 'p').replace(/[ρ]/g, 'r').replace(/[τ]/g, 't')
    .replace(/[θ]/g, 'th').replace(/[χ]/g, 'ch').replace(/[ψ]/g, 'ps').replace(/[ζ]/g, 'z')
    .replace(/[β]/g, 'v').replace(/[\.]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminNewVillagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<Record<string, unknown>>({
    slug: '', area: 'kassandra', latitude: 40.1, longitude: 23.5,
    image_url: '', image_alt: '', population: 0,
    ...Object.fromEntries(LANGS.flatMap(l => [
      [`name_${l}`, ''], [`description_${l}`, ''],
      [`meta_title_${l}`, ''], [`meta_description_${l}`, ''],
    ])),
  });

  function update(field: string, value: unknown) {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'name_el' && !prev.slug) next.slug = slugify(value as string);
      return next;
    });
  }

  async function handleAiGenerate() {
    const name = (form.name_el as string || '').trim();
    if (!name) { setError('Fill in Name EL first'); return; }
    setGenerating(true); setError('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'village_generate', village_name: name, area: form.area }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      if (data.description_el) update('description_el', data.description_el);
      if (data.population) update('population', data.population);
      setSuccess('AI generated description + population!');
    } catch (err) { setError((err as Error).message); }
    setGenerating(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!(form.name_el as string)?.trim()) { setError('Name EL is required'); return; }
    if (!(form.slug as string)?.trim()) { setError('Slug is required'); return; }
    setSaving(true); setError('');
    const supabase = createClient();
    const { error: err } = await supabase.from('villages').insert({
      ...form,
      population: Number(form.population) || null,
      latitude: Number(form.latitude), longitude: Number(form.longitude),
    });
    if (err) { setError(err.message); setSaving(false); return; }
    router.push('/admin/villages');
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/villages" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">New Village</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <AIHelper titleEl={form.name_el as string} descriptionEl={form.description_el as string}
          category="village" location={form.name_el as string}
          onComplete={(data) => {
            setForm(prev => ({
              ...prev,
              name_en: data.translations.title_en, name_de: data.translations.title_de,
              name_bg: data.translations.title_bg, name_ru: data.translations.title_ru, name_ro: data.translations.title_ro, name_sr: data.translations.title_sr && data.translations.title_sr !== 'undefined' ? data.translations.title_sr : '',
              description_en: data.translations.description_en, description_de: data.translations.description_de,
              description_bg: data.translations.description_bg, description_ru: data.translations.description_ru, description_ro: data.translations.description_ro, description_sr: data.translations.description_sr && data.translations.description_sr !== 'undefined' ? data.translations.description_sr : '',
              meta_title_el: data.seo.meta_title_el, meta_title_en: data.seo.meta_title_en,
              meta_title_de: data.seo.meta_title_de, meta_title_bg: data.seo.meta_title_bg,
              meta_title_ru: data.seo.meta_title_ru, meta_title_ro: data.seo.meta_title_ro, meta_title_sr: data.seo.meta_title_sr && data.seo.meta_title_sr !== 'undefined' ? data.seo.meta_title_sr : '',
              meta_description_el: data.seo.meta_description_el, meta_description_en: data.seo.meta_description_en,
              meta_description_de: data.seo.meta_description_de, meta_description_bg: data.seo.meta_description_bg,
              meta_description_ru: data.seo.meta_description_ru, meta_description_ro: data.seo.meta_description_ro, meta_description_sr: data.seo.meta_description_sr && data.seo.meta_description_sr !== 'undefined' ? data.seo.meta_description_sr : '',
              image_alt: data.seo.image_alt,
            }));
          }} />

        {/* AI Generate Description + Population */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
          <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-900">🤖 AI Generate — Βήμα 1</p>
            <p className="text-xs text-purple-600">Γράφει <strong>περιγραφή EL</strong> (HTML) + εκτιμά <strong>πληθυσμό</strong></p>
          </div>
          <button type="button" onClick={handleAiGenerate} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 shrink-0">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'AI Description + Population'}
          </button>
        </div>

        {success && <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={form.slug as string} onChange={e => update('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <select value={form.area as string} onChange={e => update('area', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm">
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
            <input type="number" value={form.population as number} onChange={e => update('population', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <ImageUpload currentUrl={form.image_url as string} onUpload={url => update('image_url', url)} folder="villages" /></div>
        </div>

        <LocationPicker latitude={Number(form.latitude) || 40.1} longitude={Number(form.longitude) || 23.5}
          onLocationChange={(lat, lng) => { update('latitude', lat); update('longitude', lng); }} />

        {/* Names */}
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
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Create Village
          </button>
        </div>
      </form>
    </div>
  );
}
