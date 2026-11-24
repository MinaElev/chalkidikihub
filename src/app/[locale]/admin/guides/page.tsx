'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, BookOpen, Check, ExternalLink, ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/image-utils';

/**
 * Admin → Guides: the cover photo and the three recommended articles of each
 * guide page. The guide texts themselves live in the code and are not edited
 * here. Photos go to public Storage; the row is saved through
 * /api/admin/guides (superadmin only), which also refreshes the guide pages.
 */
type Guide = { slug: string; title: string; image: string | null; articles: string[] };
type Article = { slug: string; title: string };

const MAX_ARTICLES = 3;

/** Compresses the photo, stores it in public Storage and returns its URL. */
async function uploadCover(slug: string, file: File): Promise<string> {
  let blob: Blob = file;
  try {
    blob = (await compressImage(file, { maxWidth: 1600, maxHeight: 1000, quality: 0.75, format: 'webp' })).blob;
  } catch {
    // Not compressible in this browser: upload the original.
  }
  const supabase = createClient();
  const path = `guides/${slug}/${Date.now()}.webp`;
  const { error } = await supabase.storage.from('listing-images').upload(path, blob, { cacheControl: '31536000', contentType: blob.type || 'image/webp', upsert: true });
  if (error) throw new Error(error.message);
  return supabase.storage.from('listing-images').getPublicUrl(path).data.publicUrl;
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tableMissing, setTableMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/guides');
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setError(json.error || 'Δεν φορτώθηκαν οι οδηγοί.');
      else { setGuides(json.guides); setArticles(json.articles); setTableMissing(json.tableMissing); }
      setLoading(false);
    })();
  }, []);

  async function save(next: Guide) {
    setBusy(next.slug); setError(''); setSaved(null);
    const res = await fetch('/api/admin/guides', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: next.slug, image: next.image, articles: next.articles }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) setError(json.error || 'Η αποθήκευση απέτυχε.');
    else {
      setGuides((list) => list.map((g) => (g.slug === next.slug ? { ...g, image: json.image, articles: json.articles } : g)));
      setSaved(next.slug);
    }
    setBusy(null);
  }

  async function upload(guide: Guide, file: File) {
    setBusy(guide.slug); setError(''); setSaved(null);
    try {
      await save({ ...guide, image: await uploadCover(guide.slug, file) });
    } catch (e) {
      setError(`Το ανέβασμα απέτυχε: ${e instanceof Error ? e.message : 'άγνωστο σφάλμα'}`);
      setBusy(null);
    }
  }

  const setArticle = (guide: Guide, index: number, slug: string) => {
    const next = [...guide.articles];
    if (slug) next[index] = slug; else next.splice(index, 1);
    save({ ...guide, articles: [...new Set(next.filter(Boolean))] });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Οδηγοί ({guides.length})</h1>
      </div>
      <p className="mb-6 max-w-3xl text-sm text-gray-600">
        Φωτογραφία εξωφύλλου και έως {MAX_ARTICLES} προτεινόμενα άρθρα για κάθε οδηγό. Τα κείμενα των οδηγών δεν αλλάζουν από εδώ.
        Όπου δεν έχετε ανεβάσει φωτογραφία, η σελίδα δείχνει μια προσωρινή φωτογραφία παραλίας. Όπου δεν έχετε διαλέξει άρθρα, δείχνει τα πιο πρόσφατα.
      </p>

      {tableMissing && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Ο πίνακας <code>guide_media</code> δεν υπάρχει ακόμα στη βάση, οπότε τίποτα δεν μπορεί να αποθηκευτεί.
            Τρέξτε μία φορά το αρχείο <code>scripts/sql/2026-11-guide-media.sql</code> στο SQL editor του Supabase και ανανεώστε τη σελίδα.
          </span>
        </div>
      )}
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <ul className="space-y-4">
        {guides.map((g) => {
          const working = busy === g.slug;
          return (
            <li key={g.slug} className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[14rem_1fr]">
              <div>
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
                  {g.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin preview of a Storage file
                    <img src={g.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-xs text-gray-400">
                      <ImageIcon className="h-6 w-6" /> Προσωρινή φωτογραφία
                    </div>
                  )}
                  {working && <div className="absolute inset-0 flex items-center justify-center bg-white/70"><Loader2 className="h-6 w-6 animate-spin text-red-600" /></div>}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 ${tableMissing || working ? 'pointer-events-none opacity-50' : ''}`}>
                    <Upload className="h-3.5 w-3.5" /> {g.image ? 'Αλλαγή' : 'Ανέβασμα'}
                    <input type="file" accept="image/*" className="hidden" disabled={tableMissing || working}
                      onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(g, f); }} />
                  </label>
                  {g.image && (
                    <button type="button" disabled={working} onClick={() => save({ ...g, image: null })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                      <Trash2 className="h-3.5 w-3.5" /> Αφαίρεση
                    </button>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="font-semibold text-gray-900">{g.title}</h2>
                  <a href={`/guide/${g.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline">
                    /guide/{g.slug} <ExternalLink className="h-3 w-3" />
                  </a>
                  {saved === g.slug && <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700"><Check className="h-3.5 w-3.5" /> Αποθηκεύτηκε</span>}
                </div>
                <p className="mt-3 text-xs font-medium text-gray-500">Προτεινόμενα άρθρα</p>
                <div className="mt-1.5 grid gap-2">
                  {Array.from({ length: Math.min(MAX_ARTICLES, g.articles.length + 1) }, (_, i) => (
                    <select key={i} value={g.articles[i] ?? ''} disabled={tableMissing || working}
                      onChange={(e) => setArticle(g, i, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50">
                      <option value="">{g.articles[i] ? '— Αφαίρεση —' : '— Προσθήκη άρθρου —'}</option>
                      {articles.filter((a) => a.slug === g.articles[i] || !g.articles.includes(a.slug)).map((a) => (
                        <option key={a.slug} value={a.slug}>{a.title}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
