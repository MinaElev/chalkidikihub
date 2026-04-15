'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Download, Printer, QrCode, Loader2, ExternalLink } from 'lucide-react';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export default function QRCodePage() {
  const { id } = useParams<{ id: string }>();
  const locale = useLocale();
  const [listing, setListing] = useState<{ slug: string; title_el: string; title_en: string; location_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('listings').select('slug, title_el, title_en, location_name').eq('id', id).single();
      if (data) setListing(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const guestUrl = listing ? localeUrl(locale, `guest/${listing.slug}`) : '';

  const handleDownload = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `qr-${listing?.slug || 'guest'}.png`;
    a.href = url;
    a.click();
  }, [listing]);

  const handlePrint = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>QR Code - ${listing?.title_el || 'Guest Guide'}</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:system-ui;}
      img{width:300px;height:300px;}h1{font-size:18px;margin-top:20px;}p{color:#666;font-size:14px;}</style></head>
      <body><img src="${dataUrl}" /><h1>${listing?.title_el || ''}</h1><p>Scan for your Guest Guide</p><p style="font-size:11px;color:#999">chalkidikihub.gr</p></body></html>
    `);
    win.document.close();
    win.onload = () => { win.print(); };
  }, [listing]);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  if (!listing) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Listing not found</p>
      <Link href="/dashboard/listings" className="text-primary-600 hover:underline mt-2 inline-block">Back to listings</Link>
    </div>
  );

  const title = listing.title_el || listing.title_en;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/listings" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Guest Guide</h1>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* QR Preview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center" ref={qrRef}>
          <div className="inline-flex p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <QRCodeCanvas
              value={guestUrl}
              size={250}
              level="H"
              includeMargin
              imageSettings={{
                src: '/icons/icon-192.png',
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mt-4">{title}</h2>
          <p className="text-sm text-gray-500">{listing.location_name}</p>
          <p className="text-xs text-gray-400 mt-1">Scan for your Guest Guide</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
            <Download className="w-5 h-5" />
            Download PNG
          </button>
          <button onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors">
            <Printer className="w-5 h-5" />
            Print
          </button>
        </div>

        {/* Preview link */}
        <a href={guestUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors text-sm">
          <ExternalLink className="w-4 h-4" />
          Preview Guest Page
        </a>

        {/* Instructions */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Οδηγίες</h3>
          </div>
          <ol className="space-y-2 text-sm text-amber-700">
            <li className="flex gap-2"><span className="font-bold">1.</span> Κατεβάστε ή τυπώστε το QR code</li>
            <li className="flex gap-2"><span className="font-bold">2.</span> Τοποθετήστε το στο δωμάτιο ή στη reception</li>
            <li className="flex gap-2"><span className="font-bold">3.</span> Ο πελάτης σκανάρει και βλέπει παραλίες, εστιατόρια, δραστηριότητες κοντά</li>
            <li className="flex gap-2"><span className="font-bold">4.</span> Δουλεύει σε όλες τις γλώσσες αυτόματα!</li>
          </ol>
        </div>

        {/* URL info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Guest page URL:</p>
          <p className="text-xs text-gray-700 font-mono break-all">{guestUrl}</p>
        </div>
      </div>
    </div>
  );
}
