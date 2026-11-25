'use client';

import { useSyncExternalStore } from 'react';

/**
 * The visitor's own name, email and phone from their last request, kept only
 * on their device (localStorage, never sent anywhere until they send a form),
 * so the next request is two taps on a calendar and "Send".
 */
export type GuestDetails = { name: string; email: string; phone: string };

const KEY = 'chub_guest_v1';
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: GuestDetails | null } = { raw: null, value: null };

function read(): GuestDetails | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch { /* blocked */ }
  if (raw !== cache.raw) {
    let value: GuestDetails | null = null;
    try {
      const v = JSON.parse(raw || 'null') as Partial<GuestDetails> | null;
      if (v?.name && v.email) value = { name: String(v.name), email: String(v.email), phone: String(v.phone || '') };
    } catch { /* corrupt */ }
    cache = { raw, value };
  }
  return cache.value;
}

function subscribe(l: () => void) {
  listeners.add(l);
  window.addEventListener('storage', l);
  return () => { listeners.delete(l); window.removeEventListener('storage', l); };
}

export function useGuestDetails(): GuestDetails | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function saveGuestDetails(d: GuestDetails | null) {
  try {
    if (d) localStorage.setItem(KEY, JSON.stringify(d));
    else localStorage.removeItem(KEY);
  } catch { /* ignore */ }
  listeners.forEach((l) => l());
}
