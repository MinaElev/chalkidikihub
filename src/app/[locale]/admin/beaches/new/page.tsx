'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ALL_BEACH_FEATURES } from '@/lib/constants';
import { LocationPicker } from '@/components/ui/LocationPicker';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AIHelper } from '@/components/admin/AIHelper';

const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];

export default function NewBeachPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    slug: '', name_el: '', name_en: '',
    description_el: '', description_en: '',
    area: 'kassandra', location_name: '',
    latitude: 0, longitude: 0,
    image_url: '', features: [] as string[],
    rating: 0, reviews_count: 0,
    meta_title_el: '', meta_title_en: '', meta_description_el: '', meta_description_en: '', image_alt: '',
    name_de: '', name_bg: '', name_ru: '', name_ro: '', tags: '',
  });

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleFeature(f: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { tags: tagsStr, ...restForm } = form;
    const { error: err } = await supabase.from('beaches').insert({
      ...restForm,
      tags: tagsStr.split(',').map(s => s.trim()).filter(Boolean),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      rating: Number(form.rating),
      reviews_count: Number(form.reviews_count),
    });
    if (err) { setError(err.message); setSaving(false); return; }
    router.push('/admin/beaches');
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/beaches" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">New Beach</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <AIHelper
          titleEl={form.name_el}
          descriptionEl={form.description_el}
          category="beach"
          location={form.location_name}
          onComplete={(data) => {
            setForm((prev) => ({
              ...prev,
              name_en: data.translations.title_en,
              name_de: data.translations.title_de,
              name_bg: data.translations.title_bg,
              name_ru: data.translations.title_ru,
              name_ro: data.translations.title_ro,
              description_en: data.translations.description_en,
              meta_title_el: data.seo.meta_title_el, meta_title_en: data.seo.meta_title_en,
              meta_description_el: data.seo.meta_description_el, meta_description_en: data.seo.meta_description_en,
              image_alt: data.seo.image_alt, tags: data.seo.tags.join(', '),
            }));
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" required value={form.slug} onChange={(e) => update('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name (EL)</label>
            <input type="text" required value={form.name_el} onChange={(e) => update('name_el', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
            <input type="text" value={form.name_en} onChange={(e) => update('name_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description (EL)</label>
            <textarea rows={3} value={form.description_el} onChange={(e) => update('description_el', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
            <textarea rows={3} value={form.description_en} onChange={(e) => update('description_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <select value={form.area} onChange={(e) => update('area', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
            <input type="text" value={form.location_name} onChange={(e) => update('location_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <ImageUpload
              currentUrl={form.image_url}
              onUpload={(url) => setForm({ ...form, image_url: url })}
              folder="beaches"
            /></div>
        </div>

        <LocationPicker
          latitude={Number(form.latitude) || 40.1}
          longitude={Number(form.longitude) || 23.6}
          onLocationChange={(lat, lng) => { update('latitude', lat); update('longitude', lng); }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
            <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => update('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
            <input type="number" min="0" value={form.reviews_count} onChange={(e) => update('reviews_count', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <div className="flex flex-wrap gap-2">
            {ALL_BEACH_FEATURES.map((f) => (
              <button key={f} type="button" onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  form.features.includes(f) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                }`}>{f}</button>
            ))}
          </div>
        </div>

        {/* SEO & Μεταφράσεις */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Μεταφράσεις</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (EL)</label>
              <input type="text" value={form.meta_title_el} onChange={(e) => setForm({ ...form, meta_title_el: e.target.value })}
                placeholder="Τίτλος για Google (60 χαρακτήρες)" maxLength={70}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (EN)</label>
              <input type="text" value={form.meta_title_en} onChange={(e) => setForm({ ...form, meta_title_en: e.target.value })}
                placeholder="Title for Google (60 chars)" maxLength={70}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (EL)</label>
              <textarea rows={2} value={form.meta_description_el} onChange={(e) => setForm({ ...form, meta_description_el: e.target.value })}
                placeholder="Περιγραφή για Google (160 χαρακτήρες)" maxLength={170}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (EN)</label>
              <textarea rows={2} value={form.meta_description_en} onChange={(e) => setForm({ ...form, meta_description_en: e.target.value })}
                placeholder="Description for Google (160 chars)" maxLength={170}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text Φωτογραφίας</label>
            <input type="text" value={form.image_alt} onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
              placeholder="Περιγραφή εικόνας για SEO & accessibility"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (DE)</label>
              <input type="text" value={form.name_de} onChange={(e) => setForm({ ...form, name_de: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (BG)</label>
              <input type="text" value={form.name_bg} onChange={(e) => setForm({ ...form, name_bg: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (RU)</label>
              <input type="text" value={form.name_ru} onChange={(e) => setForm({ ...form, name_ru: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (RO)</label>
              <input type="text" value={form.name_ro} onChange={(e) => setForm({ ...form, name_ro: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (SEO keywords)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="beach, kassandra, family, swimming (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Beach
          </button>
        </div>
      </form>
    </div>
  );
}
