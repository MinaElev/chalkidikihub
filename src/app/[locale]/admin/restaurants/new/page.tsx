'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import { ALL_CUISINE_TYPES, ALL_PRICE_LEVELS } from '@/lib/constants';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AIHelper } from '@/components/admin/AIHelper';
import { LocationPicker } from '@/components/ui/LocationPicker';

const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];
const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;
const LANG_LABELS: Record<string, string> = { el: 'EL 🇬🇷', en: 'EN 🇬🇧', de: 'DE 🇩🇪', bg: 'BG 🇧🇬', ru: 'RU 🇷🇺', ro: 'RO 🇷🇴' };

export default function NewRestaurantPage() {
  const router = useRouter();
  const tCuisine = useTranslations('cuisineTypes');
  const tPrice = useTranslations('priceLevels');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formatting, setFormatting] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({
    slug: '', area: 'kassandra', location_name: '',
    latitude: 0, longitude: 0, image_url: '',
    cuisine: [] as string[], price_level: 'moderate',
    rating: 0, reviews_count: 0,
    phone: '', hours: '',
    has_sea_view: false, has_live_music: false, accepts_reservations: false,
    tags_input: '', image_alt: '',
    // Per-language
    name_el: '', name_en: '', name_de: '', name_bg: '', name_ru: '', name_ro: '',
    description_el: '', description_en: '', description_de: '', description_bg: '', description_ru: '', description_ro: '',
    meta_title_el: '', meta_title_en: '', meta_title_de: '', meta_title_bg: '', meta_title_ru: '', meta_title_ro: '',
    meta_description_el: '', meta_description_en: '', meta_description_de: '', meta_description_bg: '', meta_description_ru: '', meta_description_ro: '',
  });

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCuisine(c: string) {
    setForm((prev) => {
      const cuisine = prev.cuisine as string[];
      return { ...prev, cuisine: cuisine.includes(c) ? cuisine.filter((x) => x !== c) : [...cuisine, c] };
    });
  }

  async function handleFormatDescription(lang: string) {
    const content = (form[`description_${lang}`] as string || '').trim();
    if (!content) return;
    setFormatting(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'format_content', content, lang }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.formatted) update(`description_${lang}`, data.formatted);
      }
    } catch {}
    setFormatting(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    const supabase = createClient();
    const { tags_input, ...rest } = form;
    const { error: err } = await supabase.from('restaurants').insert({
      ...rest,
      tags: (tags_input as string).split(',').map(s => s.trim()).filter(Boolean),
      latitude: Number(form.latitude), longitude: Number(form.longitude),
      rating: Number(form.rating), reviews_count: Number(form.reviews_count),
    });
    if (err) { setError(err.message); setSaving(false); return; }
    router.push('/admin/restaurants');
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/restaurants" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">New Restaurant / Bar</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* AI Auto-Complete */}
        <AIHelper
          titleEl={form.name_el as string}
          descriptionEl={form.description_el as string}
          category="restaurant"
          location={form.location_name as string}
          onComplete={(data) => {
            setForm((prev) => ({
              ...prev,
              name_en: data.translations.title_en,
              name_de: data.translations.title_de, name_bg: data.translations.title_bg,
              name_ru: data.translations.title_ru, name_ro: data.translations.title_ro,
              description_en: data.translations.description_en,
              description_de: data.translations.description_de, description_bg: data.translations.description_bg,
              description_ru: data.translations.description_ru, description_ro: data.translations.description_ro,
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

        {/* Basic fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" required value={form.slug as string} onChange={(e) => update('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <select value={form.area as string} onChange={(e) => update('area', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
            <input type="text" value={form.location_name as string} onChange={(e) => update('location_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <ImageUpload currentUrl={form.image_url as string} onUpload={(url) => update('image_url', url)} folder="restaurants" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
            <input type="number" min="0" max="5" step="0.1" value={form.rating as number} onChange={(e) => update('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
            <input type="number" min="0" value={form.reviews_count as number} onChange={(e) => update('reviews_count', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <LocationPicker latitude={Number(form.latitude) || 40.1} longitude={Number(form.longitude) || 23.6}
          onLocationChange={(lat, lng) => { update('latitude', lat); update('longitude', lng); }} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price Level</label>
            <select value={form.price_level as string} onChange={(e) => update('price_level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
              {ALL_PRICE_LEVELS.map((p) => <option key={p} value={p}>{tPrice(p)}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={form.phone as string} onChange={(e) => update('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
            <input type="text" value={form.hours as string} onChange={(e) => update('hours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="flex flex-wrap gap-6">
          {[{ key: 'has_sea_view', label: 'Sea View' }, { key: 'has_live_music', label: 'Live Music' }, { key: 'accepts_reservations', label: 'Reservations' }].map(f => (
            <label key={f.key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[f.key] as boolean} onChange={(e) => update(f.key, e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
              <span className="text-sm text-gray-700">{f.label}</span>
            </label>
          ))}
        </div>

        {/* Cuisine */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
          <div className="flex flex-wrap gap-2">
            {ALL_CUISINE_TYPES.map((c) => (
              <button key={c} type="button" onClick={() => toggleCuisine(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  (form.cuisine as string[]).includes(c) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                }`}>{tCuisine(c)}</button>
            ))}
          </div>
        </div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input type="text" value={form.tags_input as string} onChange={(e) => update('tags_input', e.target.value)}
            placeholder="tag1, tag2, tag3" className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>

        {/* Names — 6 languages */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ονομασία (6 γλώσσες)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LANGS.map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name ({LANG_LABELS[lang]})</label>
                <input type="text" value={(form[`name_${lang}`] as string) || ''} onChange={(e) => update(`name_${lang}`, e.target.value)}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 ${(form[`name_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Descriptions — 6 languages with AI Format */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Περιγραφή (6 γλώσσες)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LANGS.map((lang) => (
              <div key={lang}>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-500">Description ({LANG_LABELS[lang]})</label>
                  {(form[`description_${lang}`] as string || '').trim() && (
                    <button type="button" onClick={() => handleFormatDescription(lang)} disabled={formatting}
                      className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded text-[10px] font-medium disabled:opacity-50">
                      {formatting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Format
                    </button>
                  )}
                </div>
                <textarea rows={3} value={(form[`description_${lang}`] as string) || ''} onChange={(e) => update(`description_${lang}`, e.target.value)}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 ${(form[`description_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* SEO — 6 languages */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">SEO Meta Tags (6 γλώσσες)</h3>
          <p className="text-xs text-gray-500 mb-4">Γεμίζουν αυτόματα με το AI Auto-Complete.</p>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Titles</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {LANGS.map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Title ({LANG_LABELS[lang]}) <span className="text-gray-400">({((form[`meta_title_${lang}`] as string) || '').length}/60)</span></label>
                <input type="text" value={(form[`meta_title_${lang}`] as string) || ''} onChange={(e) => update(`meta_title_${lang}`, e.target.value)}
                  maxLength={70} className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-primary-500 ${(form[`meta_title_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Descriptions</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {LANGS.map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Desc ({LANG_LABELS[lang]}) <span className="text-gray-400">({((form[`meta_description_${lang}`] as string) || '').length}/155)</span></label>
                <textarea rows={2} value={(form[`meta_description_${lang}`] as string) || ''} onChange={(e) => update(`meta_description_${lang}`, e.target.value)}
                  maxLength={170} className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-primary-500 ${(form[`meta_description_${lang}`] as string) ? 'border-green-300 bg-green-50/30' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text Φωτογραφίας</label>
            <input type="text" value={(form.image_alt as string) || ''} onChange={(e) => update('image_alt', e.target.value)}
              placeholder="Περιγραφή εικόνας για SEO & accessibility"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
