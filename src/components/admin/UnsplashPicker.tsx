'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Loader2, X, Check, Camera } from 'lucide-react';

interface UnsplashPhoto {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  credit: string;
  creditLink: string;
  downloadLink: string;
}

interface Props {
  defaultQuery: string;
  folder: string;
  slug: string;
  onSelect: (url: string) => void;
}

export function UnsplashPicker({ defaultQuery, folder, slug, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(defaultQuery);
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true); setError('');
    try {
      const res = await fetch(`/api/unsplash?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setPhotos(data);
        if (data.length === 0) setError('Δεν βρέθηκαν φωτογραφίες');
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setSearching(false);
  }

  async function handleSelect(photo: UnsplashPhoto) {
    setSaving(photo.id);
    try {
      const res = await fetch('/api/unsplash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoUrl: photo.url,
          downloadLink: photo.downloadLink,
          folder,
          slug: `${slug}-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onSelect(data.url);
        setOpen(false);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setSaving(null);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => { setOpen(true); if (photos.length === 0) handleSearch(); }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
        <Camera className="w-3.5 h-3.5" />
        Αναζήτηση φωτό
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">Αναζήτηση φωτογραφίας (Unsplash)</h4>
        <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-200 rounded"><X className="w-4 h-4" /></button>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-3">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="π.χ. Sani beach, taverna halkidiki..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
        <button onClick={handleSearch} disabled={searching}
          className="flex items-center gap-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm disabled:opacity-50">
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      {/* Results grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {photos.map((photo) => (
            <button key={photo.id} type="button" onClick={() => handleSelect(photo)}
              disabled={saving === photo.id}
              className="relative aspect-[4/3] rounded-lg overflow-hidden group hover:ring-2 hover:ring-primary-500 transition-all">
              <Image src={photo.thumb || '/images/placeholder.svg'} alt={photo.alt} fill className="object-cover" sizes="33vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                {saving === photo.id ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-black/50 text-[8px] text-white truncate">
                {photo.credit}
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-gray-400">Photos by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a> — free to use</p>
    </div>
  );
}
