const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '..', 'public', 'marketing', 'exports');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const TARGETS = [
  { html: 'availability-broadcast-story.html',    out: 'broadcast-availability-gr.png' },
  { html: 'availability-broadcast-story-en.html', out: 'broadcast-availability-en.png' },
  { html: 'owner-acquisition-story.html',         out: 'owner-acquisition-gr.png' },
];

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  for (const t of TARGETS) {
    const htmlPath = path.resolve(__dirname, '..', 'public', 'marketing', t.html);
    const url = 'file:///' + htmlPath.replace(/\\/g, '/');
    console.log('Loading', t.html);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(imgs.map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
    });
    await new Promise(r => setTimeout(r, 1000));

    const el = await page.$('#slide-1');
    if (!el) {
      console.warn('NOT FOUND #slide-1 in', t.html);
      continue;
    }
    const outPath = path.join(OUT_DIR, t.out);
    await el.screenshot({ path: outPath, type: 'png', omitBackground: false });
    const size = (fs.statSync(outPath).size / 1024).toFixed(0);
    console.log(`✓ ${t.out} (${size} KB)`);
  }

  await browser.close();
  console.log('\nDone. Exports in:', OUT_DIR);
})().catch(e => { console.error(e); process.exit(1); });
