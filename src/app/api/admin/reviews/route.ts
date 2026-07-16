import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';

export async function GET() {
  try {
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const supabase = createAdminClient();
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

    // Listing reviews
    const { data: listR } = await supabase.from('listing_reviews').select('*, listings(title_el)').eq('status', 'pending');
    (listR || []).forEach((r: any) => pending.push({
      id: r.id, table: 'listing_reviews', type: 'listing',
      author_name: r.author_name, rating: r.rating,
      comment: r.comment_el || '', item_name: r.listings?.title_el || '',
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
    const auth = await requireSuperAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id, table, action } = await request.json();
    if (!id || !table || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const supabase = createAdminClient();
    await supabase.from(table).update({ status: action }).eq('id', id);

    // Recalculate rating if approved review
    if (action === 'approved' && table !== 'blog_comments') {
      const fkField = table === 'beach_reviews' ? 'beach_id' : table === 'restaurant_reviews' ? 'restaurant_id' : table === 'activity_reviews' ? 'activity_id' : 'listing_id';
      const parentTable = table === 'beach_reviews' ? 'beaches' : table === 'restaurant_reviews' ? 'restaurants' : table === 'activity_reviews' ? 'activities' : 'listings';

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

        // Bust the ISR/data caches so the approved review (and the updated
        // aggregate rating in the JSON-LD) shows up without waiting out the
        // 10h data TTL / 30d ISR window on detail pages.
        const { data: parent } = await supabase.from(parentTable).select('slug').eq('id', parentId).single();
        if (parent?.slug) {
          const basePath = parentTable === 'listings' ? 'listings' : parentTable;
          revalidateTag(parentTable, 'default');
          for (const locale of ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr']) {
            revalidatePath(`/${locale}/${basePath}/${parent.slug}`);
            if (parentTable === 'listings') revalidatePath(`/${locale}/stay/${parent.slug}`);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
