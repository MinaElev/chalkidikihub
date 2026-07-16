import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';

const VALID_TYPES = ['beach', 'restaurant', 'activity', 'listing'];

export async function POST(request: NextRequest) {
  try {
    const { type, itemId, rating, comment, authorName, website } = await request.json();
    if (!type || !itemId || !rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Honeypot: the hidden `website` field is invisible to humans. If it's
    // filled, a bot submitted the form — return a fake success (so the bot
    // moves on) without persisting anything. Guests can review without login,
    // so this is the first line of defence alongside moderation (status:pending).
    if (typeof website === 'string' && website.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // Input validation
    if (!VALID_TYPES.includes(type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    const cleanComment = (comment || '').slice(0, 2000); // Max 2000 chars
    const cleanName = (authorName || 'Anonymous').slice(0, 100);

    const supabase = createAdminClient();
    const table = type === 'beach' ? 'beach_reviews' : type === 'restaurant' ? 'restaurant_reviews' : type === 'activity' ? 'activity_reviews' : 'listing_reviews';
    const fkField = type === 'beach' ? 'beach_id' : type === 'restaurant' ? 'restaurant_id' : type === 'activity' ? 'activity_id' : 'listing_id';

    const { error } = await supabase.from(table).insert({
      [fkField]: itemId,
      author_name: cleanName,
      rating: numRating,
      comment_el: cleanComment,
      status: 'pending',
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('activity_logs').insert({
      type: 'user_action', severity: 'info',
      message: `Review submitted (${type})`,
      details: { type, itemId, rating: numRating, authorName: cleanName },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
