import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limit store (resets on server restart — good enough for Vercel serverless)
const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function POST(request: NextRequest) {
  const ip = getIP(request);
  const now = Date.now();

  const record = attempts.get(ip);

  if (record) {
    // Reset if window expired
    if (now > record.resetAt) {
      attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
      return NextResponse.json({ ok: true });
    }

    // Check limit
    if (record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Πολλές προσπάθειες εγγραφής. Δοκιμάστε ξανά σε 1 ώρα.' },
        { status: 429 }
      );
    }

    // Increment
    record.count++;
    return NextResponse.json({ ok: true });
  }

  // First attempt
  attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  return NextResponse.json({ ok: true });
}
