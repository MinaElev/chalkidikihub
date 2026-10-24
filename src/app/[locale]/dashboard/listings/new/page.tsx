'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { AREA_SLUGS } from '@/lib/constants';
import { Amenity, Area, Beach } from '@/types';
import Image from 'next/image';
import { Loader2, Upload, X, Sparkles, MapPin, Star, Waves, CheckCircle2, AlertCircle } from 'lucide-react';
import { compressImage } from '@/lib/image-utils';
import { isBillingActive, ANNUAL_PLAN, CUTOFF_FREE_UNTIL_EL } from '@/lib/billing';
import { LocationPicker } from '@/legacy/components/ui/LocationPicker';
import NumberStepper from '@/legacy/components/ui/NumberStepper';
import PriceInput from '@/legacy/components/ui/PriceInput';

const MAX_PHOTOS = 10;
const DRAFT_KEY = 'chub_new_listing_draft_v1';

const PROPERTY_TYPES: { value: string; label: string; emoji: string }[] = [
  { value: 'rooms', label: 'Δωμάτια', emoji: '🛏️' },
  { value: 'studio', label: 'Studio', emoji: '🏠' },
  { value: 'apartment', label: 'Διαμέρισμα', emoji: '🏢' },
  { value: 'maisonette', label: 'Μεζονέτα', emoji: '🏡' },
  { value: 'house', label: 'Μονοκατοικία', emoji: '🏘️' },
  { value: 'villa', label: 'Βίλα', emoji: '🏖️' },
];

const AMENITY_EMOJI: Record<string, string> = {
  wifi: '📶', parking: '🅿️', airConditioning: '❄️', pool: '🏊', kitchen: '🍳', tv: '📺',
  washingMachine: '🧺', balcony: '🌇', seaView: '🌊', garden: '🌳', bbq: '🔥', petsAllowed: '🐾',
};
const AMENITY_GROUPS: { title: string; items: Amenity[] }[] = [
  { title: 'Βασικά', items: ['wifi', 'airConditioning', 'tv', 'kitchen', 'washingMachine'] },
  { title: 'Εξωτερικά & Θέα', items: ['pool', 'balcony', 'seaView', 'garden', 'bbq'] },
  { title: 'Άλλα', items: ['parking', 'petsAllowed'] },
];

const INITIAL = {
  title_el: '', description_el: '', area: 'kassandra' as Area, location_name: '',
  latitude: 40.1, longitude: 23.6, property_type: '', price_per_night: 50,
  guests_max: 2, bedrooms: 1, bathrooms: 1, amenities: [] as Amenity[],
  contact_phone: '', contact_email: '', website_url: '', booking_url: '', airbnb_url: '',
};
type FormState = typeof INITIAL;

function haversine(a: number, b: number, c: number, d: number) {
  const R = 6371, r = (x: number) => (x * Math.PI) / 180;
  const dLa = r(c - a), dLo = r(d - b);
  const s = Math.sin(dLa / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function NewListingPage() {
  const t = useTranslations('amenities');
  const tAreas = useTranslations('areas');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [draftRestored, setDraftRestored] = useState(false);
  const [areaBeaches, setAreaBeaches] = useState<Beach[]>([]);
  const submittedRef = useRef(false);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  // ── Restore draft (text only — File objects can't live in localStorage) ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- restore browser-stored state after mount (avoids a hydration mismatch)
          setForm((f) => ({ ...f, ...saved }));
          setDraftRestored(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // ── Auto-save draft on every change ──
  useEffect(() => {
    const touched = form.title_el || form.description_el || form.location_name || form.amenities.length > 0;
    try {
      if (touched && !submittedRef.current) localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch { /* quota/unavailable */ }
  }, [form]);

  // ── Warn before leaving with unsaved work ──
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (submittedRef.current) return;
      const dirty = form.title_el || form.description_el || form.location_name || images.length > 0 || form.amenities.length > 0;
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [form, images]);

  // ── Fetch area beaches for the "nearest beach" hint ──
  useEffect(() => {
    let alive = true;
    fetch(`/api/beaches?area=${form.area}&fields=card`)
      .then((r) => r.json())
      .then((d: Beach[]) => { if (alive && Array.isArray(d)) setAreaBeaches(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, [form.area]);

  const nearestBeach = useMemo(() => {
    if (!areaBeaches.length) return null;
    let best: { name: string; km: number } | null = null;
    for (const b of areaBeaches) {
      const bl = b as unknown as { latitude?: number; longitude?: number; name?: Record<string, string> };
      if (typeof bl.latitude !== 'number' || typeof bl.longitude !== 'number') continue;
      const km = haversine(form.latitude, form.longitude, bl.latitude, bl.longitude);
      const name = bl.name?.el || bl.name?.en || '';
      if (name && (!best || km < best.km)) best = { name, km };
    }
    return best;
  }, [areaBeaches, form.latitude, form.longitude]);

  // ── Completeness meter ──
  const completeness = useMemo(() => {
    const checks = [
      !!form.title_el.trim(),
      form.description_el.trim().length >= 80,
      !!form.location_name.trim(),
      !!form.property_type,
      form.price_per_night > 0,
      images.length >= 1,
      form.amenities.length >= 1,
      !!(form.contact_phone || form.contact_email),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form, images.length]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(a: Amenity) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  }

  function addFiles(files: File[]) {
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    const remaining = MAX_PHOTOS - images.length;
    if (imgs.length > remaining) {
      alert(`Μπορείς να ανεβάσεις μέχρι ${MAX_PHOTOS} φωτογραφίες. Προστέθηκαν οι πρώτες ${remaining}.`);
    }
    setImages((prev) => [...prev, ...imgs.slice(0, remaining)]);
  }
  function makeCover(idx: number) {
    setImages((prev) => (idx <= 0 ? prev : [prev[idx], ...prev.filter((_, i) => i !== idx)]));
  }

  async function generateDescription() {
    if (!form.title_el.trim()) { setError('Συμπλήρωσε πρώτα τον τίτλο για να γράψει το AI την περιγραφή.'); return; }
    setAiLoading(true); setError('');
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title_el, area: form.area, location_name: form.location_name,
          property_type: form.property_type, guests_max: form.guests_max,
          bedrooms: form.bedrooms, bathrooms: form.bathrooms, amenities: form.amenities, keywords: aiKeywords,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.description) { setError(json.error || 'Το AI δεν μπόρεσε να γράψει περιγραφή. Δοκίμασε ξανά.'); }
      else set('description_el', json.description);
    } catch { setError('Σφάλμα δικτύου κατά τη δημιουργία περιγραφής.'); }
    setAiLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Δεν είστε συνδεδεμένος. Κάντε ξανά είσοδο.'); setLoading(false); return; }

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
    const titleSlug = transliterate(form.title_el) || 'listing';
    const locationSlug = transliterate(form.location_name);
    let slug = [titleSlug, locationSlug].filter(Boolean).join('-').slice(0, 80);
    const { data: existing } = await supabase.from('listings').select('slug').like('slug', `${slug}%`);
    if (existing && existing.length > 0) slug = `${slug}-${existing.length + 1}`;

    const base = {
      title_el: form.title_el, title_en: form.title_el,
      description_el: form.description_el, description_en: form.description_el,
      area: form.area, location_name: form.location_name,
      latitude: form.latitude, longitude: form.longitude,
      price_per_night: form.price_per_night, guests_max: form.guests_max,
      bedrooms: form.bedrooms, bathrooms: form.bathrooms, amenities: form.amenities,
      contact_phone: form.contact_phone || null, contact_email: form.contact_email || null,
      website_url: form.website_url || null, booking_url: form.booking_url || null,
      // Insert as 'pending'; the DB billing trigger decides free-vs-paid by the
      // 2027 cutoff and forces 'pending_payment' for paid listings. We read the
      // returned row back to route the owner accordingly — never trusting the
      // client to set the billing state.
      airbnb_url: form.airbnb_url || null, status: 'pending', slug, owner_id: user.id,
    };

    // Include property_type; if the column isn't migrated yet, retry without it
    // so a new listing is never blocked by a missing column.
    let insertRes = await supabase.from('listings')
      .insert({ ...base, property_type: form.property_type || null }).select().single();
    if (insertRes.error && /property_type/i.test(insertRes.error.message)) {
      insertRes = await supabase.from('listings').insert(base).select().single();
    }
    const { data: listing, error: insertError } = insertRes;
    if (insertError) { setError(insertError.message); setLoading(false); return; }

    const uploadErrors: string[] = [];
    if (listing && images.length > 0) {
      setUploadProgress({ current: 0, total: images.length });
      for (let i = 0; i < images.length; i++) {
        setUploadProgress({ current: i + 1, total: images.length });
        const file = images[i];
        const filePath = `${user.id}/${listing.id}/${i}.webp`;
        let uploadBlob: Blob = file;
        try { uploadBlob = (await compressImage(file)).blob; }
        catch (err) {
          if (file.size > 1024 * 1024) {
            uploadErrors.push(`Εικόνα ${i + 1}: ${(err as Error).message || 'compression failed'} (${(file.size / 1024 / 1024).toFixed(1)}MB — μικρύνετε και ξαναδοκιμάστε)`);
            continue;
          }
        }
        const { error: upErr } = await supabase.storage.from('listing-images')
          .upload(filePath, uploadBlob, { cacheControl: '31536000', contentType: 'image/webp', upsert: true });
        if (upErr) { uploadErrors.push(`Εικόνα ${i + 1}: ${upErr.message}`); continue; }
        const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(filePath);
        const { error: insErr } = await supabase.from('listing_images')
          .insert({ listing_id: listing.id, image_url: publicUrl, sort_order: i, is_cover: i === 0 });
        if (insErr) uploadErrors.push(`Εικόνα ${i + 1} (DB): ${insErr.message}`);
      }
    }
    setUploadProgress(null);

    // Success → clear the saved draft so it can't resurrect on the next visit.
    submittedRef.current = true;
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }

    // The DB trigger set billing_exempt on the returned row. Free (grandfathered
    // / pre-2027-cutoff) listings follow the classic flow: notify admin+owner and
    // land on the listings page. Paid listings (status now 'pending_payment') go
    // to the billing page to pay — optionally with a discount code — before review.
    const isFree = !listing || listing.billing_exempt;

    if (isFree) {
      if (listing) {
        fetch('/api/listings/notify-new', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing_id: listing.id }),
        }).catch(() => {});
      }
      if (uploadErrors.length > 0) {
        setError('Η καταχώρηση αποθηκεύτηκε (σε έλεγχο), αλλά υπήρξαν προβλήματα με εικόνες: ' + uploadErrors.join('; '));
        setLoading(false);
        return;
      }
      router.push('/dashboard/listings?submitted=1');
      return;
    }

    // Paid path: photo failures are non-fatal (editable later) — surface them,
    // then send the owner to the billing page to complete payment.
    if (uploadErrors.length > 0) {
      setError('Η καταχώρηση αποθηκεύτηκε, αλλά κάποιες φωτογραφίες απέτυχαν (μπορείτε να τις προσθέσετε αργότερα): ' + uploadErrors.join('; '));
    }
    setLoading(false);
    router.push(`/dashboard/billing?listing=${listing.id}&new=1`);
  }

  const coverUrl = images[0] ? URL.createObjectURL(images[0]) : '';
  const billingActive = isBillingActive();

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Νέο κατάλυμα</h1>
        <div className="hidden sm:flex items-center gap-2 min-w-[180px]">
          <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${completeness}%` }} />
          </div>
          <span className="text-xs font-semibold text-gray-600 tabular-nums w-9 text-right">{completeness}%</span>
        </div>
      </div>

      {draftRestored && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-sky-50 border border-sky-200 rounded-xl text-sm text-sky-800">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Επαναφέραμε το αποθηκευμένο προσχέδιό σας. (Οι φωτογραφίες πρέπει να επιλεγούν ξανά.)
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white border border-gray-200 rounded-2xl p-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τίτλος καταλύματος *</label>
            <input type="text" required value={form.title_el} onChange={(e) => set('title_el', e.target.value)}
              placeholder="π.χ. Στούντιο με θέα θάλασσα στα Χανιώτη"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-gray-400 mt-1">Γράφετε μόνο στα Ελληνικά — μεταφράζεται αυτόματα σε 6 γλώσσες.</p>
          </div>

          {/* Property type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Τύπος καταλύματος</label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((p) => (
                <button key={p.value} type="button" onClick={() => set('property_type', form.property_type === p.value ? '' : p.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    form.property_type === p.value ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}>
                  <span className="mr-1">{p.emoji}</span>{p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description + AI */}
          <div>
            <div className="flex items-center justify-between mb-1 gap-2">
              <label className="block text-sm font-medium text-gray-700">Περιγραφή</label>
              <button type="button" onClick={generateDescription} disabled={aiLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-primary-600 text-white disabled:opacity-60">
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {aiLoading ? 'Γράφει…' : 'Γράψε με AI'}
              </button>
            </div>
            <textarea rows={6} value={form.description_el} onChange={(e) => set('description_el', e.target.value)}
              placeholder="Περιγράψτε το κατάλυμα: πόσο κοντά στη θάλασσα, τι προσφέρει, για ποιον ταιριάζει…"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
            <div className="flex items-center justify-between mt-1">
              <input type="text" value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)}
                placeholder="Λέξεις-κλειδιά για το AI (προαιρετικά): π.χ. μπαλκόνι, ήσυχο, οικογενειακό"
                className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 mr-2" />
              <span className={`text-xs shrink-0 ${form.description_el.trim().length < 80 ? 'text-amber-600' : 'text-gray-400'}`}>{form.description_el.trim().length} χαρ.</span>
            </div>
          </div>

          {/* Area & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Πόδι / Περιοχή *</label>
              <select value={form.area} onChange={(e) => set('area', e.target.value as Area)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500">
                {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Τοποθεσία *</label>
              <input type="text" required value={form.location_name} onChange={(e) => set('location_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="π.χ. Χανιώτη, Κασσάνδρα" />
            </div>
          </div>

          {/* Map */}
          <div>
            <LocationPicker latitude={form.latitude} longitude={form.longitude}
              onLocationChange={(lat, lng) => setForm((p) => ({ ...p, latitude: lat, longitude: lng }))} />
            {nearestBeach && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1">
                <Waves className="w-3.5 h-3.5" /> Κοντινότερη παραλία: <strong>{nearestBeach.name}</strong> ({nearestBeach.km < 1 ? `${Math.round(nearestBeach.km * 1000)} μ` : `${nearestBeach.km.toFixed(1)} χλμ`}) — αναφέρετέ την στην περιγραφή!
              </p>
            )}
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Τιμή από (€/βράδυ) *</label>
              <PriceInput value={form.price_per_night} onChange={(v) => set('price_per_night', v)} min={1} required />
              <p className="text-xs text-gray-500 mt-1 leading-snug">Ενδεικτική «από». Η ακριβής τιμή δίνεται μετά από επικοινωνία.</p>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Άτομα *</label>
              <NumberStepper value={form.guests_max} onChange={(v) => set('guests_max', v)} min={1} max={50} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Υπνοδωμάτια</label>
              <NumberStepper value={form.bedrooms} onChange={(v) => set('bedrooms', v)} min={0} max={30} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Μπάνια</label>
              <NumberStepper value={form.bathrooms} onChange={(v) => set('bathrooms', v)} min={0} max={30} /></div>
          </div>

          {/* Amenities grouped */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Παροχές</label>
            <div className="space-y-3">
              {AMENITY_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">{group.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((a) => (
                      <button key={a} type="button" onClick={() => toggleAmenity(a)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          form.amenities.includes(a) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}>
                        <span className="mr-1">{AMENITY_EMOJI[a]}</span>{t(a)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photos with drag-drop + cover */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Φωτογραφίες</label>
              <span className={`text-xs font-medium ${images.length >= MAX_PHOTOS ? 'text-red-600' : 'text-gray-500'}`}>{images.length} / {MAX_PHOTOS}</span>
            </div>
            <div className="flex flex-wrap gap-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files)); }}>
              {images.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 group">
                  <Image src={URL.createObjectURL(file)} alt="" width={96} height={96} className="w-full h-full object-cover" unoptimized />
                  {idx === 0 && <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[10px] font-semibold text-center py-0.5">Εξώφυλλο</span>}
                  {idx !== 0 && (
                    <button type="button" onClick={() => makeCover(idx)} title="Κάν' το εξώφυλλο"
                      className="absolute bottom-1 left-1 bg-white/90 text-gray-700 rounded-md p-1 opacity-0 group-hover:opacity-100 transition">
                      <Star className="w-3 h-3" />
                    </button>
                  )}
                  <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </div>
              ))}
              {images.length < MAX_PHOTOS && (
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 mt-1 px-1">Σύρετε ή επιλέξτε</span>
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); e.target.value = ''; }} />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Μέχρι {MAX_PHOTOS} φωτογραφίες. Η πρώτη είναι το εξώφυλλο — πατήστε <Star className="inline w-3 h-3 -mt-0.5" /> για να αλλάξετε. Φυσικό φως = καλύτερο αποτέλεσμα!</p>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Στοιχεία επικοινωνίας</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span className="text-sm font-medium text-gray-600">Τηλέφωνο</span>
                <input type="tel" value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} placeholder="+30 69…"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" /></div>
              <div><span className="text-sm font-medium text-gray-600">Email</span>
                <input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="info@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" /></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Εμφανίζονται στους επισκέπτες ως κουμπιά κλήσης &amp; email.</p>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ιστοσελίδα καταλύματος</label>
            <input type="url" value={form.website_url} onChange={(e) => set('website_url', e.target.value)} placeholder="https://www.myhotel.gr"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm" />
            <p className="text-xs text-gray-400 mt-1">Προαιρετικό.</p>
          </div>

          {/* Booking links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Σύνδεσμοι κρατήσεων</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span className="text-sm font-medium text-gray-600">Booking.com</span>
                <input type="url" value={form.booking_url} onChange={(e) => set('booking_url', e.target.value)} placeholder="https://www.booking.com/hotel/gr/…"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" /></div>
              <div><span className="text-sm font-medium text-gray-600">Airbnb</span>
                <input type="url" value={form.airbnb_url} onChange={(e) => set('airbnb_url', e.target.value)} placeholder="https://www.airbnb.com/rooms/…"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm mt-1" /></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Προαιρετικά — εμφανίζονται ως κουμπιά κράτησης.</p>
          </div>

          {/* Review notice & Submit */}
          <div className="pt-4 border-t border-gray-200 space-y-4">
            {billingActive ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
                💳 <strong>Ετήσια καταχώρηση — {ANNUAL_PLAN.priceLabel}/έτος:</strong> Η νέα καταχώρηση δημοσιεύεται με ένα ετήσιο πακέτο των <strong>{ANNUAL_PLAN.priceLabel}</strong> (με ΦΠΑ 24%). Μετά την υποβολή θα μεταφερθείτε στη σελίδα <strong>Χρέωσης</strong> για ασφαλή πληρωμή (Stripe) — εκεί μπορείτε να εισάγετε και <strong>κωδικό έκπτωσης</strong> αν έχετε. Μόλις ολοκληρωθεί, η ομάδα ελέγχει το κατάλυμα και το δημοσιεύει.
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900 leading-relaxed">
                🎁 <strong>Δωρεάν για πάντα:</strong> Οι καταχωρήσεις μέχρι τις <strong>{CUTOFF_FREE_UNTIL_EL}</strong> είναι δωρεάν εφ’ όρου ζωής. Κάθε νέο κατάλυμα ελέγχεται από την ομάδα του ChalkidikiHub πριν εμφανιστεί δημόσια — θα λάβετε email επιβεβαίωσης και νέο email μόλις δημοσιευτεί.
              </div>
            )}
            <div className="flex justify-end">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {uploadProgress ? `Ανέβασμα ${uploadProgress.current}/${uploadProgress.total}…` : (billingActive ? 'Υποβολή & πληρωμή →' : 'Υποβολή για έλεγχο')}
              </button>
            </div>
          </div>
        </form>

        {/* Live preview */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Προεπισκόπηση</div>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {coverUrl
                  ? <Image src={coverUrl} alt="" width={400} height={300} className="w-full h-full object-cover" unoptimized />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Χωρίς φωτογραφία</div>}
                {form.property_type && (
                  <span className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-700">
                    {PROPERTY_TYPES.find((p) => p.value === form.property_type)?.emoji} {PROPERTY_TYPES.find((p) => p.value === form.property_type)?.label}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-900 truncate">{form.title_el || 'Ο τίτλος του καταλύματος'}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{form.location_name || areaLabels[form.area]}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
                  <span>👤 {form.guests_max}</span><span>🛏️ {form.bedrooms}</span><span>🛁 {form.bathrooms}</span>
                </div>
                {form.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.amenities.slice(0, 5).map((a) => <span key={a} className="text-[15px]" title={t(a)}>{AMENITY_EMOJI[a]}</span>)}
                    {form.amenities.length > 5 && <span className="text-[11px] text-gray-400">+{form.amenities.length - 5}</span>}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline gap-1">
                  <span className="text-lg font-bold text-primary-700">€{form.price_per_night}</span>
                  <span className="text-xs text-gray-400">/ βράδυ</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 text-center">Έτσι περίπου θα φαίνεται στους επισκέπτες.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
