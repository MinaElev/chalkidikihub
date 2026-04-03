'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AIHelper } from '@/components/admin/AIHelper';

export default function EditAreaPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    slug: '', name_el: '', name_en: '', name_de: '', name_bg: '', name_ru: '', name_ro: '',
    description_el: '', description_en: '', description_de: '', description_bg: '', description_ru: '', description_ro: '',
    image_url: '', latitude: 0, longitude: 0, sort_order: 0,
    meta_title_el: '', meta_title_en: '', meta_title_de: '', meta_title_bg: '', meta_title_ru: '', meta_title_ro: '',
    meta_description_el: '', meta_description_en: '', meta_description_de: '', meta_description_bg: '', meta_description_ru: '', meta_description_ro: '',
    image_alt: '',
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.from('areas').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        const f: Record<string, unknown> = {};
        Object.keys(form).forEach((key) => { f[key] = (data as Record<string, unknown>)[key] || (typeof (form as Record<string, unknown>)[key] === 'number' ? 0 : ''); });
        setForm(f as typeof form);
      }
      setLoading(false);
    });
  }, [id]);

  function update(field: string, value: unknown) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    const supabase = createClient();
    const { error: err } = await supabase.from('areas').update(form).eq('id', id);
    if (err) { setError(err.message); } else { setSuccess('Αποθηκεύτηκε!'); }
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/areas" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Area: {form.name_el}</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <AIHelper
          titleEl={form.name_el}
          descriptionEl={form.description_el}
          category="area"
          location={form.name_en}
          onComplete={(data) => {
            setForm((prev) => ({
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
          }}
        />

        {/* Slug (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input type="text" value={form.slug} disabled className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500" />
        </div>

        {/* Names */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Ονόματα</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name ({lang.toUpperCase()})</label>
                <input type="text" value={(form as unknown as Record<string, string>)[`name_${lang}`] || ''} onChange={(e) => update(`name_${lang}`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Περιγραφές</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description ({lang.toUpperCase()})</label>
                <textarea rows={3} value={(form as unknown as Record<string, string>)[`description_${lang}`] || ''} onChange={(e) => update(`description_${lang}`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <ImageUpload
          currentUrl={form.image_url}
          onUpload={(url) => setForm({ ...form, image_url: url })}
          folder="areas"
          aiPromptContext={`${form.name_en} peninsula, Halkidiki Greece, aerial view`}
        />

        {/* Coordinates + Sort */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input type="number" step="0.0001" value={form.latitude} onChange={(e) => update('latitude', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="number" step="0.0001" value={form.longitude} onChange={(e) => update('longitude', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {/* SEO */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">SEO Meta Tags (6 γλώσσες)</h3>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Titles</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">({lang.toUpperCase()}) <span className="text-gray-400">({((form as unknown as Record<string, string>)[`meta_title_${lang}`] || '').length}/60)</span></label>
                <input type="text" maxLength={70} value={(form as unknown as Record<string, string>)[`meta_title_${lang}`] || ''} onChange={(e) => update(`meta_title_${lang}`, e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Descriptions</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">({lang.toUpperCase()}) <span className="text-gray-400">({((form as unknown as Record<string, string>)[`meta_description_${lang}`] || '').length}/155)</span></label>
                <textarea rows={2} maxLength={170} value={(form as unknown as Record<string, string>)[`meta_description_${lang}`] || ''} onChange={(e) => update(`meta_description_${lang}`, e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
            <input type="text" value={form.image_alt} onChange={(e) => update('image_alt', e.target.value)}
              placeholder="Περιγραφή εικόνας για SEO"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Αποθήκευση
          </button>
        </div>
      </form>
    </div>
  );
}
