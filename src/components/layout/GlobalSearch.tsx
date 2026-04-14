'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Search, X, MapPin, Waves, UtensilsCrossed, Landmark, FileText, Home, Loader2, Zap } from 'lucide-react';

interface SearchResult {
  type: 'listing' | 'beach' | 'restaurant' | 'activity' | 'blog' | 'charger';
  slug: string;
  title: string;
  subtitle: string;
  icon: typeof MapPin;
  color: string;
  href: string;
}

interface SearchApiItem {
  slug: string;
  name: Record<string, string>;
  location_name?: string;
  category?: string;
}

interface SearchApiResponse {
  beaches: SearchApiItem[];
  restaurants: SearchApiItem[];
  activities: SearchApiItem[];
  listings: SearchApiItem[];
  blog: SearchApiItem[];
}

const typeConfig = {
  listing: { icon: Home, color: 'text-primary-600 bg-primary-50', label: 'Κατάλυμα' },
  beach: { icon: Waves, color: 'text-cyan-600 bg-cyan-50', label: 'Παραλία' },
  restaurant: { icon: UtensilsCrossed, color: 'text-red-600 bg-red-50', label: 'Εστιατόριο' },
  activity: { icon: Landmark, color: 'text-amber-600 bg-amber-50', label: 'Δραστηριότητα' },
  blog: { icon: FileText, color: 'text-indigo-600 bg-indigo-50', label: 'Άρθρο' },
  charger: { icon: Zap, color: 'text-green-600 bg-green-50', label: 'Φορτιστής' },
};

function localizedName(name: Record<string, string>, locale: string): string {
  return name[locale] || name.el || name.en || '';
}

function mapResults(items: SearchApiItem[], type: SearchResult['type'], locale: string): SearchResult[] {
  const conf = typeConfig[type];
  const pathMap: Record<string, string> = {
    listing: 'listings',
    beach: 'beaches',
    restaurant: 'restaurants',
    activity: 'activities',
    blog: 'blog',
  };
  return items.map((item) => ({
    type,
    slug: item.slug,
    title: localizedName(item.name, locale),
    subtitle: item.location_name || item.category || '',
    icon: conf.icon,
    color: conf.color,
    href: `/${pathMap[type]}/${item.slug}`,
  }));
}

export function GlobalSearch() {
  const locale = useLocale();
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchResults = useCallback(
    (searchQuery: string) => {
      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();

      if (searchQuery.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const controller = new AbortController();
      abortRef.current = controller;

      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((data: SearchApiResponse) => {
          const found: SearchResult[] = [
            ...mapResults(data.listings, 'listing', locale),
            ...mapResults(data.beaches, 'beach', locale),
            ...mapResults(data.restaurants, 'restaurant', locale),
            ...mapResults(data.activities, 'activity', locale),
            ...mapResults(data.blog, 'blog', locale),
          ];
          setResults(found.slice(0, 15));
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setResults([]);
            setLoading(false);
          }
        });
    },
    [locale],
  );

  // Debounced search when query changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Show loading immediately so the user sees feedback
    setLoading(true);

    debounceRef.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger button */}
      <button onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">{t('search')}</span>
        <kbd className="hidden md:inline text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-300 text-gray-400">⌘K</kbd>
      </button>

      {/* Search modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Αναζήτηση καταλυμάτων, παραλιών, εστιατορίων..."
                className="flex-1 text-sm outline-none placeholder-gray-400"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-500">
                  {t('noResults')}
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="py-2">
                  {results.map((result, idx) => {
                    const Icon = result.icon;
                    const conf = typeConfig[result.type];
                    return (
                      <Link
                        key={`${result.type}-${result.slug}-${idx}`}
                        href={result.href}
                        onClick={() => { setOpen(false); setQuery(''); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${conf.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{result.title}</div>
                          <div className="text-xs text-gray-500 truncate">{result.subtitle}</div>
                        </div>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                          {conf.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {query.length < 2 && !loading && (
                <div className="py-6 text-center text-xs text-gray-400">
                  Πληκτρολογήστε τουλάχιστον 2 χαρακτήρες
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
