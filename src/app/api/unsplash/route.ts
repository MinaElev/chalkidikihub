import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'halkidiki beach';

    // Get Unsplash key from DB
    const supabase = getAdminClient();
    const { data: setting } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'unsplash_access_key')
      .single();

    const accessKey = setting?.value || process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json({ error: 'Unsplash API key not configured. Set it in Admin → Settings.' }, { status: 500 });
    }

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
      { headers: { 'Authorization': `Client-ID ${accessKey}` } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: `Unsplash error: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();

    const photos = (data.results || []).map((photo: Record<string, unknown>) => ({
      id: photo.id,
      url: (photo.urls as Record<string, string>)?.regular || '',
      thumb: (photo.urls as Record<string, string>)?.small || '',
      alt: (photo.alt_description as string) || '',
      credit: (photo.user as Record<string, unknown>)?.name || '',
      creditLink: (photo.user as Record<string, unknown>)?.links
        ? ((photo.user as Record<string, unknown>).links as Record<string, string>)?.html || ''
        : '',
      downloadLink: (photo.links as Record<string, string>)?.download_location || '',
    }));

    return NextResponse.json(photos);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST: download photo and save to Supabase storage
export async function POST(request: NextRequest) {
  try {
    const { photoUrl, downloadLink, folder, slug } = await request.json();

    if (!photoUrl) return NextResponse.json({ error: 'Missing photoUrl' }, { status: 400 });

    // Get Unsplash key for download tracking
    const supabase = getAdminClient();
    const { data: setting } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'unsplash_access_key')
      .single();
    const accessKey = setting?.value || process.env.UNSPLASH_ACCESS_KEY;

    // Track download (Unsplash requirement)
    if (downloadLink && accessKey) {
      fetch(downloadLink, { headers: { 'Authorization': `Client-ID ${accessKey}` } }).catch(() => {});
    }

    // Download the image
    const imageRes = await fetch(photoUrl);
    if (!imageRes.ok) return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
    const imageBlob = await imageRes.blob();

    // Upload to Supabase storage
    const path = `${folder || 'photos'}/${slug || Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('content-images')
      .upload(path, imageBlob, { contentType: 'image/jpeg', upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage.from('content-images').getPublicUrl(path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
