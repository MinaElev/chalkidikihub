'use client';

import { useState } from 'react';
import { Printer, Download } from 'lucide-react';

interface FlyerCopy {
  h1: string; sub: string; scanHere: string;
  benefits: readonly string[];
  domain: string; footer: string;
  printBtn: string; downloadBtn: string; note: string;
}

const COPY: Record<'el' | 'en', FlyerCopy> = {
  el: {
    h1: 'Σάρωσε. Ανακάλυψε.',
    sub: 'Παραλίες, εστιατόρια & δραστηριότητες κοντά σου',
    scanHere: 'Σκάναρε με το κινητό σου',
    benefits: [
      '🏖️ Κοντινές παραλίες με αξιολογήσεις',
      '🍽️ Εστιατόρια & ταβέρνες',
      '🎯 Δραστηριότητες & αξιοθέατα',
      '🌤️ Ο καιρός στην περιοχή σου',
      '🗺️ Άμεση πλοήγηση στον χάρτη',
    ],
    domain: 'chalkidikihub.gr/near',
    footer: 'Λειτουργεί σε 7 γλώσσες — ο επισκέπτης βλέπει αυτόματα τη δική του.',
    printBtn: 'Εκτύπωση',
    downloadBtn: 'Κατέβασε QR (PNG)',
    note: 'Συμβουλή: Ctrl/Cmd + P → Επιλογή "Save as PDF" → A4 (100%)',
  },
  en: {
    h1: 'Scan. Discover.',
    sub: 'Beaches, restaurants & activities near you',
    scanHere: 'Scan with your phone',
    benefits: [
      '🏖️ Nearby beaches with reviews',
      '🍽️ Restaurants & tavernas',
      '🎯 Activities & sights',
      '🌤️ Local weather right now',
      '🗺️ Instant map directions',
    ],
    domain: 'chalkidikihub.gr/near',
    footer: 'Works in 7 languages — every visitor sees their own automatically.',
    printBtn: 'Print',
    downloadBtn: 'Download QR (PNG)',
    note: 'Tip: Ctrl/Cmd + P → choose "Save as PDF" → A4 (100%)',
  },
};

export function FlyerNearClient({ locale }: { locale: string }) {
  const t = COPY[locale as 'el' | 'en'] || COPY.en;
  const [downloading, setDownloading] = useState(false);

  const downloadQr = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/qr?size=1024');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chalkidikihub-near-qr-1024.png';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* Toolbar — visible on screen, hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            {t.printBtn}
          </button>
          <button
            onClick={downloadQr}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {t.downloadBtn}
          </button>
          <span className="text-xs text-gray-500 ml-auto">{t.note}</span>
        </div>
      </div>

      {/* The printable A4 sheet */}
      <div className="flyer-page mx-auto bg-white">
        <div className="h-full flex flex-col p-12 text-center">
          {/* Brand mark */}
          <div className="text-sm font-semibold tracking-widest text-primary-700 uppercase">
            ChalkidikiHub
          </div>

          {/* Headline */}
          <h1 className="mt-10 text-5xl font-extrabold text-gray-900 leading-tight">
            {t.h1}
          </h1>
          <p className="mt-3 text-lg text-gray-600">{t.sub}</p>

          {/* QR — kept large so phone cameras lock fast at >50cm */}
          <div className="my-10 mx-auto flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/qr?size=1024"
              alt="QR code"
              width={400}
              height={400}
              className="border-8 border-white shadow-xl rounded-2xl"
            />
            <div className="mt-4 text-sm font-medium text-gray-700">{t.scanHere}</div>
            <div className="mt-1 text-xs text-gray-500 font-mono">{t.domain}</div>
          </div>

          {/* Benefits */}
          <ul className="mt-2 text-left max-w-md mx-auto space-y-2 text-gray-800">
            {t.benefits.map((b, i) => (
              <li key={i} className="text-base">{b}</li>
            ))}
          </ul>

          {/* Footer */}
          <div className="mt-auto pt-8 text-xs text-gray-500 border-t border-gray-200">
            {t.footer}
          </div>
        </div>
      </div>

      <style>{`
        @page { size: A4; margin: 0; }
        .flyer-page {
          width: 210mm;
          min-height: 297mm;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        @media print {
          .flyer-page {
            box-shadow: none;
            width: 210mm;
            height: 297mm;
            page-break-after: always;
          }
          body { background: white; }
        }
        @media screen {
          body { background: #f3f4f6; padding: 20px 0; }
        }
      `}</style>
    </>
  );
}
