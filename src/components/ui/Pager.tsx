'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PAGE_SIZE = 25;

/**
 * Client-side paging over a list that is already in memory (admin tables of a
 * few hundred rows). `resetKey` is anything that changes when the search or a
 * filter changes. When it changes, the list goes back to page 1, with no
 * effect and no extra render.
 */
export function usePaged<T>(items: T[], resetKey = '', pageSize = PAGE_SIZE) {
  const [state, setState] = useState({ page: 1, key: resetKey });
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(state.key === resetKey ? state.page : 1, totalPages);
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize);
  const setPage = (p: number) => setState({ page: p, key: resetKey });
  return { page, setPage, totalPages, pageItems, total: items.length, pageSize };
}

interface PagerProps {
  page: number;
  total: number;
  pageSize?: number;
  onPage: (page: number) => void;
  className?: string;
}

/** Previous / next bar with "1–25 από 134". Renders nothing for a single page. */
export function Pager({ page, total, pageSize = PAGE_SIZE, onPage, className = '' }: PagerProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const go = (p: number) => {
    onPage(Math.min(totalPages, Math.max(1, p)));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const btn = 'flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent';
  return (
    <nav aria-label="Σελίδες" className={`flex items-center justify-between gap-2 mt-4 ${className}`}>
      <button type="button" onClick={() => go(page - 1)} disabled={page <= 1} className={btn}>
        <ChevronLeft className="w-4 h-4" /> Προηγούμενη
      </button>
      <span className="text-sm text-gray-500 tabular-nums">
        {from}–{to} από {total} · σελίδα {page}/{totalPages}
      </span>
      <button type="button" onClick={() => go(page + 1)} disabled={page >= totalPages} className={btn}>
        Επόμενη <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
