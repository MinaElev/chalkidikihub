'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { AREA_SLUGS, ALL_ACTIVITY_CATEGORIES } from '@/lib/constants';
import { Area, ActivityCategory } from '@/types';
import { Loader2, Upload, X, Landmark, CheckCircle } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { LocationPicker } from '@/components/ui/LocationPicker';

export default function SuggestActivityPage() {
  const t = useTranslations('submissions');
  const tAreas = useTranslations('areas');
  const tCat = useTranslations('activityCategories');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    title_el: '', title_en: '',
    description_el: '', description_en: '',
    area: 'kassandra' as Area,
    location_name: '',
    latitude: 40.1, longitude: 23.6,
    category: 'nature' as ActivityCategory,
    price_range: '', duration: '',
  });

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

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

    const { error: insertError } = await supabase.from('user_submissions').insert({
      type: 'activity',
      user_id: user.id,
      title_el: form.title_el,
      title_en: form.title_en || '',
      description_el: form.description_el,
      description_en: form.description_en || '',
      area: form.area,
      location_name: form.location_name,
      latitude: form.latitude,
      longitude: form.longitude,
      image_url: imageUrl,
      category: form.category,
      extra_data: { price_range: form.price_range, duration: form.duration },
      status: 'pending',
    });

    if (!insertError) {
      setSuccess(true);
    } else {
      setError(insertError.message || t('submitError'));
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
        <Landmark className="w-6 h-6 text-amber-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('suggestActivity')}</h1>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('descriptionEl')} *</label>
          <textarea required rows={4} value={form.description_el} onChange={(e) => setForm({ ...form, description_el: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('descriptionEn')}</label>
          <textarea rows={3} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('area')} *</label>
            <select required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value as Area })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')} *</label>
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ActivityCategory })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              {ALL_ACTIVITY_CATEGORIES.map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('locationName')}</label>
          <input value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>

        <LocationPicker
          latitude={form.latitude} longitude={form.longitude}
          onLocationChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('priceRange')}</label>
            <input value={form.price_range} onChange={(e) => setForm({ ...form, price_range: e.target.value })} placeholder="π.χ. 10-30€"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('duration')}</label>
            <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="π.χ. 2-3 ώρες"
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
          className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
