'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { AREA_SLUGS } from '@/lib/constants';
import { Area, PropertyType, SaleFeature } from '@/types';
import { Loader2, Upload, X } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { LocationPicker } from '@/components/ui/LocationPicker';

const PROPERTY_TYPES: PropertyType[] = ['house', 'apartment', 'land', 'commercial', 'other'];
const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: 'Κατοικία', apartment: 'Διαμέρισμα', land: 'Γη', commercial: 'Επαγγελματικό', other: 'Λοιπά',
};

const ALL_SALE_FEATURES: SaleFeature[] = ['parking', 'pool', 'garden', 'sea_view', 'furnished', 'elevator', 'storage', 'fireplace', 'solar', 'alarm', 'air_conditioning', 'central_heating'];
const FEATURE_LABELS: Record<SaleFeature, string> = {
  parking: 'Parking', pool: 'Πισίνα', garden: 'Κήπος', sea_view: 'Θέα Θάλασσα',
  furnished: 'Επιπλωμένο', elevator: 'Ασανσέρ', storage: 'Αποθήκη', fireplace: 'Τζάκι',
  solar: 'Ηλιακός', alarm: 'Συναγερμός', air_conditioning: 'Κλιματισμός', central_heating: 'Κεντρική Θέρμανση',
};

export default function NewSalePage() {
  const tAreas = useTranslations('areas');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState({
    title_el: '',
    description_el: '',
    property_type: 'house' as PropertyType,
    area: 'kassandra' as Area,
    location_name: '',
    latitude: 40.1,
    longitude: 23.6,
    price: 100000,
    size_sqm: 0,
    bedrooms: 0,
    bathrooms: 0,
    floor: 0,
    year_built: 0,
    energy_class: '',
    features: [] as SaleFeature[],
    contact_phone: '',
    contact_email: '',
    status: 'published',
  });

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  function toggleFeature(feature: SaleFeature) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); setLoading(false); return; }

    // Generate SEO-friendly slug: transliterate Greek -> Latin
    const greekToLatin: Record<string, string> = {
      'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
      'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
      'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
      'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o', 'ϊ': 'i', 'ϋ': 'y',
      'ΐ': 'i', 'ΰ': 'y', 'ου': 'ou', 'μπ': 'b', 'ντ': 'nt', 'γκ': 'gk', 'τσ': 'ts', 'τζ': 'tz',
    };
    function transliterate(text: string): string {
      let result = text.toLowerCase();
      for (const [gr, lat] of Object.entries(greekToLatin).sort((a, b) => b[0].length - a[0].length)) {
        result = result.split(gr).join(lat);
      }
      return result.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    const titleSlug = transliterate(form.title_el) || 'property';
    const locationSlug = transliterate(form.location_name);
    let slug = [titleSlug, locationSlug].filter(Boolean).join('-').slice(0, 80);

    // Check for duplicate slugs
    const { data: existing } = await supabase
      .from('sales').select('slug').like('slug', `${slug}%`);
    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`;
    }

    const { data: sale, error: insertError } = await supabase
      .from('sales')
      .insert({
        title_el: form.title_el,
        title_en: form.title_el,
        description_el: form.description_el,
        description_en: form.description_el,
        property_type: form.property_type,
        area: form.area,
        location_name: form.location_name,
        latitude: form.latitude,
        longitude: form.longitude,
        price: form.price,
        size_sqm: form.size_sqm,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        floor: form.floor,
        year_built: form.year_built || null,
        energy_class: form.energy_class || null,
        features: form.features,
        contact_phone: form.contact_phone || null,
        contact_email: form.contact_email || null,
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
    if (sale && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const filePath = `${user.id}/${sale.id}/${i}.webp`;

        let uploadBlob: Blob = file;
        try {
          const { blob } = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.72, format: 'webp' });
          uploadBlob = blob;
        } catch {}

        const { error: uploadError } = await supabase.storage
          .from('sale-images')
          .upload(filePath, uploadBlob, { contentType: 'image/webp', upsert: true });

        if (uploadError) {
          uploadErrors.push(`Image ${i + 1}: ${uploadError.message}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('sale-images')
          .getPublicUrl(filePath);

        const { error: imgInsertError } = await supabase.from('sale_images').insert({
          sale_id: sale.id,
          image_url: publicUrl,
          sort_order: i,
          is_cover: i === 0,
        });

        if (imgInsertError) {
          uploadErrors.push(`Image ${i + 1} DB: ${imgInsertError.message}`);
        }
      }
    }

    if (uploadErrors.length > 0) {
      setError('Saved but image issues: ' + uploadErrors.join('; '));
      setLoading(false);
      return;
    }

    router.push('/dashboard/sales');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Νέο Ακίνητο προς Πώληση</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Τίτλος ακινήτου *</label>
          <input type="text" required value={form.title_el} onChange={(e) => setForm({ ...form, title_el: e.target.value })}
            placeholder="π.χ. Μονοκατοικία με θέα θάλασσα στα Χανιώτη"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Η μετάφραση στις άλλες γλώσσες γίνεται αυτόματα</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
          <textarea rows={5} value={form.description_el} onChange={(e) => setForm({ ...form, description_el: e.target.value })}
            placeholder="Περιγράψτε το ακίνητο, τα χαρακτηριστικά του, τη θέση, κλπ."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Η μετάφραση στις άλλες γλώσσες γίνεται αυτόματα</p>
        </div>

        {/* Property type, Area & Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τύπος ακινήτου *</label>
            <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value as PropertyType })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
              {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{PROPERTY_TYPE_LABELS[pt]}</option>)}
            </select>
          </div>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              placeholder="π.χ. Χανιώτη, Κασσάνδρα" />
          </div>
        </div>

        {/* Map picker */}
        <LocationPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onLocationChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
        />

        {/* Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τιμή (EUR) *</label>
            <input type="number" min={1} required value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Εμβαδόν (τ.μ.)</label>
            <input type="number" min={0} value={form.size_sqm}
              onChange={(e) => setForm({ ...form, size_sqm: Number(e.target.value) })}
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Όροφος</label>
            <input type="number" min={0} value={form.floor}
              onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Έτος κατασκευής</label>
            <input type="number" min={1900} max={2030} value={form.year_built || ''}
              onChange={(e) => setForm({ ...form, year_built: Number(e.target.value) })}
              placeholder="π.χ. 2020"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ενεργειακή κλάση</label>
            <select value={form.energy_class} onChange={(e) => setForm({ ...form, energy_class: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
              <option value="">--</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
            </select>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Χαρακτηριστικά</label>
          <div className="flex flex-wrap gap-2">
            {ALL_SALE_FEATURES.map((feature) => (
              <button key={feature} type="button" onClick={() => toggleFeature(feature)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  form.features.includes(feature)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {FEATURE_LABELS[feature]}
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
          <p className="text-xs text-gray-400 mt-1">Θα εμφανίζονται στους επισκέπτες ως κουμπιά κλήσης και email</p>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Φωτογραφίες</label>
          <div className="flex flex-wrap gap-3">
            {images.map((file, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Upload</span>
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => { if (e.target.files) setImages([...images, ...Array.from(e.target.files)]); }} />
            </label>
          </div>
        </div>

        {/* Status & Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.status === 'published'}
              onChange={(e) => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })}
              className="rounded text-primary-600 focus:ring-primary-500" />
            Δημοσίευση αμέσως
          </label>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Αποθήκευση
          </button>
        </div>
      </form>
    </div>
  );
}
