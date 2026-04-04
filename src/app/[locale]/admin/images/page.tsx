'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ImageIcon, Loader2, Zap, CheckCircle, AlertTriangle, Download } from 'lucide-react';

interface ImageRecord {
  table: string;
  id: string;
  name: string;
  image_url: string;
  optimized: boolean;
  size: number | null;
  loading: boolean;
  compressing: boolean;
  result: string;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'size' | 'name' | 'table'>('size');
  const [filterTable, setFilterTable] = useState('');

  useEffect(() => { scanImages(); }, []);

  async function scanImages() {
    setLoading(true);
    const supabase = createClient();
    const found: ImageRecord[] = [];

    const tables = [
      { table: 'areas', nameField: 'name_el' },
      { table: 'beaches', nameField: 'name_el' },
      { table: 'restaurants', nameField: 'name_el' },
      { table: 'activities', nameField: 'name_el' },
      { table: 'blog_articles', nameField: 'title_el' },
    ];

    for (const t of tables) {
      const { data } = await supabase.from(t.table).select(`id, ${t.nameField}, image_url, image_optimized`);
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any[]).forEach((row: any) => {
          const url = row.image_url as string;
          if (url && url.startsWith('http')) {
            found.push({
              table: t.table,
              id: row.id,
              name: row[t.nameField] || 'Unknown',
              image_url: url,
              optimized: row.image_optimized || false,
              size: null,
              loading: false,
              compressing: false,
              result: '',
            });
          }
        });
      }
    }

    // Listing images
    const { data: listingImgs } = await supabase.from('listing_images').select('id, image_url, image_optimized, listing_id');
    if (listingImgs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (listingImgs as any[]).forEach((row: any) => {
        const url = row.image_url as string;
        if (url && url.startsWith('http')) {
          found.push({
            table: 'listing_images',
            id: row.id,
            name: `Listing ${(row.listing_id as string).slice(0, 8)}`,
            image_url: url,
            optimized: row.image_optimized || false,
            size: null,
            loading: false,
            compressing: false,
            result: '',
          });
        }
      });
    }

    setImages(found);
    setLoading(false);

    // Fetch sizes in background
    found.forEach((img, idx) => {
      fetch(img.image_url, { method: 'HEAD' }).then(r => {
        const size = r.headers.get('content-length');
        if (size) {
          setImages(prev => {
            const next = [...prev];
            if (next[idx]) next[idx] = { ...next[idx], size: parseInt(size) };
            return next;
          });
        }
      }).catch(() => {});
    });
  }

  async function compressOne(idx: number) {
    const img = images[idx];
    setImages(prev => { const n = [...prev]; n[idx] = { ...n[idx], compressing: true, result: '' }; return n; });

    try {
      const response = await fetch(img.image_url);
      const originalBlob = await response.blob();
      const originalSize = originalBlob.size;

      if (originalSize < 100 * 1024) {
        const supabase = createClient();
        await supabase.from(img.table).update({ image_optimized: true }).eq('id', img.id);
        setImages(prev => { const n = [...prev]; n[idx] = { ...n[idx], compressing: false, optimized: true, result: 'Already small' }; return n; });
        return;
      }

      const bitmap = await createImageBitmap(originalBlob);
      let w = bitmap.width, h = bitmap.height;

      // More aggressive for very large images
      const maxW = originalSize > 2 * 1024 * 1024 ? 1000 : 1200;
      const maxH = originalSize > 2 * 1024 * 1024 ? 667 : 800;
      const quality = originalSize > 3 * 1024 * 1024 ? 0.65 : 0.72;

      if (w > maxW || h > maxH) {
        const ratio = Math.min(maxW / w, maxH / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(bitmap, 0, 0, w, h);
      const compressedBlob = await canvas.convertToBlob({ type: 'image/webp', quality });

      const savedPercent = Math.round((1 - compressedBlob.size / originalSize) * 100);

      if (savedPercent > 15) {
        const supabase = createClient();
        const filePath = `optimized/${img.table}/${Date.now()}.webp`;

        // Check compressed size
        const compressedSizeMB = (compressedBlob.size / (1024 * 1024)).toFixed(1);
        if (compressedBlob.size > 5 * 1024 * 1024) {
          setImages(prev => { const n = [...prev]; n[idx] = { ...n[idx], compressing: false, result: `Still too large after compression: ${compressedSizeMB}MB` }; return n; });
          return;
        }

        const { error } = await supabase.storage.from('content-images').upload(filePath, compressedBlob, { contentType: 'image/webp', upsert: true });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('content-images').getPublicUrl(filePath);
          const { error: dbError } = await supabase.from(img.table).update({ image_url: publicUrl, image_optimized: true }).eq('id', img.id);
          if (dbError) {
            setImages(prev => { const n = [...prev]; n[idx] = { ...n[idx], compressing: false, result: `Compressed OK but DB save failed: ${dbError.message}` }; return n; });
            return;
          }
          setImages(prev => {
            const n = [...prev];
            n[idx] = { ...n[idx], compressing: false, optimized: true, size: compressedBlob.size, image_url: publicUrl, result: `${formatSize(originalSize)} → ${formatSize(compressedBlob.size)} (-${savedPercent}%)` };
            return n;
          });
          return;
        } else {
          // Upload failed - show error
          setImages(prev => { const n = [...prev]; n[idx] = { ...n[idx], compressing: false, result: `Upload error: ${error.message}` }; return n; });
          return;
        }
      }

      const supabase = createClient();
      await supabase.from(img.table).update({ image_optimized: true }).eq('id', img.id);
      setImages(prev => { const n = [...prev]; n[idx] = { ...n[idx], compressing: false, optimized: true, result: `Already good (-${savedPercent}%)` }; return n; });
    } catch (err) {
      setImages(prev => { const n = [...prev]; n[idx] = { ...n[idx], compressing: false, result: `Error: ${(err as Error).message}` }; return n; });
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function getSizeColor(size: number | null): string {
    if (!size) return 'text-gray-400';
    if (size < 200 * 1024) return 'text-green-600';
    if (size < 500 * 1024) return 'text-amber-600';
    return 'text-red-600 font-semibold';
  }

  const filtered = images.filter(img => !filterTable || img.table === filterTable);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'size') return (b.size || 0) - (a.size || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return a.table.localeCompare(b.table);
  });

  const totalSize = images.reduce((sum, img) => sum + (img.size || 0), 0);
  const largeCount = images.filter(img => img.size && img.size > 500 * 1024).length;
  const tables = [...new Set(images.map(img => img.table))];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Images ({images.length})</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">Total: <strong>{formatSize(totalSize)}</strong></span>
          {largeCount > 0 && (
            <span className="text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />{largeCount} large (&gt;500KB)
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select value={filterTable} onChange={(e) => setFilterTable(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">All tables</option>
          {tables.map(t => <option key={t} value={t}>{t} ({images.filter(i => i.table === t).length})</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="size">Sort by size (largest first)</option>
          <option value="name">Sort by name</option>
          <option value="table">Sort by table</option>
        </select>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sorted.map((img, idx) => {
          const realIdx = images.indexOf(img);
          return (
            <div key={`${img.table}-${img.id}`} className={`bg-white border rounded-xl overflow-hidden ${
              img.size && img.size > 500 * 1024 ? 'border-red-300' : img.optimized ? 'border-green-200' : 'border-gray-200'
            }`}>
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-gray-100 relative">
                <img src={img.image_url} alt={img.name} loading="lazy" className="w-full h-full object-cover" />
                {img.optimized && (
                  <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                )}
                {img.size && img.size > 500 * 1024 && (
                  <div className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-0.5">
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2">
                <div className="text-xs font-medium text-gray-900 truncate">{img.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{img.table}</span>
                  <span className={`text-xs ${getSizeColor(img.size)}`}>
                    {img.size ? formatSize(img.size) : '...'}
                  </span>
                </div>

                {img.result && (
                  <div className="text-[10px] text-green-600 mt-1 truncate">{img.result}</div>
                )}

                {/* Compress button */}
                {!img.optimized && (
                  <button onClick={() => compressOne(realIdx)} disabled={img.compressing}
                    className="w-full mt-2 flex items-center justify-center gap-1 px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-[10px] font-medium transition-colors disabled:opacity-50">
                    {img.compressing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                    {img.compressing ? 'Compressing...' : 'Compress'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
