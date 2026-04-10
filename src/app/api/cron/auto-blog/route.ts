import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  // Verify cron secret from Vercel
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // Check auto-blog settings
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['autoblog_enabled', 'autoblog_frequency_hours', 'autoblog_hour_utc']);

    const settings: Record<string, string> = {};
    (settingsData || []).forEach((s: { key: string; value: string }) => { settings[s.key] = s.value; });

    // Check if enabled (default: true if not set)
    const enabled = settings.autoblog_enabled !== 'false';
    if (!enabled) {
      return NextResponse.json({ skipped: true, reason: 'Auto-blog disabled in settings' });
    }

    // Check frequency — was the last article created too recently?
    const frequencyHours = parseInt(settings.autoblog_frequency_hours || '24');
    const { data: lastArticle } = await supabase
      .from('blog_articles')
      .select('created_at')
      .eq('author', 'ChalkidikiHub AI')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastArticle) {
      const hoursSinceLast = (Date.now() - new Date(lastArticle.created_at).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLast < frequencyHours) {
        return NextResponse.json({ skipped: true, reason: `Too soon (${Math.round(hoursSinceLast)}h since last, need ${frequencyHours}h)` });
      }
    }

    // All checks passed — trigger generation
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
    const res = await fetch(`${baseUrl}/api/admin/auto-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': cronSecret,
      },
    });

    const data = await res.json();
    return NextResponse.json({ triggered: true, result: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
