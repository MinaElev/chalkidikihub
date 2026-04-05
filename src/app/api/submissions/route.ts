import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createApiClient } from '@/lib/api-helpers';

// Admin-level client for approve actions
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: list submissions (public - filtered by RLS)
export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const userId = searchParams.get('user_id');

  let query = supabase.from('user_submissions').select('*').order('created_at', { ascending: false });

  if (userId) query = query.eq('user_id', userId);
  if (status) query = query.eq('status', status);
  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Join user names
  if (data && data.length > 0) {
    const userIds = [...new Set(data.map((s) => s.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);

    const profileMap = new Map(profiles?.map((p: { id: string; full_name: string }) => [p.id, p.full_name]) || []);
    return NextResponse.json(data.map((s) => ({
      ...s,
      user_name: profileMap.get(s.user_id) || 'Unknown',
    })));
  }

  return NextResponse.json(data || []);
}

// PATCH: approve/reject/delete (admin only - uses service role)
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, action, admin_notes, user_id } = body;

  // For delete action from user (just needs user_id match)
  if (action === 'delete') {
    const supabase = createAdminClient();
    const { data: submission } = await supabase
      .from('user_submissions')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Verify ownership if user_id provided
    if (user_id && submission.user_id !== user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase.from('user_submissions').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (!id || !action) {
    return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (action === 'approve') {
    const { data: submission } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let insertError = null;

    if (submission.type === 'restaurant') {
      const slug = (submission.title_el || 'restaurant').toLowerCase()
        .replace(/[^a-zα-ωά-ώ0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
      const extra = (submission.extra_data || {}) as Record<string, unknown>;
      const { error } = await supabase.from('restaurants').insert({
        slug,
        name_el: submission.title_el,
        name_en: submission.title_en || submission.title_el,
        description_el: submission.description_el,
        description_en: submission.description_en || submission.description_el,
        area: submission.area,
        location_name: submission.location_name,
        latitude: submission.latitude,
        longitude: submission.longitude,
        image_url: submission.image_url,
        cuisine: extra.cuisine ? [extra.cuisine] : ['traditional'],
        price_level: extra.price_level || 'moderate',
        rating: 0,
        reviews_count: 0,
        phone: (extra.phone as string) || '',
        hours: (extra.hours as string) || '',
        has_sea_view: false,
        has_live_music: false,
        accepts_reservations: false,
        tags: extra.tags ? (extra.tags as string).split(',').map((t: string) => t.trim()) : [],
      });
      insertError = error;
    } else if (submission.type === 'activity') {
      const slug = (submission.title_el || 'activity').toLowerCase()
        .replace(/[^a-zα-ωά-ώ0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
      const extra = (submission.extra_data || {}) as Record<string, unknown>;
      const { error } = await supabase.from('activities').insert({
        slug,
        name_el: submission.title_el,
        name_en: submission.title_en || submission.title_el,
        description_el: submission.description_el,
        description_en: submission.description_en || submission.description_el,
        area: submission.area,
        location_name: submission.location_name,
        latitude: submission.latitude,
        longitude: submission.longitude,
        image_url: submission.image_url,
        category: submission.category || 'nature',
        price_range: (extra.price_range as string) || '',
        duration: (extra.duration as string) || '',
        rating: 0,
        reviews_count: 0,
        tags: extra.tags ? (extra.tags as string).split(',').map((t: string) => t.trim()) : [],
      });
      insertError = error;
    } else if (submission.type === 'blog') {
      const slug = (submission.title_el || 'article').toLowerCase()
        .replace(/[^a-zα-ωά-ώ0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
      const extra = (submission.extra_data || {}) as Record<string, unknown>;
      const { error } = await supabase.from('blog_articles').insert({
        slug,
        title_el: submission.title_el,
        title_en: submission.title_en || submission.title_el,
        excerpt_el: submission.description_el?.slice(0, 200) || '',
        excerpt_en: submission.description_en?.slice(0, 200) || submission.description_el?.slice(0, 200) || '',
        content_el: submission.description_el,
        content_en: submission.description_en || submission.description_el,
        category: submission.category || 'guides',
        image_url: submission.image_url,
        author: 'Community',
        read_time_min: Math.max(3, Math.ceil((submission.description_el?.length || 500) / 1000)),
        tags: extra.tags ? (extra.tags as string).split(',').map((t: string) => t.trim()) : [],
        related_area_slugs: submission.area ? [submission.area] : [],
        published_at: new Date().toISOString(),
      });
      insertError = error;
    }

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    await supabase
      .from('user_submissions')
      .update({ status: 'approved', admin_notes: admin_notes || null, updated_at: new Date().toISOString() })
      .eq('id', id);

    return NextResponse.json({ success: true });
  }

  if (action === 'reject') {
    const { error } = await supabase
      .from('user_submissions')
      .update({ status: 'rejected', admin_notes: admin_notes || '', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
