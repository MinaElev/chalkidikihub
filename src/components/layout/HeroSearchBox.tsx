'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Search, MapPin } from 'lucide-react';

export function HeroSearchBox({ placeholder, buttonLabel }: { placeholder: string; buttonLabel: string }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 glass-card rounded-2xl p-2 md:p-2.5 shadow-2xl shadow-black/20">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white/15 transition-all"
          />
        </div>
        <button type="submit" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary-900 font-semibold rounded-xl hover:bg-primary-50 transition-all shadow-lg">
          <Search className="w-5 h-5" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </form>
  );
}
