const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CAROUSELS_DIR = path.resolve(__dirname, '..', 'public', 'marketing', 'carousels');
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'marketing', 'carousels', 'exports');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Allow filtering by folder name from CLI: `node scripts/export-carousels.js 04`
const filter = process.argv[2];

(async () => {
  const folders = fs.readdirSync(CAROUSELS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'exports')
    .map(d => d.name)
    .filter(name => !filter || name.includes(filter));

  if (folders.length === 0) {
    console.error('No carousel folders found' + (filter ? ` matching "${filter}"` : ''));
    process.exit(1);
  }

  console.log(`Found ${folders.length} carousel(s):\n  - ${folders.join('\n  - ')}\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security', '--allow-file-access-from-files'],
  });

  for (const folder of folders) {
    const htmlPath = path.join(CAROUSELS_DIR, folder, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      console.warn(`SKIP: ${folder} — no index.html`);
      continue;
    }

    console.log(`\n=== ${folder} ===`);
    const page = await browser.newPage();
    // Render at 2x scale for sharper output (still 1080×1350 final size)
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });

    const url = 'file:///' + htmlPath.replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for fonts + images
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;

      // Wait for <img> tags
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(imgs.map(img =>
        img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })
      ));

      // Wait for background-image photos referenced in inline styles
      const bgEls = document.querySelectorAll('[style*="url("]');
      await Promise.all(Array.from(bgEls).map(el => {
        const m = el.getAttribute('style').match(/url\(['"]?([^'")]+)['"]?\)/);
        if (!m) return null;
        return new Promise(r => {
          const i = new Image();
          i.onload = i.onerror = r;
          i.src = m[1];
        });
      }));
    });

    // Extra time for any onload scripts (e.g. QR generator in carousel #04)
    await new Promise(r => setTimeout(r, 2000));

    const slideIds = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.slide')).map(s => s.id)
    );

    const folderOutDir = path.join(OUT_DIR, folder);
    if (!fs.existsSync(folderOutDir)) fs.mkdirSync(folderOutDir, { recursive: true });

    for (const id of slideIds) {
      const el = await page.$('#' + id);
      if (!el) {
        console.warn('NOT FOUND:', id);
        continue;
      }
      const n = parseInt(id.replace('s', ''), 10);
      const filename = `${folder}-${String(n).padStart(2, '0')}.png`;
      const outPath = path.join(folderOutDir, filename);
      await el.screenshot({ path: outPath, type: 'png', omitBackground: false });
      const size = (fs.statSync(outPath).size / 1024).toFixed(0);
      console.log(`  ✓ ${filename} (${size} KB)`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n✅ Done. Exports in: ${OUT_DIR}`);
})().catch(e => { console.error(e); process.exit(1); });
