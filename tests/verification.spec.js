import { test, expect } from '@playwright/test';

test('Verify XR bias and New Tab redirects', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForSelector('article', { timeout: 15000 });

  // 1. Verify Trending Topics Bias
  const firstTrend = await page.locator('section button p').first();
  await expect(firstTrend).toHaveText(/#XR/i);
  console.log('First trending topic is #XR: confirmed');

  // 2. Verify Card Redirects
  const firstCardLink = await page.locator('article a').first();
  const targetAttr = await firstCardLink.getAttribute('target');
  const relAttr = await firstCardLink.getAttribute('rel');

  expect(targetAttr).toBe('_blank');
  expect(relAttr).toContain('noopener');
  console.log('Card link target="_blank": confirmed');

  // 3. Verify Metrics increment
  const initialViews = await page.locator('article').first().locator('.material-symbols-outlined:has-text("visibility") + span').innerText();
  console.log(`Initial views: ${initialViews}`);

  // Click the card (this should trigger trackView)
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.locator('article a').first().click(),
  ]);
  await newPage.close();

  // Refresh page or wait for state update
  await page.reload();
  await page.waitForSelector('article');
  const updatedViews = await page.locator('article').first().locator('.material-symbols-outlined:has-text("visibility") + span').innerText();
  console.log(`Updated views: ${updatedViews}`);

  expect(parseInt(updatedViews)).toBe(parseInt(initialViews) + 1);
  console.log('Metrics increment (+1): confirmed');
});
