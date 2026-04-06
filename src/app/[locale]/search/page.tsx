'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Search, Home, Waves, UtensilsCrossed, Landmark, FileText, MapPin, Star, Loader2 } from 'lucide-react';
import { Listing, Beach, Restaurant, Activity, BlogArticle } from '@/types';

type SearchResult = {
  type: 'listing' | 'beach' | 'restaurant' | 'activity' | 'blog';
  slug: string;
  title: string;
  subtitle: string;
  image?: string;
  rating?: number;
  href: string;
};

const typeConfig: Record<string, { icon: typeof Home; color: string; bgColor: string; label: string }> = {
  listing: { icon: Home, color: 'text-primary-600', bgColor: 'bg-primary-50', label: 'Κατάλυμα' },
  beach: { icon: Waves, color: 'text-cyan-600', bgColor: 'bg-cyan-50', label: 'Παραλία' },
  restaurant: { icon: UtensilsCrossed, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Εστιατόριο' },
  activity: { icon: Landmark, color: 'text-amber-600', bgColor: 'bg-amber-50', label: 'Δραστηριότητα' },
  blog: { icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-50', label: 'Άρθρο' },
};

// Normalize text: Greek→Latin transliteration + remove accents for fuzzy matching
function normalize(text: string): string {
  const greekToLatin: Record<string, string> = {
    'αι': 'e', 'ει': 'i', 'οι': 'i', 'ου': 'ou', 'αυ': 'av', 'ευ': 'ev',
    'μπ': 'b', 'ντ': 'nt', 'γκ': 'gk', 'γγ': 'ng', 'τσ': 'ts', 'τζ': 'tz',
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i',
    'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x',
    'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y',
    'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
    'ϊ': 'i', 'ϋ': 'y', 'ΐ': 'i', 'ΰ': 'y',
  };

  let result = text.toLowerCase();
  // Multi-char replacements first (sorted by length desc)
  const sorted = Object.entries(greekToLatin).sort((a, b) => b[0].length - a[0].length);
  for (const [gr, lat] of sorted) {
    result = result.split(gr).join(lat);
  }
  // Remove remaining non-ascii accents
  result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return result;
}

function fuzzyMatch(haystack: string, needle: string): boolean {
  const h = normalize(haystack);
  const n = normalize(needle);
  return h.includes(n);
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const locale = useLocale();
  const t = useTranslations('common');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (!query) { setLoading(false); return; }

    async function search() {
      setLoading(true);

      const [listings, beaches, restaurants, activities, articles] = await Promise.all([
        fetch('/api/listings').then((r) => r.json()).catch(() => []),
        fetch('/api/beaches').then((r) => r.json()).catch(() => []),
        fetch('/api/restaurants').then((r) => r.json()).catch(() => []),
        fetch('/api/activities').then((r) => r.json()).catch(() => []),
        fetch('/api/blog').then((r) => r.json()).catch(() => []),
      ]);

      const matched: SearchResult[] = [];

      // Search listings
      (listings as Listing[]).forEach((l) => {
        const title = l.title[locale] || l.title.en || l.title.el || '';
        const desc = l.description[locale] || l.description.en || '';
        const loc = l.location_name || '';
        if ([title, desc, loc, l.area].some((s) => fuzzyMatch(s, query))) {
          matched.push({
            type: 'listing', slug: l.slug, title,
            subtitle: `${loc} · ${l.area}`,
            image: l.images?.[0]?.image_url, href: `/listings/${l.slug}`,
          });
        }
      });

      // Search beaches
      (beaches as Beach[]).forEach((b) => {
        const name = b.name[locale] || b.name.en || '';
        const desc = b.description[locale] || b.description.en || '';
        if ([name, desc, b.location_name, b.area].some((s) => fuzzyMatch(s, query))) {
          matched.push({
            type: 'beach', slug: b.slug, title: name,
            subtitle: `${b.location_name} · ${b.rating.toFixed(1)}★`,
            image: b.image_url, rating: b.rating, href: `/beaches/${b.slug}`,
          });
        }
      });

      // Search restaurants
      (restaurants as Restaurant[]).forEach((r) => {
        const name = r.name[locale] || r.name.en || '';
        const desc = r.description[locale] || r.description.en || '';
        if ([name, desc, r.location_name, r.area, ...(r.tags || [])].some((s) => fuzzyMatch(s, query))) {
          matched.push({
            type: 'restaurant', slug: r.slug, title: name,
            subtitle: `${r.location_name} · ${r.rating.toFixed(1)}★`,
            image: r.image_url, rating: r.rating, href: `/restaurants/${r.slug}`,
          });
        }
      });

      // Search activities
      (activities as Activity[]).forEach((a) => {
        const name = a.name[locale] || a.name.en || '';
        const desc = a.description[locale] || a.description.en || '';
        if ([name, desc, a.location_name, a.area, a.category, ...(a.tags || [])].some((s) => fuzzyMatch(s, query))) {
          matched.push({
            type: 'activity', slug: a.slug, title: name,
            subtitle: `${a.location_name} · ${a.category}`,
            image: a.image_url, rating: a.rating, href: `/activities/${a.slug}`,
          });
        }
      });

      // Search blog
      (articles as BlogArticle[]).forEach((a) => {
        const title = a.title[locale] || a.title.en || a.title.el || '';
        const excerpt = a.excerpt[locale] || a.excerpt.en || '';
        if ([title, excerpt, ...(a.tags || [])].some((s) => fuzzyMatch(s, query))) {
          matched.push({
            type: 'blog', slug: a.slug, title,
            subtitle: `${a.author} · ${a.category}`,
            image: a.image_url, href: `/blog/${a.slug}`,
          });
        }
      });

      setResults(matched);
      setLoading(false);
    }

    search();
  }, [query, locale]);

  const filtered = filterType ? results.filter((r) => r.type === filterType) : results;

  // Count per type
  const typeCounts: Record<string, number> = {};
  results.forEach((r) => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `?q=${encodeURIComponent(searchInput.trim())}`;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Αναζήτηση σε καταλύματα, παραλίες, εστιατόρια, δραστηριότητες, blog..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
            {t('search')}
          </button>
        </div>
      </form>

      {/* Results header */}
      {query && !loading && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {results.length > 0
              ? `${results.length} αποτελέσματα για "${query}"`
              : `Δεν βρέθηκαν αποτελέσματα για "${query}"`}
          </h1>
        </div>
      )}

      {/* Type filter pills */}
      {results.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilterType('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !filterType ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            Όλα ({results.length})
          </button>
          {Object.entries(typeCounts).map(([type, count]) => {
            const config = typeConfig[type];
            return (
              <button key={type} onClick={() => setFilterType(filterType === type ? '' : type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === type ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {config?.label || type} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Results */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((result, i) => {
            const config = typeConfig[result.type];
            const Icon = config?.icon || MapPin;
            return (
              <Link key={`${result.type}-${result.slug}-${i}`} href={result.href}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group">
                {/* Image or icon */}
                {result.image ? (
                  <img src={result.image} alt={result.title} className="w-16 h-16 rounded-lg object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center shrink-0 ${config?.bgColor || 'bg-gray-50'}`}>
                    <Icon className={`w-6 h-6 ${config?.color || 'text-gray-400'}`} />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${config?.bgColor} ${config?.color}`}>
                      {config?.label}
                    </span>
                    {result.rating && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />{result.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 mt-1 truncate">{result.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* No results */}
      {!loading && !query && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">Αναζητήστε καταλύματα, παραλίες, εστιατόρια και πολλά ακόμα</p>
        </div>
      )}
    </div>
  );
}
