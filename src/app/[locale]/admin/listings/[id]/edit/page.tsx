'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Save, Loader2, ExternalLink } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AIHelper } from '@/components/admin/AIHelper';
import { ALL_AMENITIES, AREA_SLUGS } from '@/lib/constants';
import { Amenity } from '@/types';
import { LocationPicker } from '@/components/ui/LocationPicker';

export default function AdminEditListingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    slug: '', title_el: '', title_en: '', title_de: '', title_bg: '', title_ru: '', title_ro: '', title_sr: '',
    description_el: '', description_en: '', description_de: '', description_bg: '', description_ru: '', description_ro: '', description_sr: '',
    area: 'kassandra', location_name: '', latitude: 0, longitude: 0,
    price_per_night: 0, currency: 'EUR', guests_max: 2, bedrooms: 1, bathrooms: 1,
    amenities: [] as string[], status: 'draft',
    contact_phone: '', contact_email: '', booking_url: '', airbnb_url: '', website_url: '',
    meta_title_el: '', meta_title_en: '', meta_title_de: '', meta_title_bg: '', meta_title_ru: '', meta_title_ro: '', meta_title_sr: '',
    meta_description_el: '', meta_description_en: '', meta_description_de: '', meta_description_bg: '', meta_description_ru: '', meta_description_ro: '', meta_description_sr: '',
    image_alt: '',
  });
  const [ownerInfo, setOwnerInfo] = useState({ name: '', email: '', id: '' });
  const [images, setImages] = useState<Array<{ id: string; image_url: string; sort_order: number; is_cover: boolean }>>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('listings').select('*, profiles(full_name, phone)').eq('id', id).single();
      if (data) {
        const f: Record<string, unknown> = {};
        Object.keys(form).forEach((key) => {
          if (key === 'amenities') f[key] = data[key] || [];
          else if (typeof (form as Record<string, unknown>)[key] === 'number') f[key] = Number(data[key]) || 0;
          else f[key] = (data as Record<string, unknown>)[key] || '';
        });
        setForm(f as typeof form);
        setOwnerInfo({
          name: (data.profiles as Record<string, string>)?.full_name || '',
          email: data.contact_email || '',
          id: data.owner_id,
        });
      }

      // Load images
      const { data: imgs } = await supabase.from('listing_images').select('*').eq('listing_id', id).order('sort_order');
      if (imgs) setImages(imgs as typeof images);

      setLoading(false);
    }
    load();
  }, [id]);

  function update(field: string, value: unknown) { setForm((prev) => ({ ...prev, [field]: value })); }

  function toggleAmenity(amenity: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    const supabase = createClient();

    // Auto-set image_url from cover photo for SEO (Open Graph, JSON-LD)
    const coverImg = images.find(i => i.is_cover) || images[0];
    const seoImageUrl = coverImg?.image_url || '';

    // Explicitly list all DB columns to avoid sending unknown fields
    const updateData = {
      title_el: form.title_el, title_en: form.title_en, title_de: form.title_de,
      title_bg: form.title_bg, title_ru: form.title_ru, title_ro: form.title_ro,
      description_el: form.description_el, description_en: form.description_en, description_de: form.description_de,
      description_bg: form.description_bg, description_ru: form.description_ru, description_ro: form.description_ro,
      area: form.area, location_name: form.location_name,
      latitude: Number(form.latitude), longitude: Number(form.longitude),
      price_per_night: Number(form.price_per_night), currency: form.currency,
      guests_max: Number(form.guests_max), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms),
      amenities: form.amenities, status: form.status,
      contact_phone: form.contact_phone || null, contact_email: form.contact_email || null,
      booking_url: form.booking_url || null, airbnb_url: form.airbnb_url || null, website_url: form.website_url || null,
      meta_title_el: form.meta_title_el, meta_title_en: form.meta_title_en,
      meta_title_de: form.meta_title_de, meta_title_bg: form.meta_title_bg,
      meta_title_ru: form.meta_title_ru, meta_title_ro: form.meta_title_ro,
      meta_description_el: form.meta_description_el, meta_description_en: form.meta_description_en,
      meta_description_de: form.meta_description_de, meta_description_bg: form.meta_description_bg,
      meta_description_ru: form.meta_description_ru, meta_description_ro: form.meta_description_ro,
      image_alt: form.image_alt,
      image_url: seoImageUrl,
    };

    const { error: err } = await supabase.from('listings').update(updateData).eq('id', id);
    if (err) { setError(err.message); } else { setSuccess('Αποθηκεύτηκε!'); }
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/listings" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
        </div>
        <Link href={`/listings/${form.slug}`} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
          <ExternalLink className="w-4 h-4" />Προβολή
        </Link>
      </div>

      {/* Owner info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Ιδιοκτήτης:</strong> {ownerInfo.name || 'Unknown'} | <strong>ID:</strong> {ownerInfo.id.slice(0, 8)}...
        </p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <AIHelper
          titleEl={form.title_el}
          descriptionEl={form.description_el}
          category="accommodation"
          location={form.location_name}
          onComplete={(data) => {
            setForm((prev) => ({
              ...prev,
              title_en: data.translations.title_en, title_de: data.translations.title_de,
              title_bg: data.translations.title_bg, title_ru: data.translations.title_ru, title_ro: data.translations.title_ro, title_sr: data.translations.title_sr || "",
              description_en: data.translations.description_en, description_de: data.translations.description_de,
              description_bg: data.translations.description_bg, description_ru: data.translations.description_ru, description_ro: data.translations.description_ro, description_sr: data.translations.description_sr || "",
              meta_title_el: data.seo.meta_title_el, meta_title_en: data.seo.meta_title_en,
              meta_title_de: data.seo.meta_title_de, meta_title_bg: data.seo.meta_title_bg,
              meta_title_ru: data.seo.meta_title_ru, meta_title_ro: data.seo.meta_title_ro, meta_title_sr: data.seo.meta_title_sr || "",
              meta_description_el: data.seo.meta_description_el, meta_description_en: data.seo.meta_description_en,
              meta_description_de: data.seo.meta_description_de, meta_description_bg: data.seo.meta_description_bg,
              meta_description_ru: data.seo.meta_description_ru, meta_description_ro: data.seo.meta_description_ro, meta_description_sr: data.seo.meta_description_sr || "",
              image_alt: data.seo.image_alt,
            }));
          }}
        />

        {/* Status */}
        <div className="flex items-center gap-4">
          <select value={form.status} onChange={(e) => update('status', e.target.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${
              form.status === 'published' ? 'bg-green-50 border-green-300 text-green-700' :
              form.status === 'archived' ? 'bg-gray-50 border-gray-300 text-gray-700' :
              'bg-amber-50 border-amber-300 text-amber-700'
            }`}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <span className="text-sm text-gray-500">Slug: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{form.slug}</code></span>
        </div>

        {/* Titles - all languages */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Τίτλοι</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title ({lang.toUpperCase()})</label>
                <input type="text" value={(form as unknown as Record<string, string>)[`title_${lang}`] || ''} onChange={(e) => update(`title_${lang}`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Περιγραφές</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description ({lang.toUpperCase()})</label>
                <textarea rows={3} value={(form as unknown as Record<string, string>)[`description_${lang}`] || ''} onChange={(e) => update(`description_${lang}`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Area & Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <select value={form.area} onChange={(e) => update('area', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500">
              {AREA_SLUGS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" value={form.location_name} onChange={(e) => update('location_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τιμή από (EUR)</label>
            <input type="number" min={0} value={form.price_per_night} onChange={(e) => update('price_per_night', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Επισκέπτες</label>
            <input type="number" min={1} value={form.guests_max} onChange={(e) => update('guests_max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Δωμάτια</label>
            <input type="number" min={0} value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Μπάνια</label>
            <input type="number" min={0} value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {/* Map picker */}
        <LocationPicker
          latitude={Number(form.latitude) || 40.1}
          longitude={Number(form.longitude) || 23.6}
          onLocationChange={(lat, lng) => { update('latitude', lat); update('longitude', lng); }}
        />

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Παροχές</label>
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map((amenity) => (
              <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  form.amenities.includes(amenity)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}>
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Contact & Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Επικοινωνία & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Τηλέφωνο</label>
              <input type="tel" value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input type="email" value={form.contact_email} onChange={(e) => update('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Booking.com URL</label>
              <input type="url" value={form.booking_url} onChange={(e) => update('booking_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Airbnb URL</label>
              <input type="url" value={form.airbnb_url} onChange={(e) => update('airbnb_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
              <input type="url" value={form.website_url} onChange={(e) => update('website_url', e.target.value)}
                placeholder="https://www.myhotel.gr"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        {/* Image */}
        {/* Listing Images Manager */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Φωτογραφίες ({images.length})</h3>

          {/* Existing images - drag to reorder, delete, set cover */}
          {images.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={img.id} className={`relative group rounded-lg overflow-hidden border-2 ${img.is_cover ? 'border-primary-500' : 'border-gray-200'}`}>
                  <img src={img.image_url} alt="" className="w-full aspect-square object-cover" loading="lazy" />

                  {/* Cover badge */}
                  {img.is_cover && (
                    <div className="absolute top-1 left-1 bg-primary-600 text-white text-[9px] px-1.5 py-0.5 rounded">Cover</div>
                  )}

                  {/* Order badge */}
                  <div className="absolute top-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">{idx + 1}</div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                    {/* Set as cover */}
                    {!img.is_cover && (
                      <button type="button" onClick={async () => {
                        const supabase = createClient();
                        await supabase.from('listing_images').update({ is_cover: false }).eq('listing_id', id);
                        await supabase.from('listing_images').update({ is_cover: true }).eq('id', img.id);
                        setImages(prev => prev.map(i => ({ ...i, is_cover: i.id === img.id })));
                      }} className="px-2 py-1 bg-primary-600 text-white text-[10px] rounded font-medium">
                        Cover
                      </button>
                    )}

                    {/* Move left */}
                    {idx > 0 && (
                      <button type="button" onClick={async () => {
                        const supabase = createClient();
                        const prev = images[idx - 1];
                        await supabase.from('listing_images').update({ sort_order: idx - 1 }).eq('id', img.id);
                        await supabase.from('listing_images').update({ sort_order: idx }).eq('id', prev.id);
                        setImages(old => {
                          const n = [...old];
                          [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]];
                          return n;
                        });
                      }} className="px-1.5 py-1 bg-white text-gray-700 text-[10px] rounded font-medium">
                        ←
                      </button>
                    )}

                    {/* Move right */}
                    {idx < images.length - 1 && (
                      <button type="button" onClick={async () => {
                        const supabase = createClient();
                        const next = images[idx + 1];
                        await supabase.from('listing_images').update({ sort_order: idx + 1 }).eq('id', img.id);
                        await supabase.from('listing_images').update({ sort_order: idx }).eq('id', next.id);
                        setImages(old => {
                          const n = [...old];
                          [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]];
                          return n;
                        });
                      }} className="px-1.5 py-1 bg-white text-gray-700 text-[10px] rounded font-medium">
                        →
                      </button>
                    )}

                    {/* Delete */}
                    <button type="button" onClick={async () => {
                      if (!confirm('Διαγραφή φωτογραφίας;')) return;
                      const supabase = createClient();
                      await supabase.from('listing_images').delete().eq('id', img.id);
                      setImages(prev => prev.filter(i => i.id !== img.id));
                    }} className="px-1.5 py-1 bg-red-600 text-white text-[10px] rounded font-medium">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-3">Χωρίς φωτογραφίες</p>
          )}

          {/* Upload new */}
          <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-500 hover:text-primary-600 cursor-pointer transition-colors">
            + Προσθήκη φωτογραφίας
            <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
              const files = e.target.files;
              if (!files) return;
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;

              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const filePath = `${user.id}/${id}/${Date.now()}-${i}.webp`;

                // Compress
                let uploadBlob: Blob = file;
                try {
                  const { compressImage } = await import('@/lib/image-utils');
                  const { blob } = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.72, format: 'webp' });
                  uploadBlob = blob;
                } catch {}

                const { error } = await supabase.storage.from('listing-images').upload(filePath, uploadBlob, { contentType: 'image/webp', upsert: true });
                if (!error) {
                  const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(filePath);
                  const { data: newImg } = await supabase.from('listing_images').insert({
                    listing_id: id,
                    image_url: publicUrl,
                    sort_order: images.length + i,
                    is_cover: images.length === 0 && i === 0,
                  }).select().single();
                  if (newImg) setImages(prev => [...prev, newImg as typeof prev[0]]);
                }
              }
            }} />
          </label>
        </div>

        {/* SEO - ALL languages */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">SEO Meta Tags (6 γλώσσες)</h3>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Titles</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">({lang.toUpperCase()}) <span className="text-gray-400">({((form as unknown as Record<string, string>)[`meta_title_${lang}`] || '').length}/60)</span></label>
                <input type="text" maxLength={70} value={(form as unknown as Record<string, string>)[`meta_title_${lang}`] || ''} onChange={(e) => update(`meta_title_${lang}`, e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Descriptions</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">({lang.toUpperCase()}) <span className="text-gray-400">({((form as unknown as Record<string, string>)[`meta_description_${lang}`] || '').length}/155)</span></label>
                <textarea rows={2} maxLength={170} value={(form as unknown as Record<string, string>)[`meta_description_${lang}`] || ''} onChange={(e) => update(`meta_description_${lang}`, e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
            <input type="text" value={form.image_alt} onChange={(e) => update('image_alt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Αποθήκευση
          </button>
        </div>
      </form>
    </div>
  );
}
