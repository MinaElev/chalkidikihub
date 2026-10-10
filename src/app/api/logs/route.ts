import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/supabase/clients';
import { allowRequest } from '@/lib/rate-limit';
import { requireSuperAdmin } from '@/lib/auth/guards';

const TYPES = ['user_action', 'admin_action', 'system', 'error'];
const SEVERITIES = ['info', 'warning', 'error'];

/** POST: client-side event logging. Guard: per-IP rate limit, closed enums, size caps. */
export async function POST(request: NextRequest) {
  if (!(await allowRequest(request, 'logs', 60, 10))) return NextResponse.json({ ok: true });
  const body = await request.json().catch(() => null);
  if (!body?.message) return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  const details = JSON.stringify(body.details ?? {});
  await adminDb().from('activity_logs').insert({
    type: TYPES.includes(body.type) ? body.type : 'system',
    severity: SEVERITIES.includes(body.severity) ? body.severity : 'info',
    message: String(body.message).slice(0, 500),
    details: details.length <= 2000 ? JSON.parse(details) : {},
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

/** GET: admin log viewer. v3 served this to anyone. */
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  const sp = request.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get('page')) || 1);
  let q = adminDb().from('activity_logs').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range((page - 1) * 50, page * 50 - 1);
  if (sp.get('type')) q = q.eq('type', sp.get('type')!);
  if (sp.get('severity')) q = q.eq('severity', sp.get('severity')!);
  const { data, count, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs: data ?? [], total: count ?? 0, page, limit: 50 });
}
