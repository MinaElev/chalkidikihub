'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, FileText, CheckCircle, XCircle, ImageIcon, ExternalLink, Sparkles, Search, Key } from 'lucide-react';

interface BlogArticle {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  title_de: string;
  title_sr: string;
  category: string;
  author: string;
  published_at: string;
  image_url: string;
  image_alt: string;
  meta_title_el: string;
  meta_title_en: string;
  meta_description_el: string;
}

export default function AdminBlogPage() {
  const locale = useLocale();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState('');
  const [kwGenerating, setKwGenerating] = useState(false);
  const [kwProgress, setKwProgress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSeo, setFilterSeo] = useState('');

  useEffect(() => { loadArticles(); }, []);

  async function handleAutoGenerate() {
    setGenerating(true); setGenResult('');
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/auto-blog', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token || ''}` },
      });
      const data = await res.json();
      if (data.success) {
        setGenResult(`AI created: "${data.title}" (${data.category}) — ${data.wordCount} words`);
        loadArticles();
      } else {
        setGenResult(`Error: ${data.error}`);
      }
    } catch (err) { setGenResult(`Error: ${(err as Error).message}`); }
    setGenerating(false);
  }

  async function handleKeywordArticles() {
    setKwGenerating(true); setKwProgress('Ξεκινάω...');
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      // Check how many remaining
      const statusRes = await fetch(`/api/admin/keyword-articles?token=${token}`);
      const status = await statusRes.json();
      if (status.remaining === 0) {
        setKwProgress(`✅ Όλα τα ${status.total} keyword articles υπάρχουν ήδη!`);
        setKwGenerating(false);
        return;
      }

      let created = 0;
      const total = status.remaining;

      // Generate one by one
      for (let i = 0; i < total; i++) {
        setKwProgress(`📝 Δημιουργία ${created + 1}/${total}... (Step 1: Ελληνικό κείμενο)`);

        // Step 1: Generate Greek article
        const step1Res = await fetch('/api/admin/keyword-articles', {
          method: 'POST', headers,
          body: JSON.stringify({ step: 1 }),
        });
        const step1 = await step1Res.json();
        if (step1.allDone || step1.exists) break;
        if (!step1.success) { setKwProgress(`❌ Error: ${step1.error}`); break; }

        setKwProgress(`🌐 Μετάφραση "${step1.title}" (${created + 1}/${total})... (Step 2: 7 γλώσσες)`);

        // Step 2: Translate + SEO
        const step2Res = await fetch('/api/admin/keyword-articles', {
          method: 'POST', headers,
          body: JSON.stringify({ step: 2, article_id: step1.article_id }),
        });
        const step2 = await step2Res.json();
        if (!step2.success) { setKwProgress(`❌ Error step2: ${step2.error}`); break; }

        created++;
        setKwProgress(`✅ ${created}/${total} — "${step1.title}" (${step1.category})`);

        // Small delay between articles
        if (i < total - 1) await new Promise(r => setTimeout(r, 2000));
      }

      setKwProgress(`🎉 Ολοκληρώθηκαν ${created} keyword articles!`);
      loadArticles();
    } catch (err) { setKwProgress(`❌ Error: ${(err as Error).message}`); }
    setKwGenerating(false);
  }

  async function loadArticles() {
    const supabase = createClient();
    const { data } = await supabase.from('blog_articles')
      .select('id, slug, title_el, title_en, title_de, title_sr, category, author, published_at, image_url, image_alt, meta_title_el, meta_title_en, meta_description_el')
      .order('published_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  }

  async function deleteArticle(id: string) {
    if (!confirm('Διαγραφή αυτού του άρθρου ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('blog_articles').delete().eq('id', id);
    loadArticles();
  }

  function getSeoStatus(a: BlogArticle) {
    const issues: string[] = [];
    if (!a.image_url) issues.push('Image');
    if (!a.image_alt) issues.push('Alt');
    if (!a.meta_title_el) issues.push('Meta EL');
    if (!a.meta_title_en) issues.push('Meta EN');
    if (!a.meta_description_el) issues.push('Desc EL');
    if (!a.title_en) issues.push('Title EN');
    if (!a.title_sr) issues.push('Title SR');
    if (!a.title_de) issues.push('Title DE');
    return issues;
  }

  const totalComplete = articles.filter(a => getSeoStatus(a).length === 0).length;

  // Extract unique categories from data
  const allCategories = [...new Set(articles.map(a => a.category).filter(Boolean))].sort();

  const filtered = articles.filter((a) => {
    if (filterCategory && a.category !== filterCategory) return false;
    if (filterSeo === 'complete' && getSeoStatus(a).length !== 0) return false;
    if (filterSeo === 'incomplete' && getSeoStatus(a).length === 0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.title_el?.toLowerCase().includes(q) || a.title_en?.toLowerCase().includes(q) ||
        a.slug?.toLowerCase().includes(q) || a.author?.toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Blog Articles ({filtered.length}/{articles.length})</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${totalComplete === articles.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            SEO: {totalComplete}/{articles.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleKeywordArticles} disabled={kwGenerating || generating}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 text-sm font-medium disabled:opacity-50"
            title="Δημιουργεί 20 SEO articles γύρω από bold keywords των χωριών. Κάθε article αναφέρει 15-25 τοποθεσίες που γίνονται αυτόματα internal links.">
            {kwGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            {kwGenerating ? 'Keywords...' : 'Keyword Articles'}
          </button>
          <button onClick={handleAutoGenerate} disabled={generating || kwGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-medium disabled:opacity-50"
            title="Δημιουργεί πλήρες article: κείμενο EL → μετάφραση 6 γλώσσες → SEO 7 γλώσσες → Unsplash photo → δημοσίευση. Κόστος: ~$0.05. Rotating θεματολογία.">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'AI Article'}
          </button>
          <Link href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium">
            <Plus className="w-4 h-4" />Add New
          </Link>
        </div>
      </div>

      {genResult && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${genResult.startsWith('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {genResult}
        </div>
      )}

      {kwProgress && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${kwProgress.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : kwProgress.includes('🎉') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
          {kwProgress}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση τίτλου, slug, συγγραφέα..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι κατηγορίες</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterSeo} onChange={(e) => setFilterSeo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλα τα SEO</option>
          <option value="complete">SEO OK ✓</option>
          <option value="incomplete">SEO ελλιπές ✗</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-red-50 border-b border-red-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Author</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Published</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">Image</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">SEO</th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((a) => {
              const issues = getSeoStatus(a);
              const isComplete = issues.length === 0;
              return (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{a.title_el}</div>
                  {a.title_en && <div className="text-xs text-gray-400">{a.title_en}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600 capitalize">{a.category}</td>
                <td className="px-4 py-3 text-gray-600">{a.author}</td>
                <td className="px-4 py-3 text-gray-600">{a.published_at ? new Date(a.published_at).toLocaleDateString('el') : '-'}</td>
                <td className="px-4 py-3 text-center">
                    {a.image_url ? (
                      <span className="inline-flex items-center gap-1 text-green-600"><ImageIcon className="w-3.5 h-3.5" />✓</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500"><ImageIcon className="w-3.5 h-3.5" />✗</span>
                    )}
                </td>
                <td className="px-4 py-3 text-center">
                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /></span>
                    ) : (
                      <span className="inline-flex items-center gap-1" title={issues.join(', ')}>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-[10px] text-red-500">{issues.length}</span>
                      </span>
                    )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/${locale}/blog/${a.slug || a.id}`} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-500" title="Preview">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link href={`/admin/blog/${a.id}/edit`}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteArticle(a.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">Δεν βρέθηκαν άρθρα</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
