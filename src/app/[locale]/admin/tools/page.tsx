'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Wrench, ImageIcon, Loader2, CheckCircle, AlertCircle, Zap, Search, Sparkles, BarChart3, BookOpen, Play, SkipForward, Waves, Compass, Lightbulb, Landmark as LandmarkIcon, RefreshCw } from 'lucide-react';

interface ImageRecord {
  table: string;
  id: string;
  name: string;
  image_url: string;
  size?: number;
}

export default function AdminToolsPage() {
  const [scanning, setScanning] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [processed, setProcessed] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);

  async function scanImages() {
    setScanning(true);
    setImages([]);
    const supabase = createClient();
    const found: ImageRecord[] = [];

    // Scan all tables with image_url
    const tables = [
      { table: 'areas', nameField: 'name_el' },
      { table: 'beaches', nameField: 'name_el' },
      { table: 'restaurants', nameField: 'name_el' },
      { table: 'activities', nameField: 'name_el' },
      { table: 'blog_articles', nameField: 'title_el' },
    ];

    for (const t of tables) {
      const { data } = await supabase.from(t.table).select(`id, ${t.nameField}, image_url, image_optimized`).eq('image_optimized', false);
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any[]).forEach((row: any) => {
          const url = row.image_url as string;
          if (url && url.startsWith('http')) {
            found.push({
              table: t.table,
              id: row.id as string,
              name: row[t.nameField] as string || 'Unknown',
              image_url: url,
            });
          }
        });
      }
    }

    // Scan listing_images (only non-optimized)
    const { data: listingImgs } = await supabase.from('listing_images').select('id, image_url, listing_id, image_optimized').eq('image_optimized', false);
    if (listingImgs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (listingImgs as any[]).forEach((row: any) => {
        const url = row.image_url as string;
        if (url && url.startsWith('http')) {
          found.push({
            table: 'listing_images',
            id: row.id as string,
            name: `Listing image ${(row.id as string).slice(0, 8)}`,
            image_url: url,
          });
        }
      });
    }

    setImages(found);
    setScanning(false);
  }

  async function compressAll() {
    setCompressing(true);
    setProcessed(0);
    setResults([]);
    setTotalSaved(0);

    let saved = 0;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        // Fetch original image
        const response = await fetch(img.image_url);
        if (!response.ok) {
          setResults((prev) => [...prev, `❌ ${img.name}: Failed to fetch`]);
          continue;
        }

        const originalBlob = await response.blob();
        const originalSize = originalBlob.size;

        // Skip if already small (<200KB) - mark as optimized
        if (originalSize < 200 * 1024) {
          const supabase2 = createClient();
          await supabase2.from(img.table).update({ image_optimized: true }).eq('id', img.id);
          setResults((prev) => [...prev, `⏭️ ${img.name}: Already optimized (${formatSize(originalSize)})`]);
          setProcessed(i + 1);
          continue;
        }

        // Compress using canvas
        const bitmap = await createImageBitmap(originalBlob);
        const canvas = new OffscreenCanvas(
          Math.min(bitmap.width, 1200),
          Math.min(bitmap.height, 900)
        );

        // Calculate proportional size
        let w = bitmap.width;
        let h = bitmap.height;
        if (w > 1200 || h > 900) {
          const ratio = Math.min(1200 / w, 900 / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
          canvas.width = w;
          canvas.height = h;
        }

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(bitmap, 0, 0, w, h);
        const compressedBlob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.72 });

        const savedBytes = originalSize - compressedBlob.size;
        const savedPercent = Math.round((savedBytes / originalSize) * 100);

        // Only re-upload if we saved >20%
        if (savedPercent > 20) {
          const supabase = createClient();
          const filePath = `optimized/${img.table}/${Date.now()}-${i}.webp`;

          const { error: uploadError } = await supabase.storage
            .from('content-images')
            .upload(filePath, compressedBlob, { contentType: 'image/webp', upsert: true });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('content-images')
              .getPublicUrl(filePath);

            // Update DB record + mark as optimized
            if (img.table === 'listing_images') {
              await supabase.from('listing_images').update({ image_url: publicUrl, image_optimized: true }).eq('id', img.id);
            } else {
              await supabase.from(img.table).update({ image_url: publicUrl, image_optimized: true }).eq('id', img.id);
            }

            saved += savedBytes;
            setResults((prev) => [...prev, `✅ ${img.name}: ${formatSize(originalSize)} → ${formatSize(compressedBlob.size)} (-${savedPercent}%)`]);
          } else {
            setResults((prev) => [...prev, `❌ ${img.name}: Upload failed - ${uploadError.message}`]);
          }
        } else {
          // Mark as optimized even if not compressed (already good quality)
          const supabase3 = createClient();
          await supabase3.from(img.table).update({ image_optimized: true }).eq('id', img.id);
          setResults((prev) => [...prev, `⏭️ ${img.name}: Already good (only -${savedPercent}%) - marked`]);
        }
      } catch (err) {
        setResults((prev) => [...prev, `❌ ${img.name}: ${(err as Error).message}`]);
      }

      setProcessed(i + 1);
      setTotalSaved(saved);
    }

    setCompressing(false);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Wrench className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">SEO Tools</h1>
      </div>

      {/* Internal Links Tool */}
      <Link href="/admin/tools/internal-links" className="block bg-white border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">Internal Links Scanner</h2>
              <p className="text-sm text-gray-500">Σκανάρει articles για αναφορές σε παραλίες, εστιατόρια, αξιοθέατα → προτείνει links (SEO boost)</p>
            </div>
          </div>
          <span className="text-primary-600 text-sm font-medium">Open →</span>
        </div>
      </Link>

      {/* Photo Filler */}
      <Link href="/admin/tools/photos" className="block bg-white border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">Photo Filler</h2>
              <p className="text-sm text-gray-500">Βρίσκει σελίδες χωρίς φωτογραφία → αναζήτηση & προσθήκη μέσω Unsplash (δωρεάν)</p>
            </div>
          </div>
          <span className="text-primary-600 text-sm font-medium">Open →</span>
        </div>
      </Link>

      {/* Interlinking Score */}
      <Link href="/admin/tools/interlinking" className="block bg-white border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-md transition-shadow group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">Interlinking Score</h2>
              <p className="text-sm text-gray-500">Score ανά σελίδα (inbound/outbound links) + AI βελτίωση αδύναμων περιγραφών</p>
            </div>
          </div>
          <span className="text-primary-600 text-sm font-medium">Open →</span>
        </div>
      </Link>

      {/* Bulk Image Optimizer */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Bulk Image Optimizer</h2>
            <p className="text-sm text-gray-500">Σκανάρει όλες τις εικόνες και τις κάνει compress (max 1200x900, WebP, 82% quality)</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={scanImages} disabled={scanning || compressing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50">
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            1. Σκανάρισμα εικόνων
          </button>

          {images.length > 0 && (
            <button onClick={compressAll} disabled={compressing}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
              {compressing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              2. Compress όλες ({images.length})
            </button>
          )}
        </div>

        {/* Scan results */}
        {images.length > 0 && !compressing && processed === 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Βρέθηκαν {images.length} εικόνες:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['areas', 'beaches', 'restaurants', 'activities', 'blog_articles', 'listing_images'].map((t) => {
                const count = images.filter((i) => i.table === t).length;
                if (count === 0) return null;
                return (
                  <div key={t} className="text-sm text-gray-600">
                    <span className="font-medium">{t}:</span> {count}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress */}
        {(compressing || processed > 0) && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{processed}/{images.length} processed</span>
              {totalSaved > 0 && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Εξοικονόμηση: {formatSize(totalSaved)}
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${images.length > 0 ? (processed / images.length) * 100 : 0}%` }} />
            </div>
          </div>
        )}

        {/* Results log */}
        {results.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-4 max-h-80 overflow-y-auto font-mono text-xs">
            {results.map((r, i) => (
              <div key={i} className={`py-0.5 ${r.startsWith('✅') ? 'text-green-400' : r.startsWith('❌') ? 'text-red-400' : 'text-gray-400'}`}>
                {r}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Village Article Generator */}
      <VillageArticleGenerator />

      {/* Beach Article Generator */}
      <BeachArticleGenerator />

      {/* Topic Article Generator (Activities, Tips, Culture) */}
      <TopicArticleGenerator />

      {/* AI Bulk SEO Generator */}
      <BulkSEOGenerator />
    </div>
  );
}

/* ─── Village Article Generator ─── */
interface VillageStatus {
  village: string;
  slug: string;
  area: string;
  article_slug: string;
  has_article: boolean;
}

function VillageArticleGenerator() {
  const [loading, setLoading] = useState(false);
  const [villages, setVillages] = useState<VillageStatus[]>([]);
  const [generating, setGenerating] = useState<string | null>(null); // slug being generated
  const [batchRunning, setBatchRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);

  async function getToken() {
    const { createClient: cc } = await import('@/lib/supabase/client');
    const supabase = cc();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  }

  async function loadStatus() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/village-articles');
      const data = await res.json();
      setVillages(data.villages || []);
    } catch (err) {
      setResults(prev => [...prev, `Error loading status: ${(err as Error).message}`]);
    }
    setLoading(false);
  }

  async function generateOne(villageSlug: string) {
    setGenerating(villageSlug);
    const token = await getToken();
    try {
      const res = await fetch('/api/admin/village-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ village_slug: villageSlug }),
      });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch {
        setResults(prev => [...prev, `Error ${villageSlug}: Server timeout ή σφάλμα — δοκίμασε ξανά`]);
        setGenerating(null);
        return;
      }
      if (data.errors_detail?.length > 0) {
        setResults(prev => [...prev, `Error ${villageSlug}: ${data.errors_detail[0].error}`]);
      } else if (data.results?.length > 0) {
        const r = data.results[0];
        setResults(prev => [...prev, `${r.status === 'created' ? 'Created' : r.status === 'already_exists' ? 'Skipped (exists)' : r.status}: ${r.village}`]);
        setVillages(prev => prev.map(v => v.slug === villageSlug ? { ...v, has_article: true } : v));
      }
    } catch (err) {
      setResults(prev => [...prev, `Error ${villageSlug}: ${(err as Error).message}`]);
    }
    setGenerating(null);
  }

  async function generateAll() {
    const pending = villages.filter(v => !v.has_article);
    if (pending.length === 0) return;
    setBatchRunning(true);
    setProcessed(0);
    setTotal(pending.length);
    setResults([]);

    const token = await getToken();

    for (let i = 0; i < pending.length; i++) {
      const v = pending[i];
      setGenerating(v.slug);
      try {
        const res = await fetch('/api/admin/village-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ village_slug: v.slug }),
        });
        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch {
          setResults(prev => [...prev, `Error ${v.village}: Server timeout — παράλειψη`]);
          setProcessed(i + 1);
          continue;
        }
        if (data.errors_detail?.length > 0) {
          setResults(prev => [...prev, `Error ${v.village}: ${data.errors_detail[0].error}`]);
        } else if (data.results?.length > 0) {
          const r = data.results[0];
          setResults(prev => [...prev, `${r.status === 'created' ? 'Created' : r.status}: ${r.village}`]);
          setVillages(prev => prev.map(vv => vv.slug === v.slug ? { ...vv, has_article: true } : vv));
        }
      } catch (err) {
        setResults(prev => [...prev, `Error ${v.village}: ${(err as Error).message}`]);
      }
      setProcessed(i + 1);
      // 3 sec delay between villages to avoid rate limiting
      if (i < pending.length - 1) await new Promise(r => setTimeout(r, 3000));
    }

    setGenerating(null);
    setBatchRunning(false);
  }

  const withArticle = villages.filter(v => v.has_article).length;
  const withoutArticle = villages.filter(v => !v.has_article).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Village Article Generator</h2>
          <p className="text-sm text-gray-500">AI blog articles (7 languages) for each village with SEO optimization</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={loadStatus} disabled={loading || batchRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          1. Check Status
        </button>

        {withoutArticle > 0 && (
          <button onClick={generateAll} disabled={batchRunning || generating !== null}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {batchRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            2. Generate All ({withoutArticle})
          </button>
        )}
      </div>

      {/* Village grid */}
      {villages.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-gray-600">{villages.length} villages total</span>
            <span className="text-sm text-green-600 font-medium">{withArticle} with article</span>
            <span className="text-sm text-orange-600 font-medium">{withoutArticle} pending</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {villages.map(v => (
              <div key={v.slug}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${v.has_article ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center gap-2 min-w-0">
                  {v.has_article
                    ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  }
                  <span className="truncate font-medium text-gray-800">{v.village}</span>
                  <span className="text-xs text-gray-400">{v.area}</span>
                </div>
                {!v.has_article && (
                  <button
                    onClick={() => generateOne(v.slug)}
                    disabled={generating !== null || batchRunning}
                    className="ml-2 flex-shrink-0 px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-medium disabled:opacity-50">
                    {generating === v.slug ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {(batchRunning || (processed > 0 && total > 0)) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{processed}/{total} processed</span>
            {generating && <span className="text-xs text-teal-600 animate-pulse">Generating: {generating}...</span>}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${total > 0 ? (processed / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Results log */}
      {results.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 max-h-60 overflow-y-auto font-mono text-xs">
          {results.map((r, i) => (
            <div key={i} className={`py-0.5 ${r.startsWith('Created') ? 'text-green-400' : r.startsWith('Skipped') ? 'text-yellow-400' : r.startsWith('Error') ? 'text-red-400' : 'text-gray-400'}`}>
              {r}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">Each village ~30s (4 OpenAI calls). Cost ~$0.01/village. Sent one-by-one to avoid Vercel timeout.</p>
    </div>
  );
}

/* ─── Beach Article Generator ─── */
interface BeachStatus {
  beach: string;
  slug: string;
  area: string;
  rating: number;
  features: string[];
  article_slug: string;
  has_article: boolean;
}

function BeachArticleGenerator() {
  const [loading, setLoading] = useState(false);
  const [beaches, setBeaches] = useState<BeachStatus[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);

  async function getToken() {
    const { createClient: cc } = await import('@/lib/supabase/client');
    const supabase = cc();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  }

  async function loadStatus() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/beach-articles');
      const data = await res.json();
      setBeaches(data.beaches || []);
    } catch (err) {
      setResults(prev => [...prev, `Error loading status: ${(err as Error).message}`]);
    }
    setLoading(false);
  }

  async function generateOne(beachSlug: string) {
    setGenerating(beachSlug);
    const token = await getToken();
    try {
      const res = await fetch('/api/admin/beach-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ beach_slug: beachSlug }),
      });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch {
        setResults(prev => [...prev, `Error ${beachSlug}: Server timeout ή σφάλμα — δοκίμασε ξανά`]);
        setGenerating(null);
        return;
      }
      if (data.errors_detail?.length > 0) {
        setResults(prev => [...prev, `Error ${beachSlug}: ${data.errors_detail[0].error}`]);
      } else if (data.results?.length > 0) {
        const r = data.results[0];
        setResults(prev => [...prev, `${r.status === 'created' ? 'Created' : r.status === 'already_exists' ? 'Skipped (exists)' : r.status}: ${r.beach}`]);
        setBeaches(prev => prev.map(b => b.slug === beachSlug ? { ...b, has_article: true } : b));
      }
    } catch (err) {
      setResults(prev => [...prev, `Error ${beachSlug}: ${(err as Error).message}`]);
    }
    setGenerating(null);
  }

  async function generateAll() {
    const pending = beaches.filter(b => !b.has_article);
    if (pending.length === 0) return;
    setBatchRunning(true);
    setProcessed(0);
    setTotal(pending.length);
    setResults([]);

    const token = await getToken();

    for (let i = 0; i < pending.length; i++) {
      const b = pending[i];
      setGenerating(b.slug);
      try {
        const res = await fetch('/api/admin/beach-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ beach_slug: b.slug }),
        });
        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch {
          setResults(prev => [...prev, `Error ${b.beach}: Server timeout — παράλειψη`]);
          setProcessed(i + 1);
          continue;
        }
        if (data.errors_detail?.length > 0) {
          setResults(prev => [...prev, `Error ${b.beach}: ${data.errors_detail[0].error}`]);
        } else if (data.results?.length > 0) {
          const r = data.results[0];
          setResults(prev => [...prev, `${r.status === 'created' ? 'Created' : r.status}: ${r.beach}`]);
          setBeaches(prev => prev.map(bb => bb.slug === b.slug ? { ...bb, has_article: true } : bb));
        }
      } catch (err) {
        setResults(prev => [...prev, `Error ${b.beach}: ${(err as Error).message}`]);
      }
      setProcessed(i + 1);
      if (i < pending.length - 1) await new Promise(r => setTimeout(r, 3000));
    }

    setGenerating(null);
    setBatchRunning(false);
  }

  const withArticle = beaches.filter(b => b.has_article).length;
  const withoutArticle = beaches.filter(b => !b.has_article).length;

  const FEATURE_ICONS: Record<string, string> = {
    sandy: '🏖️', organized: '🏗️', free: '🆓', secluded: '🌿', shallowWater: '👶',
    waterSports: '🏄', blueFlag: '🏳️', nudist: '🔞', accessible: '♿', parking: '🅿️',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
          <Waves className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Beach Article Generator</h2>
          <p className="text-sm text-gray-500">AI blog articles (7 languages) for each beach — nature only, no ads</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={loadStatus} disabled={loading || batchRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          1. Check Status
        </button>

        {withoutArticle > 0 && (
          <button onClick={generateAll} disabled={batchRunning || generating !== null}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {batchRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            2. Generate All ({withoutArticle})
          </button>
        )}
      </div>

      {/* Beach grid */}
      {beaches.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-gray-600">{beaches.length} beaches total</span>
            <span className="text-sm text-green-600 font-medium">{withArticle} with article</span>
            <span className="text-sm text-orange-600 font-medium">{withoutArticle} pending</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {beaches.map(b => (
              <div key={b.slug}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${b.has_article ? 'bg-green-50 border-green-200' : 'bg-cyan-50 border-cyan-200'}`}>
                <div className="flex items-center gap-2 min-w-0">
                  {b.has_article
                    ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <Waves className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  }
                  <div className="min-w-0">
                    <span className="truncate font-medium text-gray-800 block">{b.beach}</span>
                    <span className="text-[10px] text-gray-400">{b.area} · ⭐{b.rating} · {(b.features || []).slice(0, 3).map(f => FEATURE_ICONS[f] || '').join('')}</span>
                  </div>
                </div>
                {!b.has_article && (
                  <button
                    onClick={() => generateOne(b.slug)}
                    disabled={generating !== null || batchRunning}
                    className="ml-2 flex-shrink-0 px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-medium disabled:opacity-50">
                    {generating === b.slug ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {(batchRunning || (processed > 0 && total > 0)) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{processed}/{total} processed</span>
            {generating && <span className="text-xs text-cyan-600 animate-pulse">Generating: {generating}...</span>}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-cyan-500 rounded-full transition-all"
              style={{ width: `${total > 0 ? (processed / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Results log */}
      {results.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 max-h-60 overflow-y-auto font-mono text-xs">
          {results.map((r, i) => (
            <div key={i} className={`py-0.5 ${r.startsWith('Created') ? 'text-green-400' : r.startsWith('Skipped') ? 'text-yellow-400' : r.startsWith('Error') ? 'text-red-400' : 'text-gray-400'}`}>
              {r}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">Each beach ~40s (5 AI calls incl. polish). Cost ~$0.015/beach. No business ads — nature only.</p>
    </div>
  );
}

/* ─── Topic Article Generator (Activities, Tips, Culture) ─── */
interface TopicStatus {
  topic: string;
  slug: string;
  article_slug: string;
  has_article: boolean;
}
interface CategoryStatus {
  label: string;
  total: number;
  with_article: number;
  without_article: number;
  topics: TopicStatus[];
}

const CATEGORY_CONFIG: Record<string, { icon: typeof Compass; color: string; bgColor: string }> = {
  activities: { icon: Compass, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  tips: { icon: Lightbulb, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  culture: { icon: LandmarkIcon, color: 'text-purple-600', bgColor: 'bg-purple-100' },
};

function TopicArticleGenerator() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Record<string, CategoryStatus>>({});
  const [activeTab, setActiveTab] = useState<string>('activities');
  const [generating, setGenerating] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function getToken() {
    const { createClient: cc } = await import('@/lib/supabase/client');
    const supabase = cc();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  }

  async function loadStatus() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/topic-articles');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setResults(prev => [...prev, `Error: ${(err as Error).message}`]);
    }
    setLoading(false);
  }

  async function suggestTopics() {
    setSuggesting(true);
    setSuggestions([]);
    try {
      const catLabel = categories[activeTab]?.label || activeTab;
      const existing = (categories[activeTab]?.topics || []).map(t => t.topic).join(', ');
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_topics',
          category: activeTab,
          existing,
          title: catLabel,
          description: `Suggest 5 new blog article topics for category "${catLabel}" about Halkidiki, Greece. Existing: ${existing}. Return JSON: { "suggestions": ["topic1", "topic2", ...] }`,
        }),
      });
      const data = await res.json();
      // Try parsing suggestions from AI response
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      } else if (data.formatted) {
        try { setSuggestions(JSON.parse(data.formatted).suggestions || []); } catch { setSuggestions([]); }
      }
    } catch {
      // Fallback: direct OpenAI call through AI endpoint
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'format_content',
            content: `Suggest 5 NEW unique blog article topics for "${categories[activeTab]?.label || activeTab}" about Halkidiki, Greece tourism. Existing topics: ${(categories[activeTab]?.topics || []).map(t => t.topic).join(', ')}. Return ONLY a JSON array of 5 topic titles in Greek, like: ["Topic 1", "Topic 2", ...]`,
            lang: 'el',
          }),
        });
        const data = await res.json();
        if (data.formatted) {
          const parsed = JSON.parse(data.formatted.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
          setSuggestions(Array.isArray(parsed) ? parsed : parsed.suggestions || []);
        }
      } catch {}
    }
    setSuggesting(false);
  }

  async function generateOne(topicSlug: string) {
    setGenerating(topicSlug);
    const token = await getToken();
    try {
      const res = await fetch('/api/admin/topic-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ category: activeTab, topic_slug: topicSlug }),
      });
      const text = await res.text();
      let data: any;
      try { data = JSON.parse(text); } catch {
        setResults(prev => [...prev, `Error ${topicSlug}: Server timeout ή σφάλμα — δοκίμασε ξανά`]);
        setGenerating(null);
        return;
      }
      if (data.errors_detail?.length > 0) {
        setResults(prev => [...prev, `Error: ${data.errors_detail[0].error}`]);
      } else if (data.results?.length > 0) {
        const r = data.results[0];
        setResults(prev => [...prev, `${r.status === 'created' ? 'Created' : r.status}: ${r.topic}`]);
        setCategories(prev => {
          const cat = { ...prev[activeTab] };
          cat.topics = cat.topics.map(t => t.slug === topicSlug ? { ...t, has_article: true } : t);
          cat.with_article = cat.topics.filter(t => t.has_article).length;
          cat.without_article = cat.topics.filter(t => !t.has_article).length;
          return { ...prev, [activeTab]: cat };
        });
      }
    } catch (err) {
      setResults(prev => [...prev, `Error: ${(err as Error).message}`]);
    }
    setGenerating(null);
  }

  async function generateAll() {
    const pending = (categories[activeTab]?.topics || []).filter(t => !t.has_article);
    if (pending.length === 0) return;
    setBatchRunning(true);
    setProcessed(0);
    setTotal(pending.length);
    setResults([]);
    const token = await getToken();

    for (let i = 0; i < pending.length; i++) {
      const t = pending[i];
      setGenerating(t.slug);
      try {
        const res = await fetch('/api/admin/topic-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ category: activeTab, topic_slug: t.slug }),
        });
        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch {
          setResults(prev => [...prev, `Error ${t.topic}: Server timeout — παράλειψη`]);
          setProcessed(i + 1);
          continue;
        }
        if (data.errors_detail?.length > 0) {
          setResults(prev => [...prev, `Error ${t.topic}: ${data.errors_detail[0].error}`]);
        } else if (data.results?.length > 0) {
          const r = data.results[0];
          setResults(prev => [...prev, `${r.status === 'created' ? 'Created' : r.status}: ${r.topic}`]);
          setCategories(prev => {
            const cat = { ...prev[activeTab] };
            cat.topics = cat.topics.map(tt => tt.slug === t.slug ? { ...tt, has_article: true } : tt);
            cat.with_article = cat.topics.filter(tt => tt.has_article).length;
            cat.without_article = cat.topics.filter(tt => !tt.has_article).length;
            return { ...prev, [activeTab]: cat };
          });
        }
      } catch (err) {
        setResults(prev => [...prev, `Error ${t.topic}: ${(err as Error).message}`]);
      }
      setProcessed(i + 1);
      if (i < pending.length - 1) await new Promise(r => setTimeout(r, 3000));
    }
    setGenerating(null);
    setBatchRunning(false);
  }

  const currentCat = categories[activeTab];
  const pending = currentCat?.without_article || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-100 via-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
          <Compass className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Topic Article Generator</h2>
          <p className="text-sm text-gray-500">Δραστηριότητες, Συμβουλές Ταξιδιού, Πολιτισμός — AI blog articles σε 7 γλώσσες</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        <button onClick={loadStatus} disabled={loading || batchRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          1. Check Status
        </button>
        {pending > 0 && (
          <button onClick={generateAll} disabled={batchRunning || generating !== null}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {batchRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            2. Generate All ({pending})
          </button>
        )}
        {Object.keys(categories).length > 0 && (
          <button onClick={suggestTopics} disabled={suggesting || batchRunning}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium disabled:opacity-50">
            {suggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            AI Suggest Topics
          </button>
        )}
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-bold text-purple-800 mb-2">AI Προτάσεις νέων θεμάτων ({categories[activeTab]?.label}):</h4>
          <ul className="space-y-1">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-purple-700 flex items-center gap-2">
                <Lightbulb className="w-3 h-3 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
          <p className="text-xs text-purple-500 mt-2">Πρόσθεσε αυτά τα θέματα στο API endpoint για να τα δημιουργήσεις.</p>
        </div>
      )}

      {/* Category tabs */}
      {Object.keys(categories).length > 0 && (
        <div className="flex gap-2 mb-4">
          {Object.entries(categories).map(([key, cat]) => {
            const cfg = CATEGORY_CONFIG[key] || CATEGORY_CONFIG.activities;
            const Icon = cfg.icon;
            return (
              <button key={key} onClick={() => { setActiveTab(key); setSuggestions([]); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === key ? `${cfg.bgColor} ${cfg.color} ring-2 ring-offset-1 ring-current` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <Icon className="w-4 h-4" />
                {cat.label}
                <span className="text-xs opacity-70">({cat.without_article}/{cat.total})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Topic grid */}
      {currentCat && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto mb-4">
          {currentCat.topics.map(t => (
            <div key={t.slug}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${
                t.has_article ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="flex items-center gap-2 min-w-0">
                {t.has_article
                  ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  : <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                }
                <span className="truncate font-medium text-gray-800">{t.topic}</span>
              </div>
              {!t.has_article && (
                <button onClick={() => generateOne(t.slug)}
                  disabled={generating !== null || batchRunning}
                  className="ml-2 flex-shrink-0 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium disabled:opacity-50">
                  {generating === t.slug ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      {(batchRunning || (processed > 0 && total > 0)) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{processed}/{total} processed</span>
            {generating && <span className="text-xs text-amber-600 animate-pulse">Generating: {generating}...</span>}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${total > 0 ? (processed / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Results log */}
      {results.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 max-h-60 overflow-y-auto font-mono text-xs">
          {results.map((r, i) => (
            <div key={i} className={`py-0.5 ${r.startsWith('Created') ? 'text-green-400' : r.startsWith('Skipped') ? 'text-yellow-400' : r.startsWith('Error') ? 'text-red-400' : 'text-gray-400'}`}>
              {r}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">10 topics per category (30 total). ~40s each, ~$0.015/article. Markdown format with auto-links.</p>
    </div>
  );
}

interface MissingRecord {
  table: string;
  id: string;
  name: string;
  title_el: string;
  description_el: string;
  location: string;
  missing: string[]; // what's missing: 'meta_title', 'meta_desc', 'translations', 'image_alt'
}

function BulkSEOGenerator() {
  const [scanning, setScanning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [missing, setMissing] = useState<MissingRecord[]>([]);
  const [seoProcessed, setSeoProcessed] = useState(0);
  const [seoResults, setSeoResults] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  async function scanMissingSEO() {
    setScanning(true);
    setMissing([]);
    const supabase = createClient();
    const found: typeof missing = [];

    const tables = [
      { table: 'areas', titleField: 'name_el', descField: 'description_el', locField: 'name_en', transField: 'name_en' },
      { table: 'beaches', titleField: 'name_el', descField: 'description_el', locField: 'location_name', transField: 'name_en' },
      { table: 'restaurants', titleField: 'name_el', descField: 'description_el', locField: 'location_name', transField: 'name_en' },
      { table: 'activities', titleField: 'name_el', descField: 'description_el', locField: 'location_name', transField: 'name_en' },
      { table: 'blog_articles', titleField: 'title_el', descField: 'excerpt_el', locField: 'category', transField: 'title_en' },
      { table: 'listings', titleField: 'title_el', descField: 'description_el', locField: 'location_name', transField: 'title_en' },
      { table: 'villages', titleField: 'name_el', descField: 'description_el', locField: 'name_en', transField: 'name_en' },
    ];

    for (const t of tables) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await supabase.from(t.table).select(`id, ${t.titleField}, ${t.descField}, ${t.locField}, ${t.transField}, meta_title_el, meta_title_en, meta_title_de, meta_description_el, image_alt`);
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any[]).forEach((row: any) => {
          const hasTitle = row[t.titleField] && row[t.titleField].length > 0;
          if (!hasTitle) return;

          const missingItems: string[] = [];
          if (!row.meta_title_el) missingItems.push('Meta Title EL');
          if (!row.meta_title_en) missingItems.push('Meta Title EN');
          if (!row.meta_title_de) missingItems.push('Meta Title DE');
          if (!row.meta_description_el) missingItems.push('Meta Desc EL');
          if (!row[t.transField]) missingItems.push('Translation EN');
          if (!row.image_alt) missingItems.push('Image Alt');

          if (missingItems.length > 0) {
            found.push({
              table: t.table,
              id: row.id,
              name: row[t.titleField] || 'Unknown',
              title_el: row[t.titleField] || '',
              description_el: row[t.descField] || '',
              location: row[t.locField] || 'Halkidiki',
              missing: missingItems,
            });
          }
        });
      }
    }

    setMissing(found);
    setScanning(false);
  }

  async function generateAll() {
    setGenerating(true);
    setSeoProcessed(0);
    setSeoResults([]);

    for (let i = 0; i < missing.length; i++) {
      const item = missing[i];
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'full_auto',
            title: item.title_el,
            description: item.description_el,
            category: item.table,
            location: item.location,
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        // Build update object
        const updateObj: Record<string, string> = {
          meta_title_el: data.seo.meta_title_el,
          meta_title_en: data.seo.meta_title_en,
          meta_title_de: data.seo.meta_title_de,
          meta_title_bg: data.seo.meta_title_bg,
          meta_title_ru: data.seo.meta_title_ru,
          meta_title_ro: data.seo.meta_title_ro,
          meta_title_sr: data.seo.meta_title_sr || '',
          meta_description_el: data.seo.meta_description_el,
          meta_description_en: data.seo.meta_description_en,
          meta_description_de: data.seo.meta_description_de,
          meta_description_bg: data.seo.meta_description_bg,
          meta_description_ru: data.seo.meta_description_ru,
          meta_description_ro: data.seo.meta_description_ro,
          meta_description_sr: data.seo.meta_description_sr || '',
          image_alt: data.seo.image_alt || '',
        };

        // Add translations based on table (7 languages)
        if (item.table === 'blog_articles') {
          updateObj.title_en = data.translations.title_en;
          updateObj.title_de = data.translations.title_de;
          updateObj.title_bg = data.translations.title_bg;
          updateObj.title_ru = data.translations.title_ru;
          updateObj.title_ro = data.translations.title_ro;
          updateObj.title_sr = data.translations.title_sr || '';
          updateObj.excerpt_en = data.translations.description_en;
          updateObj.excerpt_de = data.translations.description_de;
          updateObj.excerpt_bg = data.translations.description_bg;
          updateObj.excerpt_ru = data.translations.description_ru;
          updateObj.excerpt_ro = data.translations.description_ro;
          updateObj.excerpt_sr = data.translations.description_sr || '';
        } else if (item.table === 'listings') {
          updateObj.title_en = data.translations.title_en;
          updateObj.title_de = data.translations.title_de;
          updateObj.title_bg = data.translations.title_bg;
          updateObj.title_ru = data.translations.title_ru;
          updateObj.title_ro = data.translations.title_ro;
          updateObj.title_sr = data.translations.title_sr || '';
          updateObj.description_en = data.translations.description_en;
          updateObj.description_de = data.translations.description_de;
          updateObj.description_bg = data.translations.description_bg;
          updateObj.description_ru = data.translations.description_ru;
          updateObj.description_ro = data.translations.description_ro;
          updateObj.description_sr = data.translations.description_sr || '';
        } else {
          updateObj.name_en = data.translations.title_en;
          updateObj.name_de = data.translations.title_de;
          updateObj.name_bg = data.translations.title_bg;
          updateObj.name_ru = data.translations.title_ru;
          updateObj.name_ro = data.translations.title_ro;
          updateObj.name_sr = data.translations.title_sr || '';
          updateObj.description_en = data.translations.description_en;
          updateObj.description_de = data.translations.description_de;
          updateObj.description_bg = data.translations.description_bg;
          updateObj.description_ru = data.translations.description_ru;
          updateObj.description_ro = data.translations.description_ro;
          updateObj.description_sr = data.translations.description_sr || '';
        }

        const supabase = createClient();
        const { error } = await supabase.from(item.table).update(updateObj).eq('id', item.id);

        if (error) {
          setSeoResults((prev) => [...prev, `❌ ${item.name}: ${error.message}`]);
        } else {
          setSeoResults((prev) => [...prev, `✅ ${item.name} (${item.table}): SEO + μεταφράσεις σε 6 γλώσσες`]);
        }
      } catch (err) {
        setSeoResults((prev) => [...prev, `❌ ${item.name}: ${(err as Error).message}`]);
      }

      setSeoProcessed(i + 1);

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }

    setGenerating(false);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI Bulk SEO + Μεταφράσεις</h2>
          <p className="text-sm text-gray-500">Βρίσκει records χωρίς SEO meta tags και τα δημιουργεί μαζικά με AI (+ μεταφράσεις σε 6 γλώσσες)</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={scanMissingSEO} disabled={scanning || generating}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50">
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          1. Σκανάρισμα (χωρίς SEO)
        </button>

        {missing.length > 0 && (
          <button onClick={generateAll} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            2. AI Generate ({missing.length} records)
          </button>
        )}
      </div>

      {/* Scan results */}
      {missing.length > 0 && !generating && seoProcessed === 0 && (
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-purple-700">Βρέθηκαν {missing.length} records με ελλιπές SEO:</p>
            <button onClick={() => setShowDetails(!showDetails)} className="text-xs text-purple-600 hover:underline">
              {showDetails ? 'Απόκρυψη' : 'Αναλυτικά'}
            </button>
          </div>

          {/* Summary by table */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {['areas', 'beaches', 'restaurants', 'activities', 'blog_articles', 'listings'].map((t) => {
              const count = missing.filter((m) => m.table === t).length;
              if (count === 0) return null;
              return <div key={t} className="text-sm text-purple-600"><span className="font-medium">{t}:</span> {count}</div>;
            })}
          </div>

          {/* Detailed breakdown */}
          {showDetails && (
            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
              {missing.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{item.table}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.missing.map((m, midx) => (
                      <span key={midx} className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-purple-500 mt-3">Εκτιμώμενο κόστος: ~${(missing.length * 0.002).toFixed(3)} (GPT-4o-mini)</p>
        </div>
      )}

      {scanning && missing.length === 0 && !generating && (
        <p className="text-sm text-gray-500">Σκανάρισμα...</p>
      )}

      {!scanning && missing.length === 0 && seoProcessed === 0 && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />Όλα τα records έχουν πλήρες SEO!
        </p>
      )}

      {/* Progress */}
      {(generating || seoProcessed > 0) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{seoProcessed}/{missing.length} processed</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${missing.length > 0 ? (seoProcessed / missing.length) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Results log */}
      {seoResults.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 max-h-80 overflow-y-auto font-mono text-xs">
          {seoResults.map((r, i) => (
            <div key={i} className={`py-0.5 ${r.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{r}</div>
          ))}
        </div>
      )}
    </div>
  );
}
