import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { transformSale, toSaleCard } from '@/lib/data';
import type { Sale } from '@/types';

export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');
  const limit = searchParams.get('limit');

  if (slug) {
    const { data } = await supabase.from('sales').select('*, sale_images(*)').eq('slug', slug).single();
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(transformSale(data), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  let query = supabase.from('sales').select('*, sale_images(*)').eq('status', 'published').order('created_at', { ascending: false });
  if (area) query = query.eq('area', area);
  if (type) query = query.eq('property_type', type);
  if (limit) query = query.limit(Number(limit));
  const { data } = await query;

  let sales = (data || []).map(transformSale) as unknown as Sale[];
  // ?fields=card → card-grid consumers skip the multilingual descriptions.
  if (searchParams.get('fields') === 'card') sales = sales.map(toSaleCard);
  return NextResponse.json(sales, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
