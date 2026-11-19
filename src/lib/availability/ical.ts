/**
 * iCal import for owner availability: parse Airbnb / Booking.com export
 * feeds into busy nights, and validate the URLs owners paste in.
 *
 * Pure functions only (no network, no DB), so they are unit-tested in
 * tests/ical.test.ts. The fetch + DB write lives in ical-sync.ts.
 */

export interface IcalEvent {
  uid: string;
  start: string; // YYYY-MM-DD, first night
  end: string; // YYYY-MM-DD, check-out day (exclusive, per RFC 5545)
  status: string;
}

/** Unfold RFC 5545 folded lines: a line break followed by a space or tab continues the line. */
function unfold(text: string): string[] {
  const out: string[] = [];
  for (const line of text.replace(/\r\n?/g, '\n').split('\n')) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length) out[out.length - 1] += line.slice(1);
    else out.push(line);
  }
  return out;
}

/** "DTSTART;VALUE=DATE:20260715" → key DTSTART, params {VALUE: 'DATE'}, value 20260715 */
function parseLine(line: string): { key: string; params: Record<string, string>; value: string } {
  const colon = line.indexOf(':');
  if (colon === -1) return { key: line.trim().toUpperCase(), params: {}, value: '' };
  const [key, ...rest] = line.slice(0, colon).split(';');
  const params: Record<string, string> = {};
  for (const p of rest) {
    const eq = p.indexOf('=');
    if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1);
  }
  return { key: key.trim().toUpperCase(), params, value: line.slice(colon + 1).trim() };
}

const athensDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit' });

/**
 * iCal date or date-time → YYYY-MM-DD. All-day values (Airbnb, Booking.com)
 * are taken as-is; UTC date-times ("…Z") are converted to the Greek calendar
 * day; floating / TZID date-times keep their local date. Null if unreadable.
 */
export function icalDate(value: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(value);
  if (!m) return null;
  const [, y, mo, d, hh, mi, ss, z] = m;
  if (z) {
    const t = Date.UTC(+y, +mo - 1, +d, +hh, +mi, +(ss ?? 0));
    return Number.isNaN(t) ? null : athensDate.format(new Date(t));
  }
  const t = Date.UTC(+y, +mo - 1, +d);
  const iso = `${y}-${mo}-${d}`;
  return new Date(t).toISOString().slice(0, 10) === iso ? iso : null;
}

/** Parse VEVENTs. Events without a start are dropped; a missing end means one night. */
export function parseIcal(text: string): IcalEvent[] {
  const events: IcalEvent[] = [];
  let cur: { uid: string; start: string | null; end: string | null; status: string } | null = null;
  for (const line of unfold(text)) {
    const upper = line.trim().toUpperCase();
    if (upper === 'BEGIN:VEVENT') {
      cur = { uid: '', start: null, end: null, status: 'CONFIRMED' };
      continue;
    }
    if (upper === 'END:VEVENT') {
      if (cur?.start) events.push({ uid: cur.uid, start: cur.start, end: cur.end ?? addDays(cur.start, 1), status: cur.status });
      cur = null;
      continue;
    }
    if (!cur) continue;
    const { key, value } = parseLine(line);
    if (key === 'UID') cur.uid = value;
    else if (key === 'DTSTART') cur.start = icalDate(value);
    else if (key === 'DTEND') cur.end = icalDate(value);
    else if (key === 'STATUS') cur.status = value.toUpperCase();
  }
  return events;
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Busy nights between `from` and `to` (inclusive), sorted. The check-out day
 * is free, so a guest leaving on the 10th and the next arriving on the 10th
 * do not overlap. Cancelled events are ignored.
 */
export function busyNights(events: IcalEvent[], from: string, to: string): string[] {
  const days = new Set<string>();
  for (const ev of events) {
    if (ev.status === 'CANCELLED') continue;
    const end = ev.end > ev.start ? ev.end : addDays(ev.start, 1);
    let d = ev.start < from ? from : ev.start;
    while (d < end && d <= to) {
      days.add(d);
      d = addDays(d, 1);
    }
  }
  return [...days].sort();
}

/** Does the text look like an iCal feed at all (vs. an HTML login page)? */
export function isIcalText(text: string): boolean {
  return /^\s*BEGIN:VCALENDAR/i.test(text.replace(/^﻿/, ''));
}

// ─── URL validation (SSRF guard) ────────────────────────────────────────

export type IcalSource = 'airbnb' | 'booking';

/**
 * Only the platforms owners actually export from. airbnb.com and its
 * country domains (airbnb.gr, airbnb.co.uk, …), booking.com and its
 * subdomains (admin.booking.com, ical.booking.com).
 */
export function sourceForHost(hostname: string): IcalSource | null {
  const h = hostname.toLowerCase().replace(/\.$/, '');
  if (/^(www\.)?airbnb\.(com|gr|de|fr|it|es|nl|at|ch|be|ie|pt|pl|ru|ro|bg|rs|ca|com\.au|co\.uk)$/.test(h)) return 'airbnb';
  if (h === 'booking.com' || /^[a-z0-9-]+\.booking\.com$/.test(h)) return 'booking';
  return null;
}

export type UrlCheck = { ok: true; url: URL; source: IcalSource } | { ok: false; reason: 'invalid' | 'https' | 'host' };

export function checkIcalUrl(raw: string): UrlCheck {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (url.protocol !== 'https:') return { ok: false, reason: 'https' };
  if (url.username || url.password || (url.port && url.port !== '443')) return { ok: false, reason: 'invalid' };
  if (raw.length > 2000) return { ok: false, reason: 'invalid' };
  const source = sourceForHost(url.hostname);
  if (!source) return { ok: false, reason: 'host' };
  url.hash = '';
  return { ok: true, url, source };
}

/** True for loopback, private, link-local, CGNAT, multicast and other non-public addresses. */
export function isPrivateIp(ip: string): boolean {
  const v4 = /^(?:::ffff:)?(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i.exec(ip);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0 && Number(v4[3]) === 0) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  const h = ip.toLowerCase();
  if (h === '::' || h === '::1') return true;
  if (h.startsWith('::ffff:')) return true; // mapped form we could not read as v4
  return /^(fc|fd|fe[89ab]|ff)/.test(h) || h.startsWith('64:ff9b:') || h.startsWith('2001:db8:');
}

/** For the owner UI: host plus a masked path, so the private token is not shown back. */
export function maskIcalUrl(raw: string): string {
  try {
    const u = new URL(raw);
    const tail = (u.pathname + u.search).slice(-6);
    return `${u.hostname}/…${tail}`;
  } catch {
    return '…';
  }
}
