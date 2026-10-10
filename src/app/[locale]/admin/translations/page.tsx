'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Languages, Loader2, Sparkles, CheckCircle, XCircle, Filter } from 'lucide-react';

const LANGS = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
const LANG_FLAGS: Record<string, string> = { el: '🇬🇷', en: '🇬🇧', de: '🇩🇪', bg: '🇧🇬', ru: '🇷🇺', ro: '🇷🇴', sr: '🇷🇸' };

interface ContentItem {
  id: string;
  table: string;
  name: string;
  translations: Record<string, boolean>;
  editUrl: string;
}

const TABLES = [
  { key: 'beaches', label: 'Beaches', titleField: 'name', descField: 'description', editPrefix: '/admin/beaches' },
  { key: 'restaurants', label: 'Restaurants', titleField: 'name', descField: 'description', editPrefix: '/admin/restaurants' },
  { key: 'activities', label: 'Activities', titleField: 'name', descField: 'description', editPrefix: '/admin/activities' },
  { key: 'blog_articles', label: 'Blog', titleField: 'title', descField: 'content', editPrefix: '/admin/blog' },
  { key: 'sales', label: 'Sales', titleField: 'title', descField: 'description', editPrefix: '/admin/sales' },
  { key: 'villages', label: 'Villages', titleField: 'name', descField: 'description', editPrefix: '/admin/villages' },
] as const;

export default function TranslationsPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTable, setFilterTable] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [filling, setFilling] = useState<string | null>(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const supabase = createClient();
    const allItems: ContentItem[] = [];

    for (const t of TABLES) {
      const cols = ['id', ...LANGS.map(l => `${t.titleField}_${l}`)].join(',');
      const { data } = await supabase.from(t.key).select(cols).limit(500);
      if (data) {
        (data as unknown as Record<string, unknown>[]).forEach((row) => {
          const translations: Record<string, boolean> = {};
          LANGS.forEach(l => {
            translations[l] = !!row[`${t.titleField}_${l}`] && (row[`${t.titleField}_${l}`] as string).length > 0;
          });
          const editUrl = t.key === 'sales'
            ? `${t.editPrefix}/${row.id}/edit`
            : `${t.editPrefix}/${row.id}/edit`;
          allItems.push({
            id: row.id as string,
            table: t.key,
            name: (row[`${t.titleField}_el`] as string) || (row[`${t.titleField}_en`] as string) || 'Untitled',
            translations,
            editUrl,
          });
        });
      }
    }
    setItems(allItems);
    setLoading(false);
  }

  async function handleAiFill(item: ContentItem) {
    setFilling(item.id);
    try {
      const supabase = createClient();
      const tableConfig = TABLES.find(t => t.key === item.table);
      if (!tableConfig) return;

      const { data: record } = await supabase.from(item.table).select('*').eq('id', item.id).single();
      if (!record) { setFilling(null); return; }

      const titleEl = record[`${tableConfig.titleField}_el`] || '';
      const descEl = record[`${tableConfig.descField}_el`] || '';
      if (!titleEl && !descEl) { setFilling(null); return; }

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full_auto',
          title_el: titleEl,
          description_el: descEl,
          category: item.table,
          location: record.location_name || record.area || '',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const updates: Record<string, string> = {};

        // Map AI response keys to DB column names
        // AI returns title_en/description_en, but DB may use name_en/description_en
        const titlePrefix = tableConfig.titleField; // 'name' or 'title'
        const descPrefix = tableConfig.descField; // 'description' or 'content'

        if (data.translations) {
          Object.entries(data.translations).forEach(([key, val]) => {
            if (val === undefined || val === null || val === 'undefined' || !(val as string).length) return;
            // Map title_XX → name_XX or title_XX based on table
            let dbKey = key;
            if (key.startsWith('title_')) {
              dbKey = `${titlePrefix}_${key.replace('title_', '')}`;
            } else if (key.startsWith('description_')) {
              dbKey = `${descPrefix}_${key.replace('description_', '')}`;
            }
            updates[dbKey] = val as string;
          });
        }

        // Also add SEO if available
        if (data.seo) {
          Object.entries(data.seo).forEach(([key, val]) => {
            if (val && val !== 'undefined' && (val as string).length > 0 && key.startsWith('meta_')) {
              updates[key] = val as string;
            }
            if (key === 'image_alt' && val && val !== 'undefined') updates.image_alt = val as string;
          });
        }

        if (Object.keys(updates).length > 0) {
          const { error } = await supabase.from(item.table).update(updates).eq('id', item.id);
          if (!error) {
            setItems(prev => prev.map(i => {
              if (i.id !== item.id) return i;
              const newT = { ...i.translations };
              Object.keys(updates).forEach(k => {
                const lang = k.split('_').pop() as string;
                if (LANGS.includes(lang as typeof LANGS[number])) newT[lang] = true;
              });
              return { ...i, translations: newT };
            }));
          }
        }
      }
    } catch {}
    setFilling(null);
  }

  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });

  async function handleBulkFill() {
    const incomplete = filtered.filter(i => Object.values(i.translations).some(v => !v));
    if (incomplete.length === 0) return;
    if (!confirm(`AI Fill ${incomplete.length} items? This will use OpenAI credits.`)) return;

    setBulkRunning(true);
    setBulkProgress({ done: 0, total: incomplete.length });

    for (let idx = 0; idx < incomplete.length; idx++) {
      await handleAiFill(incomplete[idx]);
      setBulkProgress({ done: idx + 1, total: incomplete.length });
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }

    setBulkRunning(false);
  }

  const filtered = items.filter(i => {
    if (filterTable && i.table !== filterTable) return false;
    if (filterStatus === 'incomplete') return Object.values(i.translations).some(v => !v);
    if (filterStatus === 'complete') return Object.values(i.translations).every(v => v);
    return true;
  });

  const totalComplete = items.filter(i => Object.values(i.translations).every(v => v)).length;
  const totalIncomplete = items.filter(i => Object.values(i.translations).some(v => !v)).length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Languages className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Translation Matrix</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{items.length}</div>
          <div className="text-xs text-gray-500">Total Items</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{totalComplete}</div>
          <div className="text-xs text-green-600">Complete</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{totalIncomplete}</div>
          <div className="text-xs text-red-600">Incomplete</div>
        </div>
      </div>

      {/* Filters + Bulk button */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-white border border-gray-200 rounded-xl p-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={filterTable} onChange={e => setFilterTable(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">All types</option>
          {TABLES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'all' | 'incomplete' | 'complete')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="all">All</option>
          <option value="incomplete">Incomplete only</option>
          <option value="complete">Complete only</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
        <button onClick={handleBulkFill} disabled={bulkRunning || totalIncomplete === 0}
          className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium disabled:opacity-50">
          {bulkRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {bulkRunning ? `${bulkProgress.done}/${bulkProgress.total}` : `Bulk Fill (${totalIncomplete})`}
        </button>
      </div>

      {/* Bulk progress */}
      {bulkRunning && (
        <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-800">AI Bulk Translation in progress...</span>
            <span className="text-xs text-purple-600">{bulkProgress.done}/{bulkProgress.total}</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${bulkProgress.total > 0 ? (bulkProgress.done / bulkProgress.total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {/* Matrix Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3 w-8">Type</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Name</th>
                {LANGS.map(l => (
                  <th key={l} className="text-center text-xs font-semibold text-gray-600 px-2 py-3 w-12">
                    <span title={l.toUpperCase()}>{LANG_FLAGS[l]}</span>
                  </th>
                ))}
                <th className="text-center text-xs font-semibold text-gray-600 px-3 py-3 w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.slice(0, 100).map((item) => {
                const allComplete = Object.values(item.translations).every(v => v);
                return (
                  <tr key={`${item.table}-${item.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[9px] font-bold uppercase">
                        {item.table === 'blog_articles' ? 'blog' : item.table.slice(0, 4)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-[200px]">{item.name}</td>
                    {LANGS.map(l => (
                      <td key={l} className="text-center px-2 py-2">
                        {item.translations[l]
                          ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-red-300 mx-auto" />
                        }
                      </td>
                    ))}
                    <td className="text-center px-3 py-2">
                      {!allComplete && (
                        <button onClick={() => handleAiFill(item)} disabled={filling === item.id}
                          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-medium disabled:opacity-50 inline-flex items-center gap-1">
                          {filling === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          AI Fill
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 100 && (
          <div className="px-4 py-3 border-t border-gray-100 text-center text-xs text-gray-400">
            Showing 100 of {filtered.length} items. Use filters to narrow down.
          </div>
        )}
      </div>
    </div>
  );
}
