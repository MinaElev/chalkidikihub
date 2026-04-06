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
    <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-2xl p-4 md:p-6 shadow-xl">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
          <Search className="w-5 h-5" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </form>
  );
}
