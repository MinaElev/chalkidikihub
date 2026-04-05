'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link2, Loader2, CheckCircle, Sparkles, Search, ArrowRight } from 'lucide-react';

interface ContentItem {
  type: 'blog' | 'beach' | 'restaurant' | 'activity' | 'listing';
  id: string;
  slug: string;
  name: string;
  content: string;
  currentLinks: string[];
  suggestedLinks: Array<{ type: string; slug: string; name: string; matches: string[] }>;
}

export default function InternalLinksPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [allNames, setAllNames] = useState<Array<{ type: string; slug: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => { scan(); }, []);

  async function scan() {
    setLoading(true);
    const supabase = createClient();

    // Get all named items
    const names: typeof allNames = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetch = async (table: string, type: string, nameField: string) => {
      const { data } = await supabase.from(table).select(`id, slug, ${nameField}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any[] || []).forEach((row: any) => {
        const name = row[nameField] || '';
        if (name.length >= 3) names.push({ type, slug: row.slug, name });
      });
    };

    await Promise.all([
      fetch('beaches', 'beach', 'name_el'),
      fetch('restaurants', 'restaurant', 'name_el'),
      fetch('activities', 'activity', 'name_el'),
      fetch('blog_articles', 'blog', 'title_el'),
      fetch('listings', 'listing', 'title_el'),
    ]);

    // Also add English names
    const fetchEn = async (table: string, type: string, nameField: string) => {
      const { data } = await supabase.from(table).select(`slug, ${nameField}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any[] || []).forEach((row: any) => {
        const name = row[nameField] || '';
        if (name.length >= 3 && !names.find(n => n.slug === row.slug && n.name === name)) {
          names.push({ type, slug: row.slug, name });
        }
      });
    };
    await Promise.all([
      fetchEn('beaches', 'beach', 'name_en'),
      fetchEn('restaurants', 'restaurant', 'name_en'),
      fetchEn('activities', 'activity', 'name_en'),
    ]);

    // Area names
    const areaNames = [
      { type: 'area', slug: 'kassandra', name: 'Κασσάνδρα' },
      { type: 'area', slug: 'kassandra', name: 'Kassandra' },
      { type: 'area', slug: 'sithonia', name: 'Σιθωνία' },
      { type: 'area', slug: 'sithonia', name: 'Sithonia' },
      { type: 'area', slug: 'athos', name: 'Άθως' },
      { type: 'area', slug: 'athos', name: 'Athos' },
      { type: 'area', slug: 'mainland', name: 'Ενδοχώρα' },
    ];
    names.push(...areaNames);

    setAllNames(names);

    // Now scan blog articles for mentions
    const contentItems: ContentItem[] = [];
    const { data: blogs } = await supabase.from('blog_articles').select('id, slug, title_el, content_el, related_beach_slugs, related_area_slugs, related_listing_slugs, related_article_slugs');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (blogs as any[] || []).forEach((blog: any) => {
      const content = (blog.content_el || '') + ' ' + (blog.title_el || '');
      const currentLinks = [
        ...(blog.related_beach_slugs || []),
        ...(blog.related_area_slugs || []),
        ...(blog.related_listing_slugs || []),
        ...(blog.related_article_slugs || []),
      ];

      const suggested: ContentItem['suggestedLinks'] = [];
      names.forEach(({ type, slug, name }) => {
        if (slug === blog.slug) return; // Don't link to self
        if (currentLinks.includes(slug)) return; // Already linked

        const regex = new RegExp(escapeRegex(name), 'i');
        if (regex.test(content)) {
          // Check if not already suggested
          if (!suggested.find(s => s.slug === slug)) {
            suggested.push({ type, slug, name, matches: [name] });
          }
        }
      });

      if (suggested.length > 0) {
        contentItems.push({
          type: 'blog',
          id: blog.id,
          slug: blog.slug,
          name: blog.title_el || blog.slug,
          content: content.slice(0, 200),
          currentLinks,
          suggestedLinks: suggested,
        });
      }
    });

    // Sort by most suggestions
    contentItems.sort((a, b) => b.suggestedLinks.length - a.suggestedLinks.length);
    setItems(contentItems);
    setLoading(false);
  }

  async function applyLinks(item: ContentItem) {
    setApplying(item.id);
    const supabase = createClient();

    const beachSlugs = item.suggestedLinks.filter(s => s.type === 'beach').map(s => s.slug);
    const areaSlugs = item.suggestedLinks.filter(s => s.type === 'area').map(s => s.slug);
    const articleSlugs = item.suggestedLinks.filter(s => s.type === 'blog').map(s => s.slug);
    const listingSlugs = item.suggestedLinks.filter(s => s.type === 'listing').map(s => s.slug);

    // Merge with existing
    const update: Record<string, string[]> = {};
    if (beachSlugs.length > 0) update.related_beach_slugs = [...new Set([...item.currentLinks.filter(s => beachSlugs.includes(s) || !beachSlugs.length), ...beachSlugs])];
    if (areaSlugs.length > 0) update.related_area_slugs = [...new Set(areaSlugs)];
    if (articleSlugs.length > 0) update.related_article_slugs = [...new Set(articleSlugs)];
    if (listingSlugs.length > 0) update.related_listing_slugs = [...new Set(listingSlugs)];

    // Get current values and merge
    const { data: current } = await supabase.from('blog_articles').select('related_beach_slugs, related_area_slugs, related_article_slugs, related_listing_slugs').eq('id', item.id).single();
    if (current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = current as any;
      if (beachSlugs.length > 0) update.related_beach_slugs = [...new Set([...(c.related_beach_slugs || []), ...beachSlugs])];
      if (areaSlugs.length > 0) update.related_area_slugs = [...new Set([...(c.related_area_slugs || []), ...areaSlugs])];
      if (articleSlugs.length > 0) update.related_article_slugs = [...new Set([...(c.related_article_slugs || []), ...articleSlugs])];
      if (listingSlugs.length > 0) update.related_listing_slugs = [...new Set([...(c.related_listing_slugs || []), ...listingSlugs])];
    }

    const { error } = await supabase.from('blog_articles').update(update).eq('id', item.id);
    if (error) {
      setResults(prev => ({ ...prev, [item.id]: `❌ ${error.message}` }));
    } else {
      setResults(prev => ({ ...prev, [item.id]: `✅ ${Object.values(update).flat().length} links added` }));
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
    setApplying(null);
  }

  async function applyAll() {
    for (const item of items) {
      await applyLinks(item);
    }
  }

  const totalSuggestions = items.reduce((sum, i) => sum + i.suggestedLinks.length, 0);

  const typeColors: Record<string, string> = {
    beach: 'bg-cyan-100 text-cyan-700',
    restaurant: 'bg-red-100 text-red-700',
    activity: 'bg-amber-100 text-amber-700',
    area: 'bg-primary-100 text-primary-700',
    blog: 'bg-indigo-100 text-indigo-700',
    listing: 'bg-green-100 text-green-700',
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link2 className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Internal Links</h1>
          {totalSuggestions > 0 && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">{totalSuggestions} suggestions</span>
          )}
        </div>
        {items.length > 0 && (
          <button onClick={applyAll} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium">
            <Sparkles className="w-4 h-4" />Apply All ({items.length} articles)
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">All internal links are up to date!</p>
          <p className="text-sm text-gray-400 mt-1">No missing link opportunities found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <span className="text-xs text-gray-400">{item.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  {results[item.id] && (
                    <span className={`text-xs ${results[item.id].startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{results[item.id]}</span>
                  )}
                  <button onClick={() => applyLinks(item)} disabled={applying === item.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-medium disabled:opacity-50">
                    {applying === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                    Apply {item.suggestedLinks.length} links
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {item.suggestedLinks.map((link, idx) => (
                  <span key={idx} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColors[link.type] || 'bg-gray-100 text-gray-700'}`}>
                    {link.type}: {link.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Πώς λειτουργεί:</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Σκανάρει τα blog articles για αναφορές σε παραλίες, εστιατόρια, αξιοθέατα, περιοχές</li>
          <li>• Προτείνει internal links που λείπουν</li>
          <li>• "Apply" ενημερώνει τα related_slugs στη βάση</li>
          <li>• Αυτά εμφανίζονται στο "Related content" κάτω από κάθε άρθρο</li>
          <li>• Περισσότερα internal links = καλύτερο SEO</li>
        </ul>
      </div>
    </div>
  );
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
