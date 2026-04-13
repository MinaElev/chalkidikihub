import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';

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

  return NextResponse.json((data || []).map(transformSale), {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}

function transformSale(row: Record<string, unknown>) {
  const images = (row.sale_images as Array<Record<string, unknown>> || []).map(i => ({
    id: i.id, sale_id: i.sale_id, image_url: i.image_url, sort_order: i.sort_order, is_cover: i.is_cover,
  }));
  return {
    id: row.id, slug: row.slug, owner_id: row.owner_id,
    property_type: row.property_type,
    title: toLocaleMap(row, 'title'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    price: row.price, currency: row.currency || 'EUR',
    size_sqm: row.size_sqm, bedrooms: row.bedrooms, bathrooms: row.bathrooms,
    floor: row.floor, year_built: row.year_built, energy_class: row.energy_class,
    features: row.features || [],
    status: row.status, images,
    contact_phone: row.contact_phone || '', contact_email: row.contact_email || '',
    created_at: row.created_at, updated_at: row.updated_at,
  };
}
