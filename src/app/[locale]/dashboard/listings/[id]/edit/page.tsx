'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ALL_AMENITIES, AREA_SLUGS } from '@/lib/constants';
import { Amenity, Area } from '@/types';
import { LocationPicker } from '@/components/ui/LocationPicker';
import Image from 'next/image';
import { Loader2, Upload, X, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface DbImage {
  id: string;
  image_url: string;
  sort_order: number;
  is_cover: boolean;
}

export default function EditListingPage() {
  const t = useTranslations('amenities');
  const tAreas = useTranslations('areas');
  const params = useParams();
  const listingId = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<DbImage[]>([]);

  const [form, setForm] = useState({
    title_el: '',
    description_el: '',
    area: 'kassandra' as Area,
    location_name: '',
    latitude: 40.1,
    longitude: 23.6,
    price_per_night: 50,
    guests_max: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [] as Amenity[],
    contact_phone: '',
    contact_email: '',
    website_url: '',
    booking_url: '',
    airbnb_url: '',
    status: 'draft',
  });

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  // Load existing listing
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('listings')
        .select('*, listing_images(*)')
        .eq('id', listingId)
        .single();

      if (data) {
        setForm({
          title_el: data.title_el || '',
          description_el: data.description_el || '',
          area: data.area as Area,
          location_name: data.location_name || '',
          latitude: data.latitude || 40.1,
          longitude: data.longitude || 23.6,
          price_per_night: Number(data.price_per_night),
          guests_max: data.guests_max,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          amenities: (data.amenities as Amenity[]) || [],
          contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '',
          website_url: data.website_url || '',
          booking_url: data.booking_url || '',
          airbnb_url: data.airbnb_url || '',
          status: data.status,
        });
        setExistingImages(
          (data.listing_images || [])
            .sort((a: DbImage, b: DbImage) => a.sort_order - b.sort_order)
        );
      }
      setLoading(false);
    }
    load();
  }, [listingId]);

  function toggleAmenity(amenity: Amenity) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  async function deleteImage(imageId: string) {
    const supabase = createClient();
    await supabase.from('listing_images').delete().eq('id', imageId);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); setSaving(false); return; }

    // Get cover image URL for SEO
    const { data: coverImgs } = await supabase.from('listing_images')
      .select('image_url').eq('listing_id', listingId).eq('is_cover', true).limit(1);
    const seoImageUrl = (coverImgs && coverImgs[0]?.image_url) || '';

    // Update listing
    const { error: updateError } = await supabase
      .from('listings')
      .update({
        image_url: seoImageUrl,
        title_el: form.title_el,
        title_en: form.title_el,
        description_el: form.description_el,
        description_en: form.description_el,
        area: form.area,
        location_name: form.location_name,
        latitude: form.latitude,
        longitude: form.longitude,
        price_per_night: form.price_per_night,
        guests_max: form.guests_max,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        amenities: form.amenities,
        contact_phone: form.contact_phone || null,
        contact_email: form.contact_email || null,
        website_url: form.website_url || null,
        booking_url: form.booking_url || null,
        airbnb_url: form.airbnb_url || null,
        status: form.status,
      })
      .eq('id', listingId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    // Upload new images
    if (newImages.length > 0) {
      const startOrder = existingImages.length;
      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const filePath = `${user.id}/${listingId}/${startOrder + i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file, { contentType: file.type, upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(filePath);

          await supabase.from('listing_images').insert({
            listing_id: listingId,
            image_url: publicUrl,
            sort_order: startOrder + i,
            is_cover: existingImages.length === 0 && i === 0,
          });
        }
      }
    }

    setSuccess(true);
    setNewImages([]);
    setSaving(false);

    // Reload images
    const { data: imgs } = await supabase
      .from('listing_images')
      .select('*')
      .eq('listing_id', listingId)
      .order('sort_order');
    if (imgs) setExistingImages(imgs);
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-4">
        <ArrowLeft className="w-4 h-4" />Πίσω στα καταλύματα
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Επεξεργασία καταλύματος</h1>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">Αποθηκεύτηκε!</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Τίτλος καταλύματος *</label>
          <input type="text" required value={form.title_el} onChange={(e) => setForm({ ...form, title_el: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Η μετάφραση στις άλλες γλώσσες γίνεται αυτόματα</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
          <textarea rows={5} value={form.description_el} onChange={(e) => setForm({ ...form, description_el: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* Area & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Περιοχή *</label>
            <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value as Area })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
              {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τοποθεσία *</label>
            <input type="text" required value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τιμή από (EUR/βράδυ) *</label>
            <input type="number" min={1} required value={form.price_per_night}
              onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Μέγιστοι επισκέπτες *</label>
            <input type="number" min={1} required value={form.guests_max}
              onChange={(e) => setForm({ ...form, guests_max: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Υπνοδωμάτια</label>
            <input type="number" min={0} value={form.bedrooms}
              onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Μπάνια</label>
            <input type="number" min={0} value={form.bathrooms}
              onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {/* Map picker */}
        <LocationPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onLocationChange={(lat, lng) => setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
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
                {t(amenity)}
              </button>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Στοιχεία επικοινωνίας</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Τηλέφωνο</span>
              <input type="tel" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                placeholder="+30 69..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Email</span>
              <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                placeholder="info@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" />
            </div>
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website καταλύματος</label>
          <input type="url" value={form.website_url} onChange={(e) => setForm((prev) => ({ ...prev, website_url: e.target.value }))}
            placeholder="https://www.myhotel.gr"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm" />
        </div>

        {/* Booking links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Links κρατήσεων</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Booking.com</span>
              <input type="url" value={form.booking_url} onChange={(e) => setForm({ ...form, booking_url: e.target.value })}
                placeholder="https://www.booking.com/hotel/gr/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Airbnb</span>
              <input type="url" value={form.airbnb_url} onChange={(e) => setForm({ ...form, airbnb_url: e.target.value })}
                placeholder="https://www.airbnb.com/rooms/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" />
            </div>
          </div>
        </div>

        {/* Existing images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Φωτογραφίες</label>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 group">
                <Image src={img.image_url || '/images/placeholder.svg'} alt="" width={96} height={96} className="w-full h-full object-cover" />
                {img.is_cover && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary-600/80 text-white text-center text-[10px] py-0.5">Cover</div>
                )}
                <button type="button" onClick={() => deleteImage(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {/* New image uploads */}
            {newImages.map((file, idx) => (
              <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image src={URL.createObjectURL(file)} alt="" width={96} height={96} className="w-full h-full object-cover" unoptimized />
                <div className="absolute bottom-0 left-0 right-0 bg-green-600/80 text-white text-center text-[10px] py-0.5">New</div>
                <button type="button" onClick={() => setNewImages(newImages.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Upload</span>
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => { if (e.target.files) setNewImages([...newImages, ...Array.from(e.target.files)]); }} />
            </label>
          </div>
        </div>

        {/* Status & Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.status === 'published'}
              onChange={(e) => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })}
              className="rounded text-primary-600 focus:ring-primary-500" />
            Published
          </label>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Αποθήκευση
          </button>
        </div>
      </form>
    </div>
  );
}
