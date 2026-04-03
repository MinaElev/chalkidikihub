'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ALL_CUISINE_TYPES, ALL_PRICE_LEVELS } from '@/lib/constants';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AIHelper } from '@/components/admin/AIHelper';

const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];

export default function NewRestaurantPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    slug: '', name_el: '', name_en: '',
    description_el: '', description_en: '',
    area: 'kassandra', location_name: '',
    latitude: 0, longitude: 0,
    image_url: '', cuisine: [] as string[],
    price_level: 'moderate',
    rating: 0, reviews_count: 0,
    phone: '', hours: '',
    has_sea_view: false, has_live_music: false, accepts_reservations: false,
    tags_input: '',
    meta_title_el: '', meta_title_en: '', meta_description_el: '', meta_description_en: '', image_alt: '',
  });

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCuisine(c: string) {
    setForm((prev) => ({
      ...prev,
      cuisine: prev.cuisine.includes(c) ? prev.cuisine.filter((x) => x !== c) : [...prev.cuisine, c],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { tags_input, ...rest } = form;
    const tags = tags_input.split(',').map((s) => s.trim()).filter(Boolean);
    const { error: err } = await supabase.from('restaurants').insert({
      ...rest,
      tags,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      rating: Number(form.rating),
      reviews_count: Number(form.reviews_count),
    });
    if (err) { setError(err.message); setSaving(false); return; }
    router.push('/admin/restaurants');
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/restaurants" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">New Restaurant</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <AIHelper
          titleEl={form.name_el}
          descriptionEl={form.description_el}
          category="restaurant"
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
              folder="restaurants"
            /></div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price Level</label>
            <select value={form.price_level} onChange={(e) => update('price_level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
              {ALL_PRICE_LEVELS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
            <input type="text" value={form.hours} onChange={(e) => update('hours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input type="text" value={form.tags_input} onChange={(e) => update('tags_input', e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.has_sea_view} onChange={(e) => update('has_sea_view', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
            <span className="text-sm text-gray-700">Sea View</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.has_live_music} onChange={(e) => update('has_live_music', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
            <span className="text-sm text-gray-700">Live Music</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.accepts_reservations} onChange={(e) => update('accepts_reservations', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
            <span className="text-sm text-gray-700">Accepts Reservations</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
          <div className="flex flex-wrap gap-2">
            {ALL_CUISINE_TYPES.map((c) => (
              <button key={c} type="button" onClick={() => toggleCuisine(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  form.cuisine.includes(c) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                }`}>{c}</button>
            ))}
          </div>
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
            Save Restaurant
          </button>
        </div>
      </form>
    </div>
  );
}
