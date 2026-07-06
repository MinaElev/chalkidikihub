const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 2 },
  });
  const page = await browser.newPage();
  const file = 'file:///' + path.resolve('public/marketing/thank-you-50days-4k-story.html').replace(/\\/g, '/');
  await page.goto(file, { waitUntil: 'networkidle0' });
  // Capture only the .slide element
  const el = await page.$('.slide');
  const out = path.resolve('public/marketing/exports/thank-you-50days-4k-story.png');
  require('fs').mkdirSync(path.dirname(out), { recursive: true });
  await el.screenshot({ path: out, omitBackground: false });
  console.log('OK', out);
  await browser.close();
})();
