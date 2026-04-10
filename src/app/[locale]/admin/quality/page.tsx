'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle, ExternalLink, Filter } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

interface QualityItem {
  id: string;
  table: string;
  name: string;
  issues: string[];
  score: number;
  editUrl: string;
}

const TABLES = [
  { key: 'beaches', label: 'Beaches', titleField: 'name', descField: 'description', imgField: 'image_url', hasCoords: true, editPath: '/admin/beaches' },
  { key: 'restaurants', label: 'Restaurants', titleField: 'name', descField: 'description', imgField: 'image_url', hasCoords: true, editPath: '/admin/restaurants' },
  { key: 'activities', label: 'Activities', titleField: 'name', descField: 'description', imgField: 'image_url', hasCoords: true, editPath: '/admin/activities' },
  { key: 'blog_articles', label: 'Blog', titleField: 'title', descField: 'content', imgField: 'image_url', hasCoords: false, editPath: '/admin/blog' },
  { key: 'sales', label: 'Sales', titleField: 'title', descField: 'description', imgField: null, hasCoords: true, editPath: '/admin/sales' },
  { key: 'villages', label: 'Villages', titleField: 'name', descField: 'description', imgField: 'image_url', hasCoords: true, editPath: '/admin/villages' },
] as const;

export default function QualityPage() {
  const [items, setItems] = useState<QualityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTable, setFilterTable] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'perfect'>('all');

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const supabase = createClient();
    const allItems: QualityItem[] = [];

    for (const t of TABLES) {
      const fields = [
        'id',
        ...LANGS.map(l => `${t.titleField}_${l}`),
        ...LANGS.map(l => `${t.descField}_${l}`),
        'meta_title_el', 'meta_title_en',
        'meta_description_el', 'meta_description_en',
        ...(t.imgField ? [t.imgField, 'image_alt'] : []),
        ...(t.hasCoords ? ['latitude', 'longitude'] : []),
      ].join(',');

      const { data } = await supabase.from(t.key).select(fields).limit(500);
      if (!data) continue;

      (data as unknown as Record<string, unknown>[]).forEach((row) => {
        const issues: string[] = [];
        let checks = 0;
        let passed = 0;

        // Check translations (title)
        LANGS.forEach(l => {
          checks++;
          const val = row[`${t.titleField}_${l}`] as string || '';
          if (val.length > 0) passed++;
          else issues.push(`Missing title ${l.toUpperCase()}`);
        });

        // Check descriptions (at least EL + EN)
        ['el', 'en'].forEach(l => {
          checks++;
          const val = row[`${t.descField}_${l}`] as string || '';
          if (val.length >= 50) passed++;
          else if (val.length > 0) { issues.push(`Short description ${l.toUpperCase()} (${val.length} chars)`); }
          else issues.push(`Missing description ${l.toUpperCase()}`);
        });

        // Check image
        if (t.imgField) {
          checks++;
          if (row[t.imgField] && (row[t.imgField] as string).length > 0) passed++;
          else issues.push('Missing image');
        }

        // Check image alt
        if (t.imgField) {
          checks++;
          if (row.image_alt && (row.image_alt as string).length > 0) passed++;
          else issues.push('Missing image alt text');
        }

        // Check SEO meta
        checks += 2;
        if (row.meta_title_el && (row.meta_title_el as string).length > 0) passed++;
        else issues.push('Missing meta_title EL');
        if (row.meta_title_en && (row.meta_title_en as string).length > 0) passed++;
        else issues.push('Missing meta_title EN');

        checks += 2;
        if (row.meta_description_el && (row.meta_description_el as string).length > 0) passed++;
        else issues.push('Missing meta_description EL');
        if (row.meta_description_en && (row.meta_description_en as string).length > 0) passed++;
        else issues.push('Missing meta_description EN');

        // Check coordinates
        if (t.hasCoords) {
          checks++;
          const lat = Number(row.latitude) || 0;
          const lng = Number(row.longitude) || 0;
          if (lat !== 0 && lng !== 0) passed++;
          else issues.push('Missing coordinates');
        }

        const score = checks > 0 ? Math.round((passed / checks) * 100) : 0;

        allItems.push({
          id: row.id as string,
          table: t.key,
          name: (row[`${t.titleField}_el`] as string) || (row[`${t.titleField}_en`] as string) || 'Untitled',
          issues,
          score,
          editUrl: `${t.editPath}/${row.id}/edit`,
        });
      });
    }

    allItems.sort((a, b) => a.score - b.score);
    setItems(allItems);
    setLoading(false);
  }

  const filtered = items.filter(i => {
    if (filterTable && i.table !== filterTable) return false;
    if (filterSeverity === 'critical') return i.score < 40;
    if (filterSeverity === 'warning') return i.score >= 40 && i.score < 100;
    if (filterSeverity === 'perfect') return i.score === 100;
    return true;
  });

  const avgScore = items.length > 0 ? Math.round(items.reduce((s, i) => s + i.score, 0) / items.length) : 0;
  const perfectCount = items.filter(i => i.score === 100).length;
  const criticalCount = items.filter(i => i.score < 40).length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Content Quality</h1>
      </div>

      {/* Health Score */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className={`text-3xl font-bold ${avgScore >= 80 ? 'text-green-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{avgScore}%</div>
          <div className="text-xs text-gray-500">Health Score</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{items.length}</div>
          <div className="text-xs text-gray-500">Total Items</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{perfectCount}</div>
          <div className="text-xs text-green-600">Perfect</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-700">{criticalCount}</div>
          <div className="text-xs text-red-600">Critical (&lt;40%)</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-white border border-gray-200 rounded-xl p-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={filterTable} onChange={e => setFilterTable(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">All types</option>
          {TABLES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value as typeof filterSeverity)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="all">All</option>
          <option value="critical">Critical (&lt;40%)</option>
          <option value="warning">With issues</option>
          <option value="perfect">Perfect (100%)</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {filtered.slice(0, 100).map((item) => (
          <div key={`${item.table}-${item.id}`} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Score */}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                item.score === 100 ? 'bg-green-100 text-green-700' :
                item.score >= 70 ? 'bg-amber-100 text-amber-700' :
                item.score >= 40 ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>{item.score}%</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[9px] font-bold uppercase">
                    {item.table === 'blog_articles' ? 'blog' : item.table.slice(0, 5)}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
                </div>
                {item.issues.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.issues.slice(0, 5).map((issue, i) => (
                      <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px]">
                        <AlertTriangle className="w-2.5 h-2.5" />{issue}
                      </span>
                    ))}
                    {item.issues.length > 5 && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px]">+{item.issues.length - 5} more</span>
                    )}
                  </div>
                )}
                {item.score === 100 && (
                  <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3" /> All checks passed
                  </div>
                )}
              </div>

              {/* Action */}
              <Link href={item.editUrl} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium shrink-0">
                <ExternalLink className="w-3 h-3" /> Fix
              </Link>
            </div>

            {/* Score bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div className={`h-1 rounded-full ${
                item.score === 100 ? 'bg-green-500' : item.score >= 70 ? 'bg-amber-400' : item.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
              }`} style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 100 && (
        <div className="text-center py-4 text-xs text-gray-400">Showing 100 of {filtered.length} items</div>
      )}
    </div>
  );
}
