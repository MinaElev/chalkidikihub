import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/supabase/clients';
import { allowRequest } from '@/lib/rate-limit';
import { loadAreaInvite } from '@/lib/area-invite';
import { createAreaRequest, hashIp, requestIp } from '@/lib/availability/create-request';

export const maxDuration = 60;

/**
 * POST /api/area-request/[token] — the guest's one click on "ask the whole
 * area": turns their listing request (whose owner said no or didn't answer)
 * into a mass availability request for that area.
 * Guard: public by the HMAC-signed token, which names one listing request;
 * every detail is reloaded from that row, only a missing phone may be given.
 * Same rate limits as the request form, plus per-IP limit; a repeat click
 * returns the request already sent. GET does nothing (mail scanners open links).
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await loadAreaInvite(token);
  if (!invite) return NextResponse.json({ error: 'not-found' }, { status: 404 });
  if (invite.past) return NextResponse.json({ error: 'past' }, { status: 410 });
  if (invite.existing) return NextResponse.json({ ok: true, public_token: invite.existing, already: true });

  if (!(await allowRequest(request, 'area-request', 5, 60))) {
    return NextResponse.json({ error: 'too-many' }, { status: 429 });
  }

  let phone = invite.phone;
  if (!phone) {
    const body = await request.json().catch(() => ({})) as { phone?: unknown };
    const p = typeof body.phone === 'string' ? body.phone.trim().slice(0, 30) : '';
    const digits = p.replace(/\D/g, '').length;
    if (digits < 6 || digits > 18) return NextResponse.json({ error: 'phone' }, { status: 400 });
    phone = p;
  }

  const result = await createAreaRequest(
    adminDb(),
    {
      guest_name: invite.name,
      guest_email: invite.email,
      guest_phone: phone,
      area: invite.area,
      check_in: invite.checkIn,
      check_out: invite.checkOut,
      adults: invite.guests,
      children: 0,
      budget_min: null,
      budget_max: null,
      property_type: null,
      notes: null,
      locale: invite.locale,
    },
    hashIp(requestIp(request.headers)),
  );
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true, public_token: result.public_token, recipients: result.recipients_count });
}
