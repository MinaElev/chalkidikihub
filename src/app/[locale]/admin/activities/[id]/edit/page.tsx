'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ALL_ACTIVITY_CATEGORIES } from '@/lib/constants';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AIHelper } from '@/components/admin/AIHelper';

const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];

export default function EditActivityPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    slug: '', name_el: '', name_en: '',
    description_el: '', description_en: '',
    area: 'kassandra', location_name: '',
    latitude: 0, longitude: 0,
    image_url: '', category: 'historical',
    price_range: '', duration: '',
    rating: 0, reviews_count: 0,
    tags_input: '',
    meta_title_el: '', meta_title_en: '', meta_description_el: '', meta_description_en: '', image_alt: '',
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('activities').select('*').eq('id', id).single();
      if (data) {
        setForm({
          slug: data.slug || '', name_el: data.name_el || '', name_en: data.name_en || '',
          description_el: data.description_el || '', description_en: data.description_en || '',
          area: data.area || 'kassandra', location_name: data.location_name || '',
          latitude: data.latitude || 0, longitude: data.longitude || 0,
          image_url: data.image_url || '', category: data.category || 'historical',
          price_range: data.price_range || '', duration: data.duration || '',
          rating: data.rating || 0, reviews_count: data.reviews_count || 0,
          tags_input: (data.tags || []).join(', '),
          meta_title_el: data.meta_title_el || '', meta_title_en: data.meta_title_en || '',
          meta_description_el: data.meta_description_el || '', meta_description_en: data.meta_description_en || '',
          image_alt: data.image_alt || '',
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const supabase = createClient();
    const { tags_input, ...rest } = form;
    const tags = tags_input.split(',').map((s) => s.trim()).filter(Boolean);
    const { error: err } = await supabase.from('activities').update({
      ...rest,
      tags,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      rating: Number(form.rating),
      reviews_count: Number(form.reviews_count),
    }).eq('id', id);
    if (err) { setError(err.message); setSaving(false); return; }
    setSuccess('Saved!');
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/activities" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Activity</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <AIHelper
          titleEl={form.name_el}
          descriptionEl={form.description_el}
          category={form.category}
          location={form.location_name}
          onComplete={(data) => {
            setForm((prev) => ({
              ...prev,
              name_en: data.translations.title_en,
              description_en: data.translations.description_en,
              meta_title_el: data.seo.meta_title_el, meta_title_en: data.seo.meta_title_en,
              meta_description_el: data.seo.meta_description_el, meta_description_en: data.seo.meta_description_en,
              image_alt: data.seo.image_alt,
            }));
            // Save extra languages directly to DB
            const supabase = createClient();
            supabase.from('activities').update({
              name_de: data.translations.title_de, name_bg: data.translations.title_bg,
              name_ru: data.translations.title_ru, name_ro: data.translations.title_ro,
              description_de: data.translations.description_de, description_bg: data.translations.description_bg,
              description_ru: data.translations.description_ru, description_ro: data.translations.description_ro,
              meta_title_de: data.seo.meta_title_de, meta_title_bg: data.seo.meta_title_bg,
              meta_title_ru: data.seo.meta_title_ru, meta_title_ro: data.seo.meta_title_ro,
              meta_description_de: data.seo.meta_description_de, meta_description_bg: data.seo.meta_description_bg,
              meta_description_ru: data.seo.meta_description_ru, meta_description_ro: data.seo.meta_description_ro,
            }).eq('id', id);
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
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
              {ALL_ACTIVITY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <ImageUpload
              currentUrl={form.image_url}
              onUpload={(url) => setForm({ ...form, image_url: url })}
              folder="activities"
            /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
            <input type="text" value={form.location_name} onChange={(e) => update('location_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <input type="text" value={form.price_range} onChange={(e) => update('price_range', e.target.value)}
              placeholder="e.g. 10-30"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input type="text" value={form.duration} onChange={(e) => update('duration', e.target.value)}
              placeholder="e.g. 2 hours"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input type="number" step="any" value={form.latitude} onChange={(e) => update('latitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="number" step="any" value={form.longitude} onChange={(e) => update('longitude', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
            <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => update('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
            <input type="number" min="0" value={form.reviews_count} onChange={(e) => update('reviews_count', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input type="text" value={form.tags_input} onChange={(e) => update('tags_input', e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* SEO */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text Φωτογραφίας</label>
            <input type="text" value={form.image_alt} onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
              placeholder="Περιγραφή εικόνας για SEO & accessibility"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Activity
          </button>
        </div>
      </form>
    </div>
  );
}
