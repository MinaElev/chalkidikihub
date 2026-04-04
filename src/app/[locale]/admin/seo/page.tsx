'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, CheckCircle, XCircle, AlertTriangle, Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface SeoRecord {
  type: string;
  id: string;
  slug: string;
  name: string;
  image_url: string;
  image_alt: string;
  meta: Record<string, string>;
  translations: Record<string, string>;
  score: number;
  issues: string[];
}

const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro'];

export default function AdminSeoPage() {
  const [records, setRecords] = useState<SeoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'issues' | 'perfect'>('all');

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const supabase = createClient();
    const all: SeoRecord[] = [];

    const tables = [
      { table: 'areas', type: 'area', nameField: 'name', editPath: '/admin/areas' },
      { table: 'beaches', type: 'beach', nameField: 'name', editPath: '/admin/beaches' },
      { table: 'restaurants', type: 'restaurant', nameField: 'name', editPath: '/admin/restaurants' },
      { table: 'activities', type: 'activity', nameField: 'name', editPath: '/admin/activities' },
      { table: 'blog_articles', type: 'blog', nameField: 'title', editPath: '/admin/blog' },
      { table: 'listings', type: 'listing', nameField: 'title', editPath: '/admin/listings' },
    ];

    for (const t of tables) {
      const { data } = await supabase.from(t.table).select('*');
      if (!data) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any[]).forEach((row: any) => {
        const issues: string[] = [];
        const meta: Record<string, string> = {};
        const translations: Record<string, string> = {};

        // Check meta titles
        LANGS.forEach(lang => {
          const mt = row[`meta_title_${lang}`] || '';
          meta[`title_${lang}`] = mt;
          if (!mt) issues.push(`Meta Title (${lang.toUpperCase()})`);
        });

        // Check meta descriptions
        LANGS.forEach(lang => {
          const md = row[`meta_description_${lang}`] || '';
          meta[`desc_${lang}`] = md;
          if (!md) issues.push(`Meta Desc (${lang.toUpperCase()})`);
        });

        // Check translations
        LANGS.forEach(lang => {
          const nameVal = row[`${t.nameField}_${lang}`] || '';
          translations[lang] = nameVal;
          if (!nameVal && lang !== 'el') issues.push(`${t.nameField} (${lang.toUpperCase()})`);
        });

        // Check image
        if (!row.image_url) issues.push('Image');
        if (!row.image_alt) issues.push('Image Alt');

        const totalChecks = LANGS.length * 2 + LANGS.length - 1 + 2; // meta*2 + translations(no el) + image + alt
        const score = Math.round(((totalChecks - issues.length) / totalChecks) * 100);

        all.push({
          type: t.type,
          id: row.id,
          slug: row.slug,
          name: row[`${t.nameField}_el`] || row[`${t.nameField}_en`] || row.slug || '?',
          image_url: row.image_url || '',
          image_alt: row.image_alt || '',
          meta,
          translations,
          score,
          issues,
        });
      });
    }

    all.sort((a, b) => a.score - b.score);
    setRecords(all);
    setLoading(false);
  }

  const filtered = records.filter(r => {
    if (filterType && r.type !== filterType) return false;
    if (filterStatus === 'issues' && r.score === 100) return false;
    if (filterStatus === 'perfect' && r.score < 100) return false;
    return true;
  });

  const avgScore = records.length > 0 ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length) : 0;
  const perfectCount = records.filter(r => r.score === 100).length;
  const criticalCount = records.filter(r => r.score < 30).length;
  const types = [...new Set(records.map(r => r.type))];

  function getScoreColor(score: number) {
    if (score === 100) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-amber-600 bg-amber-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  }

  function getScoreBg(score: number) {
    if (score === 100) return 'bg-green-500';
    if (score >= 70) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">SEO Dashboard</h1>
        </div>
        <Link href="/admin/tools" className="text-sm text-primary-600 hover:underline">
          AI Bulk SEO →
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className={`text-3xl font-bold ${avgScore >= 70 ? 'text-green-600' : avgScore >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{avgScore}%</div>
          <div className="text-sm text-gray-500">Μέσος Όρος SEO</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{perfectCount}</div>
          <div className="text-sm text-gray-500">Perfect (100%)</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
          <div className="text-sm text-gray-500">Critical (&lt;30%)</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{records.length}</div>
          <div className="text-sm text-gray-500">Σύνολο σελίδων</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι κατηγορίες</option>
          {types.map(t => <option key={t} value={t}>{t} ({records.filter(r => r.type === t).length})</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="all">Όλα ({records.length})</option>
          <option value="issues">Με ελλείψεις ({records.length - perfectCount})</option>
          <option value="perfect">Perfect ({perfectCount})</option>
        </select>
      </div>

      {/* Records table */}
      <div className="space-y-2">
        {filtered.map((record) => {
          const isExpanded = expanded === record.id;
          return (
            <div key={record.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Row */}
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(isExpanded ? null : record.id)}>

                {/* Score badge */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${getScoreColor(record.score)}`}>
                  {record.score}%
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{record.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">{record.type}</span>
                    <span>{record.slug}</span>
                  </div>
                </div>

                {/* Issues count */}
                <div className="flex items-center gap-2 shrink-0">
                  {record.score === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : record.issues.length <= 3 ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-gray-500">{record.issues.length} issues</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  {/* Score bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">SEO Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(record.score).split(' ')[0]}`}>{record.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${getScoreBg(record.score)}`} style={{ width: `${record.score}%` }} />
                    </div>
                  </div>

                  {/* Issues */}
                  {record.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-red-600 mb-2">❌ Λείπουν ({record.issues.length}):</h4>
                      <div className="flex flex-wrap gap-1">
                        {record.issues.map((issue, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">{issue}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta Titles */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Titles:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {LANGS.map(lang => (
                        <div key={lang} className={`p-2 rounded-lg text-xs ${record.meta[`title_${lang}`] ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                          <span className="font-medium">{lang.toUpperCase()}:</span> {record.meta[`title_${lang}`] || '❌ κενό'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta Descriptions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Meta Descriptions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {LANGS.map(lang => (
                        <div key={lang} className={`p-2 rounded-lg text-xs ${record.meta[`desc_${lang}`] ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                          <span className="font-medium">{lang.toUpperCase()}:</span> {record.meta[`desc_${lang}`] ? record.meta[`desc_${lang}`].slice(0, 80) + '...' : '❌ κενό'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Translations */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Μεταφράσεις τίτλου:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {LANGS.map(lang => (
                        <div key={lang} className={`p-2 rounded-lg text-xs ${record.translations[lang] ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                          <span className="font-medium">{lang.toUpperCase()}:</span> {record.translations[lang] || '❌ κενό'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg text-xs ${record.image_url ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      Image: {record.image_url ? '✅' : '❌ κενό'}
                    </div>
                    <div className={`p-2 rounded-lg text-xs ${record.image_alt ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      Image Alt: {record.image_alt ? '✅ ' + record.image_alt.slice(0, 40) : '❌ κενό'}
                    </div>
                    <Link href={`/admin/${record.type === 'listing' ? 'listings' : record.type === 'blog' ? 'blog' : record.type + 's'}/${record.id}/edit`}
                      className="ml-auto flex items-center gap-1 text-xs text-primary-600 hover:underline">
                      <ExternalLink className="w-3 h-3" />Edit
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
