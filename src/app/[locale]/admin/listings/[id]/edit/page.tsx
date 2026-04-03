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

export default function AdminEditListingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    slug: '', title_el: '', title_en: '', title_de: '', title_bg: '', title_ru: '', title_ro: '',
    description_el: '', description_en: '', description_de: '', description_bg: '', description_ru: '', description_ro: '',
    area: 'kassandra', location_name: '', latitude: 0, longitude: 0,
    price_per_night: 0, currency: 'EUR', guests_max: 2, bedrooms: 1, bathrooms: 1,
    amenities: [] as string[], status: 'draft',
    contact_phone: '', contact_email: '', booking_url: '', airbnb_url: '',
    meta_title_el: '', meta_title_en: '', meta_title_de: '', meta_title_bg: '', meta_title_ru: '', meta_title_ro: '',
    meta_description_el: '', meta_description_en: '', meta_description_de: '', meta_description_bg: '', meta_description_ru: '', meta_description_ro: '',
    image_alt: '',
  });
  const [ownerInfo, setOwnerInfo] = useState({ name: '', email: '', id: '' });

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
      booking_url: form.booking_url || null, airbnb_url: form.airbnb_url || null,
      meta_title_el: form.meta_title_el, meta_title_en: form.meta_title_en,
      meta_title_de: form.meta_title_de, meta_title_bg: form.meta_title_bg,
      meta_title_ru: form.meta_title_ru, meta_title_ro: form.meta_title_ro,
      meta_description_el: form.meta_description_el, meta_description_en: form.meta_description_en,
      meta_description_de: form.meta_description_de, meta_description_bg: form.meta_description_bg,
      meta_description_ru: form.meta_description_ru, meta_description_ro: form.meta_description_ro,
      image_alt: form.image_alt,
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
              title_bg: data.translations.title_bg, title_ru: data.translations.title_ru, title_ro: data.translations.title_ro,
              description_en: data.translations.description_en, description_de: data.translations.description_de,
              description_bg: data.translations.description_bg, description_ru: data.translations.description_ru, description_ro: data.translations.description_ro,
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
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
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
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lat / Lng</label>
            <div className="flex gap-1">
              <input type="number" step="0.0001" value={form.latitude} onChange={(e) => update('latitude', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs" placeholder="lat" />
              <input type="number" step="0.0001" value={form.longitude} onChange={(e) => update('longitude', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs" placeholder="lng" />
            </div>
          </div>
        </div>

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
          </div>
        </div>

        {/* Image */}
        <ImageUpload currentUrl="" onUpload={() => {}} folder="listings" />

        {/* SEO - ALL languages */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">SEO Meta Tags (6 γλώσσες)</h3>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Titles</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-xs font-medium text-gray-500 mb-1">({lang.toUpperCase()}) <span className="text-gray-400">({((form as unknown as Record<string, string>)[`meta_title_${lang}`] || '').length}/60)</span></label>
                <input type="text" maxLength={70} value={(form as unknown as Record<string, string>)[`meta_title_${lang}`] || ''} onChange={(e) => update(`meta_title_${lang}`, e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-primary-500" />
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Descriptions</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {(['el', 'en', 'de', 'bg', 'ru', 'ro'] as const).map((lang) => (
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
