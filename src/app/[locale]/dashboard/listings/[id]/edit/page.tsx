'use client';

/**
 * The one place an owner edits a listing. It used to be split in two: this
 * form, and a separate "Site καταλύματος" page (tagline, story, house rules,
 * practical info, FAQs, …) that owners often never found, although everything
 * on it shows on the same public listing page. Now it is one page in sections,
 * each with an anchor (#rules, #practical, …) that emails and nudges link to.
 *
 * Everything stored on the listing row saves with the one sticky button. The
 * list editors (FAQs, emergency numbers, extras, captions, nearby) add and save
 * row by row, as before, and say so.
 */
import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { ALL_AMENITIES, AREA_SLUGS } from '@/lib/constants';
import { Amenity, Area } from '@/types';
import { LocationPicker } from '@/legacy/components/ui/LocationPicker';
import { isUnsetPin, UNSET_PIN_MESSAGE_EL } from '@/lib/geo';
import NumberStepper from '@/legacy/components/ui/NumberStepper';
import PriceInput from '@/legacy/components/ui/PriceInput';
import { compressImage } from '@/lib/image-utils';
import {
  Loader2, Upload, X, Save, ArrowLeft, Trash2, Calendar, Eye, Info, Check,
} from 'lucide-react';
import { FaqsEditor } from '@/legacy/components/dashboard/FaqsEditor';
import { EmergencyContactsEditor } from '@/legacy/components/dashboard/EmergencyContactsEditor';
import { ExtrasEditor } from '@/legacy/components/dashboard/ExtrasEditor';
import { PhotoCaptionsEditor } from '@/legacy/components/dashboard/PhotoCaptionsEditor';
import { NearbyOverridesEditor } from '@/legacy/components/dashboard/NearbyOverridesEditor';
import {
  HouseRulesFields, houseRulesFromRow, houseRulesPayload, type HouseRules,
  PracticalInfoFields, practicalFromRow, practicalPayload, type PracticalInfo,
} from '@/components/dashboard/ListingDetailFields';

const MAX_PHOTOS = 10;

interface DbImage { id: string; image_url: string; sort_order: number; is_cover: boolean }

/** Section anchors — linked from the quality email and My Listings. */
const SECTIONS = [
  { id: 'basics', label: 'Βασικά' },
  { id: 'photos', label: 'Φωτογραφίες' },
  { id: 'location', label: 'Τοποθεσία' },
  { id: 'amenities', label: 'Παροχές' },
  { id: 'contact', label: 'Επικοινωνία' },
  { id: 'rules', label: 'Κανόνες & ώρες' },
  { id: 'practical', label: 'Χρήσιμες πληροφορίες' },
  { id: 'about', label: 'Για εσάς' },
  { id: 'more', label: 'Περισσότερα' },
] as const;

type Main = {
  title_el: string; description_el: string; area: Area; location_name: string;
  latitude: number; longitude: number; price_per_night: number; guests_max: number;
  bedrooms: number; bathrooms: number; amenities: Amenity[];
  contact_phone: string; contact_email: string; website_url: string; booking_url: string; airbnb_url: string;
  status: string; tagline_el: string; owner_story_el: string;
};
type Snapshot = { main: Main; rules: HouseRules; practical: PracticalInfo };

export default function EditListingPage() {
  const t = useTranslations('amenities');
  const tAreas = useTranslations('areas');
  const listingId = useParams().id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [slug, setSlug] = useState('');
  const [approvedAt, setApprovedAt] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<DbImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [main, setMain] = useState<Main | null>(null);
  const [rules, setRules] = useState<HouseRules | null>(null);
  const [practical, setPractical] = useState<PracticalInfo | null>(null);
  const [saved, setSaved] = useState<string>('');   // JSON of the last saved snapshot

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'), sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'), mainland: tAreas('mainlandHalkidiki.name'),
  };

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error: err } = await supabase.from('listings').select('*, listing_images(*)').eq('id', listingId).single();
      if (err || !data) { setError(err?.message || 'Η καταχώρηση δεν βρέθηκε.'); setLoading(false); return; }
      const snap: Snapshot = {
        main: {
          title_el: data.title_el || '', description_el: data.description_el || '',
          area: data.area as Area, location_name: data.location_name || '',
          latitude: data.latitude || 40.1, longitude: data.longitude || 23.6,
          price_per_night: Number(data.price_per_night), guests_max: data.guests_max,
          bedrooms: data.bedrooms, bathrooms: data.bathrooms,
          amenities: (data.amenities as Amenity[]) || [],
          contact_phone: data.contact_phone || '', contact_email: data.contact_email || '',
          website_url: data.website_url || '', booking_url: data.booking_url || '', airbnb_url: data.airbnb_url || '',
          status: data.status, tagline_el: data.tagline_el || '', owner_story_el: data.owner_story_el || '',
        },
        rules: houseRulesFromRow(data),
        practical: practicalFromRow(data),
      };
      setMain(snap.main); setRules(snap.rules); setPractical(snap.practical);
      setSaved(JSON.stringify(snap));
      setSlug(data.slug || '');
      setApprovedAt(data.approved_at || null);
      setExistingImages((data.listing_images || []).sort((a: DbImage, b: DbImage) => a.sort_order - b.sort_order));
      setLoading(false);
    })();
  }, [listingId]);

  // Jump to the section named in the URL (#rules, #photos…) once it exists.
  useEffect(() => {
    if (loading) return;
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [loading]);

  const dirty = useMemo(() => {
    if (!main || !rules || !practical) return false;
    return newImages.length > 0 || JSON.stringify({ main, rules, practical }) !== saved;
  }, [main, rules, practical, saved, newImages]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  if (!main || !rules || !practical) return <div className="p-4 text-sm text-red-600">{error}</div>;

  const set = <K extends keyof Main>(k: K, v: Main[K]) => setMain((p) => (p ? { ...p, [k]: v } : p));
  const toggleAmenity = (a: Amenity) =>
    set('amenities', main.amenities.includes(a) ? main.amenities.filter((x) => x !== a) : [...main.amenities, a]);

  async function deleteImage(imageId: string) {
    const supabase = createClient();
    await supabase.from('listing_images').delete().eq('id', imageId);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function save() {
    if (!main || !rules || !practical) return;
    setError('');
    const fail = (msg: string, section: string) => {
      setError(msg);
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (!main.title_el.trim()) return fail('Συμπληρώστε τον τίτλο του καταλύματος.', 'basics');
    if (!main.location_name.trim()) return fail('Συμπληρώστε την τοποθεσία (π.χ. χωριό).', 'basics');
    if (isUnsetPin(main.latitude, main.longitude)) return fail(UNSET_PIN_MESSAGE_EL, 'location');

    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Η σύνδεσή σας έληξε. Συνδεθείτε ξανά.'); setSaving(false); return; }

    const { data: coverImgs } = await supabase.from('listing_images')
      .select('image_url').eq('listing_id', listingId).eq('is_cover', true).limit(1);

    const { error: updateError } = await supabase.from('listings').update({
      image_url: coverImgs?.[0]?.image_url || '',
      title_el: main.title_el, title_en: main.title_el,
      description_el: main.description_el, description_en: main.description_el,
      area: main.area, location_name: main.location_name,
      latitude: main.latitude, longitude: main.longitude,
      price_per_night: main.price_per_night, guests_max: main.guests_max,
      bedrooms: main.bedrooms, bathrooms: main.bathrooms, amenities: main.amenities,
      contact_phone: main.contact_phone || null, contact_email: main.contact_email || null,
      website_url: main.website_url || null, booking_url: main.booking_url || null, airbnb_url: main.airbnb_url || null,
      status: main.status,
      tagline_el: main.tagline_el.trim() || null, owner_story_el: main.owner_story_el.trim() || null,
      ...houseRulesPayload(rules),
      ...practicalPayload(practical),
    }).eq('id', listingId);
    if (updateError) { setError(updateError.message); setSaving(false); return; }

    // Upload new photos (compressed first; oversize originals are skipped).
    if (newImages.length > 0) {
      const startOrder = existingImages.length;
      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const filePath = `${user.id}/${listingId}/${startOrder + i}-${Date.now()}.webp`;
        let uploadBlob: Blob = file;
        let contentType = file.type;
        try {
          const { blob } = await compressImage(file);
          uploadBlob = blob;
          contentType = 'image/webp';
        } catch (err) {
          if (file.size > 1024 * 1024) { console.warn('[upload] skipping oversized file after compress failure', file.name, err); continue; }
        }
        const { error: uploadError } = await supabase.storage.from('listing-images')
          .upload(filePath, uploadBlob, { cacheControl: '31536000', contentType, upsert: true });
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(filePath);
          await supabase.from('listing_images').insert({
            listing_id: listingId, image_url: publicUrl, sort_order: startOrder + i,
            is_cover: existingImages.length === 0 && i === 0,
          });
        }
      }
      const { data: imgs } = await supabase.from('listing_images').select('*').eq('listing_id', listingId).order('sort_order');
      if (imgs) setExistingImages(imgs);
      setNewImages([]);
    }

    setSaved(JSON.stringify({ main, rules, practical }));
    setSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  const photoCount = existingImages.length + newImages.length;

  return (
    <div>
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-4">
        <ArrowLeft className="w-4 h-4" />Πίσω στα καταλύματα
      </Link>

      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Επεξεργασία καταλύματος</h1>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{main.title_el}</p>
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <Link href={`/listings/${slug}`} target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl text-sm">
              <Eye className="w-4 h-4" />Προβολή σελίδας
            </Link>
          )}
          <Link href={`/dashboard/listings/${listingId}/availability`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-xl text-sm">
            <Calendar className="w-4 h-4" />Ημερολόγιο
          </Link>
        </div>
      </div>

      <div className="mb-5 flex gap-2.5 rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3 text-sm text-gray-700">
        <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
        <span>Όλα όσα συμπληρώνετε εδώ εμφανίζονται στη σελίδα του καταλύματος. Γράψτε στα <strong>ελληνικά</strong>· τη μετάφραση στις άλλες γλώσσες την αναλαμβάνουμε εμείς.</span>
      </div>

      {/* Section menu */}
      <nav aria-label="Ενότητες" className="sticky top-16 z-20 -mx-1 mb-5 bg-gray-50/95 backdrop-blur py-2 px-1 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}
              onClick={(e) => { e.preventDefault(); history.replaceState(null, '', `#${s.id}`); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700 whitespace-nowrap">
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {error && <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      <div className="space-y-5">
        <Section id="basics" title="Βασικά στοιχεία">
          <Field label="Τίτλος καταλύματος *">
            <input type="text" value={main.title_el} onChange={(e) => set('title_el', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Περιγραφή" hint={`${main.description_el.trim().length} χαρακτήρες · προτείνουμε τουλάχιστον 300: χώροι, τι κάνει το κατάλυμα ξεχωριστό, τι υπάρχει κοντά.`}>
            <textarea rows={6} value={main.description_el} onChange={(e) => set('description_el', e.target.value)} className={inputCls} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Περιοχή *">
              <select value={main.area} onChange={(e) => set('area', e.target.value as Area)} className={inputCls}>
                {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
              </select>
            </Field>
            <Field label="Τοποθεσία (χωριό) *">
              <input type="text" value={main.location_name} onChange={(e) => set('location_name', e.target.value)} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Τιμή από (€/βράδυ) *" hint="Ενδεικτική τιμή «από».">
              <PriceInput value={main.price_per_night} onChange={(v) => set('price_per_night', v)} min={1} required />
            </Field>
            <Field label="Μέγιστοι επισκέπτες *">
              <NumberStepper value={main.guests_max} onChange={(v) => set('guests_max', v)} min={1} max={50} required />
            </Field>
            <Field label="Υπνοδωμάτια">
              <NumberStepper value={main.bedrooms} onChange={(v) => set('bedrooms', v)} min={0} max={30} />
            </Field>
            <Field label="Μπάνια">
              <NumberStepper value={main.bathrooms} onChange={(v) => set('bathrooms', v)} min={0} max={30} />
            </Field>
          </div>
        </Section>

        <Section id="photos" title="Φωτογραφίες" subtitle={`${photoCount} / ${MAX_PHOTOS} · προτείνουμε τουλάχιστον 5: δωμάτια, μπάνιο, κουζίνα, εξωτερικοί χώροι, θέα.`}>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 group">
                <Image src={img.image_url || '/images/placeholder.svg'} alt="" width={96} height={96} className="w-full h-full object-cover" />
                {img.is_cover && <div className="absolute bottom-0 inset-x-0 bg-primary-600/80 text-white text-center text-[10px] py-0.5">Εξώφυλλο</div>}
                <button type="button" onClick={() => deleteImage(img.id)} aria-label="Διαγραφή φωτογραφίας"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {newImages.map((file, idx) => (
              <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image src={URL.createObjectURL(file)} alt="" width={96} height={96} className="w-full h-full object-cover" unoptimized />
                <div className="absolute bottom-0 inset-x-0 bg-green-600/80 text-white text-center text-[10px] py-0.5">Νέα</div>
                <button type="button" onClick={() => setNewImages(newImages.filter((_, i) => i !== idx))} aria-label="Αφαίρεση"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </div>
            ))}
            {photoCount < MAX_PHOTOS && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Προσθήκη</span>
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const picked = Array.from(e.target.files);
                    const remaining = MAX_PHOTOS - photoCount;
                    if (picked.length > remaining) alert(`Μπορείτε να έχετε έως ${MAX_PHOTOS} φωτογραφίες. Επιλέχθηκαν οι πρώτες ${remaining}.`);
                    setNewImages([...newImages, ...picked.slice(0, remaining)]);
                    e.target.value = '';
                  }} />
              </label>
            )}
          </div>
          {newImages.length > 0 && <p className="text-xs text-amber-700">Οι νέες φωτογραφίες ανεβαίνουν όταν πατήσετε «Αποθήκευση».</p>}
          {existingImages.length > 0 && (
            <div className="pt-4 border-t border-gray-100 first:pt-0 first:border-t-0">
              <h3 className="text-sm font-semibold text-gray-800">Λεζάντες φωτογραφιών</h3>
              <SeparateSaveNote />
              <PhotoCaptionsEditor listingId={listingId} />
            </div>
          )}
        </Section>

        <Section id="location" title="Τοποθεσία στον χάρτη" subtitle="Σύρετε την πινέζα ή κάντε κλικ στο σημείο όπου βρίσκεται το κατάλυμα.">
          <LocationPicker latitude={main.latitude} longitude={main.longitude}
            onLocationChange={(lat, lng) => setMain((p) => (p ? { ...p, latitude: lat, longitude: lng } : p))} />
          {isUnsetPin(main.latitude, main.longitude) && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              Η πινέζα δεν έχει τοποθετηθεί ακόμα. Σύρετέ την ή κάντε κλικ στον χάρτη, στο σημείο του καταλύματος.
            </p>
          )}
        </Section>

        <Section id="amenities" title="Παροχές" subtitle={`${main.amenities.length} επιλεγμένες · πολλοί επισκέπτες φιλτράρουν με βάση τις παροχές.`}>
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)} aria-pressed={main.amenities.includes(a)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  main.amenities.includes(a) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}>
                {t(a)}
              </button>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Επικοινωνία & σύνδεσμοι">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Τηλέφωνο"><input type="tel" value={main.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} placeholder="+30 69…" className={inputCls} /></Field>
            <Field label="Email"><input type="email" value={main.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="info@example.com" className={inputCls} /></Field>
          </div>
          <Field label="Website καταλύματος"><input type="url" value={main.website_url} onChange={(e) => set('website_url', e.target.value)} placeholder="https://www.myhotel.gr" className={inputCls} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Booking.com"><input type="url" value={main.booking_url} onChange={(e) => set('booking_url', e.target.value)} placeholder="https://www.booking.com/hotel/gr/…" className={inputCls} /></Field>
            <Field label="Airbnb"><input type="url" value={main.airbnb_url} onChange={(e) => set('airbnb_url', e.target.value)} placeholder="https://www.airbnb.com/rooms/…" className={inputCls} /></Field>
          </div>
        </Section>

        <Section id="rules" title="Κανόνες & ώρες" subtitle="Ώρες άφιξης και αναχώρησης, κάπνισμα, κατοικίδια, πάρτι, παιδιά. Οι επισκέπτες βλέπουν ξεκάθαρα τι ισχύει πριν κλείσουν.">
          <HouseRulesFields value={rules} onChange={setRules} />
        </Section>

        <Section id="practical" title="Χρήσιμες πληροφορίες" subtitle="Οι ερωτήσεις που κάνουν οι επισκέπτες πριν κλείσουν: πώς θα έρθουν, πώς γίνεται η άφιξη, Wi-Fi, πάρκινγκ.">
          <PracticalInfoFields value={practical} onChange={setPractical} />
        </Section>

        <Section id="about" title="Για εσάς">
          <Field label="Σλόγκαν" hint={`Μικρή φράση κάτω από τον τίτλο · ${main.tagline_el.length} / 120`}>
            <input type="text" maxLength={120} value={main.tagline_el} onChange={(e) => set('tagline_el', e.target.value)}
              placeholder="π.χ. Βίλα με ιδιωτική πισίνα 30 μέτρα από τη θάλασσα" className={inputCls} />
          </Field>
          <Field label="Η ιστορία μας" hint="Μιλήστε για εσάς και το κατάλυμα: τι το κάνει ξεχωριστό, τι αγαπάτε εδώ. Μια προσωπική αφήγηση χτίζει εμπιστοσύνη.">
            <textarea rows={6} value={main.owner_story_el} onChange={(e) => set('owner_story_el', e.target.value)} className={inputCls} />
          </Field>
        </Section>

        <Section id="more" title="Περισσότερα">
          <SubBlock title="Συχνές ερωτήσεις" hint="Απαντήστε από πριν σε όσα ρωτούν συχνά οι επισκέπτες."><FaqsEditor listingId={listingId} /></SubBlock>
          <SubBlock title="Πρόσθετες υπηρεσίες" hint="Π.χ. πρωινό, μεταφορά από το αεροδρόμιο, καθαριότητα."><ExtrasEditor listingId={listingId} /></SubBlock>
          <SubBlock title="Τηλέφωνα έκτακτης ανάγκης" hint="Αστυνομία, ιατρείο, φαρμακείο, ταξί, το δικό σας τηλέφωνο."><EmergencyContactsEditor listingId={listingId} /></SubBlock>
          <SubBlock title="Τι υπάρχει γύρω" hint="Ποια κοντινά μέρη θα εμφανίζονται στη σελίδα σας."><NearbyOverridesEditor listingId={listingId} /></SubBlock>
        </Section>
      </div>

      {/* Sticky save bar */}
      <div className={`sticky bottom-3 z-30 mt-6 border rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between gap-3 flex-wrap ${
        dirty ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3 flex-wrap text-sm">
          {approvedAt ? (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={main.status === 'published'}
                onChange={(e) => set('status', e.target.checked ? 'published' : 'draft')}
                className="rounded text-primary-600 focus:ring-primary-500" />
              Δημοσιευμένο
            </label>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Σε αναμονή έγκρισης</span>
          )}
          {savedFlash ? (
            <span className="inline-flex items-center gap-1 text-green-700 font-medium"><Check className="w-4 h-4" />Αποθηκεύτηκε</span>
          ) : dirty ? (
            <span className="text-amber-800 font-medium">Υπάρχουν αλλαγές που δεν έχουν αποθηκευτεί</span>
          ) : (
            <span className="text-gray-500">Όλες οι αλλαγές είναι αποθηκευμένες</span>
          )}
        </div>
        <button type="button" onClick={save} disabled={saving || !dirty}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Αποθήκευση
        </button>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm';

function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-32 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
      <h2 id={`${id}-h`} className="text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1 leading-snug">{hint}</p>}
    </div>
  );
}

function SeparateSaveNote() {
  return <p className="text-xs text-gray-500 mt-0.5 mb-3">Κάθε γραμμή εδώ αποθηκεύεται με το δικό της κουμπί.</p>;
}

function SubBlock({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="pt-4 border-t border-gray-100 first:pt-0 first:border-t-0">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-500 mt-0.5">{hint} Κάθε γραμμή αποθηκεύεται με το δικό της κουμπί.</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
