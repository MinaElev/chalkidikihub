const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const HTML = path.resolve(__dirname, '..', 'public', 'marketing', 'carousel-broadcast-availability.html');
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
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });

  const url = 'file:///' + HTML.replace(/\\/g, '/');
  console.log('Loading', url);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await new Promise(r => setTimeout(r, 1000));

  for (let n = 1; n <= 6; n++) {
    const id = 's' + n;
    const el = await page.$('#' + id);
    if (!el) { console.warn('NOT FOUND', id); continue; }
    const filename = `broadcast-carousel-${String(n).padStart(2, '0')}.png`;
    const outPath = path.join(OUT_DIR, filename);
    await el.screenshot({ path: outPath, type: 'png', omitBackground: false });
    const size = (fs.statSync(outPath).size / 1024).toFixed(0);
    console.log(`✓ ${filename} (${size} KB)`);
  }

  await browser.close();
  console.log('\nDone. Exports in:', OUT_DIR);
})().catch(e => { console.error(e); process.exit(1); });
