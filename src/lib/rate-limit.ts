import 'server-only';
import { createHash } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { adminDb } from '@/lib/supabase/clients';

/**
 * Database-backed rate limiting for public endpoints (forms, AI). Serverless
 * instances don't share memory, so counts live in `ai_request_log` (ip,
 * endpoint, created_at — already indexed for exactly this lookup). IPs are
 * stored hashed.
 */

export function clientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return fwd || request.headers.get('x-real-ip') || 'unknown';
}

const hashIp = (ip: string) =>
  createHash('sha256').update(`${ip}:${process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-12) ?? ''}`).digest('hex').slice(0, 32);

/** Returns true when the caller is still under `max` hits in `windowMinutes`; records the hit. */
export async function allowRequest(
  request: NextRequest,
  endpoint: string,
  max: number,
  windowMinutes: number,
): Promise<boolean> {
  const db = adminDb();
  const ip = hashIp(clientIp(request));
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  const { count, error } = await db
    .from('ai_request_log')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('endpoint', endpoint)
    .gte('created_at', since);
  if (error) return true; // fail open: a broken limiter must not break the form
  if ((count ?? 0) >= max) return false;
  await db.from('ai_request_log').insert({ ip, endpoint });
  return true;
}
