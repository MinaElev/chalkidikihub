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

export function useRecentlyViewed(excludeSlug?: string): RecentItem[] {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const all = getItems();
    setItems(excludeSlug ? all.filter((i) => i.slug !== excludeSlug) : all);
  }, [excludeSlug]);

  return items;
}
