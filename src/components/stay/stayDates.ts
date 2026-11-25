'use client';

import { useSyncExternalStore } from 'react';

/**
 * The dates a visitor picked on a listing page, shared by the availability
 * calendar (AvailabilityMonths) and the request form (InquiryForm), which sit
 * in different parts of the page. Picking on either one updates both.
 *
 * They also follow the visitor: kept on the device (localStorage), so the
 * next stay they open has the same dates filled in, until they pass.
 */
export type StayDates = { checkIn: string; checkOut: string; fromCalendar: boolean };

const KEY = 'chub_stay_dates_v1';
const EMPTY: StayDates = { checkIn: '', checkOut: '', fromCalendar: false };
let current: StayDates | null = null;
const listeners = new Set<() => void>();

/** Today in Greek time, like the calendar. */
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());

function load(): StayDates {
  if (current) return current;
  current = EMPTY;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null') as { checkIn?: string; checkOut?: string } | null;
    if (v?.checkIn && v.checkOut && v.checkIn >= today() && v.checkOut > v.checkIn) {
      current = { checkIn: v.checkIn, checkOut: v.checkOut, fromCalendar: false };
    }
  } catch { /* storage blocked or corrupt: start empty */ }
  return current;
}

export function setStayDates(next: StayDates) {
  current = next;
  try {
    if (next.checkIn && next.checkOut) localStorage.setItem(KEY, JSON.stringify({ checkIn: next.checkIn, checkOut: next.checkOut }));
    else if (!next.checkIn) localStorage.removeItem(KEY);
  } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useStayDates(): StayDates {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

/** Every night from check-in up to (not including) check-out, as YYYY-MM-DD. */
export function nightsBetween(checkIn: string, checkOut: string): string[] {
  const out: string[] = [];
  for (let t = Date.parse(checkIn); t < Date.parse(checkOut); t += 86_400_000) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}
