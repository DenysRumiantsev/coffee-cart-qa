import { test, expect } from '@playwright/test';

test.describe('coffee-menu',() =>{

  test.beforeEach(async ({page})=>{
    await page.goto('https://coffee-cart.app/');
  });

  test("menu should contain items to order", async ({page}) => {
      await expect(page.getByRole('heading', { name: 'Espresso $' })).toBeVisible();
      await expect(page.locator('[data-test="Espresso"]')).toBeVisible();
  } )

  test('total should be 0 as default', async ({ page }) => {
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00');
  });

  test('total value should increase by item price on add-to-cart', async ({ page }) => {
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $0.00')
    await page.locator('[data-test="Espresso"]').click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
  });

  test('quick cart should contain all ordered items', async ({ page }) => {
    await page.getByRole('heading', { name: 'Espresso Macchiato $' }).click();
    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.hover('[data-test="checkout"]');
    await expect(page.getByText('Espresso', { exact: true })).toBeVisible();
    await expect(page.getByText('Espresso Macchiato', { exact: true })).toBeVisible();
  });

  test('promo coffee should pop when adding 3rd item to cart', async ({ page }) => {
    await page.locator('[data-test="Flat_White"]').click();
    await page.locator('[data-test="Flat_White"]').click();
    await page.locator('[data-test="Flat_White"]').click();
    await expect(page.getByText('It\'s your lucky day! Get an')).toBeVisible();
    await page.getByRole('button', { name: 'Yes, of course!' }).click();
  }); 


  test('promo coffee is visible in quick-cart and adds to total', async ({ page }) => {
    await page.locator('[data-test="Cafe_Latte"]').click({
      clickCount: 3
    });
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $48.00');
    await page.getByRole('button', { name: 'Yes, of course!' }).click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $52.00');
    await page.hover('[data-test="checkout"]');
    await expect(page.getByText('(Discounted) Mocha')).toBeVisible();
  });


  //failed test - missing business logic
  test('promo coffee should pop on every 3rd item via quick', async ({ page }) => {
    await page.locator('[data-test="Espresso"]').click();
    await page.hover('[data-test="checkout"]');
    await page.getByRole('button', { name: 'Add one Espresso' }).click();
    await page.getByRole('button', { name: 'Add one Espresso' }).click();
    await page.getByRole('button', { name: 'Yes, of course!' }).click();
  });


  test('cart counter increments on adding items to order', async ({page}) =>{
    await expect(page.locator('#app')).toContainText('cart (0)');
    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.locator('[data-test="Cappuccino"]').click();
    await expect(page.locator('#app')).toContainText('cart (3)');
    await page.getByRole('button', { name: 'Yes, of course!' }).click();
    await expect(page.locator('#app')).toContainText('cart (4)');
  });

  //tried to use .env
  test('cart counter set to default after checkout', async ({page}) =>{
    await expect(page.locator('#app')).toContainText('cart (0)');
    await page.locator('[data-test="Espresso"]').click();
    await expect(page.locator('#app')).toContainText('cart (1)');
    await page.locator('[data-test="checkout"]').click();
    await page.getByRole('textbox', { name: 'Name'}).fill(process.env.customerName!);
    await page.getByRole('textbox', { name: 'Email' }).fill(process.env.testEmail!);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('button', { name: 'Thanks for your purchase. Please check your email for payment.' })).toBeVisible();

  });


  // It took time to remember that we MUST use ` instead of ' or " 
  // Later would be nice to replace by dynamic value that we push via API call pre-test run.
  test('verify menu is prod-ready', async ({page}) =>{
    var expectedMenuItems = ["Espresso","Espresso Macchiato","Cappuccino",
    "Mocha","Flat White","Americano","Cafe Latte","Espresso Con Panna", "Cafe Breve"]

    for (var item of expectedMenuItems){
    await expect(page.getByRole('heading', { name: `${item} $` })).toBeVisible();
    }
  });



  test('checkout should show validation error for empty Name field', async ({ page }) => {
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText("Please fill out this field."))
});

  test('checkout should show validation error for empty Email field', async ({ page }) => {
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name'}).fill(process.env.customerName!);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText("Please fill out this field."))
});

test('checkout should show validation error for no@ email', async ({ page }) => {
  const invalidEmail = 'noAtEmail.com'

  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name'}).fill(process.env.customerName!);
  await page.getByRole('textbox', { name: 'Email'}).fill(invalidEmail)
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText(`Please include an '@' in the email address. ${invalidEmail} is missing '@'`))
});


});
