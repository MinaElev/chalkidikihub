'use client';

import { useState } from 'react';
import { Loader2, Link2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Amenity, Area } from '@/types';

interface ImportedData {
  title?: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  price_per_night?: number | null;
  guests_max?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  amenities?: Amenity[];
  location_name?: string;
  area?: Area | null;
  latitude?: number | null;
  longitude?: number | null;
  images?: string[];
  source_url?: string;
  source_platform?: string;
}

interface ImportFromUrlProps {
  onImport: (data: ImportedData) => void;
  /**
   * Listing ID for image migration. When provided, the imported `images[]`
   * (which are external CDN URLs from Booking/Airbnb that get blocked or
   * expire) are downloaded server-side and re-uploaded to our `listing-images`
   * bucket, then added as `listing_images` rows. Called via
   * `/api/admin/migrate-images` after the AI extraction completes.
   *
   * Without this prop the photo URLs are silently discarded — the old
   * behaviour. Pass it whenever you have a listing row to attach images to.
   */
  listingId?: string;
  /** Fires after images are migrated so the parent can refresh its gallery. */
  onImagesMigrated?: () => void;
}

export function ImportFromUrl({ onImport, listingId, onImagesMigrated }: ImportFromUrlProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const isValidUrl = url.includes('airbnb.com') || url.includes('airbnb.gr') || url.includes('booking.com');

  async function handleImport() {
    if (!url || !isValidUrl) return;
    setLoading(true);
    setError('');
    setSuccess(false);
    setMigrationStatus('');

    try {
      const res = await fetch('/api/import-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Import failed');
        return;
      }

      onImport(data);

      // Migrate external image URLs into Supabase storage so they don't expire
      // / get blocked. Only when listingId is available (edit page).
      const imageUrls: string[] = Array.isArray(data?.images) ? data.images : [];
      if (listingId && imageUrls.length > 0) {
        setMigrating(true);
        setMigrationStatus(`Downloading ${imageUrls.length} photo${imageUrls.length === 1 ? '' : 's'}...`);
        try {
          const migRes = await fetch('/api/admin/migrate-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listingId, imageUrls }),
          });
          const migData = await migRes.json();
          if (migRes.ok) {
            setMigrationStatus(
              `Imported ${migData.migrated}/${imageUrls.length} photo${migData.migrated === 1 ? '' : 's'}.` +
                (migData.errors?.length ? ` (${migData.errors.length} failed)` : ''),
            );
            onImagesMigrated?.();
          } else {
            setMigrationStatus(`Photo import failed: ${migData.error || 'unknown'}`);
          }
        } catch (e) {
          setMigrationStatus(`Photo import error: ${e instanceof Error ? e.message : 'network'}`);
        } finally {
          setMigrating(false);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setUrl('');
        setMigrationStatus('');
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        <Sparkles className="w-4 h-4" />
        Import from Airbnb / Booking
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Import from Airbnb / Booking.com</h3>
            <p className="text-xs text-gray-500">Paste your listing URL to auto-fill the form</p>
          </div>
        </div>
        <button type="button" onClick={() => { setOpen(false); setError(''); setUrl(''); }}
          className="text-gray-400 hover:text-gray-600 text-sm">
          ✕
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); setSuccess(false); }}
            placeholder="https://www.airbnb.com/rooms/... or https://www.booking.com/hotel/..."
            className="w-full px-4 py-2.5 pr-10 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            disabled={loading}
          />
          {url && isValidUrl && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
        </div>
        <button
          type="button"
          onClick={handleImport}
          disabled={loading || !isValidUrl}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl transition-colors text-sm whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Extracting...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Import
            </>
          )}
        </button>
      </div>

      {/* Platform logos hint */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-gray-400">Supported:</span>
        <span className="text-xs font-medium text-[#FF5A5F]">Airbnb</span>
        <span className="text-xs text-gray-300">•</span>
        <span className="text-xs font-medium text-[#003580]">Booking.com</span>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>Data imported successfully! Review and save.</span>
        </div>
      )}

      {loading && !migrating && (
        <div className="mt-3 text-xs text-blue-600 animate-pulse">
          ⏳ Fetching page and extracting data with AI... This may take 5-10 seconds.
        </div>
      )}

      {migrating && (
        <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="animate-pulse">📸 {migrationStatus || 'Migrating photos to storage...'}</span>
        </div>
      )}

      {migrationStatus && !migrating && (
        <div className="mt-3 flex items-start gap-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-2">
          <span>📸 {migrationStatus}</span>
        </div>
      )}
    </div>
  );
}
