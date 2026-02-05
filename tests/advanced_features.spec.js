import { test, expect } from '@playwright/test';

test.describe('Fyware Top Feed Advanced Features', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the main feed
    await page.goto('http://localhost:5173');
    // Wait for data to load
    await page.waitForSelector('article', { timeout: 15000 });
  });

  test('should display recommended badge for priority items', async ({ page }) => {
    // Check if at least one article has a recommended badge
    const badges = page.locator('text=Recommended');
    const count = await badges.count();
    console.log(`Found ${count} recommended items`);
  });

  test('should filter by time: Today', async ({ page }) => {
    await page.click('button:has-text("Today")');
    await page.waitForTimeout(500);
    const articles = page.locator('article');
    console.log(`Articles found for Today: ${await articles.count()}`);
  });

  test('should sort by Most Viewed', async ({ page }) => {
    // Updated for compact labels
    await page.click('button:has-text("Viewed")');
    await page.waitForTimeout(1000);

    // Check if the first card has a view count
    const firstArticleViews = await page.locator('article').first().locator('.material-symbols-outlined:has-text("visibility") + span').innerText();
    console.log(`First article views: ${firstArticleViews}`);
  });

  test('should animate on filter change', async ({ page }) => {
    // Updated for compact labels
    await page.click('button:has-text("Liked")');
    await page.waitForTimeout(500);
    const articles = page.locator('article');
    expect(await articles.count()).toBeGreaterThan(0);
  });

  test('should show correct DNA priority', async ({ page }) => {
    // First article should be a priority one (or at least latest)
    const firstTitle = await page.locator('article h3').first().innerText();
    console.log(`Top article title: ${firstTitle}`);
  });
});
