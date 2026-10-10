import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from './api-helpers';
import { requireSuperAdmin } from './admin-auth';

/**
 * Guards for API routes that were reachable without authentication (the
 * proxy skips /api, so an "/admin/" path segment protected nothing).
 */

/** Token for server-to-server calls (checkout → notify-paid, webhook → notify-refund). */
export function internalKey(): string {
  return createHash('sha256').update(`internal:${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''}`).digest('hex');
}

export const internalHeaders = () => ({ 'Content-Type': 'application/json', 'x-internal-key': internalKey() });

export function isInternal(request: NextRequest): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) && request.headers.get('x-internal-key') === internalKey();
}

/** Internal server call, or a signed-in superadmin. */
export async function requireInternalOrSuperAdmin(request: NextRequest): Promise<true | NextResponse> {
  if (isInternal(request)) return true;
  const auth = await requireSuperAdmin();
  return auth instanceof NextResponse ? auth : true;
}

/** Vercel cron bearer, or a signed-in superadmin. */
export async function requireCronOrSuperAdmin(request: NextRequest): Promise<true | NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true;
  const auth = await requireSuperAdmin();
  return auth instanceof NextResponse ? auth : true;
}

/** Signed-in owner of `ownerId` (superadmins pass), or an internal server call. */
export async function requireOwnerOrInternal(request: NextRequest, ownerId: string | null | undefined): Promise<true | NextResponse> {
  if (isInternal(request)) return true;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (ownerId && user.id === ownerId) return true;
  const { data: profile } = await createAdminClient().from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role === 'superadmin') return true;
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
