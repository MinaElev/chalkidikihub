'use client';

import { useState, useEffect, useRef } from 'react';
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

const typeConfig = {
  listing: { icon: Home, color: 'text-primary-600 bg-primary-50', label: 'Κατάλυμα' },
  beach: { icon: Waves, color: 'text-cyan-600 bg-cyan-50', label: 'Παραλία' },
  restaurant: { icon: UtensilsCrossed, color: 'text-red-600 bg-red-50', label: 'Εστιατόριο' },
  activity: { icon: Landmark, color: 'text-amber-600 bg-amber-50', label: 'Δραστηριότητα' },
  blog: { icon: FileText, color: 'text-indigo-600 bg-indigo-50', label: 'Άρθρο' },
  charger: { icon: Zap, color: 'text-green-600 bg-green-50', label: 'Φορτιστής' },
};

export function GlobalSearch() {
  const locale = useLocale();
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Search when query changes
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }

    setLoading(true);
    const controller = new AbortController();

    // Fetch all content types in parallel
    Promise.all([
      fetch('/api/listings', { signal: controller.signal }).then(r => r.json()).catch(() => []),
      fetch('/api/beaches', { signal: controller.signal }).then(r => r.json()).catch(() => []),
      fetch('/api/restaurants', { signal: controller.signal }).then(r => r.json()).catch(() => []),
      fetch('/api/activities', { signal: controller.signal }).then(r => r.json()).catch(() => []),
      fetch('/api/blog', { signal: controller.signal }).then(r => r.json()).catch(() => []),
    ]).then(([listings, beaches, restaurants, activities, articles]) => {
      const q = query.toLowerCase();
      const found: SearchResult[] = [];

      // Search listings
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (listings as any[]).forEach((item: any) => {
        const title = item.title?.[locale] || item.title?.el || item.title?.en || '';
        const location = item.location_name || '';
        if (title.toLowerCase().includes(q) || location.toLowerCase().includes(q)) {
          found.push({ type: 'listing', slug: item.slug, title, subtitle: location, icon: Home, color: typeConfig.listing.color, href: `/listings/${item.slug}` });
        }
      });

      // Search beaches
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (beaches as any[]).forEach((item: any) => {
        const title = item.name?.[locale] || item.name?.el || item.name?.en || '';
        const location = item.location_name || '';
        if (title.toLowerCase().includes(q) || location.toLowerCase().includes(q)) {
          found.push({ type: 'beach', slug: item.slug, title, subtitle: location, icon: Waves, color: typeConfig.beach.color, href: `/beaches/${item.slug}` });
        }
      });

      // Search restaurants
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (restaurants as any[]).forEach((item: any) => {
        const title = item.name?.[locale] || item.name?.el || item.name?.en || '';
        const location = item.location_name || '';
        if (title.toLowerCase().includes(q) || location.toLowerCase().includes(q)) {
          found.push({ type: 'restaurant', slug: item.slug, title, subtitle: location, icon: UtensilsCrossed, color: typeConfig.restaurant.color, href: `/restaurants/${item.slug}` });
        }
      });

      // Search activities
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (activities as any[]).forEach((item: any) => {
        const title = item.name?.[locale] || item.name?.el || item.name?.en || '';
        const location = item.location_name || '';
        if (title.toLowerCase().includes(q) || location.toLowerCase().includes(q)) {
          found.push({ type: 'activity', slug: item.slug, title, subtitle: location, icon: Landmark, color: typeConfig.activity.color, href: `/activities/${item.slug}` });
        }
      });

      // Search blog
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (articles as any[]).forEach((item: any) => {
        const title = item.title?.[locale] || item.title?.el || item.title?.en || '';
        const excerpt = item.excerpt?.[locale] || item.excerpt?.el || '';
        if (title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q)) {
          found.push({ type: 'blog', slug: item.slug, title, subtitle: item.category || '', icon: FileText, color: typeConfig.blog.color, href: `/blog/${item.slug}` });
        }
      });

      setResults(found.slice(0, 10));
      setLoading(false);
    });

    return () => controller.abort();
  }, [query, locale]);

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
