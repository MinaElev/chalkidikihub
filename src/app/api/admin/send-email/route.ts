import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
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

    // Get Resend API key from DB (using service role to bypass RLS)
    const supabase = getAdminClient();
    const { data: setting } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'resend_api_key')
      .single();

    const apiKey = setting?.value || process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Resend API key not configured. Set it in Admin → Settings.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    // Send individually for privacy
    for (const recipient of recipients) {
      try {
        await resend.emails.send({
          from: 'ChalkidikiHub <onboarding@resend.dev>',
          to: recipient.email,
          subject,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #0284c7;">
                <h2 style="color: #0284c7; margin: 0;">ChalkidikiHub</h2>
              </div>
              <div style="padding: 24px 0; line-height: 1.6; color: #333;">
                ${body}
              </div>
              <div style="border-top: 1px solid #eee; padding-top: 16px; text-align: center; color: #999; font-size: 12px;">
                <p>ChalkidikiHub - chalkidikihub.gr</p>
              </div>
            </div>
          `,
        });
        sent++;
      } catch (err) {
        failed++;
        const errMsg = (err as Error).message || JSON.stringify(err);
        errors.push(`${recipient.email}: ${errMsg}`);
      }

      // Small delay to avoid rate limiting
      if (recipients.length > 10) {
        await new Promise(r => setTimeout(r, 100));
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
