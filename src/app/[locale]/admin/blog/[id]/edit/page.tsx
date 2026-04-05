'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2, ImagePlus } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AIHelper } from '@/components/admin/AIHelper';
import { ContentTranslator } from '@/components/admin/ContentTranslator';

const CATEGORIES = ['guides', 'beaches', 'food', 'activities', 'tips', 'culture'];

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    slug: '', title_el: '', title_en: '',
    excerpt_el: '', excerpt_en: '',
    content_el: '', content_en: '', content_de: '', content_bg: '', content_ru: '', content_ro: '',
    category: 'guides', image_url: '',
    author: 'Halkidiki Hub',
    read_time_min: 5,
    tags_input: '',
    related_area_slugs_input: '',
    related_beach_slugs_input: '',
    related_listing_slugs_input: '',
    related_article_slugs_input: '',
    published_at: '',
    title_de: '', title_bg: '', title_ru: '', title_ro: '',
    excerpt_de: '', excerpt_bg: '', excerpt_ru: '', excerpt_ro: '',
    meta_title_el: '', meta_title_en: '', meta_title_de: '', meta_title_bg: '', meta_title_ru: '', meta_title_ro: '',
    meta_description_el: '', meta_description_en: '', meta_description_de: '', meta_description_bg: '', meta_description_ru: '', meta_description_ro: '',
    image_alt: '',
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('blog_articles').select('*').eq('id', id).single();
      if (data) {
        setForm({
          slug: data.slug || '', title_el: data.title_el || '', title_en: data.title_en || '',
          excerpt_el: data.excerpt_el || '', excerpt_en: data.excerpt_en || '',
          content_el: data.content_el || '', content_en: data.content_en || '',
          content_de: data.content_de || '', content_bg: data.content_bg || '', content_ru: data.content_ru || '', content_ro: data.content_ro || '',
          category: data.category || 'guides', image_url: data.image_url || '',
          author: data.author || 'Halkidiki Hub',
          read_time_min: data.read_time_min || 5,
          tags_input: (data.tags || []).join(', '),
          related_area_slugs_input: (data.related_area_slugs || []).join(', '),
          related_beach_slugs_input: (data.related_beach_slugs || []).join(', '),
          related_listing_slugs_input: (data.related_listing_slugs || []).join(', '),
          related_article_slugs_input: (data.related_article_slugs || []).join(', '),
          published_at: data.published_at ? data.published_at.slice(0, 16) : '',
          title_de: data.title_de || '', title_bg: data.title_bg || '', title_ru: data.title_ru || '', title_ro: data.title_ro || '',
          excerpt_de: data.excerpt_de || '', excerpt_bg: data.excerpt_bg || '', excerpt_ru: data.excerpt_ru || '', excerpt_ro: data.excerpt_ro || '',
          meta_title_el: data.meta_title_el || '', meta_title_en: data.meta_title_en || '',
          meta_title_de: data.meta_title_de || '', meta_title_bg: data.meta_title_bg || '',
          meta_title_ru: data.meta_title_ru || '', meta_title_ro: data.meta_title_ro || '',
          meta_description_el: data.meta_description_el || '', meta_description_en: data.meta_description_en || '',
          meta_description_de: data.meta_description_de || '', meta_description_bg: data.meta_description_bg || '',
          meta_description_ru: data.meta_description_ru || '', meta_description_ro: data.meta_description_ro || '',
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

  function splitComma(val: string) {
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const supabase = createClient();
    const { tags_input, related_area_slugs_input, related_beach_slugs_input, related_listing_slugs_input, related_article_slugs_input, ...rest } = form;
    const { error: err } = await supabase.from('blog_articles').update({
      ...rest,
      tags: splitComma(tags_input),
      related_area_slugs: splitComma(related_area_slugs_input),
      related_beach_slugs: splitComma(related_beach_slugs_input),
      related_listing_slugs: splitComma(related_listing_slugs_input),
      related_article_slugs: splitComma(related_article_slugs_input),
      read_time_min: Number(form.read_time_min),
      published_at: form.published_at || null,
    }).eq('id', id);
    if (err) { setError(err.message); setSaving(false); return; }
    setSuccess('Saved!');
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog Article</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>}

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
              title_de: data.translations.title_de, title_bg: data.translations.title_bg,
              title_ru: data.translations.title_ru, title_ro: data.translations.title_ro,
              excerpt_en: data.translations.description_en,
              excerpt_de: data.translations.description_de, excerpt_bg: data.translations.description_bg,
              excerpt_ru: data.translations.description_ru, excerpt_ro: data.translations.description_ro,
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

        {/* Content - all languages */}
        <ContentTabs form={form} update={update} id={id as string} />

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

        {/* Μεταφράσεις Τίτλου */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Μεταφράσεις Τίτλου</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title ({lang.toUpperCase()})</label>
                <input type="text" value={(form as unknown as Record<string, string>)[`title_${lang}`] || ''} onChange={(e) => update(`title_${lang}`, e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Μεταφράσεις Excerpt */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Μεταφράσεις Excerpt</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Excerpt ({lang.toUpperCase()})</label>
                <textarea rows={2} value={(form as unknown as Record<string, string>)[`excerpt_${lang}`] || ''} onChange={(e) => update(`excerpt_${lang}`, e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>
        </div>

        {/* SEO - ΟΛΑ τα πεδία */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">SEO Meta Tags (6 γλώσσες)</h3>

          <p className="text-xs text-gray-500 mb-4">Γεμίζουν αυτόματα με το AI Auto-Complete. Μπορείτε να τα επεξεργαστείτε χειροκίνητα.</p>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Titles</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Title ({lang.toUpperCase()}) <span className="text-gray-400">({((form as unknown as Record<string, string>)[`meta_title_${lang}`] || '').length}/60)</span></label>
                <input type="text" value={(form as unknown as Record<string, string>)[`meta_title_${lang}`] || ''} onChange={(e) => update(`meta_title_${lang}`, e.target.value)}
                  maxLength={70} placeholder={lang === 'el' ? 'Τίτλος για Google' : `Meta title (${lang.toUpperCase()})`}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Descriptions</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Desc ({lang.toUpperCase()}) <span className="text-gray-400">({((form as unknown as Record<string, string>)[`meta_description_${lang}`] || '').length}/155)</span></label>
                <textarea rows={2} value={(form as unknown as Record<string, string>)[`meta_description_${lang}`] || ''} onChange={(e) => update(`meta_description_${lang}`, e.target.value)}
                  maxLength={170} placeholder={lang === 'el' ? 'Περιγραφή για Google' : `Meta description (${lang.toUpperCase()})`}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text Φωτογραφίας</label>
            <input type="text" value={form.image_alt} onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
              placeholder="Περιγραφή εικόνας για SEO & accessibility"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
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

function ContentTabs({ form, update, id }: { form: Record<string, unknown>; update: (field: string, value: unknown) => void; id: string }) {
  const [activeTab, setActiveTab] = useState('el');
  const [formatting, setFormatting] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleInsertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      let blob: Blob = file;
      try {
        const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.72, format: 'webp' });
        blob = compressed.blob;
      } catch {}
      const path = `blog-content/${id}/${Date.now()}.webp`;
      const { error: upErr } = await supabase.storage.from('listing-images').upload(path, blob, { contentType: 'image/webp', upsert: true });
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(path);
        const contentKey = `content_${activeTab}`;
        const current = (form[contentKey] as string || '');
        const altText = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        const imageTag = `\n![${altText}](${publicUrl})\n`;
        update(contentKey, current + imageTag);
      }
    } catch {}
    setUploading(false);
    e.target.value = '';
  }

  async function handleAIFormat() {
    const contentKey = `content_${activeTab}`;
    const content = (form[contentKey] as string || '').trim();
    if (!content) return;
    setFormatting(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'format_content', content, lang: activeTab }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.formatted) {
          update(contentKey, data.formatted);
        }
      }
    } catch {}
    setFormatting(false);
  }

  const langs = [
    { code: 'el', label: 'EL 🇬🇷', flag: '🇬🇷' },
    { code: 'en', label: 'EN 🇬🇧', flag: '🇬🇧' },
    { code: 'de', label: 'DE 🇩🇪', flag: '🇩🇪' },
    { code: 'bg', label: 'BG 🇧🇬', flag: '🇧🇬' },
    { code: 'ru', label: 'RU 🇷🇺', flag: '🇷🇺' },
    { code: 'ro', label: 'RO 🇷🇴', flag: '🇷🇴' },
  ];

  const contentKey = `content_${activeTab}`;
  const hasContent = (form[contentKey] as string || '').length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-semibold text-gray-700">Content</label>
          <button type="button" onClick={handleAIFormat} disabled={formatting || !((form[`content_${activeTab}`] as string || '').trim())}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-medium disabled:opacity-50 transition-all"
            title="Μορφοποίηση κειμένου με AI: παράγραφοι, τίτλοι, bullet points">
            {formatting ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>✨</span>}
            {formatting ? 'Μορφοποίηση...' : 'AI Μορφοποίηση'}
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-all">
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImagePlus className="w-3 h-3" />}
            {uploading ? 'Ανέβασμα...' : 'Εικόνα'}
            <input type="file" accept="image/*" className="hidden" onChange={handleInsertImage} disabled={uploading} />
          </label>
        </div>
        <ContentTranslator
          contentEl={form.content_el as string || ''}
          onTranslated={(translations) => {
            update('content_en', translations.en || '');
            update('content_de', translations.de || '');
            update('content_bg', translations.bg || '');
            update('content_ru', translations.ru || '');
            update('content_ro', translations.ro || '');
            // Save to DB
            const supabase = createClient();
            supabase.from('blog_articles').update({
              content_en: translations.en,
              content_de: translations.de,
              content_bg: translations.bg,
              content_ru: translations.ru,
              content_ro: translations.ro,
            }).eq('id', id);
          }}
        />
      </div>

      {/* Language tabs */}
      <div className="flex gap-1 mb-2">
        {langs.map((lang) => {
          const hasLangContent = ((form[`content_${lang.code}`] as string) || '').length > 0;
          return (
            <button key={lang.code} type="button"
              onClick={() => setActiveTab(lang.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                activeTab === lang.code
                  ? 'bg-primary-600 text-white'
                  : hasLangContent
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {lang.label}
              {hasLangContent && activeTab !== lang.code && <span className="text-[8px]">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Content textarea for active language */}
      <textarea
        rows={10}
        value={(form[contentKey] as string) || ''}
        onChange={(e) => update(contentKey, e.target.value)}
        placeholder={activeTab === 'el' ? 'Γράψτε το άρθρο στα ελληνικά...' : `Content in ${activeTab.toUpperCase()}...`}
        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
      />
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400">
          {((form[contentKey] as string) || '').length} chars | ~{Math.ceil(((form[contentKey] as string) || '').split(/\s+/).length / 200)} min read
        </span>
        {!hasContent && activeTab !== 'el' && (
          <span className="text-xs text-amber-600">❌ Χωρίς μετάφραση - πάτα "Μετάφραση Content"</span>
        )}
      </div>
    </div>
  );
}
