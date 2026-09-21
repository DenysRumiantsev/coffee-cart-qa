import { test, expect } from '@playwright/test';

test.describe('cart-suit', async ()=>{
    test.beforeEach(async ({page})=>{
    await page.goto(process.env.urlCoffee!);
  });

  test('should have empty card text', async ({ page }) => {
  await page.getByRole('link', { name: 'Cart page' }).click();
  await expect(page.getByText('No coffee, go add some.')).toBeVisible();
});



  test('total in cart shows correct amount for multiple items', async ({ page }) => {
    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[data-test="Espresso"]').click();
    await page.getByRole('link', { name: 'Cart page' }).click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $20.00');
  });

//okay it was.. something. I wish for POM and helper classes. I know that this test is using MAGIC values but it was not the goal to make it reusable or adaptive.
//like, I can extract original item price from here of from menu, cross-check and validate on fly.
test('cart should recalculate new amount for item-line when increase quantity', async ({ page }) => {

var cartRaw = await page.getByRole('listitem')
    .filter({ hasText: 'Espresso Macchiato' }); 
var totalCell = cartRaw.locator('> div').nth(2);

  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await expect(page.locator('#app')).toContainText('$12.00 x 1');
  await page.getByRole('button', { name: 'Add one Espresso Macchiato' }).click();
  
  await expect(page.getByText('Espresso Macchiato$12.00 x 2')).toBeVisible();
  await expect(totalCell).toHaveText('$24.00')

});


});







