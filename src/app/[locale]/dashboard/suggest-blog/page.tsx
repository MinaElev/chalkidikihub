'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Upload, X, FileText, CheckCircle, Info } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { logEvent } from '@/lib/logger';

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
    title_el: '',
    content_el: '',
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
      const { error: upErr } = await supabase.storage.from('submission-images').upload(path, blob, { cacheControl: '31536000', contentType: 'image/webp' });
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('submission-images').getPublicUrl(path);
        imageUrl = publicUrl;
      }
    }

    const { error: insertError } = await supabase.from('user_submissions').insert({
      type: 'blog',
      user_id: user.id,
      title_el: form.title_el,
      title_en: '',
      description_el: form.content_el,
      description_en: '',
      image_url: imageUrl,
      category: form.category,
      extra_data: { tags: form.tags },
      status: 'pending',
    });

    if (!insertError) {
      logEvent('user_action', 'info', 'Blog suggestion submitted', { title: form.title_el });
      setSuccess(true);
    } else {
      logEvent('error', 'error', 'Blog suggestion failed', { error: insertError.message });
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
        <FileText className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('suggestBlog')}</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6 flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
        Γράψτε ένα άρθρο για τη Χαλκιδική στα Ελληνικά. Μπορεί να είναι οδηγός, εμπειρία, tips ή ιστορία. Η μετάφραση γίνεται αυτόματα μετά την έγκριση.
      </p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        {/* Τίτλος */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Τίτλος άρθρου *</label>
          <input required value={form.title_el} onChange={(e) => setForm(prev => ({ ...prev, title_el: e.target.value }))}
            placeholder="π.χ. 10 Κρυμμένες Παραλίες στη Σιθωνία που Πρέπει να Ανακαλύψεις"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Ένας ελκυστικός τίτλος που τραβάει την προσοχή.</p>
        </div>

        {/* Κατηγορία & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Κατηγορία *</label>
            <select required value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Σε ποια κατηγορία ανήκει το άρθρο;</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ετικέτες (tags)</label>
            <input value={form.tags} onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="π.χ. παραλίες, σιθωνία, οικογένεια, tips"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-gray-400 mt-1">Λέξεις-κλειδιά χωρισμένες με κόμμα.</p>
          </div>
        </div>

        {/* Περιεχόμενο */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Κείμενο άρθρου *</label>
          <textarea required rows={12} value={form.content_el} onChange={(e) => setForm(prev => ({ ...prev, content_el: e.target.value }))}
            placeholder="Γράψτε το άρθρο σας εδώ...

Μπορείτε να χρησιμοποιήσετε:
## Τίτλος ενότητας
### Υπότιτλος
- Σημείο λίστας
**Έντονο κείμενο**

Tip: Γράψτε σαν να μιλάτε σε φίλο που ρωτάει τι να κάνει στη Χαλκιδική!"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">
            Γράψτε ελεύθερα — μπορείτε να χρησιμοποιήσετε ## για τίτλους, - για λίστες, **bold** για έμφαση.
            Ιδανικό μέγεθος: 500-2000 λέξεις.
          </p>
        </div>

        {/* Φωτογραφία */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Φωτογραφία εξωφύλλου</label>
          <p className="text-xs text-gray-400 mb-2">Μια ωραία φωτογραφία για το εξώφυλλο του άρθρου. Προαιρετικό.</p>
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
