'use client';

import { useSyncExternalStore } from 'react';

/**
 * The dates a visitor picked on a listing page, shared by the availability
 * calendar (AvailabilityMonths) and the request form (InquiryForm), which sit
 * in different parts of the page. Picking on either one updates both.
 */
export type StayDates = { checkIn: string; checkOut: string; fromCalendar: boolean };

const EMPTY: StayDates = { checkIn: '', checkOut: '', fromCalendar: false };
let current = EMPTY;
const listeners = new Set<() => void>();

export function setStayDates(next: StayDates) {
  current = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useStayDates(): StayDates {
  return useSyncExternalStore(subscribe, () => current, () => EMPTY);
}

/** Every night from check-in up to (not including) check-out, as YYYY-MM-DD. */
export function nightsBetween(checkIn: string, checkOut: string): string[] {
  const out: string[] = [];
  for (let t = Date.parse(checkIn); t < Date.parse(checkOut); t += 86_400_000) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}
