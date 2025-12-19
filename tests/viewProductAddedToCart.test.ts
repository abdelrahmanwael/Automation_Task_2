import { expect, test } from '@playwright/test';
import { Login } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';

test('View Product Added To Cart', async ({ page, context }) => {
    const loginPage = new Login(page, context);
    const inventoryPage = new InventoryPage(page, context);
    const cartPage = new CartPage(page, context);

    await test.step('Navigate to application', async () => {
        expect(await loginPage.navigateToURL()).toBeTruthy();
    });

    await test.step('Perform login', async () => {
        expect(await loginPage.login()).toBeTruthy();
    });

    await test.step('Add first item to cart', async () => {
        expect(await inventoryPage.addFirstItemToCart()).toBeTruthy();
    });

    await test.step('Navigate to cart', async () => {
        await inventoryPage.navigateToCart();
    });

    await test.step('Review products added to cart', async () => {
        expect(await cartPage.reviewProductsAddedToCart()).toBeTruthy();
    });

    await test.step('Logout', async () => {
        expect(await loginPage.logout()).toBeTruthy();
    });
});