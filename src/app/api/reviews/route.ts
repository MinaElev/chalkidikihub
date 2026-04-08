import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { type, itemId, rating, comment, authorName } = await request.json();
    if (!type || !itemId || !rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const supabase = getAdminClient();
    const table = type === 'beach' ? 'beach_reviews' : type === 'restaurant' ? 'restaurant_reviews' : 'activity_reviews';
    const fkField = type === 'beach' ? 'beach_id' : type === 'restaurant' ? 'restaurant_id' : 'activity_id';

    const { error } = await supabase.from(table).insert({
      [fkField]: itemId,
      author_name: authorName || 'Anonymous',
      rating: Number(rating),
      comment_el: comment || '',
      status: 'pending',
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('activity_logs').insert({
      type: 'user_action', severity: 'info',
      message: `Review submitted (${type})`,
      details: { type, itemId, rating, authorName },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
