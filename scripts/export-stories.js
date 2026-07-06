const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const HTML_PATH = path.resolve(__dirname, '..', 'public', 'marketing', 'stories-30.html');
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'marketing', 'exports');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const url = 'file:///' + HTML_PATH.replace(/\\/g, '/');
  console.log('Loading', url);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for fonts + photos
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(imgs.map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
    // Also wait for background-image photos to load
    const bgEls = document.querySelectorAll('[style*="photos/p"]');
    await Promise.all(Array.from(bgEls).map(el => {
      const m = el.getAttribute('style').match(/url\('([^']+)'\)/);
      if (!m) return null;
      return new Promise(r => {
        const i = new Image();
        i.onload = i.onerror = r;
        i.src = m[1];
      });
    }));
  });

  await new Promise(r => setTimeout(r, 1500));

  for (let n = 1; n <= 40; n++) {
    const id = 's' + n;
    const el = await page.$('#' + id);
    if (!el) {
      console.warn('NOT FOUND:', id);
      continue;
    }
    const filename = `chalkidikihub-story-${String(n).padStart(2, '0')}.png`;
    const outPath = path.join(OUT_DIR, filename);
    await el.screenshot({ path: outPath, type: 'png', omitBackground: false });
    const size = (fs.statSync(outPath).size / 1024).toFixed(0);
    console.log(`✓ ${filename} (${size} KB)`);
  }

  await browser.close();
  console.log('\nDone. Exports in:', OUT_DIR);
})().catch(e => { console.error(e); process.exit(1); });
