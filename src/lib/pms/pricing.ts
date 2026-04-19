/**
 * PMS pricing engine
 * -----------------------------------------------------------------------
 * Given a listing base rate, a date range, and a set of pricing rules,
 * compute the nightly + total quote showing which rules applied and what
 * each contributed (so the owner can audit the price in the UI).
 *
 * Rule types (per migration 032):
 *   - seasonal:     applies on dates in [start_date, end_date]   — per night
 *   - weekend:      applies on weekdays in `weekdays[]`           — per night
 *   - custom:       generic; optional date window, else always    — per night
 *   - los_discount: when total_nights >= min_nights               — whole booking
 *   - last_minute:  when days_until_checkin <= days_before        — whole booking
 *
 * Operations: override | add | subtract | multiply
 *   is_percentage=true interprets `amount` as a % of the base (per-night
 *   rules) or the current subtotal (booking rules). is_percentage=false
 *   uses the literal euro amount.
 *
 * Higher `priority` wins when multiple rules apply to the same night.
 * Booking-scope rules apply after per-night rules are summed.
 */

export type RuleType = 'seasonal' | 'weekend' | 'los_discount' | 'last_minute' | 'custom';
export type Operation = 'override' | 'add' | 'subtract' | 'multiply';

export interface PricingRule {
  id: string;
  name: string;
  rule_type: RuleType;
  start_date: string | null;
  end_date: string | null;
  weekdays: number[] | null;
  min_nights: number | null;
  days_before: number | null;
  amount: number;
  is_percentage: boolean;
  operation: Operation;
  priority: number;
  active: boolean;
}

export interface QuoteInput {
  baseRate: number;
  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD
  bookingDate?: string; // YYYY-MM-DD, default = today UTC
  rules: PricingRule[];
}

export interface AppliedRule {
  rule_id: string;
  name: string;
  rule_type: RuleType;
  operation: Operation;
  scope: 'night' | 'booking';
  nights_affected: number;
  delta: number; // euro amount applied (signed: positive = price went up)
}

export interface Quote {
  base_rate: number;
  total_nights: number;
  subtotal_pre_rules: number;          // baseRate × nights
  subtotal_post_night_rules: number;   // after per-night seasonal/weekend/custom
  subtotal_post_booking_rules: number; // after LOS/last-minute
  nightly_average: number;             // post-rules total / nights
  applied: AppliedRule[];
}

function applyOp(current: number, baseForPct: number, op: Operation, amount: number, isPct: boolean): number {
  const delta = isPct ? baseForPct * (amount / 100) : amount;
  switch (op) {
    case 'override': return isPct ? baseForPct * (amount / 100) : amount;
    case 'add':      return current + delta;
    case 'subtract': return current - delta;
    case 'multiply': return current * amount;
  }
}

export function computeQuote({ baseRate, checkIn, checkOut, bookingDate, rules }: QuoteInput): Quote {
  const active = rules.filter(r => r.active);
  const perNight = active
    .filter(r => r.rule_type === 'seasonal' || r.rule_type === 'weekend' || r.rule_type === 'custom')
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const bookingScope = active
    .filter(r => r.rule_type === 'los_discount' || r.rule_type === 'last_minute')
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  const start = new Date(checkIn + 'T00:00:00Z');
  const end = new Date(checkOut + 'T00:00:00Z');
  const today = bookingDate || new Date().toISOString().slice(0, 10);
  const totalNights = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
  const daysUntilCheckin = Math.round(
    (start.getTime() - new Date(today + 'T00:00:00Z').getTime()) / 86_400_000,
  );

  let nightSum = 0;
  const tally = new Map<string, { rule: PricingRule; delta: number; nights: number }>();

  for (let i = 0; i < totalNights; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const weekday = d.getUTCDay();

    let rate = baseRate;
    for (const rule of perNight) {
      let applies = false;
      if (rule.rule_type === 'seasonal') {
        applies = !!(rule.start_date && rule.end_date && iso >= rule.start_date && iso <= rule.end_date);
      } else if (rule.rule_type === 'weekend') {
        applies = !!(rule.weekdays && rule.weekdays.includes(weekday));
      } else if (rule.rule_type === 'custom') {
        const okStart = !rule.start_date || iso >= rule.start_date;
        const okEnd = !rule.end_date || iso <= rule.end_date;
        applies = okStart && okEnd;
      }
      if (!applies) continue;

      const prev = rate;
      rate = Math.max(0, applyOp(rate, baseRate, rule.operation, Number(rule.amount), rule.is_percentage));
      const prevTally = tally.get(rule.id) || { rule, delta: 0, nights: 0 };
      prevTally.delta += (rate - prev);
      prevTally.nights += 1;
      tally.set(rule.id, prevTally);
    }
    nightSum += rate;
  }

  const subtotalPreRules = baseRate * totalNights;
  const subtotalPostNight = nightSum;
  let subtotalPostBooking = subtotalPostNight;

  for (const rule of bookingScope) {
    let applies = false;
    if (rule.rule_type === 'los_discount') {
      applies = rule.min_nights != null && totalNights >= rule.min_nights;
    } else if (rule.rule_type === 'last_minute') {
      applies = rule.days_before != null && daysUntilCheckin >= 0 && daysUntilCheckin <= rule.days_before;
    }
    if (!applies) continue;

    const prev = subtotalPostBooking;
    subtotalPostBooking = Math.max(0, applyOp(subtotalPostBooking, subtotalPostNight, rule.operation, Number(rule.amount), rule.is_percentage));
    tally.set(rule.id, { rule, delta: subtotalPostBooking - prev, nights: totalNights });
  }

  const applied: AppliedRule[] = Array.from(tally.values()).map(({ rule, delta, nights }) => ({
    rule_id: rule.id,
    name: rule.name,
    rule_type: rule.rule_type,
    operation: rule.operation,
    scope: (rule.rule_type === 'los_discount' || rule.rule_type === 'last_minute') ? 'booking' : 'night',
    nights_affected: nights,
    delta,
  }));

  return {
    base_rate: baseRate,
    total_nights: totalNights,
    subtotal_pre_rules: subtotalPreRules,
    subtotal_post_night_rules: subtotalPostNight,
    subtotal_post_booking_rules: subtotalPostBooking,
    nightly_average: totalNights > 0 ? subtotalPostBooking / totalNights : 0,
    applied,
  };
}
