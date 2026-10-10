'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Search, Loader2, AlertTriangle, CheckCircle, ExternalLink, Filter, BarChart3 } from 'lucide-react';

const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

interface AuditItem {
  id: string;
  table: string;
  name: string;
  slug: string;
  issues: string[];
  score: number; // 0-100
  editUrl: string;
}

const TABLES = [
  { key: 'beaches', label: 'Beaches', titleField: 'name', icon: '🏖️', editPath: '/admin/beaches' },
  { key: 'restaurants', label: 'Restaurants', titleField: 'name', icon: '🍽️', editPath: '/admin/restaurants' },
  { key: 'activities', label: 'Activities', titleField: 'name', icon: '🏛️', editPath: '/admin/activities' },
  { key: 'areas', label: 'Areas', titleField: 'name', icon: '📍', editPath: '/admin/areas' },
  { key: 'villages', label: 'Villages', titleField: 'name', icon: '🏘️', editPath: '/admin/villages' },
  { key: 'monasteries', label: 'Monasteries', titleField: 'name', icon: '⛪', editPath: '/admin/monasteries' },
  { key: 'listings', label: 'Listings', titleField: 'title', icon: '🏠', editPath: '/admin/listings' },
  { key: 'sales', label: 'Sales', titleField: 'title', icon: '🏡', editPath: '/admin/sales' },
  { key: 'business_types', label: 'Είδη Μαγαζιών', titleField: 'name', icon: '🏷️', editPath: '/admin/business-types' },
  { key: 'blog_articles', label: 'Blog', titleField: 'title', icon: '📝', editPath: '/admin/blog' },
];

export default function SeoAuditPage() {
  const locale = useLocale();
  const [items, setItems] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTable, setFilterTable] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'issues' | 'critical' | 'perfect'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { runAudit(); }, []);

  async function runAudit() {
    setLoading(true);
    const supabase = createClient();
    const allItems: AuditItem[] = [];

    for (const t of TABLES) {
      // Build select columns
      const cols = ['id', 'slug',
        `${t.titleField}_el`, `${t.titleField}_en`,
        ...LANGS.map(l => `${t.titleField}_${l}`),
      ];

      // Add meta columns (not for business_types which is simpler)
      if (t.key !== 'business_types') {
        cols.push(...LANGS.map(l => `meta_title_${l}`));
        cols.push(...LANGS.map(l => `meta_description_${l}`));
        cols.push('image_url', 'image_alt');
      }

      // Deduplicate
      const uniqueCols = [...new Set(cols)].join(',');

      const { data } = await supabase.from(t.key).select(uniqueCols).limit(500);
      if (!data) continue;

      for (const row of (data as unknown as Record<string, unknown>[])) {
        const issues: string[] = [];
        let checks = 0;
        let passed = 0;

        // Check title/name translations
        for (const l of LANGS) {
          checks++;
          const val = row[`${t.titleField}_${l}`] as string;
          if (val && val.length > 0) passed++;
          else issues.push(`${t.titleField}_${l} missing`);
        }

        if (t.key !== 'business_types') {
          // Check meta titles in ALL 7 languages
          for (const l of LANGS) {
            checks++;
            const val = row[`meta_title_${l}`] as string;
            if (val && val.length > 0) passed++;
            else issues.push(`meta_title_${l} missing`);
          }

          // Check meta descriptions in ALL 7 languages
          for (const l of LANGS) {
            checks++;
            const val = row[`meta_description_${l}`] as string;
            if (val && val.length > 0) passed++;
            else issues.push(`meta_desc_${l} missing`);
          }

          // Check image
          checks++;
          if (row.image_url && (row.image_url as string).length > 0) passed++;
          else issues.push('image missing');

          // Check image alt
          checks++;
          if (row.image_alt && (row.image_alt as string).length > 0) passed++;
          else issues.push('image_alt missing');
        }

        const score = checks > 0 ? Math.round((passed / checks) * 100) : 0;
        const name = (row[`${t.titleField}_el`] as string) || (row[`${t.titleField}_en`] as string) || (row.slug as string) || 'Untitled';

        allItems.push({
          id: row.id as string,
          table: t.key,
          name,
          slug: (row.slug as string) || '',
          issues,
          score,
          editUrl: `${t.editPath}/${row.id}/edit`,
        });
      }
    }

    allItems.sort((a, b) => a.score - b.score);
    setItems(allItems);
    setLoading(false);
  }

  const filtered = items.filter(i => {
    if (filterTable && i.table !== filterTable) return false;
    if (filterStatus === 'issues') return i.score < 100;
    if (filterStatus === 'critical') return i.score < 50;
    if (filterStatus === 'perfect') return i.score === 100;
    if (searchQuery) {
      return i.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const totalItems = items.length;
  const perfectItems = items.filter(i => i.score === 100).length;
  const criticalItems = items.filter(i => i.score < 50).length;
  const avgScore = totalItems > 0 ? Math.round(items.reduce((s, i) => s + i.score, 0) / totalItems) : 0;

  // Per-table stats
  const tableStats = TABLES.map(t => {
    const tableItems = items.filter(i => i.table === t.key);
    const perfect = tableItems.filter(i => i.score === 100).length;
    const total = tableItems.length;
    const avg = total > 0 ? Math.round(tableItems.reduce((s, i) => s + i.score, 0) / total) : 0;
    return { ...t, total, perfect, avg };
  });

  const TABLE_ICON: Record<string, string> = Object.fromEntries(TABLES.map(t => [t.key, t.icon]));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">SEO Audit</h1>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className={`text-3xl font-bold ${avgScore >= 80 ? 'text-green-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{avgScore}%</div>
          <div className="text-xs text-gray-500">Average Score</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{totalItems}</div>
          <div className="text-xs text-gray-500">Total Records</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{perfectItems}</div>
          <div className="text-xs text-green-600">Perfect (100%)</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-700">{criticalItems}</div>
          <div className="text-xs text-red-600">Critical (&lt;50%)</div>
        </div>
      </div>

      {/* Per-table overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {tableStats.map(ts => (
          <button key={ts.key} onClick={() => setFilterTable(filterTable === ts.key ? '' : ts.key)}
            className={`text-left p-3 rounded-xl border transition-colors ${filterTable === ts.key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{ts.icon}</span>
              <span className="text-xs font-semibold text-gray-700 truncate">{ts.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${ts.avg >= 80 ? 'text-green-600' : ts.avg >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{ts.avg}%</span>
              <span className="text-[10px] text-gray-400">{ts.perfect}/{ts.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div className={`h-1 rounded-full ${ts.avg >= 80 ? 'bg-green-500' : ts.avg >= 50 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${ts.avg}%` }} />
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-white border border-gray-200 rounded-xl p-3">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση..."
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
        </div>
        <select value={filterTable} onChange={e => setFilterTable(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">All types</option>
          {TABLES.map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="all">All</option>
          <option value="issues">With issues</option>
          <option value="critical">Critical (&lt;50%)</option>
          <option value="perfect">Perfect (100%)</option>
        </select>
        <span className="text-xs text-gray-400">{filtered.length} results</span>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filtered.slice(0, 100).map(item => (
          <div key={`${item.table}-${item.id}`} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Score */}
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                item.score === 100 ? 'bg-green-100 text-green-700' :
                item.score >= 70 ? 'bg-amber-100 text-amber-700' :
                item.score >= 50 ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>{item.score}%</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{TABLE_ICON[item.table] || '📄'}</span>
                  <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
                </div>
                {item.issues.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.issues.slice(0, 6).map((issue, i) => (
                      <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[9px]">
                        <AlertTriangle className="w-2.5 h-2.5" />{issue}
                      </span>
                    ))}
                    {item.issues.length > 6 && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[9px]">+{item.issues.length - 6} more</span>
                    )}
                  </div>
                )}
                {item.score === 100 && (
                  <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3" /> SEO Complete
                  </div>
                )}
              </div>

              {/* Action */}
              <Link href={item.editUrl}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium shrink-0">
                <ExternalLink className="w-3 h-3" /> Fix
              </Link>
            </div>

            {/* Score bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div className={`h-1 rounded-full ${
                item.score === 100 ? 'bg-green-500' : item.score >= 70 ? 'bg-amber-400' : item.score >= 50 ? 'bg-orange-500' : 'bg-red-500'
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
