import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slugs = searchParams.get('slugs')?.split(',').filter(Boolean) || [];
    if (slugs.length === 0) return NextResponse.json([]);

    const supabase = createAdminClient();

    // Fetch inquiries that mention these slugs in the message
    const { data: msgs } = await supabase
      .from('contact_messages')
      .select('id, name, email, subject, message, created_at')
      .like('subject', 'Αίτημα διαθεσιμότητας%')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!msgs) return NextResponse.json([]);

    // Filter to only those matching the owner's listing slugs
    const filtered = msgs.filter(m =>
      slugs.some(slug => m.message?.includes(slug))
    );

    return NextResponse.json(filtered.slice(0, 20), {
      headers: { 'Cache-Control': 'private, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, checkin, checkout, guests, message, listing_slug, listing_title } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
    }

    // Validate + sanitize inputs
    const cleanName = escapeHtml((name || '').slice(0, 200));
    const cleanEmail = (email || '').slice(0, 200).replace(/[\n\r]/g, ''); // prevent header injection
    const cleanPhone = escapeHtml((phone || '').slice(0, 30));
    const cleanMessage = escapeHtml((message || '').slice(0, 2000));
    const cleanTitle = escapeHtml((listing_title || '').slice(0, 300));
    const cleanSlug = (listing_slug || '').slice(0, 200).replace(/[^a-z0-9-]/g, '');

    const supabase = createAdminClient();

    // Save to contact_messages
    await supabase.from('contact_messages').insert({
      name: cleanName,
      email: cleanEmail,
      subject: `Αίτημα διαθεσιμότητας: ${cleanTitle}`,
      message: `Κατάλυμα: ${cleanTitle} (${cleanSlug})
Check-in: ${checkin || '-'}
Check-out: ${checkout || '-'}
Άτομα: ${guests || '-'}
Τηλέφωνο: ${cleanPhone}

${cleanMessage}`,
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
