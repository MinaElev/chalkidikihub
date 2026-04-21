/**
 * Generates QR code PNGs for sticker/print use.
 * Targets chalkidikihub.gr with UTM tags for sticker-traffic tracking.
 *
 * Run: node scripts/generate-qr.js
 */
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const url = 'https://chalkidikihub.gr/?utm_source=sticker&utm_medium=qr&utm_campaign=chalkidiki_stickers';
const outDir = path.join(__dirname, '..', 'public', 'marketing');
fs.mkdirSync(outDir, { recursive: true });

const variants = [
  {
    file: 'qr-navy-on-white.png',
    desc: 'Dark navy QR on white — for light-colored stickers',
    opts: {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 1200,
      margin: 2,
      color: { dark: '#0c4a6eff', light: '#ffffffff' },
    },
  },
  {
    file: 'qr-white-on-navy.png',
    desc: 'White QR on navy — for dark-colored stickers',
    opts: {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 1200,
      margin: 2,
      color: { dark: '#ffffffff', light: '#0c4a6eff' },
    },
  },
  {
    file: 'qr-black-on-white.png',
    desc: 'Pure black on white — max contrast / print-safe',
    opts: {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 1200,
      margin: 2,
      color: { dark: '#000000ff', light: '#ffffffff' },
    },
  },
];

(async () => {
  console.log(`Encoding URL: ${url}\n`);
  for (const v of variants) {
    const out = path.join(outDir, v.file);
    await QRCode.toFile(out, url, v.opts);
    const size = (fs.statSync(out).size / 1024).toFixed(1);
    console.log(`✓ ${v.file}  (${size} KB) — ${v.desc}`);
  }
  console.log(`\nDone. Files saved to: ${outDir}`);
})().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
