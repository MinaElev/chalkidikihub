import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

export async function GET() {
  try {
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const supabase = createAdminClient();
    const { data } = await supabase
      .from('sales')
      .select('*, sale_images(id, image_url, is_cover)')
      .order('created_at', { ascending: false })
      .limit(500);

    // Join owner info
    if (data) {
      const ownerIds = [...new Set(data.map((s: any) => s.owner_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, full_name, phone, email, role').in('id', ownerIds);
      const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
      const enriched = data.map((s: any) => ({
        ...s,
        owner: profileMap.get(s.owner_id) || null,
      }));
      return NextResponse.json(enriched);
    }
    return NextResponse.json([]);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id, action } = await request.json();
    const supabase = createAdminClient();

    if (action === 'toggle') {
      const { data: sale } = await supabase.from('sales').select('status').eq('id', id).single();
      if (sale) {
        await supabase.from('sales').update({ status: sale.status === 'published' ? 'draft' : 'published' }).eq('id', id);
      }
    } else if (action === 'delete') {
      await supabase.from('sale_images').delete().eq('sale_id', id);
      await supabase.from('sales').delete().eq('id', id);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
