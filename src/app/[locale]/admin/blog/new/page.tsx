'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AIHelper } from '@/components/admin/AIHelper';

const CATEGORIES = ['guides', 'beaches', 'food', 'activities', 'tips', 'culture'];

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    slug: '', title_el: '', title_en: '',
    excerpt_el: '', excerpt_en: '',
    content_el: '', content_en: '',
    category: 'guides', image_url: '',
    author: 'Halkidiki Hub',
    read_time_min: 5,
    tags_input: '',
    related_area_slugs_input: '',
    related_beach_slugs_input: '',
    related_listing_slugs_input: '',
    related_article_slugs_input: '',
    published_at: '',
    meta_title_el: '', meta_title_en: '', meta_description_el: '', meta_description_en: '', image_alt: '',
  });

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function splitComma(val: string) {
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { tags_input, related_area_slugs_input, related_beach_slugs_input, related_listing_slugs_input, related_article_slugs_input, ...rest } = form;
    const { error: err } = await supabase.from('blog_articles').insert({
      ...rest,
      tags: splitComma(tags_input),
      related_area_slugs: splitComma(related_area_slugs_input),
      related_beach_slugs: splitComma(related_beach_slugs_input),
      related_listing_slugs: splitComma(related_listing_slugs_input),
      related_article_slugs: splitComma(related_article_slugs_input),
      read_time_min: Number(form.read_time_min),
      published_at: form.published_at || null,
    });
    if (err) { setError(err.message); setSaving(false); return; }
    router.push('/admin/blog');
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">New Blog Article</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <AIHelper
          titleEl={form.title_el}
          descriptionEl={form.excerpt_el}
          category={form.category}
          location="Halkidiki"
          onComplete={(data) => {
            setForm((prev) => ({
              ...prev,
              title_en: data.translations.title_en,
              excerpt_en: data.translations.description_en,
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
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title (EL)</label>
            <input type="text" required value={form.title_el} onChange={(e) => update('title_el', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label>
            <input type="text" value={form.title_en} onChange={(e) => update('title_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (EL)</label>
            <textarea rows={2} value={form.excerpt_el} onChange={(e) => update('excerpt_el', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (EN)</label>
            <textarea rows={2} value={form.excerpt_en} onChange={(e) => update('excerpt_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Content (EL)</label>
          <textarea rows={8} value={form.content_el} onChange={(e) => update('content_el', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Content (EN)</label>
          <textarea rows={8} value={form.content_en} onChange={(e) => update('content_en', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <ImageUpload
              currentUrl={form.image_url}
              onUpload={(url) => setForm({ ...form, image_url: url })}
              folder="blog"
            /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input type="text" value={form.author} onChange={(e) => update('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Read Time (min)</label>
            <input type="number" min="1" value={form.read_time_min} onChange={(e) => update('read_time_min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Published At</label>
          <input type="datetime-local" value={form.published_at} onChange={(e) => update('published_at', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 max-w-xs" /></div>

        <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input type="text" value={form.tags_input} onChange={(e) => update('tags_input', e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Related Area Slugs (comma-separated)</label>
            <input type="text" value={form.related_area_slugs_input} onChange={(e) => update('related_area_slugs_input', e.target.value)}
              placeholder="kassandra, sithonia"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Related Beach Slugs (comma-separated)</label>
            <input type="text" value={form.related_beach_slugs_input} onChange={(e) => update('related_beach_slugs_input', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Related Listing Slugs (comma-separated)</label>
            <input type="text" value={form.related_listing_slugs_input} onChange={(e) => update('related_listing_slugs_input', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Related Article Slugs (comma-separated)</label>
            <input type="text" value={form.related_article_slugs_input} onChange={(e) => update('related_article_slugs_input', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" /></div>
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
            Save Article
          </button>
        </div>
      </form>
    </div>
  );
}
