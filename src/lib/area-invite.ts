import 'server-only';
import { adminDb } from '@/lib/supabase/clients';
import { areaInviteToken, listingArea, readAreaInvite } from '@/lib/inquiry';

/**
 * What an "ask the whole area" link stands for: the guest's own listing
 * request, reloaded from the database, and the area of that listing.
 */
export type AreaInvite = {
  inquiryId: string;
  listingId: string;
  area: string;
  name: string;
  email: string;
  phone: string | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  locale: string;
  /** Set when the guest already sent this area request: their tracking token. */
  existing: string | null;
  /** The dates have started or passed. */
  past: boolean;
};

export async function loadAreaInvite(token: string): Promise<AreaInvite | null> {
  const id = readAreaInvite(token);
  if (!id) return null;
  const db = adminDb();
  const { data: row } = await db
    .from('listing_inquiries')
    .select('id, listing_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, locale')
    .eq('id', id)
    .maybeSingle();
  if (!row?.check_in || !row.check_out) return null;
  const area = await listingArea(row.listing_id);
  if (!area) return null;

  const { data: prev } = await db
    .from('availability_requests')
    .select('public_token')
    .eq('guest_email', String(row.guest_email).toLowerCase())
    .eq('area', area)
    .eq('check_in', row.check_in)
    .eq('check_out', row.check_out)
    .limit(1)
    .maybeSingle();

  const today = new Date().toISOString().slice(0, 10);
  return {
    inquiryId: row.id,
    listingId: row.listing_id,
    area,
    name: row.guest_name,
    email: String(row.guest_email).toLowerCase(),
    phone: row.guest_phone || null,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: Math.max(1, row.guests || 1),
    locale: row.locale || 'en',
    existing: prev?.public_token ?? null,
    past: row.check_in <= today,
  };
}

/**
 * The "ask the whole area" link for a guest email, or null when it can't
 * work: area unknown, dates started, or this area request was already sent.
 */
export async function areaInviteLink(inquiryId: string, siteUrl: string, locale: string): Promise<{ url: string; area: string } | null> {
  const token = areaInviteToken(inquiryId);
  const invite = await loadAreaInvite(token);
  if (!invite || invite.past || invite.existing) return null;
  return { url: `${siteUrl}${locale === 'el' ? '' : `/${locale}`}/area-request/${token}`, area: invite.area };
}
