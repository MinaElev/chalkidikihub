'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { ALL_AMENITIES, AREA_SLUGS } from '@/lib/constants';
import { Amenity, Area } from '@/types';
import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { LocationPicker } from '@/components/ui/LocationPicker';
import NumberStepper from '@/components/ui/NumberStepper';
import PriceInput from '@/components/ui/PriceInput';

const MAX_PHOTOS = 10;

export default function NewListingPage() {
  const t = useTranslations('amenities');
  const tAreas = useTranslations('areas');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState({
    title_el: '',
    description_el: '',
    area: 'kassandra' as Area,
    location_name: '',
    latitude: 40.1,
    longitude: 23.6,
    price_per_night: 50,
    guests_max: 2, bedrooms: 1, bathrooms: 1,
    amenities: [] as Amenity[],
    contact_phone: '',
    contact_email: '',
    website_url: '',
    booking_url: '',
    airbnb_url: '',
    status: 'published',
  });

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  function toggleAmenity(amenity: Amenity) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); setLoading(false); return; }

    // Generate SEO-friendly slug: transliterate Greek -> Latin + area + location
    const greekToLatin: Record<string, string> = {
      'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
      'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
      'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
      'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o', 'ϊ': 'i', 'ϋ': 'y',
      'ΐ': 'i', 'ΰ': 'y', 'ου': 'ou', 'μπ': 'b', 'ντ': 'nt', 'γκ': 'gk', 'τσ': 'ts', 'τζ': 'tz',
    };
    function transliterate(text: string): string {
      let result = text.toLowerCase();
      // Multi-char replacements first
      for (const [gr, lat] of Object.entries(greekToLatin).sort((a, b) => b[0].length - a[0].length)) {
        result = result.split(gr).join(lat);
      }
      return result.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    const titleSlug = transliterate(form.title_el) || 'listing';
    const locationSlug = transliterate(form.location_name);
    let slug = [titleSlug, locationSlug]
      .filter(Boolean).join('-').slice(0, 80);

    // Check for duplicate slugs - if exists, add a short number
    const { data: existing } = await supabase
      .from('listings').select('slug').like('slug', `${slug}%`);
    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`;
    }

    // Save with Greek text - translations will be added later
    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        title_el: form.title_el,
        title_en: form.title_el, // Fallback: same as Greek until translated
        description_el: form.description_el,
        description_en: form.description_el, // Fallback
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
        slug,
        owner_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Upload images (compressed)
    const uploadErrors: string[] = [];
    if (listing && images.length > 0) {
      setUploadProgress({ current: 0, total: images.length });
      for (let i = 0; i < images.length; i++) {
        setUploadProgress({ current: i + 1, total: images.length });
        const file = images[i];
        const filePath = `${user.id}/${listing.id}/${i}.webp`;

        // Compress before upload. If compression fails AND the original is
        // large (>1MB), reject — silent fallback let multi-MB JPEGs leak into
        // storage and blew up Supabase egress.
        let uploadBlob: Blob = file;
        try {
          const { blob } = await compressImage(file);
          uploadBlob = blob;
        } catch (err) {
          if (file.size > 1024 * 1024) {
            uploadErrors.push(`Image ${i + 1}: ${(err as Error).message || 'compression failed'} (original ${(file.size / 1024 / 1024).toFixed(1)}MB — please resize and retry)`);
            continue;
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, uploadBlob, { cacheControl: '31536000', contentType: 'image/webp', upsert: true });

        if (uploadError) {
          uploadErrors.push(`Image ${i + 1}: ${uploadError.message}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase.from('listing_images').insert({
          listing_id: listing.id,
          image_url: publicUrl,
          sort_order: i,
          is_cover: i === 0,
        });

        if (insertError) {
          uploadErrors.push(`Image ${i + 1} DB: ${insertError.message}`);
        }
      }
    }

    setUploadProgress(null);

    if (uploadErrors.length > 0) {
      setError('Listing saved but image issues: ' + uploadErrors.join('; '));
      setLoading(false);
      return;
    }

    router.push('/dashboard/listings');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Listing</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Τίτλος καταλύματος *</label>
          <input type="text" required value={form.title_el} onChange={(e) => setForm(prev => ({ ...prev, title_el: e.target.value }))}
            placeholder="π.χ. Στούντιο κοντά στη θάλασσα στα Χανιώτη"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Η μετάφραση στις άλλες γλώσσες γίνεται αυτόματα</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
          <textarea rows={5} value={form.description_el} onChange={(e) => setForm(prev => ({ ...prev, description_el: e.target.value }))}
            placeholder="Περιγράψτε το κατάλυμά σας, τι προσφέρει, πόσο κοντά είναι στη θάλασσα, κλπ."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Η μετάφραση στις άλλες γλώσσες γίνεται αυτόματα</p>
        </div>

        {/* Area & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
            <select value={form.area} onChange={(e) => setForm(prev => ({ ...prev, area: e.target.value as Area }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
              {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Name *</label>
            <input type="text" required value={form.location_name} onChange={(e) => setForm(prev => ({ ...prev, location_name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Hanioti, Kassandra" />
          </div>
        </div>

        {/* Map picker */}
        <LocationPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onLocationChange={(lat, lng) => setForm(prev => ({ ...prev, latitude: lat, longitude: lng }))}
        />

        {/* Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τιμή από (EUR/βράδυ) *</label>
            <PriceInput
              value={form.price_per_night}
              onChange={(v) => setForm(prev => ({ ...prev, price_per_night: v }))}
              min={1}
              required
            />
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Ενδεικτική τιμή «από». Ο επισκέπτης ενημερώνεται για την ακριβή τιμή
              μετά από επικοινωνία μαζί σας.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests *</label>
            <NumberStepper
              value={form.guests_max}
              onChange={(v) => setForm(prev => ({ ...prev, guests_max: v }))}
              min={1}
              max={50}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <NumberStepper
              value={form.bedrooms}
              onChange={(v) => setForm(prev => ({ ...prev, bedrooms: v }))}
              min={0}
              max={30}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <NumberStepper
              value={form.bathrooms}
              onChange={(v) => setForm(prev => ({ ...prev, bathrooms: v }))}
              min={0}
              max={30}
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map((amenity) => (
              <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  form.amenities.includes(amenity)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
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
              <input type="tel" value={form.contact_phone} onChange={(e) => setForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="+30 69..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Email</span>
              <input type="email" value={form.contact_email} onChange={(e) => setForm(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="info@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Θα εμφανίζονται στους επισκέπτες ως κουμπιά κλήσης και email</p>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website καταλύματος</label>
          <input type="url" value={form.website_url} onChange={(e) => setForm(prev => ({ ...prev, website_url: e.target.value }))}
            placeholder="https://www.myhotel.gr"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm" />
          <p className="text-xs text-gray-400 mt-1">Προαιρετικά - η ιστοσελίδα του καταλύματος</p>
        </div>

        {/* Booking links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Links κρατήσεων</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-600">Booking.com</span>
              </div>
              <input type="url" value={form.booking_url} onChange={(e) => setForm(prev => ({ ...prev, booking_url: e.target.value }))}
                placeholder="https://www.booking.com/hotel/gr/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-600">Airbnb</span>
              </div>
              <input type="url" value={form.airbnb_url} onChange={(e) => setForm(prev => ({ ...prev, airbnb_url: e.target.value }))}
                placeholder="https://www.airbnb.com/rooms/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Προαιρετικά - θα εμφανίζονται στους επισκέπτες ως κουμπιά κράτησης</p>
        </div>

        {/* Images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Φωτογραφίες
            </label>
            <span className={`text-xs font-medium ${images.length >= MAX_PHOTOS ? 'text-red-600' : 'text-gray-500'}`}>
              {images.length} / {MAX_PHOTOS}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {images.map((file, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image src={URL.createObjectURL(file)} alt="" width={96} height={96} className="w-full h-full object-cover" unoptimized />
                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < MAX_PHOTOS && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Upload</span>
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const picked = Array.from(e.target.files);
                    const remaining = MAX_PHOTOS - images.length;
                    if (picked.length > remaining) {
                      alert(`Μπορείς να ανεβάσεις μέχρι ${MAX_PHOTOS} φωτογραφίες. Επιλέχθηκαν οι πρώτες ${remaining}.`);
                    }
                    setImages([...images, ...picked.slice(0, remaining)]);
                    e.target.value = '';
                  }} />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Μέχρι {MAX_PHOTOS} φωτογραφίες. Η πρώτη θα χρησιμοποιηθεί ως εξώφυλλο.
          </p>
        </div>

        {/* Status & Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.status === 'published'}
              onChange={(e) => setForm(prev => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }))}
              className="rounded text-primary-600 focus:ring-primary-500" />
            Publish immediately
          </label>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploadProgress
              ? `Συμπίεση & ανέβασμα ${uploadProgress.current}/${uploadProgress.total}…`
              : 'Save Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
