const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  await page.waitForSelector('article', { timeout: 30000 });
  await page.screenshot({ path: '/home/jules/verification/advanced_feed_final.png', fullPage: true });
  await browser.close();
})();
