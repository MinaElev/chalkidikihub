'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { AREA_SLUGS, ALL_ACTIVITY_CATEGORIES } from '@/lib/constants';
import { Area, ActivityCategory } from '@/types';
import { Loader2, Upload, X, Landmark, CheckCircle, Info } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { logEvent } from '@/lib/logger';
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
    title_el: '',
    description_el: '',
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
      const { error: upErr } = await supabase.storage.from('submission-images').upload(path, blob, { cacheControl: '31536000', contentType: 'image/webp' });
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('submission-images').getPublicUrl(path);
        imageUrl = publicUrl;
      }
    }

    const { error: insertError } = await supabase.from('user_submissions').insert({
      type: 'activity',
      user_id: user.id,
      title_el: form.title_el,
      title_en: '',
      description_el: form.description_el,
      description_en: '',
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
      logEvent('user_action', 'info', 'Activity suggestion submitted', { title: form.title_el });
      setSuccess(true);
    } else {
      logEvent('error', 'error', 'Activity suggestion failed', { error: insertError.message });
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
      <div className="flex items-center gap-3 mb-2">
        <Landmark className="w-6 h-6 text-amber-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('suggestActivity')}</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6 flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
        Προτείνετε μια δραστηριότητα ή αξιοθέατο στη Χαλκιδική. Γράψτε στα Ελληνικά — η μετάφραση γίνεται αυτόματα μετά την έγκριση.
      </p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        {/* Όνομα */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα δραστηριότητας / αξιοθέατου *</label>
          <input required value={form.title_el} onChange={(e) => setForm(prev => ({ ...prev, title_el: e.target.value }))}
            placeholder="π.χ. Κρουαζιέρα στο Άγιο Όρος, Σπήλαιο Πετραλώνων"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Το πλήρες όνομα της δραστηριότητας ή του αξιοθέατου.</p>
        </div>

        {/* Περιγραφή */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή *</label>
          <textarea required rows={4} value={form.description_el} onChange={(e) => setForm(prev => ({ ...prev, description_el: e.target.value }))}
            placeholder="Περιγράψτε τη δραστηριότητα: τι περιλαμβάνει, πόσο διαρκεί, για ποιους είναι κατάλληλη. Π.χ. Ημερήσια κρουαζιέρα με παραδοσιακό καΐκι..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Αναφέρετε τι κάνει κάποιος, πόσο κοστίζει, αν χρειάζεται εξοπλισμό κλπ.</p>
        </div>

        {/* Περιοχή & Κατηγορία */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Περιοχή *</label>
            <select required value={form.area} onChange={(e) => setForm(prev => ({ ...prev, area: e.target.value as Area }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Σε ποια περιοχή της Χαλκιδικής;</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Κατηγορία *</label>
            <select required value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as ActivityCategory }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              {ALL_ACTIVITY_CATEGORIES.map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Τι τύπος δραστηριότητας είναι;</p>
          </div>
        </div>

        {/* Τοποθεσία */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Τοποθεσία / Χωριό</label>
          <input value={form.location_name} onChange={(e) => setForm(prev => ({ ...prev, location_name: e.target.value }))}
            placeholder="π.χ. Ουρανούπολη, Πολύγυρος, Βουρβουρού"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Πού βρίσκεται ή πού ξεκινάει;</p>
        </div>

        {/* Χάρτης */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Σημείωσε στο χάρτη</label>
          <p className="text-xs text-gray-400 mb-2">Κάνε κλικ ή ψάξε τη διεύθυνση.</p>
          <LocationPicker
            latitude={form.latitude} longitude={form.longitude}
            onLocationChange={(lat, lng) => setForm(prev => ({ ...prev, latitude: lat, longitude: lng }))}
          />
        </div>

        {/* Κόστος & Διάρκεια */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Κόστος</label>
            <input value={form.price_range} onChange={(e) => setForm(prev => ({ ...prev, price_range: e.target.value }))}
              placeholder="π.χ. 10-30€, Δωρεάν, Από 50€/άτομο"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-gray-400 mt-1">Κατά προσέγγιση κόστος ανά άτομο.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Διάρκεια</label>
            <input value={form.duration} onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="π.χ. 2-3 ώρες, Ολοήμερο, 30 λεπτά"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-gray-400 mt-1">Πόσο διαρκεί η δραστηριότητα;</p>
          </div>
        </div>

        {/* Φωτογραφία */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Φωτογραφία</label>
          <p className="text-xs text-gray-400 mb-2">Ανεβάστε μια φωτογραφία σχετική με τη δραστηριότητα. Προαιρετικό.</p>
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
