import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { runInspectBatch, MAX_DAILY } from '@/lib/gsc-inspect';
import { requireCronOrSuperAdmin } from '@/lib/route-guards';

// POST /api/admin/gsc/inspect?trigger=manual&limit=N&seed=1
//
// Runs one URL-Inspection batch (see src/lib/gsc-inspect.ts). There is NO API
// for the aggregate "Page indexing" report, so this reconstructs it one URL at
// a time and refreshes the gsc_coverage aggregate.

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const __auth = await requireCronOrSuperAdmin(req); if (__auth instanceof NextResponse) return __auth;
  const supabase = createAdminClient();
  const params = new URL(req.url).searchParams;
  const trigger = params.get('trigger') === 'cron' ? 'cron' : 'manual';
  const limit = Math.min(MAX_DAILY, Math.max(1, Number(params.get('limit')) || (trigger === 'cron' ? 1000 : 150)));
  const seed = params.get('seed') === '1' || trigger === 'cron';

  try {
    const result = await runInspectBatch(supabase, { trigger, limit, seed });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
