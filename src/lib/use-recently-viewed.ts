'use client';

import { useState, useEffect } from 'react';

export interface RecentItem {
  type: 'listing' | 'beach' | 'restaurant' | 'activity' | 'blog';
  slug: string;
  title: string;
  image?: string;
  timestamp: number;
}

const STORAGE_KEY = 'chub_recently_viewed';
const MAX_ITEMS = 10;

function getItems(): RecentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: Omit<RecentItem, 'timestamp'>) {
  if (typeof window === 'undefined') return;
  try {
    const items = getItems().filter((i) => !(i.type === item.type && i.slug === item.slug));
    items.unshift({ ...item, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {}
}

/**
 * Reads the recently-viewed list from localStorage. Returns `{ items, ready }`
 * — `ready` flips to true after the first useEffect tick, letting consumers
 * distinguish "still hydrating, no decision yet" from "definitely empty".
 * This is what lets the consumer reserve layout space and avoid CLS.
 */
export function useRecentlyViewed(excludeSlug?: string): { items: RecentItem[]; ready: boolean } {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Reading from localStorage is exactly the "external store" pattern
    // useEffect exists for, so the lint hint about cascading-render setState
    // doesn't apply here — both writes happen once at mount.
    const all = getItems();
    const next = excludeSlug ? all.filter((i) => i.slug !== excludeSlug) : all;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(next);
    setReady(true);
  }, [excludeSlug]);

  return { items, ready };
}
