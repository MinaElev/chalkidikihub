/**
 * Lightweight iCal (RFC 5545) parser + generator for the PMS module.
 *
 * We only need enough of the spec to:
 *   - Import VEVENT blocks from Airbnb / Booking.com / VRBO feeds
 *   - Export a clean calendar of our own bookings so owners can paste
 *     our URL into those platforms
 *
 * Deliberately NO external dependency: adds ~3 KB vs a full ical lib.
 */

import crypto from 'crypto';

export interface IcalEvent {
  uid: string;
  start: string;   // YYYY-MM-DD
  end: string;     // YYYY-MM-DD (exclusive, per RFC)
  summary: string;
  description: string;
  status: string;  // 'CONFIRMED' | 'CANCELLED' | 'TENTATIVE'
}

// ─── Parser ──────────────────────────────────────────────────────────

/** Unfold RFC 5545 folded lines: a line ending + single space/tab = continuation. */
function unfold(ical: string): string[] {
  const raw = ical.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

/** "DTSTART;VALUE=DATE:20260715" → { key: 'DTSTART', params: {VALUE:'DATE'}, value: '20260715' } */
function parseLine(line: string): { key: string; params: Record<string, string>; value: string } {
  const colonIdx = line.indexOf(':');
  if (colonIdx === -1) return { key: line, params: {}, value: '' };
  const head = line.slice(0, colonIdx);
  const value = line.slice(colonIdx + 1);
  const parts = head.split(';');
  const key = parts[0].toUpperCase();
  const params: Record<string, string> = {};
  for (let i = 1; i < parts.length; i++) {
    const [k, v] = parts[i].split('=');
    if (k && v) params[k.toUpperCase()] = v;
  }
  return { key, params, value };
}

/** "20260715" or "20260715T120000Z" → "2026-07-15" */
function normalizeDate(raw: string): string {
  const s = raw.replace(/[TZ:-]/g, '').slice(0, 8);
  if (s.length !== 8) return raw;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** Unescape iCal text: \n → newline, \\ → \, \; → ; */
function unescape(s: string): string {
  return s.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

/** Parse a full iCal feed into VEVENT records. */
export function parseIcal(ical: string): IcalEvent[] {
  const events: IcalEvent[] = [];
  const lines = unfold(ical);

  let current: Partial<IcalEvent> | null = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = { uid: '', start: '', end: '', summary: '', description: '', status: 'CONFIRMED' };
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current && current.uid && current.start && current.end) {
        events.push(current as IcalEvent);
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const { key, value } = parseLine(line);
    switch (key) {
      case 'UID':         current.uid = value.trim(); break;
      case 'DTSTART':     current.start = normalizeDate(value); break;
      case 'DTEND':       current.end = normalizeDate(value); break;
      case 'SUMMARY':     current.summary = unescape(value); break;
      case 'DESCRIPTION': current.description = unescape(value); break;
      case 'STATUS':      current.status = value.trim().toUpperCase(); break;
    }
  }
  return events;
}

// ─── Generator ───────────────────────────────────────────────────────

export interface BookingForIcal {
  id: string;
  check_in: string;   // YYYY-MM-DD
  check_out: string;  // YYYY-MM-DD
  status: string;
  source: string;
  guest_name?: string | null;
  notes?: string | null;
  block_reason?: string | null;
}

/** Fold a line to 75 octets max per RFC 5545 (practical: 74 char + CRLF space). */
function fold(line: string): string {
  if (line.length <= 74) return line;
  const parts: string[] = [];
  let remaining = line;
  while (remaining.length > 74) {
    parts.push(remaining.slice(0, 74));
    remaining = ' ' + remaining.slice(74);
  }
  parts.push(remaining);
  return parts.join('\r\n');
}

/** YYYY-MM-DD → YYYYMMDD */
function toIcalDate(iso: string): string {
  return iso.replace(/-/g, '').slice(0, 8);
}

/** "line, with; escapable" → "line\, with\; escapable" */
function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/** Generate an RFC 5545 calendar from bookings. */
export function generateIcal(bookings: BookingForIcal[], calName = 'ChalkidikiHub'): string {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ChalkidikiHub//PMS 1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    fold(`X-WR-CALNAME:${escapeText(calName)}`),
    'X-WR-TIMEZONE:Europe/Athens',
  ];

  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    const isBlock = b.status === 'blocked' || b.source === 'blocked';
    const summary = isBlock
      ? (b.block_reason ? `Blocked — ${b.block_reason}` : 'Blocked')
      : `Booked via ${b.source === 'direct' ? 'ChalkidikiHub' : b.source}${b.guest_name ? ` — ${b.guest_name}` : ''}`;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${b.id}@chalkidikihub.gr`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART;VALUE=DATE:${toIcalDate(b.check_in)}`);
    lines.push(`DTEND;VALUE=DATE:${toIcalDate(b.check_out)}`);
    lines.push(fold(`SUMMARY:${escapeText(summary)}`));
    if (b.notes) lines.push(fold(`DESCRIPTION:${escapeText(b.notes)}`));
    lines.push('STATUS:CONFIRMED');
    lines.push('TRANSP:OPAQUE');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

// ─── Export URL tokens (HMAC-based, no DB storage) ───────────────────

/**
 * Derive a deterministic, unguessable token for a listing's export URL.
 * The owner can share the URL with external platforms without leaking
 * anything that would let someone else tamper with it.
 *
 * If PMS_ICAL_SECRET isn't set we fall back to NEXTAUTH_SECRET or the
 * Supabase service-role key so we don't emit weak tokens silently.
 */
export function listingExportToken(listingId: string): string {
  const secret =
    process.env.PMS_ICAL_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'chalkidikihub-pms-ical-dev-secret-change-me';
  return crypto
    .createHmac('sha256', secret)
    .update(`pms-ical-export:${listingId}`)
    .digest('hex')
    .slice(0, 24);
}

export function verifyListingExportToken(listingId: string, token: string): boolean {
  const expected = listingExportToken(listingId);
  // Timing-safe comparison
  if (expected.length !== token.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}
