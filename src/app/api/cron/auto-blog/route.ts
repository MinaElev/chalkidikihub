import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify cron secret from Vercel
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Trigger auto-blog generation
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
