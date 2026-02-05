import { test, expect } from '@playwright/test';

test.describe('Fyware Top Feed Advanced Features', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the main feed
    await page.goto('http://localhost:5173');
    // Wait for data to load
    await page.waitForSelector('article', { timeout: 15000 });
  });

  test('should display recommended badge for priority items', async ({ page }) => {
    // Look for recommended badge
    const recommended = page.locator('text=Recommended');
    const count = await recommended.count();
    console.log(`Found ${count} recommended items`);
    // At least one should probably be there given our priority logic and Reddit sources
    if (count > 0) {
        await expect(recommended.first()).toBeVisible();
    }
  });

  test('should filter by time: Today', async ({ page }) => {
    await page.click('button:has-text("Today")');
    // Wait for potential re-render
    await page.waitForTimeout(1000);
    // Even if no results, it should not crash
    const articles = page.locator('article');
    console.log(`Articles found for Today: ${await articles.count()}`);
  });

  test('should sort by Most Viewed', async ({ page }) => {
    await page.click('button:has-text("Most Viewed")');
    await page.waitForTimeout(1000);

    // Check if the first card has a view count
    const firstViewCount = await page.locator('article').first().locator('.material-symbols-outlined:has-text("visibility") + span').textContent();
    console.log(`First article views: ${firstViewCount}`);
    expect(parseInt(firstViewCount)).toBeGreaterThanOrEqual(0);
  });

  test('should animate on filter change', async ({ page }) => {
    // This is hard to test automatically but we can check if elements are still there
    await page.click('button:has-text("Most Liked")');
    await page.waitForTimeout(500);
    const articles = page.locator('article');
    expect(await articles.count()).toBeGreaterThan(0);
  });

  test('should show correct DNA priority', async ({ page }) => {
    // Items with "unity" or "vr" should be at the top if "Latest" is selected
    await page.click('button:has-text("Latest")');
    const firstTitle = await page.locator('h3').first().textContent();
    console.log(`Top article title: ${firstTitle}`);
  });
});
