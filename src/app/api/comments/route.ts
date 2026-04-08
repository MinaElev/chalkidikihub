import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('article_id');
  if (!articleId) return NextResponse.json([]);

  const supabase = getAdminClient();
  const { data } = await supabase
    .from('blog_comments')
    .select('id, author_name, comment, created_at')
    .eq('article_id', articleId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  try {
    const { articleId, comment, authorName } = await request.json();
    if (!articleId || !comment) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const supabase = getAdminClient();
    const { error } = await supabase.from('blog_comments').insert({
      article_id: articleId,
      author_name: authorName || 'Anonymous',
      comment,
      status: 'pending',
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('activity_logs').insert({
      type: 'user_action', severity: 'info',
      message: 'Blog comment submitted',
      details: { articleId, authorName },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
