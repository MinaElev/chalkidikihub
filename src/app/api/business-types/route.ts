import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { adminDb, publicDb } from '@/lib/supabase/clients';
import { requireSuperAdmin } from '@/lib/auth/guards';
import { localizedColumns } from '@/lib/i18n/localize';

const WRITABLE = ['slug', 'sort_order', ...localizedColumns('name').split(', ')];
const pickWritable = (b: Record<string, unknown>) => Object.fromEntries(Object.entries(b).filter(([k]) => WRITABLE.includes(k)));

// Guard: GET is public read-only; every write requires a superadmin
// (v3 let anyone insert, edit or delete these rows with the service role).
export async function GET() {
  const { data } = await publicDb().from('business_types').select('*').order('sort_order');
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' } });
}

async function write(request: NextRequest, op: 'insert' | 'update' | 'delete') {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const db = adminDb().from('business_types');
  const { error } =
    op === 'insert' ? await db.insert(pickWritable(body))
    : op === 'update' ? await db.update(pickWritable(body)).eq('id', String(body.id ?? ''))
    : await db.delete().eq('id', String(body.id ?? ''));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateTag('restaurants', 'max');
  return NextResponse.json({ ok: true });
}

export const POST = (r: NextRequest) => write(r, 'insert');
export const PATCH = (r: NextRequest) => write(r, 'update');
export const DELETE = (r: NextRequest) => write(r, 'delete');
