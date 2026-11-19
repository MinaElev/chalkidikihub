import { describe, expect, it } from 'vitest';
import { busyNights, checkIcalUrl, icalDate, isIcalText, isPrivateIp, maskIcalUrl, parseIcal, sourceForHost } from '@/lib/availability/ical';

const AIRBNB = [
  'BEGIN:VCALENDAR',
  'PRODID;X-RICAL-TZSOURCE=TZINFO:-//Airbnb Inc//Hosting Calendar 0.8.8//EN',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  'DTEND;VALUE=DATE:20270710',
  'DTSTART;VALUE=DATE:20270707',
  'UID:1418fb94e984-0f6ec9a3a3bd7b9a0b1c2d3e4f5a6b7c@air',
  ' bnb.com',
  'SUMMARY:Reserved',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'DTEND;VALUE=DATE:20270712',
  'DTSTART;VALUE=DATE:20270710',
  'UID:aa@airbnb.com',
  'SUMMARY:Airbnb (Not available)',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

describe('parseIcal', () => {
  it('reads Airbnb all-day events and unfolds long lines', () => {
    const ev = parseIcal(AIRBNB);
    expect(ev).toHaveLength(2);
    expect(ev[0]).toEqual({ uid: '1418fb94e984-0f6ec9a3a3bd7b9a0b1c2d3e4f5a6b7c@airbnb.com', start: '2027-07-07', end: '2027-07-10', status: 'CONFIRMED' });
  });

  it('treats a missing DTEND as one night and keeps STATUS', () => {
    const ev = parseIcal('BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:20270101\nSTATUS:CANCELLED\nEND:VEVENT\nEND:VCALENDAR');
    expect(ev).toEqual([{ uid: '', start: '2027-01-01', end: '2027-01-02', status: 'CANCELLED' }]);
  });

  it('drops events without a readable start', () => {
    expect(parseIcal('BEGIN:VEVENT\nDTSTART:garbage\nEND:VEVENT')).toEqual([]);
  });
});

describe('icalDate', () => {
  it('handles all-day, UTC and floating values', () => {
    expect(icalDate('20270707')).toBe('2027-07-07');
    expect(icalDate('20270706T220000Z')).toBe('2027-07-07'); // 01:00 in Athens (summer, UTC+3)
    expect(icalDate('20270707T140000')).toBe('2027-07-07');
    expect(icalDate('20270231')).toBeNull();
  });
});

describe('busyNights', () => {
  it('blocks nights, leaves the check-out day free and merges back-to-back stays', () => {
    expect(busyNights(parseIcal(AIRBNB), '2027-01-01', '2027-12-31')).toEqual([
      '2027-07-07', '2027-07-08', '2027-07-09', '2027-07-10', '2027-07-11',
    ]);
  });

  it('clips to the window and ignores cancelled events', () => {
    const ev = [
      { uid: 'a', start: '2027-07-07', end: '2027-07-10', status: 'CONFIRMED' },
      { uid: 'b', start: '2027-08-01', end: '2027-08-05', status: 'CANCELLED' },
    ];
    expect(busyNights(ev, '2027-07-08', '2027-07-08')).toEqual(['2027-07-08']);
  });

  it('crosses month and year ends', () => {
    const ev = [{ uid: 'a', start: '2027-12-30', end: '2028-01-02', status: 'CONFIRMED' }];
    expect(busyNights(ev, '2027-01-01', '2028-12-31')).toEqual(['2027-12-30', '2027-12-31', '2028-01-01']);
  });
});

describe('isIcalText', () => {
  it('accepts feeds (with BOM) and rejects HTML', () => {
    expect(isIcalText('﻿BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(isIcalText('<!doctype html><title>Log in</title>')).toBe(false);
  });
});

describe('checkIcalUrl', () => {
  it('accepts Airbnb and Booking.com export URLs', () => {
    const a = checkIcalUrl('https://www.airbnb.gr/calendar/ical/12345.ics?s=abc');
    expect(a.ok && a.source).toBe('airbnb');
    const b = checkIcalUrl(' https://admin.booking.com/hotel/hoteladmin/ical.html?t=abc ');
    expect(b.ok && b.source).toBe('booking');
  });

  it('rejects http, other hosts, look-alikes, ports and credentials', () => {
    expect(checkIcalUrl('http://www.airbnb.com/calendar/ical/1.ics')).toEqual({ ok: false, reason: 'https' });
    expect(checkIcalUrl('https://evil.com/airbnb.com.ics')).toEqual({ ok: false, reason: 'host' });
    expect(checkIcalUrl('https://airbnb.com.evil.com/x')).toEqual({ ok: false, reason: 'host' });
    expect(checkIcalUrl('https://notbooking.com/x')).toEqual({ ok: false, reason: 'host' });
    expect(checkIcalUrl('https://a.b.booking.com/x')).toEqual({ ok: false, reason: 'host' });
    expect(checkIcalUrl('https://127.0.0.1/x')).toEqual({ ok: false, reason: 'host' });
    expect(checkIcalUrl('https://www.airbnb.com:8443/x')).toEqual({ ok: false, reason: 'invalid' });
    expect(checkIcalUrl('https://u:p@www.airbnb.com/x')).toEqual({ ok: false, reason: 'invalid' });
    expect(checkIcalUrl('not a url')).toEqual({ ok: false, reason: 'invalid' });
  });

  it('knows the platform hosts', () => {
    expect(sourceForHost('airbnb.co.uk')).toBe('airbnb');
    expect(sourceForHost('ical.booking.com')).toBe('booking');
    expect(sourceForHost('airbnb.example')).toBeNull();
  });
});

describe('isPrivateIp', () => {
  it('blocks internal ranges and allows public ones', () => {
    for (const ip of ['127.0.0.1', '10.1.2.3', '172.20.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '::1', 'fd00::1', 'fe80::1', '::ffff:127.0.0.1']) {
      expect(isPrivateIp(ip), ip).toBe(true);
    }
    for (const ip of ['54.230.1.1', '172.32.0.1', '2a02:26f0::1']) expect(isPrivateIp(ip), ip).toBe(false);
  });
});

describe('maskIcalUrl', () => {
  it('hides the private token', () => {
    expect(maskIcalUrl('https://www.airbnb.com/calendar/ical/123.ics?s=secrettoken99')).toBe('www.airbnb.com/…oken99');
  });
});
