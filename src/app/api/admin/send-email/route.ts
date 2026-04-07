import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { recipients, subject, body } = await request.json();

    if (!recipients?.length || !subject || !body) {
      return NextResponse.json({ error: 'Missing recipients, subject or body' }, { status: 400 });
    }

    // Get Gmail credentials from DB
    const supabase = getAdminClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);

    const settingsMap: Record<string, string> = {};
    settings?.forEach(s => { settingsMap[s.key] = s.value; });

    const gmailAddress = settingsMap.gmail_address || process.env.GMAIL_ADDRESS;
    const gmailPassword = settingsMap.gmail_app_password || process.env.GMAIL_APP_PASSWORD;

    if (!gmailAddress || !gmailPassword) {
      return NextResponse.json({ error: 'Gmail credentials not configured. Set Gmail Address and App Password in Admin → Settings.' }, { status: 500 });
    }

    // Create Gmail SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailAddress,
        pass: gmailPassword.replace(/\s/g, ''), // Remove spaces from app password
      },
    });

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    // Send individually
    for (const recipient of recipients) {
      try {
        await transporter.sendMail({
          from: `ChalkidikiHub <${gmailAddress}>`,
          to: recipient.email,
          subject,
          html: `<div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333;">${body}</div>`,
        });
        sent++;
      } catch (err) {
        failed++;
        errors.push(`${recipient.email}: ${(err as Error).message}`);
      }

      // Small delay
      if (recipients.length > 5) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    // Log the action
    await supabase.from('activity_logs').insert({
      type: 'admin_action',
      severity: 'info',
      message: `Mass email sent: ${sent} delivered, ${failed} failed`,
      details: { subject, recipientCount: recipients.length, sent, failed, errors: errors.slice(0, 5) },
    });

    return NextResponse.json({ sent, failed, errors: errors.slice(0, 10) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
