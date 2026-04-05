'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Upload, X, FileText, CheckCircle } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';

const BLOG_CATEGORIES = ['guides', 'beaches', 'food', 'activities', 'tips', 'culture'] as const;

export default function SuggestBlogPage() {
  const t = useTranslations('submissions');
  const tCat = useTranslations('blogCategories');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    title_el: '', title_en: '',
    content_el: '', content_en: '',
    category: 'guides' as string,
    tags: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); setLoading(false); return; }

    let imageUrl = '';
    if (image) {
      let blob: Blob = image;
      try {
        const compressed = await compressImage(image, { maxWidth: 1200, maxHeight: 800, quality: 0.72, format: 'webp' });
        blob = compressed.blob;
      } catch {}
      const path = `${user.id}/${Date.now()}.webp`;
      const { error: upErr } = await supabase.storage.from('submission-images').upload(path, blob, { contentType: 'image/webp' });
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('submission-images').getPublicUrl(path);
        imageUrl = publicUrl;
      }
    }

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'blog',
        title_el: form.title_el, title_en: form.title_en,
        description_el: form.content_el, description_en: form.content_en,
        image_url: imageUrl,
        category: form.category,
        extra_data: { tags: form.tags },
      }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || t('submitError'));
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('submitSuccess')}</h2>
        <button onClick={() => router.push('/dashboard/submissions')} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          {t('mySubmissions')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('suggestBlog')}</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('titleEl')} *</label>
            <input required value={form.title_el} onChange={(e) => setForm({ ...form, title_el: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('titleEn')}</label>
            <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentEl')} *</label>
          <textarea required rows={10} value={form.content_el} onChange={(e) => setForm({ ...form, content_el: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentEn')}</label>
          <textarea rows={6} value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')} *</label>
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tags')}</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="beach, travel, food"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('image')}</label>
          {image ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{image.name}</span>
              <button type="button" onClick={() => setImage(null)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 w-fit">
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{t('uploadImage')}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])} />
            </label>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
