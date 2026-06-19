/**
 * GET /api/qr?url=<encoded>&size=<px>
 *
 * Returns a PNG QR code for the given URL.
 *   size: 128..2048, default 512
 *
 * Marketing helper — printers/flyers can hit the endpoint directly and
 * grab a high-res PNG. No auth: the data encoded is just a URL we expose
 * publicly anyway.
 */
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url') || `${SITE_URL}/near`;
  const size = Math.max(128, Math.min(2048, Number(searchParams.get('size') || 512)));

  try {
    // Only allow our own origin so the endpoint isn't a free QR-as-a-service.
    const parsed = new URL(target);
    const allowedHost = new URL(SITE_URL).host;
    if (parsed.host !== allowedHost) {
      return NextResponse.json({ error: 'target must be on ' + allowedHost }, { status: 400 });
    }

    const buf = await QRCode.toBuffer(target, {
      type: 'png',
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    });

    return new NextResponse(buf as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
        'Content-Disposition': `inline; filename="qr-${size}.png"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
