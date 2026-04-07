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
    const body = await request.json();
    const { name, email, phone, checkin, checkout, guests, message, listing_slug, listing_title } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Save to contact_messages
    await supabase.from('contact_messages').insert({
      name,
      email,
      subject: `Αίτημα διαθεσιμότητας: ${listing_title}`,
      message: `Κατάλυμα: ${listing_title} (${listing_slug})
Check-in: ${checkin || '-'}
Check-out: ${checkout || '-'}
Άτομα: ${guests || '-'}
Τηλέφωνο: ${phone || '-'}

${message || ''}`,
      locale: 'el',
    });

    // Try to send email to listing owner
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['gmail_address', 'gmail_app_password']);

    const settingsMap: Record<string, string> = {};
    settings?.forEach(s => { settingsMap[s.key] = s.value; });

    const gmailAddress = settingsMap.gmail_address;
    const gmailPassword = settingsMap.gmail_app_password;

    // Get listing owner email
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('slug', listing_slug)
      .single();

    if (listing && gmailAddress && gmailPassword) {
      const { data: owner } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', listing.owner_id)
        .single();

      if (owner?.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailAddress, pass: gmailPassword.replace(/\s/g, '') },
        });

        await transporter.sendMail({
          from: `ChalkidikiHub <${gmailAddress}>`,
          to: owner.email,
          subject: `Νέο αίτημα διαθεσιμότητας: ${listing_title}`,
          html: `
            <div style="font-family: system-ui; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #0284c7;">Νέο αίτημα διαθεσιμότητας</h2>
              <p><strong>Κατάλυμα:</strong> ${listing_title}</p>
              <hr style="border: none; border-top: 1px solid #eee;">
              <p><strong>Όνομα:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Τηλέφωνο:</strong> ${phone}</p>` : ''}
              ${checkin ? `<p><strong>Check-in:</strong> ${checkin}</p>` : ''}
              ${checkout ? `<p><strong>Check-out:</strong> ${checkout}</p>` : ''}
              ${guests ? `<p><strong>Άτομα:</strong> ${guests}</p>` : ''}
              ${message ? `<p><strong>Μήνυμα:</strong> ${message}</p>` : ''}
              <hr style="border: none; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">ChalkidikiHub - chalkidikihub.gr</p>
            </div>
          `,
        }).catch(() => {});
      }
    }

    // Log
    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: 'info',
      message: `Inquiry submitted for ${listing_title}`,
      details: { listing_slug, name, email, checkin, checkout, guests },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
