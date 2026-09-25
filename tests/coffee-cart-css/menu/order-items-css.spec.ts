import { test, expect } from '@playwright/test';
export const somethingV = null;
test.describe('coffee-menu',() =>{

  test.beforeEach(async ({page})=>{
    await page.goto('https://coffee-cart.app/');
  });

  test("menu should contain items to order", async ({page}) => {
      await expect(page.locator('li:has(.cup-body[aria-label="Espresso"]) h4')).toBeVisible();
      await expect(page.locator('.cup-body[aria-label="Espresso"]')).toBeVisible();
  } )

  test('total should be 0 as default', async ({ page }) => {
    await expect(page.locator('.pay')).toBeVisible();
    await expect(page.locator('.pay')).toContainText('Total: $0.00');
  });

  test('total value should increase by item price on add-to-cart', async ({ page }) => {
    await expect(page.locator('.pay')).toContainText('Total: $0.00')
    await page.locator('.cup-body[aria-label="Espresso"]').click();
    await expect(page.locator('.pay')).toContainText('Total: $10.00');
  });

  test('quick cart should contain all ordered items', async ({ page }) => {
    await page.locator('li:has(.cup-body[aria-label="Espresso Macchiato"]) h4').click();
    await page.locator('.cup-body[aria-label="Espresso"]').click();
    await page.locator("[aria-label='Espresso Macchiato']").click();
    await page.hover('.pay');
    await expect(page.locator('.cart-preview .list-item:has(button[aria-label="Add one Espresso"]) span:first-child')).toBeVisible();
    await expect(page.locator('.cart-preview .list-item:has(button[aria-label="Add one Espresso Macchiato"]) span:first-child')).toBeVisible();
  });

  test('promo coffee should pop when adding 3rd item to cart', async ({ page }) => {
    await page.locator('.cup-body[aria-label="Flat White"]').click();
    await page.locator('.cup-body[aria-label="Flat White"]').click();
    await page.locator('.cup-body[aria-label="Flat White"]').click();
    await expect(page.locator('.promo > span')).toBeVisible();
    await page.locator('.promo button.yes').click();
  });


  test('promo coffee is visible in quick-cart and adds to total', async ({ page }) => {
    await page.locator('.cup-body[aria-label="Cafe Latte"]').click({
      clickCount: 3
    });
    await expect(page.locator('.pay')).toContainText('Total: $48.00');
    await page.locator('.promo button.yes').click();
    await expect(page.locator('.pay')).toContainText('Total: $52.00');
    await page.hover('.pay');
    await expect(page.locator('.cart-preview .list-item:has(button[aria-label="Add one (Discounted) Mocha"]) span:first-child')).toBeVisible();
  });


  //failed test - missing business logic
  test('promo coffee should pop on every 3rd item via quick', async ({ page }) => {
    await page.locator('.cup-body[aria-label="Espresso"]').click();
    await page.hover('.pay');
    await page.locator('.cart-preview button[aria-label="Add one Espresso"]').click();
    await page.locator('.cart-preview button[aria-label="Add one Espresso"]').click();
    await page.locator('.promo button.yes').click();
  });


  test('cart counter increments on adding items to order', async ({page}) =>{
    await expect(page.locator('#app')).toContainText('cart (0)');
    await page.locator('.cup-body[aria-label="Espresso"]').click();
    await page.locator('.cup-body[aria-label="Espresso Macchiato"]').click();
    await page.locator('.cup-body[aria-label="Cappuccino"]').click();
    await expect(page.locator('#app')).toContainText('cart (3)');
    await page.locator('.promo button.yes').click();
    await expect(page.locator('#app')).toContainText('cart (4)');
  });

  //tried to use .env
  test('cart counter set to default after checkout', async ({page}) =>{
    await expect(page.locator('#app')).toContainText('cart (0)');
    await page.locator('.cup-body[aria-label="Espresso"]').click();
    await expect(page.locator('#app')).toContainText('cart (1)');
    await page.locator('.pay').click();
    await page.locator('#name').fill(process.env.customerName!);
    await page.locator('#email').fill(process.env.testEmail!);
    await page.locator('#submit-payment').click();
    await expect(page.locator('.snackbar.success')).toBeVisible();
  });


  // It took time to remember that we MUST use ` instead of ' or "
  // Later would be nice to replace by dynamic value that we push via API call pre-test run.
  test('verify menu is prod-ready', async ({page}) =>{
    var expectedMenuItems = ["Espresso","Espresso Macchiato","Cappuccino",
    "Mocha","Flat White","Americano","Cafe Latte","Espresso Con Panna", "Cafe Breve"]

    for (var item of expectedMenuItems){
    await expect(page.locator(`li:has(.cup-body[aria-label="${item}"]) h4`)).toBeVisible();
    }
  });

  test('checkout should show validation error for empty Name field', async ({ page }) => {
  await page.locator('.pay').click();
  await page.locator('#submit-payment').click();
  await expect(page.locator('#name:invalid')).toBeVisible();
});

  test('checkout should show validation error for empty Email field', async ({ page }) => {
  await page.locator('.pay').click();
  await page.locator('#name').fill(process.env.customerName!);
  await page.locator('#submit-payment').click();
  await expect(page.locator('#email:invalid')).toBeVisible();
});

test('checkout should show validation error for no@ email', async ({ page }) => {
  const invalidEmail = 'noAtEmail.com'

  await page.locator('.pay').click();
  await page.locator('#name').fill(process.env.customerName!);
  await page.locator('#email').fill(invalidEmail)
  await page.locator('#submit-payment').click();
  await expect(page.locator('#email:invalid'))
});


});
