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
    const pending: Array<Record<string, unknown>> = [];

    // Beach reviews
    const { data: beachR } = await supabase.from('beach_reviews').select('*, beaches(name_el)').eq('status', 'pending');
    (beachR || []).forEach((r: any) => pending.push({
      id: r.id, table: 'beach_reviews', type: 'beach',
      author_name: r.author_name, rating: r.rating,
      comment: r.comment_el || '', item_name: r.beaches?.name_el || '',
      created_at: r.created_at,
    }));

    // Restaurant reviews
    const { data: restR } = await supabase.from('restaurant_reviews').select('*, restaurants(name_el)').eq('status', 'pending');
    (restR || []).forEach((r: any) => pending.push({
      id: r.id, table: 'restaurant_reviews', type: 'restaurant',
      author_name: r.author_name, rating: r.rating,
      comment: r.comment_el || '', item_name: r.restaurants?.name_el || '',
      created_at: r.created_at,
    }));

    // Activity reviews
    const { data: actR } = await supabase.from('activity_reviews').select('*, activities(name_el)').eq('status', 'pending');
    (actR || []).forEach((r: any) => pending.push({
      id: r.id, table: 'activity_reviews', type: 'activity',
      author_name: r.author_name, rating: r.rating,
      comment: r.comment_el || '', item_name: r.activities?.name_el || '',
      created_at: r.created_at,
    }));

    // Blog comments
    const { data: blogC } = await supabase.from('blog_comments').select('*, blog_articles(title_el)').eq('status', 'pending');
    (blogC || []).forEach((c: any) => pending.push({
      id: c.id, table: 'blog_comments', type: 'comment',
      author_name: c.author_name,
      comment: c.comment || '', item_name: c.blog_articles?.title_el || '',
      created_at: c.created_at,
    }));

    pending.sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());
    return NextResponse.json(pending);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, table, action } = await request.json();
    if (!id || !table || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const supabase = getAdminClient();
    await supabase.from(table).update({ status: action }).eq('id', id);

    // Recalculate rating if approved review
    if (action === 'approved' && table !== 'blog_comments') {
      const fkField = table === 'beach_reviews' ? 'beach_id' : table === 'restaurant_reviews' ? 'restaurant_id' : 'activity_id';
      const parentTable = table === 'beach_reviews' ? 'beaches' : table === 'restaurant_reviews' ? 'restaurants' : 'activities';

      const { data: review } = await supabase.from(table).select(fkField).eq('id', id).single();
      if (review) {
        const parentId = (review as any)[fkField];
        const { data: allReviews } = await supabase.from(table).select('rating').eq(fkField, parentId).eq('status', 'approved');
        if (allReviews && allReviews.length > 0) {
          const avg = allReviews.reduce((s, r) => s + (r.rating || 0), 0) / allReviews.length;
          await supabase.from(parentTable).update({
            rating: Math.round(avg * 10) / 10,
            reviews_count: allReviews.length,
          }).eq('id', parentId);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
