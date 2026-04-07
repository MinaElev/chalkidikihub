'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { AREA_SLUGS, ALL_CUISINE_TYPES } from '@/lib/constants';
import { Area, CuisineType } from '@/types';
import { Loader2, Upload, X, UtensilsCrossed, CheckCircle, Info } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { logEvent } from '@/lib/logger';
import { LocationPicker } from '@/components/ui/LocationPicker';

export default function SuggestRestaurantPage() {
  const t = useTranslations('submissions');
  const tAreas = useTranslations('areas');
  const tCuisine = useTranslations('cuisineTypes');
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
    cuisine: 'traditional' as CuisineType,
    phone: '', hours: '',
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
      type: 'restaurant',
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
      category: form.cuisine,
      extra_data: { cuisine: form.cuisine, phone: form.phone, hours: form.hours },
      status: 'pending',
    });

    if (!insertError) {
      logEvent('user_action', 'info', 'Restaurant suggestion submitted', { title: form.title_el });
      setSuccess(true);
    } else {
      logEvent('error', 'error', 'Restaurant suggestion failed', { error: insertError.message });
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
        <UtensilsCrossed className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Πρότεινε Φαγητό & Ποτό</h1>
      </div>
      <p className="text-sm text-gray-500 mb-4 flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
        Καταχωρήστε εστιατόριο, ταβέρνα, καφετέρια, beach bar, cocktail bar, brunch spot ή οτιδήποτε σχετικό με φαγητό & ποτό στη Χαλκιδική.
      </p>
      <p className="text-xs text-gray-400 mb-6">Γράψτε στα Ελληνικά — η μετάφραση σε άλλες γλώσσες γίνεται αυτόματα μετά την έγκριση.</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        {/* Όνομα */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα μαγαζιού *</label>
          <input required value={form.title_el} onChange={(e) => setForm({ ...form, title_el: e.target.value })}
            placeholder="π.χ. Ταβέρνα ο Νίκος, Blue Lagoon Beach Bar, Café Frappé"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Το πλήρες όνομα — εστιατόριο, μπαρ, καφετέρια, beach bar κλπ.</p>
        </div>

        {/* Περιγραφή */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή *</label>
          <textarea required rows={4} value={form.description_el} onChange={(e) => setForm({ ...form, description_el: e.target.value })}
            placeholder="Περιγράψτε το μαγαζί: τι σερβίρει, ποια είναι η ατμόσφαιρα, τι το κάνει ξεχωριστό. Π.χ. Παραδοσιακή ταβέρνα με θέα θάλασσα... ή Beach bar με cocktails και DJ..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Όσο πιο αναλυτικά γράψετε, τόσο καλύτερα. Αναφέρετε ειδικότητες, ατμόσφαιρα, θέα.</p>
        </div>

        {/* Περιοχή & Τύπος κουζίνας */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Περιοχή *</label>
            <select required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value as Area })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Σε ποιο "πόδι" της Χαλκιδικής βρίσκεται;</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τύπος *</label>
            <select required value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value as CuisineType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              {ALL_CUISINE_TYPES.map((c) => <option key={c} value={c}>{tCuisine(c)}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Εστιατόριο, μπαρ, καφετέρια, beach bar, brunch κλπ.</p>
          </div>
        </div>

        {/* Τοποθεσία */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Τοποθεσία / Χωριό</label>
          <input value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })}
            placeholder="π.χ. Χανιώτη, Νικήτη, Σάρτη"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Το χωριό ή η περιοχή που βρίσκεται το μαγαζί.</p>
        </div>

        {/* Χάρτης */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Σημείωσε στο χάρτη την ακριβή θέση</label>
          <p className="text-xs text-gray-400 mb-2">Κάνε κλικ στο χάρτη ή ψάξε τη διεύθυνση για να βάλεις pin.</p>
          <LocationPicker
            latitude={form.latitude} longitude={form.longitude}
            onLocationChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
          />
        </div>

        {/* Τηλέφωνο & Ωράριο */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τηλέφωνο</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="π.χ. 23740 12345 ή 6972 123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-gray-400 mt-1">Προαιρετικό — αν το γνωρίζετε.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ωράριο λειτουργίας</label>
            <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })}
              placeholder="π.χ. 12:00-00:00, Καθημερινά"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-gray-400 mt-1">Κατά προσέγγιση ωράριο.</p>
          </div>
        </div>

        {/* Φωτογραφία */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Φωτογραφία</label>
          <p className="text-xs text-gray-400 mb-2">Ανεβάστε μια φωτογραφία του μαγαζιού (εξωτερική ή εσωτερική). Προαιρετικό.</p>
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
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UtensilsCrossed className="w-4 h-4" />}
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
