import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/admin-auth';
import { verifyMail } from '@/lib/email/mailer';

/**
 * GET /api/admin/email-check — can this server log in to the mail provider?
 * Sends nothing. Useful after moving hosts: some shared hosts block outgoing
 * connections to Gmail, which shows up here as a timeout or connection error.
 */
export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json(await verifyMail(), { headers: { 'Cache-Control': 'no-store' } });
}
