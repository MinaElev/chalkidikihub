import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';

const VALID_TYPES = ['user_action', 'admin_action', 'system', 'error'];
const VALID_SEVERITIES = ['info', 'warning', 'error'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, severity, message, details } = body;

    if (!type || !message) {
      return NextResponse.json({ error: 'Missing type or message' }, { status: 400 });
    }

    // Validate enums + length
    const cleanType = VALID_TYPES.includes(type) ? type : 'system';
    const cleanSeverity = VALID_SEVERITIES.includes(severity) ? severity : 'info';
    const cleanMessage = (message || '').slice(0, 500);

    const supabase = createApiClient();
    await supabase.from('activity_logs').insert({
      type: cleanType,
      severity: cleanSeverity,
      message: cleanMessage,
      details: details || {},
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = createApiClient();
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type');
  const severity = searchParams.get('severity');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 50;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('activity_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) query = query.eq('type', type);
  if (severity) query = query.eq('severity', severity);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ logs: data || [], total: count || 0, page, limit });
}
