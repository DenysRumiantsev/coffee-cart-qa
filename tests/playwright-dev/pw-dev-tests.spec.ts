import { test, expect } from '@playwright/test';



test.describe('pw-dev-tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.UrlPwDev!);
    });


    test('verify that pw-dev switches between light and dark styles', async ({ page }) => {

        await expect(page.getByTitle('system mode')).toBeVisible();
        await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCSS(
            "background-color",
            process.env.styleModeLight!);
        await page.getByRole('button', { name: 'Switch between dark and light' }).click();
        await page.getByRole('button', { name: 'Switch between dark and light' }).click();
        await expect(page.getByTitle('dark mode')).toBeVisible();
        await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCSS(
            "background-color",
             process.env.styleModeDark!);

    });
test('verify navigation via option in search', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('button', { name: 'Search (Control+k)' }).click();
  await page.getByRole('searchbox', { name: 'Search' }).fill('test');
  await expect(page.locator('#docsearch-hits_playwright-nodejs_2-item-3')).toContainText('Writing tests');
  await page.getByRole('link', { name: 'Writing tests' }).click();
  await expect(page).toHaveTitle('Writing tests | Playwright');
});

});
