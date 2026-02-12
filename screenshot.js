const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('https://weeklymind.vercel.app', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: '/tmp/weeklymind-screenshot.png', fullPage: false });
  await browser.close();
  console.log('Screenshot saved');
})();
