import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { adminDb, userDb } from '@/lib/supabase/clients';

/**
 * Every /api route starts with exactly one of these guards. The old codebase
 * relied on the "/admin/" path segment, which protected nothing because the
 * proxy skips /api. Here a route without a guard is a review failure:
 * tests/api-guards.test.ts fails the build if one is missing.
 *
 * Each guard returns either the resolved identity or a ready NextResponse,
 * so a route reads:
 *
 *   const auth = await requireSuperAdmin();
 *   if (auth instanceof NextResponse) return auth;
 */

export type Role = 'owner' | 'admin' | 'superadmin';
export type SessionUser = { userId: string; email: string | null; role: Role };

const deny = (status: 401 | 403, message: string) =>
  NextResponse.json({ error: message }, { status });

/** Signed-in user, or null. Use in Server Components / Server Actions. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const db = await userDb();
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) return null;
  const { data: profile } = await adminDb()
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();
  return {
    userId: data.user.id,
    email: data.user.email ?? null,
    role: (profile?.role as Role) ?? 'owner',
  };
}

export async function requireUser(): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser();
  return user ?? deny(401, 'Sign in required');
}

export async function requireSuperAdmin(): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser();
  if (!user) return deny(401, 'Sign in required');
  if (user.role !== 'superadmin') return deny(403, 'Forbidden');
  return user;
}

/** The caller must own the listing (superadmins may act on any listing). */
export async function requireListingOwner(listingId: string): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser();
  if (!user) return deny(401, 'Sign in required');
  if (user.role === 'superadmin') return user;
  const { data } = await adminDb().from('listings').select('owner_id').eq('id', listingId).single();
  if (!data || data.owner_id !== user.userId) return deny(403, 'Forbidden');
  return user;
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. */
export function requireCron(request: NextRequest): true | NextResponse {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get('authorization') ?? '';
  if (!secret || !safeEqual(header, `Bearer ${secret}`)) return deny(401, 'Unauthorized');
  return true;
}

/** Superadmin session OR cron secret — for jobs that run on a schedule and on demand. */
export async function requireSuperAdminOrCron(
  request: NextRequest,
): Promise<SessionUser | true | NextResponse> {
  if (request.headers.get('authorization')) return requireCron(request);
  return requireSuperAdmin();
}
