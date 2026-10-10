'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { BarChart3, Loader2, AlertTriangle, CheckCircle, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface PageScore {
  type: string;
  slug: string;
  name: string;
  inbound: number;   // how many pages link TO this
  outbound: number;  // how many pages THIS links to
  score: number;      // combined score
  descriptionLength: number;
  hasAutoLinks: boolean; // description mentions other content names
}

export default function InterlinkingPage() {
  const [pages, setPages] = useState<PageScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [improving, setImproving] = useState<string | null>(null);
  const [improved, setImproved] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'weak' | 'orphan'>('all');

  useEffect(() => { analyze(); }, []);

  async function analyze() {
    setLoading(true);
    const supabase = createClient();

    // Fetch all content
    const [beaches, restaurants, activities, blogs] = await Promise.all([
      supabase.from('beaches').select('slug, name_el, description_el'),
      supabase.from('restaurants').select('slug, name_el, description_el'),
      supabase.from('activities').select('slug, name_el, description_el'),
      supabase.from('blog_articles').select('slug, title_el, content_el, related_beach_slugs, related_area_slugs, related_listing_slugs, related_article_slugs, related_restaurant_slugs, related_activity_slugs'),
    ]);

    // Build name index
    const allNames: Array<{ type: string; slug: string; name: string }> = [];
    (beaches.data || []).forEach(b => allNames.push({ type: 'beach', slug: b.slug, name: b.name_el || '' }));
    (restaurants.data || []).forEach(r => allNames.push({ type: 'restaurant', slug: r.slug, name: r.name_el || '' }));
    (activities.data || []).forEach(a => allNames.push({ type: 'activity', slug: a.slug, name: a.name_el || '' }));
    (blogs.data || []).forEach(b => allNames.push({ type: 'blog', slug: b.slug, name: b.title_el || '' }));

    // Count inbound links from blog related_slugs
    const inboundMap = new Map<string, number>();
    (blogs.data || []).forEach(blog => {
      const allSlugs = [
        ...(blog.related_beach_slugs || []),
        ...(blog.related_area_slugs || []),
        ...(blog.related_listing_slugs || []),
        ...(blog.related_article_slugs || []),
        ...(blog.related_restaurant_slugs || []),
        ...(blog.related_activity_slugs || []),
      ];
      allSlugs.forEach(s => inboundMap.set(s, (inboundMap.get(s) || 0) + 1));
    });

    // Count outbound links + mentions in descriptions
    const scores: PageScore[] = [];

    // Beaches
    (beaches.data || []).forEach(b => {
      const desc = b.description_el || '';
      const mentions = allNames.filter(n => n.slug !== b.slug && n.name.length >= 3 && desc.includes(n.name)).length;
      scores.push({
        type: 'beach', slug: b.slug, name: b.name_el || b.slug,
        inbound: inboundMap.get(b.slug) || 0,
        outbound: mentions,
        score: (inboundMap.get(b.slug) || 0) + mentions,
        descriptionLength: desc.length,
        hasAutoLinks: mentions > 0,
      });
    });

    // Restaurants
    (restaurants.data || []).forEach(r => {
      const desc = r.description_el || '';
      const mentions = allNames.filter(n => n.slug !== r.slug && n.name.length >= 3 && desc.includes(n.name)).length;
      scores.push({
        type: 'restaurant', slug: r.slug, name: r.name_el || r.slug,
        inbound: inboundMap.get(r.slug) || 0,
        outbound: mentions,
        score: (inboundMap.get(r.slug) || 0) + mentions,
        descriptionLength: desc.length,
        hasAutoLinks: mentions > 0,
      });
    });

    // Activities
    (activities.data || []).forEach(a => {
      const desc = a.description_el || '';
      const mentions = allNames.filter(n => n.slug !== a.slug && n.name.length >= 3 && desc.includes(n.name)).length;
      scores.push({
        type: 'activity', slug: a.slug, name: a.name_el || a.slug,
        inbound: inboundMap.get(a.slug) || 0,
        outbound: mentions,
        score: (inboundMap.get(a.slug) || 0) + mentions,
        descriptionLength: desc.length,
        hasAutoLinks: mentions > 0,
      });
    });

    // Blog articles
    (blogs.data || []).forEach(b => {
      const content = b.content_el || '';
      const outbound = [
        ...(b.related_beach_slugs || []),
        ...(b.related_area_slugs || []),
        ...(b.related_listing_slugs || []),
        ...(b.related_article_slugs || []),
        ...(b.related_restaurant_slugs || []),
        ...(b.related_activity_slugs || []),
      ].length;
      const mentions = allNames.filter(n => n.slug !== b.slug && n.name.length >= 3 && content.includes(n.name)).length;
      scores.push({
        type: 'blog', slug: b.slug, name: b.title_el || b.slug,
        inbound: inboundMap.get(b.slug) || 0,
        outbound: outbound + mentions,
        score: (inboundMap.get(b.slug) || 0) + outbound + mentions,
        descriptionLength: content.length,
        hasAutoLinks: mentions > 0,
      });
    });

    scores.sort((a, b) => a.score - b.score);
    setPages(scores);
    setLoading(false);
  }

  async function aiImproveDescription(page: PageScore) {
    setImproving(page.slug);
    try {
      const supabase = createClient();
      const table = page.type === 'blog' ? 'blog_articles' : page.type === 'beach' ? 'beaches' : page.type === 'restaurant' ? 'restaurants' : 'activities';
      const descField = page.type === 'blog' ? 'content_el' : 'description_el';

      const { data } = await supabase.from(table).select(`${descField}`).eq('slug', page.slug).single();
      if (!data) { setImproving(null); return; }
      const currentDesc = (data as Record<string, string>)[descField] || '';

      // Get nearby content names to weave in
      const nearbyNames = pages
        .filter(p => p.slug !== page.slug && p.name.length >= 3)
        .sort(() => Math.random() - 0.5)
        .slice(0, 15)
        .map(p => `${p.name} (${p.type})`);

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'format_content',
          content: `Ξαναγράψε αυτό το κείμενο ώστε να αναφέρει ΦΥΣΙΚΑ (μέσα σε προτάσεις, όχι ως λίστα) τουλάχιστον 3-5 από τα ακόλουθα τοπικά σημεία ενδιαφέροντος: ${nearbyNames.join(', ')}.

Κράτα το νόημα ίδιο, αλλά πρόσθεσε αναφορές σε κοντινές παραλίες, εστιατόρια ή δραστηριότητες ώστε να δημιουργηθούν internal links.

Πρωτότυπο κείμενο:
${currentDesc}`,
          lang: 'el',
        }),
      });

      if (res.ok) {
        const aiData = await res.json();
        if (aiData.formatted) {
          await supabase.from(table).update({ [descField]: aiData.formatted }).eq('slug', page.slug);
          setImproved(prev => ({ ...prev, [page.slug]: 'Βελτιώθηκε!' }));
        }
      }
    } catch {}
    setImproving(null);
  }

  const filtered = filter === 'orphan' ? pages.filter(p => p.inbound === 0 && p.outbound === 0)
    : filter === 'weak' ? pages.filter(p => p.score < 3)
    : pages;

  const avgScore = pages.length > 0 ? (pages.reduce((s, p) => s + p.score, 0) / pages.length).toFixed(1) : '0';
  const orphans = pages.filter(p => p.score === 0).length;
  const strong = pages.filter(p => p.score >= 5).length;

  const typeColors: Record<string, string> = {
    beach: 'bg-cyan-100 text-cyan-700',
    restaurant: 'bg-red-100 text-red-700',
    activity: 'bg-amber-100 text-amber-700',
    blog: 'bg-indigo-100 text-indigo-700',
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Interlinking Score</h1>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{pages.length}</div>
          <div className="text-xs text-gray-500">Σελίδες</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary-600">{avgScore}</div>
          <div className="text-xs text-gray-500">Μέσο Score</div>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{orphans}</div>
          <div className="text-xs text-gray-500">Ορφανές (0 links)</div>
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{strong}</div>
          <div className="text-xs text-gray-500">Δυνατές (5+ links)</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all' as const, label: `Όλες (${pages.length})` },
          { key: 'weak' as const, label: `Αδύναμες <3 (${pages.filter(p => p.score < 3).length})` },
          { key: 'orphan' as const, label: `Ορφανές 0 (${orphans})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{f.label}</button>
        ))}
      </div>

      {/* Pages table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Σελίδα</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-gray-500">Inbound</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-gray-500">Outbound</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-gray-500">Score</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-gray-500">Chars</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((page) => (
                <tr key={`${page.type}-${page.slug}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${typeColors[page.type] || 'bg-gray-100 text-gray-600'}`}>{page.type}</span>
                      <span className="text-sm text-gray-900 truncate max-w-[200px]">{page.name}</span>
                    </div>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span className={`text-sm font-medium ${page.inbound > 0 ? 'text-green-600' : 'text-red-500'}`}>{page.inbound}</span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span className={`text-sm font-medium ${page.outbound > 0 ? 'text-green-600' : 'text-red-500'}`}>{page.outbound}</span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      page.score >= 5 ? 'bg-green-100 text-green-700' :
                      page.score >= 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{page.score}</span>
                  </td>
                  <td className="text-center px-3 py-3 text-xs text-gray-500">{page.descriptionLength}</td>
                  <td className="text-right px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {improved[page.slug] && (
                        <span className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />{improved[page.slug]}</span>
                      )}
                      {page.score < 3 && page.descriptionLength > 50 && (
                        <button onClick={() => aiImproveDescription(page)} disabled={improving === page.slug}
                          className="flex items-center gap-1 px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-[10px] font-medium disabled:opacity-50">
                          {improving === page.slug ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          AI Βελτίωση
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Πώς λειτουργεί:</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• <strong>Inbound</strong>: πόσες σελίδες αναφέρουν/link αυτή τη σελίδα</li>
          <li>• <strong>Outbound</strong>: πόσες άλλες σελίδες αναφέρονται μέσα στην περιγραφή</li>
          <li>• <strong>Score</strong>: inbound + outbound — υψηλότερο = καλύτερο SEO</li>
          <li>• <strong className="text-green-600">5+</strong> = Δυνατή, <strong className="text-amber-600">2-4</strong> = OK, <strong className="text-red-600">0-1</strong> = Αδύναμη</li>
          <li>• <strong>AI Βελτίωση</strong>: ξαναγράφει την περιγραφή ώστε να αναφέρει φυσικά κοντινά σημεία ενδιαφέροντος</li>
          <li>• Τα αναφερόμενα ονόματα γίνονται αυτόματα clickable links μέσω AutoLinkedContent</li>
        </ul>
      </div>
    </div>
  );
}
