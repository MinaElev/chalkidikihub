/**
 * PMS settings — resolve effective per-listing values.
 * -----------------------------------------------------------------------
 * Owner defaults live in `pms_owner_settings`. Per-listing overrides live
 * in `pms_listing_settings`, where a NULL column means "inherit from
 * owner". `resolveListingSettings` returns the merged view.
 *
 * Only the fields that genuinely vary listing-by-listing are mirrored
 * (times, nights, prep, cancellation, deposit, cleaning cost). Tax/Stripe/
 * notifications stay strictly owner-wide.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export interface OwnerSettingsLike {
  instant_book?: boolean | null;
  min_nights_default?: number | null;
  max_nights_default?: number | null;
  advance_notice_hours?: number | null;
  preparation_days?: number | null;
  checkin_time?: string | null;
  checkout_time?: string | null;
  cancellation_policy?: string | null;
  cancellation_policy_text?: string | null;
  deposit_percentage?: number | null;
  balance_due_days_before?: number | null;
  cleaning_default_cost?: number | null;
  cleaning_lead_days?: number | null;
}

export interface ListingSettingsRow {
  listing_id: string;
  owner_id: string;
  instant_book: boolean | null;
  min_nights: number | null;
  max_nights: number | null;
  advance_notice_hours: number | null;
  preparation_days: number | null;
  checkin_time: string | null;
  checkout_time: string | null;
  cancellation_policy: string | null;
  cancellation_policy_text: string | null;
  deposit_percentage: number | null;
  balance_due_days_before: number | null;
  cleaning_default_cost: number | null;
  cleaning_lead_days: number | null;
}

export interface EffectiveSettings {
  instant_book: boolean;
  min_nights: number;
  max_nights: number | null;
  advance_notice_hours: number;
  preparation_days: number;
  checkin_time: string;
  checkout_time: string;
  cancellation_policy: string;
  cancellation_policy_text: string | null;
  deposit_percentage: number;
  balance_due_days_before: number;
  cleaning_default_cost: number | null;
  cleaning_lead_days: number;
}

const HARD_DEFAULTS: EffectiveSettings = {
  instant_book: false,
  min_nights: 1,
  max_nights: null,
  advance_notice_hours: 24,
  preparation_days: 0,
  checkin_time: '15:00',
  checkout_time: '11:00',
  cancellation_policy: 'moderate',
  cancellation_policy_text: null,
  deposit_percentage: 20,
  balance_due_days_before: 14,
  cleaning_default_cost: null,
  cleaning_lead_days: 0,
};

function pick<T>(...values: (T | null | undefined)[]): T {
  for (const v of values) {
    if (v !== null && v !== undefined) return v;
  }
  // We always end with a hard default, so this is unreachable in practice.
  return values[values.length - 1] as T;
}

/**
 * Merge owner defaults + listing overrides into the final effective view.
 * Accepts partial/null inputs so callers can pass whatever they have.
 */
export function mergeSettings(
  owner: OwnerSettingsLike | null,
  listing: Partial<ListingSettingsRow> | null,
): EffectiveSettings {
  return {
    instant_book:          pick(listing?.instant_book, owner?.instant_book, HARD_DEFAULTS.instant_book),
    min_nights:            pick(listing?.min_nights, owner?.min_nights_default, HARD_DEFAULTS.min_nights),
    max_nights:            pick(listing?.max_nights, owner?.max_nights_default, HARD_DEFAULTS.max_nights),
    advance_notice_hours:  pick(listing?.advance_notice_hours, owner?.advance_notice_hours, HARD_DEFAULTS.advance_notice_hours),
    preparation_days:      pick(listing?.preparation_days, owner?.preparation_days, HARD_DEFAULTS.preparation_days),
    checkin_time:          pick(listing?.checkin_time, owner?.checkin_time, HARD_DEFAULTS.checkin_time),
    checkout_time:         pick(listing?.checkout_time, owner?.checkout_time, HARD_DEFAULTS.checkout_time),
    cancellation_policy:   pick(listing?.cancellation_policy, owner?.cancellation_policy, HARD_DEFAULTS.cancellation_policy),
    cancellation_policy_text: pick(listing?.cancellation_policy_text, owner?.cancellation_policy_text, HARD_DEFAULTS.cancellation_policy_text),
    deposit_percentage:    pick(listing?.deposit_percentage, owner?.deposit_percentage, HARD_DEFAULTS.deposit_percentage),
    balance_due_days_before: pick(listing?.balance_due_days_before, owner?.balance_due_days_before, HARD_DEFAULTS.balance_due_days_before),
    cleaning_default_cost: pick(listing?.cleaning_default_cost, owner?.cleaning_default_cost, HARD_DEFAULTS.cleaning_default_cost),
    cleaning_lead_days:    pick(listing?.cleaning_lead_days, owner?.cleaning_lead_days, HARD_DEFAULTS.cleaning_lead_days),
  };
}

/**
 * Fetch both rows and return the merged effective settings for a listing.
 * Caller-supplied `supabase` honours whatever auth context it was built with
 * (RLS-scoped client for owner calls, service client for crons).
 */
export async function resolveListingSettings(
  supabase: SupabaseClient,
  listingId: string,
  ownerId: string,
): Promise<EffectiveSettings> {
  const [{ data: owner }, { data: listing }] = await Promise.all([
    supabase.from('pms_owner_settings').select('*').eq('owner_id', ownerId).maybeSingle(),
    supabase.from('pms_listing_settings').select('*').eq('listing_id', listingId).maybeSingle(),
  ]);
  return mergeSettings(owner as OwnerSettingsLike | null, listing as Partial<ListingSettingsRow> | null);
}
