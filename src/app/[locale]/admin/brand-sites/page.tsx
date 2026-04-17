'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  Loader2, Wand2, Search, Sparkles, BookOpen, HelpCircle, AlertTriangle,
  Sparkle, Image as ImageIcon, ExternalLink, CheckCircle2, Circle,
} from 'lucide-react';

type L = Record<string, string>;

interface Row {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  area: string;
  status: string;
  owner_id: string | null;
  owner_email?: string;
  // brand fields
  tagline: L; owner_story: L;
  meta_title: L; meta_description: L;
  // counts
  faqs_count: number;
  emergency_count: number;
  extras_count: number;
  captions_count: number;
  total_photos: number;
}

const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export default function AdminBrandSitesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('');

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();

    const { data: listings } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    if (!listings) { setLoading(false); return; }

    const ids = listings.map(l => l.id as string);
    const [faqsRes, emergRes, extrasRes, imgsRes] = await Promise.all([
      supabase.from('listing_faqs').select('listing_id').in('listing_id', ids),
      supabase.from('listing_emergency_contacts').select('listing_id').in('listing_id', ids),
      supabase.from('listing_extras').select('listing_id').in('listing_id', ids),
      supabase.from('listing_images').select('listing_id, caption_el, caption_en').in('listing_id', ids),
    ]);

    const faqsCount: Record<string, number> = {};
    (faqsRes.data || []).forEach((r: { listing_id: string }) => { faqsCount[r.listing_id] = (faqsCount[r.listing_id] || 0) + 1; });
    const emergCount: Record<string, number> = {};
    (emergRes.data || []).forEach((r: { listing_id: string }) => { emergCount[r.listing_id] = (emergCount[r.listing_id] || 0) + 1; });
    const extrasCount: Record<string, number> = {};
    (extrasRes.data || []).forEach((r: { listing_id: string }) => { extrasCount[r.listing_id] = (extrasCount[r.listing_id] || 0) + 1; });

    const photosByListing: Record<string, number> = {};
    const captionsByListing: Record<string, number> = {};
    (imgsRes.data || []).forEach((r: { listing_id: string; caption_el: string | null; caption_en: string | null }) => {
      photosByListing[r.listing_id] = (photosByListing[r.listing_id] || 0) + 1;
      if ((r.caption_el && r.caption_el.trim()) || (r.caption_en && r.caption_en.trim())) {
        captionsByListing[r.listing_id] = (captionsByListing[r.listing_id] || 0) + 1;
      }
    });

    // Owner emails (best-effort)
    const ownerIds = Array.from(new Set(listings.map(l => l.owner_id).filter(Boolean))) as string[];
    let emailsMap: Record<string, string> = {};
    if (ownerIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', ownerIds);
      (profiles || []).forEach((p: { id: string; email: string | null; full_name: string | null }) => {
        emailsMap[p.id] = p.email || p.full_name || p.id;
      });
    }

    const mapped: Row[] = listings.map(l => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = l as any;
      const pick = (prefix: string): L => Object.fromEntries(LANGS.map(k => [k, r[`${prefix}_${k}`] || '']));
      return {
        id: r.id, slug: r.slug,
        title_el: r.title_el, title_en: r.title_en,
        area: r.area, status: r.status,
        owner_id: r.owner_id,
        owner_email: emailsMap[r.owner_id] || undefined,
        tagline: pick('tagline'),
        owner_story: pick('owner_story'),
        meta_title: pick('meta_title'),
        meta_description: pick('meta_description'),
        faqs_count: faqsCount[r.id] || 0,
        emergency_count: emergCount[r.id] || 0,
        extras_count: extrasCount[r.id] || 0,
        captions_count: captionsByListing[r.id] || 0,
        total_photos: photosByListing[r.id] || 0,
      };
    });

    setRows(mapped);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(r => {
      if (areaFilter && r.area !== areaFilter) return false;
      if (needle) {
        const hay = [r.title_el, r.title_en, r.slug, r.owner_email].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, q, areaFilter]);

  function completeness(r: Row) {
    // Each check is worth 1 point; max 6
    let score = 0;
    if (r.tagline.el.trim()) score++;
    if (r.owner_story.el.trim()) score++;
    if (r.meta_title.el.trim() && r.meta_title.en.trim()) score++;
    if (r.faqs_count > 0) score++;
    if (r.emergency_count > 0) score++;
    if (r.extras_count > 0) score++;
    return score;
  }

  function langCoverage(m: L): number {
    return LANGS.filter(l => (m[l] || '').trim()).length;
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-700">
          <Wand2 className="w-5 h-5" />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Brand Sites (Admin)</h1>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Όλα τα brand pages ανά κατάλυμα. Από εδώ μπορείς να επεξεργαστείς όλα τα πεδία σε όλες τις γλώσσες,
        να τρέξεις bulk μεταφράσεις και να παράξεις SEO meta.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Αναζήτηση τίτλος / slug / owner…"
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-80 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
          <option value="">Όλες οι περιοχές</option>
          <option value="kassandra">Κασσάνδρα</option>
          <option value="sithonia">Σιθωνία</option>
          <option value="athos">Άθως</option>
          <option value="mainland">Mainland</option>
        </select>
        <div className="ml-auto text-xs text-gray-500 flex items-center">
          {filtered.length} / {rows.length} καταλύματα
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {filtered.map(r => {
          const title = r.title_el || r.title_en || '—';
          const comp = completeness(r);
          const tagCov = langCoverage(r.tagline);
          const storyCov = langCoverage(r.owner_story);
          const metaTitleCov = langCoverage(r.meta_title);
          const metaDescCov = langCoverage(r.meta_description);
          return (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                      r.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{r.status}</span>
                    <span className="text-xs text-gray-500">· {r.area}</span>
                    {r.owner_email && <span className="text-xs text-gray-400">· {r.owner_email}</span>}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-600">
                    <BrandBadge icon={Sparkles}    label="Tagline"  langs={tagCov} />
                    <BrandBadge icon={BookOpen}    label="Story"    langs={storyCov} />
                    <BrandBadge icon={Sparkles}    label="SEO title"    langs={metaTitleCov} />
                    <BrandBadge icon={Sparkles}    label="SEO desc"     langs={metaDescCov} />
                    <BrandBadge icon={HelpCircle}  label="FAQs"     count={r.faqs_count} />
                    <BrandBadge icon={AlertTriangle} label="Emergency" count={r.emergency_count} />
                    <BrandBadge icon={Sparkle}     label="Extras"   count={r.extras_count} />
                    <BrandBadge icon={ImageIcon}   label="Captions" count={`${r.captions_count}/${r.total_photos}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Completeness</div>
                    <div className="text-base font-bold tabular-nums">{comp} / 6</div>
                  </div>
                  <Link
                    href={`/stay/${r.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    title="Προβολή σελίδας"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/listings/${r.id}/brand`}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg"
                  >
                    <Wand2 className="w-4 h-4" /> Edit
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrandBadge({ icon: Icon, label, langs, count }: {
  icon: React.ElementType; label: string; langs?: number; count?: number | string;
}) {
  const hasContent = count !== undefined ? Number(String(count).split('/')[0]) > 0 : (langs || 0) > 0;
  return (
    <span className={`inline-flex items-center gap-1 ${hasContent ? 'text-gray-700' : 'text-gray-400'}`}>
      {hasContent ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <Circle className="w-3 h-3" />}
      <Icon className="w-3 h-3" />
      <span>{label}</span>
      {langs !== undefined && <span className="font-medium tabular-nums">{langs}/7</span>}
      {count !== undefined && <span className="font-medium tabular-nums">{count}</span>}
    </span>
  );
}
