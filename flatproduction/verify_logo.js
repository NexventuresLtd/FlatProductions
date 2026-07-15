const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const headerLogoSrc = await page.locator('header img, nav img').first().getAttribute('src').catch(()=>null);
  console.log('Header logo src:', headerLogoSrc);

  const resp1 = await page.request.get('http://localhost:5173/logo.jpg');
  console.log('GET /logo.jpg status:', resp1.status(), resp1.headers()['content-type']);

  await page.locator('footer').scrollIntoViewIfNeeded();
  const footerLogoSrc = await page.locator('footer img').first().getAttribute('src').catch(()=>null);
  console.log('Footer logo src:', footerLogoSrc);

  await browser.close();
})();
