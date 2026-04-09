import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  try {
    const supabase = getAdminClient();
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
    const { id, action } = await request.json();
    const supabase = getAdminClient();

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
