'use client';

import { useState } from 'react';
import { MapPin, Search, Loader2, Check, X, Star, Phone, Clock, Image, AlertTriangle } from 'lucide-react';

interface GooglePlace {
  place_id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  reviews_count: number;
  types: string[];
  photo_ref: string | null;
  open_now?: boolean;
  price_level?: number;
}

const LOCATIONS = [
  { label: 'Κασσάνδρα', lat: 39.95, lng: 23.45 },
  { label: 'Σιθωνία', lat: 40.05, lng: 23.80 },
  { label: 'Άθως', lat: 40.25, lng: 24.10 },
  { label: 'Ν. Μουδανιά', lat: 40.24, lng: 23.28 },
  { label: 'Πολύγυρος', lat: 40.37, lng: 23.44 },
  { label: 'Χανιώτη', lat: 39.93, lng: 23.55 },
  { label: 'Καλλιθέα', lat: 39.97, lng: 23.46 },
  { label: 'Νικήτη', lat: 40.22, lng: 23.67 },
  { label: 'Σάρτη', lat: 40.08, lng: 23.97 },
];

const TYPES = [
  { value: 'restaurant', label: 'Εστιατόρια' },
  { value: 'bar', label: 'Μπαρ' },
  { value: 'cafe', label: 'Καφετέριες' },
  { value: 'bakery', label: 'Φούρνοι' },
  { value: 'night_club', label: 'Clubs' },
];

export default function GoogleImportPage() {
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [type, setType] = useState('restaurant');
  const [radius, setRadius] = useState(10000);
  const [places, setPlaces] = useState<GooglePlace[]>([]);
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [overrideArea, setOverrideArea] = useState('auto');

  async function handleSearch() {
    setSearching(true); setError(''); setPlaces([]);
    try {
      const res = await fetch(`/api/admin/google-import?lat=${location.lat}&lng=${location.lng}&type=${type}&radius=${radius}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setPlaces(data);
        if (data.length === 0) setError('Δεν βρέθηκαν αποτελέσματα');
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setSearching(false);
  }

  async function handleImport(place: GooglePlace) {
    setImporting(place.place_id);
    try {
      const res = await fetch('/api/admin/google-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place_id: place.place_id, area_override: overrideArea !== 'auto' ? overrideArea : undefined }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setImported(prev => new Set(prev).add(place.place_id));
      } else {
        setErrors(prev => ({ ...prev, [place.place_id]: data.error || 'Failed' }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, [place.place_id]: (err as Error).message }));
    }
    setImporting(null);
  }

  async function handleImportAll() {
    for (const place of places) {
      if (imported.has(place.place_id)) continue;
      await handleImport(place);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Google Places Import</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Εισαγωγή πραγματικών εστιατορίων, μπαρ, καφετεριών από Google Maps — με τηλέφωνα, ωράρια, rating και φωτογραφίες.
      </p>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {/* Search controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τοποθεσία</label>
            <select value={LOCATIONS.indexOf(location)}
              onChange={(e) => setLocation(LOCATIONS[Number(e.target.value)])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
              {LOCATIONS.map((loc, i) => (
                <option key={i} value={i}>{loc.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τύπος</label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ακτίνα</label>
            <select value={radius} onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={20000}>20 km</option>
              <option value={30000}>30 km</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleSearch} disabled={searching}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Αναζήτηση
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Κάθε αναζήτηση κοστίζει ~$0.03. Κάθε import ~$0.02 + $0.007/φωτό. Google δίνει $200 δωρεάν/μήνα.
          </p>
        </div>
      </div>

      {/* Area override */}
      {places.length > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
          <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
          <label className="text-sm font-medium text-gray-700 shrink-0">Περιοχή για import:</label>
          <select value={overrideArea} onChange={(e) => setOverrideArea(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
            <option value="auto">Αυτόματη (GPS)</option>
            <option value="kassandra">Κασσάνδρα</option>
            <option value="sithonia">Σιθωνία</option>
            <option value="athos">Άθως</option>
            <option value="mainland">Ενδοχώρα</option>
          </select>
          {overrideArea !== 'auto' && (
            <span className="text-xs text-primary-600 font-medium">Όλα τα imports θα πάνε σε: {overrideArea}</span>
          )}
        </div>
      )}

      {/* Results */}
      {places.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{places.length} αποτελέσματα — {imported.size} εισήχθησαν</p>
            <button onClick={handleImportAll} disabled={importing !== null}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
              <Check className="w-4 h-4" /> Import All ({places.length - imported.size})
            </button>
          </div>

          <div className="space-y-2">
            {places.map(place => {
              const isImported = imported.has(place.place_id);
              const placeError = errors[place.place_id];
              return (
                <div key={place.place_id}
                  className={`flex items-center gap-4 p-4 bg-white border rounded-xl ${isImported ? 'border-green-300 bg-green-50/30' : placeError ? 'border-red-300' : 'border-gray-200'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
                      {place.rating > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />{place.rating} ({place.reviews_count})
                        </span>
                      )}
                      {place.photo_ref && <Image className="w-3.5 h-3.5 text-green-500" />}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{place.address}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                      <span>{place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}</span>
                      {place.types.slice(0, 3).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-gray-100 rounded">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isImported ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" /> Imported
                      </span>
                    ) : placeError ? (
                      <span className="text-xs text-red-600">{placeError}</span>
                    ) : (
                      <button onClick={() => handleImport(place)} disabled={importing === place.place_id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium disabled:opacity-50">
                        {importing === place.place_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                        Import
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-8 bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Πώς λειτουργεί:</h3>
        <ol className="text-xs text-gray-500 space-y-1">
          <li>1. Επιλέξτε τοποθεσία + τύπο + ακτίνα → Αναζήτηση</li>
          <li>2. Βλέπετε πραγματικά μαγαζιά από Google Maps με rating + photos</li>
          <li>3. "Import" αποθηκεύει: όνομα, GPS, τηλέφωνο, ωράριο, rating, φωτογραφία</li>
          <li>4. Μετά πηγαίνετε Admin → Restaurants → Edit → AI Auto-Complete → μεταφράσεις + SEO</li>
          <li>5. Tip: μετά το import, χρησιμοποιήστε AI Bulk SEO για μαζικές μεταφράσεις</li>
        </ol>
      </div>
    </div>
  );
}
