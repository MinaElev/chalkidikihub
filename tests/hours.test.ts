import { describe, expect, it } from 'vitest';
import { localizeToken, parseHours } from '@/lib/content/hours';

describe('parseHours', () => {
  it('converts Google hours to 24h and merges equal days', () => {
    const rows = parseHours(
      'Monday: 5:30 AM – 3:00 PM, Tuesday: 5:30 AM – 3:00 PM, Wednesday: 5:30 AM – 3:00 PM, Thursday: 5:30 AM – 3:00 PM, Friday: 5:30 AM – 3:00 PM, Saturday: 7:00 AM – 1:00 PM, Sunday: Closed',
      'en',
    );
    expect(rows).toEqual([
      { days: 'Mon–Fri', time: '05:30–15:00' },
      { days: 'Sat', time: '07:00–13:00' },
      { days: 'Sun', time: 'Closed' },
    ]);
  });
  it('collapses a whole week into "daily"', () => {
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      .map((d) => `${d}: 9:00 AM – 1:00 AM`).join(', ');
    expect(parseHours(week, 'el')).toEqual([{ days: 'Καθημερινά', time: '09:00–01:00' }]);
  });
  it('keeps simple ranges', () => {
    expect(parseHours('10:00-22:00', 'de')).toEqual([{ days: 'Täglich', time: '10:00–22:00' }]);
  });
});

describe('localizeToken', () => {
  it('translates stored English tokens', () => {
    expect(localizeToken('From 30€/person', 'el')).toBe('Από 30€/άτομο');
    expect(localizeToken('1-2h', 'ru')).toBe('1–2 ч');
    expect(localizeToken('Free', 'bg')).toBe('Безплатно');
    expect(localizeToken('Half day', 'de')).toBe('Halber Tag');
  });
});
