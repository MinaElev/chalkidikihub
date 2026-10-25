// Builds every site icon from the logo (sun over waves, as in BrandIcon.tsx).
// Run: node scripts/brand/make-icons.mjs
import fs from 'node:fs';
import sharp from 'sharp';

const ART = `
  <circle cx="24" cy="18" r="7" fill="#fbbf24"/>
  <line x1="24" y1="6" x2="24" y2="9" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="10" x2="30.5" y2="12" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  <line x1="36" y1="18" x2="33" y2="18" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="10" x2="17.5" y2="12" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="18" x2="15" y2="18" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 32 Q14 27 20 32 Q26 37 32 32 Q38 27 44 32" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M8 38 Q14 33 20 38 Q26 43 32 38 Q38 33 44 38" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>`;
const BLUE = '#0891B2';

// Rounded tile: browser tabs, Google results, manifest "any".
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="${BLUE}"/>${ART}</svg>`;
// Full-bleed square: iOS and Android mask it themselves. The art is shrunk to
// the maskable safe zone (inner 80%) so no shape cuts the sun off.
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${BLUE}"/><g transform="translate(4.8 4.8) scale(0.8)">${ART}</g></svg>`;
const appleSquare = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${BLUE}"/><g transform="translate(2.4 2.4) scale(0.9)">${ART}</g></svg>`;

const png = (svg, size) => sharp(Buffer.from(svg), { density: 72 * size / 48 * 4 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

fs.writeFileSync('public/icons/icon.svg', rounded);
fs.writeFileSync('public/icons/icon-192.png', await png(rounded, 192));
fs.writeFileSync('public/icons/icon-512.png', await png(rounded, 512));
fs.writeFileSync('public/icons/maskable-512.png', await png(square, 512));
fs.writeFileSync('public/apple-touch-icon.png', await png(appleSquare, 180));

// favicon.ico with 16, 32 and 48 px PNG frames (ICO may hold PNGs since Vista; every browser reads it).
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((s) => png(rounded, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e); header.writeUInt8(s, e + 1); header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(frames[i].length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += frames[i].length;
});
fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ...frames]));
fs.rmSync('public/icons/icon-192.svg', { force: true });
fs.rmSync('public/icons/icon-512.svg', { force: true });
console.log('icons written');
