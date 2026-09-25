import { test, expect } from '@playwright/test';

test.describe('cart-suit', async ()=>{
    test.beforeEach(async ({page})=>{
    await page.goto(process.env.urlCoffee!);
  });

  test('should have empty card text', async ({ page }) => {
    await page.locator("[aria-label='Cart page']").click();
    await expect(page.locator('.list > p')).toBeVisible();
});

  test('total in cart shows correct amount for multiple items', async ({ page }) => {
    await page.locator('[aria-label="Espresso"]').click({clickCount: 2}); 
    await page.locator("[aria-label='Cart page']").click();
    await expect(page.locator('[aria-label="Proceed to checkout"]')).toContainText('Total: $20.00');
  });

//okay it was.. something. I wish for POM and helper classes. I know that this test is using MAGIC values but it was not the goal to make it reusable or adaptive.
//like, I can extract original item price from here of from menu, cross-check and validate on fly.
test('cart should recalculate new amount for item-line when increase quantity', async ({ page }) => {

var cartRaw = await page.locator('.list-item')
    .filter({ hasText: 'Espresso Macchiato' });   

  await page.locator('[aria-label="Espresso Macchiato"]').click();
  await page.locator("[aria-label='Cart page']").click();
  await expect(page.locator('#app')).toContainText('$12.00 x 1');
  await page.locator("div > div > [aria-label='Add one Espresso Macchiato']").click();
  
  await expect(page.getByText('Espresso Macchiato$12.00 x 2')).toBeVisible();
  await expect(page.locator("[aria-label='Proceed to checkout']")).toHaveText('Total: $24.00')
});

});







