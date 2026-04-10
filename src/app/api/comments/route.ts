import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('article_id');
  if (!articleId) return NextResponse.json([]);

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('blog_comments')
    .select('id, author_name, comment, created_at')
    .eq('article_id', articleId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  return NextResponse.json(data || [], {
    headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { articleId, comment, authorName } = await request.json();
    if (!articleId || !comment) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Input validation
    const cleanComment = (comment || '').slice(0, 2000);
    const cleanName = (authorName || 'Anonymous').slice(0, 100);
    if (cleanComment.length < 2) return NextResponse.json({ error: 'Comment too short' }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase.from('blog_comments').insert({
      article_id: articleId,
      author_name: cleanName,
      comment: cleanComment,
      status: 'pending',
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('activity_logs').insert({
      type: 'user_action', severity: 'info',
      message: 'Blog comment submitted',
      details: { articleId, authorName: cleanName },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
